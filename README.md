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

# Create database
dotnet ef database update

# Run the service
dotnet run
```

AuthService will run on `http://localhost:5000`

### Step 2: Setup ResourceService

Make sure MongoDB is running on `mongodb://localhost:27017`

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


## Tooling Disclosure

### AI Tools Used
- **Claude AI (Anthropic)** - Code generation, debugging assistance, and documentation

### External Resources
- **Stack Overflow** - Researching MongoDB mocking patterns and EF Core in-memory testing
- **Microsoft Docs** - .NET 9, Entity Framework Core, and ASP.NET Core authentication documentation
- **MongoDB Documentation** - MongoDB.Driver C# usage and best practices
- **JWT.io** - Token debugging and validation

### NuGet Packages
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication
- `Microsoft.EntityFrameworkCore.SqlServer` - SQL Server provider
- `MongoDB.Driver` - MongoDB C# driver
- `xUnit` - Testing framework
- `Moq` - Mocking framework
- `FluentAssertions` - Test assertions
- `BCrypt.Net-Next` - Password hashing