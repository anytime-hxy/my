(function($){
    // runtime for page
    $.extend($, {
        getIds: function(div){
            var ids = {};
            ids.cptId = div.data("cptid");
            ids.cptName = div.data("cptname");
            ids.appId = div.data("appid");
            ids.plugId = div.data("plugid");
            ids.pkgname = div.data("pkgname");
            ids.isPreview = div.data("ispreview");
            return ids;
        },
        buildPostPack: function(ids, options){
            options = options || {};
            options.cptid = ids.cptId || "";
            options.plugid = ids.plugId || "";
            var postPack = {
                cpts:[{
                    "pkg": ids.pkgname || "lego",
                    "cptname": ids.cptName || "",
                    "option": options
                }]
            };
            try{
                return {"data": JSON.stringify(postPack)};
            }catch(e){}
        },
        getUrlParam: function(param){
            var queryStr = document.location.search.toString(),
            strReg = new RegExp('[&?]' + param + '=([^&]*)'),
            strRegRes = strReg.exec(queryStr);
            return strRegRes? strRegRes[1]:'';
        },
        getCUID: function(cb){
            var cuid_name = 'app-cuid';
            var cuid = $.fn.cookie(cuid_name);
            if(cuid)  return cb(cuid);
            //先从框里拿
            var option = {
                url: 'http://127.0.0.1:7777/getcuid',
                dataType: 'jsonp',
                callback: 'callback',
                success: function(ret, status, xhr){
                    console.log(ret);
                    if(ret.error === 0){
                        cuid = ret.cuid;
                        $.fn.cookie(cuid_name, cuid, {expires: 10000});
                    }else{
                        cuid = createLocal(); 
                    }
                    cb(cuid);

                },
                error: function(){
                    console.error('get cuid failed');
                    var cuid = createLocal();
                    cb(cuid);
                }
            };
            console.log(option);
            $.ajax(option);
            // create it and set in cookie
            function createLocal(){
                var rand1 = (''+Math.random(1)).substr(2);
                var rand2 = (''+Math.random(1)).substr(2);
                var timestamp = '' + (+ new Date());
                var cuid = rand1 + rand2 + '|CO'  + timestamp;
                $.fn.cookie(cuid_name, cuid, {expires: 10000});
                return cuid;
            }
        },
    });


})(Zepto);
