//链接操作
(function(){

    var token = (function(){
        var queryStr = document.location.search.toString(),
            strReg = new RegExp('[&?]token=([^&]*)'),
            strRegRes = strReg.exec(queryStr);
        return strRegRes? strRegRes[1]:'';
    })();

    var lgm_ui_link = function(option){

        var default_option = {
            target: 'xxx.xxx',
        };
        // target must have data-type, data-link


        var target =  option.target,
            $target = $(target);
        //console.log(target);
        var $body = $('body');

        var html = '\
        <div class="lgm-comLink-wrap">\
        <div class="lgm-comLink-selectWrap lgm-comLink-typediv">\
        <span class="lgm-comLink-type" data-type="inner">\
        站内链接\
        </span>\
        <ul class="lgm-comLink-type-ul" style="display: none;">\
        <li data-type="inner">站内链接</li>\
        <li data-type="outer">站外链接</li>\
        </ul>\
        </div>\
        <div class="lgm-comLink-padding"></div>\
        <!--站内链接选择 -->\
        <div class="lgm-comLink-selectWrap lgm-comLink-pagediv" style="">\
        <span class="lgm-comLink-page" data-link="">\
        链接页面        </span>\
        <!-- 站外链接选择-->\
        <input type="text" class=" lgm-comLink-input" style="display:none" value="">\
        <ul class="lgm-comLink-page-ul" style="display: none;"><li class="lgm-nav-newpage">新建页面</li><li data-pageid="xxx">默认页</li></ul>\
        </div>\
        </div>\
        ';

        function init(){
            var that = $(this);
            that.each(function(){
                var me = $(this);
                var me_data = me.data();
                if(!me_data.type && !data.link){
                    me.data({'type': 'inner', link: 'x'});
                }
                if(me.data('init') != '1'){
                    me.html(html);
                    var w = me.width();
                    me.find('.lgm-comLink-selectWrap').css('width', (w-20)/2);
                    refreshPageDom.apply(me);
                    initTarget.apply(me);
                }
                me.data('init', '1');
            });
            //that.html(html);
        //$target.html(html);
        
        }


        $body.on('click', target +' .lgm-comLink-type', function(){
            var that = $(this);
            that.siblings('.lgm-comLink-type-ul').show();
        });

        $body.on('click', target + ' .lgm-comLink-wrap', function(){
            var that = $(this);
            that.find('.lgm-comLink-pagediv').removeClass('lgm-comLink-pagediv-warn');
        });

        $body.on('typechange', target + ' .lgm-comLink-type', function(){
            var that = $(this);
            //alert('typechange');
            var tmp_type = that.data('type');
            var tmp_wrap = that.parents('.lgm-comLink-wrap');
            that.parents(option.target).data('type', tmp_type);
            if(tmp_type == 'outer'){
                tmp_wrap.find('.lgm-comLink-input').show(); 
                tmp_wrap.find('.lgm-comLink-page').hide(); 
            }else{
                tmp_wrap.find('.lgm-comLink-input').hide();
                tmp_wrap.find('.lgm-comLink-page').show();
            
            }
        });

        $body.on('linkinit', target, function(){
            var that = $(this);
            init.apply(that);
        });

        $body.on('warn', target + ' .lgm-comLink-pagediv', function(){
            var that = $(this);
            that.addClass('lgm-comLink-pagediv-warn');
            return false;
        });
        $body.on('click', target+' .lgm-comLink-page', function(){
            var that = $(this);
            that.siblings('.lgm-comLink-page-ul').show();
        });

        $body.on('blur', target + ' .lgm-comLink-input', function(){
            var that = $(this);
            var url = processUrl(that.val()); 
            that.closest(target).data('link', url);
            that.val(url);
            console.log(url);
        });

        function processUrl(url){
           url = $.trim(url);
           if(url.indexOf('http://') == -1){
              return 'http://' + url;
           }
           return url;
        }
        $body.on('click', target + ' .lgm-comLink-type-ul li', function(){
            //console.log('type clicked');
            var that = $(this);
            var tmp_type = that.data('type');
            var tmp_val = that.text();
            var that_ul = that.parent();
            that_ul.siblings('.lgm-comLink-type').data('type', tmp_type).text(tmp_val).trigger('typechange').show();
            that_ul.hide();
        });

        $('body').on('mouseleave', '.lgm-comLink-pagediv, .lgm-comLink-typediv', function(){
            var that = $(this);
            that.find('ul').hide();
        });

        var current_add_link;
        var home_id = 0;

        $body.on('click', target + ' .lgm-comLink-page-ul li', function(){
            //console.log('page clicked');
            var that = $(this);
            if(that.hasClass('lgm-comLink-addpage')){
                that.parent().data('add', 1);
                current_add_link = that.parent();
                 window.parent.postMessage({ 
                       action:"add_page" 
                 },"*");
            }else{
                var tmp_pageid = that.data('pageid');
                var tmp_title = that.text();
                var is_home = tmp_pageid == home_id ? 1 : 0;
                $(this).parents(option.target).data({'link': tmp_pageid, 'is_home': is_home});
                var that_ul = that.parent();
                that_ul.siblings('.lgm-comLink-page').html(tmp_title).show();
                that_ul.hide();
            
            }

        });

        // window message 
        window.addEventListener("message",function(e){
            var data = e.data;
            if(data.action = "add_success"){
                if(data.pageTitle){
                
                    lego_pages.push(data);
                    refreshPageDom.apply($('body').find(target));
                    setTimeout(function(){
                        if(current_add_link)
                        current_add_link.find('li[data-pageid="'+data.pageId+'"]').click();
                        current_add_link = null;
                    }, 500);
                }
            }  
        }); 

        $body.on('blur', target + ' .lgm-comLink-input', function(){
            $(this).parents(option.target).data('link', this.value);
        });


        var w = $target.width();
        $body.find(target + ' .lgm-comLink-selectWrap').css('width', (w-20)/2);
        //console.log(html);

        var pages = [], lego_pages;
        if(!lego_pages){
            getPageInfo();
        }else{
            pages = lego_pages;
        }

        function getPageInfo(){
            $.ajax({
                url: '?control=aider&caction=pginfo&format=json&token='+token,
                dataType: 'json',
                success: function(data){
                    if(data.pages){
                        pages = data.pages;
                        lego_pages = pages;
                        home_id = data.home_id;
                        refreshPageDom.apply($target);
                    }
                },
                error: function(){
                    console.log(arguments);
                }
            });
        }

        function refreshPageDom(){
            var me = $(this);
            var html = '<li class="lgm-comLink-addpage">新建页面</li>';
            for(var i = 0, len = pages.length; i < len; i ++){
                html += '<li data-pageid="'+ pages[i].pageId +'">' + pages[i].pageTitle + '</li>';
            }
            me.find('.lgm-comLink-page-ul').html(html);
        }
        function initTarget(){
            var me = $(this);
            me.each(function(){
                //me.trigger('linkinit');
                var that = $(this);
                var that_type = that.data('type');
                var that_link = that.data('link');
                //console.log(that_type, that_link);
                that.find('.lgm-comLink-type-ul li[data-type="'+that_type+'"]').click();
                if(that_type == 'inner'){
                    setTimeout(function(){
                    var selector = '.lgm-comLink-page-ul li[data-pageid="'+that_link+'"]';
                    //console.log(selector, that.find(selector));
                    that.find(selector).click();
                    }, 500);
                }else{
                    that.find('.lgm-comLink-input').val(that_link);
                }

            });
        }

        //initTarget.apply($target);
        $target.trigger('linkinit');
    }   

    window.lgm_link_select = lgm_ui_link;

})(jQuery);
