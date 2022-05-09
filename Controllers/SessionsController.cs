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
    public class SessionsController : ControllerBase //контроллер сеансов
    {
        IDbCrud crudServ;
        ILogger logger; // логгер
        public SessionsController()
        {
            crudServ = new DbDataOperation();

            var loggerFactory = LoggerFactory.Create(builder => //логгирование
            {
                builder.AddConsole();
            });

            logger = loggerFactory.CreateLogger<SessionsController>();
        }

        [HttpGet("{id}")]
        public IActionResult GetSession([FromRoute] int id) //получение сеанса по id
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var session = crudServ.GetSession(id);
            if (session == null)
            {
                return NotFound();
            }
            return Ok(session);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] SessionModel session) //добавление нового сеанса
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.CreateSession(session);
            logger.LogInformation("A new session has been added " + session.Time);
            return CreatedAtAction("GetFilm", new { id = session.SessionId }, session);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] SessionModel session) //обновление сеанса
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
        public IActionResult Delete([FromRoute] int id) //удаление сеанса
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            crudServ.DeleteSession(id);
            return NoContent();
        }

        [HttpGet]
        public IEnumerable<SessionModel> GetAllSessions() //получение списка сеансов
        {
            return crudServ.GetAllSessions();
        }
    }
}
