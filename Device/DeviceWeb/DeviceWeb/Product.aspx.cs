using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DeviceWeb
{
    public partial class Product : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                SetData();
            }
        }

        void SetData()
        {
            Repeater0.DataSource = new DB().GetDataTable("Select type1 From device group by type1 order by min(ID)");
            Repeater0.DataBind();
        }

        protected void Unnamed_ServerClick(object sender, EventArgs e)
        {
            Response.Redirect("Search.aspx?str=" + txtStr.Value);
        }

        protected void Repeater0_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            if (e.Item.ItemType == ListItemType.Item || e.Item.ItemType == ListItemType.AlternatingItem)
            {
                DataRowView drv = e.Item.DataItem as DataRowView;
                Repeater child = e.Item.FindControl("Repeater0") as Repeater;
                child.DataSource = new DB().GetDataTable("select * from device where type1='" + drv["type1"].ToString() + "' order by id");
                child.DataBind();

            }
        }

    }
}