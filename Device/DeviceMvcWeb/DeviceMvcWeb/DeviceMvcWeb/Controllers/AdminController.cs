using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DeviceMvcWeb.Models;

namespace DeviceMvcWeb.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/

        public ActionResult Index()
        {
            return View(new EFDbContext().Device.ToList());
        }


        [HttpGet]
        public ActionResult Create()
        {
            //var a = new EFDbContext();
            //device.DeviceID = Guid.NewGuid();
            //a.Device.Add(device);
            //a.SaveChanges();
            return View();
        }

        public ActionResult Create(Device device)
        {
            var a = new EFDbContext();
            device.DeviceID = Guid.NewGuid();
            a.Device.Add(device);
            a.SaveChanges();
            return View();
        }

        [HttpGet]
        public ActionResult Delete(Guid id)
        {
            var a = new EFDbContext();
            var temp = a.Device.SingleOrDefault(c => c.DeviceID == id);
            a.Device.Remove(temp);
            a.SaveChanges();
            return View("Index", new EFDbContext().Device.ToList());
        }


    }
}
