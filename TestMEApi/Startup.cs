using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using TestMEApi.Data;
using Microsoft.AspNetCore.Identity;
using TestMEApi.Models;
using TestMEApi.Services;
using Microsoft.AspNetCore.Http;

namespace TestMEApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddCors();

            services.AddMvc();

            services.AddControllers().AddNewtonsoftJson();

            services.AddDbContext<TestMEApiContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("TestMEApiContext")));

            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<TestMEApiContext>()
            .AddDefaultTokenProviders();

            services.AddDistributedSqlServerCache(options => {
                options.ConnectionString = Configuration.GetConnectionString("TestMEApiContext");
                options.SchemaName = "dbo";
                options.TableName = "Session";
            });

            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(60);
                options.Cookie.HttpOnly = false;
                options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.AddSwaggerGen(swagger =>
            {
                swagger.SwaggerDoc("TestMEApi", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Test ME Api", Version = "v1.0.0" });

            });

            services.AddTransient<IMailService, SendGridMailService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(x => x
             .AllowAnyMethod()
             .AllowAnyHeader()
             .SetIsOriginAllowed(origin => true) // allow any origin
             .AllowCredentials());

            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });

            app.UseHttpsRedirection();

            app.UseSession();

            app.UseRouting();

            app.UseAuthorization();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/TestMEApi/swagger.json", "Test ME Api Endpoint");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
