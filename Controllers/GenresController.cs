using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BLL.Interfaces;
using BLL.Models;
using BLL;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenresController : ControllerBase //контроллер жанров
    {
        IDbCrud crudServ;
        public GenresController()
        {
            crudServ = new DbDataOperation();
        }

        [HttpGet]
        public IEnumerable<GenreModel> GetAllGenres() //получение списка жанров
        {
            return crudServ.GetAllGenres();
        }
    }
}
