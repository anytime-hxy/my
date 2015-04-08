(function($){
    if(!$) return;
    
    // bind input
    //
    var input_text_class = 'lego-common-input';
    var input_require_class = 'lego-common-required';
    var input_sizeLabel_class = 'lego-common-inputSize';
    $(document).ready(function(){

        $('input.' + input_text_class).each(function(){
            var that = $(this);
            checkInputSizeLabel(that);
        });
        $('textarea.' + input_text_class).each(function(){
            var that = $(this);
            checkInputSizeLabel(that);
        });
    
        $('body').on('blur', '.' + input_text_class, function(){

            var that = $(this),
                that_val = $.trim(that.val()), 
                that_val_len = getLen(that_val),
                count_min = that.data('min') ? parseInt(that.data('min')) : null,
                count_max = that.data('max') ? parseInt(that.data('max')) : null,
                is_required = that.data('required');
            
        //console.log(count_min, count_max, that_val_len, input_require_class);
            
            if(count_min){
                if(that_val_len < count_min){
                    that.addClass(input_require_class);
                    return;
                }
            }

            if(count_max){
                if(that_val_len > count_max * 2){
                    that.addClass(input_require_class);
                    return;
                }
            }

            /* 
             * ok 
             * */

            that.removeClass(input_require_class);

        });

        $('body').on('focus', '.' + input_text_class, function(){
            var that = $(this);
            that.removeClass(input_require_class);
        });
        $('body').on('warn', '.' + input_text_class, function(){
            var that = $(this);
            that.addClass(input_require_class);
            return false;
        });
        $('body').on('focus', '.' + input_require_class, function(){
            var that = $(this);
            that.removeClass(input_require_class);
        });

        $('body').on('input', '.' + input_text_class, function(){
            var that = $(this);
            var size_label = checkInputSizeLabel(that);
            //console.log(size_label);
            if(!size_label) return;
            size_label.html(that.val().length + '/' + that.data('max'));
            
        })

        $('body').on('warn', '.lego-common-blockitem', function(){
            var that = $(this);
            that.addClass('lego-common-blockitem-warn');
            var top = that.position().top;
            window.scrollTo(0, top);
        });

        $('body').on('click', '.lego-common-blockitem', function(){
            var that = $(this);
            that.removeClass('lego-common-blockitem-warn');
        });

    });

    function checkInputSizeLabel(input){
        var has_label = input.data('label');
        if(has_label != '1') return;

        var input_max_count = input.data('max');
        if(!input_max_count) return;
        
        var size_label = input.siblings('.' + input_sizeLabel_class);
        if(size_label.length > 0)  return size_label;
    
        // must insert a new lable

        var custom_class = input.data('sizeclass') ? input.data('sizeclass') : '';
        var html_str = '<div class="' + input_sizeLabel_class + ' ' + custom_class + '">'+ input.val().length +'/' + input_max_count +'</div>'; 
        return $(html_str).insertAfter(input);

    }

    var tips_class = 'lego-common-tips';
    function pop_tips(status, msg, dom){
        if(dom){
            console.log(dom);
            if(!status) {
                dom.addClass(input_require_class);
                dom.on('click', function(){
                    $(this).removeClass(input_require_class);
                });
            }
        }
        if(!msg)  return;
        var tip_dom = $('.' + tips_class);
        if(!tip_dom.length){
            var html = '<div class="' + tips_class + '"></div>';
            tip_dom = $(html).prependTo($(document.body));
        }
        if(status){
            tip_dom.addClass('lego-common-righttip').removeClass('lego-common-errortip');
        }else{
            tip_dom.removeClass('lego-common-righttip').addClass('lego-common-errortip');
        }
        tip_dom.animate({'opacity': 1}, 500);
        tip_dom.html(msg);
        setTimeout(function(){
            tip_dom.animate({'opacity': 0}, 'slow', function(){
                tip_dom.removeClass('lego-common-righttip').removeClass('lego-common-errortip');
            });
        }, 1200);
    }

    window.PopTips = pop_tips;

    var middle_img_class = 'lego-common-img';

    function middleImage(img){
        if(!img) return;
        if(!img.attr('src')) return;
        var img_wrap = img.parent(),
            img_wrap_h = img_wrap.height(),
            img_wrap_w = img_wrap.width();

        var img_h = img.height(),
            img_w = img.width();

        var h = img_wrap_h - img_h;
        img.css('margin-top', h / 2);
    }

    function processMiddleImage(img){
        //console.log('process Middle img');
        //console.log(img, img.complete);
        if(img.complete){
            middleImage($(img));
        }else{
            img.onload = function(){
                //console.log('img onload');
                middleImage($(img));
            } 
        }
    }
    var all_imgs = $('.' + middle_img_class);
    all_imgs.each(function(){
        processMiddleImage(this); 
    });

    window.middleImage = processMiddleImage;

    /*
    $('body').on('load', '.' + middle_img_class, function(){
        var that = $(this);
        console.log(that);
        middleImage(that);
    })
    */

    //简单模版
    var render = function(str,o){
        var isObj = $.isPlainObject(o)
               return  str.replace(/\{([^{}]+)\}/gmi, function (match, name) {
                           return isObj?((o[name] === undefined) ? '' : o[name]):(o||"");
               })
    };
    
    var confirmTpl = '<div id="lgm-alter-wrap" class="lgm-alter-wrap"><div id="lgm-alter-mask"></div>\
                     <div class="lgm-alter-layout" id="lgm-alter-layout">\
                  <span class="lgm-alter-t"></span>\
                  <div class="lgm-alter-inner">\
                  <div class="lgm-alter-c">\
                  </div>\
                  </div>\
                  <div class="lgm-alter-b">\
                  <button type="button" class="submit lego-common-btn">确定</button>\
                  <button type="button" class="cancel lego-common-btn lego-common-btn-cancel">取消</button>\
                  </div>\
                  </div><div>';

    function newConfirm(obj){
        if(!obj) return;
        var dom = obj.dom,
            $dom = $(dom),
            has_btn = obj.btn,
            tips = obj.tips,
            ok_p = obj.ok_p || function(){},
            cancel_p = obj.cancel_p || function(){};
        if(!dom) return;
        if(!tips) tips = $dom.data('tips');
        
        //console.log('in');
        var confirm_dom = $('#lgm-alter-wrap');
        var t = new Date();

        if(!confirm_dom.length){
            var tmp_dom = $(confirmTpl);
            confirm_dom = tmp_dom.appendTo($('body'));
            confirm_dom.on('click', '.lgm-alter-layout', function(){ return false; });
            confirm_dom.on('click', function(){ 
                confirm_dom.hide();    
                return false; 
            });
        }
        if(obj.width){
            confirm_dom.find('#lgm-alter-layout').css('width', obj.width);
        }

        confirm_dom.find('.lgm-alter-c').text(tips);
        if(!has_btn){
            confirm_dom.find('.lgm-alter-b').hide();
            confirm_dom.addClass('no-btn');
        }else{
            confirm_dom.removeClass('no-btn');
            var btns = confirm_dom.find('.lgm-alter-b');
            btns.children().unbind();
            btns.find('.submit').one('click', function(){
                ok_p(obj);
                //console.log('submit');
                confirm_dom.hide();
            });
            btns.find('.cancel').one('click', function(){
                cancel_p(obj);
                //console.log('cancel');
                confirm_dom.hide();
            });
        }
        // top, left 
        
        var dom_offset = $dom.offset(),
            dom_off_left = dom_offset.left,
            dom_off_top = dom_offset.top,
            dom_w = $dom.width(),
            dom_h = $dom.height();
        
        var doc_w = $('body').width(),
            doc_h = $('body').height();

        confirm_dom.show();
        var tip_dom = confirm_dom.find('.lgm-alter-layout');
        var tip_h = tip_dom.height(),
            tip_w = tip_dom.width();

        //console.log(doc_w, doc_h, tip_h, tip_w);

        //console.log(dom_offset, dom_w, dom_h);

        var tmp_left = dom_off_left + 5, tmp_top;
        var is_big = 0;
        if(tip_w + dom_off_left > doc_w){
            tmp_left = doc_w - tip_w - 40;
            is_big = 1;
        }
        
        confirm_dom.children().eq(1).css({
            'top': dom_off_top + dom_h + 10,
            'left': tmp_left,
        });
        
        var pic_left = dom_off_left - tmp_left;
        //console.log(pic_left);
        if(pic_left > tip_w - 10){
            pic_left = tip_w - 10;
        }
        if(obj.hover){
            $('#lgm-alter-mask').hide();
        }
        if(is_big){
            confirm_dom.find('.lgm-alter-t').css('left', pic_left);
        }
    }
    window.newConfirm = newConfirm;

    var iConfirm = function(obj){
        obj = obj||{};
        var t = iConfirm;
        var $tar = $(obj.tar);
        var w = obj.width||200;
        var h = obj.height||"auto";
        t.funOk = obj.funOk||function(){};
        t.funCancel = obj.funCancel||function(){};
        var renders = function(){
            var $confirm = $(render(confirmTpl));
            t.cont = $confirm.find('.lgm-alter-c');
            var submit = $confirm.find('.submit');
            var cancle = $confirm.find('.cancle');
            t.tip = $confirm.find('.lgm-alter-t');
            t.wrap = $confirm;
            submit.click(function(e){
                            e.stopPropagation();
                            t.funOk();
                            t.hide();
                        });
            cancle.click(function(e){
                            e.stopPropagation();
                            t.funCancel();
                            t.hide();
                        });
        
            $('html').bind('click',function(e){
                            if($(e.target).closest(".lgm-alter-layout").length) return;
                            t.hide();
                        });
            $('window').bind('resize',function(e){
                            t.hide();
                        });
            t.wrap = $confirm.appendTo("body");
            t.isRender = true;
        }
        t.isRender || renders();
        t.cont.text(obj.text);
        var offset = $tar.offset();
        var bW = $(window).width();
        var left = offset.left-w/2+11;
        var lv;
        if((lv=left+w-bW)>0){
          left = left-lv;
        }else if(left<0){
          left = 0;
        }
        t.tip.css('left',offset.left-left);
        var doc_w= $('body').width();
        //console.log(doc_w, left, w);
        t.wrap.css({
          top: offset.top+$tar.height()+11,
          left: left,
          width:w,
          height:h
        });
        t.wrap.show();
        $('.lgm-alter-layout').show();
    }
        iConfirm.hide = function(tar){
                iConfirm.wrap.hide();
            }
    window.iConfirm = iConfirm;

    $('body').on('mouseover', '.lego-common-bubble', function(){
        var that = $(this);
        var alter_dom = $('.lgm-alter-wrap');
        if(alter_dom.is(':visible'))  return;
        newConfirm({
            dom: that,
            btn: false,
            tips: that.data('tip'),
            hover: true,
        }); 
        //return true;
    });
    $('body').on('mouseout', '.lego-common-bubble', function(){
        $('.lgm-alter-wrap').hide();
        //return true;
    })

    function getLen(str){
        var val = str;
         var len = 0; 
         for (var i = 0; i < val.length; i++) {  
         if (val[i].match(/[^x00-xff]/ig) != null) //全角 
             len += 2; 
         else 
             len += 1; 
         }  
         return len; 
    }
    window.getLen = getLen;


    $('.lgm-icon-selectWrap').on('click', function(){
        var that = $(this);
        that.siblings().removeClass('lgm-icon-selected');
        that.addClass('lgm-icon-selected');
    });

    $('.lgm-select-wrap').on('click', function(){
        var that = $(this),
            that_child = that.find('.lgm-select');
        that.siblings().children().removeClass('select');

        if(that_child.hasClass('select')){
            that_child.removeClass('select');
        }else{
            that_child.addClass('select');
        }
    });

    var LgmPost = function(url, data, success_call, err_call){
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: success_call,
            error: err_call
        });
    }

    window.LgmPost = LgmPost;
    
    var parseUrl = function(str){
        var tmp_a = document.createElement('a');
        tmp_a.href = str;
        var tmp_search = tmp_a.search.substr(1);
        var search_arr = tmp_search.split('&');
        var search_obj = {};
        for(var i = 0, len = search_arr.length; i < len; i++){
            var tmp_arr = search_arr[i].split('=');
            search_obj[tmp_arr[0]] = tmp_arr[1];
        }
        
        console.log(search_obj);
        return search_obj['src'] ? unescape( search_obj['src']) : str;
    
    }

    window.LgmParseUrl = parseUrl;
    var parseTimg = function(str){
        var tmp_obj = parseUrl(str);
        console.log(tmp_obj);
        
        if(tmp_obj.indexOf('http://tc2.baidu-1img.cn') != -1){
            console.log('tmp_obj', tmp_obj);
            tmp_obj = parseUrl(tmp_obj);
        }
        return tmp_obj;
    }
    window.LgmParseTimg = parseTimg;

    $.extend($.fn, {
        focusDom: function(){
            var me = $(this);
            var me_offset = me.offset();
            var me_l = me_offset.left,
                me_t = me_offset.top;

            window.scrollTo(0, me_t - 40);

        }
    
    });


})(jQuery);
