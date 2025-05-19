using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ERNDAPP.Pages;

public class StartWorkoutModel : PageModel
{
    private readonly ILogger<StartWorkoutModel> _logger;

    public StartWorkoutModel(ILogger<StartWorkoutModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }
}
