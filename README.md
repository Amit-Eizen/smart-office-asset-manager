# Smart Office Asset Manager

Microservices-based asset management system built with .NET 9, React, and Docker.

## Architecture

- **AuthService** - .NET 9 Web API + SQL Server (Authentication & JWT)
- **ResourceService** - .NET 9 Web API + MongoDB (Asset Management)
- **Frontend** - React + TypeScript + MobX + MUI 5

## AuthService Setup

### Prerequisites
- .NET 9 SDK
- SQL Server (Express/Developer/LocalDB)

### Configuration

Create `AuthService/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SmartOfficeAuth;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Secret": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS",
    "Issuer": "AuthService",
    "Audience": "AuthService",
    "ExpiryInMinutes": "15"
  }
}
```

### Run

```bash
cd AuthService
dotnet ef database update
dotnet run
```

### Endpoints

- `POST /register` - Register new user
- `POST /login` - Login and get JWT token

## TODO

- [ ] Complete AuthService
- [ ] Build ResourceService
- [ ] Build Frontend
- [ ] Docker Compose setup
