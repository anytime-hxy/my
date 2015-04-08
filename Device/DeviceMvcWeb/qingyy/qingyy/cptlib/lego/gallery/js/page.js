//引入zepto
/* Bdyt_Zepto v1.1.2 - zepto event ajax form ie - zeptojs.com/license */
Zepto(function($){
    if($.yuntu){
        console.log('already install it');
        return;
    }

    $.extend($, {
        'yuntu': true,
    });

var bdYuntu = {}; 
bdYuntu.zepto = Zepto;
bdYuntu.need_hidden_id_list=['tool-box'];
//全局的用于封锁body 默认响应touchmove事件，禁止上下滑动 
bdYuntu.index = {};
bdYuntu.index.touchmove_lock = 0;
bdYuntu.index.scroll_lock = 0;
bdYuntu.index.scroll_top = 0;
//bdYuntu.index.src_viewport = '';
// support in mobile and PC, by deju
var supportTouch = 'ontouchstart' in window;
bdYuntu.event = bdYuntu.event || {};
bdYuntu.event.START = supportTouch ? 'touchstart' : 'mousedown';
bdYuntu.event.MOVE = supportTouch ? 'touchmove' : 'mousemove';
bdYuntu.event.END = supportTouch ? 'touchend' : 'mouseup';
bdYuntu.event.CLICK = supportTouch ? 'click' : 'click';
// for IOS
if($.os && $.os.ios){
    bdYuntu.event.CLICK = 'touchstart';
}
bdYuntu.event.getTouches = function(e){
    if(e.touches) return e.touches;
    return [e];
}

//添加每一个盘子的展现日志 
bdYuntu.index.add_plate_disp_log = function($){
    var btn_height = $('.bdyt-see-big').height();
    var plate_img_num = 0;
   $('[bdyt-img-display]').each(function(index,item){
       var scrollObj = bdYuntu.util.scroll.getScroll();
        var up_boundary = scrollObj.scrollTop||0;
        var down_boundary = up_boundary+$(window).height();
        var img_top = $(item).offset().top;
        var img_bottom = $(item).offset().top+$(item).height();
        if((img_top+btn_height) >=down_boundary|| (img_bottom-btn_height) <= up_boundary) { ; }
        else
        {
            plate_img_num ++;
        }
    })
    //发送用户实际看到的盘子个数 展现日志 
    if(plate_img_num >0)
    {
       bdYuntu.util.log&&bdYuntu.util.log.disp(bdYuntu.zepto,{'page_id':'plate','plate_img_num':plate_img_num});
    }
};
bdYuntu.main = {};
bdYuntu.main.img_src_list = [];
bdYuntu.main.total_img_list_len = 0;
bdYuntu.init_all_img =function($){
    bdYuntu.alter_img_list = [];
    bdYuntu.util.css.dynamic_add_class($,'.bdyt{ box-sizing:content-box; margin:0; padding:0; float:none; clear:none; overflow:hidden; /*white-space:nowrap;*/ word-wrap:normal; border:0; background:none; width:auto; height:auto; max-width:none; min-width:none; max-height:none; min-height:none; border-radius:0; box-shadow:none; transition:none; font: 12px/1.5 Helvetica, Arial, \5b8b\4f53, sans-serif; text-decoration:none; text-align:left; }','bdyt-reset')
    bdYuntu.util.css.dynamic_add_class($,'a.bdyt-see-big{position: absolute; width: 78px; height: 32px; font:16px/32px Microsoft Yahei!important; color: red; background-color: rgba(0,0,0,.7); bottom: 8px; right: 8px; color: #fff!important; text-align:center;text-decoration:none;}','bdyt-see-big')
    //yuntu-img-item 是合作方与我们约定的类 
    $('img.yuntu-img-item').each(function(index,item){
        var data_width = $(item).attr('data-width')||0;
        var data_height = $(this).attr('data-height')||0;
        var data_src = $(item).attr('data-src')||$(item).attr('data-osrc')||$(item).attr('src');
        if(data_width > 320&&data_height >100)
        {
            //打上预加载标示 
            if($(item).attr('src'))
            {
                $(item).attr('bdyt-img-display',1);
            }
            else
            {
                $(item).attr('bdyt-img-display',0);
            }
            bdYuntu.alter_img_list.push($(item));
            //打上查看大图图标
            var img_parent = $(item).parent();
            //给img的父级别加上position 
            //console.log(img_parent.css('position'));
            if(img_parent.css('position')=='static')
            {
                img_parent.css('position','relative');
            }
            var btn_see_big = $('<a class="bdyt-see-big bdyt" href="javascript:void(0);">查看大图</a>')
            $(item).after(btn_see_big);
        }
    });
    $('img[bdyt-img-display]').on('load',function(e){
        var img_width = 0;
        if(typeof $(this)[0].naturalWidth == "undefined")
        {
            img_width = $(this).width();
        }
        else
        {
            img_width = $(this)[0].naturalWidth;
        }
        if(typeof $(this)[0].naturalHeight == "undefined")
        {
            img_height = $(this).height();
        }
        else
        {
            img_height = $(this)[0].naturalHeight;
        }
        if(img_width > 140&&img_height > 140)
        {
            $(this).attr('bdyt-img-display',1);
        }
    });
};
bdYuntu.pre_load_img = function(index,pre_load_num,pre_load_direct){
    if(pre_load_num <=0)
    {
        console.log("the param of pre_load_num is:"+pre_load_num+",<=0!");
        return false;
    }
    var loaded_count = 0;
    var img_list_len = bdYuntu.alter_img_list.length;
    var cur_img = null;
    while(loaded_count < pre_load_num)
    {
        if(pre_load_direct)
        {
            index = ((index+1)>= img_list_len)?(index-img_list_len+1): (index+1);
        }
        else
        {
            index = ((index-1)<0)?(index+img_list_len-1): (index-1);
        }
        cur_img = bdYuntu.alter_img_list[index].up_img;
        //与加载当前index的图片 
        if(cur_img)
        {
            //var data_src = cur_img.attr('data-src')||cur_img.attr('data-osrc');
            //var src = cur_img.attr('src');
            var data_src = cur_img, src;
            if(data_src && !src)
            {
                //cur_img.attr('src',data_src);
            }
        }
        loaded_count++;
    }
}
bdYuntu.get_one_img_url_exact = function(index,pre_load_num,pre_load_direct){
    index = index||0;
    index = index < 0 ? 0 :index;
    //console.log(bdYuntu.alter_img_list, index);
    var cur_img = bdYuntu.alter_img_list[index].up_img;
    return cur_img;
    /*
    //预加载
    if(pre_load_num >0)
    {
        bdYuntu.pre_load_img(index,pre_load_num,pre_load_direct);
    }
    return cur_img.attr('src');
    */
}
bdYuntu.get_one_img_url_new = function(index,pre_load_num,pre_load_direct){
    if(pre_load_num <=0)
    {
        console.log("the param of pre_load_num is:"+pre_load_num+",<0!");
        return false;
    }
    index = index||0;
    var cur_img = bdYuntu.alter_img_list[index].up_img;
    var img_list_len = bdYuntu.alter_img_list.length;
    //选取加载好的图片
    var count = 0;
    var max_retry = pre_load_num||4;
    /*
    while((!cur_img)||(  count<max_retry))
    {
        if(pre_load_direct)
        {
            index = ((index+1)>= img_list_len)?(index-img_list_len+1): (index+1);
        }
        else
        {
            index = ((index-1)<0)?(index+img_list_len-1): (index-1);
        }
        cur_img = bdYuntu.alter_img_list[index];
        count++;
    }
    */
    //预加载
    if(pre_load_num >0)
    {
        bdYuntu.pre_load_img(index,pre_load_num,pre_load_direct);
    }
    return {url: cur_img, index: index};
    return {url:cur_img.attr('src'),index:index};
}
bdYuntu.util = {};
bdYuntu.util.cookie = {};
bdYuntu.util.cookie.getCookie = function(objName){//获取指定名称的cookie的值 
    var arrStr = document.cookie.split("; "); 
    for(var i = 0;i < arrStr.length;i ++){ 
        var temp = arrStr[i].split("="); 
        if(temp[0] == objName) return unescape(temp[1]); 
    }
};
bdYuntu.util.cookie.addCookie = function(name,value,expires,path,domain){ 
    var str=name+"="+escape(value); 
    if(expires!=""){ 
        var date=new Date(); 
        date.setTime(date.getTime()+expires*24*3600*1000);//expires单位为天 
        str+=";expires="+date.toGMTString(); 
    } 
    if(path!=""){ 
        str+=";path="+path;//指定可访问cookie的目录 
    } 
    if(domain!=""){ 
        str+=";domain="+domain;//指定可访问cookie的域 
    } 
    document.cookie=str;
};
bdYuntu.util.scroll = {};
bdYuntu.util.scroll.getScroll = function(){
    var tmp_ele;
    if(document.documentElement && document.documentElement.scrollTop){
        var tmp_ele = document.documentElement;
    }else{
        var tmp_ele = document.body;
    }
    return {scrollTop: tmp_ele.scrollTop, scrollLeft: tmp_ele.scrollLeft, width: tmp_ele.scrollWidth, height: tmp_ele.scrollHeight};

}
bdYuntu.util.css = {};
bdYuntu.util.css.dynamic_add_class = function($,css_str,style_id){
    style_id = style_id||'';
    if(style_id&&$('#'+style_id).length > 0)
    {
        $('#'+style_id).remove();
    }
    var preg = new RegExp('\\$([^;]+);',"g");
    var new_str = css_str.replace(preg,"'+$1+';")
    new_str = new_str.replace(/(.*)/,"'$1'");
    css_class_def =  eval(new_str);
    var ani_style = $("<style id="+style_id+"></sytle>");
    ani_style.html(css_class_def);
    $('head').append(ani_style);
};    
//transform封装 
bdYuntu.util.css.get_transform = function($,dom,key){
    var arr = ['translate3d','translate','scale','skew'];
    if(typeof(dom) == 'undefined')
    {
        console.log('call bdYuntu.util.css.transform.get failed,the dom is undefined!');
        return false;
    }
    if(arr.indexOf(key) <0)
    {
        console.log('call bdYuntu.util.css.transform.get failed,the func_name is out of transform function range!');
        return false;
    }
    var attr_prefix = "bdyt-utl-css-transform-";
    var str_cur_transform = dom.attr(attr_prefix+key);
    if(!str_cur_transform)
    {
        switch(key){
            case 'scale':
                return [1,1,1];
            default:
                return [0,0,0,0,0,0];
        }
    }
    var str_target = str_cur_transform.replace(/\((.*)\)/,"$1");
    var arr_target = str_target.split(',');
    return arr_target;
}
bdYuntu.util.css.set_transform = function($,dom,key,x,y,z){
    x = x||0;
    y = y||0;
    z = z||0;
    var arr = ['translate3d','translate','scale','skew'];
    if(typeof(dom) == 'undefined')
    {
        console.log('call bdYuntu.util.css.transform.set failed,the dom is undefined!');
        return false;
    }
    if(arr.indexOf(key) <0)
    {
        console.log('call bdYuntu.util.css.transform.set failed,the func_name is out of transform function range!');
        return false;
    }
    var str_target_value = '';
    var attr_prefix = "bdyt-utl-css-transform-";
    arr.forEach(function(func_name){
        if(key == func_name)
        {
            var str_value ='';
            switch(func_name){
                case 'translate3d':
                str_value = "("+x+"px,"+y+"px,"+z+"px) ";
                break;
                case 'translate':
                str_value = "("+x+"px,"+y+"px) ";
                break;
                case 'scale':
                str_value = "("+x+","+y+") ";
                break;
                case 'skew':
                str_value = "("+x+"deg) ";
                break;
            }
            dom.attr(attr_prefix+func_name,str_value);
            str_target_value += func_name+str_value;
        }
        //原来就有这个属性 
        else if(dom.attr(attr_prefix+func_name))
        {
            str_target_value += func_name+dom.attr(attr_prefix+func_name);
        }
        else
        {
            ;
        }
    });
    dom.css({
        '-webkit-transform':str_target_value,
        '-moz-transform':str_target_value,
        '-o-transform':str_target_value,
        '-ms-transform':str_target_value,
        'transform':str_target_value
    });
}
//menu组件操作 
bdYuntu.menu = {};
bdYuntu.menu.toggle = function($){
    var close_btn = $('.bdyt-menu-layer-btn-close');
    var title_wrap = $('.bdyt-menu-layer-title-wrap');
    var menu_dom = $('#bdyt-menu-layer');
    var dom_show = menu_dom.attr('bdyt-menu-show');
    if(dom_show  == 1)
    {
        close_btn.css('top',-100);
        title_wrap.css('bottom',-100);
        menu_dom.attr('bdyt-menu-show',0);
    }
    else
    {
        close_btn.css('top',30);
        title_wrap.css('bottom',0);
        menu_dom.attr('bdyt-menu-show',1);
    }
};
//引导mask层操作
bdYuntu.mask = {};
bdYuntu.mask.toggle_lock = parseInt(bdYuntu.util.cookie.getCookie('bdyt_mask_shown'));
//设置浮层不再出现
bdYuntu.mask.set_toggle_lock = function(){
    bdYuntu.util.cookie.addCookie('bdyt_mask_shown','1','','/','');
    bdYuntu.mask.toggle_lock = 1;
};
//主页面渲染
// wrap render
bdYuntu.main.html = function($,cur_gallery){
    var div = $('<div class="bdyt-layer-wrapper"></div>');
    // by deju
    var cptId = $(cur_gallery).data('cptid');
    var current_gallery_obj = window.lgmGalleryAll[cptId];
    //console.log(current_gallery_obj);
    var gallery_title = current_gallery_obj.title;
    var back_html = '<div class="bdyt-layer-back-wrapper"><div class="bdyt-layer-wrapper-back"></div></div>';
    var detail_html = '\
            <div class="bdyt-layer-wrapper-detail">\
                <div class="bdyt-layer-wrapper-detail-div">\
                <div class="bdyt-layer-wrapper-title">'+gallery_title+'</div>\
                <div class="bdyt-layer-wrapper-info-wrap"><div class="bdyt-layer-wrapper-info"><!--导读：家装风水中有很多禁忌，平常一些小细节容易让人忽视。如果生活中发生了一些不顺心，极有可能是因为触了家庭装修风水的禁忌，以下为大家总结了一些家装禁忌与破解方法，希望对您有帮助。这里是图片描述--></div></div>\
                <div class="bdyt-layer-wrapper-page"><!--1/3--></div>\
            </div>\
            </div>\
        ';
    var div_detail = $(detail_html);
    var div_back = $(back_html);

    var ul = $('<ul class="bdyt-layer-img-list"></ul>');
    div.append(div_back);
    div.append(ul);
    div.append(div_detail);
    var cur_img_index = 0;//-1;
    

    //var img_list = bdYuntu.alter_img_list;
    var img_list = current_gallery_obj['imgs'];
    bdYuntu.alter_img_list= img_list;
    /*
    for (var index in img_list)
    {
        if(cur_img[0] == img_list[index][0])
        {
            cur_img_index = parseInt(index);
            break;
        }
    }
    */
    //获取三个li在img_list中的index
    var img_list_len = img_list.length;
    //对图片list ul添加三个li;
    var begin_img_index = ((cur_img_index-1)<0)?(cur_img_index+img_list_len-1): (cur_img_index-1);
    var begin_li = $('<li></li>');
    begin_li.attr('begin-li',begin_img_index);
    var begin_img = $('<a class="bdyt-layer-img-item"></a>');
    var begin_src = bdYuntu.get_one_img_url_exact(begin_img_index,4,0);
    begin_img.css('background-image',"url("+begin_src+")");
    begin_li.append(begin_img);
    ul.append(begin_li);

    var mid_img_index = cur_img_index;
    var mid_li = $('<li></li>');
    mid_li.attr('mid-li',mid_img_index);
    var mid_img = $('<a class="bdyt-layer-img-item"></a>');
    var mid_src = bdYuntu.get_one_img_url_exact(mid_img_index,0);
    var win_width = $(window).width();
    var win_height = $(window).height();
    var scrollObj = bdYuntu.util.scroll.getScroll();
    var win_top = scrollObj.scrollTop||0;
    var win_left = scrollObj.scrollLeft||0;
    mid_img.css('background-image',"url("+mid_src+")");

    //mid_img.attr('org-top',img_list[mid_img_index].offset().top-win_top);
    //mid_img.attr('org-left',img_list[mid_img_index].offset().left-win_left);

    var org_width =320;// parseInt(img_list[mid_img_index].width());
    var org_height = 200; //parseInt(img_list[mid_img_index].height());
    var org_wh_rate = org_width/org_height;

    mid_img.attr('org-width',org_width);
    mid_img.attr('org-height',org_height);
    mid_img.attr('org-wh-rate',org_wh_rate);
    mid_li.append(mid_img);
    ul.append(mid_li);

    var end_img_index = ((cur_img_index+1)>= img_list_len)?(cur_img_index-img_list_len+1): (cur_img_index+1);
    var end_li = $('<li></li>');
    end_li.attr('end-li',end_img_index);
    var end_img = $('<a class="bdyt-layer-img-item"></a>');
    var end_src = bdYuntu.get_one_img_url_exact(end_img_index,4,1);
    end_img.css('background-image',"url("+end_src+")");
    end_li.append(end_img);
    ul.append(end_li);
    var div_mask = $('<div id="bdyt-mask-layer"></div>');
    div_mask.css({
        position:'fixed',
        top:0,
        left:0,
        width:win_width,
        height:win_height,
        'z-index':2147483647,
        'background':'rgba(0,0,0,0.7) center center no-repeat url(http://m.yuntu.baidu.com/img/bdyt-mask-gesture.png)',
        'background-size':"30% 30%",
        '-webkit-transition':'all 0.5s',
        '-moz-transition':'all 0.5s',
        '-o-transition':'all 0.5s',
        '-ms-transition':'all 0.5s',
        'transition':'all 0.5s'
    })
    //菜单浮层
    var menu_layer = $('<div id="bdyt-menu-layer"></div>');
    menu_layer.attr('bdyt-menu-show',1);
    //关闭按钮
    var close_btn = $('<a class="bdyt-menu-layer-btn-close"></a>');
    var title_wrap = $('<div class="bdyt-menu-layer-title-wrap"></div>');
    var div_title = $('<div class="bdyt-menu-layer-title"></div>');
    var div_num = $('<div class="bdyt-menu-layer-num-wrap"></div>');
    var span_index = $('<span class="bdyt-menu-layer-num-index">24</span>');
    var span_spre = $('<span class="bdyt-menu-layer-num-spre">/</span>');
    var span_total = $('<span class="bdyt-menu-layer-num-total">10</span>');
    var page_title = $('head').find('title').html();
    //div_title.html(page_title);
    span_index.html(mid_img_index+1);
    span_total.html(img_list_len);

    menu_layer.append(close_btn);
    //menu_layer.append(title_wrap);
    title_wrap.append(div_title);
    title_wrap.append(div_num);
    div_num.append(span_index);
    div_num.append(span_spre);
    div_num.append(span_total);
    close_btn.css({
        position:'fixed',
        display:'block',
        top:30,
        right:0,
        width:win_width*0,
        height:win_width*0,
        'background':'center center no-repeat url(http://m.yuntu.baidu.com/img/bdyt-btn-close.png)',
        '-webkit-transition':'all 0.3s',
        '-moz-transition':'all 0.3s',
        '-o-transition':'all 0.3s',
        '-ms-transition':'all 0.3s',
        'transition':'all 0.3s'
    });
    menu_layer.css({
        /*
        position:'fixed',
        top:0,
        left:0,
        */
        position:'absolute',
        top:win_top,
        left:win_left,
        width:win_width,
        height:0,
        'z-index':2147483646
    });
    title_wrap.css({
        position:'fixed',
        //top:win_height-40,
        bottom:0,
        left:0,
        width:'100%',
        height:20,
        padding:'10px 0px',
        overflow:'hidden',
        'background-color':'rgba(0,0,0,0.5)',
        font:'bold 12px/20px SimSun',
        color:'white',
        '-webkit-transition':'all 0.3s',
        '-moz-transition':'all 0.3s',
        '-o-transition':'all 0.3s',
        '-ms-transition':'all 0.3s',
        'transition':'all 0.3s'
    });
    div_num.css({
        float:'right',
        width:'13%',
        'margin-right':'1%',
        'text-align':'right'
    });
    var div_title_width = win_width-50-20;
    div_title.css({
        float:'left',
        'margin-left':'1%',
        width:'80%',
        'white-space':'nowrap',
        'text-overflow':'ellipsis',
        overflow:'hidden'
    });
    $('body').append(menu_layer);
    if(!bdYuntu.mask.toggle_lock)
    {
        //$('body').append(div_mask);
        //设置浮层不再出现
        bdYuntu.mask.set_toggle_lock();
    }
    return div;
};
bdYuntu.main.css = function($,cur_img,div){
    //window 相关位置、大小
    var scrollObj = bdYuntu.util.scroll.getScroll();
    var win_top = scrollObj.scrollTop || 0;
    var win_left = scrollObj.scrollLeft||0;
    var win_wh_rate = $(window).width()/$(window).height();
    var win_hw_rate = $(window).height()/$(window).width();
    var ul = div.find('ul');
    var li = ul.find('li');
    var div_title = div.find('.bdyt-layer-wrapper-title');
    var div_detail = div.find('.bdyt-layer-wrapper-detail');
    div.css({
        /*
        position:'fixed',
        top:0,
        left:0,
        */
        position:'absolute',
        top:win_top,
        left:win_left,
        width:$(window).width()*2,
        height:$(window).height()*2,
        overflow:'hidden',
        margin:0,
        padding:0,
        'z-index':2147483645,
        'margin-left':-$(window).width(),
        'margin-top':-3,
        'background-color':'#222'
    })
    ul.css({
        overflow:'visible',
        margin:0,
        padding:0,
        width:$(window).width()*3+10,
        height:$(window).height()+10
        //height:$(window).height()-100
    })
    li.css({
        'position':'relative',
        'float':'left',
        'width':$(window).width(),
        'height':$(window).height(),
        //'height':$(window).height() - 110,
        'overflow':'visible',
        'list-style':'none'
        //'background':'url(http://m.yuntu.baidu.com/img/bdyt-layer-loading.gif) center center no-repeat'
    })
    var img_list = li.find('.bdyt-layer-img-item');
    img_list.css({
        'display':'block',
        'position':'absolute',
        'width':$(window).width(),
        'height':$(window).height(),
        //'height':$(window).height() - 110,
        'top':0,
        'left':0,
        'background-position':'center center',
        'background-size':'contain',
        'background-repeat':'no-repeat'
    })
    //获取当前图片在我们的浮层中，启动动画前的宽高、以及位置 
    var mid_li = ul.find('li[mid-li]');
    var img = mid_li.find('.bdyt-layer-img-item');
    var target_top = 0;
    var target_left = 0;
    var target_width = $(window).width();
    var target_height = $(window).height();
    var org_left = img.attr('org-left');
    var org_top = img.attr('org-top');
    var org_width = img.attr('org-width');
    var org_height = img.attr('org-height');
    var org_wh_rate = img.attr('org-wh-rate');
    var org_hw_rate = org_height/org_width;
    if(org_wh_rate > win_wh_rate)
    {
        target_width = parseInt(org_width);
        target_height = parseInt(target_width * win_hw_rate);
        target_left = parseInt(org_left);
        target_top = parseInt(org_top) - parseInt((target_height-org_height)/2);
    }
    //假如高多了 
    else
    {
        target_height = parseInt(org_height);
        target_width = parseInt(target_height * win_wh_rate);
        target_top = parseInt(org_top);
        target_left = parseInt(org_left) - parseInt((target_width-org_width)/2);
    }
    //img.css({'width':target_width,'height':target_height - 110,'top':target_top,'left':target_left});
    img.css({'width':target_width,'height':target_height ,'top':target_top,'left':target_left});
};
bdYuntu.main.animation =function($){
    var mid_li = $('[mid-li]');
    var cur_img = mid_li.find('.bdyt-layer-img-item');
    var org_width = cur_img.width();
    var org_height = cur_img.height();
    var org_top = cur_img.offset().top;
    var org_left = cur_img.offset().left;
    var org_wh_rate = org_width/org_height;
    var org_hw_rate = org_height/org_width;
    //假如宽多了 
    var target_width = $(window).width();
    //var target_height = $(window).height() - 110;
    var target_height = $(window).height() ;
    var target_top = 0;
    var target_left = 0;
    //改变宽高和位置 
    cur_img.css({
        top:target_top,
        left:target_left,
        width:target_width,
        height:target_height,
        '-webkit-transition':'all 0.5s',
        '-moz-transition':'all 0.5s',
        '-o-transition':'all 0.5s',
        '-ms-transition':'all 0.5s',
        'transition':'all 0.5s'
    });
    $('.bdyt-layer-img-list').css({
        'background-color':'#222',
        '-webkit-transition':'all 0.5s',
        '-moz-transition':'all 0.5s',
        '-o-transition':'all 0.5s',
        '-ms-transition':'all 0.5s',
        'transition':'all 0.5s'
    });
};

// edit by deju
bdYuntu.main.render =function($,cur_gallery){
    //向下滑一下，禁止浏览器工具栏
    var scrollObj = bdYuntu.util.scroll.getScroll();
    var org_top = scrollObj.scrollTop;
    window.scrollTo(0, org_top+1);
    bdYuntu.index.touchmove_lock = 1;
    bdYuntu.main.is_open = 1;
    var div = bdYuntu.main.html($,cur_gallery);
    bdYuntu.main.css($, cur_gallery,div);
    $('body').append(div);
    // by deju
    $('body').find('.bdyt-layer-img-list li[mid-li="0"]').trigger('init');
    setTimeout(function(){
        $('#bdyt-mask-layer').hide();
    },3000);
    bdYuntu.need_hidden_id_list.forEach(function(item){
        $("#"+item).hide();
    });
};

bdYuntu.main.close =function($){
    var img_list = $('.bdyt-layer-img-list');
    $('#bdyt-menu-layer')&&$('#bdyt-menu-layer').remove();
    $('.bdyt-layer-wrapper')&&$('.bdyt-layer-wrapper').remove();
    $('#bdyt-mask-layer')&&$('#bdyt-mask-layer').remove();
    //隐藏原网页index过高的东西 
    bdYuntu.need_hidden_id_list.forEach(function(item){
        $("#"+item).show();
    });
    bdYuntu.index.touchmove_lock = 0;
    bdYuntu.main.is_open = false;
    //$('head').find('meta[name=viewport]').attr('content',bdYuntu.index.src_viewport);
    return 0;
}
//绑定事件
bdYuntu.main.org_pinch_len = 0;
bdYuntu.main.org_scale = 1;
bdYuntu.main.get_triangle_distance = function(e){
    var x1 = e.targetTouches[0].clientX;
    var y1 = e.targetTouches[0].clientY;
    var x2 = e.targetTouches[1].clientX;
    var y2 = e.targetTouches[1].clientY;
    var x_d_val = Math.pow(x1-x2,2);
    var y_d_val = Math.pow(y1-y2,2);
    return Math.sqrt(x_d_val + y_d_val);
}
bdYuntu.main.org_offset = {x:0,y:0};
bdYuntu.main.cur_offset = {x:0,y:0};
bdYuntu.main.org_translate = {x:0,y:0};
bdYuntu.main.tap_lock = 0;
bdYuntu.main.touch_lock = 0;
bdYuntu.bindEvent = function($){
    //console.log('bind Event');
    $('body').delegate('#bdyt-mask-layer', bdYuntu.event.START,function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).hide();
    });
    // use touch event, by deju
    //查看大图入口index , by deju
    var judgeOpenObj = {};
    //$('body').on(bdYuntu.event.START, '.lgm-gallery-items', function(e){
    $('body').delegate('.lgm-gallery-items', bdYuntu.event.START, function(e){
        e.preventDefault();
        e.stopPropagation();
        if(bdYuntu.main.tap_lock)
        {
            return false;
        }
        bdYuntu.main.time_start = + new Date();
        var cur_touches = bdYuntu.event.getTouches(e);
        //console.log(cur_touches);
        if(cur_touches.length){
        
        judgeOpenObj = {
            'startX': cur_touches[0].clientX,
            'startY': cur_touches[0].clientY,
        };
        }
        judgeOpenObj['startTime'] = +new Date();
    });
    $('body').on( bdYuntu.event.MOVE, '.lgm-gallery-items', function(e){
        //console.log('galery-items move'); 
        //console.log('gallery-items move, -', e);
        bdYuntu.event.body_move = 0;
        var cur_touches = bdYuntu.event.getTouches(e);
        judgeOpenObj['endTime'] = + new Date();
        if(cur_touches.length){
            judgeOpenObj['endX'] = cur_touches[0].clientX;
            judgeOpenObj['endY'] = cur_touches[0].clientY;
            var tmp_last_x = Math.abs(judgeOpenObj['endX'] - judgeOpenObj['startX']);
            var tmp_last_y = judgeOpenObj['endY'] - judgeOpenObj['startY'];
            var scrollObj = bdYuntu.util.scroll.getScroll();
            if(Math.abs(tmp_last_y) > 5){
                window.scrollTo(0, scrollObj.scrollTop - tmp_last_y);
                judgeOpenObj['startY'] = judgeOpenObj['endY'];
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
        }
        return true;
    });
    //$('body').on(bdYuntu.event.END,'.lgm-gallery-items',  function(e){
    $('body').delegate('.lgm-gallery-items', bdYuntu.event.END, function(e){
        //console.log('galery-items end'); 
        var cur_touches = bdYuntu.event.getTouches(e);
        judgeOpenObj['endTime'] = + new Date();
        //console.log(e);
        if(cur_touches.length){
            judgeOpenObj['endX'] = cur_touches[0].clientX;
            judgeOpenObj['endY'] = cur_touches[0].clientY;
            var tmp_last_x = Math.abs(judgeOpenObj['endX'] - judgeOpenObj['startX']);
            var tmp_last_y = Math.abs(judgeOpenObj['endY'] - judgeOpenObj['startY']);
            //console.log('touch galleryitems');
        }
        //console.log('lgm gallery items end', bdYuntu.event.body_move);
        //console.log(bdYuntu.event.body_move);
        if(!bdYuntu.event.body_move){
        //判断是不是body移动 
        //}
        //if(tmp_last_x < 5 && tmp_last_y < 5){
            //console.log('lgm gallery items end close start', bdYuntu.main.time_start, bdYuntu.main.time_close_start);
            if(bdYuntu.main.time_close_start){
                if(bdYuntu.main.time_start - bdYuntu.main.time_close_start < 500){
                    return false;
                }
            }
            var scrollObj = bdYuntu.util.scroll.getScroll();
            bdYuntu.event.oldScrollTop = scrollObj.scrollTop;
            //alert(bdYuntu.event.oldScrollTop);
            $('body').addClass('no-scroll')
            var tmp_gallery = $(this).parent();
            bdYuntu.main.render($,tmp_gallery);
            bdYuntu.main.animation($, tmp_gallery);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        bdYuntu.event.body_move = 0;
        // fix chrome in android
        if(navigator.userAgent.search(/android/i) >=0 && navigator.userAgent.search(/chrome/i) >= 0){
            //console.log('click');
            if(!bdYuntu.main.is_open){
                $('.lgm-gallery-items').trigger('click');
            }
        }
    });
    $('body').on('click', '.lgm-gallery-items', function(e){
        //console.log('lgm gallery clicked');
            e.preventDefault();
            e.stopPropagation();
            //console.log(bdYuntu.main.tap_lock);
        if(bdYuntu.main.tap_lock)
        {
            return false;
        }
        bdYuntu.main.time_start = + new Date();
        // 修复关闭会自动打开的bug
        if(bdYuntu.main.time_close_start){
            if(bdYuntu.main.time_start - bdYuntu.main.time_close_start < 500){
                return false;
            }
        }
            var scrollObj = bdYuntu.util.scroll.getScroll();
            bdYuntu.event.oldScrollTop = scrollObj.scrollTop;
            //alert(bdYuntu.event.oldScrollTop);
            //console.log('gallery items click ok');
        $('body').addClass('no-scroll')
        var tmp_gallery = $(this).parent();
        bdYuntu.main.render($,tmp_gallery);
        bdYuntu.main.animation($, tmp_gallery);
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    $('body').delegate('img[bdyt-img-display],.bdyt-see-big','tap',function(e){
        e.preventDefault();
        e.stopPropagation();
        if(bdYuntu.main.tap_lock)
        {
            return false;
        }
        //打印点击日志 (为了验证问题)
        if($(this).hasClass('bdyt-see-big'))
        {
           bdYuntu.util.log&& bdYuntu.util.log.click($,{act_name:'big_img_read',page_id:'third'});
        }
        else
        {
           bdYuntu.util.log&& bdYuntu.util.log.click($,{act_name:'img_read',page_id:'third'});
        }
        e.preventDefault();
        e.stopPropagation();
        var this_dom = $(this).hasClass('bdyt-see-big')?$(this).prev('img'):$(this);
        var data_width = this_dom.attr('data-width')||0;
        var data_height = this_dom.attr('data-height')||0;
        if(data_width > 320&&data_height>100)
        {
            bdYuntu.main.render($,this_dom);
            bdYuntu.main.animation($,this_dom);
        }
    });
    $('body').delegate('img[bdyt-img-display]', bdYuntu.event.MOVE,function(){
        bdYuntu.main.tap_lock = 1;
    });
    $('body').delegate('img[bdyt-img-display]', bdYuntu.event.END,function(){
        bdYuntu.main.tap_lock = 0;
    });
    $('body').delegate('#bdyt-menu-layer', bdYuntu.event.MOVE,function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    $('body').delegate('.bdyt-layer-wrapper',bdYuntu.event.MOVE,function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    //for init image title, by deju
    $('body').delegate('.bdyt-layer-img-list li', 'init', function(e){
        var me = $(this);
        var me_index = me.attr('mid-li');
        var cur_img = bdYuntu.alter_img_list[me_index];
        $('.bdyt-layer-wrapper-info').html(cur_img.up_info).trigger('init');
        $('.bdyt-layer-wrapper-page').html(parseInt(me_index)+1 + '/' + bdYuntu.alter_img_list.length);
    });
    /*
    $('body').delegate('.bdyt-layer-img-list', 'click', function(e){
        //alert('click imglist');
        var current_time = + new Date();
        var last_time = current_time - bdYuntu.main.time_start;
        if(last_time < 500) return;
        //$('.bdyt-menu-layer-btn-close').trigger(bdYuntu.event.START);
    });
    */

    // for image detail touch event, by deju
    var titleTouchObj = {'wrap_height': 60};
    $('body').delegate('.bdyt-layer-wrapper-info', 'init', function(e){
        titleTouchObj = {'wrap_height': 60};
        var me = $(this);
        me.css('margin-top', 0);
    });
    $('body').delegate('.bdyt-layer-wrapper-info', bdYuntu.event.START, function(e){
        var me = $(this);
        var cur_touches = bdYuntu.event.getTouches(e);
        titleTouchObj['startX'] = cur_touches[0].pageX;
        titleTouchObj['startY'] = cur_touches[0].pageY;
        titleTouchObj['info_height'] = me.height();
        titleTouchObj['max_margin'] = titleTouchObj['info_height'] - titleTouchObj['wrap_height'];
        if(titleTouchObj['max_margin'] <= 0){
            titleTouchObj['no_scroll'] = true;
        }else{
            titleTouchObj['no_scroll'] = false;
        }
    });
    $('body').delegate('.bdyt-layer-wrapper-info', bdYuntu.event.MOVE, function(e){
        if(titleTouchObj['no_scroll']) return;
        var cur_touches = bdYuntu.event.getTouches(e);
        titleTouchObj['currentX'] = cur_touches[0].pageX;
        titleTouchObj['currentY'] = cur_touches[0].pageY;
        
        var dis_y = titleTouchObj['currentY'] - titleTouchObj['startY'];
        titleTouchObj['startY'] = titleTouchObj['currentY'];
        var me = $(this);
        var old_margin_top = parseInt(me.data('margin-top')) || 0;
        var new_margin_top = dis_y + old_margin_top;
        if(new_margin_top > 0){
            new_margin_top = 0;
        }else{
            if(Math.abs(new_margin_top) >= titleTouchObj['max_margin']){
                new_margin_top = -titleTouchObj['max_margin'];
            }
        }
        me.css('margin-top', new_margin_top).data('margin-top', new_margin_top);
    });

    //禁止页面上下滑动 
    $('body').on(bdYuntu.event.MOVE,function(e){
        if(bdYuntu.index.touchmove_lock)
        {
            e.preventDefault();
            e.stopPropagation();
        }
        //console.log('body move');
        //console.log('*', e, e.pageX, e.pageY);
        bdYuntu.event.body_move = 1;
    });
    //页面滑动后记录出现在可视区的图片展现日志 
    $('body').on(bdYuntu.event.END,function(e){
       
        bdYuntu.event.body_move = 0;
        var scrollObj = bdYuntu.util.scroll.getScroll();
        var cur_scroll_top = scrollObj.scrollTop;
        var scroll_top_d_val = cur_scroll_top-bdYuntu.index.scroll_top;
        if(Math.abs(scroll_top_d_val) >= $(window).height())
        {
            bdYuntu.index.scroll_top = cur_scroll_top;
            bdYuntu.index.scroll_lock&&clearTimeout(bdYuntu.index.scroll_lock);
            bdYuntu.index.scroll_lock = setTimeout(function(){bdYuntu.index.add_plate_disp_log&&bdYuntu.index.add_plate_disp_log($);},200);
        }
    });
    $('body').delegate('.bdyt-menu-layer-btn-close',bdYuntu.event.START,function(e){
        e.preventDefault();
        e.stopPropagation();
        bdYuntu.main.close($);
        bdYuntu.main.time_close_start = + new Date();
        //bdYuntu.util.log&& bdYuntu.util.log.click($,{act_name:'big_img_close',page_id:'layer'});
    });
    $('body').delegate('.bdyt-layer-wrapper-back',bdYuntu.event.END,function(e){
        e.preventDefault();
        e.stopPropagation();
        setTimeout(function(){
            window.scrollTo(0, bdYuntu.event.oldScrollTop); 
            bdYuntu.main.close($);
            bdYuntu.main.time_close_start = + new Date();
            $('body').removeClass('no-scroll');
        }, 300);
        return false;
        //bdYuntu.util.log&& bdYuntu.util.log.click($,{act_name:'big_img_close',page_id:'layer'});
    });
    //调出工具浮层 
    $('body').delegate('.bdyt-layer-img-item','singleTap',function(e){
        if(bdYuntu.main.touch_lock)
        {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        bdYuntu.menu.toggle($);
    });
    //小于4的系统保留双击事件
    // edit by deju, double click
    if(true || ($.os.version && $.os.version.split('.')[0] < 4))
    {
        $('body').delegate('.bdyt-layer-img-item','doubleTap',function(e){
            //console.log("in doubleTap");
            var cur_time = + new Date();
            if(bdYuntu.event.last_doubleTap_time){
                if(cur_time - bdYuntu.event.last_doubleTap_time < 400){
                    //console.log('double is too short');
                    return; 
                }
            }
            bdYuntu.event.last_doubleTap_time = cur_time;
            e.preventDefault();
            e.stopPropagation();
            $(this).css({
                '-webkit-transition':'all 0.5s',
                '-moz-transition':'all 0.5s',
                '-o-transition':'all 0.5s',
                '-ms-transition':'all 0.5s',
                'transition':'all 0.5s'
            });
            var arr_cur_scale = bdYuntu.util.css.get_transform($,$(this),'scale');
            var cur_scale = arr_cur_scale[0];
            if(cur_scale != 1)
            {
                bdYuntu.util.css.set_transform($,$(this),'scale',1,1);
                bdYuntu.util.css.set_transform($,$(this),'translate',0,0);
                bdYuntu.util.log&&bdYuntu.util.log.click($,{act_name:'big_img_shrink',page_id:'layer'});
            }
            else{
                bdYuntu.util.css.set_transform($,$(this),'scale',2,2);
                bdYuntu.util.css.set_transform($,$(this),'translate',0,0);
               bdYuntu.util.log&& bdYuntu.util.log.click($,{act_name:'big_img_enlarge',page_id:'layer'});
            }
            var $img_list = $('.bdyt-layer-img-list');
            bdYuntu.util.css.set_transform($,$img_list,'translate3d',0);
        });
    }
    // by deju
    // 增加点击事件判断,如果没有touchmove的情况下
    var imgTouchObj = {};
    $('body').delegate('.bdyt-layer-img-item',bdYuntu.event.START,function(e){
        e.preventDefault();
        e.stopPropagation();
        var cur_touches = bdYuntu.event.getTouches(e);
        if(bdYuntu.main.touch_lock)
        {
            return false;
        }
        var arr_org_translate = bdYuntu.util.css.get_transform($,$(this),'translate');
        bdYuntu.main.org_translate.x = parseInt(arr_org_translate[0]);
        bdYuntu.main.org_translate.y = parseInt(arr_org_translate[1]);
        imgTouchObj = {'start': true, 'startT': + new Date(), 'startX': cur_touches[0].clientX, 'doubleTouch': cur_touches.length > 1 ? 1 : 0, 'lastEndT': imgTouchObj['lastEndT']};
        if(cur_touches.length >1)
        {
            //记录刚触摸时的pinch_len以及scale 
            var arr_cur_scale = bdYuntu.util.css.get_transform($,$(this),'scale');
            var cur_scale = arr_cur_scale[0];
            bdYuntu.main.org_scale = cur_scale;
            bdYuntu.main.org_pinch_len = bdYuntu.main.get_triangle_distance(e);
            bdYuntu.main.double_touchmove = 1;
        }
        //假如是单个滑动，那么是翻页操作 
        else
        {
            bdYuntu.main.org_offset.x = cur_touches[0].clientX;
            bdYuntu.main.org_offset.y = cur_touches[0].clientY;
        }
    });
    $('body').delegate('.bdyt-layer-img-item',bdYuntu.event.MOVE,function(e){
        if(!imgTouchObj['start']) return;
        e.preventDefault();
        e.stopPropagation();
        
        var cur_touches = bdYuntu.event.getTouches(e);
        //上锁 
        imgTouchObj['move'] = true;
        imgTouchObj['endX'] = cur_touches[0].clientX;
        if(bdYuntu.main.touch_lock)
        {
            return false;
        }
        //双手拖动

        if(cur_touches.length >1)
        {
            var cur_distance = bdYuntu.main.get_triangle_distance(e);
            var org_distance = bdYuntu.main.org_pinch_len;
            var org_scale = bdYuntu.main.org_scale;
            var cur_scale_rate = cur_distance/org_distance;
            var scale_rate = (cur_scale_rate*org_scale).toFixed(2);
            $(this).css({
                '-webkit-transition':'none',
                '-moz-transition':'none',
                '-o-transition':'none',
                '-ms-transition':'none',
                'transition':'none'
            });
            bdYuntu.util.css.set_transform($,$(this),'scale',scale_rate,scale_rate);
            bdYuntu.util.css.set_transform($,$(this),'translate',cur_scale_rate*bdYuntu.main.org_translate.x,cur_scale_rate*bdYuntu.main.org_translate.y);
            bdYuntu.main.double_touchmove = 1;
            return true;
        }
        if(bdYuntu.main.double_touchmove||(bdYuntu.main.org_offset.x == 0&&bdYuntu.main.org_offset.y == 0))
        {
            bdYuntu.main.double_touchmove = 0;
            bdYuntu.main.org_offset = {x:cur_touches[0].clientX, y:cur_touches[0].clientY};
            return false;
        }
        //如果是图片放大的状态 
        var arr_cur_scale = bdYuntu.util.css.get_transform($,$(this),'scale');
        var cur_scale = arr_cur_scale[0];
        bdYuntu.main.cur_offset.x = cur_touches[0].clientX;
        bdYuntu.main.cur_offset.y = cur_touches[0].clientY;
        if(cur_scale > 1)
        {
            //去掉transition 
            $(this).css({
                '-webkit-transition':'none',
                '-moz-transition':'none',
                '-o-transition':'none',
                '-ms-transition':'none',
                'transition':'none'
            });
           var x_d_val = bdYuntu.main.cur_offset.x-bdYuntu.main.org_offset.x;
           var y_d_val = bdYuntu.main.cur_offset.y-bdYuntu.main.org_offset.y;
           var new_translate_x = x_d_val+bdYuntu.main.org_translate.x;
           var new_translate_y = y_d_val+bdYuntu.main.org_translate.y;
           var win_width = $(window).width();
            var win_height = $(window).height();
            //如果正在翻页
            if($(this).attr('is-pagging') == 1)
            {
                page(e);
                return;
            }
            //上下到边界了 
            var h_border_translate = parseInt((win_height/2)*(cur_scale-1))-1;
            var w_border_translate = parseInt((win_width/2)*(cur_scale-1))-1;
            if(new_translate_y >=h_border_translate)
            {
                new_translate_y = h_border_translate;
            }
            else if(new_translate_y <= -h_border_translate)
            {
                new_translate_y = -h_border_translate;
            }
            else{
                ;
            }
            //左右到边界了 
            var if_render_border = function(e){
                if(new_translate_x >= w_border_translate)
                {
                    new_translate_x = w_border_translate;
                    return 1;
                }
                else if(new_translate_x <= -w_border_translate)
                {
                    new_translate_x = -w_border_translate;
                    return 2;
                }
                else
                {
                    return 0;
                }
            }
            var border_reach = if_render_border(e);
            if(border_reach)
            {
                $(this).attr('render-border',1);
                //need-pagging这个属性表示到达边界了,并且需要翻页 
                if($(this).attr('need-pagging') == 1)
                {
                    $(this).css({
                        '-webkit-transition':'all 0.5s',
                        '-moz-transition':'all 0.5s',
                        '-o-transition':'all 0.5s',
                        '-ms-transition':'all 0.5s',
                        'transition':'all 0.5s'
                    });
                    bdYuntu.util.css.set_transform($,$(this),'scale',1,1);
                    bdYuntu.util.css.set_transform($,$(this),'translate',0,0);
                    page(e);
                }
                else
                {
                    bdYuntu.util.css.set_transform($,$(this),'translate', new_translate_x, new_translate_y)
                }
            }
            else
            {
                $(this).attr('render-border',0);
                $(this).attr('need-pagging',0);
                bdYuntu.util.css.set_transform($,$(this),'translate', new_translate_x, new_translate_y)
            }
        }
        //图片原尺寸状态 
        else
        {
            page(e);
        }
        function page(e){
            //计算滑动的距离，并保存现场client坐标 
            $('.bdyt-layer-img-list').css({
                '-webkit-transition':'none',
                '-moz-transition':'none',
                '-o-transition':'none',
                '-ms-transition':'none',
                'transition':'none'
            });
            var $target = $(e.currentTarget);
            $target.attr('is-pagging',1);
            //获取整个list的translate 
            var $img_list = $('.bdyt-layer-img-list');
            var arr_org_ul_translate = bdYuntu.util.css.get_transform($,$img_list,'translate3d');
            var org_ul_translate_x = parseInt(arr_org_ul_translate[0]);
            //获取x轴的d_val
            var pos_d_val = bdYuntu.main.cur_offset.x - bdYuntu.main.org_offset.x;
            bdYuntu.util.css.set_transform($,$img_list,'translate3d',pos_d_val);
        }
    });
    function toggleInfoShow(){
        setTimeout(function(){
            if(bdYuntu.event.double_click && !bdYuntu.event.double_click_lock){
                if(!bdYuntu.event.double_click_lock){
                    bdYuntu.event.double_click_lock = true;
                    $('.bdyt-layer-img-item').eq(1).trigger('doubleTap');
                    setTimeout(function(){ 
                        bdYuntu.event.double_click_lock = false; 
                    }, 500);
                }
            
            }
        
        }, 300);
        setTimeout(function(){
            if(!bdYuntu.event.double_click){
                var back_div = $('.bdyt-layer-back-wrapper');
                var back_div_con = back_div.find('div');
                var detail_div = $('.bdyt-layer-wrapper-detail');
                var detail_div_con = $('.bdyt-layer-wrapper-detail-div');
                //console.log('back_div', back_div, back_div.css('top'));
                if(!bdYuntu.event.double_click_lock){
                    var tmp_top =  parseInt(back_div.css('top'));
                    //console.log(back_div.data('show'), 'show');
                    if( back_div.data('show') != 0){
                        back_div_con.get(0).style.webkitTransitionDuration = '200ms';
                        back_div_con.get(0).style.webkitTransform = 'translate3d(0, -40px, 0)';
                        setTimeout(function(){ back_div.hide().data('show', 0);  }, 200); 

                        detail_div_con.get(0).style.webkitTransitionDuration = '200ms';
                        detail_div_con.get(0).style.webkitTransform = 'translate3d(0, 100px, 0)';
                        setTimeout(function(){ detail_div.hide().data('show', 0);  }, 200); 
                        /*
                        detail_div.animate({
                            'bottom': -100,
                        }, 200); 
                        back_div.animate({
                            'top': -40
                        }, 200);
                       */
                        //console.log('hidden ');
                    }else{                    
                        detail_div.animate({
                            'bottom': 0,
                        }, 200); 
                        /*
                        back_div.animate({
                            'top': 0
                        }, 200);
                       */
                        //setTimeout(function(){ detail_div.show().data('show', 0);  }, 20); 
                        //setTimeout(function(){ back_div.show().data('show', 1);  }, 20); 
                        back_div.show().data('show', 1);
                        detail_div.show().data('show', 1);
                        back_div_con.get(0).style.webkitTransform = 'translate3d(0, 0, 0)';
                        detail_div_con.get(0).style.webkitTransform = 'translate3d(0, 0, 0)';
                        //console.log('show ');
                    }
            }
        }
    }, 400);
}
    $('body').delegate('.bdyt-layer-img-item',bdYuntu.event.END,function(e){
        e.preventDefault();
        e.stopPropagation();
        imgTouchObj['end'] = true;
        imgTouchObj['endT'] = + new Date();
        imgTouchObj['start'] = false;
        //console.log('in end', imgTouchObj['lastEndT'], imgTouchObj['endT']);
        if(imgTouchObj['lastEndT']){
            var end_last_t = imgTouchObj['endT'] - imgTouchObj['lastEndT']; 
            //console.log('end last time', end_last_t);
            if(end_last_t < 300){
                bdYuntu.event.double_click = true;
            }else{
                bdYuntu.event.double_click = false;
            }
        }
        imgTouchObj['lastEndT'] = imgTouchObj['endT'];
        var last_time = imgTouchObj['endT'] - imgTouchObj['startT'];
        //console.log(imgTouchObj, last_time);
        if(bdYuntu.main.touch_lock)
        {
            return false;
        }
        var arr_cur_scale = bdYuntu.util.css.get_transform($,$(this),'scale');
        var cur_scale = arr_cur_scale[0];
        //复原大小 
        if(cur_scale <1)
        {
            $(this).css({
                '-webkit-transition':'all 0.5s',
                '-moz-transition':'all 0.5s',
                '-o-transition':'all 0.5s',
                '-ms-transition':'all 0.5s',
                'transition':'all 0.5s'
            });
            bdYuntu.util.css.set_transform($,$(this),'scale',1,1);
            bdYuntu.util.css.set_transform($,$(this),'translate',0,0);
        }
        // by deju
        //alert('' + last_time + ' ' + bdYuntu.main.touch_lock + ' imgMove:' + imgTouchObj['move'] + ' startX:' + imgTouchObj['startX'] + 'endX:' + imgTouchObj['endX'] );
        if(!imgTouchObj['move'] || (last_time < 50 &&  Math.abs(imgTouchObj['endX'] - imgTouchObj['startX']) < 5 && !imgTouchObj['doubleTouch'])) {
            //$(this).trigger('click');
            toggleInfoShow();
            //setTimeout(toggleInfoShow, 400);
            //$('.bdyt-menu-layer-btn-close').trigger(bdYuntu.event.START);
            //e.preventDefault();
            //e.stopPropagation();
            //alert('click close');
            //return false;
        }        
        //如果是缩小状态，那么复原
        //当大图状态到达边界松手时，置位need-pagging 
        if($(this).attr('render-border') == 1)
        {
            $(this).attr('need-pagging',1);
        }
        if($(this).attr('is-pagging') != 1)
        {
            return ;
        }
        $(this).attr('is-pagging',0);
        //如果翻过一半，那么翻页
        var total_d_val = bdYuntu.main.cur_offset.x - bdYuntu.main.org_offset.x;
        var win_width = $(window).width();
        var remainder = total_d_val%win_width;
        var new_ul_translate_x = 0;
        //橡皮筋效果的比例 
        var need_slide_rate = 0.2;
        //右滑 
        if(remainder > 0)
        {
            remainder = Math.abs(remainder);
            if(remainder/win_width > need_slide_rate)
            {
                new_ul_translate_x = win_width;
                direction = 1;
            }
        }
        // 
        else
        {
            remainder = Math.abs(remainder);
            if(remainder/win_width > need_slide_rate)
            {
                new_ul_translate_x = -win_width;
                direction = 2;
            }
        }
        //需要真正的翻页 
        if(new_ul_translate_x != 0)
        {
            bdYuntu.main.touch_lock = 1;
            //自动移动位移 
            var $img_list = $('.bdyt-layer-img-list');
            $img_list.css({
                '-webkit-transition':'all 0.1s',
                '-moz-transition':'all 0.1s',
                '-o-transition':'all 0.1s',
                '-ms-transition':'all 0.1s',
                'transition':'all 0.1s'
            });
            bdYuntu.util.css.set_transform($,$img_list,'translate3d',new_ul_translate_x);
            setTimeout(function(){
                if(direction == 1)
                {
                    //清除动画 
                    $img_list.css({
                        '-webkit-transition':'none',
                        '-moz-transition':'none',
                        '-o-transition':'none',
                        '-ms-transition':'none',
                        'transition':'none'
                    });
                    $('.bdyt-layer-img-item').css({
                        '-webkit-transition':'none',
                        '-moz-transition':'none',
                        '-o-transition':'none',
                        '-ms-transition':'none',
                        'transition':'none'
                    });
                    //倒腾dom中的attr 
                    //console.log('direction = 1');
                    //console.log($img_list);
                    var dom_begin_li = $img_list.find('[begin-li]');
                    var dom_mid_li = $img_list.find('[mid-li]');
                    var dom_end_li = $img_list.find('[end-li]');
                    var begin_img = dom_begin_li.find('.bdyt-layer-img-item');
                    var mid_img = dom_mid_li.find('.bdyt-layer-img-item');
                    var end_img = dom_end_li.find('.bdyt-layer-img-item');
                    var begin_img_url = begin_img.css('background-image');
                    var mid_img_url = mid_img.css('background-image');
                    var end_img_url = end_img.css('background-image');

                    var org_begin_index = parseInt(dom_begin_li.attr('begin-li'));
                    var org_mid_index = parseInt(dom_mid_li.attr('mid-li'));
                    var org_end_index = parseInt(dom_end_li.attr('end-li'));
                    var img_list_len = bdYuntu.alter_img_list.length;
                    var new_begin_index = ((org_begin_index-1)<0)?(org_begin_index+img_list_len-1): org_begin_index-1;
                    // tudeju
                    var new_img = bdYuntu.get_one_img_url_new(new_begin_index,4,0);
                    var new_img_url = new_img.url;
                    new_begin_index = new_img.index;
                    //倒腾background-url
                    begin_img.css('background-image',"url("+new_img_url+")");
                    mid_img.css('background-image',begin_img_url);
                    end_img.css('background-image',mid_img_url);
                    dom_begin_li.attr('begin-li',new_begin_index);
                    dom_mid_li.attr('mid-li',org_begin_index);
                    dom_mid_li.trigger('init');
                    dom_end_li.attr('end-li',org_mid_index);
                    bdYuntu.util.css.set_transform($,$img_list,'translate3d',0);
                    //改变浮层的index 
                    $('.bdyt-menu-layer-num-index').html(org_begin_index+1);
                    //解锁 
                    bdYuntu.main.touch_lock = 0;
                    bdYuntu.util.log&&bdYuntu.util.log.click($,{act_name:'img_scan_right',page_id:'layer'});
                }
                else
                {
                    $img_list.css({
                        '-webkit-transition':'none',
                        '-moz-transition':'none',
                        '-o-transition':'none',
                        '-ms-transition':'none',
                        'transition':'none'
                    });
                    $('.bdyt-layer-img-item').css({
                        '-webkit-transition':'none',
                        '-moz-transition':'none',
                        '-o-transition':'none',
                        '-ms-transition':'none',
                        'transition':'none'
                    });
                    var dom_begin_li = $img_list.find('[begin-li]');
                    var dom_mid_li = $img_list.find('[mid-li]');
                    var dom_end_li = $img_list.find('[end-li]');
                    var begin_img = dom_begin_li.find('.bdyt-layer-img-item');
                    var mid_img = dom_mid_li.find('.bdyt-layer-img-item');
                    var end_img = dom_end_li.find('.bdyt-layer-img-item');
                    var begin_img_url = begin_img.css('background-image');
                    var mid_img_url = mid_img.css('background-image');
                    var end_img_url = end_img.css('background-image');

                    var org_begin_index = parseInt(dom_begin_li.attr('begin-li'));
                    var org_mid_index = parseInt(dom_mid_li.attr('mid-li'));
                    var org_end_index = parseInt(dom_end_li.attr('end-li'));
                    var img_list_len = bdYuntu.alter_img_list.length;
                    var new_end_index = ((org_end_index+1)>= img_list_len)?(org_end_index-img_list_len+1): org_end_index+1;
                    var new_img = bdYuntu.get_one_img_url_new(new_end_index,4,1);
                    var new_img_url = new_img.url;//.up_img;
                    new_end_index = new_img.index;
                    //倒腾background-url
                    begin_img.css('background-image',mid_img_url);
                    mid_img.css('background-image',end_img_url);
                    end_img.css('background-image',"url("+new_img_url+")");
                    dom_begin_li.attr('begin-li',org_mid_index);
                    dom_mid_li.attr('mid-li',org_end_index);
                    // by deju
                    dom_mid_li.trigger('init');
                    dom_end_li.attr('end-li',new_end_index);
                    bdYuntu.util.css.set_transform($,$img_list,'translate3d',0);
                    $('.bdyt-menu-layer-num-index').html(org_end_index+1);
                    bdYuntu.main.touch_lock = 0;
                    bdYuntu.util.log&&bdYuntu.util.log.click($,{act_name:'img_scan_left',page_id:'layer'});
                }
            },101);
        }
        //不需要翻页 
        else
        {
            var $img_list = $('.bdyt-layer-img-list');
            bdYuntu.util.css.set_transform($,$img_list,'translate3d',new_ul_translate_x);
        }
    });
    /*
    var supportsOrientationChange = "onorientationchange" in window,  
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";  
    */
    //横屏事件 
    $(window).on('resize',function(){
        bdYuntu.main.resize_lock&&clearTimeout(bdYuntu.main.resize_lock);
        bdYuntu.main.resize_lock = setTimeout(function(){
            var scrollObj = bdYuntu.util.scroll.getScroll();
            var win_top = scrollObj.scrollTop || 0;
            var win_left = scrollObj.scrollLeft||0;
            var win_width =$(window).width();
            var win_height =$(window).height();
            var ul = $('.bdyt-layer-wrapper').find('ul');
            var li = ul.find('li');
            var img_list = li.find('.bdyt-layer-img-item');
            $('.bdyt-layer-wrapper').width(win_width*2);
            $('.bdyt-layer-wrapper').height(win_height*2);
            $('.bdyt-layer-wrapper').css({'margin-left':-(win_width),left:win_left,top:win_top});
            ul.width(win_width*3+10);
            ul.height(win_height+10);
            li.width(win_width);
            li.height(win_height);
            img_list.width(win_width);
            img_list.height(win_height);
        },100);
    })
}
bdYuntu.init_all_img(bdYuntu.zepto);
bdYuntu.util.log&&bdYuntu.util.log.init(bdYuntu.zepto);
//打一条第三方站点的展现日志
if(bdYuntu.alter_img_list.length >0)
{
   bdYuntu.util.log&&bdYuntu.util.log.disp(bdYuntu.zepto,{'page_id':'third'});
}
//首屏载入的时候打盘子展现日志
bdYuntu.index.add_plate_disp_log&&bdYuntu.index.add_plate_disp_log(bdYuntu.zepto);
bdYuntu.bindEvent(bdYuntu.zepto);
});
