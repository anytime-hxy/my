var runtime = window.runtime,
    buildPostPack = runtime.buildPostPack,
    getIds = runtime.getIds;

var token = runtime.getUrlParam('token');

var ids = getIds($('body'));

window.onload = function() {
    var cpton = $('body').data('cpton');
    var disableColor = '#d0d4d9';
    if (cpton && cpton == 'disable') {
        $('.mask-layer').css('display','block');
        $('.mask-layer').css('height', $('body').height());
        $('.lego-slide-addbtn').css('background', 'url(/cptlib/lego/cover2/images/add-img-btn-disable.png) center center no-repeat');
        $('.lego-slide-addbtn').css('background-size', '20px');
        $('.lego-cover-save').css('background-color', disableColor);
        $('#lego-slide-add div').css('background', 'url(/cptlib/lego/cover2/images/common/plus-icon-disable.png) no-repeat');
        $('#lego-slide-add div').css('background-position-y', 'center');
        $('#lego-slide-add div').css('color', disableColor);
        $('.lego-cover-toStyle').css('color', disableColor);
        $('.lego-cover-nav-iconDetTip').css('color', disableColor);
        $('.lgm-comLink-type').css('color', disableColor);
        $('.lgm-comLink-page').css('color', disableColor);
        $('.lego-slide-timeset-sel select').css('color', disableColor);
        $('.lego-slide-item').attr('class', "lego-slide-item");
        $('.lego-common-input').css('color', disableColor);
        $('.lgm-comLink-input').css('color', disableColor);
    }
}

//PopTips(1, '保存成功');
function initIcon() {
    $('body').on('click', '.lego-cover-nav-iconDetTip', function(){
        var that = $(this);
        var wrap = that.parents('.lego-cover-nav-icon');
        if(wrap.hasClass('hover')){
            wrap.removeClass('hover');
        }else{
            wrap.addClass('hover');
        }
    });

    initIconBg.apply($('body'));

    $('body').on('click', '.lgm-icon-selectWrap', function(){
        var that = $(this);
        var that_set = that.closest('.lego-cover-nav-icon');
        var icon_from = that.data('icon_from');
        if(icon_from == 'system'){
            // from system

            that_set.find('.lego-cover-nav-icons').show();
            that_set.find('.lego-cover-nav-icon-custom').hide();
            initIconBg.apply(that_set);
        }else{
            // from custom
        
            that_set.find('.lego-cover-nav-icons').hide();
            that_set.find('.lego-cover-nav-icon-custom').show();
        }
        that_set.find('.lego-cover-nav-iconWrap').data('from', icon_from);
    
    });


    $('body').on('mouseleave', '.lego-cover-nav-icon', function(){
        $(this).removeClass('hover');
    });

    function initIconBg(){
        var that = $(this);
        that.find('.lego-cover-nav-icons-item').each(function(){
            var me = $(this);
            me.css('background-image', 'url(' + me.data('img') + ')');
        });
    }




    // for custom icons
    $('body').on('click', '.lego-cover-nav-icons-item', function(){
        // console.log();
        var that = $(this);
        var icon = that.data('img');
        var icon_item = that.closest('.lego-cover-nav-item');

        var current_icon = icon_item.find('.lego-cover-nav-iconWrap');
        console.log(current_icon, icon);
        current_icon.css('background-image', 'url(' + icon + ')');
        current_icon.data('icon', icon);

        icon_item.children().removeClass('hover');

    });

    $('body').on('click', '.lego-cover-nav-icon-up-wrap button', function(){
        var that = $(this);

        current_btn = that;
        $('#up-btn-hide').click();

    });

    var current_btn;
    var upload_instance;

    upload_init({
        btn: 'up-btn-hide',
        container: 'up-btn-wrap',
        init: function(instance){
            console.log(instance);
            instance.setOption("multipart_params", {type: 'icon'});
            var filters = {
                mime_types : [
                    { title : "Image files", extensions : "jpg,gif,png,jpeg" },
                  ],
                max_file_size : '50kb',
            }
            instance.setOption("filters", filters);
            console.log('init by icon');
        },
        //process: '#lego-upload-process-1',
        fileadded: function(up, files, instance){
            upload_instance = instance;
            instance.setOption("multipart_params", {type: 'icon'});
            //instance.settings.multipart_params = {type: 'icon'};
            console.log(instance.settings);
            upload_instance.start();
            current_btn.siblings('.lego-cover-up-process').show(); 
        },
        success: function(ret){
                console.log('success');
                console.log(ret);
                if(ret.status == 200){
                    var icon_item = current_btn.closest('.lego-cover-nav-item');
                    icon_item.find('.lego-cover-nav-iconWrap').css('background-image', 'url(' + ret.path +')').data('icon', ret.path);
                    current_btn.siblings('.lego-cover-up-process').hide();
                    icon_item.children().removeClass('hover');
                    icon_item.data('icon', ret.path);
                }
                else{
                    PopTips(0, '请确认图片格式');
                }

            },
        error: function(err){
                console.log('error');
                console.log(arguments);
                switch(err.code){
                    case -600:
                        PopTips(0, '图标需在50kb内');
                        break;
                    case -601:
                        PopTips(0, '格式需为png, jpg');
                        break;

                    default:
                        PopTips(0,'网络异常');
                        break;
                }
                current_btn.siblings('.lego-cover-up-process').hide();
                //var icon_item = current_btn.closest('.lego-cover-nav-item');
                //    icon_item.find('.lego-cover-nav-iconWrap').css('background-image', 'url(' + ret.path +')').data('icon', ret.path);
            }
        });


}


