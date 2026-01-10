using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ResourceService.Models.Entities;
using ResourceService.Models.DTOs;
using ResourceService.Data;
using ResourceService.Services;

namespace ResourceService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly AssetService _assetService;
        public AssetsController(AssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AssetResponse>>> GetAssets()
        {
            try
            {
                var response = await _assetService.GetAllAssets();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve assets from database", error = ex.Message });
            }
            
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AssetResponse>> CreateAsset(CreateAssetRequest request)
        {
            try
            {
                var response = await _assetService.CreateNewAsset(request);
                return CreatedAtAction(nameof(GetAssets), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create asset in database", error = ex.Message });
            }
        }
    }
}