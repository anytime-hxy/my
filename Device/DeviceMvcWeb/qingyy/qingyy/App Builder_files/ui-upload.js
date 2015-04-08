
//区分编辑态等等
//区分图片来源

//图像裁剪比例等等
//正确回调
//错误回调等等
//初始化回调

//初始化回调

(function(){

    var token = (function(){
        var queryStr = document.location.search.toString(),
            strReg = new RegExp('[&?]token=([^&]*)'),
            strRegRes = strReg.exec(queryStr);
        return strRegRes? strRegRes[1]:'';
    })();

    var lgmUpload = function(opt){
        var default_option = {
            'btn': '.xxxx',
            'init': function(){},
            'success': function(){},
            'error': function(){},
            'dataFrom': '.xxx',
            'data': {  // from btn
                edit: true,
                scale: 1,
                img: ''
            },
            conf: {
                'scale': false
            }
        };
  
        var option = $.extend({}, default_option, opt);
        var btn = $(option.btn);
        var lego_mask = $('#lgm-comUp-mask'),
            lego_set = $('#lgm-comUp-set'),
            lego_preview = $('#lgm-comUp-preview-wrap1'),
            lego_from = $('.lgm-comUp-from'),
            lego_from_set = lego_set.find('.lgm-comUp-fromset'),
            lego_scale = lego_set.find('.lgm-comUp-image-scale');

        if(!default_option.conf.scale){
            lego_scale.hide();
        }

      
        initEvent();
        initHeight();
        /*
        init({
            from: 'local',
            scale: 1
        });
       */
        var current_btn = null;
        $('body').on('click', option.btn, function(){
            $('.lgm-comUp-opsave').addClass('lgm-comUp-opdisable').attr('disabled', 'disabled');
            lego_mask.show();
            var that = $(this);
            current_btn = that;
            if(opt.dataFrom){
                var data_wrap = that.closest(opt.dataFrom);
            }else{
                var data_wrap = that;
            }
            console.log(data_wrap.data());
            var data = {};
            data.img = data_wrap.data('up_img') || '';
            var tmp_scale = data_wrap.data('up_scale');
            if(!tmp_scale && tmp_scale != '0' && tmp_scale != 0){
                data.scale = 1.777777;
            }else{
                data.scale = tmp_scale;
            }
            console.log(data);
            data.from = data_wrap.data('up_from') || 'local';
            clearComUp();
            init(data);
            lego_set.show();
            initHeight();
        });
       
        function init(data){
           
            lego_from.find('span[data-from="'+data.from+'"]').click();
            //console.log(lego_scale.children().eq(data.scale - 1));//.click();
           
            lego_scale.find('.lgm-icon-selectWrap[data-scale="'+data.scale+'"]').click();

            var img = processTimg(data.img);
            console.log('before ', data.img, ' after ', img);
            console.log('current img ', img);
            if(img){
                // edit
                lego_set.data({'edit': 1, 'up_img': img});
                var tmp_img = new Image();
                tmp_img.onload = image_onload;
                tmp_img.src = img;
            }else{
                // a new picture
                
            }
        }

        function processTimg(img){
            return LgmParseTimg(img);
        }

        function initHeight(){
            var h = lego_preview.width() / 2;
            lego_preview.css('height', h);
            console.log(h);
        }

        function clearComUp(){
            lego_set.data({'up_img': '', 'edit': 0});
            lego_preview.removeClass('lgm-comUp-crop-active');
            lego_preview_img_wrap.css({
                height: 0, margin: 0, width: 0
            });
            lego_from.find('span[data-from="local"]').click();
            lego_scale.find('.lgm-icon-selectWrap[data-scale="1.777777"]').click();
            lego_preview_img_dom.attr('src' , '');
            lego_set.find('#lgm-comUp-netinput').val('');
            clear_jcrop();
        }

        var upload_instance = null;
        var current_from = 'local';

        function initEvent(){

            // init the image from
            var support = ['local', 'net'];
            lego_from.on('click', 'span', function(){
                var span = $(this),
                    from = span.data('from');
                if(span.hasClass('chosed')) return;
                span.siblings().removeClass('chosed');
                span.addClass('chosed');
                current_from = from;
                for(var i = 0, len = support.length; i < len; i++){
                    var tmp_from = support[i];
                    var tmp_dom = lego_from_set.find('.lgm-comUp-' + tmp_from);
                    if(tmp_from != from){
                        tmp_dom.hide();
                    }
                    else{
                        tmp_dom.show();
                    }
                }
            });

            // init upload plugin
            upload_init({
                btn: 'lgm-comUp-upload-div',
                container: 'lgm-comUp-upload',
                autostart: true,
                fileadded: function(up, files, instance){
                    upload_instance = instance;
                    window.up = up;
                    window.files = files;
                    console.log('fileadded', arguments);
                    lego_set.data({'up_img': '', 'edit': 0});
                    var current_file = files[files.length - 1].getNative();
                    var reader = new FileReader();
                    reader.onload = image_onload;
                    reader.readAsDataURL(current_file);
                    window.reader = reader;
                    clear_jcrop();
                    console.log('file added');
                },
                success: function(ret, file){
                    console.log(ret, file);
                    $('#lgm-comUp-process-1').hide();
                    $('.lgm-comUp-setDel').click();
                    if(option.success){
                        option.success(current_btn, wrap_data(ret));
                    }
                },
                error: function(err_obj){
                    if(err_obj.code == -600){
                        PopTips(0, '图片尺寸请在1M内');
                    }
                    $('#lgm-comUp-process-1').hide();
                    if(option.error){
                        option.error(current_btn);
                    }

                    console.log('error', arguments);
                }
            });


            // start to upload
            $('.lgm-comUp-op').on('click', 'input', function(){
                var that = $(this);
                if(that.hasClass('lgm-comUp-opsave')){
                    crop_result.scale = crop_relative_scale;
                    crop_result.crop = 1;
                    crop_result.x = Math.round(crop_result.x * crop_result.scale);
                    crop_result.y = Math.round(crop_result.y * crop_result.scale);
                    crop_result.w = Math.round(crop_result.w * crop_result.scale);
                    crop_result.h = Math.round(crop_result.h * crop_result.scale);


                    if(current_from == 'local'){
                        var is_edit = lego_set.data('edit');
                        console.log(current_from, is_edit);
                        if(is_edit){
                            var img_url = lego_set.data('up_img');
                            var data = crop_result;
                            crop_result.src = img_url;
                            submitNetImage(crop_result);
                        }else{
                            if(upload_instance){
                                upload_instance.settings.multipart_params = crop_result;
                                upload_instance.start();
                                // pop panel
                                $('#lgm-comUp-process-1').show();
                            }else{
                                PopTips('1', '请选择图片');
                            }
                        }
                    }else{
                        var data = crop_result;
                        crop_result.src = $('#lgm-comUp-netinput').val();
                        submitNetImage(crop_result);
                    }
                }else{
                    console.log('close panel');
                    lego_mask.hide();
                    lego_set.hide();
                }
            });
            $('.lgm-comUp-setDel').click(function(){
                    lego_mask.hide();
                    lego_set.hide();
            });

            function submitNetImage(data){
                $.ajax({
                    url: '?control=aider&caction=imgcloud&format=json&type=cropimg&token='+token,
                    type: 'POST',
                    data: {"data": data},
                    dataType: 'json',
                    success: function(data){
                        if(data.status == '200'){
                            if(option.success) option.success(current_btn, wrap_data(data));
                            $('.lgm-comUp-setDel').click();
                        }
                    },
                    error: function(){
                        console.log('error net image', arguments);
                        if(option.error) option.error(current_btn);
                    }
                });
            }

            function wrap_data(data){
                data.scale = crop_scale;
                data.from = current_from;
                return data;
            }


            $('#lgm-comUp-netinput').on('paste', check_net_preview)
                .on('input', check_net_preview)
                .on('blur', preview_net_cut);
            $('.lgm-comUp-netsubmit').on('click', preview_net_cut);

            // init scale change
            $('.lgm-comUp-image-scale').on('click', '.lgm-icon-selectWrap', function(){
                var that = $(this),
                    that_scale = that.data('scale');
                //console.log(that_scale);
                crop_scale = + that_scale;
               
                if(jcrop_api && jcrop_api.setOptions){
                    jcrop_api.setOptions({'aspectRatio': crop_scale});
                }
            });
        }
        var support_ext = {'jpeg': 1, 'png': 1, 'jpg': 1};
        //检测URL是否合法
        function check_net_preview(e){
            var that = $(this),
                that_val = that.val();
            if(!that_val)  return;

            var ext = that_val.substring(that_val.lastIndexOf(".") + 1).toLowerCase();
            if(!support_ext[ext]) {
                if(e.type == 'paste'){
                    //PopTips(0, '图片格式需为jpg, png, jpeg');
                    return;
                }
                return;
            }
            $('.lgm-comUp-netsubmit').click();
        }

        function preview_net_cut(){
            var url = $('#lgm-comUp-netinput').val();
            clear_jcrop();
            var tmp_img = new Image();
            tmp_img.onload = image_onload;
            tmp_img.src = url;
            console.log(this);
        }
        var lego_preview_wrap = $('#lgm-comUp-preview-wrap1');
        var lego_preview_img_wrap = lego_preview_wrap.children().eq(0);
        var crop_result = {};
        var crop_relative_scale = 1; //为了裁切，缩放的比例。
        var crop_scale = 1.777777; //图像裁切比例
        var lego_preview_img_dom = $('#lgm-comUp-preview-img');

        function image_onload(){
            lego_preview_img_wrap.css({'width': 'auto', 'height': 'auto', 'margin': '0'});
            var file = this;
            var img_src = this.result || this.src;
            var tmp_img = new Image();
            tmp_img.onload = function(){ 
                $('.lgm-comUp-opsave').removeAttr('disabled').removeClass('lgm-comUp-opdisable');

            // caculate the width and height
                window.tmp_img = tmp_img;
                var nature_w = tmp_img.width,
                    nature_h = tmp_img.height,
                    nature_scale = nature_w / nature_h;

                var panel_w = lego_preview_wrap.width(),
                    panel_h = lego_preview_wrap.height();

                //console.log(panel_w, panel_h, nature_w, nature_h);

                var panel_scale = 2;
                if(nature_scale > panel_scale){
                    //设置上下margin
                    var relative_scale = nature_w/panel_w;
                    crop_relative_scale = relative_scale;
                    var fix_w = panel_w;
                    var fix_h = nature_h / relative_scale;
                    var fix_margin =( panel_h - fix_h ) /2;
                    //console.log({width: fix_w, height: fix_h, 'margin-top': fix_margin});
                    lego_preview_img_wrap.css({width: fix_w, height: fix_h, 'margin-top': fix_margin});
                    lego_preview_img_dom.css({'width': '100%', 'height': '100%'});
                    
                }else{
                    //设置上下margin
                    var relative_scale = nature_h/panel_h;
                    crop_relative_scale = relative_scale;
                    var fix_h = panel_h;
                    var fix_w = nature_w / relative_scale;
                    var fix_margin =( panel_w - fix_w ) /2;
                    //console.log({width: fix_w, height: fix_h, 'margin-left': fix_margin});
                    lego_preview_img_wrap.css({width: fix_w, height: fix_h, 'margin-left': fix_margin});
                    lego_preview_img_dom.css({'height': '100%', 'width': '100%'});
                }
               
                lego_preview_img_dom.attr('src', img_src);
                lego_preview_wrap.addClass('lgm-comUp-crop-active');

                init_crop();
           
            }
            tmp_img.src = img_src;
           
           
            console.log(img_src);
            console.log(this);
            console.log('image_onload');
        }

        var jcrop_api = null;
        function clear_jcrop(){
            window.jcrop_api = jcrop_api;
            if(jcrop_api) jcrop_api.destroy();
        }
        function init_crop(){
            $('#lgm-comUp-preview-img').Jcrop(
            {
                'bgFade': true,
                'bgOpacity': 0.3,
                'allowSelect': true,
                'setSelect': [0,0,500,500],
                'aspectRatio': crop_scale,
                'onChange': function(select){

                        crop_result = select;
                        //console.log(select);
                },
                'onSelect': function(select){
                        crop_result = select;
                        //console.log(select);
                }
            }, function(){
                jcrop_api = this;
            }
            );

        }
    }

    window.lgmUpload = lgmUpload;



})(jQuery);




