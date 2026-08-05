import jsPDF from "jspdf";
import type { Admission } from "./types";

/** Generates a styled fee receipt PDF and triggers browser download. */
export function downloadReceiptPDF(a: Admission): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210; // A4 width mm
  const margin = 16;
  const col = margin;
  let y = 0;

  /* ── helpers ── */
  const line  = (text: string, x: number, yPos: number, size = 10, style: "normal" | "bold" = "normal") => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.text(text, x, yPos);
  };
  const hLine = (yPos: number, lm = margin, rm = W - margin) => {
    doc.setDrawColor(220, 220, 220);
    doc.line(lm, yPos, rm, yPos);
  };
  const rect  = (x: number, yPos: number, w: number, h: number, fill: number[]) => {
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.roundedRect(x, yPos, w, h, 3, 3, "F");
  };

  /* ── Header band ── */
  rect(0, 0, W, 36, [245, 120, 30]);   // orange brand gradient approximation
  doc.setTextColor(255, 255, 255);
  line("NivasiSpace", col, 13, 22, "bold");
  line("Student Accommodation", col, 20, 10);
  line("FEE RECEIPT", W - margin - 42, 13, 18, "bold");
  line(`ID: ${a.admissionId}`, W - margin - 42, 20, 9);
  doc.setTextColor(40, 40, 40);
  y = 44;

  /* ── Admit date + status chip ── */
  const paid   = a.amountPaid;
  const total  = a.packageAmount;
  const bal    = Math.max(0, a.balanceAmount);
  const isPaid = a.paymentStatus === "completed";

  // status chip
  rect(W - margin - 30, y - 6, 30, 8, isPaid ? [34, 197, 94] : [249, 115, 22]);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(isPaid ? "PAID" : "PENDING", W - margin - 15, y - 0.5, { align: "center" });
  doc.setTextColor(40, 40, 40);

  line(`Date: ${a.admissionDate}`, col, y, 9);
  y += 10;

  hLine(y); y += 6;

  /* ── Two-column student / parent ── */
  const midX = W / 2 + 2;

  // Student
  line("STUDENT DETAILS", col, y, 8, "bold");
  doc.setTextColor(120, 120, 120);
  line("PARENT / GUARDIAN", midX, y, 8, "bold");
  doc.setTextColor(40, 40, 40);
  y += 5;

  const rows: [string, string][] = [
    [a.fullName,       (a as any).parentName     || "—"],
    [a.phoneNumber,    (a as any).parentPhone     || "—"],
    [a.email || "—",  (a as any).parentRelation  || "—"],
    [a.gender || "—", ""],
  ];

  const labels1 = ["Name", "Phone", "Email", "Gender"];
  const labels2 = ["Name", "Phone", "Relation", ""];

  rows.forEach(([left, right], i) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(labels1[i] + ":", col, y);
    if (labels2[i]) doc.text(labels2[i] + ":", midX, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(String(left).substring(0, 38), col + 18, y);
    if (right) doc.text(String(right).substring(0, 38), midX + 20, y);
    y += 5;
  });

  y += 2; hLine(y); y += 6;

  /* ── College + Stay ── */
  line("COLLEGE & STAY", col, y, 8, "bold"); y += 5;

  const infoRows: [string, string][] = [
    ["College",   a.collegeName || "—"],
    ["Course",    `${a.course || "—"}${a.year ? "  ·  " + a.year : ""}`],
    ["Property",  a.propertyName  || "—"],
    ["Room / Bed", `${a.roomNumber || "—"} / ${a.bedNumber || "—"}`],
    ["Move-in",   a.moveInDate    || "—"],
  ];

  infoRows.forEach(([label, val]) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(label + ":", col, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    // wrap long text
    const lines = doc.splitTextToSize(val, W - margin - col - 28);
    doc.text(lines, col + 28, y);
    y += 5 * (lines.length);
  });

  y += 2; hLine(y); y += 6;

  /* ── Package ── */
  line("PACKAGE DETAILS", col, y, 8, "bold"); y += 5;
  const pkgRows: [string, string][] = [
    ["Package",  a.packageName  || "—"],
    ["Services", a.packageServices.join(", ") || "—"],
    ["Period",   a.packageStartDate ? `${a.packageStartDate}  →  ${a.packageEndDate || "—"}` : "—"],
  ];
  pkgRows.forEach(([label, val]) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(label + ":", col, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(val, W - margin - col - 28);
    doc.text(lines, col + 28, y);
    y += 5 * lines.length;
  });

  y += 4; hLine(y); y += 6;

  /* ── Payment summary box ── */
  const boxH = 36;
  rect(col, y, W - 2 * margin, boxH, [250, 245, 255]);
  doc.setDrawColor(200, 190, 240);
  doc.roundedRect(col, y, W - 2 * margin, boxH, 3, 3, "S");

  const cy = y + 7;
  line("PAYMENT SUMMARY", col + 4, cy, 9, "bold");
  y += 13;

  // Three columns
  const colW = (W - 2 * margin) / 3;
  const cells = [
    { label: "Total Package", value: `₹${total.toLocaleString("en-IN")}` },
    { label: "Amount Paid",   value: `₹${paid.toLocaleString("en-IN")}`, highlight: true },
    { label: "Balance Due",   value: `₹${bal.toLocaleString("en-IN")}`,  warn: bal > 0 },
  ];

  cells.forEach((cell, i) => {
    const cx = col + i * colW + 4;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110, 110, 110);
    doc.text(cell.label, cx, y);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    if (cell.highlight)     doc.setTextColor(245, 120, 30);
    else if (cell.warn)     doc.setTextColor(220, 50, 50);
    else                    doc.setTextColor(40, 40, 40);
    doc.text(cell.value, cx, y + 7);
  });

  y += boxH - 14;
  doc.setTextColor(40, 40, 40);

  y += 6;

  /* ── Items provided ── */
  hLine(y); y += 6;
  line("PROVIDED ITEMS", col, y, 8, "bold"); y += 5;
  const items = [
    { label: "Bag",      ok: a.bagProvided },
    { label: "Tiffin",   ok: a.tiffinProvided },
    { label: "Mattress", ok: a.mattressRequired },
  ];
  let ix = col;
  items.forEach((item) => {
    const chipColor = item.ok ? [34, 197, 94] : [249, 115, 22];
    rect(ix, y - 4, 36, 7, chipColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.ok ? "✔" : "✘"} ${item.label}`, ix + 3, y + 0.5);
    doc.setTextColor(40, 40, 40);
    ix += 40;
  });
  y += 10;

  /* ── Notes ── */
  if (a.notes) {
    hLine(y); y += 5;
    line("Notes:", col, y, 8, "bold"); y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const noteLines = doc.splitTextToSize(a.notes, W - 2 * margin);
    doc.text(noteLines, col, y);
    y += 4 * noteLines.length + 2;
  }

  /* ── Footer ── */
  const footerY = 285;
  hLine(footerY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("NivasiSpace · Internal Admission Management System", col, footerY + 5);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, W - margin, footerY + 5, { align: "right" });

  /* ── Save ── */
  doc.save(`NivasiSpace_Receipt_${a.admissionId}.pdf`);
}
