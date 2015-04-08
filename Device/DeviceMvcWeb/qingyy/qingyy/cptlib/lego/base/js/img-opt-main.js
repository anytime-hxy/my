;$(function(){
    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');

    var DEFAULT_SCALE = 320 / 160;
    var DEFAULT_IMAGE_SCALE = 16/9;
    var ids = getIds($('#lego-slide-info'));

    if(ids.cptName == 'pic'){
        DEFAULT_IMAGE_SCALE = $('.lego-slide-item').eq(0).data('img_select_scale');
        if(!DEFAULT_IMAGE_SCALE && DEFAULT_IMAGE_SCALE !== 0 && DEFAULT_IMAGE_SCALE !== '0'){
            DEFAULT_IMAGE_SCALE = 1.777777;
        }
        $('.lgm-icon-selectWrap[data-scale="'+ DEFAULT_IMAGE_SCALE +'"]').addClass('lgm-icon-selected');
    }else{
        DEFAULT_IMAGE_SCALE = $('.lego-image-scaleSlide').data('select_scale') || 1.777777;
        $('.lgm-icon-selectWrap[data-scale="'+ DEFAULT_IMAGE_SCALE +'"]').addClass('lgm-icon-selected');
        $('#lego-scale-global').val(DEFAULT_IMAGE_SCALE);
    }
    //console.log(DEFAULT_IMAGE_SCALE);
    var lego_set_container = $('#lego-slide-setting');
    var render_panel_width = 0;

 $('.lego-slide-container').on('click', '.lego-slide-img', function(){
    $('.lego-slide-opsave').addClass('lego-slide-opdisable').attr('disabled', 'disabled');

    var that = $(this),
        that_item = that.parent(),
        that_saved = that_item.data('saved');

    if(that_saved == '1'){
        //if(!window.confirm('确定重新设置图片?'))  return ;
    }
    var that_key = that_item.data('key');

    $('#lego-slide-setting-mask').show();
    $('#lego-slide-setting').attr('data-key', that_key).show();

    var lego_preview = $('#lego-preview-wrap1'),
        lego_preview_2 = $('#lego-preview-wrap2'),
        lego_from = $('.lego-slide-fromset'),
        lego_preview_width = lego_from.width() - 2;


    var h = lego_preview_width / DEFAULT_SCALE;
    var preview_h = h; //lego_preview_width / DEFAULT_IMAGE_SCALE;
    lego_preview.css('height', h);
    //lego_preview_2.css('height', preview_h);
    render_panel_width = lego_preview_width;
    wrap_img = {'w': lego_preview_width, 'h': h};

    var is_default = that_item.data('isdefault');
    if(is_default != '1'){
        preview_cut.call({'tagName':'', 'type': 'saved', 'dom': that_item});
    }

 });

 $('.lego-image-scale>div').on('click', function(){
    var that = $(this);
    DEFAULT_IMAGE_SCALE = that.data('scale');
    if(jcrop_api && jcrop_api.setOptions){
        jcrop_api.setOptions({'aspectRatio': DEFAULT_IMAGE_SCALE});
    }
    $('#image-scale').val(DEFAULT_IMAGE_SCALE);
 });

 var jcrop_api;
 var jcrop_select = {
    'x': 0,
    'y': 0,
    'x2': 320,
    'y2': 160 ,
    'sacle': 1
 };



 $('.lego-slide-upload-div').on('click', function(){
    $('#lego-file').click();
 });
 var is_file_change = 0;
 $('#lego-file').on('change',preview_cut);
 $('.lego-slide-netsubmit').on('click', preview_cut);
 $('#lego-slide-netinput').on('paste', check_preview_cut)
     .on('input', check_preview_cut)
     .on('blur', preview_cut);

 function check_preview_cut(e){
    var that = $(this),
        that_val = that.val();
    //if(!that_val)  return;

    var ext = that_val.substring(that_val.lastIndexOf(".") + 1).toLowerCase();
    if(!support_ext[ext]) { 
        if(e.type == 'paste'){
            //PopTips(0, '图片格式需为jpg, png, jpeg'); 
            return;
        }
        return;
    }
    $('.lego-slide-netsubmit').click();
 }



var support_ext = {'jpeg': 1, 'png': 1, 'jpg': 1};
        
function preview_cut(){
    var that = $(this);
    var from_local = this.tagName == 'INPUT' ? true : false;
    var $img = $('#lego-preview').eq(0);
    var img = $img.get(0);
    var type = this.type;
    if(type == 'saved'){
         
        var datas = this.dom.data();
        delete datas['sortableItem'];
        if(datas.img_from == 'local'){
            $('.lego-slide-from').find('span').eq(0).click();
        }else{
            $('.lego-slide-from').find('span').eq(1).click();
            $('#lego-slide-netinput').val(datas.img_bcs_src);
        }
        var reader = new Image();
        is_file_change = 1;
        clear_jcrop(1);
        $('#lego-slide-process-1').text('加载中').show();
        if(false && reader.complete){
            onload_fun.apply(reader); 
        }else{
            reader.onload = onload_fun;
        }
        reader.src = datas.img_bcs_src; 
        $('#lego-file-store').val(datas.img_bcs_src);
        return;
    }
    if(from_local){
        var file = this,
            ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();
        if(!support_ext[ext]) {
            PopTips(0, '图片格式需为jpg, png, jpeg'); 
            this.file = '';
            this.value = '';
            return;
        }
        var current_file = file.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(current_file);
        window.reader = reader;
        is_file_change = 1;
        clear_jcrop(1);
        reader.onload = onload_fun;
    }else{
        var img_url = that.siblings('.lego-slide-netinput').find('input').val(); 
        if(!img_url){
            PopTips(0, '请填写图片地址');
            return;
        }
        var ext = img_url.substring(img_url.lastIndexOf(".") + 1).toLowerCase();
        if(!support_ext[ext]) {
            PopTips(0, '图片格式需为jpg, png, jpeg'); 
            return;
        }

        var reader = new Image();
        is_file_change = 1;
        clear_jcrop(1);
        if(false && reader.complete){
            onload_fun.apply(reader); 
        }else{
            reader.onload = onload_fun;
            reader.onerror = error_fun;
        }
        reader.src = img_url;
    }
    

    function error_fun(e){
        //console.log(arguments);
        if(e.type == 'error'){
            PopTips(0, '获取图片出错，请确认该图片存在且未设置防盗链'); 
            return;
        }
    }
    
    function onload_fun (e){
    
        $img.parent().css({'width': '100%', 'display': 'none'});
        var img_src = from_local ? this.result : this.src; 
        $('#lego-slide-process-1').text('上传中').hide();
        if(from_local){
            var size_len = this.result.length;
            var max_size_len =  1456128; //711000; // 2184192;
            if(size_len > max_size_len){
                PopTips(0, '图片大小需小于1M'); 
                reader = null;
                return;
            }
        }
        if(img.complete){
            if(img.src){
                set_img_wrap($(img));
                after_load();
            
            }
            img.src = from_local ? this.result : this.src; 
        }
        img.onload = function(){
            $('.lego-slide-opsave').removeAttr('disabled').removeClass('lego-slide-opdisable');
            set_img_wrap($(img));
            after_load();
        }
       img.src = from_local ? this.result : this.src; 

       function after_load(){
            $('#lego-preview-wrap1').addClass('lego-slide-active');
            $('#lego-preview-wrap2').addClass('lego-slide-active');
            //console.log(jcrop_select);
            console.log(DEFAULT_IMAGE_SCALE);
            var allowSelect = DEFAULT_IMAGE_SCALE == 0 ?  true: false;
            var aspectRatio = DEFAULT_IMAGE_SCALE;
            $(img).Jcrop(
                 {
                     'bgFade': true,
                     'bgOpacity': 0.3,
                     'allowSelect': allowSelect, /*ids.cptName == 'slide' ? false : true,*/
                     'setSelect': [0,0,jcrop_select.x2, jcrop_select.y2],
                     'aspectRatio': aspectRatio, /*ids.cptName == 'slide' ? DEFAULT_IMAGE_SCALE : 0,*/
                     'onChange': function(select){ 
                        if(ids.cptName != 'slide'){
                            
                            for(var item in select){
                                var $tmp = $('#lego-file-' + item);
                                if($tmp.length){
                                    $tmp.val(select[item]);
                                }
                            }
                        }
                        if(ids.cptName == 'slide')
                            preview_with_cut(select);
                     },
                     'onSelect': function(select){ 
                         //preview_with_cut(select);
                         
                         for(var item in select){
                             var $tmp = $('#lego-file-' + item);
                             if($tmp.length){
                                 $tmp.val(select[item]);
                             }
                         }
                         //console.log(select); 
                     }
                }, function(){
                     jcrop_api = this;
                }
             );
             //lego_process_bg.css('background-image', 'url('+img.src  +')');
             lego_process_bg_img.attr('src', img.src);
        }
    }
};
var lego_process_bg = $('#lego-slide-process-2-bg');
var lego_process_bg_img = lego_process_bg.children('img');

$('.lego-slide-from').on('click', 'span', function(){
    var that = $(this),
        that_from = that.data('from'),
        that_siblings = that.siblings();

    if(!that_from) return;
    if(that.hasClass('chosed')) return;
    var img_preview = $('#lego-preview');
    if(img_preview.attr('src')){
        newConfirm({
            dom: that,
            tips: '确定放弃当前裁切的图片吗？',
            ok_p: ok_p,
            btn : true, 
            width: 220
        });
        return;
    }
    ok_p();

    return false;
    function ok_p(){
    
        clear_jcrop();
        that_siblings.each(function(){
            var me = $(this), 
                me_from = me.data('from');

            me.removeClass('chosed');
            $('.lego-slide-' + me_from).hide();
            
        });
        that.addClass('chosed');
        $('#lego-from-set').val(that_from);

        $('.lego-slide-' + that_from).show();

    }
    
})


$('.lego-slide-op').on('click', 'input.lego-slide-opsave', function(){

    var that = $(this);
    if(this.className == 'lego-slide-opdel') return;

    var that_form = that.parents('form');

    // SUBMIT the file
    var from_type = $('#lego-from-set').val();
    var store_file = $('#lego-file-store').val();
    if(store_file && from_type == 'local'){
        that_form.submit();
        $('#lego-slide-process-1').show();
        return;
    }
    if(from_type == 'local'){
        // from local
        var input_file = $('#lego-file');
        if(!input_file.val()){
            PopTips(0, '请先选择本地图片');
            return;
        }
    }else{
        // from net
        var address_text = $('#lego-slide-netinput');
        var address_text_str = address_text.val();
        var ext = address_text_str.substring(address_text_str.lastIndexOf(".") + 1).toLowerCase();
        if(!support_ext[ext]) {
            PopTips(0, '图片格式需为jpg, png, jpeg'); 
            return;
        }
        if(!address_text.val()){
            PopTips(0, '请先填写图片地址');
            return;
        }
    }
    that_form.submit();
    $('#lego-slide-process-1').show();

});


$('#lego-slide-save').on('click', 'input', function(){
    var that = $(this);
    var lego_slide_items = $('.lego-slide-container').children();
    var req_data = {};
    var slide_params = [];
    var is_pass = 0;
    var require_dict = {'img_thumb_src': true, 'img_bcs_src': true, 'img_timg_src': true, 'img_select_scale': true};
    var warning_item = null;
    var warning_reason = '';
    lego_slide_items.each(function(){
        var current_item = $(this);
        warning_item = current_item;
        var tmp_data = current_item.data(); 

        if (ids.cptName == 'imgs') {
            tmp_data['img_desc'] = current_item.find('.lego-imgs-desc').val();
            if(getLen(tmp_data['img_desc']) > 200 * 2){
                warning_reason = '图片描述请在200字内';
                is_pass = 1;
                current_item.focusDom();
                return false;
            }
        } else {
        var data_name = current_item.find('.lego-slide-imgname').val();
        /*var data_link_from = current_item.find('.lego-slide-imglinkfrom').val();
        var data_link = current_item.find('.lego-slide-imglink').val();
        */
        var data_link_from = current_item.find('.lego-nav-type').attr('data');
        if(data_link_from == 'outer'){
            var data_link = current_item.find('.lego-nav-text').val();
        }else{
            data_link_from = 'inner';
            var data_link = current_item.find('.lego-nav-page').attr('data');
        }
        //var data_name = current_item.find('');
        tmp_data['img_name'] = data_name;
        tmp_data['img_link_from'] = data_link_from;
        tmp_data['img_link'] = data_link;

        if(getLen(data_name) > 16 * 2){
            warning_reason = '图片描述请在16字内'; 
            current_item.focusDom();
           is_pass = 1; 
           return false;
        }

        switch(tmp_data['img_from']){
            case 'local':
                break;
            case 'net':
            case 'db':
                break;
            default:
                warning_reason = '请设置图片'; 
                is_pass = 10;
                current_item.focusDom();
                return false;
                break;
        }
        }

        for(var item_key in tmp_data){
            if(require_dict[item_key]){
                if(!tmp_data[item_key] && tmp_data[item_key] != '0'){
                    warning_reason = '请设置图片';
                    is_pass = 2;
                    current_item.focusDom();
                    return false;
                    break;
                }
            }
        }

        delete tmp_data['sortableItem'];
        slide_params.push(tmp_data);
    });
    switch(is_pass){
        case 1:
        case 2:
        case 10:
            PopTips(0, warning_reason, warning_item);
            return;
    }

    req_data['imgs'] = slide_params;
    if (ids.cptName == 'slide') {
        var lego_timeset = $('#lego-slide-timeset');
        if(lego_timeset.length){
            req_data['time'] = lego_timeset.find('#lego-slide-times').val();
            req_data['scale'] = DEFAULT_IMAGE_SCALE;
        }
    } else if (ids.cptName == 'imgs') {
        req_data['column'] = $('#lego-imgs-columns').val();
        req_data['title'] = $('#lgm-imgs-title').val();
        req_data['scale'] = DEFAULT_IMAGE_SCALE;
    }

    var postPack = buildPostPack(ids, req_data);
    var url = '?control=option&caction=edit&format=json&token='+token;
    $.ajax({
        'url': url,
        'type': 'POST',
        'data':  postPack,
        'success': function(data, status){
            var res = data[ids.cptId];
            if(res.status == 200){
                window.parent.postMessage({
                    action:'refresh',
                    cptid: ids.cptId
                },'*');
                PopTips(1, '保存成功');
            }else{
                PopTips(0, '保存失败');
            }
        },
        'error': function(){
            PopTips(0, '网络出现异常');
        }
    });
    
});

$('.lego-slide-container').on('click', '.lego-slide-detail3 div', function(){
    var slide_item = $(this).parents('.lego-slide-item');
    var is_default = slide_item.data('isdefault');
    var key = slide_item.data('key');
    var slide_items = $('.lego-slide-item'),
        slide_item_len = slide_items.length;
    if(ids.cptName == 'pic'){
        if(slide_item_len < 2){
            PopTips(0, '不可删除默认项');
            return;
        }
    }else{
        if(slide_item_len < 3){
            var tips = '幻灯片图片数不得少于2张';
            if (ids.cptName == 'slide') {
               tips = '幻灯片图片数不得少于2张';
            } else if (ids.cptName == 'imgs') {
                tips = '图集图片数不得少于2张';
            }
            PopTips(0, tips);
            return;
        }
    }
    if(!is_default){
        //if(!window.confirm('确认删除？')) return;
        newConfirm({
            dom: this,
            tips: '确认删除？',
            btn: true,
            ok_p: function(){
                slide_item.fadeOut(400, function(){
                    setTimeout(function(){
                        slide_item.remove();
                    }, 100);
                });
            }
        });
        return;
    }
    slide_item.fadeOut(400, function(){
        setTimeout(function(){
            slide_item.remove();
        }, 100);
    });
});

$('#lego-slide-add').on('click', 'input,div', function(){
    var container = $('.lego-slide-container');
    var lego_slide_items = container.children();
    if(ids.cptName == 'slide'){
        if(lego_slide_items.length > 5){
            PopTips(0, '最多可展示6张图片');
            return;
        }
    } else if (ids.cptName == 'imgs') {
        if(lego_slide_items.length > 20){
            PopTips(0, '最多可展示20张图片');
            return;
        }
    }

    var lego_slide_item = container.children().eq(0);
    var item_clone = lego_slide_item.clone();
    var item_key = + new Date();
    var clean_data_key = {'bcs_src': true, 'from': true, 'thumb_src': true, 'timg_src': true, 'select_scale': true};
    for(var key in clean_data_key){
        item_clone.attr('data-img_' + key, '');
    }
    item_clone.attr('data-key', item_key);
    item_clone.attr('data-isdefault', 1);
    item_clone.find('.lego-slide-thumb').attr({'src': '', 'title': ''}); 
    item_clone.removeClass('lego-common-required'); 
    item_clone.find('.lego-thumb-default').removeClass('lego-slide-saved').show();
    if(ids.cptName == 'slide'){
        item_clone.find('.lego-slide-imgname').val('');
        item_clone.find('.lego-nav-pagediv .lego-select-text').attr('data', '').html('选择链接').parent().show();
        item_clone.find('.lego-nav-text').val('').hide();
        item_clone.find('.lego-nav-typediv .lego-select-text').attr('data', '').html('站内链接');
    } else if (ids.cptName == 'imgs') {
        item_clone.find('.lego-imgs-desc').val('');
    }

    var new_item = container.append(item_clone);
    new_item.focus();

});

function shut_setting_panel(){
    $('#lego-slide-setting-mask').hide();
    lego_set_container.hide().removeAttr('data-key');
    clear_jcrop();
};
$('.lego-slide-setdel').on('click', shut_setting_panel);
$('.lego-slide-opdel').on('click', shut_setting_panel);

window.handler_upload = function(ret){
    $('#lego-slide-process-1').hide();
    if(ret.status == 200){
        var key = $('#lego-slide-setting').attr('data-key');
        var data = ret.data;
        var img_src =  ret.data.thumb_src;
        var data_dict = {'cut_x': 1, 'cut_y': 1, 'cut_w': 1, 'cut_h': 1, 'timg_src': 1, 'bcs_src': 1, 'from': 1, 'thumb_src': 1, 'select_scale': 1};
        var current_item = $('.lego-slide-item[data-key='+ key +']');
        current_item.find('.lego-slide-addprocess').show(); 
        current_item.data('isdefault', 0);
        for(var item in data){
            if(!data_dict[item]) continue;
            current_item.data('img_' + item, data[item]); 
        }
        //current_item.data('img_from', 'local');

        var new_image = new Image();
        new_image.onload = function(){
            current_item.find('.lego-slide-addprocess').hide(); 
        }
        new_image.src = img_src;
        
        var image_thumb = current_item.find('.lego-slide-thumb');
        image_thumb.attr('src', img_src).removeClass('lego-thumb-default');
        middleImage(image_thumb.get(0));
        current_item.find('div.lego-thumb-default').hide();
        //current_item.find('.lego-slide-thumb2').attr('src', ret.data.bcs_src);
        shut_setting_panel();
        //PopTips(1, '图片上传成功');
    }
    else{
        PopTips(0, '上传失败');
    }
};

function clear_jcrop(not_del){
    //console.log('jcrop_api', jcrop_api);
    $('#lego-file-store').val('');
    $('#lego-preview').attr('src', '');
    $('#lego-slide-process-2-bg img').attr('src', '').css({'width': '0', 'height': '0'});
    if(!not_del){
    
        $('#lego-file').val('');
        $('#lego-slide-netinput').val('');
    }
    if(!jcrop_api) {
        is_file_change = 0;
        return;
    }
    jcrop_api.destroy();
    jcrop_api = null;
    
    var jcrop_holder = $('.jcrop-holder');
    if(jcrop_holder.length ){
        jcrop_holder.remove();

    }
    if(!is_file_change && !not_del){
        $('#lego-preview-wrap1').removeClass('lego-slide-active');
        $('#lego-preview-wrap2').removeClass('lego-slide-active');
        $('#lego-slide-process-2-bg').css('background-image', 'none');
    }
    $('#lego-preview-wrap1').children('div').first().css({'margin': '0 auto'});
    is_file_change = 0;
}

var render_scale = 1;
var render_nature = {};
var render_img = {};
var wrap_img = {};

function set_img_wrap(img){
    //var DEFAULT_SCALE = DEFAULT_IMAGE_SCALE;
    var nature_img = new Image();
    var nature_img_src = img.get(0).src;
    nature_img.src = nature_img_src;
    var nature_img_width = nature_img.width;
    var nature_img_height = nature_img.height,
        nature_img_scale = nature_img_width/nature_img_height;
    render_nature.h = nature_img_height;
    render_nature.w = nature_img_width;
    if(nature_img_width <= 0 || nature_img_height <= 0) return;

    var img_dom = img.get(0),
        img_width = img_dom.width,
        img_height = img_dom.height,
        img_wrap = img.parent(),
        img_root = img_wrap.parent(),
        img_root_width = img_root.width(),
        img_root_height = img_root.height(),
        img_root_scale = DEFAULT_SCALE,
        img_scale = img_width / img_height;

    var box_width = 0;
    var box_height = 0;
    var min_scale = 1;

    var fix_width = img_root_width;
    var fix_height = img_root_height;
    if(img_width < img_root_width){
       fix_width =  img_width; 
    }
    if(img_height < img_root_height){
        fix_height = img_height;
    }
    var fix_wrap_height, fix_wrap_width;
    //var wrap_margin_top = (img_root_height - fix_height) / 2;
    if(img_scale < DEFAULT_SCALE){
        // BIG HEIGHT
        fix_wrap_height = img_root_height;
        fix_height = img_root_height;
        fix_width = fix_height * nature_img_scale;
        var wrap_margin_left = (img_root_width - fix_width)/2;
        img_wrap.css({'height': fix_height, 'width': fix_width, 'margin-left': wrap_margin_left, 'margin-top': 0});
        img.css({'height':'100%', 'width': 'auto'});
    }else{
        fix_wrap_width = img_root_width;
        fix_width = img_root_width;
        fix_height = fix_width / nature_img_scale;
        var wrap_margin_top = (img_root_height - fix_height)/2;
        img_wrap.css({'width': fix_width, 'height': fix_height, 'margin-top': wrap_margin_top, 'margin-left': 0});
        img.css({'width':'100%', 'height': 'auto'});
    }

    render_img = {'width': fix_width, 'height': fix_height};
    img_wrap.show();
    
    //img_wrap.css({'width': fix_width, 'margin-top': wrap_margin_top});

    if(img_scale < DEFAULT_IMAGE_SCALE){
        // HEIGHT BIG
       box_width = fix_width; 
       min_scale =  nature_img_width / fix_width;

    }else{
        // WIDTH BIG
        box_height = fix_height;
       box_width = box_height * DEFAULT_IMAGE_SCALE; 
       min_scale = nature_img_height / fix_height;
        //box_width = fix_width < img_width ? fix_width
    }

    render_scale = min_scale;
    jcrop_select = {
        'x': 0,
        'y': 0,
        'x2': box_width || 100,
        'y2': box_width / DEFAULT_IMAGE_SCALE || 100,
        'scale':  min_scale,
        'w': box_width,
        'h': box_width / DEFAULT_IMAGE_SCALE || 100
    }

    for(var item in jcrop_select){
        var tmp = $('#lego-file-' + item);
        if(tmp.length){
            tmp.val(jcrop_select[item]);
        }
    }
}

function preview_with_cut(sel){
    // preview when cut the img


    var rx = wrap_img.w / sel.w,
        ry = wrap_img.h / sel.h;


    lego_process_bg_img.css({
        'width': Math.round(rx * render_img.width) + 'px',
        'height': Math.round(ry * render_img.height) + 'px',
        'margin-left': '-' + Math.round(rx * sel.x) + 'px',
        'margin-top': '-' + Math.round(ry * sel.y) + 'px'
    });
}


});
