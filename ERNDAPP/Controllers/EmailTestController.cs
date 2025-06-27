using Microsoft.AspNetCore.Mvc;
using ERNDAPP.Services;
using System.Threading.Tasks;

namespace ERNDAPP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailTestController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailTestController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpGet("send-test-email")]
        public async Task<IActionResult> SendTestEmail()
        {
            string testEmail = "nicholas.d.k.manning@gmail.com";
            string subject = "ERND Test Email";
            string htmlBody = "http://example.com/reset?token=12345";

            await _emailService.SendEmailAsync(testEmail, subject, htmlBody);
            return Ok("Test email sent (check inbox/spam).");
        }
    }
}