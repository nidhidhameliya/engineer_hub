"use client";

import { FileDropzone } from "@/components/upload/FileDropzone";
import { Upload, Info } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[hsl(222,47%,18%)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Upload className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Upload Documents</h1>
            <p className="text-[hsl(215,20%,50%)] text-xs mt-0.5">
              Index files into your knowledge base
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-3xl">
        {/* Info box */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/15 mb-6">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">
            <p className="font-medium text-blue-300 mb-0.5">How it works</p>
            <p>
              Files are extracted, chunked, and embedded using OpenAI text-embedding-3-small.
              Vectors are stored in ChromaDB. Architecture diagrams are analyzed by GPT-4o Vision.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <FileDropzone />

        {/* Supported formats */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-[hsl(215,20%,45%)] uppercase tracking-wider mb-3">
            Supported Formats
          </p>
          <div className="grid grid-cols-2 gap-3">
            {FORMAT_INFO.map((f) => (
              <div
                key={f.ext}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl glass border border-[hsl(222,47%,18%)]"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[hsl(222,47%,14%)] text-[hsl(215,20%,60%)] flex-shrink-0 mt-0.5">
                  {f.ext}
                </span>
                <div>
                  <p className="text-xs font-medium text-white">{f.name}</p>
                  <p className="text-[10px] text-[hsl(215,20%,45%)]">{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FORMAT_INFO = [
  { ext: "PDF", name: "PDF Documents", note: "Extracted page-by-page with PyMuPDF" },
  { ext: "DOCX", name: "Word Documents", note: "Paragraphs and tables extracted" },
  { ext: "MD", name: "Markdown", note: "Header-aware chunking" },
  { ext: "TXT", name: "Plain Text", note: "Raw text chunking" },
  { ext: "JSON", name: "JSON Files", note: "Pretty-printed and chunked" },
  { ext: "CSV", name: "CSV Files", note: "Row-by-row text extraction" },
  { ext: "PNG/JPG", name: "Architecture Diagrams", note: "GPT-4o Vision analysis" },
];
