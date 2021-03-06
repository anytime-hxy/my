﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Product2.aspx.cs" Inherits="DeviceWeb.Product2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base target="_self"/>
    <title>南京名炽行数码科技有限公司--产品列表</title>
    <link rel="stylesheet" href="img/style.css" />
</head>

<body>
    <form runat="server" target="_self">
        <div class="head-box">
            <div class="head">
                <div class="search">
                    <input type="text" runat="server" id="txtStr" />
                    <button type="submit" runat="server" onserverclick="Unnamed_ServerClick">搜 索</button>
                </div>
                <cite>
                    <a href="Index.aspx" target="_self">首页</a>
                    <a href="Product.aspx" class="open" target="_self">产品介绍</a>
                    <a href="About.aspx" target="_self">联系我们</a>
                </cite>
                <a href="Index.aspx">
                    <img src="img/logo.png" alt=""></a>
            </div>
        </div>

        <div class="banner-box"></div>


        <div class="arc">
            <h2>产品列表</h2>
            <div class="pro">

                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="border01">
                    <tr>
                        <td colspan="5">打印机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="5">喷墨打印机</td>
                        <td width="15%" rowspan="3">A4喷墨打印机 </td>
                        <td width="22%" rowspan="2">爱普生（EPSON）</td>
                        <td width="40%">
                            <p>L301 墨仓式打印机</p>
                        </td>
                        <td width="12%"><a href="http://www.epson.com.cn/resource/Download/Product/productpdf/L301.pdf
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>Stylus Photo R330 高品质商务照片打印机</td>
                        <td><a href="http://www.epson.com.cn/products/inkjet/WF-3011/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>佳能（Canon）</td>
                        <td>iP2780 彩色喷墨打印机</td>
                        <td><a href="http://www.canon.com.cn/products/printer/pixma-photo/ip2780/index.html">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="2">A3喷墨打印机</td>
                        <td>爱普生（EPSON）</td>
                        <td>ME    OFFICE 1100 A3+幅面喷墨打印机</td>
                        <td><a href="http://www.epson.com.cn/products/inkjet/Epson_ME_OFFICE_1100/">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>佳能（Canon）</td>
                        <td>iX6880 高性能A3+实用喷墨双网络无线打印机</td>
                        <td><a href="http://www.canon.com.cn/products/printer/pixma-photo/ix6880/index.html">点击查看详情</a></td>
                    </tr>


                    <tr>
                        <td width="11%" rowspan="11">
                            <p>&nbsp;</p>
                            <p>激光打印机</p>
                        </td>
                        <td width="15%" rowspan="3">
                            <p>A4黑白打印机 </p>
                        </td>
                        <td width="22%" rowspan="11">惠普（HP）</td>
                        <td width="40%">HP Laserjet PRO P1108激光打印机</td>
                        <td width="12%"><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5099197&jumpid=reg_r1002_cnzh_c-001_title_r0002
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>LaserJet 1020 Plus 黑白激光打印机</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=3329728&jumpid=reg_r1002_cnzh_c-001_title_r0001
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>LaserJet Pro P1606dn 黑白激光打印机<br />
                            零秒预热，智慧驱动，自动双面打印机、带网络</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=4110411&jumpid=reg_r1002_cnzh_c-001_title_r0001
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="3">A4彩色打印机</td>
                        <td>LaserJet Pro 1025 彩色激光打印机</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5072353&jumpid=reg_r1002_cnzh_c-001_title_r0002
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>Laserjet Pro 200 M251n</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5097636&jumpid=reg_r1002_cnzh_c-001_title_r0002
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>LaserJet Pro CP1025nw 彩色激光打印机<br />
                            惠普1025nw=彩色激光机+网络+无线</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5072356&jumpid=reg_r1002_cnzh_c-001_title_r0001
