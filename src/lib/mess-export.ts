/**
 * mess-export.ts
 * Professional client-side Excel export for NIVASI SPACE Mess Student Register.
 *
 * Requirements:
 * - Specific to a single Mess (no mixing of students from different messes).
 * - Students sorted by Mess Joining Date (oldest to newest), then Student Name (A-Z).
 * - Exact columns:
 *   1. Sr. No.
 *   2. Student Name
 *   3. Student Mobile No.
 *   4. Owner Name
 *   5. Owner Mobile No.
 *   6. Mess Name
 *   7. Mess Joining Date
 *   8. Veg / Non-Veg
 * - Professional print-ready layout:
 *   - Landscape orientation, fit-to-width
 *   - Repeat header row on printed pages
 *   - Thin borders around all cells
 *   - Mobile numbers stored as text (avoid scientific notation)
 *   - Dates formatted as DD-MM-YYYY
 *   - Frozen header row and AutoFilter
 *   - Summary section and separate "Summary" sheet
 *   - Dynamic filename: NIVASI_SPACE_Mess_Student_Register_[MessName]_[YYYY-MM-DD].xlsx
 */

import ExcelJS from "exceljs";
import type { Mess, Admission } from "@/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MessStudentExportRow {
  srNo: number;
  studentName: string;
  studentMobile: string;
  ownerName: string;
  ownerMobile: string;
  messName: string;
  messJoiningDateFormatted: string; // DD-MM-YYYY
  rawJoiningDate: string; // YYYY-MM-DD for sorting
  vegNonVeg: "Veg" | "Non-Veg" | "N/A";
}

export interface MessExportOptions {
  mess: Mess;
  students: Admission[];
  dateRange?: {
    startDate?: string | undefined; // YYYY-MM-DD
    endDate?: string | undefined;   // YYYY-MM-DD
  } | undefined;
}

// ── Formatting Helpers ────────────────────────────────────────────────────────

const THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

/**
 * Format any date string (ISO YYYY-MM-DD or timestamp) into DD-MM-YYYY
 */
export function formatToDDMMYYYY(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.trim()) return "N/A";
  const clean = dateStr.trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const parts = clean.split("-");
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (y && m && d) return `${d}-${m}-${y}`;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
    return clean;
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, "0");
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const y = parsed.getFullYear();
    return `${d}-${m}-${y}`;
  }
  return dateStr;
}

/**
 * Extract the raw mess joining date for sorting & filtering
 */
export function getStudentMessJoiningDate(student: Admission): string {
  const d =
    student.messJoiningDate ||
    (student as any).messStartDate ||
    student.packageStartDate ||
    student.admissionDate ||
    student.moveInDate ||
    "";
  if (!d) return "";
  const clean = String(d).trim().slice(0, 10);
  return clean;
}

/**
 * Resolve Veg vs Non-Veg without guessing. Missing/unspecified returns "N/A".
 */
export function resolveVegNonVeg(student: Admission): "Veg" | "Non-Veg" | "N/A" {
  if (!student.mealPreference) return "N/A";
  const pref = student.mealPreference.toLowerCase().trim();
  if (pref.includes("non")) return "Non-Veg";
  if (pref.includes("veg")) return "Veg";
  return "N/A";
}

/**
 * Sanitize strings for safe Windows/macOS filenames
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

/**
 * Format today's date as YYYY-MM-DD
 */
function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Trigger client-side browser download of ArrayBuffer
 */
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

// ── Main Table Columns ────────────────────────────────────────────────────────

const MAIN_HEADERS = [
  "Sr. No.",
  "Student Name",
  "Student Mobile No.",
  "Owner Name",
  "Owner Mobile No.",
  "Mess Name",
  "Mess Joining Date",
  "Veg / Non-Veg",
] as const;

// ── Workbook Construction ─────────────────────────────────────────────────────

/**
 * Build the main "Mess Student Register" sheet
 */
