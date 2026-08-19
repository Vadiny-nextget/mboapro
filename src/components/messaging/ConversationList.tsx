import Avatar from '../ui/Avatar';
import type { ConversationSummary } from '../../types/message.types';

const formatRelative = (iso: string) => {
  const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (diffH < 1) return 'à l\u2019instant';
  if (diffH < 24) return `${diffH}h`;
  return `${Math.floor(diffH / 24)}j`;
};

export default function ConversationList({ conversations, activeId, onSelect }: { conversations: ConversationSummary[]; activeId: string | null; onSelect: (id: string) => void }) {
  if (conversations.length === 0) {
    return <p className="p-6 text-center text-sm text-secondary">Aucune conversation pour l'instant.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-subtle overflow-y-auto">
      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-3 p-3 text-left hover:bg-surface-alt ${activeId === c.id ? 'bg-surface-alt' : ''}`}
        >
          <Avatar src={c.otherUserAvatarUrl ?? undefined} name={c.otherUserName} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="truncate text-sm font-medium text-primary">{c.otherUserName}</p>
              <span className="shrink-0 text-[11px] text-muted">{formatRelative(c.lastMessageAt)}</span>
            </div>
            <p className="truncate text-xs text-muted">{c.lastMessagePreview ?? c.contextServiceTitle ?? ''}</p>
          </div>
          {c.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">
              {c.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}