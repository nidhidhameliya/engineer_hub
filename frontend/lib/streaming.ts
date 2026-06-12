// SSE streaming utility for chat responses
import type { Source, KnowledgeCard } from "./api";

export type StreamEvent =
  | { type: "sources"; sources: Source[] }
  | { type: "token"; content: string }
  | { type: "done"; knowledge_cards: KnowledgeCard[]; response_time_ms: number }
  | { type: "error"; message: string };

export interface StreamCallbacks {
  onSources?: (sources: Source[]) => void;
  onToken?: (token: string) => void;
  onDone?: (cards: KnowledgeCard[], timeMs: number) => void;
  onError?: (error: string) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function streamChat(
  question: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
  filterDocType?: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        stream: true,
        filter_doc_type: filterDocType,
      }),
      signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      callbacks.onError?.(err.detail || `Request failed: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError?.("No response body");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;

        try {
          const event: StreamEvent = JSON.parse(data);
          handleEvent(event, callbacks);
        } catch {
          // Skip malformed events
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") return;
    callbacks.onError?.(err instanceof Error ? err.message : "Stream failed");
  }
}

function handleEvent(event: StreamEvent, callbacks: StreamCallbacks) {
  switch (event.type) {
    case "sources":
      callbacks.onSources?.(event.sources);
      break;
    case "token":
      callbacks.onToken?.(event.content);
      break;
    case "done":
      callbacks.onDone?.(event.knowledge_cards, event.response_time_ms);
      break;
    case "error":
      callbacks.onError?.(event.message);
      break;
  }
}
