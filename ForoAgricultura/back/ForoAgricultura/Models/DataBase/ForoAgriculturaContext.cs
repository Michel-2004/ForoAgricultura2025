using ForoAgricultura.Models.DataBase.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ForoAgricultura.Models.DataBase;


public class ForoAgriculturaContext : DbContext
{

    private const string DATABASE_PATH = "ForoAgricultura.db";

    private readonly Settings _settings;

    // Tablas

    public DbSet<Comentary> Comentary { get; set; }

    public DbSet<User> User { get; set; }

    public ForoAgriculturaContext(IOptions<Settings> options)
    {
        _settings = options.Value;
    }

    // Crea archivo SQLite
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        options.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
        //options.UseSqlite(_settings.DatabaseConnection);
    }
}