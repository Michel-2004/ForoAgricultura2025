using ForoAgricultura.Helpers;
using ForoAgricultura.Models.DataBase.Entities;

namespace ForoAgricultura.Models.DataBase;

public class Seeder
{
    private readonly ForoAgriculturaContext _context;

    public Seeder(ForoAgriculturaContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        await SeedUsersAsync();

        await _context.SaveChangesAsync();
    }

    private async Task SeedUsersAsync()
    {
        User[] users = [
                new User {
                    Name = "Miguel" ,
                    Email = "Miguel@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Almuñecar",
                    Role = "Admin"
                }
                ,
                new User {
                    Name = "Jose" ,
                    Email = "Jose@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "User"
                }
            ];

        await _context.User.AddRangeAsync(users);
    }
}
