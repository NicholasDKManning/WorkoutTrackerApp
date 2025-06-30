using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ERNDAPP.Pages;

public class ExercisesModel : PageModel
{
    private readonly ILogger<ExercisesModel> _logger;
    public ExercisesModel(ILogger<ExercisesModel> logger)
    {
        _logger = logger;
    }
    public void OnGet()
    {

    }
}
