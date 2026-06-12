"use client";

import { useState } from "react";
import { GitFork, Loader2, CheckCircle, AlertCircle, Info, GitBranch } from "lucide-react";
import { api } from "@/lib/api";
import type { GitHubIndexResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GitHubPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GitHubIndexResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIndex = async () => {
    if (!repoUrl.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await api.indexGitHub(repoUrl.trim(), branch.trim() || undefined);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Indexing failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = repoUrl.trim().startsWith("https://github.com/");

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[hsl(222,47%,18%)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <GitFork className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">GitHub Repository Indexing</h1>
            <p className="text-[hsl(215,20%,50%)] text-xs mt-0.5">
              Clone and index an entire GitHub repository
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-2xl space-y-6">
        {/* Info */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/15">
          <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">
            <p className="font-medium text-purple-300 mb-0.5">What gets indexed</p>
            <p>
              Source code (.py, .ts, .go, .java...), documentation (.md, .txt), configuration
              (.yaml, .json), READMEs, Dockerfiles and Makefiles. Ignores node_modules, build
              artifacts, and binary files.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl border border-[hsl(222,47%,18%)] p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[hsl(215,20%,60%)] uppercase tracking-wider block mb-2">
              Repository URL *
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[hsl(222,47%,11%)] border border-[hsl(222,47%,18%)] focus-within:border-purple-500/40 transition-colors">
              <GitFork className="w-4 h-4 text-[hsl(215,20%,45%)] flex-shrink-0" />
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repository"
                className="flex-1 bg-transparent text-sm text-white placeholder-[hsl(215,20%,40%)] outline-none"
              />
            </div>
            {repoUrl && !isValidUrl && (
              <p className="text-xs text-red-400 mt-1">Must be a valid GitHub URL (https://github.com/...)</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(215,20%,60%)] uppercase tracking-wider block mb-2">
              Branch (optional)
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[hsl(222,47%,11%)] border border-[hsl(222,47%,18%)] focus-within:border-purple-500/40 transition-colors">
              <GitBranch className="w-4 h-4 text-[hsl(215,20%,45%)] flex-shrink-0" />
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main (default)"
                className="flex-1 bg-transparent text-sm text-white placeholder-[hsl(215,20%,40%)] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleIndex}
            disabled={isLoading || !isValidUrl}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
              isLoading || !isValidUrl
                ? "bg-[hsl(222,47%,16%)] text-[hsl(215,20%,40%)] cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cloning & indexing...
              </>
            ) : (
              <>
                <GitFork className="w-4 h-4" />
                Index Repository
              </>
            )}
          </button>

          {isLoading && (
            <p className="text-[10px] text-center text-[hsl(215,20%,45%)]">
              This may take a few minutes for large repositories...
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-green-500/5 border border-green-500/20 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-400">Repository indexed successfully</p>
              <p className="text-xs text-[hsl(215,20%,55%)] mt-1">{result.message}</p>
              <div className="flex gap-4 mt-2">
                <div className="text-xs">
                  <span className="text-[hsl(215,20%,45%)]">Files: </span>
                  <span className="text-white font-medium">{result.files_indexed}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[hsl(215,20%,45%)]">Chunks: </span>
                  <span className="text-white font-medium">{result.chunks_created}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-red-500/5 border border-red-500/20 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Indexing failed</p>
              <p className="text-xs text-red-400/70 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div>
          <p className="text-xs font-semibold text-[hsl(215,20%,45%)] uppercase tracking-wider mb-2">Tips</p>
          <ul className="space-y-1.5 text-xs text-[hsl(215,20%,55%)]">
            <li className="flex items-start gap-2">
              <span className="text-[hsl(215,20%,35%)] flex-shrink-0">•</span>
              Public repos are indexed without authentication
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(215,20%,35%)] flex-shrink-0">•</span>
              For private repos, set <code className="text-[hsl(215,20%,65%)] bg-[hsl(222,47%,14%)] px-1 rounded">GITHUB_TOKEN</code> in the backend environment
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(215,20%,35%)] flex-shrink-0">•</span>
              Large repos may take 2–5 minutes depending on file count
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
