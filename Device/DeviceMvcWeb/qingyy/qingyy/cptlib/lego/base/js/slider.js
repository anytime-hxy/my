;
(function(_zepto) {

    if (_zepto.fn.slider) {
        console.log('slider already install');
        return;
    }
    _zepto.extend(_zepto.fn, {

        slider: function(config) {

            if (!this) return;

            var win = window,
                doc = win.document,
                supportTouch = 'ontouchstart' in win,
                support3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

            //是否支持触摸
            var START = supportTouch ? 'touchstart' : 'mousedown',
                MOVE = supportTouch ? 'touchmove' : 'mousemove',
                END = supportTouch ? 'touchend' : 'mouseup';

            //初始化配置
            var init_conf = {
                'auto-play': false,
                'time': 2000, //ms
                'animate-time': 400, //ms
                'btn': false,
                'bgcolor': 'lgm-common-themeColorBg', //'lgm-slider-point-sel',
                'notice': 'point', // 'point' or 'rectangle'
                'cptname': 'slide',
                'scale': '1.7777777',
            };
            var DEFAULT_SCALE = 320 / 160;
            var getPos = supportTouch ? function(event) {
                return event.changedTouches[0];
            } : function(event) {
                return event;
            }
            var makeTranslate = support3d ? function(x) {
                return 'translate3d(' + x + 'px, 0, 0)';
            } : function(x) {
                return 'translate(' + x + 'px, 0)';
            }
            for (var _conf in init_conf) {
                init_conf[_conf] = config[_conf] || init_conf[_conf];
            }
            // 预览时添加不同的参数
            var url_search = '';
            if(location.search.search(/preview=1/) != -1){
                token_match = location.search.match(/(\?|&)token=([a-zA-Z0-9\-\*]+)(&)?/);
                if(token_match && token_match[2]){
                    url_search = '&token=' + token_match[2] + '&preview=1'; 
                }
            }
            console.log(url_search);

            //图片右下角显示当前index
            if (config['notice'] != 'point') init_conf['notice'] = 'rectangle';
            if (config['scale']) {
                init_conf['scale'] = config['scale'];
                DEFAULT_SCALE = init_conf['scale'];
            }
            if (!window.BDslider_instance) {
                window.BDslider_instance = [];
            }

            //初始化、操作插件
            $(this).each(function(index, item) {
                init(_zepto(item));
            });

            function init($slider_root) {
                // 定义变量包括dom节点
                var $slider_block = $slider_root.children().eq(0);
                var $slider_wrap = $slider_root.parent();
                // 定义了插件的宽度
                var slide_clientWidth = $slider_root.width() == 0 ? 324 : $slider_root.parent().get(0).clientWidth;

                var height_fixed = $slider_root.data('height') == 'fixed' ? 1 : 0;
                if ($slider_wrap.prev().prev().hasClass('lgm-slider-wraps')) {
                    $slider_wrap.css('margin-top', 6);
                }
                var inter_count = 1;
                var inner_interval; // for setInterval
                var interval_flag = false; // for judge interval 
                var touch_flag = false;
                var loaded_count = 0;

                var slide = {}; // new instance 
                slide.belt = $slider_block.get(0);
                slide.$belt = $slider_block.eq(0);
                slide.title_flag = false;
                slide.data_img = [];
                slide.data_title = [];
                slide.background_image = [];
                var display_style_flag = false;
                var small_flag = false;

                var cptid = $slider_root.data('cptid');
                var currentslider_obj = window.sliderAll[cptid];
                slide.img_count = currentslider_obj.length;
                slide.currentslider_obj = currentslider_obj;
                if (slide.img_count < 2) init_conf['bgcolor'] = "";
                $slider_root.addClass('lgm-slider-ecom');
                if (slide.img_count > 6) {
                    $slider_root.addClass('lgm-slider-gt6');
                } else {
                    $slider_root.addClass('lgm-slider-lt6');
                }

                var $slider_block_child = $slider_block.children(),
                    $slider_block_child_child = $slider_block_child.children();
                slide.currentIndex = 0;

                if (!height_fixed)
                    $slider_block.css('height', slide_clientWidth / DEFAULT_SCALE);

                if (!slide.belt) return;



                // 窗口大小改变刷新dom
                slide.refresh = function(index, first_flag) {
                    slide.setDisplay(true);
                    slide.changePoint(slide.currentIndex);
                };

                // touchstart事件
                slide.touchStart = function(e) {
                    var target = _zepto(e.target).closest('.lgm-slider-block');
                    if (!target.length || slide.img_count < 2) return;

                    target.addClass('moving');
                    slide.belt.style.webkitTransitionDuration = 'none';

                    slide.browserScrolling = false; //浏览器上下滚动
                    slide.slideReady = false; //判断是否可以进行slide操作
                    slide.shortDistance = false;

                    var event = getPos(e);
                    slide.startPageX = event.pageX;
                    slide.startPageY = event.pageY;
                    // slide.startTime = +new Date();

                    slide.basePageX = slide.startPageX; //滑动的起始点
                    slide.startBasePageX = slide.basePageX;
                    slide.dir = 0; // -1表示向前、1表示向后
                    slide.move_flag = true;
                };

                // touchmove事件
                slide.touchMove = function(e) {
                    if (!slide.move_flag) return;
                    if (slide.browserScrolling) return;

                    var event = getPos(e),
                        pageX = event.pageX,
                        pageY = event.pageY,
                        distX,
                        newX,
                        deltaX,
                        deltaY;

                    if (slide.slideReady) {
                        e.preventDefault();
                        e.stopPropagation();

                        distX = pageX - slide.basePageX;
                        newX = slide.currentX + distX;;
                        // slide.distance = distX;

                        slide.setX(newX);
                        slide.dir = distX > 0 ? -1 : 1;
                    } else {
                        deltaX = Math.abs(pageX - slide.startPageX);
                        deltaY = Math.abs(pageY - slide.startPageY);

                        if (deltaX > 5) {
                            e.preventDefault();
                            e.stopPropagation();
                            slide.slideReady = true;
                        } else if (deltaY > 5) {
                            slide.browserScrolling = true; //此时为上下滑动
                        }
                    }

                    slide.deltaX = Math.abs(pageX - slide.startPageX);
                    slide.distance = pageX - slide.startBasePageX;
                    slide.diffX = slide.deltaX;
                    slide.basePageX = pageX;
                };

                //touchend事件
                slide.touchEnd = function(e) {

                    slide.$belt.css({
                        '-webkit-transition': 'all 0.2s',
                        'transition-duration': 'all 0.2s'
                    });

                    // 如果滑动不超过20，就返回
                    // var duration = +new Date() - slide.startTime;
                    if (slide.diffX < slide_clientWidth / 3 || slide.distance * slide.dir > 0) {
                        slide.shortDistance = true;
                        slide.setX(0);
                        slide.move_flag = false;
                        slide.$belt.removeClass('moving');
                        slide.deltaX = 0;
                        setTimeout(function() {
                            slide.$belt.css({
                                '-webkit-transition': 'none',
                                'transition': 'none'
                            });
                        }, 200)
                        return;
                    }
                    if (slide.startTime) {
                        var duration = +new Date() - slide.startTime;
                        if (duration < 400) {
                            console.log('sfdf');
                            return;
                        }
                    }


                    slide.startTime = +new Date();

                    slide.$belt.removeClass('moving');
                    slide.move_flag = false;

                    if (!slide.deltaX) return;
                    slide.deltaX = 0;

                    if (slide.browserScrolling) return;

                    slide.sliderDir = -slide.distance;
                    // var newIndex = slide.dir > 0 ? Math.ceil(slide.sliderDir) : Math.floor(slide.sliderDir);

                    // 判断方向后对当前index进行操作
                    if (slide.sliderDir > 0) {
                        slide.currentIndex++;
                    } else if (slide.sliderDir < 0) {
                        slide.currentIndex--;
                    }

                    slide.touchEvent = true;
                    slide.resetIndex(slide.currentIndex);
                    slide.goTo(slide.currentIndex); // 跳转到当前index页面
                };

                slide.changeDom = function(e) {
                    if (slide.shortDistance) return;
                    var $create_dom = height_fixed ? $('<div class="lgm-slider-item lgm-slider-imgicon2 lego-cover2-slide-item"><a  href="javascript: void 0;" class="lgm-slider-img" ></a></div>') : $('<div class="lgm-slider-item lgm-slider-imgicon2 "> <a  href="javascript: void 0;" class="lgm-slider-img" > </a> </div>');
                    if (slide.sliderDir < 0) {
                        $slider_block.prepend($create_dom);
                        $newItem = $slider_block.children().eq(0);
                        $slider_block.children().eq(0).css('width', slide.width);
                    } else if (slide.sliderDir > 0) {
                        $create_dom.appendTo($slider_block);
                        $newItem = $slider_block.children().eq(3);
                        $slider_block.children().eq(3).css('width', slide.width);
                    }
                    if(init_conf['cptname'] != 'cover5'){
                        $newItem.children().eq(0).html('<div class="lgm-slider-span"><span class="lgm-slider-title">' + (init_conf['cptname'] == 'cover2' || init_conf['cptname'] == 'cover4' ? slide.currentslider_obj[slide.currentIndex].title : slide.currentslider_obj[slide.currentIndex].img_name) + '</span></div>');
                        $('<span class="lgm-slider-img-index"><span class="lgm-slider-cur-index">' + slide.currentIndex + '</span>/' + slide.img_count + '</span>').appendTo($($newItem.children()[0]).find('.lgm-slider-span'));
                    }
                    if (slide.sliderDir > 0) {
                        slide.setAttr((slide.currentIndex + 1 > slide.img_count - 1) ? 0 : slide.currentIndex + 1, $newItem.children().eq(0));
                        $slider_block.children().eq(0).remove();
                    } else if (slide.sliderDir < 0) {
                        slide.setAttr((slide.currentIndex - 1 < 0) ? slide.img_count - 1 : slide.currentIndex - 1, $newItem.children().eq(0));
                        $slider_block.children().eq(3).remove();
                    }

                    slide.$belt.css({
                        '-webkit-transition': 'none',
                        'transition-duration': 'none'
                    });
                    var $user_agent = navigator.userAgent;
                    if ($user_agent.indexOf('UCBrowser') > -1 && height_fixed) {
                        setTimeout(function() {
                            slide.setX(0);
                        }, 50)
                    } else {
                        slide.setX(0);
                    }
                    slide.changePoint(slide.currentIndex); // 改变point
                }

                // 当前index的重置
                slide.resetIndex = function(index) {
                    if (index > slide.img_count - 1) {
                        slide.currentIndex = 0;
                    } else if (index < 0) {
                        slide.currentIndex = slide.img_count - 1
                    }
                };

                // 滑动动画
                slide.setX = function(x) {
                    slide.currentX = x;
                    slide.belt.style.webkitTransform = makeTranslate(x);
                };

                // 设置dom属性
                slide.setAttr = function(index, $item) {
                    $item.attr('data-img', slide.data_img[index]);
                    $item.attr('data-title', slide.data_title[index]);
                    $item.css('background-image', slide.background_image[index]);

                    if(init_conf['cptname'] != 'cover5'){
                        if (!(slide.currentslider_obj[index].img_link || slide.currentslider_obj[index].link)) {
                            $item.attr('href', 'javascript: void 0');
                        } else if (slide.currentslider_obj[index].img_link_from && slide.currentslider_obj[index].img_link_from != 'outer') {
                            $item.attr('href', '?pageId=' + slide.currentslider_obj[index].img_link + url_search);
                        } else if (slide.currentslider_obj[index].type== 'inner'){
                            $item.attr('href', '?pageId=' + slide.currentslider_obj[index].link + url_search);
                        } else if ((slide.currentslider_obj[index].img_link_from || slide.currentslider_obj[index].type) == 'outer') {
                            $item.attr('href', slide.currentslider_obj[index].img_link || slide.currentslider_obj[index].link);
                            if (init_conf['cptname'] != 'cover4') {
                                $item.attr('target', '_blank');
                            }
                        } else {
                            $item.attr('href', slide.currentslider_obj[index].img_link || slide.currentslider_obj[index].link);
                        }
                        $item.children().children()[0].innerHTML = slide.data_title[index];
                        $item.children().children()[1].children[0].innerHTML = index;
                    }                   
                }

                // 改变图片右下角point
                slide.changePoint = function(index) { // change color of the point
                    var $points = $slider_root.find('.lgm-slider-' + init_conf['notice']);
                    $points.children().each(function(_index_, item) {
                        if (index == _index_) {
                            _zepto(item).addClass(init_conf['bgcolor']);
                        } else
                            _zepto(item).removeClass(init_conf['bgcolor']);
                    });
                };

                // 跳转到当前index页面函数
                slide.goTo = function(index, first_flag) {
                    // 滑动动画
                    if (slide.sliderDir < 0) {
                        slide.setX(slide_clientWidth);
                    } else if (slide.sliderDir > 0) {
                        slide.setX(-slide_clientWidth);
                    }

                    //自动播放时候可以滑动
                    if (config['times'] != '0' && !slide.touchEvent) {
                        slide.shortDistance = false;
                        slide.$belt.css({
                            '-webkit-transition': 'all 0.2s',
                            'transition': 'all 0.2s'
                        });
                        slide.setX(-slide_clientWidth);
                        slide.sliderDir = 1;
                    }
                };

                // 自动播放
                slide.addInterval = function() {
                    if (!config['times'] || config['times'] == '0') return;
                    interval_flag = true;
                    inner_interval = setInterval(function() {
                        slide.sliderDir = 1;
                        slide.touchEvent = false;
                        slide.resetIndex(++slide.currentIndex);
                        slide.goTo(slide.currentIndex);
                    }, config['times'] * 1000);
                };
                // 设置窗口
                slide.setDisplay = function(is_force) {

                    if (display_style_flag && !is_force) return;
                    slide.width = filterWidth($slider_root.parent().width());

                    $slider_block.css('width', slide.width * 3);
                    $slider_block.css('margin-left', -slide.width);
                    $slider_block_child.css('width', slide.width);

                    var tmp_height = slide.width / DEFAULT_SCALE;
                    if (!height_fixed) {
                        slide.$belt.css('height', tmp_height);
                        slide.$belt.parent().css('height', tmp_height);
                    }
                    if (true || init_conf['cptname'] == 'pic') resetIframe();

                    display_style_flag = true;
                }
                if(init_conf['cptname'] != 'cover5'){
                    $slider_block_child_child.each(function(index, item) {
                        slide.resetIndex(index);
                        if (slide.currentslider_obj[slide.currentIndex].is_default) {
                            $(item).parent().addClass('lgm-slider-default');
                        }

                        if (slide.currentslider_obj[slide.currentIndex].up_from) {
                            $(item).parent().addClass('lgm-slider-' + slide.currentslider_obj[slide.currentIndex].up_from);
                        }

                        $(item).html('<div class="lgm-slider-span"><span class="lgm-slider-title">' + (init_conf['cptname'] == 'cover2' || init_conf['cptname'] == 'cover4' ? slide.currentslider_obj[slide.currentIndex].title : slide.currentslider_obj[slide.currentIndex].img_name) + '</span></div>');
                        $('<span class="lgm-slider-img-index"><span class="lgm-slider-cur-index">' + slide.currentIndex + '</span>/' + slide.img_count + '</span>').appendTo($(item).find('.lgm-slider-span'));
                    })
                }
                

                $(slide.currentslider_obj).each(function(index, item) {
                    slide.data_img[index] = init_conf['cptname'] == 'cover2' || init_conf['cptname'] == 'cover4' || init_conf['cptname'] == 'cover5' ? slide.currentslider_obj[index].up_img : slide.currentslider_obj[index].img_timg_src;
                    slide.data_title[index] = init_conf['cptname'] == 'cover2' || init_conf['cptname'] == 'cover4' || init_conf['cptname'] == 'cover5' ? slide.currentslider_obj[index].title : slide.currentslider_obj[index].img_name;
                    slide.background_image[index] = 'url(' + (init_conf['cptname'] == 'cover2' || init_conf['cptname'] == 'cover4' || init_conf['cptname'] == 'cover5' ? slide.currentslider_obj[index].up_img : slide.currentslider_obj[index].img_timg_src) + ')';
                })
                slide.setAttr(slide.currentIndex, $($slider_block_child_child[1]));
                slide.setAttr((slide.currentIndex - 1 < 0) ? slide.img_count - 1 : slide.currentIndex - 1, $($slider_block_child_child[0]));
                slide.setAttr((slide.currentIndex + 1 > slide.img_count - 1) ? 0 : slide.currentIndex + 1, $($slider_block_child_child[2]));
                slide.setDisplay(); //设置显示窗口

                slide.title_flag = true;
                if (!slide.title_flag) {
                    $slider_root.addClass('lgm-slider-notitle');
                    slide.title_flag = false;
                }

                // point 的配置
                init_conf['notice'] = 'point';
                var point_len = slide.img_count,
                    point_html = '<div class="lgm-slider-' + init_conf['notice'] + '"><b class="' + init_conf['bgcolor'] + '"></b>';
                for (var ii = 1; ii < point_len; ii++) {
                    point_html += '<b></b>';
                }
                point_html += '</div>';
                if ((point_len <= 20 && point_len > 1 && init_conf['notice'] == 'rectangle') ||
                    (point_len <= 20 && point_len > 1 && init_conf['notice'] == 'point')) {
                    $slider_root.append(point_html);
                }
                slide.currentX = 0;

                $slider_block.on(START, slide.touchStart, false);
                $slider_block.on(MOVE, slide.touchMove, false);
                $slider_block.on(END, slide.touchEnd, false);
                $slider_block.on('webkitTransitionEnd', slide.changeDom, false);

                slide.addInterval();
                window.BDslider_instance.push(slide);
            }

            // 配置窗口宽度
            function filterWidth(width) {
                var tmp_width = width;
                if (!width || width == 0 || parseInt(width) == 316) {
                    tmp_width = 324;
                }
                return tmp_width;
            }

            //onresize 事件
            window.onresize = function() {
                _zepto.each(window.BDslider_instance, function(index, item) {
                    if (item.refresh) item.refresh(0);
                });
            }

            function resetIframe() {
                var url = window.location.search;
                var cptid = url.split(/=|&/)[7];
                var width = document.body.clientWidth;
                var height = document.body.clientHeight || document.documentElement.clientHeight;
                setTimeout(function() {
                    window.parent.postMessage({
                        action: 'set_pop',
                        cptid: cptid,
                        width: width,
                        height: height
                    }, '*');

                }, 300);
            }
        }
    });
})(Zepto);
