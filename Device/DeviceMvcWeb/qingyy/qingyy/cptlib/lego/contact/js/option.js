$(function() {

    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');

    $('body').bind("showTip", function(e, text, alertType, time, fun) {

        $(".alert").remove();
        var $alter;
        if (!$alter) {
            $alter = $('<div class="alert alert-warning ' + alertType + '">\
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
                    <span class="alter-cont"></span>\
                </div>').appendTo("body");
        }
        $alter.children(".alter-cont").html(text);
        $alter.slideDown(300, function() {
            setTimeout(function() {
                fun && fun();
                $alter.slideUp(300);
            }, time || 800);
        });
    }).on('focus', '.lego-val', function() {
        $(this).removeClass('lego-val-error');
    });

    var fieldsPattern = {
        'name': /^([\u4e00-\u9fa5]|\w){1,20}$/,
        'phone': /^((\d{3})-(\d{4})-(\d{4})|(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
        'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'IM': /^\d{5,12}$/
    }

    function validate() {
        for (var field in fieldsPattern) {
            var p = fieldsPattern[field];
            var $field = $('.lego-val.contact-' + field);
            var val = $field.val();
            if (($field.hasClass('lego-required') || val) && !val.match(p)) {
                var name = $field.siblings('span').contents(':not(em)').text();
                var errorMsg = '格式不正确';
                if (!val.trim()) {
                    errorMsg = '不能为空';
                }
                $("body").trigger("showTip", [name.trim()+errorMsg, 'alertError']);
                $field.addClass('lego-val-error');
                return false;
            }
        }
        return true;
    }
    $.each(option, function(key, value) {
        if (key == 'style') return;
        $('.contact-' + key).val(value);
    })
    // Bind click event
    $('.lego-contact-style').click(function() {
        $('.lego-contact-style').removeClass('selected');
        $(this).addClass('selected').find('input[type=radio]').attr('checked', true);
    });
    $('.lego-contact-style[data-contact-style=' + (option.style || 2) + ']').click();
    var saveBtn = $('.lego-save-btn');
    var ids = getIds($('#LegoMapLayout'));
    saveBtn.click(function() {
        var data = {
            name: $('.contact-name').val(),
            phone: $('.contact-phone').val(),
            email: $('.contact-email').val(),
            IM: $('.contact-IM').val(),
            address: {
                'province': $('#contactP_0').val(),
                'city': $('#contactC_0').val(),
                'area': $('#contactA_0').val(),
                'street': $('#streeName').val(),
                'lng': siteMap.confirmPoint ? siteMap.confirmPoint.lng : mapData.lng,
                'lat': siteMap.confirmPoint ? siteMap.confirmPoint.lat : mapData.lat,
            },
            style: $('.lego-contact-style').has('input[type=radio]:checked').attr('data-contact-style')
        };
        var postPack = buildPostPack(ids, data);

        if (!validate()) return;
        $.ajax({
            url: '?control=option&caction=edit&format=json&token=' + token,
            type: 'post',
            data: postPack,
            success: function(result) {
                if(result[ids.cptId] && result[ids.cptId]['errno'] == 0){
                    PopTips(1, "保存成功");
                    window.parent.postMessage({
                        'action': 'refresh',
                        'cptid': ids.cptId
                    }, '*')
                }else{
                    PopTips(0, "保存失败");
                }
            }
        })
    })
});