">点击查看详情</a></td>
                    </tr>

                    <tr>
                        <td width="15%" rowspan="3">
                            <p>A3黑白打印机 </p>
                        </td>
                        <td>LaserJet 5200L A3黑白激光打印机</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=1137940&jumpid=reg_r1002_cnzh_c-001_title_r0006#!tab%3Dspecs
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="40%">LaserJet 5200n A3商用黑白激光打印机</td>
                        <td width="12%"><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=1137941&jumpid=reg_r1002_cnzh_c-001_title_r0003#!tab%3Dfeatures
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>LaserJet 5200dtn A3商用黑白激光打印机</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=1137943&jumpid=reg_r1002_cnzh_c-001_title_r0005#!tab%3Dspecs
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="2">A3彩色打印机</td>
                        <td>Color LaserJet Professional CP5225 彩色激光打印机</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=3974358&jumpid=reg_r1002_cnzh_c-001_title_r0001
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>Color LaserJet Professional CP5225n </td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=3974361&jumpid=reg_r1002_cnzh_c-001_title_r0003
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="3">针式打印机</td>
                        <td width="15%" rowspan="3">&nbsp;</td>
                        <td width="22%" rowspan="3">爱普生（EPSON）</td>
                        <td>LQ-630K 针式打印机（80列平推式）<br />
                            最强针式打印机 1+6复写 整机带打印头保修三年</td>
                        <td><a href="http://www.epson.com.cn/products/dot/1058/Epson_LQ_630K/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>LQ-635K 平推票据打印机 税控发票 快递单打印 白色<br />
                            LQ-630K同系列产品 15年经典 国家税务指定机型 高效 稳定</td>
                        <td><a href="http://www.epson.com.cn/products/dot/1060/Epson_LQ_635K/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="40%">
                            <p>
                                爱普生（EPSON）LQ-680KII 针式打印机（106列平推式）<br />
                                快递单打印优选，高速、稳定，满足快速物流等大打印量使用
                            </p>
                        </td>
                        <td width="12%"><a href="http://www.epson.com.cn/products/dot/1058/Epson_LQ_680K_II/">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="11">
                            <p>&nbsp;</p>
                            <p>多功能一体机</p>
                        </td>
                        <td width="15%" rowspan="3">
                            <p>喷墨3和1</p>
                        </td>
                        <td width="22%" rowspan="2">爱普生（EPSON）</td>
                        <td width="40%">L211 墨仓式一体机（打印 复印 扫描 ）<br />
                            墨仓式一体机</td>
                        <td width="12%"><a href="http://www.epson.com.cn/products/L-all-in-ones/L211/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>L358 墨仓式无线一体机（打印 复印 扫描 WiFi）<br />
                            超实用Wifi墨仓式3合1，</td>
                        <td><a href="http://www.epson.com.cn/products/L-all-in-ones/L358/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>惠普（HP）</td>
                        <td>Deskjet 3548 惠省系列彩色喷墨一体机 (打印 复印 扫描 无线网络 照片打印)</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5383666&jumpid=reg_r1002_cnzh_c-001_title_r0004
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="3">喷墨4和1</td>
                        <td>佳能（Canon）</td>
                        <td>MX478 彩色喷墨传真无线直连一体机（打印 复印 扫描 传真）<br />
                            超省4in1，无线升级可直连更加方便 在办公室再也不用线缆束缚</td>
                        <td><a href="http://www.canon.com.cn/products/printer/pixma-fax/mx478/index.html
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>惠普（HP）</td>
                        <td>Deskjet 4648 惠省系列云打印传真一体机（打印、复印、扫描、传真、照片打印、无线网络）</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=5395812&jumpid=oc_r1002_cnzh_c-001_r0004
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>爱普生（EPSON）</td>
                        <td>L551 墨仓式一体机(打印 复印 扫描 传真)</td>
                        <td><a href="http://www.epson.com.cn/products/L-all-in-ones/L551/
