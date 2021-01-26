using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestMEApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public int Xp { get; set; }

        public DateTime RegistrationDate { get; set; }

        public bool Activated { get; set; }
    }
}
