/**
 * mess-export.ts
 * Professional client-side Excel export for NIVASI SPACE Mess Accounting & Tiffin System.
 *
 * Implements:
 * 1. Sheet 1: Monthly Mess Report (Executive summary + Daily Tiffin Summary)
 * 2. Sheet 2: Daily Tiffin Record (Detailed operational log per day/mess)
 * 3. Sheet 3: Student Leave Record (Daily student leave reductions)
 * 4. Sheet 4: Student Monthly Billing (₹2,300 monthly package breakdown)
 * 5. Sheet 5: Mess Summary (Mess Register Summary with billing & totals)
 * 6. Sheet 6: Student Register (Classic full student directory)
 *
 * Supports single mess and consolidated "All Messes" exports.
 */

import ExcelJS from "exceljs";
import type {
  Mess,
  Admission,
  LeaveRequest,
  MessDailyRecord,
  LeaveBillingPolicy,
} from "@/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MonthlyMessExportOptions {
  mess: Mess | "all";
  allMesses?: Mess[];
  admissions: Admission[];
  leaveRequests?: LeaveRequest[];
  dailyRecords?: MessDailyRecord[];
  month: number; // 1 - 12
  year: number; // e.g. 2026
  leaveBillingPolicy?: LeaveBillingPolicy;
}

export interface LegacyMessExportOptions {
  mess: Mess;
  students: Admission[];
  dateRange?: {
    startDate?: string | undefined;
    endDate?: string | undefined;
  };
}

export interface DailyTiffinComputedRow {
  srNo: number;
  dateStr: string; // YYYY-MM-DD
  dateFormatted: string; // DD-MM-YYYY
  dayName: string; // Monday, Tuesday...
  messName: string;
  assignedStudents: number;
  studentsOnLeave: number;
  expectedLunch: number;
  lunchAdjustment: number;
  finalLunch: number;
  expectedDinner: number;
  dinnerAdjustment: number;
  finalDinner: number;
  totalDailyTiffins: number;
  lunchStatus: "OPEN" | "OFF";
  dinnerStatus: "OPEN" | "OFF";
  messStatus: string;
  reason: string;
  updatedBy: string;
  updatedAtFormatted: string;
  leaveStudentIds: string[];
}

export interface StudentBillingComputedRow {
  srNo: number;
  studentName: string;
  studentId: string; // admissionId or ID
  studentMobile: string;
  messName: string;
  admissionDateFormatted: string;
  endDateFormatted: string;
  leaveDays: number;
  applicableDays: number;
  monthlyRate: number; // 2300
  lunchShare: number; // 1150
  dinnerShare: number; // 1150
  totalAmount: number; // 2300 (or prorated if policy)
  billingStatus: string;
}

// ── Styling Constants ─────────────────────────────────────────────────────────

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFCBD5E1" } },
  left: { style: "thin", color: { argb: "FFCBD5E1" } },
  bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
  right: { style: "thin", color: { argb: "FFCBD5E1" } },
};

const DOUBLE_BOTTOM_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FF64748B" } },
  left: { style: "thin", color: { argb: "FFCBD5E1" } },
  bottom: { style: "double", color: { argb: "FF0F172A" } },
  right: { style: "thin", color: { argb: "FFCBD5E1" } },
};

const COLOR_HEADER_BG = "FFFFEDD5"; // Soft warm orange
const COLOR_HEADER_TEXT = "FF9A3412"; // Deep rich orange
const COLOR_TABLE_HEADER_BG = "FFFFEDD5";
const COLOR_TABLE_HEADER_TEXT = "FF7C2D12";
const COLOR_SECTION_BG = "FFF1F5F9"; // Cool slate gray
const COLOR_TOTAL_BG = "FFFEF3C7"; // Light amber/yellow highlight

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── Formatting Helpers ────────────────────────────────────────────────────────

export function formatToDDMMYYYY(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.trim()) return "N/A";
  const clean = dateStr.trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [y, m, d] = clean.split("-");
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

export function getStudentMessJoiningDate(student: Admission): string {
  const d =
    student.messJoiningDate ||
    (student as any).messStartDate ||
    student.packageStartDate ||
    student.admissionDate ||
    student.moveInDate ||
    "";
  if (!d) return "";
  return String(d).trim().slice(0, 10);
}

