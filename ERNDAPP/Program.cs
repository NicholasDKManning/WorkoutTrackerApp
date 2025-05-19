using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ERNDAPP.Data;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("ERNDAPPIdentityDbContextConnection") ?? throw new InvalidOperationException("Connection string 'ERNDAPPIdentityDbContextConnection' not found.");

builder.Services.AddDbContext<ERNDDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ERNDUser>(options => options.SignIn.RequireConfirmedAccount = false).AddEntityFrameworkStores<ERNDDbContext>().AddDefaultUI();

// Add services to the container.
builder.Services.AddRazorPages(options => options.Conventions.AuthorizePage("/Privacy"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
