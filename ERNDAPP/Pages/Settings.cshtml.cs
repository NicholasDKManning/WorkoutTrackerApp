using ERNDAPP.Areas.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ERNDAPP.Data;

namespace ERNDAPP.Pages.Settings
{
    public class SettingsModel : PageModel
    {
        private readonly SignInManager<ERNDUser> _signInManager;
        private readonly ILogger<SettingsModel> _logger;
        public SettingsModel(SignInManager<ERNDUser> signInManager, ILogger<SettingsModel> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        public async Task<IActionResult> OnPostLogoutAsync()
        {
            await _signInManager.SignOutAsync();
            return RedirectToPage("/Index");
        }

        public void OnGet()
        {

        }
    }
}
