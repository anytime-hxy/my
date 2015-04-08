using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeviceMvcWeb.Models
{
    public class DeviceModel
    {
        public IEnumerable<Device> Products { get; set; }
    }
}
