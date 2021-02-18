using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class Question
    {

        [Required]
        public int Id { get; set; }

        [Required]
        public string Problem { get; set; }

        [Required]
        public string AnswerOne { get; set; }

        [Required]
        public string AnswerTwo { get; set; }

        public string AnswerThree { get; set; }

        public string AnswerFour { get; set; }

        [Required]
        public int TimeLimit { get; set; }

        [Required]
        public int Xp { get; set; }

        public sbyte CorrectAnswer { get; set; }
    }
}
