using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ForoAgricultura.Models.DataBase.Entities;


[Index(nameof(Id), IsUnique = true)]
public class Comentary
{
    public string Text { get; set; } = null!;

    public DateTime PublicationDate { get; set; }

    public int Id { get; set; }

    public int UserId { get; set; }
    
    [ForeignKey("UserId")]

    public string UserName { get; set; }

    [JsonIgnore]
    public virtual User User { get; set; } = null!;

}
