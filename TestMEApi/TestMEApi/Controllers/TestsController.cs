using System;
using System.Collections.Generic;
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
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public TestsController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/Tests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetTest()
        {
            return await _context.Test.Include(t => t.Questions).ToListAsync();
        }

        // GET: api/Tests/5
        [Route("/api/[controller]/{id}")]
        public async Task<ActionResult<Test>> GetTest(int id)
        {
            var test = await _context.Test.Include(t => t.Questions).FirstOrDefaultAsync(t => t.Id == id);

            if (test == null)
            {
                return NotFound();
            }

            return test;
        }

        // PUT: api/Tests/5
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

        // POST: api/Tests
        [HttpPost]
        public async Task<ActionResult<Test>> PostTest([FromBody] Test test)
        {
            _context.Test.Add(test);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTest", new { id = test.Id }, test);
        }

        [Route("/api/[controller]/answers")]
        public async Task<ActionResult<Test>> PostTestAnswer([FromBody] List<Answer> answer)
        {
            try
            {
                answer.ForEach(a => _context.Answer.Add(a));

                await _context.SaveChangesAsync();

                return StatusCode(201);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // DELETE: api/Tests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Test>> DeleteTest(int id)
        {
            var test = await _context.Test.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }

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
