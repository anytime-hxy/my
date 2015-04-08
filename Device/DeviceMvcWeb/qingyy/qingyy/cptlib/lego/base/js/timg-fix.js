//链接操作
(function($){

    if($.timg_fix)  return;

    $.timg_fix_list = [];

    $.timg_fix = function(){
        var timgs = $('.lgm-common-timg');
        timgs.each(function(){
            loadTimg.apply($(this));
        });
    }

    $.timg_fix_push = function(dom, url){
        dom.data('timg_src', url);
        console.log(dom, url);
        var new_obj = {dom: dom, url: url, ok: false, lock: false}; 
        $.timg_fix_list.push(new_obj);
        var load_counts = 1;
        for(var i = 0, len = $.timg_fix_list.length; i < len; i++){
            var tmp_item = $.timg_fix_list[i];
            if(!tmp_item.ok && !tmp_item.lock){
                $.timg_fix_list[i].lock = true;
                setTimeout(function(){
                    loadTimg.apply($(tmp_item.dom), [i]);
                }, 300 * load_counts++);
            }
        }
    }

    function loadTimg(timg_index){
        var me = this;
        var style = me.data('style');
        var src = me.data('timg_src');
        var image = new Image();
        image.onload = ok_load;
        image.src = src;
        console.log('Timg fix: ', me, src);
        if(image.complete) ok_load;
        function ok_load(){
            var tmp_w = image.width;
            var tmp_h = image.height;
            if(tmp_w == 4 && tmp_h == 8){
                console.log('reload ', me); 
                me.data('timg_try', 1);
                reloadTimg(me, src, timg_index);
            }
        }
    }

    function reloadTimg(img_dom, url, timg_index){
        var me = img_dom;
        var try_time = parseInt(me.data('timg_try')) || 1;
        if(me.data('timg_try')){
            if(try_time > 3){
                console.log('reload 3 times', me);
                if(timg_index >= 0){
                    $.timg_fix_list[timg_index].ok = true;
                }
                me.css('background-image', 'url(/cptlib/lego/base/images/pic-icon.png)');
                return;
            }
            me.data('timg_try', try_time + 1);
        }
        
        var tmp_img = new Image();
        tmp_img.onload = reload_ok;
        url = change_timg_url(url);
        tmp_img.src = url;
        function reload_ok(){
            var tmp_w = tmp_img.width,
                tmp_h = tmp_img.height;
            if(tmp_w > 4){
                replaceTimg(img_dom, url);
                if(timg_index >= 0){
                    $.timg_fix_list[timg_index].ok = true;
                }
            }else{
                setTimeout(function(){
                    reloadTimg(img_dom, url, try_time); 
                }, 500);
            }
        }
    }

    function replaceTimg(img_dom, url){
        var style = img_dom.data('style');
        if(style == 'background'){
            img_dom.css('background-image', 'url('+url+')');
        }
    }

    function change_timg_url(url, try_time){
        var tmp_ts = + new Date();
        url = url.replace(/(&ts=[\d+]+)*?&src=/, '&ts='+ tmp_ts +'&src=');
        if(try_time > 1){
            url = url.replace('tc2.baidu-1img.cn', 'timg01.baidu-1img.cn');
        }
        return url;

    }

    $.timg_fix();
})(Zepto);
