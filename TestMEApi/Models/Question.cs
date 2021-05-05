using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class Question
    {
        public int Id { get; set; }

        public string Problem { get; set; }

        public string AnswerOne { get; set; }

        public string AnswerTwo { get; set; }

        public string AnswerThree { get; set; }

        public string AnswerFour { get; set; }

        public int TimeLimit { get; set; }

        public int Xp { get; set; }

        public sbyte CorrectAnswer { get; set; }
    }
}
