using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;

namespace ERNDAPP.Data
{
    public class ERNDDbContext : IdentityDbContext<ERNDUser> 
    {
        public ERNDDbContext(DbContextOptions<ERNDDbContext> options)
            : base(options)
            {
                
            }
    }
}