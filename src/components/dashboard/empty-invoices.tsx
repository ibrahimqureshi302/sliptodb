import { FileText } from "lucide-react";

export function EmptyInvoices() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
        <FileText className="h-6 w-6 text-violet-500" />
      </div>
      <h3 className="mb-2 text-base font-semibold">No invoices yet</h3>
      <p className="mx-auto max-w-sm text-sm text-muted-foreground">
        Forward your first invoice email to your inbound address above. It will
        appear here within seconds.
      </p>
    </div>
  );
}
