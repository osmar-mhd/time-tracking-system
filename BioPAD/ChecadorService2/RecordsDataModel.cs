using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecadorServiceBPLT
{
    public class RecordsDataModel
    {
        public object pageInfo { get; set; }
        public List<RecordsRegisterModel> records { get; set; }
    }
}
