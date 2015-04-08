var plupload_start_time = 0;
var plupload_file_size = 0;
var plupload_file_process = 0;
var plupload_file_already = 0;
var plupload_file_ok = false;
var plupload_process_wrap = null;
var plupload_pro = null;
var background_image = "background-image: linear-gradient(-45deg,rgba(255, 255, 255, 0.15) 25%,rgba(0, 0, 0, 0) 25%,rgba(0, 0, 0, 0) 50%,rgba(255, 255, 255, 0.15) 50%,rgba(255, 255, 255, 0.15) 75%,rgba(0, 0, 0, 0) 75%,rgba(0, 0, 0, 0));background-repeat: repeat-x;"
function plupload_start(file_size, con){
    plupload_start_time = + new Date();
    plupload_file_size = file_size;
    plupload_file_already = 0;
    plupload_file_ok = false;
    plupload_process_wrap = con;
    if(!$('#plupload-pro-wrap').length){
        plupload_process_wrap.append('<div style="height: 20px;background-color: #f7f7f7;background-repeat: repeat-x;background-image: -webkit-linear-gradient(top,#F5F5F5,#F9F9F9);text-align: left;" id="plupload-pro-wrap"><div id="plupload-pro" style="display:inline-block;background-color: #5bc0de;'+background_image+' height: 100%;float:left;-webkit-transition: width .6s ease;transition: width .6s ease;"></div></div>');
    }
    plupload_process_wrap.show();
    plupload_pro = plupload_process_wrap.find('#plupload-pro');
    plupload_pro.css('width', 0);
}
function plupload_process(speed){
    var current_time = + new Date();
    var times = (current_time - plupload_start_time)/1000;
    //plupload_start_time = current_time;
    plupload_file_already = times * speed;
    //var upload_size = times * speed;
    

    var percent = plupload_file_already / plupload_file_size * 100;
    if(plupload_file_ok) return;

    if(plupload_file_already){
        plupload_file_ok = true;
        percent = 98;
    }
    
    console.log(percent);
    plupload_pro.animate({ 'width': percent + '%'});
    console.log(times, speed, plupload_file_already, plupload_file_size);
}
function plupload_end(){
    setTimeout(function(){
        plupload_pro.animate({ 'width': 0, });
        plupload_process_wrap.hide();
    }, 1000);
}
function upload_init(option){
    var token = (function(){
        var queryStr = document.location.search.toString(),
            strReg = new RegExp('[&?]token=([^&]*)'),
            strRegRes = strReg.exec(queryStr);
        return strRegRes? strRegRes[1]:'';
    })();

    var reqUri = '?';
    if(document.location.pathname.toString().indexOf('/runtime') !== -1){
        reqUri = '/runtime?';
    }

    var instance = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        chunk_size: '4mb',
        browse_button : option.btn || 'pickfiles', // you can pass in id...
        container: document.getElementById( option.container || 'container'), // ... or DOM Element itself
        url : option.url || reqUri+'control=aider&caction=imgcloud&format=json&token='+token,//url由应用传入
        filters : {
            max_file_size : '1mb',
            mime_types: [
                {title : "Image files", extensions : "jpg,png,jpeg"},
            ]
        },
        flash_swf_url : '/cptlib/lego/base/lib/Moxie.swf',
        silverlight_xap_url : '/cptlib/lego/base/lib/Moxie.xap',
        init: {
            Init: function(){
                var tmp_container = $(option.container);
                console.log(tmp_container.length);
                console.log('INIT');
                if(tmp_container){
                    var tmp_size = tmp_container.data('size');
                }
                if(option.init) option.init(this);

            },
            PostInit: function(){
                if(option.init) option.init(this);
            },

            FilesAdded: function(up, files){
                console.log(files);
                if(!option.autostart)
                    instance.start();
                console.log('start upload');
                if(option.fileadded) option.fileadded(up, files, instance);
            },

            BeforeUpload: function(up, file){
                console.log('before upload----');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                var file_size = plupload.formatSize(file.size).toUpperCase();
                if(option.process) plupload_start(file.size, $(option.process));
                if(up.runtime == 'html5' && chunk_size){
                    console.log(chunk_size);
                }
            },

            UploadProgress: function(up, file){
                console.log('process----');
                //console.log(this.getOption('chunk_size'));
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                console.log(up.total.bytesPerSec);
                //console.log(file.percent);
                if(option.process) plupload_process(up.total.bytesPerSec);
                if(up.runtime == 'html5' && chunk_size){
                    console.log(chunk_size);
                }
                if(option.progress)  option.progress(file);
            },

            FileUploaded: function(up, file, res){
                console.log('upload ok');
                var ret = $.parseJSON(res.response);
                if(option.process) plupload_end();
                if(option.success) option.success(ret, file);
            },

            Error: function(up, err){
                console.log(err);
                if(err.code == -600){
                    if(PopTips) PopTips(0, '图片大小需在1MB内');
                }
                if(option.error) option.error(err);
            }
        
        
        }
    
    });
    instance.init();
}
