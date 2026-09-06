import { useState, useEffect, useCallback } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startStream = useCallback(async (constraints?: MediaStreamConstraints) => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints || { video: true, audio: true }
      );
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access media devices';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return { stream, error, isLoading, startStream, stopStream };
}
