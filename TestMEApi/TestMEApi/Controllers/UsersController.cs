using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private IConfiguration _configuration;
        private IMailService _mailService;
        private readonly TestMEApiContext _context;

        public UsersController(UserManager<User> userManager,SignInManager<User> signInManager, IMailService mailService, IConfiguration configuration ,TestMEApiContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mailService = mailService;
            _configuration = configuration;
            _context = context;
        }

        //// GET: api/Users
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<User>>> GetUser()
        //{
        //    return await _context.User.Include(u => u.RoleId).ToListAsync();
        //}

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _userManager.Users.SingleAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpPost]
        [Route("/api/[controller]/login")]
        public async Task<Microsoft.AspNetCore.Identity.SignInResult> Login(User user)
        {
            var result = await _signInManager.PasswordSignInAsync(user.UserName, user.Password, true, true);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: true);
            }

            return result;
        }

        [HttpPost]
        [Route("/api/[controller]/logout")]
        public async void Logout() => await _signInManager.SignOutAsync();

        //// PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IdentityResult> PutXp(string id, User user)
        {
            var userManagerUser = await _userManager.FindByIdAsync(id);
            if (userManagerUser == null)
            {
                return IdentityResult.Failed();
            }

            userManagerUser.Xp = user.Xp;

            var result = await _userManager.UpdateAsync(userManagerUser);

            return result;
        }

        [HttpPost]
        [Route("/api/[controller]/register")]
        public async Task<IdentityResult> RegisterUser(User user)
        {
            user.RegistrationDate = DateTime.Today;
            var result = await _userManager.CreateAsync(user, user.Password);

            if (result.Succeeded)
            {
                var tokenGenerated = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(tokenGenerated);
                var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
                var url = $"{_configuration["AppUrl"]}/api/users/ConfirmEmail?email={user.Email}&token={codeEncoded}";

                await _mailService.SendEmailAsync(user, url);
            }

            return result;
        }
                
        [HttpGet]
        [Route("/api/[controller]/ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromQuery()] string email, [FromQuery()] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound();

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);
            var result = await _userManager.ConfirmEmailAsync(user, codeDecoded);
          
            return StatusCode(200);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(string id)
        {
            var user = await _context.User.FindAsync(id);
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
 