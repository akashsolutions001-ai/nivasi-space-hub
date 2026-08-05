import { t as E } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt-pdf-BbqChljv.js
/** Generates a styled fee receipt PDF and triggers browser download. */
function downloadReceiptPDF(a) {
	const doc = new E({
		unit: "mm",
		format: "a4"
	});
	const W = 210;
	const margin = 16;
	const col = margin;
	let y = 0;
	const line = (text, x, yPos, size = 10, style = "normal") => {
		doc.setFontSize(size);
		doc.setFont("helvetica", style);
		doc.text(text, x, yPos);
	};
	const hLine = (yPos, lm = margin, rm = 194) => {
		doc.setDrawColor(220, 220, 220);
		doc.line(lm, yPos, rm, yPos);
	};
	const rect = (x, yPos, w, h, fill) => {
		doc.setFillColor(fill[0], fill[1], fill[2]);
		doc.roundedRect(x, yPos, w, h, 3, 3, "F");
	};
	rect(0, 0, W, 36, [
		245,
		120,
		30
	]);
	doc.setTextColor(255, 255, 255);
	line("NivasiSpace", col, 13, 22, "bold");
	line("Student Accommodation", col, 20, 10);
	line("FEE RECEIPT", 152, 13, 18, "bold");
	line(`ID: ${a.admissionId}`, 152, 20, 9);
	doc.setTextColor(40, 40, 40);
	y = 44;
	const paid = a.amountPaid;
	const total = a.packageAmount;
	const bal = Math.max(0, a.balanceAmount);
	const isPaid = a.paymentStatus === "completed";
	rect(164, y - 6, 30, 8, isPaid ? [
		34,
		197,
		94
	] : [
		249,
		115,
		22
	]);
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(8);
	doc.setFont("helvetica", "bold");
	doc.text(isPaid ? "PAID" : "PENDING", 179, y - .5, { align: "center" });
	doc.setTextColor(40, 40, 40);
	line(`Date: ${a.admissionDate}`, col, y, 9);
	y += 10;
	hLine(y);
	y += 6;
	const midX = 107;
	line("STUDENT DETAILS", col, y, 8, "bold");
	doc.setTextColor(120, 120, 120);
	line("PARENT / GUARDIAN", midX, y, 8, "bold");
	doc.setTextColor(40, 40, 40);
	y += 5;
	const rows = [
		[a.fullName, a.parentName || "—"],
		[a.phoneNumber, a.parentPhone || "—"],
		[a.email || "—", a.parentRelation || "—"],
		[a.gender || "—", ""]
	];
	const labels1 = [
		"Name",
		"Phone",
		"Email",
		"Gender"
	];
	const labels2 = [
		"Name",
		"Phone",
		"Relation",
		""
	];
	rows.forEach(([left, right], i) => {
		doc.setFontSize(8);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(100, 100, 100);
		doc.text(labels1[i] + ":", col, y);
		if (labels2[i]) doc.text(labels2[i] + ":", midX, y);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(30, 30, 30);
		doc.text(String(left).substring(0, 38), 34, y);
		if (right) doc.text(String(right).substring(0, 38), 127, y);
		y += 5;
	});
	y += 2;
	hLine(y);
	y += 6;
	line("COLLEGE & STAY", col, y, 8, "bold");
	y += 5;
	[
		["College", a.collegeName || "—"],
		["Course", `${a.course || "—"}${a.year ? "  ·  " + a.year : ""}`],
		["Property", a.propertyName || "—"],
		["Room / Bed", `${a.roomNumber || "—"} / ${a.bedNumber || "—"}`],
		["Move-in", a.moveInDate || "—"]
	].forEach(([label, val]) => {
		doc.setFontSize(8);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(100, 100, 100);
		doc.text(label + ":", col, y);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(30, 30, 30);
		const lines = doc.splitTextToSize(val, 150);
		doc.text(lines, 44, y);
		y += 5 * lines.length;
	});
	y += 2;
	hLine(y);
	y += 6;
	line("PACKAGE DETAILS", col, y, 8, "bold");
	y += 5;
	[
		["Package", a.packageName || "—"],
		["Services", a.packageServices.join(", ") || "—"],
		["Period", a.packageStartDate ? `${a.packageStartDate}  →  ${a.packageEndDate || "—"}` : "—"]
	].forEach(([label, val]) => {
		doc.setFontSize(8);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(100, 100, 100);
		doc.text(label + ":", col, y);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(30, 30, 30);
		const lines = doc.splitTextToSize(val, 150);
		doc.text(lines, 44, y);
		y += 5 * lines.length;
	});
	y += 4;
	hLine(y);
	y += 6;
	const boxH = 36;
	rect(col, y, 178, boxH, [
		250,
		245,
		255
	]);
	doc.setDrawColor(200, 190, 240);
	doc.roundedRect(col, y, 178, boxH, 3, 3, "S");
	line("PAYMENT SUMMARY", 20, y + 7, 9, "bold");
	y += 13;
	const colW = 178 / 3;
	[
		{
			label: "Total Package",
			value: `₹${total.toLocaleString("en-IN")}`
		},
		{
			label: "Amount Paid",
			value: `₹${paid.toLocaleString("en-IN")}`,
			highlight: true
		},
		{
			label: "Balance Due",
			value: `₹${bal.toLocaleString("en-IN")}`,
			warn: bal > 0
		}
	].forEach((cell, i) => {
		const cx = col + i * colW + 4;
		doc.setFontSize(7.5);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(110, 110, 110);
		doc.text(cell.label, cx, y);
		doc.setFontSize(13);
		doc.setFont("helvetica", "bold");
		if (cell.highlight) doc.setTextColor(245, 120, 30);
		else if (cell.warn) doc.setTextColor(220, 50, 50);
		else doc.setTextColor(40, 40, 40);
		doc.text(cell.value, cx, y + 7);
	});
	y += 22;
	doc.setTextColor(40, 40, 40);
	y += 6;
	hLine(y);
	y += 6;
	line("PROVIDED ITEMS", col, y, 8, "bold");
	y += 5;
	const items = [
		{
			label: "Bag",
			ok: a.bagProvided
		},
		{
			label: "Tiffin",
			ok: a.tiffinProvided
		},
		{
			label: "Mattress",
			ok: a.mattressRequired
		}
	];
	let ix = col;
	items.forEach((item) => {
		const chipColor = item.ok ? [
			34,
			197,
			94
		] : [
			249,
			115,
			22
		];
		rect(ix, y - 4, 36, 7, chipColor);
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(7.5);
		doc.setFont("helvetica", "bold");
		doc.text(`${item.ok ? "✔" : "✘"} ${item.label}`, ix + 3, y + .5);
		doc.setTextColor(40, 40, 40);
		ix += 40;
	});
	y += 10;
	if (a.notes) {
		hLine(y);
		y += 5;
		line("Notes:", col, y, 8, "bold");
		y += 4;
		doc.setFontSize(8);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(80, 80, 80);
		const noteLines = doc.splitTextToSize(a.notes, 178);
		doc.text(noteLines, col, y);
		y += 4 * noteLines.length + 2;
	}
	hLine(285);
	doc.setFontSize(7.5);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(150, 150, 150);
	doc.text("NivasiSpace · Internal Admission Management System", col, 290);
	doc.text(`Generated: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`, 194, 290, { align: "right" });
	doc.save(`NivasiSpace_Receipt_${a.admissionId}.pdf`);
}
//#endregion
export { downloadReceiptPDF };
