import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { H as LoaderCircle, X as FileSpreadsheet, et as Download, ht as CalendarRange, s as Users } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mess-export-dialog-HfISSI_h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_excel = /* @__PURE__ */ __toESM(require_excel());
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
var THIN = {
	top: { style: "thin" },
	left: { style: "thin" },
	bottom: { style: "thin" },
	right: { style: "thin" }
};
/**
* Format any date string (ISO YYYY-MM-DD or timestamp) into DD-MM-YYYY
*/
function formatToDDMMYYYY(dateStr) {
	if (!dateStr || !dateStr.trim()) return "N/A";
	const clean = dateStr.trim().slice(0, 10);
	if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
		const parts = clean.split("-");
		const y = parts[0];
		const m = parts[1];
		const d = parts[2];
		if (y && m && d) return `${d}-${m}-${y}`;
	}
	if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) return clean;
	const parsed = new Date(dateStr);
	if (!isNaN(parsed.getTime())) return `${String(parsed.getDate()).padStart(2, "0")}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${parsed.getFullYear()}`;
	return dateStr;
}
/**
* Extract the raw mess joining date for sorting & filtering
*/
function getStudentMessJoiningDate(student) {
	const d = student.messJoiningDate || student.messStartDate || student.packageStartDate || student.admissionDate || student.moveInDate || "";
	if (!d) return "";
	return String(d).trim().slice(0, 10);
}
/**
* Resolve Veg vs Non-Veg without guessing. Missing/unspecified returns "N/A".
*/
function resolveVegNonVeg(student) {
	if (!student.mealPreference) return "N/A";
	const pref = student.mealPreference.toLowerCase().trim();
	if (pref.includes("non")) return "Non-Veg";
	if (pref.includes("veg")) return "Veg";
	return "N/A";
}
/**
* Sanitize strings for safe Windows/macOS filenames
*/
function sanitizeFileName(name) {
	return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}
