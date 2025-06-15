using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using ERNDAPP.Models;

namespace ERNDAPP.Data
{
    public class ERNDDbContext : IdentityDbContext<ERNDUser>
    {
        public ERNDDbContext(DbContextOptions<ERNDDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<Exercise> Exercises { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Additional configuration if needed
        }
    }
}