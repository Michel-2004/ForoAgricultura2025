using ForoAgricultura.Models.Database.Repositories;
using ForoAgricultura.Models.DataBase.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ForoAgricultura.Models.DataBase.Repositories.Implementations;

public class ComentaryRepository : Repository<Comentary, int>
{
    public ComentaryRepository(ForoAgriculturaContext context) : base(context)
    {
    }

    public async Task<Comentary> GetComentaryById(int id)
    {
        return await GetQueryable()
            .Include(c => c.User) 
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Comentary>> GetAllComentaryAsync()
    {
        return await GetQueryable()
            .Include(c => c.User)
            .ToListAsync();
    }

    // Crear un comentario
    public async Task<Comentary> InsertComentaryAsync(Comentary newComentary)
    {
        Comentary comentary = await base.InsertAsync(newComentary);
        return comentary;
    }
}
