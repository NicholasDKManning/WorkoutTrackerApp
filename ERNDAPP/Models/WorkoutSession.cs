using System;
using System.Collections.Generic;

namespace ERNDAPP.Models
{
    public class WorkoutSession
    {
        public int Id { get; set; }

        // Links to the users workout
        public string UserId { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Collection of exercises done in this workout session
        public List<Exercise> Exercises { get; set; } = new();
    }
}