using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using TestMEApi.Models;

namespace TestMEApi.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(User user, string url);
    }
    public class SendGridMailService : IMailService
    {
        public async Task SendEmailAsync(User user, string url)
        {
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);

            smtpClient.Credentials = new System.Net.NetworkCredential("test.me202199@gmail.com", "TUxY!jgvU4p3-z8");
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.EnableSsl = true;
            MailMessage mail = new MailMessage();

            //Setting From , To and CC
            mail.From = new MailAddress("test.me202199@gmail.com", "Test ME");
            mail.To.Add(new MailAddress(user.Email));
            mail.Subject = "Kérlek igazold vissza az email címed!";
            mail.IsBodyHtml = true;
            mail.Body = $"Kedves {user.FirstName} {user.LastName}! <br> <br> <p>Az alábbi linkre kattintva igazold vissza az email címed:<br><a href='{url}'>Visszaigazolom!<a>";

            await smtpClient.SendMailAsync(mail);

        }
    }
}
