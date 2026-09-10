import { useMemo } from 'react';

/**
 * Memoize filtered/sorted user lists to prevent re-computation on every render.
 */
export function useFilteredUsers(
  users: Array<{ campus?: string; role?: string; full_name?: string; email?: string }>,
  filters: { campus?: string; role?: string; search?: string }
) {
  return useMemo(() => {
    let result = users;

    if (filters.campus) {
      result = result.filter((u) => u.campus === filters.campus);
    }

    if (filters.role) {
      result = result.filter((u) => u.role === filters.role);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.full_name?.toLowerCase().includes(q)) ||
          (u.email?.toLowerCase().includes(q))
      );
    }

    return result;
  }, [users, filters.campus, filters.role, filters.search]);
}

/**
 * Memoize user statistics computation.
 */
export function useUserStats(users: Array<{ campus?: string; role?: string; is_active?: boolean }>) {
  return useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.is_active).length;
    const byCampus = users.reduce((acc, u) => {
      const c = u.campus || 'unknown';
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const byRole = users.reduce((acc, u) => {
      const r = u.role || 'unknown';
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, byCampus, byRole };
  }, [users]);
}

/**
 * Memoize announcements filtered by campus and sorted by date.
 */
export function useFilteredAnnouncements(
  announcements: Array<{ campus?: string; created_at?: string; title?: string }>,
  campus?: string
) {
  return useMemo(() => {
    let result = announcements;

    if (campus) {
      result = result.filter((a) => !a.campus || a.campus === campus);
    }

    return [...result].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [announcements, campus]);
}

/**
 * Memoize notification stats.
 */
export function useNotificationStats(notifications: Array<{ is_read?: boolean; type?: string }>) {
  return useMemo(() => {
    const unread = notifications.filter((n) => !n.is_read).length;
    const byType = notifications.reduce((acc, n) => {
      const t = n.type || 'unknown';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { unread, byType, total: notifications.length };
  }, [notifications]);
}

/**
 * Memoize session statistics.
 */
export function useSessionStats(sessions: Array<{ status?: string; campus?: string }>) {
  return useMemo(() => {
    const active = sessions.filter((s) => s.status === 'active').length;
    const ended = sessions.filter((s) => s.status === 'ended').length;
    const byCampus = sessions.reduce((acc, s) => {
      const c = s.campus || 'unknown';
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { active, ended, total: sessions.length, byCampus };
  }, [sessions]);
}