function buildMessRegisterSheet(
  wb: ExcelJS.Workbook,
  mess: Mess,
  rows: MessStudentExportRow[],
  sheetTitle: string,
): void {
  const ws = wb.addWorksheet(sheetTitle, {
    views: [{ state: "frozen", ySplit: 15, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
      printTitlesRow: "15:15",
    },
  });

  // Column widths
  ws.columns = [
    { key: "srNo", width: 10 },
    { key: "studentName", width: 28 },
    { key: "studentMobile", width: 22 },
    { key: "ownerName", width: 24 },
    { key: "ownerMobile", width: 22 },
    { key: "messName", width: 26 },
    { key: "messJoiningDate", width: 20 },
    { key: "vegNonVeg", width: 18 },
  ];

  // ── ROW 1: Title (Merged A1:H1) ──
  ws.mergeCells("A1:H1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "NIVASI SPACE - MESS STUDENT REGISTER";
  titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF9A3412" } }; // Rich deep orange
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFEDD5" }, // Warm soft orange background
  };
  ws.getRow(1).height = 28;
  for (let c = 1; c <= 8; c++) ws.getRow(1).getCell(c).border = THIN;

  // ── ROW 2: Empty spacing ──
  ws.getRow(2).height = 8;

  // ── ROW 3-6: Mess Metadata Block ──
  const exportDateStr = formatToDDMMYYYY(todayDateString());

  const metadata = [
    { label: "Mess Name:", value: mess.messName || "N/A" },
    { label: "Mess Owner:", value: `${mess.ownerName || "N/A"} ${mess.ownerPhone ? `(${mess.ownerPhone})` : ""}`.trim() },
    { label: "Export Date:", value: exportDateStr },
    { label: "Total Students:", value: rows.length },
  ];

  metadata.forEach((m, idx) => {
    const rowNum = 3 + idx;
    const row = ws.getRow(rowNum);
    row.height = 18;

    const labelCell = row.getCell(1);
    labelCell.value = m.label;
    labelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF475569" } };
    labelCell.alignment = { horizontal: "left", vertical: "middle" };

    ws.mergeCells(`B${rowNum}:D${rowNum}`);
    const valCell = row.getCell(2);
    valCell.value = m.value;
    valCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF0F172A" } };
    valCell.alignment = { horizontal: "left", vertical: "middle" };
  });

  // ── ROW 7: Empty spacing ──
  ws.getRow(7).height = 8;

  // ── Dynamic Summary Calculations ──
  const vegCount = rows.filter((r) => r.vegNonVeg === "Veg").length;
  const nonVegCount = rows.filter((r) => r.vegNonVeg === "Non-Veg").length;
  const naCount = rows.filter((r) => r.vegNonVeg === "N/A").length;

  const validDates = rows
    .map((r) => r.rawJoiningDate)
    .filter((d) => Boolean(d && d !== "N/A"))
    .sort();

  const firstJoiningDate = validDates[0] ? formatToDDMMYYYY(validDates[0]) : "N/A";
  const latestJoiningDate = validDates[validDates.length - 1]
    ? formatToDDMMYYYY(validDates[validDates.length - 1])
    : "N/A";

  // ── ROW 8: Summary Header ──
  ws.mergeCells("A8:H8");
  const sumHeader = ws.getCell("A8");
  sumHeader.value = "SUMMARY";
  sumHeader.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1E293B" } };
  sumHeader.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sumHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF1F5F9" },
  };
  ws.getRow(8).height = 20;
  for (let c = 1; c <= 8; c++) ws.getRow(8).getCell(c).border = THIN;

  // ── ROW 9-13: Summary Key-Values ──
  const summaryEntries = [
    { label: "Total Students:", val: rows.length },
    { label: "Total Veg Students:", val: vegCount },
    { label: "Total Non-Veg Students:", val: nonVegCount },
    { label: "First Joining Date:", val: firstJoiningDate },
    { label: "Latest Joining Date:", val: latestJoiningDate },
  ];

  summaryEntries.forEach((s, idx) => {
    const rowNum = 9 + idx;
    const row = ws.getRow(rowNum);
    row.height = 18;

    const lbl = row.getCell(1);
    lbl.value = s.label;
    lbl.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF64748B" } };
    lbl.alignment = { horizontal: "left", vertical: "middle", indent: 1 };

    ws.mergeCells(`B${rowNum}:D${rowNum}`);
    const v = row.getCell(2);
    v.value = s.val;
    v.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
    v.alignment = { horizontal: "left", vertical: "middle" };
  });

  // ── ROW 14: Empty spacing before table ──
  ws.getRow(14).height = 10;

  // ── ROW 15: Table Column Headers ──
  const headerRow = ws.getRow(15);
  headerRow.height = 24;
  MAIN_HEADERS.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF7C2D12" } }; // Deep amber/orange
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFEDD5" }, // Light orange theme matching Nivasi branding
    };
  });

  // ── Data Rows (Row 16 onwards) ──
  let currentRowNum = 16;
  rows.forEach((r) => {
    const row = ws.getRow(currentRowNum);
    row.height = 20;

    // Sr. No.
    const c1 = row.getCell(1);
    c1.value = r.srNo;
    c1.alignment = { horizontal: "center", vertical: "middle" };
    c1.border = THIN;

    // Student Name
    const c2 = row.getCell(2);
    c2.value = r.studentName;
    c2.alignment = { horizontal: "left", vertical: "middle" };
    c2.border = THIN;

    // Student Mobile No. (Text format '@' to prevent scientific notation)
    const c3 = row.getCell(3);
    c3.value = r.studentMobile;
    c3.numFmt = "@";
    c3.alignment = { horizontal: "center", vertical: "middle" };
    c3.border = THIN;

    // Owner Name
    const c4 = row.getCell(4);
    c4.value = r.ownerName;
    c4.alignment = { horizontal: "left", vertical: "middle" };
    c4.border = THIN;

    // Owner Mobile No. (Text format '@')
    const c5 = row.getCell(5);
    c5.value = r.ownerMobile;
    c5.numFmt = "@";
    c5.alignment = { horizontal: "center", vertical: "middle" };
    c5.border = THIN;

    // Mess Name
    const c6 = row.getCell(6);
    c6.value = r.messName;
    c6.alignment = { horizontal: "left", vertical: "middle" };
    c6.border = THIN;

    // Mess Joining Date
    const c7 = row.getCell(7);
    c7.value = r.messJoiningDateFormatted;
    c7.alignment = { horizontal: "center", vertical: "middle" };
    c7.border = THIN;

    // Veg / Non-Veg
    const c8 = row.getCell(8);
    c8.value = r.vegNonVeg;
    c8.alignment = { horizontal: "center", vertical: "middle" };
    c8.border = THIN;

    // Subtle alternating row background
    if (currentRowNum % 2 === 1) {
      for (let col = 1; col <= 8; col++) {
        row.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFAFAFA" },
        };
      }
    }

    currentRowNum++;
  });

  const lastDataRow = currentRowNum - 1;

  // Auto-filter on header row across all 8 columns
  if (rows.length > 0) {
    ws.autoFilter = {
      from: { row: 15, column: 1 },
      to: { row: lastDataRow, column: 8 },
    };
  }
}

