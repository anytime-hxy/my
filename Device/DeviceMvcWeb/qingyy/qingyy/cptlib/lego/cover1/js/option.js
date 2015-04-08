var runtime = window.runtime,
    buildPostPack = runtime.buildPostPack,
    getIds = runtime.getIds;

var token = runtime.getUrlParam('token');

if($('#lego-cover-upload-img img').length > 0){
    $('#lego-cover-upload').css('background', 'none');
}
var cpton = $('body').data('cpton');
var disableColor = '#d0d4d9';
if (cpton && cpton == 'disable') {
    $('.mask-layer').css('display', 'block');
    $('.mask-layer').css('height', $('body').height());
    $('.lgm-icon-selected .lgm-icon-selectMin').css('background-color', disableColor);
    $('.lego-cover-toStyle').css('color', disableColor);
    $('.lego-cover-save').css('background-color', disableColor);
    $('.lgm-select.select').css('background', 'url(/cptlib/lego/base/images/cm-select-disable.png) no-repeat center center');
    $('.lgm-select.select').css('background-size', '13px');
}
$('.lego-cover-save').on('click', function(){

    var wrap_from = $('.lego-cover-select .lgm-icon-selected').data('wrap_from');

    var text_show = $('.lego-cover-textShow').hasClass('select');
    var text = $('.lego-cover-textInput').val();
    var text_align = $('.lego-cover-align-wrap .lgm-icon-selected').data('align');

    if(wrap_from == 'system'){
        wrap_link = '';
    }else{
        wrap_link = $('#lego-cover-upload-img').data('wrap_link');
    }
    var data = {
        'wrap_from': wrap_from,
        'text_show': text_show ? 1: 0,
        'text': text,
        'text_align': text_align,
        'wrap_link': wrap_link
    };

    if(getLen(text) > 32){
        PopTips(0, '字数在16字内');
        return;
    }
    var ids = getIds($('body'));
    var postPack = buildPostPack(ids, data);
    var url = '?control=option&caction=edit&format=json&token='+token;
    LgmPost(url, postPack, function(ret, status, xhr){
        if(ret[ids.cptId] && ret[ids.cptId]['errno'] == 0){
            window.parent.postMessage({
                action: "refresh",
                cptid: ids.cptId
            }, "*");
            PopTips(1, '保存成功');
        }else{
            PopTips(0, '操作失败');
        }
    }, function(){
            PopTips(0, '网络错误');
    });
});


$('.lego-cover-select .lgm-icon-selectWrap').on('click', function(){
    var that = $(this);
    var wrap_from = that.data('wrap_from');
    var wrap_link = that.data('wrap_link');
    if(wrap_from == 'system'){
        $('.lego-cover-custom').hide();
        $('.lego-cover-system').show();
    }else{
        $('.lego-cover-custom').show();
        $('.lego-cover-system').hide();
    }
    if(wrap_link){
        $('.lego-cover-upload-img').html('<img src="'+ wrap_link +'" />');
    }else{
        console.log('no wrap');
        if(wrap_from != 'system'){
            $('#lego-cover-upload-img').html('点击上传');
        }
    }

});

upload_init({
    btn: 'lego-cover-upload',
    container: 'lego-upload-container',
    process: '#lego-upload-process-1',
    fileadded: function(){
        $('#lego-cover-upload-img').html('');
        $('#lego-upload-process').show();
    },
    success: function(ret){
            console.log(ret);
            if(ret.status == 200){
                $('#lego-cover-upload-img').html('<img src="' +ret.path +'" />').data('wrap_link', ret.path);
                $('.lgm-icon-selectWrap.lgm-icon-selected').data('wrap_link', ret.path);
                setTimeout(function(){$('#lego-upload-process').hide();}, 1000)
            }else{
                PopTips(0, '请确认图片格式');
            }

        },
    error: function(){
            console.log('error');
            console.log(arguments);
        }
});

$('.lego-cover-toStyle').on('click', function(){

    var ids = getIds($('body'));
    window.parent.postMessage({
        action:"set_app_style",
        cptid: ids.cptId
    },"*");

});
