using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.Models;
using DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Kinoteatr.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller //контроллер авторизации и регистрации
    {
        private readonly UserManager<Viewer> _userManager;
        private readonly SignInManager<Viewer> _signInManager;
        ILogger logger; // логгер

        public AccountController(UserManager<Viewer> userManager, SignInManager<Viewer> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;

            var loggerFactory = LoggerFactory.Create(builder => //логгирование
            {
                builder.AddConsole();
            });

            logger = loggerFactory.CreateLogger<AccountController>();
        }

        [HttpPost]
        [Route("api/Account/Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model) //регистрация
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
                    logger.LogInformation("A new user has been added " + user.UserName);
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
                    logger.LogInformation("The user has not been added");
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
                logger.LogInformation("Invalid input data");
                return Ok(errorMsg);
            }
        }

        [HttpPost]

        [Route("api/Account/Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model) //авторизация
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
                    logger.LogInformation("User logged " + model.Email);
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и(или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.", error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    logger.LogInformation("Invalid username or password");
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.", error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                logger.LogInformation("Login failed");
                return Ok(errorMsg);
            }
        }
        [HttpPost]
        [Route("api/Account/LogOff")]
        public async Task<IActionResult> LogOff() //выход из аккаунта
        {
            // Удаление куки
            await _signInManager.SignOutAsync();
            var msg = new
            {
                message = "Выполнен выход."
            };
            logger.LogInformation("Exit completed");
            return Ok(msg);
        }

        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        public async Task<IActionResult> LogisAuthenticatedOff() //проверка авторизации
        {
            Viewer usr = await GetCurrentUserAsync();

            string userId = "";
            string role = "";
            string message = "Вы Гость. Пожалуйста, выполните вход.";
            if (usr != null) 
            {
                userId = usr.Id;
                message = "Вы вошли как: " + usr.UserName;
                if (await _userManager.IsInRoleAsync(usr, "admin"))
                    role = "admin";
                else 
                    role = "user";
            }

            var msg = new
            {
                message = message,
                role = role,
                userId = userId
            };

            return Ok(msg);
        }

        private Task<Viewer> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User); //определние текущего пользователя
    }
}
