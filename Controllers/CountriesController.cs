using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BLL.Interfaces;
using BLL.Models;
using BLL;

namespace Kinoteatr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase //контроллер стран
    {
        IDbCrud crudServ;
        public CountriesController()
        {
            crudServ = new DbDataOperation();
        }

        [HttpGet]
        public IEnumerable<CountryModel> GetAllCountries() //получение списка стран
        {
            return crudServ.GetAllCountries();
        }
    }
}
