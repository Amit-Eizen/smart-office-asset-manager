using Xunit;
using Moq;
using FluentAssertions;
using MongoDB.Driver;
using ResourceService.Services;
using ResourceService.Data;
using ResourceService.Models.Entities;
using ResourceService.Models.DTOs;
using System.Collections.ObjectModel;

namespace Tests
{
    public class ResourceServiceTests
    {
        private readonly Mock<MongoDbContext> _mockDbContext;
        private readonly Mock<IMongoCollection<Asset>> _mockAssetCollection;
        private readonly AssetService _assetService;

        public ResourceServiceTests()
        {
            _mockDbContext = new Mock<MongoDbContext>();
            _mockAssetCollection = new Mock<IMongoCollection<Asset>>();
            _mockDbContext.Setup(db => db.Assets).Returns(_mockAssetCollection.Object);
            _assetService = new AssetService(_mockDbContext.Object);
        }
        
        [Fact]
        public async Task GetAllAssets_ShouldReturnListOfAssetResponses()
        {
            var mockIterator = new Mock<IAsyncCursor<Asset>>();
            var assets = new List<Asset>
            {
                new Asset { Id = "1", Name = "Laptop", Type = "Electronics", Status = "Available" },
                new Asset { Id = "2", Name = "Projector", Type = "Electronics", Status = "In Use" }
            };

            mockIterator.Setup(iterator => iterator.Current).Returns(assets);
            mockIterator.SetupSequence(iterator => iterator.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

            _mockAssetCollection.Setup(collection => collection.FindAsync(
                It.IsAny<FilterDefinition<Asset>>(), 
                It.IsAny<FindOptions<Asset, Asset>>(),
                It.IsAny<CancellationToken>()
            )).ReturnsAsync(mockIterator.Object);

            var result = await _assetService.GetAllAssets();

            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result[0].Name.Should().Be("Laptop");
            result[1].Name.Should().Be("Projector");
        }

        [Fact]
        public async Task CreateNewAsset_ShouldReturnCreatedAsset()
        {
            var request = new CreateAssetRequest
            {
                Name = "Tablet",
                Type = "Electronics",
                Status = "Taken"
            };

            var result = await _assetService.CreateNewAsset(request);

            result.Should().NotBeNull();
            result.Name.Should().Be("Tablet");
            result.Type.Should().Be("Electronics");
            result.Status.Should().Be("Taken");
            _mockAssetCollection.Verify(collection => collection.InsertOneAsync(
                It.Is<Asset>(a => a.Name == "Tablet" && a.Type == "Electronics" && a.Status == "Taken"),
                null,
                default
            ), Times.Once);
        }

    }

}
