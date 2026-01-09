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

---

## 🐋 Running with Docker (Recommended)

### Prerequisites

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Verify installation: `docker --version` and `docker-compose --version`
2. **Git** - [Download here](https://git-scm.com/)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd smart-office-asset-manager

# Run the entire stack
docker-compose --env-file .env.dev up --build
```

This single command will:
- Start SQL Server container
- Start MongoDB container
- Build and start AuthService container
- Build and start ResourceService container
- Create all necessary databases automatically
- Set up networking between services

### Available Environments

The project includes three environment configurations:

- `.env.dev` - Development environment
- `.env.test` - Testing environment
- `.env.prod` - Production environment

To use a different environment:
```bash
docker-compose --env-file .env.test up --build
```

### Testing the Docker Setup

**Register a new user:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/register" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"Admin123!","role":"Admin"}'
```

**Create an asset:**
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:5001/assets" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"name":"Laptop","type":"Electronics","status":"Available"}'
```

### Stopping Docker Containers

```bash
# Stop containers (keeps data)
docker-compose down

# Stop containers and delete all data
docker-compose down -v
```

### Accessing Databases

**SQL Server:**
- Server: `localhost,1433`
- Username: `sa`
- Password: Check your `.env.dev` file (default: `Dev@Password123`)
- Database: `SmartOfficeAuth_Dev`

**MongoDB:**
- Connection string: `mongodb://localhost:27017`
- Database: `SmartOfficeDB_Dev`
- Use MongoDB Compass to view data

---

## TODO

- [x] Complete AuthService
- [x] Build ResourceService
- [x] Docker Compose setup
- [ ] Build Frontend