export function resolveVegNonVeg(student: Admission): "Veg" | "Non-Veg" | "N/A" {
  if (!student.mealPreference) return "N/A";
  const pref = student.mealPreference.toLowerCase().trim();
  if (pref.includes("non")) return "Non-Veg";
  if (pref.includes("veg")) return "Veg";
  return "N/A";
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

// ── Daily Tiffin Computing Engine ─────────────────────────────────────────────

export function computeDailyTiffinRecordsForMonth(
  messes: Mess[],
  admissions: Admission[],
  leaves: LeaveRequest[],
  dailyRecords: MessDailyRecord[],
  year: number,
  month: number
): {
  dailyRows: DailyTiffinComputedRow[];
  studentLeaveRecords: {
    srNo: number;
    date: string;
    studentName: string;
    studentId: string;
    studentMobile: string;
    assignedMess: string;
    leaveStartDate: string;
    leaveEndDate: string;
    leaveStatus: string;
    lunchReduced: number;
    dinnerReduced: number;
    totalReduced: number;
  }[];
  studentBillingRows: StudentBillingComputedRow[];
} {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyRows: DailyTiffinComputedRow[] = [];
  const studentLeaveMapRows: {
    srNo: number;
    date: string;
    studentName: string;
    studentId: string;
    studentMobile: string;
    assignedMess: string;
    leaveStartDate: string;
    leaveEndDate: string;
    leaveStatus: string;
    lunchReduced: number;
    dinnerReduced: number;
    totalReduced: number;
  }[] = [];

  // Index dailyRecords by `${messId}_${dateKey}`
  const dailyRecordMap = new Map<string, MessDailyRecord>();
  for (const dr of dailyRecords) {
    dailyRecordMap.set(`${dr.messId}_${dr.dateKey || dr.date}`, dr);
  }

  // Pre-filter approved leaves
  const approvedLeaves = leaves.filter((l) => l.status === "approved" && Boolean(l.fromDate));

  let leaveSrNo = 1;

  // Process day by day
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, "0");
    const mStr = String(month).padStart(2, "0");
    const dateKey = `${year}-${mStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    for (const mess of messes) {
      // Find students assigned to this mess on this date
      const assignedStudents = admissions.filter((a) => {
        const studentMessId = (a as any).messId;
        if (studentMessId !== mess.id) return false;
        // Check active date
        const joining = getStudentMessJoiningDate(a);
        if (joining && joining > dateKey) return false;
        const end = a.packageEndDate || "";
        if (end && end < dateKey) return false;
        return true;
      });

      // Find which students are on approved leave on this date
      const onLeaveStudents = assignedStudents.filter((student) => {
        const sLeave = approvedLeaves.find((l) => {
          const isStudent = l.studentId === student.id || l.admissionId === student.admissionId;
          if (!isStudent) return false;
          if (l.fromDate > dateKey) return false;
          if (l.toDate && l.toDate < dateKey) return false;
          return true;
        });

        if (sLeave) {
          studentLeaveMapRows.push({
            srNo: leaveSrNo++,
            date: formatToDDMMYYYY(dateKey),
            studentName: student.fullName || "Student",
            studentId: student.admissionId || student.id,
            studentMobile: student.phoneNumber || "N/A",
            assignedMess: mess.messName,
            leaveStartDate: formatToDDMMYYYY(sLeave.fromDate),
            leaveEndDate: sLeave.toDate ? formatToDDMMYYYY(sLeave.toDate) : "Open Return",
            leaveStatus: "Approved",
            lunchReduced: 1,
            dinnerReduced: 1,
            totalReduced: 2,
          });
          return true;
        }
        return false;
      });

      const assignedCount = assignedStudents.length;
      const leaveCount = onLeaveStudents.length;
      const expectedLunch = Math.max(0, assignedCount - leaveCount);
      const expectedDinner = Math.max(0, assignedCount - leaveCount);

      // Check existing Firestore daily record
      const existing = dailyRecordMap.get(`${mess.id}_${dateKey}`);

      let lunchAdj = existing?.lunchAdjustment ?? 0;
      let dinnerAdj = existing?.dinnerAdjustment ?? 0;
      let messStatus = existing?.messStatus ?? "OPEN";
      let reason = existing?.reason ?? "";
      let lunchStatus: "OPEN" | "OFF" = existing?.lunchStatus ?? "OPEN";
      let dinnerStatus: "OPEN" | "OFF" = existing?.dinnerStatus ?? "OPEN";
      let updatedBy = existing?.updatedBy ?? "Auto-system";
      let updatedAtFormatted = existing?.updatedAt
        ? formatToDDMMYYYY(existing.updatedAt.toISOString())
        : formatToDDMMYYYY(dateKey);

      // Mess-off logic
      if (messStatus === "LUNCH_OFF") {
        lunchStatus = "OFF";
      } else if (messStatus === "DINNER_OFF") {
        dinnerStatus = "OFF";
      } else if (
        messStatus === "FULL_DAY_OFF" ||
        messStatus === "HOLIDAY" ||
        messStatus === "SPECIAL_CLOSURE"
      ) {
        lunchStatus = "OFF";
        dinnerStatus = "OFF";
      }

      const finalLunch = lunchStatus === "OFF" ? 0 : Math.max(0, expectedLunch + lunchAdj);
      const finalDinner = dinnerStatus === "OFF" ? 0 : Math.max(0, expectedDinner + dinnerAdj);
      const totalDailyTiffins = finalLunch + finalDinner;

      dailyRows.push({
        srNo: dailyRows.length + 1,
        dateStr: dateKey,
        dateFormatted: formatToDDMMYYYY(dateKey),
        dayName,
        messName: mess.messName,
        assignedStudents: assignedCount,
        studentsOnLeave: leaveCount,
        expectedLunch,
        lunchAdjustment: lunchAdj,
        finalLunch,
        expectedDinner,
        dinnerAdjustment: dinnerAdj,
        finalDinner,
        totalDailyTiffins,
        lunchStatus,
        dinnerStatus,
        messStatus,
        reason: reason || (messStatus !== "OPEN" ? messStatus.replace(/_/g, " ") : "-"),
        updatedBy,
        updatedAtFormatted,
        leaveStudentIds: onLeaveStudents.map((s) => s.id),
      });
    }
  }

  // ── Compute Student Monthly Billing ──
  const studentBillingRows: StudentBillingComputedRow[] = [];
  let billingSrNo = 1;

  for (const mess of messes) {
    const messStudents = admissions.filter((a) => (a as any).messId === mess.id);

    for (const student of messStudents) {
      const joining = getStudentMessJoiningDate(student);
      const end = student.packageEndDate || "";

      // Count active days in this month
      let activeDaysCount = 0;
      let leaveDaysCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = String(day).padStart(2, "0");
        const mStr = String(month).padStart(2, "0");
        const dateKey = `${year}-${mStr}-${dayStr}`;

        if (joining && joining > dateKey) continue;
        if (end && end < dateKey) continue;

        activeDaysCount++;

        const isOnLeave = approvedLeaves.some((l) => {
          const isStudent = l.studentId === student.id || l.admissionId === student.admissionId;
          if (!isStudent) return false;
          if (l.fromDate > dateKey) return false;
          if (l.toDate && l.toDate < dateKey) return false;
          return true;
        });

        if (isOnLeave) leaveDaysCount++;
      }

      if (activeDaysCount === 0) continue;

      // Billing calculation: ₹2,300 monthly package for one student
      const monthlyRate = 2300;
      let totalAmount = monthlyRate;
      let status = "Full Month";

      // Prorate if joined mid-month or left mid-month
      if (activeDaysCount < daysInMonth) {
        totalAmount = Math.round((monthlyRate / daysInMonth) * activeDaysCount);
        status = `Prorated (${activeDaysCount}/${daysInMonth} days)`;
      }

      const lunchShare = Math.round(totalAmount / 2);
      const dinnerShare = totalAmount - lunchShare; // Guarantees exact sum = totalAmount

      studentBillingRows.push({
        srNo: billingSrNo++,
        studentName: student.fullName || "Student",
        studentId: student.admissionId || student.id,
        studentMobile: student.phoneNumber || "N/A",
        messName: mess.messName,
        admissionDateFormatted: formatToDDMMYYYY(student.admissionDate || joining),
        endDateFormatted: end ? formatToDDMMYYYY(end) : "Active",
        leaveDays: leaveDaysCount,
        applicableDays: activeDaysCount,
        monthlyRate,
        lunchShare,
        dinnerShare,
        totalAmount,
        billingStatus: status,
      });
    }
  }

  return { dailyRows, studentLeaveRecords: studentLeaveMapRows, studentBillingRows };
}

// ── SHEET 1: Monthly Mess Report ──────────────────────────────────────────────

function buildMonthlyMessReportSheet(
  wb: ExcelJS.Workbook,
  mess: Mess | "all",
  messes: Mess[],
  dailyRows: DailyTiffinComputedRow[],
  billingRows: StudentBillingComputedRow[],
  month: number,
  year: number
): void {
  const ws = wb.addWorksheet("Monthly Mess Report", {
    views: [{ state: "frozen", ySplit: 26, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
      printTitlesRow: "26:26",
    },
  });

  const isAll = mess === "all";
  const messName = isAll ? "All Messes (Consolidated)" : mess.messName;
  const messOwner = isAll ? "Nivasi Space Mess Network" : (mess.ownerName || "N/A");
  const ownerMobile = isAll ? "Multiple" : (mess.ownerPhone || "N/A");
  const monthName = MONTH_NAMES[month - 1] || "Month";
  const daysInMonth = new Date(year, month, 0).getDate();
  const periodStr = `01-${String(month).padStart(2, "0")}-${year} to ${String(daysInMonth).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  const exportDateStr = formatToDDMMYYYY(todayDateString());

  // Columns A to O (15 columns)
  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "date", width: 14 },
    { key: "day", width: 14 },
    { key: "assigned", width: 16 },
    { key: "leave", width: 16 },
    { key: "expLunch", width: 15 },
    { key: "lunchAdj", width: 16 },
    { key: "finalLunch", width: 15 },
    { key: "expDinner", width: 15 },
    { key: "dinnerAdj", width: 16 },
    { key: "finalDinner", width: 15 },
    { key: "totalTiffins", width: 18 },
    { key: "lunchStatus", width: 13 },
    { key: "dinnerStatus", width: 13 },
    { key: "remarks", width: 22 },
  ];

  // ── ROW 1: Banner Header (Merged A1:O1) ──
  ws.mergeCells("A1:O1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "NIVASI SPACE - MONTHLY MESS TIFFIN REPORT";
  titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 32;
  for (let c = 1; c <= 15; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  // ── ROW 2: Empty ──
  ws.getRow(2).height = 6;

  // ── ROW 3-6: Mess Information Block ──
  const infoRows = [
    [
      { label: "Mess Name:", val: messName },
      { label: "Month:", val: `${monthName} ${year}` },
    ],
    [
      { label: "Mess Owner:", val: messOwner },
      { label: "Report Period:", val: periodStr },
    ],
    [
      { label: "Owner Mobile:", val: ownerMobile },
      { label: "Export Date:", val: exportDateStr },
    ],
  ];

  infoRows.forEach((pair, idx) => {
    const rowNum = 3 + idx;
    const r = ws.getRow(rowNum);
    r.height = 19;

    const p0 = pair[0];
    const p1 = pair[1];
    if (!p0 || !p1) return;

    // Col A: Label 1
    const l1 = r.getCell(1);
    l1.value = p0.label;
    l1.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };

    // Col B-E: Val 1
    ws.mergeCells(`B${rowNum}:E${rowNum}`);
    const v1 = r.getCell(2);
    v1.value = p0.val;
    v1.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };

    // Col F: Label 2
    const l2 = r.getCell(6);
    l2.value = p1.label;
    l2.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };

    // Col G-J: Val 2
    ws.mergeCells(`G${rowNum}:J${rowNum}`);
    const v2 = r.getCell(7);
    v2.value = p1.val;
    v2.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
  });

  // ── ROW 7: Empty ──
  ws.getRow(6).height = 6;

  // ── ROW 7: Monthly Summary Section Header (Merged A7:O7) ──
  ws.mergeCells("A7:O7");
  const sumHeader = ws.getCell("A7");
  sumHeader.value = "MONTHLY OPERATIONAL & BILLING SUMMARY";
  sumHeader.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1E293B" } };
  sumHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_SECTION_BG } };
  sumHeader.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  ws.getRow(7).height = 22;
  for (let c = 1; c <= 15; c++) ws.getRow(7).getCell(c).border = THIN_BORDER;

  // Compute aggregate statistics
  const totalAssignedStudentDays = dailyRows.reduce((acc, r) => acc + r.assignedStudents, 0);
  const totalLeaveStudentDays = dailyRows.reduce((acc, r) => acc + r.studentsOnLeave, 0);
  const totalExpLunch = dailyRows.reduce((acc, r) => acc + r.expectedLunch, 0);
  const totalFinalLunch = dailyRows.reduce((acc, r) => acc + r.finalLunch, 0);
  const totalExpDinner = dailyRows.reduce((acc, r) => acc + r.expectedDinner, 0);
  const totalFinalDinner = dailyRows.reduce((acc, r) => acc + r.finalDinner, 0);
  const grandTotalTiffins = totalFinalLunch + totalFinalDinner;

  const applicableStudents = billingRows.length;
  const monthlyRatePerStudent = 2300;
  const lunchCostShare = applicableStudents * 1150;
  const dinnerCostShare = applicableStudents * 1150;
  const totalMonthlyPackageAmount = applicableStudents * monthlyRatePerStudent;

  // ── ROW 8-15: Summary Key Figures ──
  const summaryCards = [
    {
      c1Label: "Total Students Assigned:",
      c1Val: applicableStudents,
      c2Label: "Applicable Monthly Students:",
      c2Val: applicableStudents,
    },
    {
      c1Label: "Total Student-Days:",
      c1Val: totalAssignedStudentDays,
      c2Label: "Monthly Package Rate / Student:",
      c2Val: `₹${monthlyRatePerStudent.toLocaleString("en-IN")}`,
    },
    {
      c1Label: "Total Leave Student-Days:",
      c1Val: totalLeaveStudentDays,
      c2Label: "Lunch Cost Share (₹1,150 / std):",
      c2Val: `₹${lunchCostShare.toLocaleString("en-IN")}`,
    },
    {
      c1Label: "Total Expected Lunch:",
      c1Val: totalExpLunch,
      c2Label: "Dinner Cost Share (₹1,150 / std):",
      c2Val: `₹${dinnerCostShare.toLocaleString("en-IN")}`,
    },
    {
      c1Label: "Grand Total Lunch Tiffins:",
      c1Val: totalFinalLunch,
      c2Label: "TOTAL MONTHLY PACKAGE AMOUNT:",
      c2Val: `₹${totalMonthlyPackageAmount.toLocaleString("en-IN")}`,
      highlight2: true,
    },
    {
      c1Label: "Total Expected Dinner:",
      c1Val: totalExpDinner,
      c2Label: "Billing Package Distinction:",
      c2Val: "Operational count separate from ₹2,300 package",
    },
    {
      c1Label: "Grand Total Dinner Tiffins:",
      c1Val: totalFinalDinner,
      c2Label: "Package Breakdown:",
      c2Val: "₹1,150 Lunch + ₹1,150 Dinner = ₹2,300",
    },
    {
      c1Label: "GRAND TOTAL OPERATIONAL TIFFINS:",
      c1Val: grandTotalTiffins,
      c2Label: "Note:",
      c2Val: "Do NOT multiply daily tiffins by ₹2,300",
      highlight1: true,
    },
  ];

  summaryCards.forEach((card, idx) => {
    const rowNum = 8 + idx;
    const r = ws.getRow(rowNum);
    r.height = 19;

    // Col A-C: Label 1
    ws.mergeCells(`A${rowNum}:C${rowNum}`);
    const l1 = r.getCell(1);
    l1.value = card.c1Label;
    l1.font = { name: "Calibri", size: 10, bold: card.highlight1 || false, color: { argb: "FF334155" } };
    l1.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    l1.border = THIN_BORDER;

    // Col D-E: Val 1
    ws.mergeCells(`D${rowNum}:E${rowNum}`);
    const v1 = r.getCell(4);
    v1.value = card.c1Val;
    v1.font = { name: "Calibri", size: 10, bold: true, color: { argb: card.highlight1 ? "FF9A3412" : "FF0F172A" } };
    v1.alignment = { horizontal: "center", vertical: "middle" };
    v1.border = THIN_BORDER;
    if (card.highlight1) {
      v1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    }

    // Col G-I: Label 2
    ws.mergeCells(`G${rowNum}:I${rowNum}`);
    const l2 = r.getCell(7);
    l2.value = card.c2Label;
    l2.font = { name: "Calibri", size: 10, bold: card.highlight2 || false, color: { argb: "FF334155" } };
    l2.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    l2.border = THIN_BORDER;

    // Col J-L: Val 2
    ws.mergeCells(`J${rowNum}:L${rowNum}`);
    const v2 = r.getCell(10);
    v2.value = card.c2Val;
    v2.font = { name: "Calibri", size: 10, bold: true, color: { argb: card.highlight2 ? "FF166534" : "FF0F172A" } };
    v2.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    v2.border = THIN_BORDER;
    if (card.highlight2) {
      v2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } }; // Light emerald
    }
  });

  // ── ROW 16-24: Notice / Spacing ──
  ws.getRow(16).height = 10;

  // ── ROW 25: Table Section Header (Merged A25:O25) ──
  ws.mergeCells("A25:O25");
  const tblSection = ws.getCell("A25");
  tblSection.value = "DAILY TIFFIN SUMMARY";
  tblSection.font = { name: "Calibri", size: 12, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
  tblSection.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  tblSection.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  ws.getRow(25).height = 24;
  for (let c = 1; c <= 15; c++) ws.getRow(25).getCell(c).border = THIN_BORDER;

  // ── ROW 26: Main Table Headers ──
  const headers = [
    "Sr. No.",
    "Date",
    "Day",
    "Assigned Students",
    "Students On Leave",
    "Expected Lunch",
    "Lunch Adjustment",
    "Final Lunch",
    "Expected Dinner",
    "Dinner Adjustment",
    "Final Dinner",
    "Total Daily Tiffins",
    "Lunch Status",
    "Dinner Status",
    "Remarks",
  ];

  const headerRow = ws.getRow(26);
  headerRow.height = 26;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  // ── Data Rows (Row 27 onwards) ──
  let currentRow = 27;
  const startDataRow = currentRow;

  dailyRows.forEach((r) => {
    const row = ws.getRow(currentRow);
    row.height = 20;

    row.getCell(1).value = r.srNo;
    row.getCell(2).value = r.dateFormatted;
    row.getCell(3).value = r.dayName;
    row.getCell(4).value = r.assignedStudents;
    row.getCell(5).value = r.studentsOnLeave;
    row.getCell(6).value = r.expectedLunch;
    row.getCell(7).value = r.lunchAdjustment;
    row.getCell(8).value = r.finalLunch;
    row.getCell(9).value = r.expectedDinner;
    row.getCell(10).value = r.dinnerAdjustment;
    row.getCell(11).value = r.finalDinner;
    row.getCell(12).value = r.totalDailyTiffins;
    row.getCell(13).value = r.lunchStatus;
    row.getCell(14).value = r.dinnerStatus;
    row.getCell(15).value = r.reason;

    // Formatting & Alignments
    for (let col = 1; col <= 15; col++) {
      const cell = row.getCell(col);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };

      if (col === 1 || col === 2 || col === 13 || col === 14) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (col === 3 || col === 15) {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      } else {
        cell.alignment = { horizontal: "right", vertical: "middle" };
      }
    }

    // Highlight Mess OFF / Holidays
    if (r.lunchStatus === "OFF" || r.dinnerStatus === "OFF" || r.messStatus !== "OPEN") {
      for (let col = 1; col <= 15; col++) {
        row.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFF1F2" }, // Very soft red/rose
        };
      }
    } else if (currentRow % 2 === 1) {
      for (let col = 1; col <= 15; col++) {
        row.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFAFAFA" },
        };
      }
    }

    currentRow++;
  });

  const endDataRow = currentRow - 1;

  // ── ROW: MONTH TOTAL ──
  const totalRow = ws.getRow(currentRow);
  totalRow.height = 24;

  totalRow.getCell(1).value = "";
  totalRow.getCell(2).value = "MONTH TOTAL";
  totalRow.getCell(3).value = "";

  // Formulas for totals
  totalRow.getCell(4).value = { formula: `SUM(D${startDataRow}:D${endDataRow})` };
  totalRow.getCell(5).value = { formula: `SUM(E${startDataRow}:E${endDataRow})` };
  totalRow.getCell(6).value = { formula: `SUM(F${startDataRow}:F${endDataRow})` };
  totalRow.getCell(7).value = { formula: `SUM(G${startDataRow}:G${endDataRow})` };
  totalRow.getCell(8).value = { formula: `SUM(H${startDataRow}:H${endDataRow})` };
  totalRow.getCell(9).value = { formula: `SUM(I${startDataRow}:I${endDataRow})` };
  totalRow.getCell(10).value = { formula: `SUM(J${startDataRow}:J${endDataRow})` };
  totalRow.getCell(11).value = { formula: `SUM(K${startDataRow}:K${endDataRow})` };
  totalRow.getCell(12).value = { formula: `SUM(L${startDataRow}:L${endDataRow})` };
  totalRow.getCell(13).value = "";
  totalRow.getCell(14).value = "";
  totalRow.getCell(15).value = "";

  for (let c = 1; c <= 15; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
    cell.border = DOUBLE_BOTTOM_BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    if (c >= 4 && c <= 12) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  // Auto-filter
  if (dailyRows.length > 0) {
    ws.autoFilter = {
      from: { row: 26, column: 1 },
      to: { row: endDataRow, column: 15 },
    };
  }
}

