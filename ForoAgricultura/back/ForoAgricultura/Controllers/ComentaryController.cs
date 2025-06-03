using ForoAgricultura.Models.DataBase.Entities;
using ForoAgricultura.Models.DataBase.Repositories.Implementations;
using ForoAgricultura.Models.Dtos;
using ForoAgricultura.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForoAgricultura.Models.DataBase.Repositories.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ComentaryController : ControllerBase
{
    private readonly ComentaryRepository _comentaryRepository;
    private readonly ComentaryService _comentaryService;

    public ComentaryController(ComentaryRepository comentaryRepository, ComentaryService comentaryService)
    {
        _comentaryRepository = comentaryRepository;
        _comentaryService = comentaryService;
    }


    [HttpGet("all")]
    public async Task<IActionResult> GetAllComentary()
    {
        var comentarys = await _comentaryService.GetAllComentarysAsync();

        if (comentarys == null || comentarys.Count == 0)
        {
            return NotFound("No se encontraron reseñas.");
        }
        return Ok(comentarys);
    }

    // crear nuevo Comentario
    [HttpPost("newComentary")]
    public async Task<ActionResult<Comentary>> Post([FromBody] ComentaryDto model)
    {
        // valida entrada
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var createdComentary = await _comentaryService.CreateComentaryAsync(model);
            return CreatedAtAction(nameof(GetAllComentary), new { id = createdComentary.Id }, createdComentary);
        }
        catch (InvalidOperationException)
        {
            return Conflict("No pudo crearse el comentario");
        }
    }

}
