// Typed API client for the Engineering Intelligence Hub backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UploadResponse {
  filename: string;
  chunks_created: number;
  doc_type: string;
  message: string;
}

export interface GitHubIndexResponse {
  repo_url: string;
  files_indexed: number;
  chunks_created: number;
  message: string;
}

export interface Source {
  filename: string;
  doc_type: string;
  confidence: number;
  content_preview: string;
}

export interface KnowledgeCard {
  title: string;
  content: string;
  type: "service" | "flow" | "concept" | "alert";
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  knowledge_cards: KnowledgeCard[];
  response_time_ms: number;
}

export interface SourceItem {
  source: string;
  filename: string;
  doc_type: string;
  indexed_at: string;
}

export interface SourcesResponse {
  sources: SourceItem[];
  total_chunks: number;
}

export interface StatsResponse {
  documents_indexed: number;
  repositories_indexed: number;
  chunks_stored: number;
  total_queries: number;
  avg_response_time_ms: number;
}

class ApiClient {
  private base: string;

  constructor(base: string) {
    this.base = base;
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${this.base}/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Upload failed: ${res.status}`);
    }

    return res.json();
  }

  async indexGitHub(repoUrl: string, branch?: string): Promise<GitHubIndexResponse> {
    const res = await fetch(`${this.base}/github-index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl, branch }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `GitHub indexing failed: ${res.status}`);
    }

    return res.json();
  }

  async chatNonStreaming(question: string, filterDocType?: string): Promise<ChatResponse> {
    const res = await fetch(`${this.base}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, stream: false, filter_doc_type: filterDocType }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Chat failed: ${res.status}`);
    }

    return res.json();
  }

  chatStream(question: string, filterDocType?: string): EventSource | null {
    // Returns raw fetch for SSE — use streaming.ts parser
    return null; // handled by streaming utility
  }

  async getSources(): Promise<SourcesResponse> {
    const res = await fetch(`${this.base}/sources`);
    if (!res.ok) throw new Error("Failed to fetch sources");
    return res.json();
  }

  async getStats(): Promise<StatsResponse> {
    const res = await fetch(`${this.base}/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.base}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  getStreamUrl(question: string): string {
    return `${this.base}/chat`;
  }

  getBase(): string {
    return this.base;
  }
}

export const api = new ApiClient(API_BASE);