/**
 * Build the secondary "Summary" sheet
 */
function buildSummarySheet(
  wb: ExcelJS.Workbook,
  mess: Mess,
  rows: MessStudentExportRow[],
): void {
  const ws = wb.addWorksheet("Summary", {
    views: [{ state: "frozen", ySplit: 2, showGridLines: true }],
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
    },
  });

  ws.columns = [
    { key: "field", width: 28 },
    { key: "val", width: 36 },
  ];

  // Header
  ws.mergeCells("A1:B1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - MESS REGISTER SUMMARY";
  title.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF9A3412" } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFEDD5" },
  };
  ws.getRow(1).height = 26;
  ws.getRow(1).getCell(1).border = THIN;
  ws.getRow(1).getCell(2).border = THIN;

  ws.getRow(2).height = 10;

  const vegCount = rows.filter((r) => r.vegNonVeg === "Veg").length;
  const nonVegCount = rows.filter((r) => r.vegNonVeg === "Non-Veg").length;

  const validDates = rows
    .map((r) => r.rawJoiningDate)
    .filter((d) => Boolean(d && d !== "N/A"))
    .sort();

  const firstJoiningDate = validDates[0] ? formatToDDMMYYYY(validDates[0]) : "N/A";
  const latestJoiningDate = validDates[validDates.length - 1]
    ? formatToDDMMYYYY(validDates[validDates.length - 1])
    : "N/A";

  const rowsData = [
    ["Mess Name", mess.messName || "N/A"],
    ["Mess Owner", mess.ownerName || "N/A"],
    ["Mess Owner Phone", mess.ownerPhone || "N/A"],
    ["Total Students", rows.length],
    ["Veg Students", vegCount],
    ["Non-Veg Students", nonVegCount],
    ["First Joining Date", firstJoiningDate],
    ["Latest Joining Date", latestJoiningDate],
    ["Export Date", formatToDDMMYYYY(todayDateString())],
  ];

  rowsData.forEach(([f, v], idx) => {
    const rowNum = 3 + idx;
    const row = ws.getRow(rowNum);
    row.height = 20;

    const cellA = row.getCell(1);
    cellA.value = f;
    cellA.font = { name: "Calibri", size: 11, bold: true };
    cellA.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    cellA.border = THIN;
    cellA.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8FAFC" },
    };

    const cellB = row.getCell(2);
    cellB.value = v;
    cellB.font = { name: "Calibri", size: 11, bold: idx >= 3 && idx <= 5 };
    cellB.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    cellB.border = THIN;
  });
}

