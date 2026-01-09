

namespace ResourceService.Models.DTOs
{
    public class CreateAssetRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = "Available";
    }
}