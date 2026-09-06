import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/ui/badge';
import { Session } from '../../types/session';
import { sessionsApi } from '../../api/sessions.api';
import { formatDate, formatTime } from '../../lib/utils';

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionsApi.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="font-orbitron text-2xl font-bold text-white mb-6">Session History</h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Started</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Ended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 text-white">{session.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={session.status === 'active' ? 'success' : 'default'}>
                      {session.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(session.started_at)} {formatTime(session.started_at)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {session.ended_at
                      ? `${formatDate(session.ended_at)} ${formatTime(session.ended_at)}`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
