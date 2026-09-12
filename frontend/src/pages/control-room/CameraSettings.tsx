import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Camera, CameraOff, RefreshCw, Video, Aperture, CheckCircle2, Zap } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePeerStore } from '../../stores/peerStore';

export function CameraSettings() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [switching, setSwitching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const storeSelectedCameraId = useSettingsStore((s) => s.selectedCameraId);
  const setSelectedCameraId = useSettingsStore((s) => s.setSelectedCameraId);
  const localStream = usePeerStore((s) => s.localStream);
  const switchCamera = usePeerStore((s) => s.switchCamera);

  useEffect(() => {
    loadDevices();
    return () => {
      previewStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    if (storeSelectedCameraId) {
      setSelectedDevice(storeSelectedCameraId);
    }
  }, [storeSelectedCameraId]);

  const loadDevices = async () => {
    setIsRefreshing(true);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((s) => s.getTracks().forEach((t) => t.stop()));
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDevice) {
        const initial = storeSelectedCameraId || videoDevices[0].deviceId;
        setSelectedDevice(initial);
      }
    } catch (err) {
      console.error('Failed to enumerate devices:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const startPreview = async () => {
    setIsTesting(true);
    try {
      previewStream?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDevice ? { deviceId: { exact: selectedDevice } } : true,
        audio: false,
      });
      setPreviewStream(stream);
    } catch (err) {
      console.error('Preview failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const stopPreview = () => {
    previewStream?.getTracks().forEach((t) => t.stop());
    setPreviewStream(null);
  };

  const applyCameraLive = async () => {
    if (!selectedDevice || !localStream) return;
    setSwitching(true);
    try {
      await switchCamera(selectedDevice);
      setSelectedCameraId(selectedDevice);
    } finally {
      setSwitching(false);
    }
  };

  const currentCameraLabel = localStream?.getVideoTracks()[0]?.label || 'None';
  const isInRoom = !!localStream;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <Camera size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">Camera Settings</h1>
            <p className="text-gray-500 text-sm">Configure video input devices and preview</p>
          </div>
        </div>

        {isInRoom && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs">
            <Zap size={14} />
            <span>Live in room — changes apply immediately to your video stream</span>
          </div>
        )}

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden">
          <div className="p-4 border-b border-gray-800/60 flex items-center gap-2">
            <Video size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Preview</span>
            {previewStream && (
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-green-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ACTIVE
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="relative bg-gray-950 rounded-xl overflow-hidden aspect-video border border-gray-800/40">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!previewStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center mb-3">
                    <Aperture size={28} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No preview active</p>
                  <p className="text-gray-600 text-xs mt-1">Click "Test Camera" to start</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Camera size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Camera Device</span>
          </div>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 focus:outline-none transition-all"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${devices.indexOf(d) + 1}`}
              </option>
            ))}
            {devices.length === 0 && <option value="">No cameras detected</option>}
          </select>
          <p className="text-xs text-gray-600 mt-2">{devices.length} device(s) found</p>
          {isInRoom && selectedDevice && selectedDevice !== storeSelectedCameraId && (
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={applyCameraLive} disabled={switching} size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                {switching ? <RefreshCw size={12} className="mr-1.5 animate-spin" /> : <Zap size={12} className="mr-1.5" />}
                {switching ? 'Switching...' : 'Switch Live Camera'}
              </Button>
            </div>
          )}
          {storeSelectedCameraId && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-green-400">
              <CheckCircle2 size={12} />
              Active: {currentCameraLabel}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={startPreview} disabled={isTesting} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
            <Camera size={16} className="mr-2" />
            {isTesting ? 'Starting...' : 'Test Camera'}
          </Button>
          <Button variant="secondary" onClick={stopPreview} disabled={!previewStream}>
            <CameraOff size={16} className="mr-2" />
            Stop Preview
          </Button>
          <Button variant="ghost" onClick={loadDevices}>
            <RefreshCw size={16} className={`mr-2 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
