"use client";

import { useChat } from "@/hooks/useChat";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Trash2 } from "lucide-react";

export default function ChatPage() {
  const { messages, isLoading, sendMessage, stopStreaming, clearMessages } = useChat();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(222,47%,18%)] flex-shrink-0">
        <div>
          <h1 className="font-semibold text-white">Chat</h1>
          <p className="text-[hsl(215,20%,50%)] text-xs mt-0.5">
            Ask questions about your engineering knowledge base
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[hsl(215,20%,50%)] hover:text-white hover:bg-white/5 border border-transparent hover:border-[hsl(222,47%,20%)] transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        isLoading={isLoading}
        onStop={stopStreaming}
      />
    </div>
  );
}
