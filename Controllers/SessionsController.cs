using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Interfaces;
using BLL.Models;
using System;
using DAL.Entities;
using DAL.Repository;
using BLL;
using Microsoft.AspNetCore.Authorization;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        //IDbCrud crudServ;
        /*private readonly*/
        IDbCrud crudServ;
        //private readonly FilmContext _context;
        public SessionsController(DAL.Entities.FilmContext context /*IDbCrud crudDb*/)
        {
            //_context = context;
            //crudServ = crudDb;
            crudServ = new DbDataOperation(new DbReposSQL(context));
        }

        [HttpGet("{id}")]
        public IActionResult GetSession([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var film = await _context.Film.SingleOrDefaultAsync(m => m.FilmId == id);
            var session = crudServ.GetSession(id);
            if (session == null)
            {
                return NotFound();
            }
            return Ok(session);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] SessionModel session)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.CreateSession(session);
            return CreatedAtAction("GetFilm", new { id = session.SessionId }, session);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] SessionModel session)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = crudServ.GetSession(id);
            if (item == null)
            {
                return NotFound();
            }
            item.FilmId = session.FilmId;
            item.Time = session.Time;
            item.HallId = session.HallId;
            crudServ.UpdateSession(item);
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
            crudServ.DeleteSession(id);
            return NoContent();
        }

        [HttpGet]
        public IEnumerable<SessionModel> GetAllSessions()
        {
            //return _context.Film.Include(s => s.Session);
            return crudServ.GetAllSessions()/*.Select(i => new Film(i))*/;
        }
    }
}
