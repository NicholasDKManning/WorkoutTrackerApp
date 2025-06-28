using Microsoft.AspNetCore.Mvc;
using ERNDAPP.Models;
using System.Threading.Tasks;
using ERNDAPP.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> SaveWorkout([FromBody] List<WorkoutSession> workoutSessions)
        {
            // Validate input
            if (workoutSessions == null)
            {
                return BadRequest("Workout data is required.");
            }

            // Validate user ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not logged in");

            foreach (var ws in workoutSessions)
            {
                ws.UserId = userId;
                _dbContext.WorkoutSessions.Add(ws);
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Workout saved successfully!" });
        }

        // DELETE: api/workoutapi/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            // Check user ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not logged in");

            // Find the saved workout session by id and user id
            var workout = await _dbContext.WorkoutSessions
                .Include(ws => ws.Exercises)
                .ThenInclude(e => e.Sets)
                .FirstOrDefaultAsync(ws => ws.Id == id && ws.UserId == userId);

            if (workout == null)
            {
                return NotFound("Workout not found or you do not have permission to delete it.");
            }

            // Remove the workout
            _dbContext.WorkoutSessions.Remove(workout);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Workout deleted successfully." });
        }

        // GET: api/workoutapi/userworkouts
        [HttpGet("userworkouts")]
        public async Task<IActionResult> GetUserWorkouts()
        {
            try
            {
                // Make sure the user is authenticated
                if (User?.Identity == null || !User.Identity.IsAuthenticated)
                    return Unauthorized();

                // Get the user's ID
                var userId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

                // Fetch workouts for this user with the exercises
                var workouts = await _dbContext.WorkoutSessions
                    .Where(ws => ws.UserId == userId)
                    .Include(ws => ws.Exercises)
                        .ThenInclude(e => e.Sets)
                    .ToListAsync();

                foreach (var workout in workouts)
                {
                    if (workout.Exercises != null)
                    {
                        workout.Exercises = workout.Exercises
                            .OrderBy(e => e.Id)  // or another property if you want
                            .ToList();

                        foreach (var exercise in workout.Exercises)
                        {
                            if (exercise.Sets != null)
                            {
                                exercise.Sets = exercise.Sets
                                    .OrderBy(s => s.Id)
                                    .ToList();
                            }
                        }
                    }
                }

                return Ok(workouts);
            }
            catch (Exception ex)
            {
                // Log the error (to console, file, or logger)
                Console.WriteLine("Error in GetUserWorkouts: " + ex.ToString());
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}