// ── SHEET 2: Daily Tiffin Record ──────────────────────────────────────────────

function buildDailyTiffinRecordSheet(
  wb: ExcelJS.Workbook,
  dailyRows: DailyTiffinComputedRow[]
): void {
  const ws = wb.addWorksheet("Daily Tiffin Record", {
    views: [{ state: "frozen", ySplit: 3, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
      printTitlesRow: "3:3",
    },
  });

  const columns = [
    "Sr. No.",
    "Date",
    "Day",
    "Mess Name",
    "Assigned Students",
    "Students On Leave",
    "Expected Lunch",
    "Lunch Adjustment",
    "Final Lunch",
    "Expected Dinner",
    "Dinner Adjustment",
    "Final Dinner",
    "Total Daily Tiffins",
    "Lunch Status",
    "Dinner Status",
    "Mess Status",
    "Reason",
    "Updated By",
    "Updated At",
  ];

  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "date", width: 13 },
    { key: "day", width: 13 },
    { key: "messName", width: 22 },
    { key: "assigned", width: 16 },
    { key: "leave", width: 16 },
    { key: "expLunch", width: 15 },
    { key: "lunchAdj", width: 16 },
    { key: "finalLunch", width: 15 },
    { key: "expDinner", width: 15 },
    { key: "dinnerAdj", width: 16 },
    { key: "finalDinner", width: 15 },
    { key: "totalTiffins", width: 18 },
    { key: "lunchStatus", width: 13 },
    { key: "dinnerStatus", width: 13 },
    { key: "messStatus", width: 16 },
    { key: "reason", width: 22 },
    { key: "updatedBy", width: 16 },
    { key: "updatedAt", width: 15 },
  ];

  // Header banner (Merged A1:S1)
  ws.mergeCells("A1:S1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - DAILY TIFFIN RECORD";
  title.font = { name: "Calibri", size: 15, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 30;
  for (let c = 1; c <= 19; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  ws.getRow(2).height = 6;

  // Table header
  const headerRow = ws.getRow(3);
  headerRow.height = 24;
  columns.forEach((col, i) => {
    const c = headerRow.getCell(i + 1);
    c.value = col;
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    c.border = THIN_BORDER;
  });

  let rowNum = 4;
  const startRow = rowNum;

  dailyRows.forEach((r) => {
    const row = ws.getRow(rowNum);
    row.height = 20;

    row.getCell(1).value = r.srNo;
    row.getCell(2).value = r.dateFormatted;
    row.getCell(3).value = r.dayName;
    row.getCell(4).value = r.messName;
    row.getCell(5).value = r.assignedStudents;
    row.getCell(6).value = r.studentsOnLeave;
    row.getCell(7).value = r.expectedLunch;
    row.getCell(8).value = r.lunchAdjustment;
    row.getCell(9).value = r.finalLunch;
    row.getCell(10).value = r.expectedDinner;
    row.getCell(11).value = r.dinnerAdjustment;
    row.getCell(12).value = r.finalDinner;
    row.getCell(13).value = r.totalDailyTiffins;
    row.getCell(14).value = r.lunchStatus;
    row.getCell(15).value = r.dinnerStatus;
    row.getCell(16).value = r.messStatus;
    row.getCell(17).value = r.reason;
    row.getCell(18).value = r.updatedBy;
    row.getCell(19).value = r.updatedAtFormatted;

    for (let c = 1; c <= 19; c++) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };
      if (c === 1 || c === 2 || c === 14 || c === 15 || c === 16 || c === 19) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (c === 3 || c === 4 || c === 17 || c === 18) {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      } else {
        cell.alignment = { horizontal: "right", vertical: "middle" };
      }
    }

    if (rowNum % 2 === 1) {
      for (let c = 1; c <= 19; c++) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } };
      }
    }

    rowNum++;
  });

  const endRow = rowNum - 1;

  // Total Row
  const totalRow = ws.getRow(rowNum);
  totalRow.height = 24;
  totalRow.getCell(2).value = "MONTH TOTAL";
  totalRow.getCell(5).value = { formula: `SUM(E${startRow}:E${endRow})` };
  totalRow.getCell(6).value = { formula: `SUM(F${startRow}:F${endRow})` };
  totalRow.getCell(7).value = { formula: `SUM(G${startRow}:G${endRow})` };
  totalRow.getCell(8).value = { formula: `SUM(H${startRow}:H${endRow})` };
  totalRow.getCell(9).value = { formula: `SUM(I${startRow}:I${endRow})` };
  totalRow.getCell(10).value = { formula: `SUM(J${startRow}:J${endRow})` };
  totalRow.getCell(11).value = { formula: `SUM(K${startRow}:K${endRow})` };
  totalRow.getCell(12).value = { formula: `SUM(L${startRow}:L${endRow})` };
  totalRow.getCell(13).value = { formula: `SUM(M${startRow}:M${endRow})` };

  for (let c = 1; c <= 19; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 10, bold: true };
    cell.border = DOUBLE_BOTTOM_BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    if (c >= 5 && c <= 13) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  if (dailyRows.length > 0) {
    ws.autoFilter = {
      from: { row: 3, column: 1 },
      to: { row: endRow, column: 19 },
    };
  }
}

