/**
 * laundry-export.ts
 * Client-side Excel export for NIVASI SPACE Weekly Laundry Billing.
 *
 * Reference format: NIVASI_SPACE_Weekly_Laundry_Billing_With_Count.xlsx
 *  Row 1  : TITLE  (merged A1:G1, bold 16pt)
 *  Row 2  : Export date (A2, bold 14pt, "d-mmm" format) + date range (B2)
 *  Row 3  : Summary — Week label, Total Clothes formula, Total Weight formula, Total Amount formula
 *  Rows 4-5 : (empty spacing)
 *  Row 6  : Column headers (bold, centre-aligned)
 *  Rows 7+ : Data rows
 *  Last   : TOTAL row (bold, formulas)
 *
 * Rate is always 80 INR/Kg — never sourced from individual records.
 */

import ExcelJS from "exceljs";
import type { LaundryPickup } from "@/lib/types";

// ── Fixed rate ────────────────────────────────────────────────────────────────
export const LAUNDRY_RATE_PER_KG = 80;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LaundryExportRow {
  weekLabel: string;
  orderNo: string;
  studentName: string;
  clothesCount: number;
  weightKg: number;
}

export interface LaundryExportOptions {
  rows: LaundryExportRow[];
  weekLabel: string;
  weekDateRange: string;
  laundryName: string;
}

/** Options for the "Export All Weeks" variant */
export interface LaundryExportAllWeeksOptions {
  weekGroups: {
    weekLabel: string;
    weekDateRange: string;
    rows: LaundryExportRow[];
  }[];
  laundryName: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a numeric weight from strings like "2.5 kg", "2.5", "2.5 Kg" etc. */
export function parseWeight(raw: string | undefined | null): number {
  if (!raw) return 0;
  const match = raw.replace(/,/g, ".").match(/(\d+(?:\.\d+)?)/);
  if (!match || !match[1]) return 0;
  const n = parseFloat(match[1]);
  return isNaN(n) ? 0 : n;
}

/** Try to infer the clothes count from a notes string like "3 shirts, 2 pants" */
export function inferClothesCount(notes: string | undefined | null): number {
  if (!notes) return 0;
  const parts = notes.split(/[,]+/);
  let count = 0;
  for (const part of parts) {
    const m = part.trim().match(/^(\d+)/);
    if (m && m[1]) count += parseInt(m[1], 10);
  }
  return count;
}

/** Build export rows from raw LaundryPickup records + a student-name lookup map */
export function buildExportRows(
  pickups: LaundryPickup[],
  studentNameMap: Record<string, string>,
  weekLabel: string,
): LaundryExportRow[] {
  // Group all records by `${studentId}_${date}` to strictly avoid duplicates for that day and date
  const byStudentDate = new Map<string, LaundryPickup[]>();
  for (const p of pickups) {
    const key = `${p.studentId}_${p.date}`;
    const list = byStudentDate.get(key) ?? [];
    list.push(p);
    byStudentDate.set(key, list);
  }

  // Merge records for each student-date into a single unified record
  const merged: {
    studentId: string;
    date: string;
    clothesWeight: string;
    notes: string;
    status: string;
  }[] = [];

  for (const [key, records] of byStudentDate.entries()) {
    const [studentId, date] = key.split("_");

    let bestWeight = "";
    let bestWeightNum = 0;
    let bestNotes = "";
    let status = "pending";

    for (const r of records) {
      const w = parseWeight(r.clothesWeight);
      if (w > 0 && w >= bestWeightNum) {
        bestWeightNum = w;
        bestWeight = r.clothesWeight ?? String(w);
      } else if (!bestWeight && r.clothesWeight) {
        bestWeight = r.clothesWeight;
      }

      if (r.notes && (!bestNotes || r.notes.length > bestNotes.length)) {
        bestNotes = r.notes;
      }

      if (r.status === "picked_up" || (r.status as string) === "delivered") {
        status = "picked_up";
      }
    }

    merged.push({
      studentId: studentId!,
      date: date || "",
      clothesWeight: bestWeight,
      notes: bestNotes,
      status,
    });
  }

  // Filter to records that have weight data or were marked picked_up / delivered
  const valid = merged.filter((item) => {
    const w = parseWeight(item.clothesWeight);
    return w > 0 || item.status === "picked_up" || item.status === "delivered";
  });

  // Sort by date then student name for deterministic ordering
  valid.sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    if (d !== 0) return d;
    const nameA = studentNameMap[a.studentId] ?? a.studentId;
    const nameB = studentNameMap[b.studentId] ?? b.studentId;
    return nameA.localeCompare(nameB);
  });

  return valid.map((item, idx) => ({
    weekLabel,
    orderNo: `T-${idx + 1}`,
    studentName: studentNameMap[item.studentId] ?? "Unknown Student",
    clothesCount: inferClothesCount(item.notes),
    weightKg: parseWeight(item.clothesWeight),
  }));
}

