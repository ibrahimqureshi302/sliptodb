"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleSheetsCardProps {
  connected: boolean;
  sheetId: string | null;
}

export function GoogleSheetsCard({ connected, sheetId }: GoogleSheetsCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSheetId, setCurrentSheetId] = useState(sheetId);
  const [connecting, setConnecting] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlError = searchParams.get("google_error");
  const justConnected = searchParams.get("google_connected") === "true";

  // Trust the database `connected` state as the source of truth.
  // The URL param is only used to trigger auto-creation right after OAuth.
  const isConnected = connected;

  useEffect(() => {
    // Clean the URL params after consuming them so refresh doesn't re-trigger
    if (urlError || justConnected) {
      const url = new URL(window.location.href);
      url.searchParams.delete("google_error");
      url.searchParams.delete("google_connected");
      window.history.replaceState({}, "", url.toString());
    }

    // Auto-create Sheet on fresh connection (only if DB says connected + no sheet yet)
    if (justConnected && connected && !currentSheetId) {
      createSheet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justConnected, connected]);

  async function createSheet() {
    setCreatingSheet(true);
    setError(null);

    try {
      const response = await fetch("/api/sheets/create", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create sheet");
        return;
      }

      setCurrentSheetId(data.sheetId);
      // Refresh dashboard so card reflects new state
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create sheet"
      );
    } finally {
      setCreatingSheet(false);
    }
  }

  function handleConnect() {
    setConnecting(true);
    window.location.href = "/api/auth/google/connect";
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Google Sheets</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentSheetId
                ? "Your invoices are synced to a Google Sheet automatically."
                : isConnected
                ? "Connected. Preparing your Sheet..."
                : "Automatically sync every invoice to a Google Sheet you own."}
            </p>

            {currentSheetId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sheet created and ready</span>
              </div>
            )}

            {urlError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>
                  {urlError === "access_denied"
                    ? "You declined access."
                    : `Connection failed: ${urlError}`}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {!isConnected && (
            <Button
              onClick={handleConnect}
              disabled={connecting}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Google Sheets"
              )}
            </Button>
          )}

          {isConnected && !currentSheetId && (
            <Button
              onClick={createSheet}
              disabled={creatingSheet}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {creatingSheet ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Creating Sheet...
                </>
              ) : (
                "Create Sheet"
              )}
            </Button>
          )}

          {currentSheetId && (
            <>
              <a
                href={`https://docs.google.com/spreadsheets/d/${currentSheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:underline"
              >
                Open Sheet
                <ExternalLink className="h-3 w-3" />
              </a>
              <Button variant="outline" size="sm">
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
