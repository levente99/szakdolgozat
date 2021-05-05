using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Models;

namespace TestMEApi.Data
{
    public class TestMEApiContext : IdentityDbContext
    {
        public TestMEApiContext (DbContextOptions<TestMEApiContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<User>().Ignore(u => u.PhoneNumber)
            //                            .Ignore(u => u.PhoneNumberConfirmed)
            //                            .Ignore(u => u.TwoFactorEnabled);

            modelBuilder.Entity<Test>()
            .HasMany(b => b.Questions)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
            base.OnModelCreating(modelBuilder);

        }

        public DbSet<User> User { get; set; }

        public DbSet<UsersTest> UsersTest { get; set; }

        public DbSet<Test> Test { get; set; }
        public DbSet<Answer> Answer { get; set; }
        public DbSet<Question> Question { get; set; }
        public DbSet<Role> Role { get; set; }
    }
}