">点击查看详情</a></td>
                    </tr>

                    <tr>
                        <td width="15%" rowspan="2">
                            <p>激光3和1 </p>
                        </td>
                        <td width="22%">三星（SAMSUNG）</td>
                        <td width="40%">SCX-3401 黑白激光多功能一体机（打印 复印 扫描）</td>
                        <td width="12%"><a href="http://www.samsung.com/cn/consumer/computers-office/printers-multifunction/monochrome-laser-multifunction-printers-faxes/SCX-3401/XIL
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>惠普（HP）</td>
                        <td>LaserJet Pro M1136 黑白多功能激光一体机 （打印 复印 扫描）</td>
                        <td><a href="http://www8.hp.com/cn/zh/products/printers/product-detail.html?oid=4075453&jumpid=oc_r1002_cnzh_c-001_r0002
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="3">激光4和1</td>
                        <td rowspan="2">松下（Panasonic）</td>
                        <td>KX-MB1663CNW</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=2154
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>KX-MB2033CN 黑白激光一体机（打印 复印 扫描 传真）</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=653
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>惠普（HP）</td>
                        <td>LaserJet Pro M1216nfh 黑白多功能激光一体机 （打印 复印 扫描 传真）</td>
                        <td><a href="LaserJet Pro M1216nfh 黑白多功能激光一体机 （打印 复印 扫描 传真）
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">传真机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="7">传真机</td>
                        <td width="15%" rowspan="2">热敏纸传真机</td>
                        <td width="22%" rowspan="2">松下（Panasonic）</td>
                        <td width="40%">
                            <p>KX-FT872CN</p>
                        </td>
                        <td width="12%"><a href="http://pro.panasonic.cn/product/detail.html?pid=627
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>KX-FT876CN </td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=627">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>喷墨传真机</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td rowspan="2">碳带传真机</td>
                        <td rowspan="4">松下（Panasonic）</td>
                        <td>KX-FP7009CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=640">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>KX-FP7006CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=641">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="2">激光传真机</td>
                        <td>KX-FL338CN 黑白激光传真机</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=647">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>KX-FL328CN 黑白激光传真机</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=649">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">复印机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="9">复印机</td>
                        <td width="15%" rowspan="3">A3黑白复合机</td>
                        <td width="22%" rowspan="3">理光</td>
                        <td width="40%">
                            <p>MP 1813L</p>
                        </td>
                        <td width="12%"><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=2&id=187
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>MP 3053SP</td>
                        <td><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=3&id=216
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>Aficio MP 6001</td>
                        <td><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=4&id=27">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="6">
                            <p>A3彩色复合机 </p>
                        </td>
                        <td rowspan="3">理光</td>
                        <td>MP C2003SP</td>
                        <td><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=1&id=235">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>MP C2503SP</td>
                        <td><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=1&id=234">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>MP C3503SP</td>
                        <td><a href="http://www.ricoh.com.cn/products/detail.php?class=01&pc=1&id=195">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="3">震旦</td>
                        <td>ADC283</td>
                        <td><a href="http://www.aurora-oa.com/AOA/web_cn/productDetail.do?id=785007478962214">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>ADC366</td>
                        <td><a href="http://www.aurora-oa.com/AOA/web_cn/productDetail.do?id=687576072030341">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>ADC556</td>
                        <td><a href="http://www.aurora-oa.com/AOA/web_cn/productDetail.do?id=687582111586353">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">碎纸机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="2">碎纸机</td>
                        <td colspan="2" rowspan="2">科密</td>
                        <td width="40%">
                            <p>3868(16升）</p>
                        </td>
                        <td width="12%"><a href="http://www.cometgroup.com.cn/productview.aspx?tid=221&id=280">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>F6M</td>
                        <td><a href="http://www.cometgroup.com.cn/productview.aspx?tid=221&id=406">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">考勤机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="2">指纹</td>
                        <td colspan="2" rowspan="2">科密</td>
                        <td width="40%">
                            <p>N70</p>
                        </td>
                        <td width="12%"><a href="http://www.cometgroup.com.cn/productview.aspx?tid=130&id=269">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>KF-331A-U</td>
                        <td><a href="http://www.cometgroup.com.cn/productview.aspx?tid=130&id=271">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">投影机</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="11">
                            <p>&nbsp;</p>
                            <p>投影机</p>
                        </td>
                        <td width="15%">
                            <p>家庭影院型</p>
                        </td>
                        <td width="22%" rowspan="11">爱普生（EPSON）</td>
                        <td width="40%" rowspan="2">CB-S03</td>
                        <td width="12%" rowspan="2"><a href="http://www.epson.com.cn/products/projectors/239/CB-S03/

">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="2">短焦型</td>
                    </tr>
                    <tr>
                        <td>CB-X03</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/CB-X03/
">点击查看详情</a></td>
                    </tr>

                    <tr>
                        <td width="15%" rowspan="3">
                            <p>教育会议型</p>
                        </td>
                        <td>CB-W03</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/CB-W03/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="40%">CB-97</td>
                        <td width="12%"><a href="http://www.epson.com.cn/products/projectors/239/CB-97/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>CB-X18</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/CB-X18/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="2">主流工程型</td>
                        <td>CB-W18</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/CB-W18/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>CB-X21</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/CB-X21/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="15%" rowspan="3">专业剧院型</td>
                        <td>EB-C1040XN</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/244/Epson__EB_C1040XN/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>EB-C750X</td>
                        <td><a href="http://www.epson.com.cn/products/projectors/239/EB-C750X/
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td width="40%">
                            <p>EB-C760X</p>
                        </td>
                        <td width="12%"><a href="http://www.epson.com.cn/products/projectors/239/EB-C760X/">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="5">电子白板</td>
                    </tr>
                    <tr>
                        <td width="11%" rowspan="8">电子白板</td>
                        <td width="15%" rowspan="3">复写式</td>
                        <td width="22%" rowspan="8">松下</td>
                        <td width="40%">
                            <p>UB-5335-CN</p>
                        </td>
                        <td width="12%"><a href="http://pro.panasonic.cn/product/detail.html?pid=1613
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-5835-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=1614
">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-528P-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=715">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td rowspan="5">
                            <p>交互式 </p>
                        </td>
                        <td>UB-618B-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=711">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-628P-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=714">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-718B-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=710">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-728P-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=713">点击查看详情</a></td>
                    </tr>
                    <tr>
                        <td>UB-8325-CN</td>
                        <td><a href="http://pro.panasonic.cn/product/detail.html?pid=716">点击查看详情</a></td>
                    </tr>
                </table>
            </div>
            <div style="clear: both;"></div>
        </div>


        <div class="foot-box">
            <div class="foot">
                <ul>
                    <li>
                        <p>南京名炽行数码科技有限公司</p>
                        <p>玄武区珠江路688号1-01幢280室</p>
                        <p>njmcxsm@126.com</p>
                        <p>王先生 18105180604</p>
                    </li>
                    <li>
                        <p style="font-weight: bold; font-size: 14px;">业务类型</p>
                        <p>现代化办公室设备</p>
                        <p>品牌电脑</p>
                        <p>会议设备</p>
                        <p>办公文具</p>
                    </li>
                    <li>
                        <p style="font-weight: bold; font-size: 14px;">产品类型</p>
                        <p>打印机</p>
                        <p>传真机</p>
                        <p>复印机</p>
                        <p>投影机</p>
                        <p>碎纸机</p>
                    </li>
                    <li>
                        <p style="font-weight: bold; font-size: 14px; line-height: 30px;">关于我们</p>
                        <p><a href="About.aspx" target="_self">联系我们</a></p>
                    </li>
                </ul>
                <p class="co">copyright@2014 版权所有</p>
            </div>
        </div>
    </form>
</body>
</html>
