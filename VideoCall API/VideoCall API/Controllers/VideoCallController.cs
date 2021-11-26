using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Twilio.Jwt.AccessToken;
using Twilio;
using Twilio.Rest.Video.V1.Room;
using Twilio.Types;
using Twilio.Base;
using System.Net;
using System.Text;
using VideoCall_API.Models;

namespace VideoCall_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VideoCallController : ControllerBase
    {
        /*private readonly ILogger<VideoCallController> _logger;

        public VideoCallController(ILogger<VideoCallController> logger)
        {
            _logger = logger;
        }*/

        /// <summary>
        /// Generate token for user
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        [HttpGet]
        public object GenerateToken(string groupName, string userName)
        {
            try
            {
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";
                string twilioApiKey = "SK461fedaf3288aeb25af759bb7bfbe67f";
                string twilioApiSecret = "7E6hjeT1vNpJnD6PqolvbaFDrflOqc3P";
                string serviceSid = "ISa1c82e06d2074760adf8ec6c723075ed";

                TwilioClient.Init(twilioAccountSid, authToken);

                Twilio.Rest.Video.V1.RoomResource room;
                try
                {
                    room = Twilio.Rest.Video.V1.RoomResource.Fetch(pathSid: groupName);
                }
                catch (Exception ex)
                {
                    try
                    {
                        room = Twilio.Rest.Video.V1.RoomResource.Create(uniqueName: groupName);
                    }
                    catch (Exception e)
                    {
                        return null;
                    }

                }

                Twilio.Rest.Conversations.V1.Service.ConversationResource conversation;

                try
                {
                    conversation = Twilio.Rest.Conversations.V1.Service.ConversationResource.Fetch(
                        pathChatServiceSid: serviceSid,
                        pathSid: room.Sid
                    );
                }
                catch (Exception ex)
                {
                    try
                    {
                        conversation = Twilio.Rest.Conversations.V1.Service.ConversationResource.Create(
                            pathChatServiceSid: serviceSid,
                            uniqueName: room.Sid
                        );
                    }
                    catch (Exception e)
                    {
                        return null;
                    }

                }

                try
                {
                    var participant = Twilio.Rest.Conversations.V1.Service.Conversation.ParticipantResource.Create(
                        pathChatServiceSid: serviceSid,
                        pathConversationSid: conversation.Sid,
                        identity: userName
                    );
                }
                catch (Exception e)
                {

                }


                var video = new VideoGrant();
                video.Room = groupName;

                var grant = new ChatGrant
                {
                    ServiceSid = serviceSid
                };

                var grants = new HashSet<IGrant>
                {
                    video,
                    { grant }
                };

                var token = new Token(
                    twilioAccountSid,
                    twilioApiKey,
                    twilioApiSecret,
                    identity: userName,
                    grants: grants);

                return token.ToJwt();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet]
        public object RecordingVideo(string roomId, bool isRecording)
        {
            try
            {
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";
                TwilioClient.Init(twilioAccountSid, authToken);
                if (isRecording)
                {
                    var recordingRules = RecordingRulesResource.Update(
                        rules: new List<RecordingRule>(){
                            new RecordingRule(Twilio.Types.RecordingRule.TypeEnum.Exclude, true, null, null, null),
                              //new RecordingRule(Twilio.Types.RecordingRule.TypeEnum.Exclude, true, null, null, Twilio.Types.RecordingRule.KindEnum.Audio)
                        },
                        pathRoomSid: roomId
                    );

                    return recordingRules;
                }
                else
                {
                    var recordingRules = RecordingRulesResource.Update(
                        rules: new List<RecordingRule>(){
                            new RecordingRule(Twilio.Types.RecordingRule.TypeEnum.Include, true, null, null, null),
                            //new RecordingRule(Twilio.Types.RecordingRule.TypeEnum.Include, true, null, null, Twilio.Types.RecordingRule.KindEnum.Audio)
                        },
                        pathRoomSid: roomId
                    );

                    return recordingRules;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// get video recording list
        /// </summary>
        /// <param name="roomSid"></param>
        /// <returns></returns>
        [HttpGet]
        public object getVideoRecordingList(string roomSid)
        {
            try
            {
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";

                TwilioClient.Init(twilioAccountSid, authToken);
                List<VideoRecordingModel> recordings = new List<VideoRecordingModel>();
                var roomRecordings = RoomRecordingResource.Read(
                        pathRoomSid: roomSid,
                        status: RoomRecordingResource.StatusEnum.Completed
                    ).GetEnumerator();

                while (roomRecordings.MoveNext())
                {
                    recordings.Add(new VideoRecordingModel()
                    {
                        DateCreated = roomRecordings.Current.DateCreated,
                        Duration = roomRecordings.Current.Duration,
                        Type = roomRecordings.Current.Type == RoomRecordingResource.TypeEnum.Audio ? "audio" : "video",
                        RoomSid = roomRecordings.Current.RoomSid,
                        Sid = roomRecordings.Current.Sid,
                        ContainerFormat = roomRecordings.Current.ContainerFormat == RoomRecordingResource.FormatEnum.Mka ? "mka" : "mkv",
                    });
                }
                recordings = recordings.GroupBy(p => p.DateCreated).Select(p => p.FirstOrDefault()).ToList();
                return recordings;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Download video recording
        /// </summary>
        /// <param name="recordingSid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet]
        public object DownloadVideoRecording(string recordingSid, string type)
        {
            try
            {
                string twilioApiKey = "SK461fedaf3288aeb25af759bb7bfbe67f";
                string twilioApiSecret = "7E6hjeT1vNpJnD6PqolvbaFDrflOqc3P";
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";

                TwilioClient.Init(twilioAccountSid, authToken);
                string uri = $"https://video.twilio.com/v1/Recordings/{recordingSid}/Media";

                var request = (HttpWebRequest)WebRequest.Create(uri);
                request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes(twilioApiKey + ":" + twilioApiSecret)));
                request.Headers.Add("Accept", "application/json");
                request.ContentType = "application/json";
                request.Method = "GET";
                request.AllowAutoRedirect = true;

                var response = (HttpWebResponse)request.GetResponse();
                return response.ResponseUri.AbsoluteUri;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Get Video room participant list 
        /// </summary>
        /// <param name="roomId"></param>
        /// <returns></returns>
        [HttpGet]
        public object ParticipantList(string roomId)
        {
            try
            {
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";
                TwilioClient.Init(twilioAccountSid, authToken);
                ResourceSet<ParticipantResource> participants = ParticipantResource.Read(
                   roomId,
                   ParticipantResource.StatusEnum.Connected);

                return participants;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Remove participant
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        [HttpGet]
        public object RemoveParticipant(string roomId, string participantId)
        {
            try
            {
                string twilioAccountSid = "ACc1055825146dc02b82b4329d0bf76ddb";
                string authToken = "f32f106654bb5f249fb1df9863cdff18";
                TwilioClient.Init(twilioAccountSid, authToken);
                ParticipantResource participant = ParticipantResource.Update(
                        roomId,
                        participantId,
                        ParticipantResource.StatusEnum.Disconnected);

                return 1;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
