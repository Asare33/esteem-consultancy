import { siteInfo } from "@/data/site";

const MONEY_KEYS = new Set([
  "grand_total_ghs",
  "amount_paid_ghs",
  "balance_ghs",
  "amount_ghs",
  "rental_price_ghs",
  "revenue",
  "subtotal_ghs",
  "discount_ghs",
  "transport_ghs",
  "vat_ghs",
]);

const DATE_KEYS = new Set([
  "created_at",
  "paid_at",
  "pickup_date",
  "return_date",
  "event_date",
]);

function formatHeader(key: string): string {
  return key
    .replace(/_ghs$/i, " (GHS)")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCell(key: string, value: unknown): string {
  if (value == null || value === "") return "—";

  if (MONEY_KEYS.has(key) && (typeof value === "number" || !Number.isNaN(Number(value)))) {
    return `GH₵${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (DATE_KEYS.has(key) && typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: value.includes("T") || value.includes(":") ? "2-digit" : undefined,
        minute: value.includes("T") || value.includes(":") ? "2-digit" : undefined,
      });
    }
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value).replaceAll("_", " ");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isWideReport(headers: string[]) {
  return headers.length >= 7;
}

export function buildReportPrintHtml(title: string, rows: Record<string, unknown>[]): string {
  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const wide = isWideReport(headers);
  const headerCells = headers.map((h) => `<th>${escapeHtml(formatHeader(h))}</th>`).join("");
  const bodyRows =
    rows.length === 0
      ? `<tr><td colspan="${Math.max(headers.length, 1)}" class="empty">No records found for this report.</td></tr>`
      : rows
          .map(
            (row) =>
              `<tr>${headers
                .map((h) => {
                  const align = MONEY_KEYS.has(h) || typeof row[h] === "number" ? " class=\"num\"" : "";
                  return `<td${align}>${escapeHtml(formatCell(h, row[h]))}</td>`;
                })
                .join("")}</tr>`
          )
          .join("");

  const address = [
    siteInfo.contact.address,
    siteInfo.contact.city,
    siteInfo.contact.region,
    siteInfo.contact.country,
  ]
    .filter(Boolean)
    .join(", ");

  const origin = typeof window !== "undefined" ? window.location.origin : siteInfo.url;
  const logoUrl = siteInfo.logo.src.startsWith("http")
    ? siteInfo.logo.src
    : `${origin}${siteInfo.logo.src.startsWith("/") ? "" : "/"}${siteInfo.logo.src}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base href="${escapeHtml(origin)}/" />
  <title>${escapeHtml(title)} — ${escapeHtml(siteInfo.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      font-size: 11px;
      line-height: 1.45;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
      padding: 12px 16px;
      background: #0f172a;
      color: #fff;
    }
    .toolbar button {
      border: 0;
      border-radius: 8px;
      padding: 10px 16px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
    }
    .toolbar .print-btn { background: #16a34a; color: #fff; }
    .toolbar .close-btn { background: #334155; color: #fff; }
    .sheet {
      max-width: ${wide ? "1100px" : "900px"};
      margin: 16px auto 32px;
      background: #fff;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      border-bottom: 3px solid #166534;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .brand-row { display: flex; gap: 12px; align-items: center; }
    .logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      padding: 4px;
    }
    .brand h1 {
      margin: 0;
      font-size: 20px;
      color: #166534;
    }
    .brand .tagline {
      margin: 2px 0 0;
      color: #64748b;
      font-size: 11px;
    }
    .brand .addr {
      margin: 6px 0 0;
      color: #475569;
      font-size: 11px;
    }
    .meta {
      text-align: right;
      min-width: 180px;
    }
    .meta .title {
      margin: 0 0 6px;
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
    .meta div { color: #475569; margin-top: 2px; }
    .badge {
      display: inline-block;
      margin-top: 8px;
      padding: 3px 8px;
      border-radius: 999px;
      background: #dcfce7;
      color: #166534;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
    tr { page-break-inside: avoid; }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 8px;
      text-align: left;
      vertical-align: top;
      word-break: break-word;
    }
    th {
      background: #f0fdf4;
      color: #14532d;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    td.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .empty { text-align: center; color: #64748b; font-style: italic; padding: 24px; }
    .footer {
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    @page {
      size: ${wide ? "A4 landscape" : "A4 portrait"};
      margin: 12mm;
    }
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet {
        max-width: none;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button type="button" class="print-btn" onclick="window.print()">Print Report</button>
    <button type="button" class="close-btn" onclick="window.close()">Close</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div class="brand-row">
        <img class="logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(siteInfo.logo.alt)}" />
        <div class="brand">
          <h1>${escapeHtml(siteInfo.legalName)}</h1>
          <p class="tagline">${escapeHtml(siteInfo.tagline)}</p>
          <p class="addr">${escapeHtml(address)}</p>
          <p class="addr">${escapeHtml(siteInfo.contact.phone)} · ${escapeHtml(siteInfo.contact.email)}</p>
        </div>
      </div>
      <div class="meta">
        <p class="title">${escapeHtml(title)}</p>
        <div>Generated: ${escapeHtml(generatedAt)}</div>
        <div>Total records: ${rows.length}</div>
        <span class="badge">Official Admin Report</span>
      </div>
    </div>
    <table>
      <thead><tr>${headerCells || "<th>Report</th>"}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <div class="footer">
      <span>Confidential — for internal use by ${escapeHtml(siteInfo.name)}</span>
      <span>Page printed from Admin Reports</span>
    </div>
  </div>
  <script>
    (function () {
      var printed = false;
      function runPrint() {
        if (printed) return;
        printed = true;
        window.focus();
        window.print();
      }
      // Wait briefly for logo/fonts, then print once
      window.addEventListener("load", function () {
        setTimeout(runPrint, 350);
      });
      if (document.readyState === "complete") {
        setTimeout(runPrint, 350);
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Opens a print-ready preview for a report.
 * Pass an already-opened window (opened synchronously on click) to avoid popup blockers.
 */
export function writeReportToPrintWindow(
  printWindow: Window,
  title: string,
  rows: Record<string, unknown>[]
) {
  const html = buildReportPrintHtml(title, rows);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
}

export function openPrintPlaceholder(title: string): Window {
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (!printWindow) {
    throw new Error("Pop-up blocked. Please allow pop-ups for this site, then try Print again.");
  }

  printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Preparing ${escapeHtml(title)}...</title>
<style>
  body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;color:#334155}
  .box{text-align:center}
  .spinner{width:36px;height:36px;border:3px solid #cbd5e1;border-top-color:#166534;border-radius:50%;margin:0 auto 14px;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
</style></head>
<body><div class="box"><div class="spinner"></div><div>Preparing <strong>${escapeHtml(title)}</strong> for printing...</div></div></body></html>`);
  printWindow.document.close();
  return printWindow;
}
