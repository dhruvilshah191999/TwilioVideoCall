using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VideoCall_API.Models
{
    public class UserConnection
    {
        public string User { get; set; }
        public string Room { get; set; }
        public DateTime? date { get; set; }
    }
}
