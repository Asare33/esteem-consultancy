import { siteInfo } from "@/data/site";

function formatHeader(key: string): string {
  return key
    .replace(/_ghs$/i, " (GHS)")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "number") {
    if (String(value).includes(".")) return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return value.toLocaleString();
  }
  return String(value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildReportPrintHtml(title: string, rows: Record<string, unknown>[]): string {
  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const headerCells = headers.map((h) => `<th>${escapeHtml(formatHeader(h))}</th>`).join("");
  const bodyRows =
    rows.length === 0
      ? `<tr><td colspan="${Math.max(headers.length, 1)}" class="empty">No records found.</td></tr>`
      : rows
          .map(
            (row) =>
              `<tr>${headers.map((h) => `<td>${escapeHtml(formatCell(row[h]))}</td>`).join("")}</tr>`
          )
          .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} — ${escapeHtml(siteInfo.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      color: #1e293b;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.4;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 3px solid #166534;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand h1 {
      margin: 0;
      font-size: 22px;
      color: #166534;
    }
    .brand p {
      margin: 4px 0 0;
      color: #64748b;
      font-size: 11px;
    }
    .meta {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    .meta strong { display: block; font-size: 14px; color: #0f172a; margin-bottom: 4px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f0fdf4;
      color: #14532d;
      font-size: 11px;
      font-weight: 700;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    .empty { text-align: center; color: #64748b; font-style: italic; }
    .footer {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 14mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>${escapeHtml(siteInfo.name)}</h1>
      <p>${escapeHtml(siteInfo.tagline)}</p>
    </div>
    <div class="meta">
      <strong>${escapeHtml(title)}</strong>
      <div>Generated: ${escapeHtml(generatedAt)}</div>
      <div>Records: ${rows.length}</div>
    </div>
  </div>
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <div class="footer">
    <span>${escapeHtml(siteInfo.contact.email)} · ${escapeHtml(siteInfo.contact.phone)}</span>
    <span>Admin Report</span>
  </div>
</body>
</html>`;
}

export function printReportDocument(title: string, rows: Record<string, unknown>[]) {
  const html = buildReportPrintHtml(title, rows);
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1024,height=768");
  if (!printWindow) {
    throw new Error("Please allow pop-ups to print reports.");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  // Fallback if onload already fired
  setTimeout(() => {
    if (!printWindow.closed) {
      printWindow.focus();
      printWindow.print();
    }
  }, 400);
}
