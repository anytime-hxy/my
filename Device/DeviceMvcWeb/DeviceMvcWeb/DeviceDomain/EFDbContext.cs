using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeviceDomain
{
    public class EFDbContext : DbContext
    {
        public DbSet<Device> Device { get; set; }
    }
}
