using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ERNDAPP.Data;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("ERNDAPPIdentityDbContextConnection") ?? throw new InvalidOperationException("Connection string 'ERNDAPPIdentityDbContextConnection' not found.");

builder.Services.AddDbContext<ERNDDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ERNDUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ERNDDbContext>()
    .AddDefaultUI();

// Add services to the container.
builder.Services.AddRazorPages(options => options.Conventions.AuthorizePage("/Privacy"));
builder.Services.AddControllers();  // Needed for API support

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();    // Shows detailed error messages in dev
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

    app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();   // Enables routing to WorkoutApiController

app.Run();
