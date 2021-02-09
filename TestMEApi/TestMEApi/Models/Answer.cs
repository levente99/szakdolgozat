using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class Answer
    {
        public int Id { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }

        [ForeignKey("UsersTest")]
        public int UsersTestId { get; set; }
        public int ResponseTime { get; set; }
        public sbyte UserAnswer { get; set; }
    }
}
