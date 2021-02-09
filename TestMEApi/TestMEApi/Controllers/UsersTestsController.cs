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
    [Route("api/[controller]")]
    [ApiController]
    public class UsersTestsController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public UsersTestsController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/UsersTests/5
        [HttpGet("{UserId}")]
        public async Task<ActionResult<List<UsersTest>>> GetUsersTest(string UserId)
        {
            var usersTest = await _context.UsersTest.Include(ut => ut.Test).Include(ut => ut.Test.Questions).Where(ut => ut.UserId == UserId).ToListAsync();

            if (usersTest == null)
            {
                return NotFound();
            }

            return usersTest;
        }

        // GET: api/UsersTests/5
        [HttpGet]
        [Route("/api/[controller]/test/{TestId}")]
        public async Task<ActionResult<List<UsersTest>>> GetAllUsersTestResult(int TestId)
        {
            var usersTest = await _context.UsersTest.Include(ut=> ut.User).Where(ut => ut.TestId == TestId).ToListAsync();

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

        // PUT: api/UsersTests/5
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

        // POST: api/UsersTests
        [HttpPost]
        public ActionResult<UsersTest> PostUsersTest(UsersTest usersTest)
        {
            _context.UsersTest.Add(usersTest);
            _context.SaveChanges();

            return StatusCode(200);
        }

        // DELETE: api/UsersTests/5
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
