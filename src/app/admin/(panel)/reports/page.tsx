"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { printReportDocument } from "@/lib/print-report";

const REPORTS = [
  {
    id: "rentals",
    title: "Rental Orders",
    description: "All rental orders with status, totals, and balances.",
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "Event and consultation bookings with contact and status.",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Recorded MoMo, cash, bank, and card payments.",
  },
  {
    id: "outstanding",
    title: "Outstanding Balances",
    description: "Orders with remaining balance due.",
  },
  {
    id: "inventory",
    title: "Inventory Stock",
    description: "Current stock levels and rental pricing.",
  },
  {
    id: "top-items",
    title: "Top Rented Items",
    description: "Highest demand equipment by quantity and revenue.",
  },
] as const;

export default function AdminReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadCsv = async (report: string) => {
    setLoading(`${report}-csv`);
    try {
      const res = await fetch(`/api/admin/reports?report=${report}&format=csv`);
      if (!res.ok) {
        alert("Unable to export report");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(null);
    }
  };

  const printReport = async (reportId: string, title: string) => {
    setLoading(`${reportId}-print`);
    try {
      const res = await fetch(`/api/admin/reports?report=${reportId}&format=json`);
      if (!res.ok) {
        alert("Unable to load report for printing");
        return;
      }
      const data = await res.json();
      printReportDocument(title, (data.rows ?? []) as Record<string, unknown>[]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to print report");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Reports & Exports</h1>
        <p className="text-slate-500">Download CSV or print operational reports for finance and operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => (
          <div key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-slate-900">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{report.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={loading === `${report.id}-csv`}
                onClick={() => downloadCsv(report.id)}
              >
                <Download className="mr-1 h-4 w-4" />
                {loading === `${report.id}-csv` ? "Downloading..." : "Download CSV"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={loading === `${report.id}-print`}
                onClick={() => printReport(report.id, report.title)}
              >
                <Printer className="mr-1 h-4 w-4" />
                {loading === `${report.id}-print` ? "Preparing..." : "Print"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
