using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Data;
using TestMEApi.Models;

namespace TestMEApi.Controllers
{
    [ApiController]
    [Route("api/answers")]
    public class AnswersController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public AnswersController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/answers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Answer>> GetAnswer(int id)
        {
            var answer = await _context.Answer.FindAsync(id);

            if (answer == null)
            {
                return NotFound();
            }

            return answer;
        }

        [HttpPost]
        [Route("/api/answers")]
        public async Task<ActionResult<Test>> PostTestAnswer([FromBody] List<Answer> answer)
        {
            try
            {
                answer.ForEach(a => _context.Answer.Add(a));

                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

            return StatusCode(201);
        }
    }
}
