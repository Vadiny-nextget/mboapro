import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReputationStars from '../ui/ReputationStars';
import { chatService } from '../../services/chatService';
import { ApiError } from '../../types/api.types';
import type { ChatMessage } from '../../types/chat.types';
import { formatFCFA } from '../../lib/text.func';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Bonjour 👋 Décrivez-moi ce dont vous avez besoin (ex: "un plombier à Douala") et je cherche pour vous.',
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const result = await chatService.sendMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: result.reply, suggestedServices: result.suggestedServices },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: (err as ApiError).message || 'Une erreur est survenue.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = async () => {
    await chatService.resetSession();
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ouvrir l'assistant MboaPro"
        className="fixed bottom-5 right-5 z-1400 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="animate-scale-in fixed bottom-24 right-5 z-1400 flex h-128 w-88 flex-col overflow-hidden rounded-2xl border border-subtle bg-surface shadow-lg sm:w-96">
          <div className="flex items-center justify-between border-b border-subtle bg-primary-500 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Assistant MboaPro</p>
              <p className="text-xs text-primary-100">Trouvez un prestataire en quelques mots</p>
            </div>
            <button onClick={handleReset} aria-label="Nouvelle conversation" className="text-white/80 hover:text-white">
              <RotateCcw size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-surface-alt text-primary'}`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.suggestedServices && msg.suggestedServices.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {msg.suggestedServices.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-md border border-subtle bg-surface p-2.5 text-primary hover:bg-surface-alt"
                        >
                          <p className="text-xs font-semibold">{s.title}</p>
                          <p className="text-[11px] text-muted">{s.first_name} {s.last_name} · {s.city}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <ReputationStars rating={s.rating} size={11} showValue={false} />
                            <span className="text-xs font-semibold text-primary-500">{formatFCFA(s.price)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="dots-loader rounded-lg bg-surface-alt px-3 py-2.5">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-subtle p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Décrivez votre besoin..."
              disabled={isSending}
              className="flex-1 rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Envoyer"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-500 text-white disabled:opacity-40 cursor-pointer disabled:cursor-default"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}