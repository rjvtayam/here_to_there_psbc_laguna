import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';

export function CampusSettings() {
  const [cameraDevice, setCameraDevice] = useState('');
  const [micDevice, setMicDevice] = useState('');
  const [speakerDevice, setSpeakerDevice] = useState('');

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Campus Settings</h1>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Video Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Camera
                </label>
                <select
                  value={cameraDevice}
                  onChange={(e) => setCameraDevice(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Default Camera</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Audio Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Microphone
                </label>
                <select
                  value={micDevice}
                  onChange={(e) => setMicDevice(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Default Microphone</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Speaker
                </label>
                <select
                  value={speakerDevice}
                  onChange={(e) => setSpeakerDevice(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Default Speaker</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
