using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Data;
using TestMEApi.Models;

namespace TestMEApi.Controllers
{
    [ApiController]
    [Route("api/users-tests")]
    public class UsersTestsController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public UsersTestsController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/users-tests/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<List<UsersTest>>> GetUsersTest(string userId)
        {
            var usersTest = await _context.UsersTest.Include(ut=> ut.User).Include(ut => ut.Test).Include(ut => ut.Test.Questions).Where(ut => ut.UserId == userId).ToListAsync();

            if (usersTest == null)
            {
                return NotFound();
            }
            for (int i = 0; i < usersTest.Count; i++)
            {
                usersTest[i].Test.Deadline = usersTest[i].Test.Deadline.Date;
            }

            return usersTest;
        }

        // GET: api/users-tests/test/5
        [HttpGet]
        [Route("test/{testId}")]
        public async Task<ActionResult<List<UsersTest>>> GetAllUsersTestResult(int testId)
        {
            var usersTest = await _context.UsersTest.Include(ut=> ut.User).Where(ut => ut.TestId == testId).ToListAsync();

            //var userResults = await (from UsersTest in _context.UsersTest
            //                        join User in _context.User
            //                        on UsersTest.Id equals User.Id
            //                        select new User 
            //                        { 
            //                            UserId = User.Id,
                                        
                                        
            //                        }).ToListAsync();

            if (usersTest == null)
            {
                return NotFound();
            }
           

            return usersTest;
        }

        // PUT: api/users-tests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsersTest(int id, UsersTest usersTest)
        {
            if (id != usersTest.Id)
            {
                return BadRequest();
            }

            _context.Entry(usersTest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersTestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/users-tests
        [HttpPost]
        public ActionResult<UsersTest> PostUsersTest(UsersTest usersTest)
        {
            usersTest.User = _context.User.FirstOrDefault(u => u.Email == usersTest.User.Email);
            if(usersTest.User == null)
            {
                return StatusCode(404);
            }
            usersTest.UserId = usersTest.User.Id;
            _context.UsersTest.Add(usersTest);
            var result = _context.SaveChanges();
            if(result == 0)
            {
                return StatusCode(500);
            }
            return StatusCode(200);
        }

        // DELETE: api/users-tests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UsersTest>> DeleteUsersTest(int id)
        {
            var usersTest = await _context.UsersTest.FindAsync(id);
            if (usersTest == null)
            {
                return NotFound();
            }

            _context.UsersTest.Remove(usersTest);
            await _context.SaveChangesAsync();

            return usersTest;
        }

        [HttpPost]
        private bool UsersTestExists(int id)
        {
            return _context.UsersTest.Any(e => e.Id == id);
        }
    }
}
