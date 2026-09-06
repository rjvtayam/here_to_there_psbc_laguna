import { Announcement } from '../../types/announcement';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete?: (id: string) => void;
}

export function AnnouncementCard({ announcement, onDelete }: AnnouncementCardProps) {
  const typeColors = {
    bulletin: 'bg-blue-500/20 border-blue-500',
    emergency: 'bg-red-500/20 border-red-500',
    info: 'bg-green-500/20 border-green-500',
  };

  const typeLabels = {
    bulletin: 'Bulletin',
    emergency: 'Emergency',
    info: 'Info',
  };

  return (
    <div className={`rounded-lg border p-4 ${typeColors[announcement.type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-400 uppercase">
              {typeLabels[announcement.type]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(announcement.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-white">{announcement.title}</h3>
          {announcement.content && (
            <p className="text-gray-300 text-sm mt-1">{announcement.content}</p>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(announcement.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
