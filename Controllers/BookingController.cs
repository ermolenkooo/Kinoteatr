using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.Models;
using BLL.Interfaces;
using BLL.Services;
using DAL.Entities;
using DAL.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : Controller
    {
        IBooking serv;
        private readonly UserManager<Viewer> _userManager;

        public BookingController(DAL.Entities.FilmContext context, UserManager<Viewer> userManager)
        {
            _userManager = userManager;
            serv = new BookingService(new DbReposSQL(context));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] List<TicketModel> tickets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Viewer usr = await GetCurrentUserAsync();
            serv.NewBooking(tickets, usr.Id);
            return CreatedAtAction("", tickets);
        }

        private Task<Viewer> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);
    }
}