/**
* Format today's date as YYYY-MM-DD
*/
function todayDateString() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/**
* Trigger client-side browser download of ArrayBuffer
*/
function triggerDownload(buffer, fileName) {
	const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = fileName;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	setTimeout(() => URL.revokeObjectURL(url), 5e3);
}
var MAIN_HEADERS = [
	"Sr. No.",
	"Student Name",
	"Student Mobile No.",
	"Owner Name",
	"Owner Mobile No.",
	"Mess Name",
	"Mess Joining Date",
	"Veg / Non-Veg"
];
/**
* Build the main "Mess Student Register" sheet
*/
function buildMessRegisterSheet(wb, mess, rows, sheetTitle) {
	const ws = wb.addWorksheet(sheetTitle, {
		views: [{
			state: "frozen",
			ySplit: 15,
			showGridLines: true
		}],
		pageSetup: {
			orientation: "landscape",
			fitToPage: true,
			fitToWidth: 1,
			fitToHeight: 0,
			margins: {
				left: .5,
				right: .5,
				top: .6,
				bottom: .6,
				header: .3,
				footer: .3
			},
			printTitlesRow: "15:15"
		}
	});
	ws.columns = [
		{
			key: "srNo",
			width: 10
		},
		{
			key: "studentName",
			width: 28
		},
		{
			key: "studentMobile",
			width: 22
		},
		{
			key: "ownerName",
			width: 24
		},
		{
			key: "ownerMobile",
			width: 22
		},
		{
			key: "messName",
			width: 26
		},
		{
			key: "messJoiningDate",
			width: 20
		},
		{
			key: "vegNonVeg",
			width: 18
		}
	];
	ws.mergeCells("A1:H1");
	const titleCell = ws.getCell("A1");
	titleCell.value = "NIVASI SPACE - MESS STUDENT REGISTER";
	titleCell.font = {
		name: "Calibri",
		size: 16,
		bold: true,
		color: { argb: "FF9A3412" }
	};
	titleCell.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	titleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFFFEDD5" }
	};
	ws.getRow(1).height = 28;
	for (let c = 1; c <= 8; c++) ws.getRow(1).getCell(c).border = THIN;
	ws.getRow(2).height = 8;
	const exportDateStr = formatToDDMMYYYY(todayDateString());
	[
		{
			label: "Mess Name:",
			value: mess.messName || "N/A"
		},
		{
			label: "Mess Owner:",
			value: `${mess.ownerName || "N/A"} ${mess.ownerPhone ? `(${mess.ownerPhone})` : ""}`.trim()
		},
		{
			label: "Export Date:",
			value: exportDateStr
		},
		{
			label: "Total Students:",
			value: rows.length
		}
	].forEach((m, idx) => {
		const rowNum = 3 + idx;
		const row = ws.getRow(rowNum);
		row.height = 18;
		const labelCell = row.getCell(1);
		labelCell.value = m.label;
		labelCell.font = {
			name: "Calibri",
			size: 11,
			bold: true,
			color: { argb: "FF475569" }
		};
		labelCell.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
		ws.mergeCells(`B${rowNum}:D${rowNum}`);
		const valCell = row.getCell(2);
		valCell.value = m.value;
		valCell.font = {
			name: "Calibri",
			size: 11,
			bold: true,
			color: { argb: "FF0F172A" }
		};
		valCell.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
	});
	ws.getRow(7).height = 8;
	const vegCount = rows.filter((r) => r.vegNonVeg === "Veg").length;
	const nonVegCount = rows.filter((r) => r.vegNonVeg === "Non-Veg").length;
	rows.filter((r) => r.vegNonVeg === "N/A").length;
	const validDates = rows.map((r) => r.rawJoiningDate).filter((d) => Boolean(d && d !== "N/A")).sort();
	const firstJoiningDate = validDates[0] ? formatToDDMMYYYY(validDates[0]) : "N/A";
	const latestJoiningDate = validDates[validDates.length - 1] ? formatToDDMMYYYY(validDates[validDates.length - 1]) : "N/A";
	ws.mergeCells("A8:H8");
	const sumHeader = ws.getCell("A8");
	sumHeader.value = "SUMMARY";
	sumHeader.font = {
		name: "Calibri",
		size: 11,
		bold: true,
		color: { argb: "FF1E293B" }
	};
	sumHeader.alignment = {
		horizontal: "left",
		vertical: "middle",
		indent: 1
	};
	sumHeader.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFF1F5F9" }
	};
	ws.getRow(8).height = 20;
	for (let c = 1; c <= 8; c++) ws.getRow(8).getCell(c).border = THIN;
	[
		{
			label: "Total Students:",
			val: rows.length
		},
		{
			label: "Total Veg Students:",
			val: vegCount
		},
		{
			label: "Total Non-Veg Students:",
			val: nonVegCount
		},
		{
			label: "First Joining Date:",
			val: firstJoiningDate
		},
		{
			label: "Latest Joining Date:",
			val: latestJoiningDate
		}
	].forEach((s, idx) => {
		const rowNum = 9 + idx;
		const row = ws.getRow(rowNum);
		row.height = 18;
		const lbl = row.getCell(1);
		lbl.value = s.label;
		lbl.font = {
			name: "Calibri",
			size: 10,
			bold: true,
			color: { argb: "FF64748B" }
		};
		lbl.alignment = {
			horizontal: "left",
			vertical: "middle",
			indent: 1
		};
		ws.mergeCells(`B${rowNum}:D${rowNum}`);
		const v = row.getCell(2);
		v.value = s.val;
		v.font = {
			name: "Calibri",
			size: 10,
			bold: true,
			color: { argb: "FF0F172A" }
		};
		v.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
	});
	ws.getRow(14).height = 10;
	const headerRow = ws.getRow(15);
	headerRow.height = 24;
	MAIN_HEADERS.forEach((h, i) => {
		const cell = headerRow.getCell(i + 1);
		cell.value = h;
		cell.font = {
			name: "Calibri",
			size: 11,
			bold: true,
			color: { argb: "FF7C2D12" }
		};
		cell.alignment = {
			horizontal: "center",
			vertical: "middle",
			wrapText: true
		};
		cell.border = THIN;
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFFFEDD5" }
		};
	});
	let currentRowNum = 16;
	rows.forEach((r) => {
		const row = ws.getRow(currentRowNum);
		row.height = 20;
		const c1 = row.getCell(1);
		c1.value = r.srNo;
		c1.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		c1.border = THIN;
		const c2 = row.getCell(2);
		c2.value = r.studentName;
		c2.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
		c2.border = THIN;
		const c3 = row.getCell(3);
		c3.value = r.studentMobile;
		c3.numFmt = "@";
		c3.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		c3.border = THIN;
		const c4 = row.getCell(4);
		c4.value = r.ownerName;
		c4.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
		c4.border = THIN;
		const c5 = row.getCell(5);
		c5.value = r.ownerMobile;
		c5.numFmt = "@";
		c5.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		c5.border = THIN;
		const c6 = row.getCell(6);
		c6.value = r.messName;
		c6.alignment = {
			horizontal: "left",
			vertical: "middle"
		};
		c6.border = THIN;
		const c7 = row.getCell(7);
		c7.value = r.messJoiningDateFormatted;
		c7.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		c7.border = THIN;
		const c8 = row.getCell(8);
		c8.value = r.vegNonVeg;
		c8.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		c8.border = THIN;
		if (currentRowNum % 2 === 1) for (let col = 1; col <= 8; col++) row.getCell(col).fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFFAFAFA" }
		};
		currentRowNum++;
	});
	const lastDataRow = currentRowNum - 1;
	if (rows.length > 0) ws.autoFilter = {
		from: {
			row: 15,
			column: 1
		},
		to: {
			row: lastDataRow,
			column: 8
		}
	};
}
/**
* Build the secondary "Summary" sheet
*/
function buildSummarySheet(wb, mess, rows) {
	const ws = wb.addWorksheet("Summary", {
		views: [{
			state: "frozen",
			ySplit: 2,
			showGridLines: true
		}],
		pageSetup: {
			orientation: "portrait",
			fitToPage: true,
			fitToWidth: 1,
			fitToHeight: 0,
			margins: {
				left: .7,
				right: .7,
				top: .75,
				bottom: .75,
				header: .3,
				footer: .3
			}
		}
	});
	ws.columns = [{
		key: "field",
		width: 28
	}, {
		key: "val",
		width: 36
	}];
	ws.mergeCells("A1:B1");
	const title = ws.getCell("A1");
	title.value = "NIVASI SPACE - MESS REGISTER SUMMARY";
	title.font = {
		name: "Calibri",
		size: 14,
		bold: true,
		color: { argb: "FF9A3412" }
	};
	title.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	title.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFFFEDD5" }
	};
	ws.getRow(1).height = 26;
	ws.getRow(1).getCell(1).border = THIN;
	ws.getRow(1).getCell(2).border = THIN;
	ws.getRow(2).height = 10;
	const vegCount = rows.filter((r) => r.vegNonVeg === "Veg").length;
	const nonVegCount = rows.filter((r) => r.vegNonVeg === "Non-Veg").length;
	const validDates = rows.map((r) => r.rawJoiningDate).filter((d) => Boolean(d && d !== "N/A")).sort();
	const firstJoiningDate = validDates[0] ? formatToDDMMYYYY(validDates[0]) : "N/A";
	const latestJoiningDate = validDates[validDates.length - 1] ? formatToDDMMYYYY(validDates[validDates.length - 1]) : "N/A";
	[
		["Mess Name", mess.messName || "N/A"],
		["Mess Owner", mess.ownerName || "N/A"],
		["Mess Owner Phone", mess.ownerPhone || "N/A"],
		["Total Students", rows.length],
		["Veg Students", vegCount],
		["Non-Veg Students", nonVegCount],
		["First Joining Date", firstJoiningDate],
		["Latest Joining Date", latestJoiningDate],
		["Export Date", formatToDDMMYYYY(todayDateString())]
	].forEach(([f, v], idx) => {
		const rowNum = 3 + idx;
		const row = ws.getRow(rowNum);
		row.height = 20;
		const cellA = row.getCell(1);
		cellA.value = f;
		cellA.font = {
			name: "Calibri",
			size: 11,
			bold: true
		};
		cellA.alignment = {
			horizontal: "left",
			vertical: "middle",
			indent: 1
		};
		cellA.border = THIN;
		cellA.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFF8FAFC" }
		};
		const cellB = row.getCell(2);
		cellB.value = v;
		cellB.font = {
			name: "Calibri",
			size: 11,
			bold: idx >= 3 && idx <= 5
		};
		cellB.alignment = {
			horizontal: "left",
			vertical: "middle",
			indent: 1
		};
		cellB.border = THIN;
	});
}
/**
* Filter students belonging to the specific mess and export an Excel workbook.
*/
async function exportMessStudentRegister(opts) {
	const { mess, students, dateRange } = opts;
	let exportRows = students.filter((s) => {
		return s.messId === mess.id;
	}).map((s) => {
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
			vegNonVeg: resolveVegNonVeg(s)
		};
	});
	if (dateRange?.startDate || dateRange?.endDate) exportRows = exportRows.filter((r) => {
		if (!r.rawJoiningDate) return false;
		if (dateRange.startDate && r.rawJoiningDate < dateRange.startDate) return false;
		if (dateRange.endDate && r.rawJoiningDate > dateRange.endDate) return false;
		return true;
	});
	exportRows.sort((a, b) => {
		const dateComparison = a.rawJoiningDate.localeCompare(b.rawJoiningDate);
		if (dateComparison !== 0) return dateComparison;
		return a.studentName.localeCompare(b.studentName);
	});
	exportRows.forEach((r, idx) => {
		r.srNo = idx + 1;
	});
	const wb = new import_excel.default.Workbook();
	wb.creator = "Nivasi Space";
	wb.created = /* @__PURE__ */ new Date();
	const rawSheetName = `Mess Register - ${mess.messName || "Mess"}`;
	const sheetName = rawSheetName.length > 31 ? rawSheetName.slice(0, 31) : rawSheetName;
	buildMessRegisterSheet(wb, mess, exportRows, sheetName);
	buildSummarySheet(wb, mess, exportRows);
	const buffer = await wb.xlsx.writeBuffer();
	const fileName = `NIVASI_SPACE_Mess_Student_Register_${sanitizeFileName(mess.messName || "Mess")}_${todayDateString()}.xlsx`;
	triggerDownload(buffer, fileName);
	return {
		count: exportRows.length,
		fileName
	};
}
function MessExportDialog({ open, onClose, mess, admissions }) {
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [filterMode, setFilterMode] = (0, import_react.useState)("all");
	const [fromDate, setFromDate] = (0, import_react.useState)("");
	const [toDate, setToDate] = (0, import_react.useState)("");
	const messStudents = (0, import_react.useMemo)(() => {
		if (!mess) return [];
		return admissions.filter((a) => a.messId === mess.id);
	}, [admissions, mess]);
	const previewData = (0, import_react.useMemo)(() => {
		let list = messStudents;
		if (filterMode === "range" && (fromDate || toDate)) list = list.filter((s) => {
			const d = getStudentMessJoiningDate(s);
			if (!d) return false;
			if (fromDate && d < fromDate) return false;
			if (toDate && d > toDate) return false;
			return true;
		});
		const vegCount = list.filter((s) => resolveVegNonVeg(s) === "Veg").length;
		const nonVegCount = list.filter((s) => resolveVegNonVeg(s) === "Non-Veg").length;
		const dates = list.map((s) => getStudentMessJoiningDate(s)).filter(Boolean).sort();
		const firstDate = dates[0] ? formatToDDMMYYYY(dates[0]) : "N/A";
		const lastDate = dates[dates.length - 1] ? formatToDDMMYYYY(dates[dates.length - 1]) : "N/A";
		return {
			count: list.length,
			vegCount,
			nonVegCount,
			firstDate,
			lastDate
		};
	}, [
		messStudents,
		filterMode,
		fromDate,
		toDate
	]);
	async function handleExport() {
		if (!mess) return;
		if (messStudents.length === 0) {
			toast.warning(`No students currently assigned to ${mess.messName}.`);
			return;
		}
		if (filterMode === "range" && fromDate && toDate && toDate < fromDate) {
			toast.error("To Date cannot be before From Date.");
			return;
		}
		setExporting(true);
		try {
			const { count, fileName } = await exportMessStudentRegister({
				mess,
				students: admissions,
				dateRange: filterMode === "range" && (fromDate || toDate) ? {
					startDate: fromDate || void 0,
					endDate: toDate || void 0
				} : void 0
			});
			toast.success(`Successfully exported ${count} student record(s) for ${mess.messName}!`);
			onClose();
		} catch (err) {
			console.error("[export-mess] error", err);
			toast.error(err instanceof Error ? err.message : "Export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	}
	function handleOpenChange(isOpen) {
		if (!isOpen && !exporting) {
			setFilterMode("all");
			setFromDate("");
			setToDate("");
			onClose();
		}
	}
	if (!mess) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-orange-600 dark:text-orange-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold",
							children: "Export Student Register"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: ["Official NIVASI SPACE Excel register for ", mess.messName]
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3.5 space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/60 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-sm text-foreground",
									children: mess.messName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[11px]",
									children: [messStudents.length, " Students Enrolled"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 text-muted-foreground pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase font-semibold text-muted-foreground/80",
									children: "Mess Owner"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground",
									children: mess.ownerName || "—"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase font-semibold text-muted-foreground/80",
									children: "Owner Mobile"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground",
									children: mess.ownerPhone || "—"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Joining Date Filter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFilterMode("all"),
									className: `flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${filterMode === "all" ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 shadow-soft" : "border-border bg-card text-muted-foreground hover:bg-muted/40"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
										"All Students (",
										messStudents.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFilterMode("range"),
									className: `flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${filterMode === "range" ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 shadow-soft" : "border-border bg-card text-muted-foreground hover:bg-muted/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-4" }), "Filter by Date"]
								})]
							})]
						}),
						filterMode === "range" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 space-y-2.5 animate-in fade-in-50 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-orange-900 dark:text-orange-200 font-medium",
								children: [
									"Filter students who joined ",
									mess.messName,
									" between:"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "from-date",
										className: "text-[11px] text-muted-foreground",
										children: "From Joining Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "from-date",
										type: "date",
										value: fromDate,
										onChange: (e) => setFromDate(e.target.value),
										className: "h-8 text-xs bg-background"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "to-date",
										className: "text-[11px] text-muted-foreground",
										children: "To Joining Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "to-date",
										type: "date",
										value: toDate,
										onChange: (e) => setToDate(e.target.value),
										className: "h-8 text-xs bg-background"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Register Breakdown:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-foreground font-bold",
										children: [previewData.count, " student(s) to export"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2 pt-1 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-emerald-800 dark:text-emerald-300 font-medium",
												children: "🟢 Veg"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-emerald-700 dark:text-emerald-400",
												children: previewData.vegCount
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-amber-500/10 border border-amber-500/20 py-1.5 px-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-amber-800 dark:text-amber-300 font-medium",
												children: "🍗 Non-Veg"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-amber-700 dark:text-amber-400",
												children: previewData.nonVegCount
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-card border border-border py-1.5 px-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground font-medium",
												children: "Total"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-foreground",
												children: previewData.count
											})]
										})
									]
								}),
								previewData.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-1 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Earliest: ", previewData.firstDate] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Latest: ", previewData.lastDate] })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						disabled: exporting,
						className: "text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: handleExport,
						disabled: exporting || previewData.count === 0,
						className: "text-xs font-semibold gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-soft",
						children: exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Generating Excel Register…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export to Excel (.xlsx)"] })
					})]
				})
			]
		})
	});
}
//#endregion
export { MessExportDialog as t };
