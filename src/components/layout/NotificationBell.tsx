import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAuthStore } from '../../store/useAuthStore';

const formatRelative = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'à l\u2019instant';
  if (diffMin < 60) return `il y a ${diffMin}min`;
  return `il y a ${Math.floor(diffMin / 60)}h`;
};

export default function NotificationBell() {
  const { notifications, unreadCount, setInitial, markAllReadLocally } = useNotificationStore();
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([notificationService.list(), notificationService.unreadCount()]).then(([list, count]) =>
      setInitial(list, count)
    );
  }, [user?.id]);

  const handleOpen = async () => {
    setIsOpen((v) => !v);
    if (!isOpen && unreadCount > 0) {
      await notificationService.markAllRead();
      markAllReadLocally();
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} aria-label="Notifications" className="relative rounded-full p-2 text-secondary hover:bg-surface-alt">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-scale-in absolute right-0 mt-2 w-80 origin-top-right rounded-md border border-subtle bg-surface shadow-lg">
          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted">Aucune notification.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`rounded-md p-3 text-sm ${!n.isRead ? 'bg-primary-50' : ''}`}>
                  <p className="font-medium text-primary">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-xs text-secondary">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-muted">{formatRelative(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
          <Link
            to={user?.role === 'client' ? '/client/discussions' : '/prestataire/discussions'}
            onClick={() => setIsOpen(false)}
            className="block border-t border-subtle p-2.5 text-center text-sm font-medium text-primary-500 hover:bg-surface-alt"
          >
            Voir mes messages
          </Link>
        </div>
      )}
    </div>
  );
}