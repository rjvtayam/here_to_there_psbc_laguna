import { useRef, useState, useCallback } from 'react';
import { usePeerStore } from '../stores/peerStore';
import { recordingsApi } from '../api/recordings.api';

export function useRecording(roomId: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const localStream = usePeerStore.getState().localStream;
      if (!localStream) {
        console.error('[Recording] No local stream available');
        return;
      }

      const tracks: MediaStreamTrack[] = [];

      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((t) => tracks.push(t.clone()));

      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((t) => tracks.push(t.clone()));

      if (tracks.length === 0) {
        console.error('[Recording] No tracks to record');
        return;
      }

      const combinedStream = new MediaStream(tracks);
      combinedStreamRef.current = combinedStream;

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const duration = Math.floor((Date.now() - (startTimeRef.current?.getTime() || Date.now())) / 1000);
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: mimeType });

        setUploading(true);
        try {
          const now = new Date().toISOString();
          const startTime = startTimeRef.current?.toISOString() || now;
          await recordingsApi.upload(
            file,
            `Meeting Recording - ${new Date(startTime).toLocaleString()}`,
            `Recorded in room ${roomId}`,
            duration,
            roomId,
            startTime,
            now,
          );
          console.log('[Recording] Uploaded successfully');
        } catch (err) {
          console.error('[Recording] Upload failed:', err);
        } finally {
          setUploading(false);
        }

        combinedStream.getTracks().forEach((t) => t.stop());
        combinedStreamRef.current = null;
      };

      mediaRecorder.start(1000);
      startTimeRef.current = new Date();
      setIsRecording(true);
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      console.log('[Recording] Started');
    } catch (err) {
      console.error('[Recording] Failed to start:', err);
    }
  }, [roomId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    console.log('[Recording] Stopped');
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    elapsedTime,
    uploading,
    startRecording,
    stopRecording,
    formatTime,
  };
}
