using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TestMEApi.Data;
using TestMEApi.Models;
using TestMEApi.Services;

namespace TestMEApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private IConfiguration _configuration;
        private IMailService _mailService;
        private readonly TestMEApiContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public UsersController(IHttpContextAccessor contextAccessor, UserManager<User> userManager, SignInManager<User> signInManager, IMailService mailService, IConfiguration configuration, TestMEApiContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mailService = mailService;
            _configuration = configuration;
            _context = context;
            _contextAccessor = contextAccessor;
        }

        //GET: api/users/5
        [HttpGet("{userId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> GetUser(string userId)
        {
            var user = await _userManager.Users.SingleAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet]
        [Route("get-user-id")]
        public async Task<string> GetUserId(string userName, string password)
        {
            var user = await _userManager.Users.SingleAsync(u => u.UserName == userName && u.Password == password);

            return user.Id;
        }

        [HttpGet]
        [Route("save-to-session")]
        public IActionResult SaveToSession(string userId)
        {
            HttpContext.Session.SetString("user", userId);
            return Content(userId);
        }

        [HttpGet]
        [Route("fetch-from-session")]
        public IActionResult FetchFromSession()
        {
            string name = HttpContext.Session.GetString("user");
            return Ok(name);
        }

        [HttpPost]
        [Route("/api/login")]
        [ProducesResponseType(201)]
        [ProducesResponseType(403)]
        [ProducesResponseType(500)]
        public async Task<StatusCodeResult> Login(User user)
        {
            var findUser = _userManager.Users.First(u => u.UserName == user.UserName);
            if(!findUser.EmailConfirmed)
            {
                return StatusCode(403);
            }
            var result = await _signInManager.PasswordSignInAsync(user.UserName, user.Password, true, true);

            if (!result.Succeeded)
            {
                return StatusCode(500);
            }

            return StatusCode(200);
        }

        [HttpPost]
        [Route("/api/logout")]
        public async void Logout()
        {
            await _signInManager.SignOutAsync();
            HttpContext.Session.Remove("user");

        }

        // PUT: api/users/5
        [HttpPut("{userId}")]
        public async Task<IdentityResult> PutXp(string userId, User user)
        {
            var userManagerUser = await _userManager.FindByIdAsync(userId);
            if (userManagerUser == null)
            {
                return IdentityResult.Failed();
            }

            userManagerUser.Xp = user.Xp;

            var result = await _userManager.UpdateAsync(userManagerUser);

            return result;
        }

        [HttpPost]
        [Route("/api/register")]
        [ProducesResponseType(201)]
        [ProducesResponseType(500)]
        public async Task<IdentityResult> Register([FromBody]User user)
        {
            user.RegistrationDate = DateTime.Today;
            var result = await _userManager.CreateAsync(user, user.Password);

            if (result.Succeeded)
            {
                var tokenGenerated = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(tokenGenerated);
                var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
                var url = $"{_configuration["AppUrl"]}/api/confirm-email?email={user.Email}&token={codeEncoded}";

                await _mailService.SendEmailAsync(user, url);
            }

            return result;
        }

        [HttpGet]
        [Route("/api/confirm-email")]
        [ProducesResponseType(201)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ConfirmEmail([FromQuery()] string email, [FromQuery()] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound();

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);
            var result = await _userManager.ConfirmEmailAsync(user, codeDecoded);
            if (result.Succeeded)
            {
                return StatusCode(201);
            }
            else
            {
                return StatusCode(500);
            }
        }

        // DELETE: api/users/5
        [HttpDelete("{userId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> DeleteUser(string userId)
        {
            var user = await _context.User.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        //[HttpPost]
        //private bool UserExists(int id)
        //{
        //    return _context.User.Any(e => e.Id == id);
        //}
    }
}
 