// ── SHEET 3: Student Leave Record ─────────────────────────────────────────────

function buildStudentLeaveRecordSheet(
  wb: ExcelJS.Workbook,
  mess: Mess | "all",
  leaveRecords: {
    srNo: number;
    date: string;
    studentName: string;
    studentId: string;
    studentMobile: string;
    assignedMess: string;
    leaveStartDate: string;
    leaveEndDate: string;
    leaveStatus: string;
    lunchReduced: number;
    dinnerReduced: number;
    totalReduced: number;
  }[],
  month: number,
  year: number
): void {
  const ws = wb.addWorksheet("Student Leave Record", {
    views: [{ state: "frozen", ySplit: 6, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
      printTitlesRow: "6:6",
    },
  });

  const columns = [
    "Sr. No.",
    "Date",
    "Student Name",
    "Student ID",
    "Student Mobile",
    "Assigned Mess",
    "Leave Start Date",
    "Leave End Date",
    "Leave Status",
    "Lunch Reduced",
    "Dinner Reduced",
    "Total Tiffins Reduced",
  ];

  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "date", width: 14 },
    { key: "studentName", width: 26 },
    { key: "studentId", width: 18 },
    { key: "studentMobile", width: 18 },
    { key: "messName", width: 22 },
    { key: "start", width: 16 },
    { key: "end", width: 16 },
    { key: "status", width: 14 },
    { key: "lunchRed", width: 15 },
    { key: "dinnerRed", width: 15 },
    { key: "totalRed", width: 20 },
  ];

  // Header Banner
  ws.mergeCells("A1:L1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - STUDENT LEAVE TIFFIN ADJUSTMENT";
  title.font = { name: "Calibri", size: 15, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 28;
  for (let c = 1; c <= 12; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  // Metadata block
  const messName = mess === "all" ? "All Messes" : mess.messName;
  const monthName = MONTH_NAMES[month - 1];
  const meta = [
    { label: "Mess Name:", val: messName, label2: "Month / Year:", val2: `${monthName} ${year}` },
    { label: "Export Date:", val: formatToDDMMYYYY(todayDateString()), label2: "Total Leave Records:", val2: leaveRecords.length },
  ];

  meta.forEach((m, idx) => {
    const rowNum = 3 + idx;
    const r = ws.getRow(rowNum);
    r.height = 18;

    r.getCell(1).value = m.label;
    r.getCell(1).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
    ws.mergeCells(`B${rowNum}:D${rowNum}`);
    r.getCell(2).value = m.val;
    r.getCell(2).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };

    r.getCell(5).value = m.label2;
    r.getCell(5).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
    ws.mergeCells(`F${rowNum}:H${rowNum}`);
    r.getCell(6).value = m.val2;
    r.getCell(6).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
  });

  ws.getRow(5).height = 6;

  // Table header
  const headerRow = ws.getRow(6);
  headerRow.height = 24;
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  let rowNum = 7;
  const startRow = rowNum;

  leaveRecords.forEach((lr) => {
    const row = ws.getRow(rowNum);
    row.height = 20;

    row.getCell(1).value = lr.srNo;
    row.getCell(2).value = lr.date;
    row.getCell(3).value = lr.studentName;
    row.getCell(4).value = lr.studentId;
    row.getCell(5).value = lr.studentMobile;
    row.getCell(5).numFmt = "@";
    row.getCell(6).value = lr.assignedMess;
    row.getCell(7).value = lr.leaveStartDate;
    row.getCell(8).value = lr.leaveEndDate;
    row.getCell(9).value = lr.leaveStatus;
    row.getCell(10).value = lr.lunchReduced;
    row.getCell(11).value = lr.dinnerReduced;
    row.getCell(12).value = lr.totalReduced;

    for (let c = 1; c <= 12; c++) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };
      if (c === 1 || c === 2 || c === 7 || c === 8 || c === 9) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (c >= 10 && c <= 12) {
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      }
    }

    if (rowNum % 2 === 1) {
      for (let c = 1; c <= 12; c++) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } };
      }
    }

    rowNum++;
  });

  const endRow = Math.max(startRow, rowNum - 1);

  // Total row
  const totalRow = ws.getRow(rowNum);
  totalRow.height = 24;
  totalRow.getCell(2).value = "TOTAL LEAVE REDUCTIONS";
  if (leaveRecords.length > 0) {
    totalRow.getCell(10).value = { formula: `SUM(J${startRow}:J${endRow})` };
    totalRow.getCell(11).value = { formula: `SUM(K${startRow}:K${endRow})` };
    totalRow.getCell(12).value = { formula: `SUM(L${startRow}:L${endRow})` };
  } else {
    totalRow.getCell(10).value = 0;
    totalRow.getCell(11).value = 0;
    totalRow.getCell(12).value = 0;
  }

  for (let c = 1; c <= 12; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 10, bold: true };
    cell.border = DOUBLE_BOTTOM_BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    if (c >= 10 && c <= 12) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  if (leaveRecords.length > 0) {
    ws.autoFilter = {
      from: { row: 6, column: 1 },
      to: { row: endRow, column: 12 },
    };
  }
}

