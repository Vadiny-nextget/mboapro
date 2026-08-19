import { useEffect, useState } from "react";
import ConversationList from "../../components/messaging/ConversationList";
import ConversationThread from "../../components/messaging/ConversationThread";
import { messageService } from "../../services/messageService";
import type { ConversationSummary } from "../../types/message.types";

export default function ClientDiscussionsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    messageService.getConversations().then((list) => {
      setConversations(list);
      if (list.length > 0) setActiveId(list[0].id);
    });
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-subtle bg-surface">
      <div className="grid h-full grid-cols-1 sm:grid-cols-[300px_1fr]">
        <div className="hidden border-r border-subtle sm:block">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
        <div>
          {activeId ? (
            <ConversationThread conversationId={activeId} />
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-secondary">
              Sélectionnez une conversation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