// ── Excel Generation ──────────────────────────────────────────────────────────

const THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

/** Rupee currency format string for ExcelJS */
const RUPEE_FMT = '[$₹-4009]#,##0.00';

/** Column header names — must match reference exactly */
const HEADERS = [
  "Week",
  "Order No.",
  "Student Name",
  "Clothes Count",
  "Weight (Kg)",
  "Rate / Kg (₹)",
  "Total Amount (₹)",
] as const;

function applyAllBorders(row: ExcelJS.Row, colCount = 7) {
  for (let c = 1; c <= colCount; c++) {
    row.getCell(c).border = THIN;
  }
}

/** Build a single "Weekly Billing" sheet from provided rows */
function buildBillingSheet(
  wb: ExcelJS.Workbook,
  opts: LaundryExportOptions,
  sheetName = "Weekly Billing",
): void {
  const { rows, weekLabel, weekDateRange } = opts;

  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 6, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
      printTitlesRow: "6:6",
    },
  });

  // ── Column widths (matching reference file exactly) ──
  ws.columns = [
    { key: "week",         width: 14.0 },
    { key: "orderNo",      width: 16.0 },
    { key: "studentName",  width: 24.0 },
    { key: "clothesCount", width: 18.0 },
    { key: "weight",       width: 16.0 },
    { key: "rate",         width: 18.0 },
    { key: "totalAmount",  width: 22.0 },
  ];

  // ── ROW 1: Title ──────────────────────────────────────────────────────────────
  ws.mergeCells("A1:G1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "NIVASI SPACE - WEEKLY LAUNDRY BILLING";
  titleCell.font = { name: "Calibri", size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 21;
  applyAllBorders(ws.getRow(1));

  // ── ROW 2: Export date + week range ──────────────────────────────────────────
  const dateCell = ws.getCell("A2");
  dateCell.value = new Date();
  dateCell.numFmt = "d-mmm";
  dateCell.font = { name: "Calibri", size: 14, bold: true };
  dateCell.alignment = { horizontal: "center", vertical: "middle" };
  const rangeDateCell = ws.getCell("B2");
  rangeDateCell.value = weekDateRange;
  rangeDateCell.font = { name: "Calibri", size: 11, bold: true };
  rangeDateCell.alignment = { horizontal: "left", vertical: "middle" };
  ws.getRow(2).height = 18.75;
  applyAllBorders(ws.getRow(2));

  // ── Row positions ─────────────────────────────────────────────────────────────
  const DATA_START = 7;
  const DATA_END = rows.length > 0 ? DATA_START + rows.length - 1 : DATA_START;
  const TOTAL_ROW_NUM = DATA_END + 1;

  // ── ROW 3: Summary section ────────────────────────────────────────────────────
  const summaryRow = ws.getRow(3);
  summaryRow.getCell(1).value = "Week";
  summaryRow.getCell(2).value = weekLabel;
  summaryRow.getCell(3).value = "Total Clothes";
  summaryRow.getCell(4).value = rows.length > 0
    ? { formula: `SUM(D${DATA_START}:D${DATA_END})` }
    : 0;
  summaryRow.getCell(5).value = "Total Weight (Kg)";

  const sWeightCell = summaryRow.getCell(6);
  sWeightCell.value = rows.length > 0
    ? { formula: `SUM(E${DATA_START}:E${DATA_END})` }
    : 0;
  sWeightCell.numFmt = "0.00";

  // Total Amount label + formula
  const sAmtLabelCell = summaryRow.getCell(6);
  // We place the amount formula at G3 and its label at the Weight cell label
  // Actually, the reference has: A3=Week, B3=weekLabel, C3=Total Clothes, D3=formula,
  // E3=Total Weight (Kg), F3=formula, G3=Total Amount (₹) formula
  // But the label "Total Amount (₹)" is implied by column G header.
  // Let's add "Total Amount (₹)" as a label in the summary by adjusting:
  // We'll use the summary row exactly as the reference: E3 label, F3 value, then G3 is the amount formula.
  const sAmtCell = summaryRow.getCell(7);
  sAmtCell.value = rows.length > 0
    ? { formula: `SUM(G${DATA_START}:G${DATA_END})` }
    : 0;
  sAmtCell.numFmt = RUPEE_FMT;

  for (let c = 1; c <= 7; c++) {
    const cell = summaryRow.getCell(c);
    cell.font = { name: "Calibri", size: 11 };
    cell.border = THIN;
    cell.alignment = { vertical: "middle" };
  }

  // ── ROWS 4-5: Empty spacing ───────────────────────────────────────────────────
  applyAllBorders(ws.getRow(4));
  applyAllBorders(ws.getRow(5));

  // ── ROW 6: Column Headers ─────────────────────────────────────────────────────
  const headerRow = ws.getRow(6);
  headerRow.height = 20;
  HEADERS.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Calibri", size: 11, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" }, // Light blue header background
    };
  });

  // ── Auto-filter on header row ─────────────────────────────────────────────────
  ws.autoFilter = {
    from: { row: 6, column: 1 },
    to: { row: DATA_END, column: 7 },
  };

  // ── DATA ROWS ─────────────────────────────────────────────────────────────────
  if (rows.length === 0) {
    const emptyRow = ws.getRow(DATA_START);
    emptyRow.height = 19;
    emptyRow.getCell(1).value = weekLabel;
    emptyRow.getCell(2).value = "—";
    emptyRow.getCell(3).value = "No records with weight data for the selected period";
    emptyRow.getCell(4).value = 0;
    const ewCell = emptyRow.getCell(5);
    ewCell.value = 0;
    ewCell.numFmt = "0.00";
    const erCell = emptyRow.getCell(6);
    erCell.value = LAUNDRY_RATE_PER_KG;
    erCell.numFmt = RUPEE_FMT;
    const eaCell = emptyRow.getCell(7);
    eaCell.value = 0;
    eaCell.numFmt = RUPEE_FMT;
    for (let c = 1; c <= 7; c++) {
      const cell = emptyRow.getCell(c);
      cell.font = { name: "Calibri", size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = THIN;
    }
  } else {
    rows.forEach((item, idx) => {
      const r = DATA_START + idx;
      const row = ws.getRow(r);
      row.height = 19;

      const cellA = row.getCell(1);
      cellA.value = item.weekLabel;
      cellA.alignment = { horizontal: "center", vertical: "middle" };
      cellA.border = THIN;
      cellA.font = { name: "Calibri", size: 11 };

      const cellB = row.getCell(2);
      cellB.value = item.orderNo;
      cellB.alignment = { horizontal: "center", vertical: "middle" };
      cellB.border = THIN;
      cellB.font = { name: "Calibri", size: 11 };

      const cellC = row.getCell(3);
      cellC.value = item.studentName;
      cellC.alignment = { horizontal: "center", vertical: "middle" };
      cellC.border = THIN;
      cellC.font = { name: "Calibri", size: 11 };

      const cellD = row.getCell(4);
      cellD.value = item.clothesCount;
      cellD.numFmt = "0"; // Integer format — no decimals
      cellD.alignment = { horizontal: "center", vertical: "middle" };
      cellD.border = THIN;
      cellD.font = { name: "Calibri", size: 11 };

      const cellE = row.getCell(5);
      cellE.value = item.weightKg;
      cellE.numFmt = "0.00";
      cellE.alignment = { horizontal: "center", vertical: "middle" };
      cellE.border = THIN;
      cellE.font = { name: "Calibri", size: 11 };

      const cellF = row.getCell(6);
      cellF.value = LAUNDRY_RATE_PER_KG;
      cellF.numFmt = RUPEE_FMT;
      cellF.alignment = { horizontal: "center", vertical: "middle" };
      cellF.border = THIN;
      cellF.font = { name: "Calibri", size: 11 };

      const cellG = row.getCell(7);
      cellG.value = { formula: `IF(E${r}="","",E${r}*F${r})` };
      cellG.numFmt = RUPEE_FMT;
      cellG.alignment = { horizontal: "center", vertical: "middle" };
      cellG.border = THIN;
      cellG.font = { name: "Calibri", size: 11 };
    });
  }

  // ── TOTAL ROW ─────────────────────────────────────────────────────────────────
  const tRow = ws.getRow(TOTAL_ROW_NUM);
  tRow.height = 20;
  tRow.getCell(1).value = "TOTAL";
  tRow.getCell(2).value = null;
  tRow.getCell(3).value = null;
  tRow.getCell(4).value = rows.length > 0
    ? { formula: `SUM(D${DATA_START}:D${DATA_END})` }
    : 0;
  tRow.getCell(4).numFmt = "0";
  const tWeightCell = tRow.getCell(5);
  tWeightCell.value = rows.length > 0
    ? { formula: `SUM(E${DATA_START}:E${DATA_END})` }
    : 0;
  tWeightCell.numFmt = "0.00";
  tRow.getCell(6).value = null;
  const tAmtCell = tRow.getCell(7);
  tAmtCell.value = rows.length > 0
    ? { formula: `SUM(G${DATA_START}:G${DATA_END})` }
    : 0;
  tAmtCell.numFmt = RUPEE_FMT;

  for (let c = 1; c <= 7; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: "Calibri", size: 11, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = THIN;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" }, // Light grey for total row
    };
  }
}

