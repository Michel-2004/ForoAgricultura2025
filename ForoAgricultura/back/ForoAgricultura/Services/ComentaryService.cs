using ForoAgricultura.Models.DataBase;
using ForoAgricultura.Models.DataBase.Entities;
using ForoAgricultura.Models.DataBase.Repositories.Implementations;
using ForoAgricultura.Models.Dtos;

namespace ForoAgricultura.Services;

public class ComentaryService
{

    private readonly UnitOfWork _unitOfWork;

    private readonly ComentaryRepository _comentaryRepository;


    public ComentaryService(ComentaryRepository comentaryRepository, UnitOfWork unitOfWork)
    {
        _comentaryRepository = comentaryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<Comentary>> GetAllComentarysAsync()
    {
        return await _comentaryRepository.GetAllComentaryAsync();
    }

    public async Task<Comentary> GetComentaryByIdAsync(int id)
    {
        return await _comentaryRepository.GetComentaryById(id);
    }

  
    // crea un comentario
    public async Task<Comentary> CreateComentaryAsync(ComentaryDto model)
    {
        var newComentary = new Comentary
        {
            Text = model.Text,
            PublicationDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Europe/Madrid"), // se crea a fecha actual local de españa
            UserId = model.UserId,
            UserName = model.UserName,
        };

        Comentary comentary = await _unitOfWork.ComentaryRepository.InsertComentaryAsync(newComentary)
         ?? throw new Exception("No se pudo crear el comentario.");

        await _unitOfWork.SaveAsync();

        return newComentary;
    }

    // Formatear texto
    public string FormatText(string text)
    {
        return text.Trim()
                   .ToLowerInvariant()
                   .Replace("á", "a")
                   .Replace("é", "e")
                   .Replace("í", "i")
                   .Replace("ó", "o")
                   .Replace("ú", "u");
    }
}
