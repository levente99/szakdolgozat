using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class UsersTest
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        [ForeignKey("Test")]
        public int TestId { get; set; }
        public Test Test { get; set; }

        public DateTime? Finished { get; set; }
        public int EarnedXp { get; set; }
    }
} 