// ── SHEET 4: Student Monthly Billing ──────────────────────────────────────────

function buildStudentMonthlyBillingSheet(
  wb: ExcelJS.Workbook,
  billingRows: StudentBillingComputedRow[],
  month: number,
  year: number
): void {
  const ws = wb.addWorksheet("Student Monthly Billing", {
    views: [{ state: "frozen", ySplit: 5, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
      printTitlesRow: "5:5",
    },
  });

  const columns = [
    "Sr. No.",
    "Student Name",
    "Student ID",
    "Student Mobile",
    "Mess Name",
    "Admission Date",
    "End Date",
    "Leave Days",
    "Applicable Days",
    "Monthly Rate",
    "Lunch Share",
    "Dinner Share",
    "Total Amount",
    "Billing Status",
  ];

  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "studentName", width: 26 },
    { key: "studentId", width: 18 },
    { key: "studentMobile", width: 18 },
    { key: "messName", width: 22 },
    { key: "admDate", width: 15 },
    { key: "endDate", width: 15 },
    { key: "leaveDays", width: 13 },
    { key: "appDays", width: 15 },
    { key: "monthlyRate", width: 15 },
    { key: "lunchShare", width: 15 },
    { key: "dinnerShare", width: 15 },
    { key: "totalAmount", width: 16 },
    { key: "billingStatus", width: 18 },
  ];

  // Header banner
  ws.mergeCells("A1:N1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - STUDENT MONTHLY BILLING";
  title.font = { name: "Calibri", size: 15, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 28;
  for (let c = 1; c <= 14; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  // Metadata & Rules
  const monthName = MONTH_NAMES[month - 1];
  ws.mergeCells("A3:N3");
  const sub = ws.getCell("A3");
  sub.value = `Billing Month: ${monthName} ${year}  |  Package Rate: ₹2,300/student (Lunch Share: ₹1,150 + Dinner Share: ₹1,150)  |  Export Date: ${formatToDDMMYYYY(todayDateString())}`;
  sub.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
  sub.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(3).height = 20;

  ws.getRow(4).height = 6;

  // Table header
  const headerRow = ws.getRow(5);
  headerRow.height = 24;
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  let rowNum = 6;
  const startRow = rowNum;

  billingRows.forEach((br) => {
    const row = ws.getRow(rowNum);
    row.height = 20;

    row.getCell(1).value = br.srNo;
    row.getCell(2).value = br.studentName;
    row.getCell(3).value = br.studentId;
    row.getCell(4).value = br.studentMobile;
    row.getCell(4).numFmt = "@";
    row.getCell(5).value = br.messName;
    row.getCell(6).value = br.admissionDateFormatted;
    row.getCell(7).value = br.endDateFormatted;
    row.getCell(8).value = br.leaveDays;
    row.getCell(9).value = br.applicableDays;

    // Currency values
    const cRate = row.getCell(10);
    cRate.value = br.monthlyRate;
    cRate.numFmt = "₹#,##0";

    const cLunch = row.getCell(11);
    cLunch.value = br.lunchShare;
    cLunch.numFmt = "₹#,##0";

    const cDinner = row.getCell(12);
    cDinner.value = br.dinnerShare;
    cDinner.numFmt = "₹#,##0";

    const cTotal = row.getCell(13);
    cTotal.value = { formula: `K${rowNum}+L${rowNum}` };
    cTotal.numFmt = "₹#,##0";

    row.getCell(14).value = br.billingStatus;

    for (let c = 1; c <= 14; c++) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };
      if (c === 1 || c === 6 || c === 7) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (c >= 8 && c <= 13) {
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      }
    }

    if (rowNum % 2 === 1) {
      for (let c = 1; c <= 14; c++) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } };
      }
    }

    rowNum++;
  });

  const endRow = Math.max(startRow, rowNum - 1);

  // Billing Total Row
  const totalRow = ws.getRow(rowNum);
  totalRow.height = 24;
  totalRow.getCell(2).value = "BILLING TOTAL";
  totalRow.getCell(9).value = billingRows.length; // Total students count
  if (billingRows.length > 0) {
    totalRow.getCell(11).value = { formula: `SUM(K${startRow}:K${endRow})` };
    totalRow.getCell(11).numFmt = "₹#,##0";
    totalRow.getCell(12).value = { formula: `SUM(L${startRow}:L${endRow})` };
    totalRow.getCell(12).numFmt = "₹#,##0";
    totalRow.getCell(13).value = { formula: `SUM(M${startRow}:M${endRow})` };
    totalRow.getCell(13).numFmt = "₹#,##0";
  } else {
    totalRow.getCell(11).value = 0;
    totalRow.getCell(12).value = 0;
    totalRow.getCell(13).value = 0;
  }

  for (let c = 1; c <= 14; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 10, bold: true };
    cell.border = DOUBLE_BOTTOM_BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    if (c >= 8 && c <= 13) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  if (billingRows.length > 0) {
    ws.autoFilter = {
      from: { row: 5, column: 1 },
      to: { row: endRow, column: 14 },
    };
  }
}

