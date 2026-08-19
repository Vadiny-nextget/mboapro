import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';
import { messageService } from '../../services/messageService';
import { useMessageStore } from '../../store/useMessageStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { Message } from '../../types/message.types';

export default function ConversationThread({ conversationId }: { conversationId: string }) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestIncoming = useMessageStore((s) => s.latestIncoming);

  useEffect(() => {
    setIsLoading(true);
    messageService.getMessages(conversationId).then(setMessages).finally(() => setIsLoading(false));
  }, [conversationId]);

  // Ajoute en direct tout message reçu via le WebSocket concernant ce fil ouvert.
  useEffect(() => {
    if (latestIncoming && latestIncoming.conversationId === conversationId) {
      setMessages((prev) => (prev.some((m) => m.id === latestIncoming.id) ? prev : [...prev, latestIncoming]));
    }
  }, [latestIncoming, conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    const sent = await messageService.sendMessage(conversationId, text);
    setMessages((prev) => [...prev, sent]);
  };

  if (isLoading) return <div className="skeleton h-full w-full" />;

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={clsx('flex', m.senderId === currentUserId ? 'justify-end' : 'justify-start')}>
            <div
              className={clsx(
                'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                m.senderId === currentUserId ? 'bg-primary-500 text-white' : 'bg-surface-alt text-primary'
              )}
            >
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-subtle p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
        />
        <button type="submit" disabled={!input.trim()} className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-500 text-white disabled:opacity-40">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}