
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

            var process = wrap.find('.lego-slide-addprocess');
            var img_dom = wrap.find('.lego-slide-thumb');
            var add_btn = wrap.find('.lego-slide-addbtn');
            var img_obj = new Image();
            
            add_btn.hide();
            process.show();
            img_obj.onload = function(){
                process.hide();
                img_dom.attr('src', ret.path);
                console.log('middleImage');
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
        if(slide_len ==20){
            PopTips(0, '图集最多设置20项');
            return;
        }
        var clone_one = $('.lego-slide-item').eq(0).clone();
        clone_one.data({'up_img': '', 'up_scale': '0', 'up_from': 'local'});
        clone_one.find('.lego-slide-thumb').attr('src', '').attr('title', '');
        clone_one.find('.lego-slide-imgname').val('').removeClass('lego-common-required');
        clone_one.find('.lego-thumb-default').removeClass('lego-slide-saved');
        clone_one.find('.lego-slide-addbtn').show();

        $('.lego-slide-container').append(clone_one);
    });



    // for delete item
    $('body').on('click', '.lego-common-delbtn', function(){
        var that = $(this);
        var item = that.closest('.lego-common-blockitem');
        if(item.hasClass('lego-slide-item')){
            // delete slide
            var slide_len = $('.lego-slide-item').length;
            if(slide_len == 1){
                PopTips(0, '图集最少设置1项');
                return;
            }
            item.remove();
        }
    });

}

function initSubmit(){

    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');

    var ids = getIds($("#lego-slide-info"));

    $('body').on('click', '#lego-slide-save input', function(){
        var that = $(this);
        var slide_wrap = $('.lego-slide-container');
        var slide_items = slide_wrap.children();
        var slide_obj = [];
        var is_error = false;
        var error_dom = null;
        var error_tip = '';

        var tmp_title_dom = $('.lego-gallery-titleText input');
        var tmp_title = tmp_title_dom.val();

        if(getLen(tmp_title) == 0 || getLen(tmp_title) > 32){
            PopTips(0, '图集标题在1-16字内');
            tmp_title_dom.trigger('warn');
            tmp_title_dom.focusDom();
            return;
        }

        slide_items.each(function(){
            var me = $(this);
            var tmp_obj = me.data();
            var tmp_info_dom = me.find('.lego-gallery-textInput');
            var tmp_info = tmp_info_dom.val();
            var tmp_data = $.extend({}, tmp_obj, {'up_info': tmp_info});
            if(getLen(tmp_info) > 400){
                is_error = true;
                error_tip = '图片描述在200字内';
                error_dom = tmp_info_dom;
                return false;
            }

            if(!tmp_data.up_img){
               is_error = true;
               error_tip = '请设置图片';
                error_dom = me; 
                return false;
            }
            slide_obj.push(tmp_data);
        });

        if(is_error){
            PopTips(0, error_tip);
            console.log(error_dom);
            if(error_dom) {error_dom.trigger('warn');
                error_dom.focusDom();
            }
            return;
        }
        console.log(slide_obj);

        var url = '?control=option&caction=edit&format=json&token='+token;
        var data = {
            imgs: slide_obj,
            column: +$('#lego-slide-times').val(),
            title: tmp_title
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

    function succ_call(data, status){
    
        if(data[ids.cptId].status == 200){
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

$(document).ready(function(){
    initSlide();
    initSubmit();
});
