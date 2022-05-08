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
    public class TicketsController : ControllerBase
    {
        //IDbCrud crudServ;
        /*private readonly*/
        IDbCrud crudServ;
        //private readonly FilmContext _context;
        public TicketsController(/*DAL.Entities.FilmContext context*/ /*IDbCrud crudDb*/)
        {
            //_context = context;
            //crudServ = crudDb;
            crudServ = new DbDataOperation(/*new DbReposSQL(context)*/);
        }

        [HttpGet("{id}")]
        public IActionResult GetTicket([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var film = await _context.Film.SingleOrDefaultAsync(m => m.FilmId == id);
            var ticket = crudServ.GetTicket(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ticket);
        }

        //[Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] TicketModel ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = crudServ.GetTicket(id);
            if (item == null)
            {
                return NotFound();
            }
            item.SessionId = ticket.SessionId;
            item.ViewerId = ticket.ViewerId;
            item.Row = ticket.Row;
            item.Place = ticket.Place;
            item.Price = ticket.Price;
            item.Status = ticket.Status;
            crudServ.UpdateTicket(item);
            return NoContent();
        }

        [HttpGet]
        public IEnumerable<TicketModel> GetAllTickets()
        {
            //return _context.Film.Include(s => s.Session);
            return crudServ.GetAllTickets()/*.Select(i => new Film(i))*/;
        }
    }
}
