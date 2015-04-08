<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Product.aspx.cs" Inherits="DeviceWeb.Product" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base target="_self"/>
    <title>南京名炽行数码科技有限公司--产品列表</title>
    <link rel="stylesheet" href="img/style.css" />
</head>
<script type="text/javascript" src="/img/jquery-1.11.0.js"></script>

<script type="text/javascript">
    //函数说明：合并指定表格（表格id为_w_table_id）指定列（列数为_w_table_colnum）的相同文本的相邻单元格   
    //参数说明：_w_table_id 为需要进行合并单元格的表格的id。如在HTMl中指定表格 id="data" ，此参数应为 #data    
    //参数说明：_w_table_colnum 为需要合并单元格的所在列。为数字，从最左边第一列为1开始算起。   
    function _w_table_rowspan(_w_table_id, _w_table_colnum) {
        _w_table_firsttd = "";
        _w_table_currenttd = "";
        _w_table_SpanNum = 0;
        _w_table_Obj = $(_w_table_id + " tr td:nth-child(" + _w_table_colnum + ")");
        _w_table_Obj.each(function (i) {
            if (i == 0) {
                _w_table_firsttd = $(this);
                _w_table_SpanNum = 1;
            } else {
                _w_table_currenttd = $(this);
                if (_w_table_firsttd.text() == _w_table_currenttd.text() && _w_table_firsttd.attr("name") == _w_table_currenttd.attr("name") && _w_table_currenttd.attr("colspan") != "5" && _w_table_firsttd.attr("colspan") != "5") {
                    _w_table_SpanNum++;
                    _w_table_currenttd.hide(); //remove();   
                    _w_table_firsttd.attr("rowSpan", _w_table_SpanNum);
                } else {
                    _w_table_firsttd = $(this);
                    _w_table_SpanNum = 1;
                }
            }
        });
    }

    $(document).ready(function () {
        _w_table_rowspan("#tabledata", 1);
        _w_table_rowspan("#tabledata", 2);
        _w_table_rowspan("#tabledata", 3);
        _w_table_rowspan("#tabledata", 4);
    });
</script>
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

                <table width="100%" border="0" cellspacing="0" id="tabledata" cellpadding="0" class="border01">
                    <asp:Repeater runat="server" ID="Repeater0" OnItemDataBound="Repeater0_ItemDataBound">
                        <ItemTemplate>
                            <tr>
                                <td colspan="5"><%#Eval("type1") %></td>
                            </tr>
                            <asp:Repeater runat="server" ID="Repeater0">
                                <ItemTemplate>
                                    <tr>
                                        <td width="11%" name="<%#Eval("type1") %>"><%#Eval("type2") %></td>
                                        <td width="15%" name="<%#Eval("type1") %>"><%#Eval("type3") %></td>
                                        <td width="22%" name="<%#Eval("type1") %>"><%#Eval("brand") %></td>
                                        <td width="40%" name="<%#Eval("type1") %>">
                                            <p><%#Eval("deviceName") %></p>
                                        </td>
                                        <td width="12%"><a href="<%#Eval("detailurl") %>" style="display: <%#(Eval("DetailUrl").ToString()=="无"||Eval("DetailUrl").ToString()=="")?"none":"block" %>">点击查看详情</a></td>
                                    </tr>
                                </ItemTemplate>
                            </asp:Repeater>
                        </ItemTemplate>
                    </asp:Repeater>
                    <%--<tr>
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
                    </tr>--%>
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