function initSlide(){
    var dataFrom = '.lego-slide-item';
    window.lgmUpload({
        btn: '.lego-slide-img',
        dataFrom: dataFrom,
        success: success_fun,
        error: error_fun
         
    });
    
    function success_fun(btn, ret){
        
        var wrap = btn.closest(dataFrom);
        if(ret.status == 200){
            // upload slide item ok
            wrap.data({
                'up_img': ret.path,
                'up_scale': ret.scale,
                'up_from': ret.from,
            });

            console.log(ret);

            var process = wrap.find('.lego-slide-addprocess');
            var img_dom = wrap.find('.lego-slide-thumb');
            var add_btn = wrap.find('.lego-slide-addbtn');
            var img_obj = new Image();
            
            add_btn.hide();
            process.show();
            img_obj.onload = function(){
                process.hide();
                img_dom.attr('src', ret.path);
                middleImage(img_dom);
            };
            img_obj.src = ret.path;

        
        }else{
        
        }

        console.log(arguments);  
    }

    function error_fun(btn){
        console.log(arguments);
    }


    // add slide 
    $('body').on('click', '.lego-cover-slide-add', function(){
        var that = $(this);
        var slide_len = $('.lego-slide-item').length;
        if(slide_len ==6){
            PopTips(0, '最多设置6张图片');
            return;
        }
        var clone_one = $('.lego-slide-item').eq(0).clone();
        clone_one.data({'up_img': '', 'up_scale': '1.777777', 'up_from': 'local'});
        clone_one.find('.lego-slide-thumb').attr('src', '').attr('title', '');
        clone_one.find('.lego-slide-imgname').val('');
        clone_one.find('.lego-thumb-default').removeClass('lego-slide-saved');
        clone_one.find('.lego-slide-addbtn').show();

        $('.lego-slide-container').append(clone_one);
        //clone_one.
        clone_one.find('.lego-cover-linkSelect').trigger('linkinit');
    });


    //add nav 
    $('body').on('click', '.lego-cover-nav-add', function(){
        var that = $(this);
        var nav_len = $('.lego-cover-nav-item').length;
        if(nav_len == 9){
            PopTips(0, '导航最多可设置9项');
        }else{
            var clone_one = $('.lego-cover-nav-item').eq(0).clone();
            clone_one.find('.lego-common-input').val('');
            clone_one.find('.lego-cover-nav-link').data({type: 'inner', link: ''});
            clone_one.find('.lego-cover-nav-iconWrap').css('background-image', 'url(/cptlib/lego/cover2/images/icons/default-icon-white.png)').data('icon', '/cptlib/lego/cover2/images/icons/default-icon-white.png');
            $('.lego-cover-nav').append(clone_one);
            clone_one.find('.lego-cover-nav-link').trigger('linkinit');
        }
    });

    // for delete item
    $('body').on('click', '.lego-common-delbtn', function(){
        var that = $(this);
        var item = that.closest('.lego-common-blockitem');
        if(item.hasClass('lego-slide-item')){
            // delete slide
            var slide_len = $('.lego-slide-item').length;
            if(slide_len == 1){
                PopTips(0, '至少设置1张图片');
                return;
            }
            item.remove();
        }else{
            // delete nav
            var nav_len = $('.lego-cover-nav-item').length;
            if(nav_len == 3){
                PopTips(0, '导航最少设置3项');
                return;
            }
            item.remove();
        
        }
    });

}

