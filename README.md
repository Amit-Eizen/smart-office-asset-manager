# Smart Office Asset Manager

A microservices-based asset management system with JWT authentication and role-based authorization.

## Architecture

- **AuthService** - .NET 9 Web API + SQL Server (User authentication & JWT tokens)
- **ResourceService** - .NET 9 Web API + MongoDB (Asset management with role-based access)
- **Frontend** - React + TypeScript + MobX + MUI 5 (Coming soon)

## Run Guide

### Prerequisites

1. [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
2. SQL Server (Express/LocalDB)
3. MongoDB Community Edition

### Step 1: Setup AuthService

```bash
# Navigate to AuthService
cd AuthService
dotnet restore
```

This will download all required packages (Entity Framework, JWT, BCrypt, etc.)

### Step 3: Create Configuration Files

```bash
# Copy the example configuration files
copy AuthService\appsettings.example.json AuthService\appsettings.json
copy ResourceService\appsettings.example.json ResourceService\appsettings.json
```

**Then edit both files and replace the placeholder values:**

For `AuthService/appsettings.json`:
- Replace `*YourServerName*` with your SQL Server instance (e.g., `localhost`, `localhost\SQLEXPRESS`)
- Replace `*YourDatabaseName*` with `SmartOfficeAuth`
- Replace `*YourJwtSecretKeyAtLeast32Characters*` with a random string (at least 32 characters)
- Replace `*WhoCreatesTheToken*` with `AuthService`
- Replace `*WhoIsTheTokenFor*` with `SmartOfficeSystem`
- Replace `*TokenExpiryInMinutes*` with `15`

For `ResourceService/appsettings.json`:
- Replace `*YourMongoDbConnectionString*` with `mongodb://localhost:27017/`
- Replace `*YourMongoDatabaseName*` with `SmartOfficeDB`
- Use the same JWT values as AuthService (Secret, Issuer, Audience, ExpiryInMinutes)

### Step 4: Run the Application

```bash
# Navigate to ResourceService
cd ResourceService

# Run the service
dotnet run
```
ResourceService will run on `http://localhost:5001`

### Step 3: Test the System

**1. Register an Admin user:**
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"Admin123!","role":"Admin"}'
```
**2. Copy the token from the response**

**3. View all assets (works for all users):**
```bash
curl -X GET http://localhost:5001/assets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Create a new asset (Admin only):**
```bash
curl -X POST http://localhost:5001/assets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","type":"Electronics","status":"Available"}'
```

**5. Test Member role (should get 403 Forbidden):**
```bash
# Register a Member user
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"member","password":"Member123!","role":"Member"}'

# Try to create asset with Member token (should fail)
curl -X POST http://localhost:5001/assets \
  -H "Authorization: Bearer MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chair","type":"Furniture","status":"Available"}'
```

### Running Tests

```bash
# AuthService tests
cd AuthService/Tests
dotnet test

# ResourceService tests
cd ResourceService/Tests
dotnet test
```

## API Endpoints

### AuthService (`http://localhost:5000`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login and get JWT token | No |

### ResourceService (`http://localhost:5001`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/assets` | Get all assets | Yes | Any |
| POST | `/assets` | Create new asset | Yes | Admin |

## Reflections

### Technical Challenges & Solutions

**1. MongoDB Mocking in Unit Tests**
- **Challenge:** MongoDB's `IMongoCollection<T>` is difficult to mock because `FindAsync` returns an `IAsyncCursor<T>`.
- **Solution:** Created a protected parameterless constructor in `MongoDbContext` specifically for Moq, and mocked both the cursor and its `MoveNextAsync`/`Current` behavior.

**2. JWT Token Validation Between Services**
- **Challenge:** ResourceService needed to validate JWT tokens issued by AuthService without direct communication.
- **Solution:** Shared the same JWT secret, issuer, and audience in both services' `appsettings.json`. This allows ResourceService to independently verify tokens using the same signing key.

**3. Role-Based Authorization**
- **Challenge:** Implementing authorization so only Admins can create assets.
- **Solution:** Used the `[Authorize(Roles = "Admin")]` attribute on the POST endpoint. JWT tokens contain the role claim, and ASP.NET Core automatically validates it.

**4. Entity Framework In-Memory Database for Tests**
- **Challenge:** Using a real SQL Server database for tests would be slow and require cleanup.
- **Solution:** Used `Microsoft.EntityFrameworkCore.InMemory` provider to create isolated, fast tests that don't persist data.


---

## 🐋 Running with Docker (Recommended)

### Prerequisites

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Verify installation: `docker --version` and `docker-compose --version`
2. **Git** - [Download here](https://git-scm.com/)

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone <repository-url>
cd smart-office-asset-manager

# 2. Create environment configuration from template
copy .env.example .env.dev

# 3. Edit .env.dev and update the passwords (use any text editor)
# - Change SQL_SERVER_PASSWORD to a strong password
# - Change JWT_SECRET to a random string (at least 32 characters)

# 4. Run the entire stack
docker-compose --env-file .env.dev up --build
```

**IMPORTANT:** The `.env.dev` file is not in git for security reasons. You must create it from the `.env.example` template and set your own passwords.

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
