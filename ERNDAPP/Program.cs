using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using ERNDAPP.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ERNDAPP.Data;

var builder = WebApplication.CreateBuilder(args);
var host = Environment.GetEnvironmentVariable("PGHOST") ?? throw new InvalidOperationException("PGHOST not set");
var database = Environment.GetEnvironmentVariable("PGDATABASE") ?? throw new InvalidOperationException("PGDATABASE not set");
var username = Environment.GetEnvironmentVariable("PGUSER") ?? throw new InvalidOperationException("PGUSER not set");
var password = Environment.GetEnvironmentVariable("PGPASSWORD") ?? throw new InvalidOperationException("PGPASSWORD not set");
var port = Environment.GetEnvironmentVariable("PGPORT") ?? "5432";

var connectionString = $"Host={host};Database={database};Username={username};Password={password};Port={port};Ssl Mode=Require";

builder.Services.AddTransient<IEmailSender, EmailService>();

builder.Services.AddHttpClient();   // For IHttpClientFactory

builder.Services.AddDbContext<ERNDDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddIdentity<ERNDUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ERNDDbContext>()
    .AddDefaultUI()
    .AddDefaultTokenProviders();

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

// Seed roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<ERNDUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    // Run async method for seeding
    await SeedDataAsync(userManager, roleManager);
}

async Task SeedDataAsync(UserManager<ERNDUser> userManager, RoleManager<IdentityRole> roleManager)
{
    string[] roles = new[] { "Admin", "User" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    string adminEmail = "admin@erndapp.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        var newAdminUser = new ERNDUser { UserName = adminEmail, Email = adminEmail };
        var createUserResult = await userManager.CreateAsync(newAdminUser, "StrongPassword123!");
        if (createUserResult.Succeeded)
        {
            await userManager.AddToRoleAsync(newAdminUser, "Admin");
        }
    }
}
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();   // Enables routing to WorkoutApiController

app.Run();
