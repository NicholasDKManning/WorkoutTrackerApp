using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ERNDAPP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ERNDAPP.Data;
using Resend;
using Microsoft.Extensions.Options;
using ERNDAPP.Models;
using Polly;
using Polly.Extensions.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MyResendOptions>(builder.Configuration.GetSection("ResendClientOptions"));

builder.Services.AddHttpClient<ResendClient>((sp, client) =>
{
    var config = sp.GetRequiredService<IOptions<MyResendOptions>>().Value;
    if (string.IsNullOrEmpty(config.ApiKey))
        throw new InvalidOperationException("Resend API key is missing from configuration.");

    client.BaseAddress = new Uri("https://api.resend.com/");
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", config.ApiKey);
})
.AddTransientHttpErrorPolicy(p => p.RetryAsync(3));

builder.Services.AddScoped<EmailService>();

var connectionString = builder.Configuration.GetConnectionString("ERNDAPPIdentityDbContextConnection") ?? throw new InvalidOperationException("Connection string 'ERNDAPPIdentityDbContextConnection' not found.");
builder.Services.AddDbContext<ERNDDbContext>(options => options.UseSqlite(connectionString));

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
