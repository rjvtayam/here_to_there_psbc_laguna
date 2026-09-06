import { useState, useCallback } from 'react';

export function useScreenShare() {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSharing = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setScreenStream(stream);
      setIsSharing(true);

      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setIsSharing(false);
      };

      return stream;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to share screen';
      setError(message);
      throw err;
    }
  }, []);

  const stopSharing = useCallback(() => {
    screenStream?.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
    setIsSharing(false);
  }, [screenStream]);

  return { screenStream, isSharing, error, startSharing, stopSharing };
}