// ── SHEET 5: Mess Summary ─────────────────────────────────────────────────────

function buildMessSummarySheet(
  wb: ExcelJS.Workbook,
  messes: Mess[],
  dailyRows: DailyTiffinComputedRow[],
  billingRows: StudentBillingComputedRow[],
  month: number,
  year: number
): void {
  const ws = wb.addWorksheet("Mess Summary", {
    views: [{ state: "frozen", ySplit: 5, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
      printTitlesRow: "5:5",
    },
  });

  const columns = [
    "Sr. No.",
    "Mess Name",
    "Mess Owner",
    "Mess Owner Phone",
    "Total Students",
    "Total Student-Days",
    "Total Leave Student-Days",
    "Total Lunch Tiffins",
    "Total Dinner Tiffins",
    "Grand Total Tiffins",
    "Applicable Monthly Students",
    "Monthly Rate",
    "Lunch Amount",
    "Dinner Amount",
    "Total Monthly Amount",
  ];

  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "messName", width: 24 },
    { key: "ownerName", width: 22 },
    { key: "ownerPhone", width: 18 },
    { key: "totalStudents", width: 15 },
    { key: "studentDays", width: 18 },
    { key: "leaveDays", width: 22 },
    { key: "lunchTiffins", width: 18 },
    { key: "dinnerTiffins", width: 18 },
    { key: "grandTiffins", width: 18 },
    { key: "appStudents", width: 24 },
    { key: "rate", width: 15 },
    { key: "lunchAmt", width: 16 },
    { key: "dinnerAmt", width: 16 },
    { key: "totalAmt", width: 20 },
  ];

  // Header Banner
  ws.mergeCells("A1:O1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - MESS REGISTER SUMMARY";
  title.font = { name: "Calibri", size: 15, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 28;
  for (let c = 1; c <= 15; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  // Subheader
  const monthName = MONTH_NAMES[month - 1];
  ws.mergeCells("A3:O3");
  const sub = ws.getCell("A3");
  sub.value = `Month: ${monthName} ${year}  |  Export Date: ${formatToDDMMYYYY(todayDateString())}  |  Billing: ₹2,300 / Monthly Student (Lunch: ₹1,150 + Dinner: ₹1,150)`;
  sub.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
  sub.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(3).height = 20;

  ws.getRow(4).height = 6;

  // Table header
  const headerRow = ws.getRow(5);
  headerRow.height = 26;
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  let rowNum = 6;
  const startRow = rowNum;

  messes.forEach((m, idx) => {
    const row = ws.getRow(rowNum);
    row.height = 22;

    const mDaily = dailyRows.filter((dr) => dr.messName === m.messName);
    const mBilling = billingRows.filter((br) => br.messName === m.messName);

    const sCount = mBilling.length;
    const sDays = mDaily.reduce((acc, r) => acc + r.assignedStudents, 0);
    const lDays = mDaily.reduce((acc, r) => acc + r.studentsOnLeave, 0);
    const lTiffins = mDaily.reduce((acc, r) => acc + r.finalLunch, 0);
    const dTiffins = mDaily.reduce((acc, r) => acc + r.finalDinner, 0);
    const totalTiffins = lTiffins + dTiffins;

    const rate = 2300;
    const lunchAmt = sCount * 1150;
    const dinnerAmt = sCount * 1150;
    const totalAmt = sCount * rate;

    row.getCell(1).value = idx + 1;
    row.getCell(2).value = m.messName;
    row.getCell(3).value = m.ownerName || "N/A";
    row.getCell(4).value = m.ownerPhone || "N/A";
    row.getCell(4).numFmt = "@";
    row.getCell(5).value = sCount;
    row.getCell(6).value = sDays;
    row.getCell(7).value = lDays;
    row.getCell(8).value = lTiffins;
    row.getCell(9).value = dTiffins;
    row.getCell(10).value = totalTiffins;
    row.getCell(11).value = sCount;

    const cRate = row.getCell(12);
    cRate.value = rate;
    cRate.numFmt = "₹#,##0";

    const cLunchAmt = row.getCell(13);
    cLunchAmt.value = lunchAmt;
    cLunchAmt.numFmt = "₹#,##0";

    const cDinnerAmt = row.getCell(14);
    cDinnerAmt.value = dinnerAmt;
    cDinnerAmt.numFmt = "₹#,##0";

    const cTotalAmt = row.getCell(15);
    cTotalAmt.value = totalAmt;
    cTotalAmt.numFmt = "₹#,##0";

    for (let c = 1; c <= 15; c++) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };
      if (c === 1 || c === 4) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (c >= 5 && c <= 15) {
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      }
    }

    if (rowNum % 2 === 1) {
      for (let c = 1; c <= 15; c++) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } };
      }
    }

    rowNum++;
  });

  const endRow = Math.max(startRow, rowNum - 1);

  // Consolidated Total Row
  const totalRow = ws.getRow(rowNum);
  totalRow.height = 24;
  totalRow.getCell(2).value = "GRAND TOTAL";

  totalRow.getCell(5).value = { formula: `SUM(E${startRow}:E${endRow})` };
  totalRow.getCell(6).value = { formula: `SUM(F${startRow}:F${endRow})` };
  totalRow.getCell(7).value = { formula: `SUM(G${startRow}:G${endRow})` };
  totalRow.getCell(8).value = { formula: `SUM(H${startRow}:H${endRow})` };
  totalRow.getCell(9).value = { formula: `SUM(I${startRow}:I${endRow})` };
  totalRow.getCell(10).value = { formula: `SUM(J${startRow}:J${endRow})` };
  totalRow.getCell(11).value = { formula: `SUM(K${startRow}:K${endRow})` };

  const tLunchAmt = totalRow.getCell(13);
  tLunchAmt.value = { formula: `SUM(M${startRow}:M${endRow})` };
  tLunchAmt.numFmt = "₹#,##0";

  const tDinnerAmt = totalRow.getCell(14);
  tDinnerAmt.value = { formula: `SUM(N${startRow}:N${endRow})` };
  tDinnerAmt.numFmt = "₹#,##0";

  const tTotalAmt = totalRow.getCell(15);
  tTotalAmt.value = { formula: `SUM(O${startRow}:O${endRow})` };
  tTotalAmt.numFmt = "₹#,##0";

  for (let c = 1; c <= 15; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 10, bold: true };
    cell.border = DOUBLE_BOTTOM_BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TOTAL_BG } };
    if (c >= 5 && c <= 15) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  if (messes.length > 0) {
    ws.autoFilter = {
      from: { row: 5, column: 1 },
      to: { row: endRow, column: 15 },
    };
  }
}

