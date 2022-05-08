using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using Kinoteatr.Models;
using BLL.Interfaces;
using BLL.Models;
using System;
using DAL.Entities;
using DAL.Repository;
using BLL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        //IDbCrud crudServ;
        /*private readonly*/ IDbCrud crudServ;
        ILogger logger; // логгер
        //private readonly FilmContext _context;
        public FilmsController(/*DAL.Entities.FilmContext context*/ /*IDbCrud crudDb*/)
        {
            //_context = context;
            //crudServ = crudDb;
            //crudServ = new DbDataOperation(new DbReposSQL(context));
            crudServ = new DbDataOperation();

            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddConsole();
            });

            logger = loggerFactory.CreateLogger<FilmsController>();
        }

        //private readonly FilmContext _context;
        //public FilmsController(FilmContext context)
        //{
        //    _context = context;
        //    //if (_context.Film.Count() == 0)
        //    //{
        //    //    _context.Film.Add(new Film
        //    //    {
        //    //        Name = "Аннетт"
        //    //    });
        //    //    _context.SaveChanges();
        //    //}
        //}

        [HttpGet("{id}")]
        public IActionResult GetFilm([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var film = await _context.Film.SingleOrDefaultAsync(m => m.FilmId == id);
            var film = crudServ.GetFilm(id);
            if (film == null)
            {
                return NotFound();
            }
            return Ok(film);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] FilmModel film)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.CreateFilm(film);
            logger.LogInformation("Был добавлен новый фильм: " + film.Name);
            //_context.Film.Add(film);
            //await _context.SaveChangesAsync();
            return CreatedAtAction("GetFilm", new { id = film.FilmId }, film);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] FilmModel film)
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
            logger.LogInformation("Был обновлен фильм: " + film.Name);
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.DeleteFilm(id);
            logger.LogInformation("Фильм был удален");
            return NoContent();
        }

        [HttpGet]
        public IEnumerable<FilmModel> GetAllFilms()
        {
            //return _context.Film.Include(s => s.Session);
            return crudServ.GetAllFilms()/*.Select(i => new Film(i))*/;
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetFilm([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    var film = await _context.Film.SingleOrDefaultAsync(m => m.FilmId == id);
        //    if (film == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(film);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] Film film)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    _context.Film.Add(film);
        //    await _context.SaveChangesAsync();
        //    return CreatedAtAction("GetFilm", new { id = film.FilmId }, film);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Film film)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    var item = _context.Film.Find(id);
        //    if (item == null)
        //    {
        //        return NotFound();
        //    }
        //    item.Name = film.Name;
        //    item.GenreId = film.GenreId;
        //    item.CountryId = film.CountryId;
        //    item.Timing = film.Timing;
        //    item.Description = film.Description;
        //    item.Poster = film.Poster;
        //    _context.Film.Update(item);
        //    await _context.SaveChangesAsync();
        //    return NoContent();
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    var item = _context.Film.Find(id);
        //    if (item == null)
        //    {
        //        return NotFound();
        //    }
        //    _context.Film.Remove(item);
        //    await _context.SaveChangesAsync();
        //    return NoContent();
        //}

        //[HttpGet]
        //public IEnumerable<Film> GetAllFilms()
        //{
        //    return _context.Film.Include(s => s.Session);
        //}
    }
}
