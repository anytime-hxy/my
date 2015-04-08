$(function() {
    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');


    // transparency
    $('div.lego-cover3-option-transparency input').change(function() {
        $(this).siblings().val($(this).val());
    })
    $('div.lego-cover3-option-transparency input').val(option.transparency);

    // nav style
    $('div.lego-cover3-nav-style.lgm-icon-selectWrap').click(function() {
        var style = $(this).data('cover3-nav-style');
        if (style == 2) {
            $('.lego-cover3-text-option').show();
        } else {
            $('.lego-cover3-text-option').hide();
        }
        $('.lego-cover-system img, #lego-cover-upload-img').attr('src', '/cptlib/lego/cover3/images/cover3-bg' + style + '.png')
    })
    $('.lego-cover3-nav-style[data-cover3-nav-style=' + option.nav_style + ']').click();
    // text option
    $('.lego-cover3-text-option .lgm-icon-selectWrap[data-cover3-text-option=' + (option.text_align || 'center') + ']').addClass('lgm-icon-selected');

    if ($('#lego-cover-upload-img img').length > 0) {
        $('#lego-cover-upload').css('background', 'none');
    }

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
            $('.lgm-comLink-type').css('color', disableColor);
            $('.lgm-comLink-page').css('color', disableColor);
            $('.lego-cover-save').css('background-color', disableColor);
            $('.lego-common-input').css('color', disableColor);
            $('.lgm-comLink-input').css('color', disableColor);
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
            //error_dom.trigger('warn');
            return;
        }
        var wrap_from = $('.lego-cover-select .lgm-icon-selected').data('wrap_from');

        if (wrap_from == 'system') {
            wrap_link = '';
        } else {
            wrap_link = $('#lego-cover-upload-img').data('wrap_link');
        }
        var data = {
            'wrap_from': wrap_from,
            'wrap_link': wrap_link,
            'transparency': $('div.lego-cover3-option-transparency input').val(),
            'nav': nav_obj,
            'nav_style': $('.lgm-icon-selectWrap.lego-cover3-nav-style.lgm-icon-selected').data('cover3-nav-style'),
            'text_align': $('.lego-cover3-text-option .lgm-icon-selected').data('cover3-text-option')
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


    $('.lego-cover-select .lgm-icon-selectWrap').on('click', function() {
        var that = $(this);
        var wrap_from = that.data('wrap_from');
        var wrap_link = that.data('wrap_link');
        if (wrap_from == 'system') {
            $('.lego-cover-custom').hide();
            $('.lego-cover-system').show();
        } else {
            $('.lego-cover-custom').show();
            $('.lego-cover-system').hide();
        }
        if (wrap_link) {
            $('.lego-cover-upload-img').html('<img src="' + wrap_link + '" />');
        } else {
            console.log('no wrap');
            if (wrap_from != 'system') {
                $('#lego-cover-upload-img').html('点击上传');
            }
        }

    });


    upload_init({
        btn: 'lego-cover-upload',
        container: 'lego-upload-container',
        process: '#lego-upload-process-1',
        fileadded: function() {
            $('#lego-cover-upload-img').html('');
            $('#lego-upload-process').show();
        },
        success: function(ret) {
            if (ret.status == 200) {
                $('#lego-cover-upload-img').html('<img src="' + ret.path + '" />').data('wrap_link', ret.path);
                $('.lgm-icon-selectWrap.lgm-icon-selected').data('wrap_link', ret.path);
                setTimeout(function() {
                    $('#lego-upload-process').hide();
                }, 1000)
            } else {
                PopTips(0, '请确认图片格式');
            }

        },
        error: function() {
            console.log('error');
            console.log(arguments);
        }

    });

    $('.lego-cover-toStyle').on('click', function() {

        window.parent.postMessage({
            action: "set_app_style",
            cptid: ids.cptId
        }, "*");

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
            if (nav_len == 1) {
                PopTips(0, '导航最少设置1项');
                return;
            }
            item.remove();
        });

    }

    initSlide();
});