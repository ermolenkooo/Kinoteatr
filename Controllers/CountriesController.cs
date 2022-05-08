using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using Kinoteatr.Models;
using BLL.Interfaces;
using BLL.Models;
using DAL.Entities;
using DAL.Repository;
using BLL;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        //private readonly FilmContext _context;
        IDbCrud crudServ;
        public CountriesController(/*DAL.Entities.FilmContext context*/ /*IDbCrud crudDb*/)
        {
            //_context = context;
            //crudServ = crudDb;
            crudServ = new DbDataOperation(/*new DbReposSQL(context)*/);
        }

        [HttpGet]
        public IEnumerable<CountryModel> GetAllCountries()
        {
            return crudServ.GetAllCountries();
        }
    }
}
