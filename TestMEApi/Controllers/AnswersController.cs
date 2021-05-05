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
        [HttpGet("{answerId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Answer>> GetAnswer(int answerId)
        {
            var answer = await _context.Answer.FindAsync(answerId);

            if (answer == null)
            {
                return StatusCode(404);
            }

            return answer;
        }

        [HttpPost]
        [Route("/api/answers")]
        [ProducesResponseType(201)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Test>> PostTestAnswer([FromBody]Answer answer)
        {
            try
            {
                _context.Answer.Add(answer);

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
