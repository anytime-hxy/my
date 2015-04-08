;(function(window, document, undefined){
    var $ = {
        getIds: function(div){
            var ids = {};
            ids.cptId = div.data("cptid");
            ids.cptName = div.data("cptname");
            ids.appId = div.data("appid");
            ids.plugId = div.data("plugid");
            ids.pkgname = div.data("pkgname");
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
        //获取globalCptData中的cpton信息
        getGlobalCpt: function($item, $name) {
            for (var key in $item) {
                if ($item[key]['cptOn'] == 'disable' && $item[key]['cptName'] == $name) {
                    return $item[key]['cptOn'];
                }
            }
            return null;
        }
    };
    window.runtime = $;
}(window, document));
