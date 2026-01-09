# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ResourceService.csproj", "./"]
RUN dotnet restore "ResourceService.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "ResourceService.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ResourceService.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080

ENTRYPOINT ["dotnet", "ResourceService.dll"]
