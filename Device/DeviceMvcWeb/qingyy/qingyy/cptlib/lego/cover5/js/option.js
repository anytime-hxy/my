$(function() {
    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');

    if ($('.lego-cover-image img').length > 5) {
        $('#lego-upload-container').hide();
    }

    $('body').on('click', '.lego-cover-loaded-img>strong', function(){
        var me = $(this).closest(".lego-cover-loaded-img");
        var len = $("#lego-cover-slide .lego-cover-loaded-img").length;
        if(len == 1){
            PopTips(0, '至少设置一张图片');
        }else{
            me.remove();
            if(len == 6){
                $("#lego-upload-container").show();
            }
        }
    });

    window.onload = function() {
        var cpton = $('body').data('cpton');
        var disableColor = '#d0d4d9';
        if (cpton && cpton == 'disable') {
            $('.mask-layer').css('display', 'block');
            $('.mask-layer').css('height', $('body').height());
            $('.lgm-icon-selected .lgm-icon-selectMin').css('background-color', disableColor);
            $('.lego-cover-nav-add').css('background', 'url(/cptlib/lego/cover3/images/plus-icon-sidable.png) no-repeat');
            $('.lego-cover-nav-add').css('background-position-y', 'center');
            $('.lego-cover-nav-add').css('color', disableColor);
            $('.lego-common-input').css('color', disableColor);
            $('.lgm-comLink-type').css('color', disableColor);
            $('.lgm-comLink-page').css('color', disableColor);
            $('.lgm-comLink-input').css('color', disableColor);
            $('.lego-cover-save').css('background-color', disableColor);
            $('.lego-slide-timeset-sel select').css('color', disableColor);
        }
    }

    $('.lego-cover-save').on('click', function() {
        var is_error = false;
        var nav_wrap = $('.lego-cover-nav');
        var nav_items = nav_wrap.children();
        var nav_obj = [];

        nav_items.each(function() {
            var me = $(this);
            var tmp_obj = {};
            tmp_obj.title = me.find('.lego-common-input').val();
            var title_len = getLen(tmp_obj.title);
            if (title_len == 0 || title_len > 12) {
                me.find('.lego-common-input').addClass('lego-common-required');
                is_error = true;
                error_dom = me;
                error_tip = '导航文字数目在1-6字内';
                return false;
            }
            var icon_obj = me.find('.lego-cover-nav-iconWrap').data();

            var tmp_link_obj = me.find('.lego-cover-nav-link').data();
            if (!tmp_link_obj.link) {
                me.find('.lgm-comLink-pagediv').trigger('warn');
                is_error = true;
                error_dom = me;
                error_tip = '请设置导航链接';
                return false;
            }
            var tmp_data = $.extend({}, tmp_obj, tmp_link_obj, icon_obj);
            nav_obj.push(tmp_data);
        });
        if (is_error) {
            PopTips(0, error_tip);
            return;
        }
        
        var slide_link = [];
        var slide_items = $("#lego-cover-slide .lego-cover-loaded-img");
        slide_items.each(function(){
            var me = $(this);
            var tmp_obj = me.data();
            slide_link.push(tmp_obj);
        });
        var data = {
            'slideLink': slide_link,
            'nav': nav_obj,
            'slide_time': $('#lego-slide-times').val()
        };
        
        var ids = getIds($('body'));
        var postPack = buildPostPack(ids, data);
        var url = '?control=option&caction=edit&format=json&token=' + token;
        LgmPost(url, postPack, function(ret, status, xhr) {
            if (ret[ids.cptId] && ret[ids.cptId]['errno'] == 0) {
                window.parent.postMessage({
                    action: "refresh",
                    cptid: ids.cptId
                }, "*");
                PopTips(1, '保存成功');
            } else {
                PopTips(0, '操作失败');
            }
        }, function() {
            PopTips(0, '网络错误');
        });
    });

    upload_init({
        btn: 'lego-cover-upload',
        container: 'lego-upload-container',
        process: '#lego-upload-process-1',
        fileadded: function() {
            $('#lego-upload-process').show();
        },
        success: function(ret) {
            if (ret.status == 200) {
                var code = '<div class="lego-cover-loaded-img" data-up_img="'+ret.path+'" data-init="0" data-num="'+ret.path+'" data-title=""><img src="'+ret.path+'" /><strong></strong></div>'
                $('#lego-upload-container').before(code);
                 $("#lego-upload-process").hide();
                 if($("#lego-cover-slide>div.lego-cover-loaded-img").length == 6){
                    $("#lego-upload-container").hide();
                 }
            } else {
                PopTips(0, '请确认图片格式');
            }
        },
        error: function() {
            console.log('error');
            console.log(arguments);
        }

    });

    function initSlide() {

        //add nav 
        $('body').on('click', '.lego-cover-nav-add', function() {
            var that = $(this);
            var nav_len = $('.lego-cover-nav-item').length;
            if (nav_len == 8) {
                PopTips(0, '导航最多可设置8项');
            } else {
                var clone_one = $('.lego-cover-nav-item').eq(0).clone();
                clone_one.find('.lego-common-input').val('');
                clone_one.find('.lego-cover-nav-link').data({
                    type: 'inner',
                    link: ''
                });
                $('.lego-cover-nav').append(clone_one);
                clone_one.find('.lego-cover-nav-link').trigger('linkinit');
            }
        });

        // for delete item
        $('body').on('click', '.lego-common-delbtn', function() {
            var that = $(this);
            var item = that.closest('.lego-common-blockitem');

            // delete nav
            var nav_len = $('.lego-cover-nav-item').length;
            if (nav_len == 2) {
                PopTips(0, '导航最少设置2项');
                return;
            }
            item.remove();
        });

    }

    initSlide();
});