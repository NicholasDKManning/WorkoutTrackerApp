using ERNDAPP.Models;

namespace ERNDAPP.Models
{
    public class Exercise
    {
        public int Id { get; set; }

        // Foreign key to workout session
        public int WorkoutSessionId { get; set; }
        public WorkoutSession? WorkoutSession { get; set; }

        public string Name { get; set; } = string.Empty;

        // Store reps per set as acomma-separated string --> 10,8,6
        public string Sets { get; set; } = string.Empty;
    }
}