import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { api } from '../../api/axios';
import { formatDate, formatTime } from '../../lib/utils';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string;
  timestamp: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await api.get('/dashboard/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const actionLabels: Record<string, string> = {
    login: 'User Login',
    logout: 'User Logout',
    session_start: 'Session Started',
    session_end: 'Session Ended',
    emergency_trigger: 'Emergency Triggered',
    user_create: 'User Created',
    user_delete: 'User Deactivated',
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="font-orbitron text-2xl font-bold text-white mb-6">Audit Logs</h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(log.timestamp)} {formatTime(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {actionLabels[log.action] || log.action}
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                    {log.user_id?.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.ip_address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
