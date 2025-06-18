using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using ERNDAPP.Models;
using Microsoft.AspNetCore.Identity;

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

            // Add this block for SQLite Identity compatibility:
            modelBuilder.Entity<IdentityRole>(entity =>
            {
                entity.Property(r => r.ConcurrencyStamp).HasColumnType("TEXT");
                entity.Property(r => r.Name).HasMaxLength(256).HasColumnType("TEXT");
                entity.Property(r => r.NormalizedName).HasMaxLength(256).HasColumnType("TEXT");
            });

            modelBuilder.Entity<ERNDUser>(entity =>
            {
                entity.Property(u => u.ConcurrencyStamp).HasColumnType("TEXT");
                entity.Property(u => u.NormalizedEmail).HasMaxLength(256).HasColumnType("TEXT");
                entity.Property(u => u.NormalizedUserName).HasMaxLength(256).HasColumnType("TEXT");
                entity.Property(u => u.Email).HasMaxLength(256).HasColumnType("TEXT");
                entity.Property(u => u.UserName).HasMaxLength(256).HasColumnType("TEXT");
            });
        }
    }

    
}