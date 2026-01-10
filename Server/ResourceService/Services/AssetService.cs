using MongoDB.Driver;
using ResourceService.Models.Entities;
using ResourceService.Models.DTOs;
using ResourceService.Data;

namespace ResourceService.Services
{
    public class AssetService
    {
        private readonly MongoDbContext _context;

        public AssetService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<List<AssetResponse>> GetAllAssets()
        {
            var existedAssets = await _context.Assets.Find(asset => true).ToListAsync();

            var response = existedAssets.Select(asset => new AssetResponse
            {
                Id = asset.Id,
                Name = asset.Name,
                Type = asset.Type,
                Status = asset.Status
            }).ToList();

            return response;
        }

        public async Task<AssetResponse> CreateNewAsset(CreateAssetRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    throw new ArgumentException("Asset name cannot be empty.");
                }

                if (string.IsNullOrWhiteSpace(request.Type))
                {
                    throw new ArgumentException("Asset type cannot be empty.");
                }

                if (string.IsNullOrWhiteSpace(request.Status))
                {
                    throw new ArgumentException("Asset status cannot be empty.");
                }
            
                var newAsset = new Asset
                {
                    Name = request.Name,
                    Type = request.Type,
                    Status = request.Status
                };

                await _context.Assets.InsertOneAsync(newAsset);

                var response = new AssetResponse
                {
                    Id = newAsset.Id,
                    Name = newAsset.Name,
                    Type = newAsset.Type,
                    Status = newAsset.Status
                };

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateNewAsset: {ex.Message}");
                throw; 
            }
        }
    }
}