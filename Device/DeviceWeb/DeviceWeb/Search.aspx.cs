using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DeviceWeb
{
    public partial class Search : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                string str = Request.QueryString["str"];
                searchContent.InnerText = str;
                var data = new DB().GetDataTable("select * from Device where DeviceName like '%" + str + "%' or type1 like '%" +
                                       str + "%' or type2 like '%" + str + "%' or type3 like '%" + str +
                                       "%' or brand like '%" + str + "%' or tag like '%" + str + "%'");
                if (data.Rows.Count < 1)
                {
                    resultDIv.InnerText = "对不起，暂时没有相关产品！";
                    return;
                }
                Repeater0.DataSource = data;
                Repeater0.DataBind();
            }
        }

        protected void Unnamed_ServerClick(object sender, EventArgs e)
        {
            Response.Redirect("Search.aspx?str=" + txtStr.Value);
        }
    }
}