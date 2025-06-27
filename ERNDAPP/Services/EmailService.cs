using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ERNDAPP.Services
{
    public class EmailService : IEmailSender
    {
        private readonly string _apiKey;
        private readonly string _fromEmail;

        public EmailService(IConfiguration config)
        {
            _apiKey = config["Resend:ApiKey"]
                ?? throw new Exception("Resend API Key is not set in configuration");

            _fromEmail = config["Resend:FromEmail"]
                ?? throw new Exception("Resend from email is not set.");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var payload = new
            {
                from = _fromEmail,
                to = toEmail,
                subject = subject,
                html = htmlMessage
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://api.resend.com/emails", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"Resend API failed: {response.StatusCode}, {errorBody}");
            }
        }
    }
}
