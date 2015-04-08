﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="DeviceWeb.About" %>

<!DOCTYPE html>
<html lang="zh-cn" dir="ltr">
<head>
    <title>南京名炽行数码科技有限公司--关于我们--联系我们</title>
    <meta charset="utf-8" />
    <base target="_self"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="img/style.css" />
</head>
<body>
    <form id="Form1" runat="server" target="_self">
        <div class="head-box">
            <div class="head">
                <div class="search">
                    <input type="text" runat="server" id="txtStr" />
                    <button id="Button1" type="submit" runat="server" onserverclick="Unnamed_ServerClick">搜 索</button>
                </div>
                <cite>
                    <a href="Index.aspx" target="_self">首页</a>
                    <a href="Product.aspx" target="_self">产品介绍</a>
                    <a href="About.aspx" class="open" target="_self">联系我们</a>
                </cite>
                <a href="Index.aspx">
                    <img src="img/logo.png" alt=""></a>
            </div>
        </div>

        <div class="banner-box"></div>

        <div class="arc">
            <h2>关于我们</h2>
            <div class="pro">

                <div style="float: right; width: 580px;">
                    <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;南京名炽行数码科技有限公司主要经营现代办公设备、品牌电脑、会议设备、办公文具等高科技产品，并提供专业化的维修售后服务，是一家产品、技术、服务配备齐全的专业化公司。<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;本公司经营的办公产品实行多样化经营，一切以客户需求为中心。专业的办公应用方案设计；专业的方案实施；专业的售后服务。客户需求及行业专业性双元素的结合，为客户轻松、高效、经济的实现各类办公应用。<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;南京名炽行数码科技有限公司将与各企事业单位融为一体，成为大家的IT部、咨询部、网络部……
                    </p>
                </div>
                <img src="img/pic001.jpg" width="300" height="160">
            </div>
            <div style="clear: both;"></div>
        </div>

        <div class="arc content">
            <h2>联系我们</h2>
            <div class="pro">
                <img src="img/map01.jpg" width="300" height="159" style="float: right; width: 300px;">
                <div>
                    <p>公司地址：南京市玄武区珠江路688号1-01幢280室</p>
                    <p>公司邮箱：njmcxsm@126.com</p>
                    <p>联系人：王先生 </p>
                    <p>联系方式：18105180604</p>
                </div>
                <div style="clear: both; padding-bottom: 20px;"></div>
            </div>

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
                        <p>联系我们</p>
                    </li>
                </ul>
                <p class="co">copyright@2014 版权所有</p>
            </div>
        </div>
    </form>

</body>
</html>
