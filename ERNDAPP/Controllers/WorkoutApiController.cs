using Microsoft.AspNetCore.Mvc;
using ERNDAPP.Models;
using System.Threading.Tasks;
using ERNDAPP.Data;

namespace ERNDAPP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutApiController : ControllerBase
    {
        // Database Logic
        private readonly ERNDDbContext _dbContext;

        // Constructor to get the ApplkicationDbContext by dependency injection
        public WorkoutApiController(ERNDDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST: api/workoutapi/save
        // This method accepts workout session data from the frontend and saves it in the database
        [HttpPost("save")]
        public async Task<IActionResult> SaveWorkout([FromBody] WorkoutSession workoutSession)
        {
            // Validate input
            if (workoutSession == null)
            {
                return BadRequest("Workout data is required.");
            }

            // Validate user ID 
            if (string.IsNullOrEmpty(workoutSession.UserId))
            {
                return BadRequest("User ID is required.");
            }

            // Save the workout sesssion and its exercises to the database
            _dbContext.WorkoutSessions.Add(workoutSession);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Workout saved successfully!" });
        }
    }
}