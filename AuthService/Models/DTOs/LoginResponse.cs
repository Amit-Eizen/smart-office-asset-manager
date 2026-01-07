
namespace AuthService.Models.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}