// ── Export Entrypoint ─────────────────────────────────────────────────────────

/**
 * Filter students belonging to the specific mess and export an Excel workbook.
 */
export async function exportMessStudentRegister(opts: MessExportOptions): Promise<{ count: number; fileName: string }> {
  const { mess, students, dateRange } = opts;

  // 1. Filter students belonging exclusively to this Mess
  const messStudents = students.filter((s) => {
    const mId = (s as any).messId;
    return mId === mess.id;
  });

  // 2. Prepare rows with joined dates
  let exportRows: MessStudentExportRow[] = messStudents.map((s) => {
    const rawDate = getStudentMessJoiningDate(s);
    return {
      srNo: 0,
      studentName: s.fullName || "Unknown",
      studentMobile: s.phoneNumber || "N/A",
      ownerName: mess.ownerName || "N/A",
      ownerMobile: mess.ownerPhone || "N/A",
      messName: mess.messName || "N/A",
      messJoiningDateFormatted: formatToDDMMYYYY(rawDate),
      rawJoiningDate: rawDate,
      vegNonVeg: resolveVegNonVeg(s),
    };
  });

  // 3. Optional Date Range Filter
  if (dateRange?.startDate || dateRange?.endDate) {
    exportRows = exportRows.filter((r) => {
      if (!r.rawJoiningDate) return false;
      if (dateRange.startDate && r.rawJoiningDate < dateRange.startDate) return false;
      if (dateRange.endDate && r.rawJoiningDate > dateRange.endDate) return false;
      return true;
    });
  }

  // 4. Sort rows by Mess Joining Date (oldest to newest), then Student Name (A-Z)
  exportRows.sort((a, b) => {
    const dateComparison = a.rawJoiningDate.localeCompare(b.rawJoiningDate);
    if (dateComparison !== 0) return dateComparison;
    return a.studentName.localeCompare(b.studentName);
  });

  // 5. Assign 1-indexed Sr. No. sequentially after sorting
  exportRows.forEach((r, idx) => {
    r.srNo = idx + 1;
  });

  // 6. Create Excel workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Nivasi Space";
  wb.created = new Date();

  // Excel sheet name must be <= 31 chars
  const rawSheetName = `Mess Register - ${mess.messName || "Mess"}`;
  const sheetName = rawSheetName.length > 31 ? rawSheetName.slice(0, 31) : rawSheetName;

  // Build Sheet 1 (Main Register)
  buildMessRegisterSheet(wb, mess, exportRows, sheetName);

  // Build Sheet 2 (Summary)
  buildSummarySheet(wb, mess, exportRows);

  // 7. Write to buffer and trigger download
  const buffer = await wb.xlsx.writeBuffer();
  const safeMessName = sanitizeFileName(mess.messName || "Mess");
  const fileName = `NIVASI_SPACE_Mess_Student_Register_${safeMessName}_${todayDateString()}.xlsx`;

  triggerDownload(buffer as ArrayBuffer, fileName);

  return { count: exportRows.length, fileName };
}
