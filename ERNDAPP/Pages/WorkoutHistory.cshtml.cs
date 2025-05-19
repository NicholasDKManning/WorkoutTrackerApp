using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ERNDAPP.Pages;

public class WorkoutHistoryModel : PageModel
{
    private readonly ILogger<WorkoutHistoryModel> _logger;

    public WorkoutHistoryModel(ILogger<WorkoutHistoryModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }
}
