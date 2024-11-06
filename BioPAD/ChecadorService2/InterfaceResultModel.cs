using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecadorServiceBPLT
{
    public class InterfaceResultModel
    {
        public string code { get; set; }
        public object data { get; set; }
        public string msg { get; set; }
        public int result { get; set; }
        public bool success { get; set; }
    }
}
