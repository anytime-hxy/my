using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeviceMvcWeb.Models
{
    public class EFDbContext : DbContext
    {
        public DbSet<Device> Device { get; set; }
    }
}