/** Format a date as YYYY-MM-DD for filenames */
function todayFileDate(): string {
  return new Date().toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD
}

/** Trigger browser download of an ArrayBuffer as an .xlsx file */
function triggerDownload(buffer: ArrayBuffer, fileName: string): void {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

/** Generate and download the Excel file for a single week in the browser */
export async function exportLaundryBillingExcel(opts: LaundryExportOptions): Promise<void> {
  const { weekLabel } = opts;

  const wb = new ExcelJS.Workbook();
  wb.creator = "Nivasi Space";
  wb.created = new Date();

  buildBillingSheet(wb, opts, "Weekly Billing");

  const buffer = await wb.xlsx.writeBuffer();
  const safeWeek = weekLabel.replace(/\s+/g, "_");
  const fileName = `NIVASI_SPACE_Weekly_Laundry_Billing_${safeWeek}_${todayFileDate()}.xlsx`;
  triggerDownload(buffer as ArrayBuffer, fileName);
}

/** Generate and download the Excel file for ALL weeks (one sheet per week) */
export async function exportAllWeeksLaundryBillingExcel(
  opts: LaundryExportAllWeeksOptions,
): Promise<void> {
  const { weekGroups, laundryName } = opts;

  const wb = new ExcelJS.Workbook();
  wb.creator = "Nivasi Space";
  wb.created = new Date();

  for (const group of weekGroups) {
    // Sheet name limited to 31 chars in Excel
    const sheetName = group.weekLabel.length > 31
      ? group.weekLabel.slice(0, 31)
      : group.weekLabel;

    buildBillingSheet(wb, {
      rows: group.rows,
      weekLabel: group.weekLabel,
      weekDateRange: group.weekDateRange,
      laundryName,
    }, sheetName);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const fileName = `NIVASI_SPACE_Weekly_Laundry_Billing_All_Weeks_${todayFileDate()}.xlsx`;
  triggerDownload(buffer as ArrayBuffer, fileName);
}
