using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BLL.Interfaces;
using BLL.Models;
using BLL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase //контроллер фильмов
    {
        IDbCrud crudServ;
        ILogger logger; // логгер
        public FilmsController()
        {
            crudServ = new DbDataOperation();

            var loggerFactory = LoggerFactory.Create(builder => //логгирование
            {
                builder.AddConsole();
            });

            logger = loggerFactory.CreateLogger<FilmsController>();
        }

        [HttpGet("{id}")]
        public IActionResult GetFilm([FromRoute] int id) //получение фильма по id
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var film = crudServ.GetFilm(id);
            if (film == null)
            {
                return NotFound();
            }
            return Ok(film);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] FilmModel film) //добавление нового фильма
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.CreateFilm(film);
            logger.LogInformation("A new movie has been added");
            return CreatedAtAction("GetFilm", new { id = film.FilmId }, film);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] FilmModel film) //обновление фильма
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = crudServ.GetFilm(id);
            if (item == null)
            {
                return NotFound();
            }
            item.Name = film.Name;
            item.GenreId = film.GenreId;
            item.CountryId = film.CountryId;
            item.Timing = film.Timing;
            item.Description = film.Description;
            item.Poster = film.Poster;
            crudServ.UpdateFilm(item);
            logger.LogInformation("The movie has been updated " + film.FilmId);
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id) //удаление фильма
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.DeleteFilm(id);
            logger.LogInformation("The movie has been deleted");
            return NoContent();
        }

        [HttpGet]
        public IEnumerable<FilmModel> GetAllFilms() //получение списка фильмов
        {
            return crudServ.GetAllFilms();
        }
    }
}
