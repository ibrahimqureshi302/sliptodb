"use client";


import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InvoiceTable, type Invoice } from "@/components/dashboard/invoice-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvoicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("invoices")
        .select(
          "id, vendor_name, invoice_number, invoice_date, due_date, currency, total, source_filename, created_at"
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setInvoices((data as Invoice[]) || []);
      setLoading(false);
    }

    load();
  }, [router]);

  // Filter by search query
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter((inv) => {
      return (
        inv.vendor_name?.toLowerCase().includes(q) ||
        inv.invoice_number?.toLowerCase().includes(q) ||
        inv.source_filename?.toLowerCase().includes(q)
      );
    });
  }, [invoices, searchQuery]);

  // Export to CSV
  function handleExportCSV() {
    const headers = [
      "Date",
      "Vendor",
      "Invoice #",
      "Due Date",
      "Currency",
      "Total",
      "Filename",
      "Processed At",
    ];

    const rows = filteredInvoices.map((inv) => [
      inv.invoice_date || "",
      inv.vendor_name || "",
      inv.invoice_number || "",
      inv.due_date || "",
      inv.currency || "",
      inv.total?.toString() || "",
      inv.source_filename || "",
      inv.created_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sliptodb-invoices-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/40" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted/30" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoices.length} total invoice{invoices.length !== 1 ? "s" : ""}
          </p>
        </div>

        {invoices.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="w-fit"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Search */}
      {invoices.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by vendor, invoice #, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table */}
      <InvoiceTable invoices={filteredInvoices} pageSize={20} />
    </div>
  );
}
