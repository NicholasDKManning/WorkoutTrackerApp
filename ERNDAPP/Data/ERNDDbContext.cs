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
        public DbSet<Set> Sets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Decimal precision for weight (18 digits total, 2 after decimal point)
            modelBuilder.Entity<Set>()
                .Property(s => s.Weight)
                .HasPrecision(18, 2);
        }
    }
}