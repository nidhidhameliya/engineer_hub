"use client";

import { useState, useEffect } from "react";
import { BarChart3, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { StatsResponse, SourcesResponse } from "@/lib/api";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { SourcesTable } from "@/components/admin/SourcesTable";

export default function AdminPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [sources, setSources] = useState<SourcesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, src] = await Promise.all([api.getStats(), api.getSources()]);
      setStats(s);
      setSources(src);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[hsl(222,47%,18%)] flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Admin Dashboard</h1>
            <p className="text-[hsl(215,20%,50%)] text-xs mt-0.5">
              Knowledge base metrics and indexed sources
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[hsl(215,20%,50%)] hover:text-white hover:bg-white/5 border border-transparent hover:border-[hsl(222,47%,20%)] transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-sm text-[hsl(215,20%,50%)]">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Failed to load data</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
              <p className="text-xs text-[hsl(215,20%,45%)] mt-1">
                Make sure the backend is running at {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && !isLoading && (
          <div className="animate-fade-in">
            <h2 className="text-xs font-semibold text-[hsl(215,20%,45%)] uppercase tracking-wider mb-4">
              System Metrics
            </h2>
            <StatsGrid stats={stats} />
          </div>
        )}

        {/* Sources table */}
        {sources && !isLoading && (
          <div className="animate-fade-in">
            <h2 className="text-xs font-semibold text-[hsl(215,20%,45%)] uppercase tracking-wider mb-4">
              Indexed Sources
            </h2>
            <SourcesTable
              sources={sources.sources}
              totalChunks={sources.total_chunks}
            />
          </div>
        )}
      </div>
    </div>
  );
}
