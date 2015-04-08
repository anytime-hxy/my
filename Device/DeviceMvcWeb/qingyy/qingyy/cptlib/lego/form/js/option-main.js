$(document).ready(function(){
    // for name input
    var max_form_name = 16;
    var max_label_name = 16;
    var count_label = $('.lego-form-name3');
    var $form_name = $('.lego-form-name');
    var TOKEN = $('body').attr('data-token');

    count_label.text($form_name.val().length + '/' + max_form_name);

    $('.lego-form-item').attr('data-saved', 1);
    // for add button
    $('#lego-form-add').on('click', 'input, div', function(){
        var form_items = $('.lego-form-item'),
            items_length = form_items.length;
        if(items_length >= 8){
            alert_msg('最多为8个留言板项', 0);
            return;
        }
        var me = $(this),
            me_parent = me.parent(),
            demo_item = form_items.eq(0),
            clone_item = demo_item.clone(),
            now = +new Date(),
            new_key = 'key-' + now;
        clone_item.attr('data-key', new_key).removeAttr('data-saved');
        clone_item.find('input[type=text]').attr('name', new_key).val('').removeClass('lego-form-error').end()
            .find('input[type=checkbox]').attr('name', new_key + '_check').attr('checked', false).end()
            .find('select').val('1').end()
            .find('.lego-form-key-size').html('0/10');
        var new_item = clone_item.insertBefore(me_parent);
        if(items_length == 5){
            me.addClass('lego-form-noadd');
        }
    });

    // for del button
    $('.lego-form-container').on('click', '.lego-form-delbtn', function(){
        var me = $(this),
            me_parent = me.parents('.lego-form-item'),
            me_key = me_parent.data('key');

        if(me_key == 'key1')  {
            PopTips(0, '不可删除默认项'); 
            return;
        }

        if(me_parent.data('saved') == 1){
            newConfirm({
                dom: me,
                tips: '删除后之前用户填写的该项数据则会丢失，确认删除该项？',
                ok_p: function(){
                    me_parent.remove();
                },
                btn: true
            });
        }else{
           me_parent.remove();
           var items = $('.lego-form-item');
           if(items.length < 8){
                $('.lego-form-add').removeClass('lego-form-noadd');
           }
        }
    });

    // submit button
    $('.lego-form-submit').click(function(){
        var form_container = $('.lego-form-container'),
            form_name = $('.lego-form-name').val(),
            form_comment = $('.lego-form-comment').val(),
            form_keys = form_container.find('.lego-form-key'),
            form_keys_check = form_container.find('.lego-form-keycheck'),
            form_items = $('.lego-form-item'),
            form_keys_line = form_container.find('.lego-form-keyline');

        var tmp = [],
            tmp_key = {},
            check_tmp = {},
            line_tmp = {};
        var pass_flag = 0;

        if(!form_name){
            alert_msg('请您填写留言板名', 0, $('.lego-form-name'));
            return;
        }
        if(getLen(form_name) > max_form_name * 2) {
            alert_msg('留言板名字数需在16字内', 0,$('.lego-form-name') );
            return;
        }

        if(getLen(form_comment) > 10 * 2) {
            alert_msg('备注字数需在10字内', 0,$('.lego-form-comment') );
            return;
        }
        var is_error = 0;
        var keys_data = [];
        var keys_dict = {}, keys_name_dict = {};
        form_items.each(function(){
            var that = $(this),
                tmp_key = that.data('key'),
                tmp_text_dom = that.find('.lego-form-key'),
                tmp_text_val = tmp_text_dom.val(),
                tmp_line_dom = that.find('.lego-form-keyline'),
                tmp_line_val = tmp_line_dom.val(),
                tmp_require_dom = that.find('.lego-form-keycheck'),
                tmp_require_val = tmp_require_dom.prop('checked') == true ? 1 : 0;

            if(keys_dict[tmp_key]){
                alert_msg('留言板项名称重复', 0, tmp_text_dom);
                is_error = 1;
                return false;
            }
            keys_dict[tmp_key] = 1;

            if(!tmp_text_val || tmp_text_val.length < 1){
                alert_msg('请您填写留言板项名称', 0, tmp_text_dom);
                is_error = 1;
                return false;
            }
            if(getLen(tmp_text_val) > 16 * 2){
                alert_msg('留言板项名称最多为16个字', 0, tmp_text_dom);
                is_error = 1;
                return false;
            }

            if(keys_name_dict[tmp_text_val]){
                alert_msg('留言板项名称重复', 0, tmp_text_dom);
                is_error = 1;
                return false;
            }
            keys_name_dict[tmp_text_val] = 1;

            keys_data.push({'key': tmp_key, 'name': tmp_text_val, 'required': tmp_require_val, 'line': tmp_line_val });

        });
        if(is_error)  return;

        //组件系统新的传参规范
        var buildPostPack = function(ids, options){
            options = options || {};
            options.cptid = ids.cptId;
            options.plugid = ids.plugId;
            var postPack = {
                cpts:[{
                    "pkg":ids.pkgname || 'lego',
                    "option":options
                }]
            };
            try{
                return {"data": JSON.stringify(postPack)};
            }catch(e){}
        };

        var getIdInfo = function(div){
            var ids = {};
            ids.cptId = div.data("cptid");
            ids.appId = div.data("appid");
            ids.plugId = div.data("plugid");
            ids.pkgname = div.data("pkgname");
            return ids;
        };

        var data = {'name': form_name, 'keys': keys_data , 'comment': form_comment},
            ids = getIdInfo(form_container),
            postPack = buildPostPack(ids, data);

        var request = $.ajax({
            url: '?token=' + TOKEN + '&control=option&caction=edit&format=json',
            type: 'POST',
            data: postPack,
            dataType: 'json'
        });

        request.done(function(data){
            var data = data[ids.cptId];
            if(data.status == 200){
                window.parent.postMessage({
                    action:'refresh',
                    cptid: ids.cptId
                },'*');
                $('.lego-form-item').attr('data-saved', 1);
                alert_msg('保存成功', 1);
            }else{
                alert_msg('保存失败', 0);
            }
        });

    });


    function alert_msg(msg, is_success, dom){
       PopTips(is_success, msg, dom); 
    }

});
