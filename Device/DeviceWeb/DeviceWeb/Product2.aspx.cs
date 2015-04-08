using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DeviceWeb
{
    public partial class Product2 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
            }
        }


        protected void Unnamed_ServerClick(object sender, EventArgs e)
        {
            Response.Redirect("Search.aspx?str=" + txtStr.Value);
        }

    }
}