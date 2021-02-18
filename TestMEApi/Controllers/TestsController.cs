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
        [HttpGet("{id}")]
        public async Task<ActionResult<Test>> GetTest(int id)
        {
            var test = await _context.Test.Include(t => t.Questions).FirstOrDefaultAsync(t => t.Id == id);
            if (test == null)
            {
                return NotFound();
            }
            

            return test;
        }

        // PUT: api/tests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTest(int id, Test test)
        {
            if (id != test.Id)
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
                if (!TestExists(id))
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

        // POST: api/tests
        [HttpPost]
        public async Task<ActionResult<Test>> PostTest([FromBody] Test test)
        {
            //test.Deadline = test.Deadline.ToString("yyyy-MM-dd");
            //test.Deadline = DateTime.ParseExact(stringDate, "yyyy-MM-dd", null);
            _context.Test.Add(test);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTest", new { id = test.Id }, test);
        }

        // DELETE: api/tests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Test>> DeleteTest(int id)
        {
            var test = await _context.Test.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }

            var usersTests = _context.UsersTest.Where(ut => ut.TestId == id).ToList();
            if (usersTests == null)
            {
                return NotFound();
            }
            _context.UsersTest.RemoveRange(usersTests);
            _context.Test.Remove(test);
            await _context.SaveChangesAsync();

            return test;
        }

        private bool TestExists(int id)
        {
            return _context.Test.Any(e => e.Id == id);
        }
    }
}
