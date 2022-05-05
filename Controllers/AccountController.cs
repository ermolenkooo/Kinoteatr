using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.Models;
using BLL.Interfaces;
using BLL.Services;
using DAL.Entities;

using Microsoft.AspNetCore.Identity;

namespace Kinoteatr.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller
    {
        private readonly UserManager<Viewer> _userManager;
        private readonly SignInManager<Viewer> _signInManager;
        //IAccount accServ;

        public AccountController(UserManager<Viewer> userManager, SignInManager<Viewer> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            //accServ = new AccountService();
        }

        [HttpPost]
        [Route("api/Account/Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                Viewer user = new Viewer
                {
                    Email = model.Email,
                    UserName = model.Email
                };
                // Добавление нового пользователя
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "user");
                    // установка куки
                    await _signInManager.SignInAsync(user, false);
                    var msg = new
                    {
                        message = "Добавлен новый пользователь: " + user.UserName
                    };
                    return Ok(msg);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    var errorMsg = new
                    {
                        message = "Пользователь не добавлен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Неверные входные данные.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        [HttpPost]

        [Route("api/Account/Login")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var msg = new
                    {
                        message = "Выполнен вход пользователем: " + model.Email
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и(или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.", error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.", error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }
        [HttpPost]
        [Route("api/Account/LogOff")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {
            // Удаление куки
            await _signInManager.SignOutAsync();
            var msg = new
            {
                message = "Выполнен выход."
            };
            return Ok(msg);
        }

        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogisAuthenticatedOff()
        {
            Viewer usr = await GetCurrentUserAsync();
            //var message = usr == null ? "Вы Гость. Пожалуйста, выполните вход." : "Вы вошли как: " + usr.UserName;
            //var msg = new
            //{
            //    message
            //};
            //return Ok(msg);

            string role = "";
            string message = "Вы Гость. Пожалуйста, выполните вход.";
            if (usr != null) 
            {
                message = "Вы вошли как: " + usr.UserName;
                if (await _userManager.IsInRoleAsync(usr, "admin"))
                    role = "admin";
                else 
                    role = "user";
            }

            var msg = new
            {
                message = message,
                role = role
            };

            return Ok(msg);
        }

        private Task<Viewer> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);
    }
}
