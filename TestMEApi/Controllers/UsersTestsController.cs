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
    public class UserTestStatus
    {
        public int Completed { get; set; }
        public int NotCompleted { get; set; }
        public int AllXp { get; set; }
        public string Error { get; set; }
    }

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
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<UsersTest>>> GetUsersTests(string userId)
        {
            var usersTest = await _context.UsersTest.Include(ut => ut.User).Include(ut => ut.Test).Include(ut => ut.Test.Questions).Where(ut => ut.UserId == userId).ToListAsync();

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

        // GET: api/users-test/{userId}/{testId}
        [HttpGet("{userId}/{testId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<UsersTest>>> GetUsersTest(string userId, int testId)
        {
            var usersTest = await _context.UsersTest.Include(ut => ut.User).Include(ut => ut.Test).Include(ut => ut.Test.Questions).Where(ut => (ut.UserId == userId) && (ut.TestId == testId)).ToListAsync();

            if (usersTest == null)
            {
                return NotFound();
            }

            return usersTest;
        }

        // GET: api/users-test/status/{userId}
        [HttpGet("status/{userId}")]
        public async Task<UserTestStatus> GetUsersTestCompleteStatus(string userId)
        {
            var usersTest = await _context.UsersTest.Include(ut => ut.User).Include(ut => ut.Test).Include(ut => ut.Test.Questions).Where(ut => ut.UserId == userId).ToListAsync();

            if (usersTest == null)
            {
                var userTestStatusError = new UserTestStatus()
                {
                    Error = "A megadott user id nem létezik!"
                };

                return userTestStatusError;
            }

            var userTestStatus = new UserTestStatus()
            {
                Completed = usersTest.Count(ut => ut.Finished != null),
                NotCompleted = usersTest.Count(ut => ut.Finished == null),
                AllXp= usersTest.Sum(ut => ut.EarnedXp)
            };

            return userTestStatus;
        }

        // GET: api/users-tests/test/5
        [HttpGet]
        [Route("test/{testId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<UsersTest>>> GetAllUsersTestResult(int testId)
        {
            var usersTest = await _context.UsersTest.Include(ut=> ut.User).Where(ut => ut.TestId == testId).OrderByDescending(ut=> ut.EarnedXp).ToListAsync();

            if (usersTest == null)
            {
                return NotFound();
            }
           

            return usersTest;
        }

        // PUT: api/users-tests/5
        [HttpPut("{usersTestId}")]
        public async Task<IActionResult> PutUsersTest(int usersTestId, UsersTest usersTest)
        {
            if (usersTestId != usersTest.Id)
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
                if (!UsersTestExists(usersTestId))
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

        // PUT: api/users-tests/{usersTestId}/update-xp/{xp}
        [HttpPut()]
        [Route("{usersTestId}/update-xp/{xp}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateXp(int usersTestId, int xp)
        {
            var ut = await _context.UsersTest.FirstOrDefaultAsync(ut => ut.Id == usersTestId);

            if (ut == null)
            {
                return NotFound();
            }

            ut.EarnedXp = xp;
            ut.Finished = DateTime.Today;
            _context.SaveChanges();

            return StatusCode(200);
        }

        // POST: api/users-tests
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
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
        [HttpDelete("{usersTestId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<UsersTest>> DeleteUsersTest(int usersTestId)
        {
            var usersTest = await _context.UsersTest.FindAsync(usersTestId);
            if (usersTest == null)
            {
                return NotFound();
            }

            _context.UsersTest.Remove(usersTest);
            await _context.SaveChangesAsync();

            return usersTest;
        }

        [HttpPost]
        private bool UsersTestExists(int usersTestId)
        {
            return _context.UsersTest.Any(e => e.Id == usersTestId);
        }
    }
}
