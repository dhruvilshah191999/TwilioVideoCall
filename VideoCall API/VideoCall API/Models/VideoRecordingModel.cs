using System;

namespace VideoCall_API.Models
{
    public class VideoRecordingModel
    {
        public DateTime? DateCreated { get; set; }
        public int? Duration { get; set; }
        public string Type { get; set; }
        public string RoomSid { get; set; }
        public string Sid { get; set; }
        public string ContainerFormat { get; set; }
    }
}
