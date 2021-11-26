/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import baseService from './base-service';

const endPointBaseURL = `VideoCall`;

const generateToken = async (groupName: string, userName: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/GenerateToken?groupName=${groupName}&&userName=${userName}`);

const recordingVideo = async (roomId: string, isRecording: boolean): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/RecordingVideo?roomId=${roomId}&&isRecording=${isRecording}`);

const getVideoRecordingList = async (roomSid: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/GetVideoRecordingList?roomSid=${roomSid}`);

const downloadVideoRecording = async (recordingSid: string, type: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/DownloadVideoRecording?recordingSid=${recordingSid}&&type=${type}`);

const generateConversations = async (groupName: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/GenerateConversations?groupName=${groupName}`);

const participantList = async (roomId: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/ParticipantList?roomId=${roomId}`);

const removeParticipant = async (roomId: string, participantId: string): Promise<AxiosResponse<any>> =>
  baseService.get<any>(`${endPointBaseURL}/RemoveParticipant?roomId=${roomId}&participantId=${participantId}`);

export default {
  generateToken,
  recordingVideo,
  generateConversations,
  participantList,
  removeParticipant,
  getVideoRecordingList,
  downloadVideoRecording,
};
