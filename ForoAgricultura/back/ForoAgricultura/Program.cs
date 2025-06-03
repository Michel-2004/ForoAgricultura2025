
using ForoAgricultura.Models.DataBase;
using ForoAgricultura.Models.DataBase.Repositories.Implementations;
using ForoAgricultura.Models.Mappers;
using ForoAgricultura.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace ForoAgricultura;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Inyectamos el DbContext
        builder.Services.AddScoped<ForoAgriculturaContext>();
        builder.Services.AddScoped<UnitOfWork>();

        // Inyección de todos los repositorios
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<ComentaryRepository>();

        // Inyección de Mappers
        builder.Services.AddScoped<UserMapper>();

        // Inyección de Servicios
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<ComentaryService>();



        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        
        builder.Services.AddControllers();
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        // Configuración de autenticaci�n
        builder.Services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                Settings settings = builder.Configuration.GetSection(Settings.SECTION_NAME).Get<Settings>();
                string key = settings.JwtKey;

                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });


        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp",
                policy =>
                {
                    policy.WithOrigins("http://localhost:4200") // URL del cliente Angular
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });


        var app = builder.Build();

        // Configure the HTTP request pipeline.

        app.UseSwagger();
        app.UseSwaggerUI();


        app.UseHttpsRedirection();

        app.UseCors("AllowAngularApp");

        app.UseAuthorization();


        app.MapControllers();

        await InitDatabaseAsync(app.Services);



        app.Run();

    }
    // metodo para el seeder
    static async Task InitDatabaseAsync(IServiceProvider serviceProvider)
    {
        using IServiceScope scope = serviceProvider.CreateScope();
        using ForoAgriculturaContext dbContext = scope.ServiceProvider.GetService<ForoAgriculturaContext>();

        // Si no existe la base de datos entonces la creamos y ejecutamos el seeder
        if (dbContext.Database.EnsureCreated())
        {
            Seeder seeder = new Seeder(dbContext);
            await seeder.SeedAsync();
        }
    }
}