using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace DeviceDomain
{
    public class Device
    {
        [HiddenInput(DisplayValue = false)]
        public Guid DeviceID { get; set; }
        [Required(ErrorMessage = "Please enter a product name")]
        public string DeviceName { get; set; }

        public string DeDetailUrl { get; set; }

        public string Type1 { get; set; }

        public string Type2 { get; set; }

        public string Type3 { get; set; }

        public string Brand { get; set; }

        public string Tag { get; set; }

    }
}
