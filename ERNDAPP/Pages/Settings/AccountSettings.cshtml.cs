using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using ERNDAPP.Areas.Identity.Data;

namespace ERNDAPP.Pages.Settings
{
    public class AccountSettingsModel : PageModel
    {
        private readonly UserManager<ERNDUser> _userManager;
        private readonly SignInManager<ERNDUser> _signInManager;
        public AccountSettingsModel(UserManager<ERNDUser> userManager, SignInManager<ERNDUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public void OnGet()
        {

        }

        // Reminder to add methods for signing out, account deletion, and other stuff

        // Account deletion Handler
        public async Task<IActionResult> OnPostDeleteAsync()
        {
            var user = await _userManager.GetUserAsync(User); // Gets the user

            if (user != null)
            {
                await _signInManager.SignOutAsync();    // Signs them out
                await _userManager.DeleteAsync(user);   // Deletes their account info
            }

            return RedirectToPage("/Settings");    // Return to settings page
        }

        // Sign - out of your account
        public async Task<IActionResult> OnPostLogout()
        {
            // Signs the user out
            await _signInManager.SignOutAsync();

            // Returns the user to the settings page after signing out
            return RedirectToPage("/Settings");
        }
    }
}