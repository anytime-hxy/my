using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace DeviceWeb
{
    public class DB
    {
        private OleDbConnection cn = null;
        private static object locker = new object();
        private OleDbConnection GetConnection()
        {
            lock (locker)
            {
                if (cn == null)
                {
                    cn =
                        new OleDbConnection(
                            "Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + HttpRuntime.AppDomainAppPath + "Device.accdb;");
                }
                return cn;
            }
        }

        public DataTable GetDataTable(string sql)
        {
            DataTable userTbl = new DataTable();
            OleDbDataAdapter da = new OleDbDataAdapter(sql, GetConnection());
            da.Fill(userTbl);
            return userTbl;
        }

        public int GetCount(string sql)
        {
            DataTable userTbl = new DataTable();
            OleDbDataAdapter da = new OleDbDataAdapter("select count(*) from device where " + sql, GetConnection());
            da.Fill(userTbl);
            return int.Parse(userTbl.Rows[0][0].ToString());
        }

    }
}