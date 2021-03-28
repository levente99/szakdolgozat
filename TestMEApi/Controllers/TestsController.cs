using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Data;
using TestMEApi.Models;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace TestMEApi.Controllers
{
    [ApiController]
    [Route("api/tests")]
    public class TestsController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public TestsController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/tests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetTest()
        {
            return await _context.Test.Include(t => t.Questions).ToListAsync();
        }

        // GET: api/tests/5
        [HttpGet("{testId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Test>> GetTest(int testId)
        {
            var test = await _context.Test.Include(t => t.Questions).FirstOrDefaultAsync(t => t.Id == testId);
            if (test == null)
            {
                return StatusCode(404);
            }

            return test;
        }

        // PUT: api/tests/5
        [HttpPut("{testId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutTest(int testId, Test test)
        {
            if (testId != test.Id)
            {
                return BadRequest();
            }

            _context.Entry(test).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestExists(testId))
                {
                    return StatusCode(404);
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/tests
        [HttpPost]
        public async Task<ActionResult<Test>> PostTest([FromBody] Test test)
        {
            test.Created = DateTime.Today;
            _context.Test.Add(test);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTest", new { id = test.Id }, test);
        }

        // DELETE: api/tests/5
        [HttpDelete("{testId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Test>> DeleteTest(int testId)
        {
            var test = await _context.Test.FindAsync(testId);
            if (test == null)
            {
                return StatusCode(404);
            }

            var usersTests = _context.UsersTest.Where(ut => ut.TestId == testId).ToList();
            if (usersTests == null)
            {
                return StatusCode(404);
            }
            _context.UsersTest.RemoveRange(usersTests);
            _context.Test.Remove(test);
            await _context.SaveChangesAsync();

            return test;
        }

        private bool TestExists(int testId)
        {
            return _context.Test.Any(e => e.Id == testId);
        }
    }
}
