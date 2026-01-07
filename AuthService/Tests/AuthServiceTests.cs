using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AuthService.Data;
using AuthService.Models.DTOs;
using AuthService.Models.Entities;

namespace AuthService.Tests
{
    public class AuthServiceTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        private IConfiguration GetMockConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:Secret", "TestSecretKeyThatIsAtLeast32CharactersLong"},
                {"Jwt:Issuer", "AuthService"},
                {"Jwt:Audience", "SmartOfficeSystem"},
                {"Jwt:ExpiryInMinutes", "15"}
            };
            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();
        }

        [Fact]
        public async Task RegisterAsync_WithNewUser_ShouldReturnLoginRespone()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            var configuration = GetMockConfiguration();
            var authService = new AuthService.Services.AuthService(dbContext, configuration);

            var registerRequest = new RegisterRequest
            {
                UserName = "newuser",
                Password = "Password123!",
                Role = "Member"
            };

            // Act
            var response = await authService.RegisterAsync(registerRequest);

            // Assert
            response.Should().NotBeNull();
            response.Token.Should().NotBeNullOrEmpty();
            response.RefreshToken.Should().NotBeNullOrEmpty();
            response.UserName.Should().Be(registerRequest.UserName);
            response.Role.Should().Be(registerRequest.Role);
            response.UserId.Should().BeGreaterThan(0);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ShouldReturnLoginResponse()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            var configuration = GetMockConfiguration();
            var authService = new AuthService.Services.AuthService(dbContext, configuration);

            // First register a user
            var registerRequest = new RegisterRequest
            {
                UserName = "loginuser",
                Password = "Password123!",
                Role = "Admin"
            };
            await authService.RegisterAsync(registerRequest);

            var loginRequest = new LoginRequest
            {
                UserName = "loginuser",
                Password = "Password123!"
            };

            // Act
            var response = await authService.LoginAsync(loginRequest);

            // Assert
            response.Should().NotBeNull();
            response.Token.Should().NotBeNullOrEmpty();
            response.RefreshToken.Should().NotBeNullOrEmpty();
            response.UserName.Should().Be(loginRequest.UserName);
            response.Role.Should().Be(registerRequest.Role);
        }

        [Fact]
        public async Task LoginAsync_WithInvalidCredentials_ShouldReturnNull()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            var configuration = GetMockConfiguration();
            var authService = new AuthService.Services.AuthService(dbContext, configuration);

            // Register a user
            var registerRequest = new RegisterRequest
            {
                UserName = "invaliduser",
                Password = "Password123!",
                Role = "Member"
            };
            await authService.RegisterAsync(registerRequest);

            var loginRequest = new LoginRequest
            {
                UserName = "invaliduser",
                Password = "WrongPassword!"
            };

            // Act
            var response = await authService.LoginAsync(loginRequest);

            // Assert
            response.Should().BeNull();
        }

        [Fact]
        public async Task RegisterAsync_WithExistingUser_ShouldReturnNull()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var config = GetMockConfiguration();
            var authService = new Services.AuthService(context, config);

            var registerRequest = new RegisterRequest
            {
                UserName = "existinguser",
                Password = "password123",
                Role = "Member"
            };

            // Register user first time
            await authService.RegisterAsync(registerRequest);

            // Act - try to register same user again
            var result = await authService.RegisterAsync(registerRequest);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnValidJwtToken()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var config = GetMockConfiguration();
            var authService = new Services.AuthService(context, config);

            var registerRequest = new RegisterRequest
            {
                UserName = "jwtuser",
                Password = "password123",
                Role = "Admin"
            };

            // Act
            var result = await authService.RegisterAsync(registerRequest);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();

            //Parse and validate JWT token
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(result.Token);

            //Check claims
            jwtToken.Claims.Should().Contain(c => c.Type == "sub" && c.Value == result.UserId.ToString());
            jwtToken.Claims.Should().Contain(c => c.Type == "name" && c.Value == registerRequest.UserName);
            jwtToken.Claims.Should().Contain(c => c.Type == System.Security.Claims.ClaimTypes.Role && c.Value == registerRequest.Role);

            //Check expiration
            var expectedExpiry = DateTime.UtcNow.AddMinutes(15);
            jwtToken.ValidTo.Should().BeCloseTo(expectedExpiry, TimeSpan.FromMinutes(1));

            //Check RefreshToken is Guid
            Guid.TryParse(result.RefreshToken, out var refreshTokenGuid).Should().BeTrue();
            refreshTokenGuid.Should().NotBe(Guid.Empty);
        }
    }
}