// ── SHEET 6: Student Register ─────────────────────────────────────────────────

function buildStudentRegisterSheet(
  wb: ExcelJS.Workbook,
  mess: Mess | "all",
  messes: Mess[],
  admissions: Admission[],
  month: number,
  year: number
): void {
  const ws = wb.addWorksheet("Student Register", {
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

  const columns = [
    "Sr. No.",
    "Student Name",
    "Student Mobile No.",
    "Student ID",
    "Owner Name",
    "Owner Mobile No.",
    "Mess Name",
    "Mess Joining Date",
    "Veg / Non-Veg",
    "Room",
    "Admission Status",
    "Mess Status",
  ];

  ws.columns = [
    { key: "srNo", width: 8 },
    { key: "studentName", width: 26 },
    { key: "studentMobile", width: 18 },
    { key: "studentId", width: 18 },
    { key: "ownerName", width: 22 },
    { key: "ownerMobile", width: 18 },
    { key: "messName", width: 22 },
    { key: "joiningDate", width: 18 },
    { key: "vegNonVeg", width: 15 },
    { key: "room", width: 14 },
    { key: "admStatus", width: 16 },
    { key: "messStatus", width: 15 },
  ];

  // Title Banner
  ws.mergeCells("A1:L1");
  const title = ws.getCell("A1");
  title.value = "NIVASI SPACE - MESS STUDENT REGISTER";
  title.font = { name: "Calibri", size: 16, bold: true, color: { argb: COLOR_HEADER_TEXT } };
  title.alignment = { horizontal: "center", vertical: "middle" };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
  ws.getRow(1).height = 28;
  for (let c = 1; c <= 12; c++) ws.getRow(1).getCell(c).border = THIN_BORDER;

  ws.getRow(2).height = 8;

  const isAll = mess === "all";
  const messName = isAll ? "All Messes" : mess.messName;
  const ownerName = isAll ? "Various" : (mess.ownerName || "N/A");
  const ownerMobile = isAll ? "Various" : (mess.ownerPhone || "N/A");
  const monthName = MONTH_NAMES[month - 1];

  // Filter students
  const filteredStudents = isAll
    ? admissions.filter((a) => Boolean((a as any).messId))
    : admissions.filter((a) => (a as any).messId === mess.id);

  // Sort by Joining Date, then Name
  filteredStudents.sort((a, b) => {
    const da = getStudentMessJoiningDate(a);
    const db = getStudentMessJoiningDate(b);
    const cmp = da.localeCompare(db);
    if (cmp !== 0) return cmp;
    return (a.fullName || "").localeCompare(b.fullName || "");
  });

  const vegCount = filteredStudents.filter((s) => resolveVegNonVeg(s) === "Veg").length;
  const nonVegCount = filteredStudents.filter((s) => resolveVegNonVeg(s) === "Non-Veg").length;

  const validDates = filteredStudents
    .map((s) => getStudentMessJoiningDate(s))
    .filter(Boolean)
    .sort();
  const firstJoining = validDates[0] ? formatToDDMMYYYY(validDates[0]) : "N/A";
  const latestJoining = validDates[validDates.length - 1] ? formatToDDMMYYYY(validDates[validDates.length - 1]) : "N/A";

  const metaRows = [
    { l1: "Mess Name:", v1: messName, l2: "Month:", v2: `${monthName} ${year}` },
    { l1: "Mess Owner:", v2: formatToDDMMYYYY(todayDateString()), l2: "Export Date:", v1: ownerName },
    { l1: "Owner Mobile:", v1: ownerMobile, l2: "Total Students:", v2: filteredStudents.length },
  ];

  metaRows.forEach((m, idx) => {
    const rowNum = 3 + idx;
    const r = ws.getRow(rowNum);
    r.height = 18;

    r.getCell(1).value = m.l1;
    r.getCell(1).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
    ws.mergeCells(`B${rowNum}:D${rowNum}`);
    r.getCell(2).value = m.v1;
    r.getCell(2).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };

    r.getCell(5).value = m.l2;
    r.getCell(5).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
    ws.mergeCells(`F${rowNum}:H${rowNum}`);
    r.getCell(6).value = m.v2;
    r.getCell(6).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
  });

  // Summary row block (Rows 7-13)
  ws.mergeCells("A7:L7");
  const sTitle = ws.getCell("A7");
  sTitle.value = "REGISTER SUMMARY";
  sTitle.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1E293B" } };
  sTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_SECTION_BG } };
  ws.getRow(7).height = 20;

  const sumItems = [
    { l: "Total Students:", v: filteredStudents.length, l2: "First Joining Date:", v2: firstJoining },
    { l: "Total Veg Students:", v: vegCount, l2: "Latest Joining Date:", v2: latestJoining },
    { l: "Total Non-Veg Students:", v: nonVegCount, l2: "Veg/Non-Veg Ratio:", v2: `${vegCount} Veg / ${nonVegCount} Non-Veg` },
  ];

  sumItems.forEach((si, idx) => {
    const rowNum = 8 + idx;
    const r = ws.getRow(rowNum);
    r.height = 18;

    r.getCell(1).value = si.l;
    r.getCell(1).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF64748B" } };
    ws.mergeCells(`B${rowNum}:D${rowNum}`);
    r.getCell(2).value = si.v;
    r.getCell(2).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };

    r.getCell(5).value = si.l2;
    r.getCell(5).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF64748B" } };
    ws.mergeCells(`F${rowNum}:H${rowNum}`);
    r.getCell(6).value = si.v2;
    r.getCell(6).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
  });

  ws.getRow(14).height = 10;

  // Table Column Headers (Row 15)
  const headerRow = ws.getRow(15);
  headerRow.height = 24;
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR_TABLE_HEADER_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_TABLE_HEADER_BG } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  let rowNum = 16;
  filteredStudents.forEach((s, idx) => {
    const row = ws.getRow(rowNum);
    row.height = 20;

    const studentMess = messes.find((m) => m.id === (s as any).messId) || (isAll ? null : (mess as Mess));
    const mOwner = studentMess?.ownerName || (isAll ? "N/A" : ownerName);
    const mOwnerPhone = studentMess?.ownerPhone || (isAll ? "N/A" : ownerMobile);
    const mName = studentMess?.messName || (s as any).messName || "N/A";
    const joiningDate = getStudentMessJoiningDate(s);

    row.getCell(1).value = idx + 1;
    row.getCell(2).value = s.fullName || "Student";
    row.getCell(3).value = s.phoneNumber || "N/A";
    row.getCell(3).numFmt = "@";
    row.getCell(4).value = s.admissionId || s.id;
    row.getCell(5).value = mOwner;
    row.getCell(6).value = mOwnerPhone;
    row.getCell(6).numFmt = "@";
    row.getCell(7).value = mName;
    row.getCell(8).value = formatToDDMMYYYY(joiningDate);
    row.getCell(9).value = resolveVegNonVeg(s);
    row.getCell(10).value = s.roomNumber ? `Room ${s.roomNumber}` : (s.propertyName || "N/A");
    row.getCell(11).value = s.paymentStatus === "completed" ? "Admitted" : "Active";
    row.getCell(12).value = (s as any).tiffinStatus || "active";

    for (let c = 1; c <= 12; c++) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { name: "Calibri", size: 10 };
      if (c === 1 || c === 3 || c === 6 || c === 8 || c === 9 || c === 11 || c === 12) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      }
    }

    if (rowNum % 2 === 1) {
      for (let c = 1; c <= 12; c++) {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } };
      }
    }

    rowNum++;
  });

  const endRow = Math.max(16, rowNum - 1);
  if (filteredStudents.length > 0) {
    ws.autoFilter = {
      from: { row: 15, column: 1 },
      to: { row: endRow, column: 12 },
    };
  }
}