$(document).ready(function(){
    initIcon();
    initSlide();
    initSubmit();
});


function initSubmit(){
    $('body').on('click', '.lego-cover-save', function(){
        var that = $(this);
        var slide_wrap = $('.lego-slide-container');
        var slide_items = slide_wrap.children();
        var slide_obj = [];
        var is_error = false;
        var error_dom = null;
        var error_tip = '';
        slide_items.each(function(){
            var me = $(this);
            var tmp_obj = me.data();
            var tmp_link_obj = me.find('.lego-cover-linkSelect').data();
            var tmp_data = $.extend({}, tmp_obj, tmp_link_obj);
            var imgname_dom = me.find('.lego-slide-imgname');
            var imgname = imgname_dom.val();
            if(getLen(imgname) > 32){
                error_tip = '图片描述在16字内';
                error_dom = imgname_dom;
                is_error = true;
                me.focusDom();
                return false;
            }
            tmp_data.title = imgname;

            if(!tmp_data.up_img){
               is_error = true;
               error_tip = '请设置图片';
                error_dom = me; 
                me.focusDom();
                return false;
            }
            slide_obj.push(tmp_data);
        });

        if(is_error){
            PopTips(0, error_tip);
            if(error_dom)
                error_dom.trigger('warn');
            return;
        }
        console.log(slide_obj);

        var nav_wrap = $('.lego-cover-nav');
        var nav_items = nav_wrap.children();
        var nav_obj = [];
        nav_items.each(function(){
            var me = $(this);
            var tmp_obj = {}; 
            tmp_obj.title = me.find('.lego-common-input').val();
            var title_len = getLen(tmp_obj.title);
            if(title_len == 0 || title_len > 12){
                me.find('.lego-common-input').addClass('lego-common-required');
                is_error = true;
                error_dom = me;
                error_tip = '导航文字数目在1-6字内';
                return false;
            }
            var icon_obj = me.find('.lego-cover-nav-iconWrap').data();

            var tmp_link_obj = me.find('.lego-cover-nav-link').data();
            if(!tmp_link_obj.link){
                me.find('.lgm-comLink-pagediv').trigger('warn');
                is_error = true;
                error_dom = me;
                error_tip = '请设置导航链接';
                return false;
            }
            console.log(icon_obj);
            var tmp_data = $.extend({}, tmp_obj, tmp_link_obj, icon_obj);
            nav_obj.push(tmp_data);
        });
        if(is_error){
            PopTips(0, error_tip);
            if(error_dom) error_dom.focusDom();
            //error_dom.trigger('warn');
            return;
        }

        var url = '?control=option&caction=edit&format=json&token=' + token;
        var data = {
            slide: slide_obj,
            nav: nav_obj,
            slide_time: $('#lego-slide-times').val()
        };
        var postPack = buildPostPack(ids, data);
        LgmPost(url, postPack, succ_call, err_call);

    });

    function processUrl(url){
        url = $.trim(url);
        if(url.indexOf('http://') == -1){
           return 'http://' + url; 
        }
        return url;
    }

    function succ_call(data){

        if(data[ids.cptId] && data[ids.cptId].errno == 0){
            PopTips(1, '保存成功');
            window.parent.postMessage({
                action:"refresh",
                cptid:ids.cptId
            },"*");
        }else{
            PopTips(0, '保存失败');
        }
    }

    function err_call(){
        PopTips(0, '网络异常');
        console.log(arguments);
    }

}


$('.lego-cover-toStyle').on('click', function(){

    window.parent.postMessage({
        action:"set_app_style",
        cptid: ids.cptId
    },"*");

});
