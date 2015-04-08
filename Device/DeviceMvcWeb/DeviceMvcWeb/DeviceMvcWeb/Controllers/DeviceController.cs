using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DeviceMvcWeb.Models;

namespace DeviceMvcWeb.Controllers
{
    public class DeviceController : Controller
    {
        //
        // GET: /Device/

        public ActionResult About()
        {
            ViewBag.AboutClass = "open";
            return View();
        }

        public ActionResult Index()
        {
            ViewBag.IndexClass = "open";
            return View();
        }

        public ActionResult Product()
        {
            ViewBag.ProductClass = "open";
            DeviceModel viewModel = new DeviceModel();
            viewModel.Products = new EFDbContext().Device.ToList();
            return View("Product", viewModel);
        }

        public ActionResult Search(string content)
        {
            return View();
        }

    }
}
