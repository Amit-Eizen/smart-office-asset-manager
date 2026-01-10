using Microsoft.AspNetCore.Mvc;
using AuthService.Services;
using AuthService.Models.DTOs;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("")]
    public class AuthController : ControllerBase
    {
        private readonly Services.AuthService _authService;

        public AuthController(Services.AuthService authService)
        {
            _authService = authService;
        }
    

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                if (response == null)
                {
                    return BadRequest("User already exists.");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "An error occurred while registering. Please try again.", error = ex.Message});
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                {
                    return BadRequest("Invalid credentials.");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "An error occurred while logging in. Please try again.", error = ex.Message});
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            try
            {
                var response = await _authService.RefreshTokenAsync(refreshToken);
                if (response == null)
                {
                    return BadRequest("Invalid or expired refresh token.");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "An error occurred while refreshing token.", error = ex.Message});
            }
        }

    }
}