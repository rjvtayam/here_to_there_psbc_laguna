import { useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Circle, Square, Download, Trash2, Film, Clock, HardDrive, Play } from 'lucide-react';

interface RecordingEntry {
  id: string;
  blob: Blob;
  url: string;
  duration: string;
  size: string;
  timestamp: Date;
}

export function RecordingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        setRecordings((prev) => [
          {
            id: Date.now().toString(),
            blob,
            url,
            duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
            timestamp: new Date(),
          },
          ...prev,
        ]);

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const downloadRecording = (rec: RecordingEntry) => {
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = `recording-${rec.id}.webm`;
    a.click();
  };

  const deleteRecording = (id: string) => {
    const rec = recordings.find((r) => r.id === id);
    if (rec) URL.revokeObjectURL(rec.url);
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
            <Film size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">Session Recording</h1>
            <p className="text-gray-500 text-sm">Record and manage video sessions</p>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden">
          <div className="p-4 border-b border-gray-800/60 flex items-center gap-2">
            <Circle size={16} className={isRecording ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recording Control</span>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Timer */}
                <div className="flex items-center gap-3">
                  {isRecording ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-orbitron text-3xl font-bold text-red-400 tracking-wider">{formatTime(elapsedTime)}</span>
                    </>
                  ) : (
                    <>
                      <Clock size={20} className="text-gray-600" />
                      <span className="font-orbitron text-3xl font-bold text-gray-600 tracking-wider">00:00</span>
                    </>
                  )}
                </div>
                {/* Status */}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isRecording ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700/50'}`}>
                  {isRecording ? 'RECORDING' : 'STANDBY'}
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-3">
                {!isRecording ? (
                  <Button onClick={startRecording} className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/20">
                    <Circle size={16} className="mr-2 fill-current" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600">
                    <Square size={16} className="mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden">
          <div className="p-4 border-b border-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recordings</span>
            </div>
            <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-md">{recordings.length} file(s)</span>
          </div>

          {recordings.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center mb-3">
                <Film size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium">No recordings yet</p>
              <p className="text-gray-600 text-xs mt-1">Start a recording to see it here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {recordings.map((rec) => (
                <div key={rec.id} className="p-4 flex items-center gap-4 hover:bg-gray-800/30 transition-colors group">
                  {/* Thumbnail */}
                  <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    <video src={rec.url} className="w-full h-full object-cover" controls={false} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-white" fill="white" />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{rec.timestamp.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                        <Clock size={10} /> {rec.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md">
                        <HardDrive size={10} /> {rec.size}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => downloadRecording(rec)} className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all" title="Download">
                      <Download size={16} />
                    </button>
                    <button onClick={() => deleteRecording(rec.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
