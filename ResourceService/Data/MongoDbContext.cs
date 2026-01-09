using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ResourceService.Models.Settings;
using ResourceService.Models.Entities;

namespace ResourceService.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> mongoSettings)
        {
            var settings = mongoSettings.Value;
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
        }

        // Empty constructor for mocking - tests
        protected MongoDbContext()
        {
        }

        public virtual IMongoCollection<Asset> Assets => _database.GetCollection<Asset>("Assets");
    }
}