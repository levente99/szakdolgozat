using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Models;

namespace TestMEApi.Data
{
    public class TestMEApiContext : DbContext
    {
        public TestMEApiContext (DbContextOptions<TestMEApiContext> options)
            : base(options)
        {
        }

        public DbSet<TestMEApi.Models.User> User { get; set; }

        public DbSet<TestMEApi.Models.UsersTest> UsersTest { get; set; }

        public DbSet<TestMEApi.Models.Test> Test { get; set; }
        public DbSet<TestMEApi.Models.Answer> Answer { get; set; }
        public DbSet<TestMEApi.Models.Question> Question { get; set; }
    }
}
