(function(){
    var areaEles={
        province:null,
        city:null,
        load:function(){
            var that=this;
            that.loaded = true;

        },
        init:function(){
            var that=this;
            if( !that.loaded ){
                setTimeout( function(){ that.init();} , 700 );
                return;
            }

            if(mapData){
                $("#contactReg_0").val(mapData.address);
            }
            var addrVal=$("#contactReg_0").val();
            if(addrVal!=''){
                var elems=addrVal.split("@|");
                if(elems[0]){
                    $("#contactP_0").val(elems[0])
                    that.PChange();
                    $("#contactP_0").val(elems[0]);
                }
                if(elems[1]){
                    $("#contactC_0").val(elems[1]);
                    that.CChange();
                    $("#contactC_0").val(elems[1]);
                }
                if(elems[2]){
                    $("#contactA_0").val(elems[2]);
                }
                if(elems[3]){
                    $("#streeName").val(elems[3]);
                }else{
                    $("#streeName").val('');
                }
                if(elems[4]){
                    $("#addrName").val(elems[4]);
                }else{
                    $("#addrName").val('');
                }
            }else{
                $("#contactP_0").val('选择省份');
                $("#contactC_0").val('选择市');
                $("#contactA_0").val('选择区');
                $("#streeName").val('');
                $("#addrName").val('');
            }
            var that=this;
            $("#contactP_0").change(function(){
                that.PChange();
            });
            $("#contactC_0").change(function(){
                that.CChange();
            });
        },
        PChange:function(){
            areaEles.province=$("#contactP_0").val();
            for(var i=0,alength=areaInfo.length; i<alength; i++){
                if(areaInfo[i].text==areaEles.province){
                    areaEles.city=i;
                    break;
                }
            }
            $("#contactC_0").empty();
            $("#contactC_0").append('<option value="">选择市</option>');
            var strCity='';
            $.each(areaInfo[areaEles.city].children,function(i,elem){
                strCity=strCity+'<option value="'+elem.text+'">'+elem.text+'</option>'
            });
            $("#contactC_0").append(strCity);
            $("#contactA_0").empty();
            $("#contactA_0").append('<option value="">选择区</option>');
        },
        CChange:function(){
            var citeIndex=areaEles.city;
            var city=$("#contactC_0").val();
            var town='';
            var Parecity=areaInfo[citeIndex].children;
            for(var i=0,clength=Parecity.length; i<clength; i++){
                if(Parecity[i].text==city){
                    town=Parecity[i].children;
                    break;
                }
            }
            $("#contactA_0").empty();
            $("#contactA_0").append('<option value="">选择区</option>');
            var strTown='';
            $.each(town,function(i,elem){
                strTown=strTown+'<option value="'+elem.text+'">'+elem.text+'</option>'
            });
            $("#contactA_0").append(strTown);
        }
    }
    $(document).ready(function(){
        areaEles.load();
       areaEles.init();
    });
})()
var siteMap={
    map:null,
    confirmPoint:null,
    address:null,
    init:function(objaddr){
        var that=this;
        this.map = new BMap.Map("map");            // 创建Map实例

        if(this.confirmPoint){
            var point = new BMap.Point(this.confirmPoint.lng, this.confirmPoint.lat);    
            this.map.centerAndZoom(point, 16);    
            var marker = new BMap.Marker(point);        // 创建标注    
            this.map.addOverlay(marker);                     // 将标注添加到地图
            marker.enableDragging();    
            marker.addEventListener("dragend", function(e){    
               //console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
               var thePoint=e.point;
               that.addnewWindow(thePoint);     
            }) 
            that.addnewWindow(point);
        }else{
            this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
            var myGeo=new BMap.Geocoder();//将地址转化成坐标
            myGeo.getPoint(objaddr.straddr, function(point){    
                 if (point) {
                   that.map.centerAndZoom(point, 16);
                   var marker=new BMap.Marker(point)    
                   that.map.addOverlay(marker); 
                   marker.enableDragging();    
                   marker.addEventListener("dragend", function(e){    
                     //console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
                     var thePoint=e.point;
                     that.addnewWindow(thePoint);     
                   }) 
                   that.addnewWindow(point);      
                 }    
            }); 
        }

        this.addControl();
    },
    addControl:function(){
        this.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
        /*this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));  //右上角，仅包含平移和缩放按钮
        this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));  //左下角，仅包含平移按钮
        this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮*/
    },
    clickOk:function(){
        $(".incloudMap").hide();
        $('.tip_cover').hide();
        var mkrs=this.map.getOverlays();
        this.confirmPoint=mkrs[0].point;
        $('.toshowMap').text('重新定位地图');
        $('#ecomAddress').attr('checked','checked');
        $('#ecomAddress').trigger('click');
        if(!$('#ecomAddress').attr('checked')){
            $('#ecomAddress').attr('checked','checked');
        }
        $(".senErro").text("");
    },
    clickCancel:function(){
        this.map.closeInfoWindow();
        $('.incloudMap').hide();
        $('.tip_cover').hide();
    },
    addnewWindow:function(point){
        var infoDiv = ''
            + "<h4 style='margin:0 0 5px 0;padding:0.2em 0;font-size:14px;text-align:center'>"
            + "把当前位置设为精确定位？</h4>"
            + "<div style='text-align:center'>"
            +   "<div style='color:#2788da'>（继续拖动图标以重新定位）</div>"
            +   "<div><input type='button' value='确定' onClick='siteMap.clickOk();'></input>&nbsp;"
            +   "&nbsp;<input type='button' value='取消' onclick='siteMap.clickCancel();'></input></div>"
            + '</div>';
        var infoWindow = new BMap.InfoWindow(infoDiv); //创建信息窗口对象
        this.map.openInfoWindow(infoWindow,point)
    }
}
$(document).ready(function(){
    if(mapData){
        siteMap.confirmPoint={};
        siteMap.confirmPoint.lng=mapData.lng;
        siteMap.confirmPoint.lat=mapData.lat;
        $('.toshowMap').text('重新定位地图');
    }
    var showAddrErro=function(elemobj,errortitle){
        if($(elemobj).next('.senErro').length>0){
            $(".senErro").text(errortitle);
        }else{
            $(elemobj).after('<span class="senErro" style="color:red;font-size:12px">'+errortitle+'</span>');
        }
    }

    $('.toshowMap').click(function(){

        var nameVal=$.trim($('#addrName').val());
        /*if(!nameVal){
            showAddrErro(".toshowMap","请填写位置名称");
            return;
        }*/
        var strVal=$.trim($('#streeName').val());
        if(!strVal){
            showAddrErro(".toshowMap","请填写详细地址");
            return;
        }
        /*if($('#contactP_0').val()==''||$('#contactC_0').val()==''||$('#contactA_0').val()==''){
            showAddrErro(".toshowMap","请选择有效的省市区");
            return;
        }*/
        var wAddr=$('#contactP_0').val()+$('#contactC_0').val()+$('#contactA_0').val()+strVal;

        var addrToSave = $('#contactP_0').val()+"@|"+$('#contactC_0').val()+"@|"+$('#contactA_0').val()+"@|"+strVal+"@|"+nameVal;
        siteMap.address = addrToSave;
        //siteMap.name = nameVal;
        siteMap.streetName = strVal;

        $('.incloudMap').show();
        $('.tip_cover').show();
        var heightAll=$('body').height();
        $('.tip_cover').css({width:'100%',height:heightAll+'px'});
        siteMap.init({straddr:wAddr});
    });
    $('#closeMapDiv').click(function(){
        $('.incloudMap').hide();
        $('.tip_cover').hide();
    });
    /*$('#addrName').keyup(function(){
        if ($(this).next().hasClass('senErro')) {
            $(this).next().remove();
        }
    });
    $('#streeName').keyup(function(){
        if ($(this).next().hasClass('senErro')) {
            $(this).next().remove();
        }
    });*/

    $(".lego-map-select").change(function(){
        siteMap.confirmPoint=null;
        $(".toshowMap").text("查看地图并确认");
    });


    $("#streeName").on('input',function(){
        siteMap.confirmPoint=null;
        $(".toshowMap").text("查看地图并确认");
    });

    /*$("#addrName").on('input',function(){
        siteMap.confirmPoint=null;
        $(".toshowMap").text("查看地图并确认");
    });*/
});