// ── Main Export Function ──────────────────────────────────────────────────────

export async function exportMessMonthlyAccountingReport(
  opts: MonthlyMessExportOptions
): Promise<{ count: number; fileName: string }> {
  const {
    mess,
    allMesses = [],
    admissions,
    leaveRequests = [],
    dailyRecords = [],
    month,
    year,
  } = opts;

  const targetMesses: Mess[] =
    mess === "all" ? allMesses : [mess];

  const monthName = MONTH_NAMES[month - 1] || "Month";

  // 1. Calculate operational and billing metrics
  const { dailyRows, studentLeaveRecords, studentBillingRows } =
    computeDailyTiffinRecordsForMonth(
      targetMesses,
      admissions,
      leaveRequests,
      dailyRecords,
      year,
      month
    );

  // 2. Build ExcelJS Workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Nivasi Space Accounting";
  wb.created = new Date();

  // Sheet 1: Monthly Mess Report
  buildMonthlyMessReportSheet(
    wb,
    mess,
    targetMesses,
    dailyRows,
    studentBillingRows,
    month,
    year
  );

  // Sheet 2: Daily Tiffin Record
  buildDailyTiffinRecordSheet(wb, dailyRows);

  // Sheet 3: Student Leave Record
  buildStudentLeaveRecordSheet(wb, mess, studentLeaveRecords, month, year);

  // Sheet 4: Student Monthly Billing
  buildStudentMonthlyBillingSheet(wb, studentBillingRows, month, year);

  // Sheet 5: Mess Summary
  buildMessSummarySheet(
    wb,
    targetMesses,
    dailyRows,
    studentBillingRows,
    month,
    year
  );

  // Sheet 6: Student Register
  buildStudentRegisterSheet(
    wb,
    mess,
    targetMesses,
    admissions,
    month,
    year
  );

  // 3. Generate filename
  let fileName: string;
  if (mess === "all") {
    fileName = `NIVASI_SPACE_All_Mess_${monthName}_${year}.xlsx`;
  } else {
    const safeMessName = sanitizeFileName(mess.messName || "Mess");
    fileName = `NIVASI_SPACE_Mess_${safeMessName}_${monthName}_${year}.xlsx`;
  }

  // 4. Download
  const buffer = await wb.xlsx.writeBuffer();
  triggerDownload(buffer as ArrayBuffer, fileName);

  return { count: studentBillingRows.length, fileName };
}

// ── Legacy Compatibility Wrapper ─────────────────────────────────────────────

export async function exportMessStudentRegister(
  opts: LegacyMessExportOptions
): Promise<{ count: number; fileName: string }> {
  const d = new Date();
  const currentMonth = d.getMonth() + 1;
  const currentYear = d.getFullYear();

  return exportMessMonthlyAccountingReport({
    mess: opts.mess,
    allMesses: [opts.mess],
    admissions: opts.students,
    leaveRequests: [],
    dailyRecords: [],
    month: currentMonth,
    year: currentYear,
  });
}
