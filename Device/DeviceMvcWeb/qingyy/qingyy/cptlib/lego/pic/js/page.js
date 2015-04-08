;
(function(_zepto) {

    if (_zepto.fn.picResize) {
        console.log('picresize already install');
        return;
    }
    _zepto.extend(_zepto.fn, {

        picResize: function() {

            if (!this) return;

            if (!window.picResize_instance) {
                window.picResize_instance = [];
            }
            //初始化、操作插件
            $(this).each(function(index, item) {
                init(_zepto(item));
            });

            function init(pic_root) {
                // 定义变量包括dom节点
                var pic_block = pic_root.find('.lgm-pic-block'); 
                var image_url = pic_block.data('img');
                var scale = pic_block.data('scale');
                var instance = {};
                instance.dom = pic_root;
                instance.block_dom = pic_block;
                instance.refresh = function(){
                    var current_width = filterWidth(instance.dom.width()); 
                    if(instance.scale){
                        var height = current_width/instance.scale;
                        instance.dom.height(height);
                        instance.block_dom.height(height);
                    }
                    resetIframe();
                }
               
                if(scale != '0' && scale != 0){
                    instance.scale = parseFloat(scale);
                    instance.refresh();
                    window.picResize_instance.push(instance);
                    return;
                } 
                
                // 任意比例的
                var img = new Image();
                img.onload = function(){
                    instance.scale = this.width/this.height;
                    instance.refresh();
                    window.picResize_instance.push(instance);
                }
                img.src = image_url;
                if(img.complete){
                    instance.scale = this.width/this.height;
                    instance.refresh();
                    window.picResize_instance.push(instance);
                }



            }

            // 配置窗口宽度
            function filterWidth(width) {
                var tmp_width = width;
                if (!width || width == 0 || parseInt(width) == 316) {
                    tmp_width = 324;
                }
                return tmp_width;
            }

            //onresize 事件
            window.onresize = function() {
                _zepto.each(window.picResize_instance, function(index, item) {
                    if (item.refresh) item.refresh();
                });
            }

            function resetIframe() {
                var url = window.location.search;
                var cptid = url.split(/=|&/)[7];
                var width = document.body.clientWidth;
                var height = document.body.clientHeight || document.documentElement.clientHeight;
                setTimeout(function() {
                    window.parent.postMessage({
                        action: 'set_pop',
                        cptid: cptid,
                        width: width,
                        height: height
                    }, '*');

                }, 300);
            }
        }
    });
})(Zepto);
