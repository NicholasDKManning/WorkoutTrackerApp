using ERNDAPP.Models;

namespace ERNDAPP.Models
{
    public class Set
    {
        public int Id { get; set; }

        // Foreign key to Exercise
        public int ExerciseId { get; set; }
        public Exercise? Exercise { get; set; }

        public int Reps { get; set; }

        // Use decimal for weight to allow fractional weights 
        public decimal Weight { get; set; }
    }
}