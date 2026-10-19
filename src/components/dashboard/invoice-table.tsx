"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Invoice {
  id: string;
  vendor_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  currency: string | null;
  total: number | null;
  source_filename: string | null;
  created_at: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  pageSize?: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount: number | null, currency: string | null): string {
  if (amount == null) return "—";
  const curr = currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(amount);
  } catch {
    return `${curr} ${amount.toFixed(2)}`;
  }
}

export function InvoiceTable({ invoices, pageSize = 10 }: InvoiceTableProps) {
  const [page, setPage] = useState(0);

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
          <FileText className="h-6 w-6 text-violet-500" />
        </div>
        <h3 className="mb-2 text-base font-semibold">No invoices yet</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Forward your first invoice email or upload a PDF to your inbound address. It will
          appear here within seconds.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(invoices.length / pageSize);
  const start = page * pageSize;
  const paginated = invoices.slice(start, start + pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Processed At
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Vendor
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                Invoice #
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                Invoice Date
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">
                Due Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Currency
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-border/40 last:border-0 hover:bg-accent/30"
              >
                {/* NEW: Real-time Processed At column */}
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDateTime(invoice.created_at)}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                  {invoice.vendor_name || "Unknown vendor"}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {invoice.invoice_number || "—"}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                  {formatDate(invoice.invoice_date)}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                  {formatDate(invoice.due_date)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {invoice.currency || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                  {formatCurrency(invoice.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {start + 1}–{Math.min(start + pageSize, invoices.length)} of{" "}
            {invoices.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
