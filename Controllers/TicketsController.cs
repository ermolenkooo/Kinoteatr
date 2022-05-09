using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BLL.Interfaces;
using BLL.Models;
using BLL;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase //контроллер билетов
    {
        IDbCrud crudServ;
        public TicketsController()
        {
            crudServ = new DbDataOperation();
        }

        [HttpGet("{id}")]
        public IActionResult GetTicket([FromRoute] int id) //получение билета по id
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var ticket = crudServ.GetTicket(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ticket);
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] TicketModel ticket) //обновление билета
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
        public IEnumerable<TicketModel> GetAllTickets() //получение списка билетов
        {
            return crudServ.GetAllTickets();
        }
    }
}
