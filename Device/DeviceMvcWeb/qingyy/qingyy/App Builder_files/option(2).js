;$(function(){

    var runtime = window.runtime,
        buildPostPack = runtime.buildPostPack,
        getIds = runtime.getIds;

    var token = runtime.getUrlParam('token');

    function responseCheck(response, ids){
        if(!response || !$.isPlainObject(response) || !!response.errmsg){
            return false;
        }
        if(response[ids.cptId]){
            var realData = response[ids.cptId];
            if(realData.errno && realData.errno != 0){
                return false;
            }
        }
        return true;
    }

    //title option
    var legoTitle = {
        initial:function(){
            var that = this;

            that.linkSelect();
            //保存设置信息
            $("#LegoTitleSave").on('click',that.saveTitle);
            this.selectStyle();
        },
        saveTitle:function(){

            var ids = getIds($("#LegoTitleLayout"));

            var text = $("#LegoTitleVal").val().trim();
            var style = $('.title-style-select').attr("data");

            if(text==""){
                $('body').trigger('showTip',['标题名称不能为空','alertError']);
                $("#LegoTitleVal").addClass('lego-val-error');
                return;
            }else if(getByteLen(text)>32){
                $('body').trigger('showTip',['标题名称不能超过16个汉字','alertError']);
                $("#LegoTitleVal").addClass('lego-val-error');
                return;
            }

            var linktype = $("#LegoTitleType").attr('data');
            var pageId,pageTitle,href;
            if(linktype == "inner"){
                pageId = $("#LegoTitlePage").attr('data');
                pageTitle = $("#LegoTitlePage").text();

                if(!pageId){
                    $('body').trigger("showTip",['请选择链接的页面','alertError']);
                    $("#LegoTitlePageDiv").addClass('lego-select-error');
                    return;
                }

            }else if(linktype == 'outer'){
                href = $("#LegoTitleOutHref").val().trim();
                if(!href || !commonUtil.validateURL(href) ){
                    $('body').trigger("showTip",['链接地址格式不正确','alertError']);
                    $("#LegoTitleOutHref").addClass("lego-var-error");
                    return;
                }

                if(href.indexOf('http://')<0){
                   href = "http://"+href;
                }
            }

            var url = "?control=option&caction=edit&format=json";
            var data = {
                "text":text,
                "style":style,
                "linktype":linktype,
                "pageId":pageId,
                "pageTitle":pageTitle,
                "href":href
            };

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({
                        action:"refresh",
                        cptid:ids.cptId
                    },"*");
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        },
        selectStyle:function(){
            $('.lego-title-style-item').on('click',function(){
                $('.lego-title-style-item').removeClass('title-style-select');
                $(this).addClass('title-style-select');
            });
        },
        setSelectPages:function(){
            var lis_html = "<li class='lgm-title-newpage' id='LegoTitleNewPage'>新建页面</li>";
            var LegoTitleLayout = $("#LegoTitleLayout");
            var ids = getIds(LegoTitleLayout);

            var url = "?control=option&format=json&caction=getpages";
            var postPack = buildPostPack(ids, {});
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    var pages = response[ids.cptId];
                    $.each(pages,function(i,item){
                        lis_html += "<li data-pageid='"+item.pageId+"'>"+item.pageTitle+"</li>";
                    });
                    $("#LegoTitlePageSelectList").empty().html(lis_html);
                }
            });
        },
        linkSelect:function(){
            var that = this;

            $("#LegoTitleTypeSelectBtn,#LegoTitleType").on('click',function(){
                $("#LegoTitleTypeSelectList").show();
            });


            $("body").on('mouseleave','#LegoTitleTypeDiv',function(){
                $(this).find("ul").hide();
            });

            $("#LegoTitleTypeSelectList li").on('click',function(e){

                e.stopPropagation();

                $("#LegoTitleTypeSelectList").hide();
                var selected_text = $(this).text();
                var selected_data = $(this).attr('data');

                $("#LegoTitleType").text(selected_text);
                $("#LegoTitleType").attr('data',selected_data);

                if(selected_data == "inner"){
                    //站内链接
                    $("#LegoTitleOutHref").hide();
                    $("#LegoTitlePageDiv").show();

                    //that.setSelectPages();

                }else if(selected_data == "outer"){
                    //站外链接，填写链接地址
                    $("#LegoTitleOutHref").show();
                    $("#LegoTitlePageDiv").hide();
                    $("#LegoTitlePageDiv ul").hide();
                }else{
                    $("#LegoTitleOutHref").hide();
                    $("#LegoTitlePageDiv").hide();
                }

            });

            $("#LegoTitlePageDiv").on('click',function(){
                that.setSelectPages();
            });

            $("#LegoTitlePageSelectBtn,#LegoTitlePage").on('click',function(){
                $("#LegoTitlePageSelectList").show();
            });

            $("body").on('mouseleave','#LegoTitlePageDiv',function(){
                $(this).find("ul").hide();
            });

            $("body").on('click',"#LegoTitlePageSelectList li",function(e){
                e.stopPropagation();
                $("#LegoTitlePageSelectList").hide();

                var selected_text = $(this).text();
                var selected_data = $(this).data('pageid');

                $("#LegoTitlePage").text(selected_text);
                $("#LegoTitlePage").attr("data",selected_data);
            });

            $("body").on('click',"#LegoTitlePageSelectList li",function(){
                $(this).find("ul").hide();
            });

            $('body').on('click','#LegoTitleNewPage',function(){
                $("#LegoTitlePage").attr('data',"");
                window.parent.postMessage({
                    action:"add_page"
                },"*");
            });

            //监听平台传回的message消息
            window.addEventListener("message",function(e){

                var data = e.data;
                if(data.action = "add_success"){
                    var legoTitlePage = $("#LegoTitlePage");
                    if(legoTitlePage.length > 0){
                        $(legoTitlePage).text(data.pageTitle);
                        $(legoTitlePage).attr("data",data.pageId);
                        that.setSelectPages();
                    }
                }

            });
        }
    };


    //message option修改

    var legoMessage = {
        initial:function(){
            var that = this;

            $("#LegoMessageSave").on('click',that.saveMessage);

            $(".lego-message-styles span").on('click',that.style_select);
        },
        saveMessage:function(e){
            e.preventDefault();

            var div = $("#LegoMessageLayout");

            var ids = getIds(div);

            var messageText = $("#LegoMessageVal").val().trim();
            var messageLabel = $("#LegoMessageLabel").val().trim();
            if(commonUtil.isEmpty(messageText)){
                $('body').trigger("showTip",["短信号码不能为空","alertError"]);
                $("#LegoMessageVal").addClass('lego-val-error');
                return;
            }else if(!commonUtil.validateMsg(messageText)){
                $('body').trigger("showTip",["短信号码格式不正确","alertError"]);
                $("#LegoMessageVal").addClass('lego-val-error');
                return;
            }
            if(getLen(messageLabel) > 20){
                PopTips(0, '自定义标签字数在10字内');
                return;
            }

            var style = $('.lego-message-select').attr('data');

            var url = "?control=option&format=json&caction=edit";
            var data = {
                "text":messageText,
                "style":style,
                'label': messageLabel
            };

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger("showTip",["保存成功","alertOk"]);
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        },
        style_select:function(){
            $(".lego-message-styles span").removeClass('lego-message-select');
            $(this).addClass('lego-message-select');
        }
    };


    //telephone option修改

    var legoTel = {
        initial:function(){

            $("#LegoTelephoneSave").on('click',function(){

                var div = $("#LegoTelephoneLayout");
                var ids = getIds(div);

                var telephoneText = $("#LegoTelephoneVal").val().trim();
                var telephoneLabel = $("#LegoTelephoneLabel").val().trim();
                var telephoneLabel2 = $("#LegoTelephoneLabel2").val().trim();

                if(commonUtil.isEmpty(telephoneText)){
                    $('body').trigger("showTip",["电话号码不能为空","alertError"]);
                    $("#LegoTelephoneVal").addClass("lego-val-error");
                    return false;
                }else if(!commonUtil.validateTel(telephoneText)){
                    $('body').trigger("showTip",["电话号码格式不正确","alertError"]);
                    $("#LegoTelephoneVal").addClass("lego-val-error");
                    return false;
                }

                var type=$(".lego-title-styles .title-style-select").attr("data");
                if(getLen(telephoneLabel) > 20){
                    PopTips(0, '自定义标签字数在10字内');
                    return;
                }
                if(type == 'style2'){
                    if(getLen(telephoneLabel2) > 20){
                        PopTips(0, '自定义标签2字数在10字内');
                        return;
                    }
                }

                var data = {
                    "text":telephoneText,
                    "type":type,
                    'label': telephoneLabel,
                    'label2': telephoneLabel2,
                };

                var postPack = buildPostPack(ids, data);

                $.ajax({
                    type:"POST",
                    url:"?control=option&format=json&caction=edit&token="+token,
                    data: postPack,
                    success:function(response){
                        if(responseCheck(response, ids)){
                            $('body').trigger("showTip",["保存成功","alertOk"]);
                            window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                        }else{
                            $('body').trigger('showTip',["保存失败","alertError"]);
                        }

                    }
                });
            });


            $(".lego-telephone-styles span").on('click',function(){
                $(".lego-telephone-styles span").removeClass("lego-telephone-select");
                $(this).addClass("lego-telephone-select");
            });

            $('.lego-title-style-item').on('click', function(){
                console.log('item clicked');
                var me = $(this);
                var label2 = $('#LegoTelephoneLabel2');
                var label2_parent = label2.parent();
                var me_style = me.attr('data');
                if(me_style == 'style2'){
                    label2_parent.show();
                }else{
                    label2_parent.hide();
                }
            });

        }
    };



    //link option修改
    var legoLink = {
        initial:function(){

            var that = this;
            that.initialEvents();

            $("#LegoLinkSave").on('click',that.saveLink);

        },
        saveLink:function(e){

            e.preventDefault();
            var ids = getIds($("#LegoLinkLayout"));
            var textInput = $("#LegoLinkText");
            var linkText = textInput.val().trim();
            var linkHref,linkpageId,linkpageTitle;

            var position = $("input[name='link_position']:checked").val();

            var inOrOut = $("#LegoLinkType").attr('data');

            if(linkText == ""){
                $('body').trigger('showTip',['链接名称不能为空','alertError']);
                textInput.addClass('lego-val-error');
                return;
            }


            if(getByteLen(linkText) >32){
                $('body').trigger('showTip',['链接名称最多为16个汉字','alertError']);
                textInput.addClass('lego-val-error');
                return;
            }


            if(inOrOut == "outer"){
                linkHref = $("#LegoLinkOutHref").val();
                if(linkHref == ""){
                    $('body').trigger('showTip',['请填写链接地址','alertError']);
                    $("#LegoLinkOutHref").addClass('lego-val-error');
                    return;
                }else if(!commonUtil.validateURL(linkHref)){
                    $('body').trigger('showTip',['填写链接格式不正确','alertError']);
                    $("#LegoLinkOutHref").addClass('lego-val-error');
                    return;
                }
                if(linkHref.indexOf('http://')<0){
                   linkHref = "http://"+linkHref;
                }


            }else if(inOrOut == "inner"){
                linkpageId = $("#LegoLinkPage").attr("data");
                linkpageTitle = $("#LegoLinkPage").text().trim();
                if(!linkpageId){
                    $('body').trigger('showTip',['请选择链接的页面','alertError']);
                    $("#LegoLinkPageDiv").addClass("lego-select-error");
                    return;
                }
            }else{
                $('body').trigger('showTip',['请选择链接的来源','alertError']);
                return;
            }

            var url = "?control=option&format=json&caction=edit";
            var data = {
                "text":linkText,
                "linktype":inOrOut,
                "href":linkHref,
                "position":position,
                "pageId":linkpageId,
                "pageTitle":linkpageTitle
            };
            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({"action":"refresh","cptid":ids.cptId},"*");
                }
            });

        },
        initialEvents:function(){

            var that = this;

            $("#LegoLinkTypeSelectBtn,#LegoLinkType").on('click',function(){
                $("#LegoLinkTypeSelectList").show();
            });


            $("body").on('mouseleave','#LegoLinkTypeDiv',function(){
                $(this).find("ul").hide();
            });

            $("#LegoLinkTypeSelectList li").on('click',function(e){

                e.stopPropagation();

                $("#LegoLinkTypeSelectList").hide();
                var selected_text = $(this).text();
                var selected_data = $(this).attr('data');

                $("#LegoLinkType").text(selected_text);
                $("#LegoLinkType").attr('data',selected_data);

                if(selected_data == "inner"){
                    //站内链接
                    $("#LegoLinkOutHref").hide();
                    $("#LegoLinkPageDiv").show();

                    //that.setSelectPages();

                }else{
                    //站外链接，填写链接地址
                    $("#LegoLinkOutHref").show();
                    $("#LegoLinkPageDiv").hide();
                    $("#LegoLinkPageDiv ul").hide();
                }

            });

            $("#LegoLinkPageDiv").on('click',function(){
                that.setSelectPages();
            })

            $("#LegoLinkPageSelectBtn,#LegoLinkPage").on('click',function(){
                $("#LegoLinkPageSelectList").show();
            });

            $("body").on('mouseleave','#LegoLinkPageDiv',function(){
                $(this).find("ul").hide();
            });

            // $("#LegoLinkPageSelectList li").on('click',function(e){
            $("body").on('click',"#LegoLinkPageSelectList li",function(e){
                e.stopPropagation();
                $("#LegoLinkPageSelectList").hide();

                var selected_text = $(this).text();
                var selected_data = $(this).data('pageid');

                $("#LegoLinkPage").text(selected_text);
                $("#LegoLinkPage").attr("data",selected_data);
            });

            $("body").on('click',"#LegoLinkPageSelectList li",function(){
                $(this).find("ul").hide();
            });

            $("#LgmLinkNewPage").off().on('click',function(){
                $("#LegoLinkPage").attr('data',"");
                window.parent.postMessage({
                    action:"add_page",
                },"*");
            });


            //监听平台传回的message消息
            window.addEventListener("message",function(e){
                var data = e.data;
                if(data.action = "add_success"){
                    var legoLinkPage = $("#LegoLinkPage");
                    if(legoLinkPage.length > 0){
                        $(legoLinkPage).text(data.pageTitle);
                        $(legoLinkPage).attr("data",data.pageId);
                        that.setSelectPages();
                    }
                }

            });


        },
        setSelectPages:function(){

            var lis_html = "<li class='lgm-nav-newpage'>新建页面</li>";
            var LegoLinkLayout = $("#LegoLinkLayout");
            var ids = getIds(LegoLinkLayout);

            var url = "?control=option&format=json&caction=getpages";
            var postPack = buildPostPack(ids, {});
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    var pages = response[ids.cptId];
                    $.each(pages,function(i,item){
                        lis_html += "<li data-pageid='"+item.pageId+"'>"+item.pageTitle+"</li>";
                    });

                    $("#LegoLinkPageSelectList").empty().html(lis_html);
                }
            });
        }
    };


    //html option设置
    var legoHtml = {
        initial:function(){
            var that = this;

            $("#LegoHtmlSave").on('click',that.saveHtml);
        },
        saveHtml:function(e){
            e.preventDefault();
            var div = $("#LegoHtmlLayout");

            var ids = getIds(div);
            var htmlText = $("#LegoHtmlTextarea").val().trim();
            htmlText = stripscript(htmlText);
            htmlText = stripbody(htmlText);

            if(htmlText == ''){
                $('body').trigger('showTip',['请输入Html文本','alertError']);
                $("#LegoHtmlTextarea").trigger('focus');
                return;
            }

            var url = "?control=option&format=json&caction=edit";
            var data = {
                "text":htmlText
            };

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        }
    };


    var legoText = {
        initial:function(){
            var that = this;

            $("#LegoTextSave").click(that.saveText);
        },
        saveText:function(e){
            var ids = getIds($("#LegoTextLayout"));
            var url = "?control=option&format=json&caction=edit";
            //var text = $("div.lego-text-textarea").html();
            var editor = UM.getEditor('LgmEdit');
            if(editor.getContent()){
                var text = $("#LgmEdit").html();
            }else{
                $('body').trigger('showTip',['文本信息不能为空','alertError']);
                return;
            }
            var style = $('.title-style-select').attr('data') || 'style1';
            //console.log(text);
            var data = {
                "text":text,
                'style': style
            };
            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        }
    };



    //nav组件 option设置
    var legoNav = {
        nameStatus:{},
        initial:function(){
            var that = this;

            //添加导航
            $("#LegoNavAddBtn").on("click",that.addNav);

            //删除导航
            $("body").on('click','.lego-nav-del',that.delNav);

            //保存导航信息
            $("#LegoNavSave").on('click',that.saveNav);

            //链接类型选择
            this.navTypeSelect();

            that.checkNavname();

            that.styleHover();

            that.columnSet();
        },
        addNav:function(){

            if($('.lego-nav-onenav').length >= 50){

                $('body').trigger('showTip',['最多添加50个导航','alertError']);
                return;
            }

            var navhtml = "";
            navhtml = '<div class="lego-content lego-nav-onenav lego-outer-line">\
                <span class="lego-nav-handle"></span>\
                <input type="text" class="lego-val lego-nav-item lego-nav-name" id="LegoNavText" value=""/>\
                <div class="lego-beautify-select lego-nav-typediv">\
                    <span class="lego-select-text lego-nav-type" data="inner">\
                    站内链接\
                    </span>\
                    <span class="lego-select-btn lego-nav-typeselectbtn">\
                        <i class="lego-select-icon"></i>\
                    </span>\
                    <ul class="lego-select-list lego-nav-typeselectlist" style="display: none">\
                        <li data="inner">站内链接</li>\
                        <li data="outer">站外链接</li>\
                    </ul>\
                </div>\
                <div class="lego-beautify-select lego-nav-pagediv" >\
                    <span class="lego-select-text lego-nav-page" data="">\
                    链接页面\
                    </span>\
                    <span class="lego-select-btn lego-nav-pageselectbtn" >\
                        <i class="lego-select-icon"></i>\
                    </span>\
                    <ul class="lego-select-list lego-nav-pageselectlist" style="display: none">\
                    </ul>\
                </div>\
                <input type="text" class="lego-val lego-nav-item lego-nav-text" style="display: none" value=""/>\
                <span class="lego-nav-del"></span>\
                </div>';


            $("#LegoNavContainer").append(navhtml);
            legoNav.setSelectPages($('.lego-nav-typeselectlist').last().find('li[data="inner"]'));
        },
        delNav:function(){
            var thenav = $(this).closest('.lego-nav-onenav');
            thenav.remove();
        },
        navTypeSelect:function(){

            var that = this;

            //typelist展现
            $("body").on('click','.lego-nav-type,.lego-nav-typeselectbtn',function(e){
                e.stopPropagation();

                var typeDiv = $(this).closest('.lego-nav-typediv');
                if(typeDiv.data('permission') == "1")
                    return;
                typeDiv.find('ul').show();
            });

            //typelist隐藏
            $("body").on('mouseleave','.lego-nav-typediv',function(){
                $(this).find("ul").hide();
            });

            //li点击
            $("body").on('click','.lego-nav-typeselectlist li',function(){
                var onenav = $(this).closest(".lego-nav-onenav");
                var type = $(this).attr('data');
                var type_text = $(this).text();
                if(type == "inner"){
                    onenav.find('.lego-nav-text').hide();
                    onenav.find('.lego-nav-pagediv').show();
                    that.setSelectPages($(this));
                }else if(type=="outer"){
                    onenav.find('.lego-nav-text').show();
                    onenav.find('.lego-nav-pagediv').hide();
                }
                $(this).closest('ul').hide();
                onenav.find('.lego-nav-type').text(type_text);
                onenav.find('.lego-nav-type').attr('data',type);
            });


            //站内链接页面
            $("body").on('click','.lego-nav-page,.lego-nav-pageselectbtn',function(e){
                e.stopPropagation();

                var typeDiv = $(this).closest('.lego-nav-pagediv');
                if(typeDiv.data('permission') == "1")
                    return;
                typeDiv.removeClass("lego-select-error");
                typeDiv.find('ul').show();
            });

            //站内链接list隐藏
            $("body").on('mouseleave','.lego-nav-pagediv',function(){
                $(this).find("ul").hide();
            });

            //page li选择
            $("body").on('click','.lego-nav-pageselectlist li',function(){

                var pagediv = $(this).closest('.lego-nav-pagediv');

                var page_text =$(this).text();
                var page_val = $(this).data('pageid');

                pagediv.find('ul').hide();

                if($(this).hasClass('.lgm-nav-newpage')){
                    window.parent.postMessage({
                        action:"add_page"
                    },"*");
                }

                pagediv.find(".lego-nav-page").text(page_text);
                pagediv.find(".lego-nav-page").attr('data',page_val);

            });

            $("body").on('click','.lgm-nav-newpage',function(){
                var navpagediv = $(this).closest('.lego-nav-pagediv');
                $('.lgm-nav-newpage').attr('data',"");
                $(this).attr("data","this");
                navpagediv.find('.lego-nav-page').attr('data',"");
                window.parent.postMessage({"action":"add_page"},"*");
            });

            $('body').on('click','.lego-nav-page',function(){
                that.setSelectPages($(this));
            });


            $("body").on('mouseenter','.lego-nav-onenav',function(){
                $(this).find('.lego-nav-del').show();
            });

            $("body").on('mouseleave','.lego-nav-onenav',function(){
                $(this).find('.lego-nav-del').hide();
            });

            //监听平台传回的message消息
            window.addEventListener("message",function(e){
                var tmpObj,theNavLink;
                var data = e.data;
                if(data.action = "add_success"){
                    tmpObj =$('.lgm-nav-newpage[data="this"]');
                    theNavLink = tmpObj.closest('.lego-nav-pagediv').find('.lego-nav-page');
                    theNavLink.attr('data',data.pageId);
                    theNavLink.text(data.pageTitle);

                    //更新所有可供选择的站内页面
                    //legoNav.setSelectPages($('.lego-nav-typeselectlist').find('li[data="inner"]'));
                }

            });

        },
        saveNav:function(e){
            var that = this;
            e.preventDefault();

            var name_status = legoNav.checkNavname();
            if(name_status && name_status.status=="error"){
                return;
            }

            var link_status = legoNav.checkNavLinks();
            if(link_status && link_status.status=="error"){
                return;
            }

            var LegoNavLayout = $("#LegoNavLayout");
            var ids = getIds(LegoNavLayout);
            var data = legoNav.getNavOptions();

            if($('.lego-nav-onenav').length <=0 ){
                $('body').trigger('showTip',["导航不能为空","alertError"]);
                return;
            }

            var navFiled = data.filed;
            var url = "?control=option&format=json&caction=edit";

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $("body").trigger('showTip',['保存成功',"alertOk"]);
                    window.parent.postMessage({"action":"refresh","cptid":ids.cptId,"field":navFiled},"*");
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });

        },
        checkNavLinks:function(){
            var navs = $(".lego-nav-onenav");
            var nav,type,pageId,linkHref,tmpObj,ret={};
            $.each(navs,function(i,item){
                nav = $(item);
                type = nav.find('.lego-nav-type').attr('data');

                if(type=="inner"){
                    tmpObj = nav.find('.lego-nav-page');
                    if(!tmpObj.attr('data')){
                        
                        $('body').trigger('showTip',["请选择站内链接页面","alertError"]);
                        tmpObj.focusDom();
                        tmpObj.closest('.lego-nav-pagediv').addClass('lego-select-error');
                        ret.status="error";
                        return false;
                    }
                }else if(type=="outer"){
                    tmpObj = nav.find('.lego-nav-text');
                    if(tmpObj.val().trim() == ""){
                        $('body').trigger('showTip',["链接地址不能为空","alertError"]);
                        tmpObj.focusDom();
                        tmpObj.addClass('lego-val-error');
                        ret.status="error";
                        return false;
                    }
                    /*if(!commonUtil.validateURL(tmpObj.val().trim())){
                        $('body').trigger('showTip',["请填写正确的链接地址","alertError"]);
                        tmpObj.addClass('lego-val-error');
                        ret.status="error";
                        return ret;
                    }*/
                }

            });

            return ret;
        },
        getNavOptions:function(){
            var arr = {};
            arr.navs = {};
            var navs = $(".lego-nav-onenav");
            for(var i = 0;i<navs.length;i++){
                var obj = $(navs[i]);
                arr['navs'][i] = {};
                arr['navs'][i].name = obj.find('.lego-nav-name').val();
                arr['navs'][i].type = obj.find('.lego-nav-type').attr('data');

                if(arr['navs'][i].type == 'outer'){
                    arr['navs'][i]['href'] = obj.find('.lego-nav-text').val();
                    if(arr['navs'][i]['href'].indexOf('http://')<0){
                        arr['navs'][i]['href'] = "http://"+arr['navs'][i]['href'];
                    }
                }else if(arr['navs'][i].type == 'inner'){
                    arr['navs'][i]['pageId'] = obj.find('.lego-nav-page').attr('data');
                    arr['navs'][i]['pageTitle'] = $.trim(obj.find('.lego-nav-page').text());
                }

                arr['navs'][i].permission = obj.data('permission');

            }

            var glb = $("input[name='setglobalnav']:checked").attr('data');
            arr.filed = glb;

            var column = $('#LegoNavColumn').text();
            arr.column = column;

            return arr;
        },
        //获取所有的pages
        setSelectPages:function(obj){
            var thisnav = obj.closest('.lego-nav-onenav');
            var lis_html = "<li class='lgm-nav-newpage'>新建页面</li>";
            var LegoNavLayout = $("#LegoNavLayout");
            var ids = getIds(LegoNavLayout);
            var url = "?control=option&format=json&caction=getpages";
            var postPack = buildPostPack(ids, {});
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    if(response[ids.cptId]){
                        var pages = response[ids.cptId];
                        if(pages){
                            $.each(pages,function(i,item){
                                lis_html += "<li data-pageid='"+item.pageId+"'>"+item.pageTitle+"</li>";
                            });
                            thisnav.find('.lego-nav-pageselectlist').empty().html(lis_html);
                        }
                    }
                }
            });
        },
        checkNavname:function(){

            var nav_names = $('.lego-nav-name');
            var ret = {};
            $.each(nav_names,function(i,item){
                if($(item).val().trim() == ""){
                    $('body').trigger('showTip',['导航名称不能为空','alertError']);
                    $(item).focusDom();
                    //console.log(item);
                    ret.status = "error";
                    $(item).addClass('lego-val-error');
                    return false;
                    //return {'status':"error","msg":"empty"}; 
                }
            });

            if(ret.status != 'error'){
                $.each(nav_names,function(i,item){
                    if(getByteLen($(item).val().trim()) >12){
                        $('body').trigger('showTip',['导航名称不能超过6个汉字','alertError']);
                        $(item).focusDom();
                         ret.status = "error";
                         $(item).addClass('lego-val-error');
                         return false;
                        //return {'status':"error","msg":"long"};
                    }
                });
            }

            return ret;
        },
        styleHover:function(){
            $('.lego-nav-global label').on('mouseenter',function(){

                var data = $(this).find('input[name="setglobalnav"]').attr('data');
                if(data == 'page'){
                    $('.lego-nav-tip p').text('当前页导航，导航信息修改仅对当前编辑页生效。');
                    $('.lego-nav-tip').css('left','110px').show();

                }else if(data=='global'){
                    $('.lego-nav-tip p').text('站点导航，导航信息修改对该站点所有页面生效。');
                    $('.lego-nav-tip').css('left','20px').show();
                }

            });

            $('.lego-nav-global label').on('mouseleave',function(){
                $('.lego-nav-tip').hide();
                $('.lego-nav-tip p').text();
            });
        },
        columnSet:function(){

            $('body').on('click',".column_add",function(){
                var column = parseInt($("#LegoNavColumn").text());
                if(column<6){
                    $("#LegoNavColumn").text(column+1);
                };
                disableBtn();
            });

            $('body').on('click','.column_minus',function(){
                var column = parseInt($("#LegoNavColumn").text());

                if(column>2){
                    $("#LegoNavColumn").text(column-1);
                }
                disableBtn();
               
            });

            function disableBtn(){
                var column = parseInt($("#LegoNavColumn").text());
                if(column == 2){
                    $('.column_minus').addClass('column_minus_disable');
                    $('.column_add').removeClass('column_add_disable');
                }else if(column == 6){
                    $('.column_minus').removeClass('column_minus_disable');
                    $('.column_add').addClass('column_add_disable');
                }else{
                    $('.column_minus').removeClass('column_minus_disable');
                    $('.column_add').removeClass('column_add_disable');
                }
            }

        }

    };

    //map组件 option设置
    var legoMap = {
        initial:function(){
            var that = this;
            $("#LegoMapSave").click(that.saveMapInfo);
        },
        saveMapInfo:function(){

            var ids = getIds($("#LegoMapLayout"));
            var type= $("input[name='map_style']:checked").val();
            var data = {};

            var name = $.trim($("#addrName").val());
            if(!name){
                $('body').trigger('showTip',['请填写位置名称','alertError']);
                return ;
            }


            if(siteMap.confirmPoint){

                if(siteMap.address){

                    data.address =siteMap.address;
                    data.streetName = siteMap.streetName;

                }else{
                    data = mapData;
                }


                data.lng = siteMap.confirmPoint.lng;
                data.lat = siteMap.confirmPoint.lat;
                data.type = type;
                data.name = name;
                var tmp = data.address.split("@|");
                tmp[4] = name;
                data.address = tmp.join("@|");
                data.showAddr = tmp[0]+tmp[1]+tmp[2]+tmp[3];

            }else{
                // $('.senErro').text("请查看定位地图");
                $('body').trigger('showTip',['请查看定位地图','alertError']);
                return ;
            }

            var url = "?control=option&format=json&caction=edit";
            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    window.parent.postMessage({"action":"refresh","cptid":ids.cptId},"*");
                    $("body").trigger('showTip',['保存成功',"alertOk"]);
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        }

    };


    //share组件 option设置
    var legoShare = {
        initial:function(){
            var that = this;

            $('#LegoShareSave').on('click',that.saveShare);
        },
        saveShare:function(){

            var ids = getIds($("#LegoShareLayout"));
            var shareContent = $("#LegoShareTextarea").val().trim();

            var url = "?control=option&format=json&caction=edit";

            var data = {
                "shareContent":shareContent
            };

            var postPack = buildPostPack(ids, data);

            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });


        }
    };
 

    //商务组件
    var legoECOM = {
        initial:function(){
            var that = this;
            window.addEventListener("message",function(e){
                var data = e.data;
                if(data.cptName = "ECOM"){
                    console.log(data);
                    if(data.status == 'success'){
                        that.saveECOM();
                    }
                }

            });
        },
        saveECOM:function(){
            var ids = getIds($("#LegoECOMLayout"));
            var url = "?control=option&format=json&caction=edit";
            var data = {"isSet":1};

            var postPack = buildPostPack(ids, data);

            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }
            });

        }
    };

    //Video设置
    var legoVideo = {
        initial:function(){
            var that = this;

            $("#LegoVideoSave").on('click',that.save);
        },
        save:function(e){
            e.preventDefault();
            var div = $("#LegoVideoLayout");

            var ids = getIds(div);

            var title = $(".lego-video-title input").val();

            var htmlText = $("#LegoVideoTextarea").val().trim();
            htmlText = stripscript(htmlText);
            htmlText = stripbody(htmlText);

            if(htmlText == ''){
                $('body').trigger('showTip',['请输入视频通用代码','alertError']);
                $("#LegoVideoTextarea").trigger('focus');
                return;
            }

            // 获取高宽
            var width = $(htmlText).attr('width') || $(htmlText).css('width').match(/^\d+/)[0] || 1;
            var height = $(htmlText).attr('height') || $(htmlText).css('height').match(/^\d+/)[0] || 1;
            var url = "?control=option&format=json&caction=edit";
            var data = {
                "text":htmlText,
                "title": title,
                width: width,
                height: height,
            };

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({action:'refresh',cptid:ids.cptId},'*');
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        }
    };

    //button设置
    var legoButton = {
        initial:function(){
            this.buttonLinkSelect();
            this.selectStyle();
            //保存设置信息
            $("#LegoButtonSave").on('click',this.saveButton);
        },
        saveButton:function(){

            var ids = getIds($("#LegoButtonLayout"));

            var text = $("#LegobuttonVal").val().trim();
            var style = $('.title-style-select').attr("data");

            if(text==""){
                $('body').trigger('showTip',['按钮标签不能为空','alertError']);
                $("#LegobuttonVal").addClass('lego-val-error');
                return;
            }else if(getByteLen(text)>32){
                $('body').trigger('showTip',['标题名称不能超过16个汉字','alertError']);
                $("#LegobuttonVal").addClass('lego-val-error');
                return;
            }

            var linktype = $("#LegoButtonType").attr('data');
            var pageId,pageTitle,href;
            if(linktype == "inner"){
                pageId = $("#LegoButtonPage").attr('data');
                pageTitle = $("#LegoButtonPage").text();

                if(!pageId){
                    $('body').trigger("showTip",['请选择链接的页面','alertError']);
                    $("#LegoButtonPageDiv").addClass('lego-select-error');
                    return;
                }

            }else if(linktype == 'outer'){
                href = $("#LegoButtonOutHref").val().trim();
                if(!href || !commonUtil.validateURL(href) ){
                    $('body').trigger("showTip",['链接地址格式不正确','alertError']);
                    $("#LegoButtonOutHref").addClass("lego-var-error");
                    return;
                }

                if(href.indexOf('http://')<0){
                   href = "http://"+href;
                }
            }

            var url = "?control=option&caction=edit&format=json";
            var data = {
                "text":text,
                "style":style,
                "linktype":linktype,
                "pageId":pageId,
                "pageTitle":pageTitle,
                "href":href
            };

            var postPack = buildPostPack(ids, data);
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    $('body').trigger('showTip',['保存成功','alertOk']);
                    window.parent.postMessage({
                        action:"refresh",
                        cptid:ids.cptId
                    },"*");
                }else{
                    $('body').trigger('showTip',["保存失败","alertError"]);
                }
            });
        },
        selectStyle:function(){
            $('.lego-title-style-item').on('click',function(){
                $('.lego-title-style-item').removeClass('title-style-select');
                $(this).addClass('title-style-select');
            });
        },
        setSelectPages:function(){
            var lis_html = "<li class='lgm-title-newpage' id='LegoTitleNewPage'>新建页面</li>";
            var LegoButtonLayout = $("#LegoButtonLayout");
            var ids = getIds(LegoButtonLayout);

            var url = "?control=option&format=json&caction=getpages";
            var postPack = buildPostPack(ids, {});
            sendAjax("POST",url,postPack,function(response){
                if(responseCheck(response, ids)){
                    var pages = response[ids.cptId];
                    $.each(pages,function(i,item){
                        lis_html += "<li data-pageid='"+item.pageId+"'>"+item.pageTitle+"</li>";
                    });
                    $("#LegoButtonPageSelectList").empty().html(lis_html);
                }
            });
        },
        buttonLinkSelect:function(){
            var that = this;

            $("#LegoButtonTypeSelectBtn,#LegoButtonType").on('click',function(){
                $("#LegoButtonTypeSelectList").show();
            });


            $("body").on('mouseleave','#LegoButtonTypeDiv',function(){
                $(this).find("ul").hide();
            });

            $("#LegoButtonTypeSelectList li").on('click',function(e){

                e.stopPropagation();

                $("#LegoButtonTypeSelectList").hide();
                var selected_text = $(this).text();
                var selected_data = $(this).attr('data');

                $("#LegoButtonType").text(selected_text);
                $("#LegoButtonType,#LegoButtonTypeDiv").attr('data',selected_data);

                if(selected_data == "inner"){
                    //站内链接
                    $("#LegoButtonOutHref,#LegoButtonPageDiv ul").hide();
                    $("#LegoButtonPageDiv").show();
                    $("#LegoButtonPage").text("链接页面").attr("data","");
                }else if(selected_data == "outer"){
                    //站外链接，填写链接地址
                    $("#LegoButtonOutHref").show();
                    $("#LegoButtonPageDiv,#LegoButtonPageDiv ul").hide();
                }else{
                    $("#LegoButtonOutHref,#LegoButtonPageDiv ul").hide();
                    $("#LegoButtonPageDiv").removeClass("lego-select-error").show();
                    $("#LegoButtonPage").text("链接页面").attr("data","");
                }

            });

            $("#LegoButtonPageDiv").on('click',function(){
                if($("#LegoButtonTypeDiv").attr("data") == "from") 
                    return;
                that.setSelectPages();
            });

            $("#LegoButtonPageSelectBtn,#LegoButtonPage").on('click',function(){
                if($("#LegoButtonTypeDiv").attr("data") == "from") 
                    return;
                $("#LegoButtonPageSelectList").show();
            });

            $("body").on('mouseleave','#LegoButtonPageDiv',function(){
                $(this).find("ul").hide();
            });

            $("body").on('click',"#LegoButtonPageSelectList li",function(e){
                e.stopPropagation();
                $("#LegoButtonPageSelectList").hide();

                var selected_text = $(this).text();
                var selected_data = $(this).data('pageid');

                $("#LegoButtonPage").text(selected_text);
                $("#LegoButtonPage").attr("data",selected_data);
            });

            $("body").on('click',"#LegoButtonPageSelectList li",function(){
                $(this).find("ul").hide();
            });

            $('body').on('click','#LegoButtonNewPage',function(){
                $("#LegoButtonPage").attr('data',"");
                window.parent.postMessage({
                    action:"add_page"
                },"*");
            });

            //监听平台传回的message消息
            window.addEventListener("message",function(e){

                var data = e.data;
                if(data.action = "add_success"){
                    var LegoButtonPage = $("#LegoButtonPage");
                    if(LegoButtonPage.length > 0){
                        $(LegoButtonPage).text(data.pageTitle);
                        $(LegoButtonPage).attr("data",data.pageId);
                        that.setSelectPages();
                    }
                }

            });
        }
    };

    var commonUtil = {
        isEmpty:function(val){
            if($.trim(val))
                return false;
            return true;
        },
        validateTel:function(val){
            val = val.replace(/-/g,"");
            
            var reg = /^\d{1,18}$/;
            // var reg = /^(\d{3,4}-)?\d{7,8}$|\d{11}/;
            if(!reg.test(val)){
                return false;
            }else{
                return true;
            }
             
        },
        validateMsg:function(val){
            // var reg = /^\s*[0-9]{0,11}\s*$/;
            val = val.replace(/-/g,"");
            var reg = /^\s*(\+\d{0,3})?\d{0,11}\s*$/;
            return reg.test(val);
        },
        validateURL:function(str_url){
           /*if(domain.indexOf('http://')>=0){
               var spo=domain.indexOf('http://');
               domain=domain.substring(7);
           }*/
          /* var pattern = /^([\w-]+\.)*([\w-]+)\.([\w]+)$/;
           return pattern.test(domain);*/

            if(str_url.indexOf('http://')<0){
                str_url = "http://"+ str_url;
            }else{
                if(str_url.length < 8) return false;
            }

            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            "?(([0-9a-z_!~*'().&= $%-] : )?[0-9a-z_!~*'().&= $%-] @)?" //ftp的user@
            "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            "|" // 允许IP和DOMAIN（域名）
            "([0-9a-z_!~*'()-] .)*" // 域名- www.
            "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
            "[a-z]{2,6})" // first level domain- .com or .museum
            "(:[0-9]{1,4})?" // 端口- :80
            "((/?)|" // a slash isn't required if there is no file name
            "(/[0-9a-z_!~*'().;?:@&= $,%#-] ) /?)$";
            var re=new RegExp(strRegex);

            if (re.test(str_url)){
                return (true);
            }else{
                return (false);
            }
        }
    };

    function sendAjax(type,url,data,cb){
        $.ajax({
            type:type,
            url:url+'&token='+token,
            data:data,
            success:cb
        });
    }

    function stripscript(s)
    {
        // return s.replace(/<script>.*<\/script>/ig, '');
        return s.replace(/<script.*?>.*<\/script>/ig, '');
    }

    function stripbody(s){
        return s.replace(/<body.*?>|<\/body>|<html.*?>|<\/html>/ig, ''); 
    }

    //获取字符长度，区分中英文
    function getByteLen(val) { 

        var len = 0; 

        for (var i = 0; i < val.length; i++) { 
            /*if (val[i].match(/[^x00-xff]/ig) != null) //全角 
                len += 2; 
            else 
                len += 1; */
            if(val[i].charCodeAt(0) < 299){
                len += 1;
            }else{
                len += 2; 
            }
        } 
        return len; 
    }



    $(document).ready(function(){
        legoTitle.initial();
        legoTel.initial();
        legoLink.initial();
        legoNav.initial();
        legoMap.initial();
        legoMessage.initial();
        legoHtml.initial();
        legoText.initial();
        legoShare.initial();
        legoECOM.initial();
        legoVideo.initial();
        legoButton.initial();
       
       $('body').bind("showTip",function(e,text,alertType,time,fun){
            
            var html = '<div class="pl0-alert alert-warning '+alertType+'">\
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
                    <span class="alter-cont"></span>\
                </div>';

            var html1 = '<div class="pl0-alert">'+text+'</div>';

            $(".pl0-alert").remove();
            var $alter;
            if(!$alter){
               $alter = $(html1).appendTo("body");
            }
            /*$alter.children(".alter-cont").html(text);
            $alter.slideDown(300,function(){
                setTimeout(function(){
                    fun && fun();
                    $alter.slideUp(300);
                },time||800);
            });*/
       
            $(".pl0-alert").addClass(alertType);
            setTimeout(function(){
                $(".pl0-alert").animate({'opacity': 0}, 'slow', function(){
                    $(".pl0-alert").removeClass('alertOk').removeClass('alertError');
                });
            }, 1200);
        });


       $('body').on('mouseenter','.lego-outer-line',function(){
            $(this).addClass('lego-outer-hover');
       })

       $('body').on('mouseleave','.lego-outer-line',function(){
            $(this).removeClass('lego-outer-hover');
       })

       $('body').on('focus','.lego-val',function(){
        $(this).removeClass('lego-val-error');
       })

       $('body').on('click','.lego-select-error',function(){
            $(this).removeClass('lego-select-error');
       });

    });


});
