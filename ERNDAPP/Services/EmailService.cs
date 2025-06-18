using Resend;
using System;
using System.Threading.Tasks;

public class EmailService
{
    private readonly ResendClient _resendClient;

    public EmailService(string apiKey)
    {
        _resendClient = new ResendClient(apiKey);
    }

    public async Task SendResetPasswordEmail(string toEmail, string resetLink)
    {
        try
        {
            var response = await _resendClient.SendEmail(new SendEmailOptions
            {
                From = "nicholas.d.k.manning@gmail.com",
                To = toEmail,
                Bcc = new[] { "nicholas.d.k.manning@gmail.com" },
                Subject = "Reset Your Password",
                Html = $"<p>Click <a href=\"{resetLink}\">here</a> to reset your password.</p>"
            });

            Console.WriteLine("Email sent successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
            throw;
        }
    }
}
