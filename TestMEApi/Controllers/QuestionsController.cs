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
    [Route("api/questions")]
    public class QuestionsController : ControllerBase
    {
        private readonly TestMEApiContext _context;

        public QuestionsController(TestMEApiContext context)
        {
            _context = context;
        }

        // GET: api/questions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Question.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }

        // POST: api/questions
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            _context.Question.Add(question);
            var result = await _context.SaveChangesAsync();
            if(result == 0)
            {
                return StatusCode(500);
            }
            return CreatedAtAction("GetQuestion", new { id = question.Id }, question);
        }
    }
}
