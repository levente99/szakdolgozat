using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class Test
    {
        public int Id { get; set; }

        public string Description { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }

        public string Title { get; set; }

        public DateTime Created { get; set; }

        public DateTime Deadline { get; set; }

        public ICollection<Question> Questions { get; set; }
    }
}
