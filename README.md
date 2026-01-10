# Smart Office Asset Manager

A microservices-based asset management system with JWT authentication and role-based authorization.

## Architecture

- **AuthService** - .NET 9 Web API + SQL Server (User authentication & JWT tokens)
- **ResourceService** - .NET 9 Web API + MongoDB (Asset management with role-based access)
- **Frontend** - React + TypeScript + MobX + MUI 5 (Dashboard with role-based UI)

## Run Guide

### Prerequisites

1. [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
2. SQL Server (Express/LocalDB)
3. MongoDB Community Edition

### Step 1: Setup Services

```bash
# Navigate to AuthService
cd Server/AuthService
dotnet restore

# Navigate to ResourceService
cd ../ResourceService
dotnet restore
```

This will download all required packages (Entity Framework, JWT, BCrypt, etc.)

### Step 2: Create Configuration Files

```bash
# Copy the example configuration files (from project root)
copy Server\AuthService\appsettings.example.json server\AuthService\appsettings.json
copy Server\ResourceService\appsettings.example.json server\ResourceService\appsettings.json
```

**Then edit both files and replace the placeholder values:**

For `Server/AuthService/appsettings.json`:
- Replace `*YourServerName*` with your SQL Server instance (e.g., `localhost`, `localhost\SQLEXPRESS`)
- Replace `*YourDatabaseName*` with `SmartOfficeAuth`
- Replace `*YourJwtSecretKeyAtLeast32Characters*` with a random string (at least 32 characters)
- Replace `*WhoCreatesTheToken*` with `AuthService`
- Replace `*WhoIsTheTokenFor*` with `SmartOfficeSystem`
- Replace `*TokenExpiryInMinutes*` with `15`

For `Server/ResourceService/appsettings.json`:
- Replace `*YourMongoDbConnectionString*` with `mongodb://localhost:27017/`
- Replace `*YourMongoDatabaseName*` with `SmartOfficeDB`
- Use the same JWT values as AuthService (Secret, Issuer, Audience, ExpiryInMinutes)

### Step 3: Run the Application

```bash
# Run AuthService
cd Server/AuthService
dotnet run

# In another terminal, run ResourceService
cd Server/ResourceService
dotnet run
```
- AuthService will run on `http://localhost:5000`
- ResourceService will run on `http://localhost:5001`

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

**5. CORS Configuration for Docker**
- **Challenge:** Frontend running on `localhost:5173` couldn't access backend services in Docker due to CORS policy blocking cross-origin requests.
- **Solution:** Added CORS configuration to both services in `Program.cs` and `docker-compose.yml`, allowing requests from the frontend origin. The CORS middleware must be placed **after** `UseRouting()` and **before** `UseAuthentication()` for proper request flow.

**6. JWT Claims Mapping in Frontend**
- **Challenge:** .NET uses long URI-based claim names (e.g., `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`) instead of simple names like `role`.
- **Solution:** Updated the frontend `decodeToken()` method to check for both simple claim names and Microsoft's URI-based claim names using the `||` operator as a fallback mechanism.

**7. F5 Logout Issue (Page Refresh)**
- **Challenge:** Users would get logged out when refreshing the page (F5) because the authentication state wasn't persisted.
- **Solution:** Implemented an `isInitialized` flag in AuthStore that prevents redirects until localStorage is checked. The `checkAuth()` method runs in the constructor to load the token before any routing decisions are made.


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
- Build and start Frontend container (React app served with nginx)
- Create all necessary databases automatically
- Set up networking between services

Once all containers are running, open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **AuthService API**: http://localhost:5000
- **ResourceService API**: http://localhost:5001

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

## Tooling Disclosure

This project was developed with assistance from the following AI tools and resources:

### AI Tools Used:
- **Claude (Anthropic)** - Used extensively for:
  - Code generation and debugging
  - Best practices guidance for .NET, React, and Docker
  - Documentation and README creation

### External Resources:
- **Microsoft Documentation** - .NET 9, Entity Framework Core, ASP.NET Core Authentication
- **MongoDB Documentation** - MongoDB.Driver for .NET
- **React Documentation** - React Hooks, TypeScript integration
- **MobX Documentation** - State management patterns
- **MUI (Material-UI) Documentation** - Component usage and styling

### Code Ownership:
While AI tools were used to assist in development, all code has been:
- Reviewed and understood by the developer
- Tested thoroughly with unit tests
- Integrated manually into the project architecture
- Modified to fit specific project requirements

The developer is fully capable of explaining:
- JWT validation flow between microservices
- Role-based authorization implementation
- Docker networking and container orchestration
- React state management with MobX
- Database isolation patterns (SQL Server vs MongoDB)

