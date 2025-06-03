using ForoAgricultura.Models.DataBase.Entities;

namespace ForoAgricultura.Models.Dtos;

public class UserDto
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Role { get; set; } = null!;

}
