<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="DeviceWeb.Search" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base target="_self"/>
    <title>南京名炽行数码科技有限公司--产品列表</title>
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
                    <a href="Product.aspx" class="open" target="_self">产品介绍</a>
                    <a href="About.aspx" target="_self">联系我们</a>
                </cite>
                <a href="Index.aspx">
                    <img src="img/logo.png" alt=""></a>
            </div>
        </div>

        <div class="banner-box"></div>


        <div class="arc">
            <h2>产品搜索</h2>
            <div style="clear: both;"></div>

            <div class="result">搜索结果：<b runat="server" id="searchContent"></b></div>
            <div class="printer" runat="server" ID="resultDIv">
                <asp:Repeater runat="server" ID="Repeater0">
                    <ItemTemplate>
                        <div>
                            <p style="font-size: 16px; color: #666; font-weight: bold;"><%#Eval("Type2") %></p>
                            <p class="epson"><%#Eval("brand") %>&nbsp;&nbsp;<%#Eval("type3") %>&nbsp;&nbsp;<%#Eval("DeviceName") %></p>
                            <a href="<%#Eval("DetailUrl") %>" class="check" style="display: <%#(Eval("DetailUrl").ToString()=="无"||Eval("DetailUrl").ToString()=="")?"none":"block" %>">查看详情</a>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>
                <%--<div>
                <p style="font-size: 16px; color: #666; font-weight: bold;">喷墨打印机</p>
                <p class="epson">爱普生 L301 墨仓式打印机</p>
                <a href="" class="check">查看详情</a>
            </div>
            <div>
                <p style="font-size: 16px; color: #666; font-weight: bold;">喷墨打印机</p>
                <p class="epson">爱普生 L301 墨仓式打印机</p>
                <a href="" class="check">查看详情</a>
            </div>
            <div style="border: 0">
                <p style="font-size: 16px; color: #666; font-weight: bold;">喷墨打印机</p>
                <p class="epson">爱普生 L301 墨仓式打印机</p>
                <a href="" class="check">查看详情</a>
            </div>--%>
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
                        <p><a href="About.aspx" target="_self">联系我们</a></p>
                    </li>
                </ul>
                <p class="co">copyright@2014 版权所有</p>
            </div>
        </div>
    </form>
</body>
</html>

