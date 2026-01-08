# Smart Office Asset Manager

Microservices-based asset management system built with .NET 9, React, and Docker.

## Architecture

- **AuthService** - .NET 9 Web API + SQL Server (Authentication & JWT)
- **ResourceService** - .NET 9 Web API + MongoDB (Asset Management)
- **Frontend** - React + TypeScript + MobX + MUI 5

---

## 🚀 Quick Start Guide (Step by Step)

### Prerequisites

Before you start, make sure you have installed:

1. **.NET 9 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
   - Verify installation: `dotnet --version` (should show 9.x.x)

2. **SQL Server** - One of these options:
   - SQL Server Express (recommended) - [Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - SQL Server Developer Edition
   - SQL Server LocalDB

3. **Git** - [Download here](https://git-scm.com/)

---

## 📦 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd smart-office-asset-manager
```

### Step 2: Restore NuGet Packages

```bash
cd AuthService
dotnet restore
```

This will download all required packages (Entity Framework, JWT, BCrypt, etc.)

### Step 3: Create Configuration File

Create a new file `AuthService/appsettings.json` with this content:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=SmartOfficeAuth;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Secret": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS",
    "Issuer": "AuthService",
    "Audience": "SmartOfficeSystem",
    "ExpiryInMinutes": "15"
  }
}
```

**Important:** Replace `YOUR_SERVER_NAME` with your SQL Server instance name:
- Examples: `localhost`, `localhost\SQLEXPRESS`, `YOUR-PC-NAME\SQLEXPRESS`
- To find your server name, open SQL Server Management Studio and check the connection dialog

### Step 4: Run the Application

```bash
dotnet run
```

**What happens automatically:**
- The database `SmartOfficeAuth` will be created
- Tables `Users` and `RefreshTokens` will be created
- The API will start on `http://localhost:5000` or `https://localhost:5001`

### Step 5: Test the API

You can test the endpoints using:
- Postman
- curl
- The built-in Swagger UI at `https://localhost:5001/swagger`

---

## 🔧 AuthService API Endpoints

### 1. Register a New User

**POST** `/register`

```json
{
  "username": "admin",
  "password": "Admin123!",
  "role": "Admin"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2024-01-01T12:15:00Z"
}
```

### 2. Login

**POST** `/login`

```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

Response: Same as register

---

## 🛠️ Troubleshooting

### Problem: "Could not connect to SQL Server"
- Make sure SQL Server is running
- Check your connection string in `appsettings.json`
- Verify server name: Open SQL Server Management Studio to see the correct server name

### Problem: "appsettings.json not found"
- This file is not in git (for security reasons)
- You must create it manually following Step 3 above

### Problem: Database already exists error
- The app will automatically create the database
- If you need to reset: Open SSMS and delete the `SmartOfficeAuth` database

---

## 📝 Development Notes

### Running Tests

```bash
cd AuthService/Tests
dotnet test
```

All 5 unit tests should pass.

### Project Structure

```
AuthService/
├── Controllers/
│   └── AuthController.cs       # API endpoints
├── Data/
│   └── AppDbContext.cs         # EF Core database context
├── Models/
│   ├── Entities/
│   │   ├── User.cs             # User entity
│   │   └── RefreshToken.cs     # Refresh token entity
│   └── DTOs/
│       ├── RegisterRequest.cs
│       ├── LoginRequest.cs
│       └── LoginResponse.cs
├── Services/
│   └── AuthService.cs          # Authentication logic
├── Migrations/                  # EF Core migrations
├── Tests/                       # Unit tests
├── Program.cs                   # Application entry point
└── appsettings.json            # Configuration (not in git)
```

---

## 🔐 Security Notes

- JWT tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Passwords are hashed using BCrypt
- `appsettings.json` is excluded from git to protect secrets

---

## TODO

- [x] Complete AuthService
- [ ] Build ResourceService
- [ ] Build Frontend
- [ ] Docker Compose setup
