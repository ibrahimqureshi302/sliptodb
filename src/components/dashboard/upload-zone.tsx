"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface UploadResult {
  file_name: string;
  status: "success" | "error";
  message: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<UploadResult> {
    // Client-side validation
    if (file.type !== "application/pdf") {
      return {
        file_name: file.name,
        status: "error",
        message: "Only PDF files are supported",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        file_name: file.name,
        status: "error",
        message: "File too large (max 10MB)",
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/invoices/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          file_name: file.name,
          status: "error",
          message: data.error || "Upload failed",
        };
      }

      return {
        file_name: file.name,
        status: "success",
        message: "Queued for processing",
      };
    } catch (err) {
      return {
        file_name: file.name,
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed",
      };
    }
  }

  async function handleFiles(files: FileList | File[]) {
    setUploading(true);
    setResults([]);

    const fileArray = Array.from(files);

    if (fileArray.length === 0) {
      setUploading(false);
      return;
    }

    const uploadResults = await Promise.all(fileArray.map(uploadFile));
    setResults(uploadResults);
    setUploading(false);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearResult(index: number) {
    setResults((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Upload invoice PDF</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag and drop a PDF here, or click to browse. Files are processed
          automatically — just like forwarded emails.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? "border-violet-500 bg-violet-500/10"
            : "border-border/60 bg-background/30 hover:border-violet-500/50 hover:bg-violet-500/5"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <>
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
              <UploadCloud className="h-6 w-6 text-violet-500" />
            </div>
            <p className="text-sm font-medium">
              Drag & drop PDF, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Max 10MB per file · Multiple files supported
            </p>
          </>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                result.status === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {result.status === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <div className="flex-1">
                {result.file_name && (
                  <span className="font-medium">{result.file_name}</span>
                )}
                {result.file_name && " — "}
                {result.message}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearResult(i);
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
