import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Et as useLaundryPickupsForDateRange, F as getWeekId, O as fetchLaundryPickupsForDateRange, P as getWeekBounds, Rt as useProperties, Tt as useLaundryPickupsForDate, U as todayDateString, lt as upsertLaundryPickup, ut as useAdmissions, wt as useLaundryPickupSummary, xt as useLaundries, zt as useRooms } from "./hooks-XsXOiSyK.mjs";
import { E as Scale, H as LoaderCircle, M as Phone, R as MapPin, T as Search, X as FileSpreadsheet, _ as StickyNote, ct as ChevronRight, d as UserCheck, dt as Check, et as Download, ft as Calendar, i as WashingMachine, lt as ChevronLeft, rt as CircleCheck, tt as Clock, xt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-Cw69BSgV.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Route } from "./admin.laundry._laundryId-BOqmCwJ2.mjs";
import { t as StudentLaundryDialog } from "./student-laundry-dialog-DFNL-Qh_.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry._laundryId-CIl8uuOa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_excel = /* @__PURE__ */ __toESM(require_excel());
/** Parse a numeric weight from strings like "2.5 kg", "2.5", "2.5 Kg" etc. */
function parseWeight(raw) {
	if (!raw) return 0;
	const match = raw.replace(/,/g, ".").match(/(\d+(?:\.\d+)?)/);
	if (!match || !match[1]) return 0;
	const n = parseFloat(match[1]);
	return isNaN(n) ? 0 : n;
}
/** Try to infer the clothes count from a notes string like "3 shirts, 2 pants" */
function inferClothesCount(notes) {
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
function buildExportRows(pickups, studentNameMap, weekLabel) {
	const byStudentDate = /* @__PURE__ */ new Map();
	for (const p of pickups) {
		const key = `${p.studentId}_${p.date}`;
		const list = byStudentDate.get(key) ?? [];
		list.push(p);
		byStudentDate.set(key, list);
	}
	const merged = [];
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
			} else if (!bestWeight && r.clothesWeight) bestWeight = r.clothesWeight;
			if (r.notes && (!bestNotes || r.notes.length > bestNotes.length)) bestNotes = r.notes;
			if (r.status === "picked_up" || r.status === "delivered") status = "picked_up";
		}
		merged.push({
			studentId,
			date: date || "",
			clothesWeight: bestWeight,
			notes: bestNotes,
			status
		});
	}
	const valid = merged.filter((item) => {
		return parseWeight(item.clothesWeight) > 0 || item.status === "picked_up" || item.status === "delivered";
	});
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
		weightKg: parseWeight(item.clothesWeight)
	}));
}
var THIN = {
	top: { style: "thin" },
	left: { style: "thin" },
	bottom: { style: "thin" },
	right: { style: "thin" }
};
/** Rupee currency format string for ExcelJS */
var RUPEE_FMT = "[$₹-4009]#,##0.00";
/** Column header names — must match reference exactly */
var HEADERS = [
	"Week",
	"Order No.",
	"Student Name",
	"Clothes Count",
	"Weight (Kg)",
	"Rate / Kg (₹)",
	"Total Amount (₹)"
];
function applyAllBorders(row, colCount = 7) {
	for (let c = 1; c <= colCount; c++) row.getCell(c).border = THIN;
}
/** Build a single "Weekly Billing" sheet from provided rows */
function buildBillingSheet(wb, opts, sheetName = "Weekly Billing") {
	const { rows, weekLabel, weekDateRange } = opts;
	const ws = wb.addWorksheet(sheetName, {
		views: [{
			state: "frozen",
			ySplit: 6,
			showGridLines: true
		}],
		pageSetup: {
			orientation: "landscape",
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
			},
			printTitlesRow: "6:6"
		}
	});
	ws.columns = [
		{
			key: "week",
			width: 14
		},
		{
			key: "orderNo",
			width: 16
		},
		{
			key: "studentName",
			width: 24
		},
		{
			key: "clothesCount",
			width: 18
		},
		{
			key: "weight",
			width: 16
		},
		{
			key: "rate",
			width: 18
		},
		{
			key: "totalAmount",
			width: 22
		}
	];
	ws.mergeCells("A1:G1");
	const titleCell = ws.getCell("A1");
	titleCell.value = "NIVASI SPACE - WEEKLY LAUNDRY BILLING";
	titleCell.font = {
		name: "Calibri",
		size: 16,
		bold: true
	};
	titleCell.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	ws.getRow(1).height = 21;
	applyAllBorders(ws.getRow(1));
	const dateCell = ws.getCell("A2");
	dateCell.value = /* @__PURE__ */ new Date();
	dateCell.numFmt = "d-mmm";
	dateCell.font = {
		name: "Calibri",
		size: 14,
		bold: true
	};
	dateCell.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	const rangeDateCell = ws.getCell("B2");
	rangeDateCell.value = weekDateRange;
	rangeDateCell.font = {
		name: "Calibri",
		size: 11,
		bold: true
	};
	rangeDateCell.alignment = {
		horizontal: "left",
		vertical: "middle"
	};
	ws.getRow(2).height = 18.75;
	applyAllBorders(ws.getRow(2));
	const DATA_START = 7;
	const DATA_END = rows.length > 0 ? DATA_START + rows.length - 1 : DATA_START;
	const TOTAL_ROW_NUM = DATA_END + 1;
	const summaryRow = ws.getRow(3);
	summaryRow.getCell(1).value = "Week";
	summaryRow.getCell(2).value = weekLabel;
	summaryRow.getCell(3).value = "Total Clothes";
	summaryRow.getCell(4).value = rows.length > 0 ? { formula: `SUM(D${DATA_START}:D${DATA_END})` } : 0;
	summaryRow.getCell(5).value = "Total Weight (Kg)";
	const sWeightCell = summaryRow.getCell(6);
	sWeightCell.value = rows.length > 0 ? { formula: `SUM(E${DATA_START}:E${DATA_END})` } : 0;
	sWeightCell.numFmt = "0.00";
	summaryRow.getCell(6);
	const sAmtCell = summaryRow.getCell(7);
	sAmtCell.value = rows.length > 0 ? { formula: `SUM(G${DATA_START}:G${DATA_END})` } : 0;
	sAmtCell.numFmt = RUPEE_FMT;
	for (let c = 1; c <= 7; c++) {
		const cell = summaryRow.getCell(c);
		cell.font = {
			name: "Calibri",
			size: 11
		};
		cell.border = THIN;
		cell.alignment = { vertical: "middle" };
	}
	applyAllBorders(ws.getRow(4));
	applyAllBorders(ws.getRow(5));
	const headerRow = ws.getRow(6);
	headerRow.height = 20;
	HEADERS.forEach((h, i) => {
		const cell = headerRow.getCell(i + 1);
		cell.value = h;
		cell.font = {
			name: "Calibri",
			size: 11,
			bold: true
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
			fgColor: { argb: "FFD9E1F2" }
		};
	});
	ws.autoFilter = {
		from: {
			row: 6,
			column: 1
		},
		to: {
			row: DATA_END,
			column: 7
		}
	};
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
		erCell.value = 80;
		erCell.numFmt = RUPEE_FMT;
		const eaCell = emptyRow.getCell(7);
		eaCell.value = 0;
		eaCell.numFmt = RUPEE_FMT;
		for (let c = 1; c <= 7; c++) {
			const cell = emptyRow.getCell(c);
			cell.font = {
				name: "Calibri",
				size: 11
			};
			cell.alignment = {
				horizontal: "center",
				vertical: "middle"
			};
			cell.border = THIN;
		}
	} else rows.forEach((item, idx) => {
		const r = DATA_START + idx;
		const row = ws.getRow(r);
		row.height = 19;
		const cellA = row.getCell(1);
		cellA.value = item.weekLabel;
		cellA.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellA.border = THIN;
		cellA.font = {
			name: "Calibri",
			size: 11
		};
		const cellB = row.getCell(2);
		cellB.value = item.orderNo;
		cellB.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellB.border = THIN;
		cellB.font = {
			name: "Calibri",
			size: 11
		};
		const cellC = row.getCell(3);
		cellC.value = item.studentName;
		cellC.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellC.border = THIN;
		cellC.font = {
			name: "Calibri",
			size: 11
		};
		const cellD = row.getCell(4);
		cellD.value = item.clothesCount;
		cellD.numFmt = "0";
		cellD.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellD.border = THIN;
		cellD.font = {
			name: "Calibri",
			size: 11
		};
		const cellE = row.getCell(5);
		cellE.value = item.weightKg;
		cellE.numFmt = "0.00";
		cellE.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellE.border = THIN;
		cellE.font = {
			name: "Calibri",
			size: 11
		};
		const cellF = row.getCell(6);
		cellF.value = 80;
		cellF.numFmt = RUPEE_FMT;
		cellF.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellF.border = THIN;
		cellF.font = {
			name: "Calibri",
			size: 11
		};
		const cellG = row.getCell(7);
		cellG.value = { formula: `IF(E${r}="","",E${r}*F${r})` };
		cellG.numFmt = RUPEE_FMT;
		cellG.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cellG.border = THIN;
		cellG.font = {
			name: "Calibri",
			size: 11
		};
	});
	const tRow = ws.getRow(TOTAL_ROW_NUM);
	tRow.height = 20;
	tRow.getCell(1).value = "TOTAL";
	tRow.getCell(2).value = null;
	tRow.getCell(3).value = null;
	tRow.getCell(4).value = rows.length > 0 ? { formula: `SUM(D${DATA_START}:D${DATA_END})` } : 0;
	tRow.getCell(4).numFmt = "0";
	const tWeightCell = tRow.getCell(5);
	tWeightCell.value = rows.length > 0 ? { formula: `SUM(E${DATA_START}:E${DATA_END})` } : 0;
	tWeightCell.numFmt = "0.00";
	tRow.getCell(6).value = null;
	const tAmtCell = tRow.getCell(7);
	tAmtCell.value = rows.length > 0 ? { formula: `SUM(G${DATA_START}:G${DATA_END})` } : 0;
	tAmtCell.numFmt = RUPEE_FMT;
	for (let c = 1; c <= 7; c++) {
		const cell = tRow.getCell(c);
		cell.font = {
			name: "Calibri",
			size: 11,
			bold: true
		};
		cell.alignment = {
			horizontal: "center",
			vertical: "middle"
		};
		cell.border = THIN;
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFF2F2F2" }
		};
	}
}
/** Format a date as YYYY-MM-DD for filenames */
function todayFileDate() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
}
/** Trigger browser download of an ArrayBuffer as an .xlsx file */
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
/** Generate and download the Excel file for a single week in the browser */
async function exportLaundryBillingExcel(opts) {
	const { weekLabel } = opts;
	const wb = new import_excel.default.Workbook();
	wb.creator = "Nivasi Space";
	wb.created = /* @__PURE__ */ new Date();
	buildBillingSheet(wb, opts, "Weekly Billing");
	triggerDownload(await wb.xlsx.writeBuffer(), `NIVASI_SPACE_Weekly_Laundry_Billing_${weekLabel.replace(/\s+/g, "_")}_${todayFileDate()}.xlsx`);
}
/** Generate and download the Excel file for ALL weeks (one sheet per week) */
async function exportAllWeeksLaundryBillingExcel(opts) {
	const { weekGroups, laundryName } = opts;
	const wb = new import_excel.default.Workbook();
	wb.creator = "Nivasi Space";
	wb.created = /* @__PURE__ */ new Date();
	for (const group of weekGroups) {
		const sheetName = group.weekLabel.length > 31 ? group.weekLabel.slice(0, 31) : group.weekLabel;
		buildBillingSheet(wb, {
			rows: group.rows,
			weekLabel: group.weekLabel,
			weekDateRange: group.weekDateRange,
			laundryName
		}, sheetName);
	}
	triggerDownload(await wb.xlsx.writeBuffer(), `NIVASI_SPACE_Weekly_Laundry_Billing_All_Weeks_${todayFileDate()}.xlsx`);
}
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	picked_up: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
function getMapUrl(admission, rooms, properties) {
	const a = admission;
	if (a.propertyId) {
		const room = rooms.find((r) => r.id === a.propertyId);
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (admission.propertyName) {
		const room = rooms.find((r) => r.title?.toLowerCase() === admission.propertyName.toLowerCase());
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (a.propertyId) {
		const prop = properties.find((p) => p.propertyId === a.propertyId);
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (admission.propertyName) {
		const prop = properties.find((p) => p.propertyName?.toLowerCase() === admission.propertyName.toLowerCase());
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (admission.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(admission.propertyName)}`;
	return null;
}
function formatWeekRange(start, end) {
	try {
		const fmt = (d) => {
			const [y, m, day] = d.split("-").map(Number);
			return new Date(y, (m ?? 1) - 1, day).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short"
			});
		};
		const year = (/* @__PURE__ */ new Date(end + "T00:00:00")).getFullYear();
		return `${fmt(start)} – ${fmt(end)} ${year}`;
	} catch {
		return `${start} – ${end}`;
	}
}
function LaundryStudentsPage() {
	const { laundryId } = Route.useParams();
	const qc = useQueryClient();
	const today = todayDateString();
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(today);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
	const [dialogStudent, setDialogStudent] = (0, import_react.useState)(null);
	const [notesMap, setNotesMap] = (0, import_react.useState)({});
	const [weightMap, setWeightMap] = (0, import_react.useState)({});
	const [showExportPanel, setShowExportPanel] = (0, import_react.useState)(false);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [exportMode, setExportMode] = (0, import_react.useState)("current");
	const currentWeekBounds = (0, import_react.useMemo)(() => getWeekBounds(selectedDate), [selectedDate]);
	const [exportStart, setExportStart] = (0, import_react.useState)(currentWeekBounds.weekStart);
	const [exportEnd, setExportEnd] = (0, import_react.useState)(currentWeekBounds.weekEnd);
	(0, import_react.useEffect)(() => {
		if (!showExportPanel || exportMode === "current") {
			setExportStart(currentWeekBounds.weekStart);
			setExportEnd(currentWeekBounds.weekEnd);
		}
	}, [
		currentWeekBounds,
		showExportPanel,
		exportMode
	]);
	const { data: exportPickups = [], isFetching: exportFetching } = useLaundryPickupsForDateRange(showExportPanel && exportMode !== "all" ? laundryId : null, exportStart, exportEnd);
	const { data: laundries = [], isLoading: laundryLoading } = useLaundries();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: pickups = [] } = useLaundryPickupsForDate(laundryId, selectedDate);
	const { data: summary } = useLaundryPickupSummary(laundryId, selectedDate);
	const { data: rooms = [] } = useRooms();
	const { data: properties = [] } = useProperties();
	const laundry = laundries.find((l) => l.id === laundryId);
	const students = (0, import_react.useMemo)(() => admissions.filter((a) => a.laundryId === laundryId), [admissions, laundryId]);
	(0, import_react.useEffect)(() => {
		if (pickups.length === 0) return;
		setNotesMap((prev) => {
			const next = { ...prev };
			for (const p of pickups) if (p.notes !== void 0 && p.notes !== "") {
				next[p.studentId] = p.notes;
				next[`${p.studentId}-pickup`] = p.notes;
				next[`${p.studentId}-delivery`] = p.notes;
			}
			return next;
		});
		setWeightMap((prev) => {
			const next = { ...prev };
			for (const p of pickups) if (p.clothesWeight !== void 0 && p.clothesWeight !== "") {
				next[p.studentId] = p.clothesWeight;
				next[`${p.studentId}-pickup`] = p.clothesWeight;
				next[`${p.studentId}-delivery`] = p.clothesWeight;
			}
			return next;
		});
	}, [pickups]);
	const filtered = students.filter((s) => {
		const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phoneNumber.includes(search) || (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || s.laundryStatus === statusFilter;
		return matchSearch && matchStatus;
	});
	function getPickup(studentId, type) {
		return pickups.find((p) => p.studentId === studentId && p.type === type);
	}
	async function setPickupStatus(student, type, status) {
		const key = `${student.id}-${type}`;
		const weight = weightMap[student.id] ?? weightMap[`${student.id}-pickup`] ?? "";
		const notes = notesMap[student.id] ?? notesMap[`${student.id}-pickup`] ?? "";
		setUpdatingKey(key);
		try {
			await upsertLaundryPickup({
				studentId: student.id,
				admissionId: student.admissionId,
				laundryId,
				employeeId: "admin",
				date: selectedDate,
				type,
				status,
				clothesWeight: weight,
				notes
			});
			await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
			await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update status.");
		} finally {
			setUpdatingKey(null);
		}
	}
	async function saveStudentDetails(student) {
		const key = `${student.id}-details`;
		const weight = weightMap[student.id] ?? weightMap[`${student.id}-pickup`] ?? "";
		const notes = notesMap[student.id] ?? notesMap[`${student.id}-pickup`] ?? "";
		const pRecord = getPickup(student.id, "pickup");
		const dRecord = getPickup(student.id, "delivery");
		const pickupStatus = pRecord?.status ?? "pending";
		const deliveryStatus = dRecord?.status ?? "pending";
		setUpdatingKey(key);
		try {
			await Promise.all([upsertLaundryPickup({
				studentId: student.id,
				admissionId: student.admissionId,
				laundryId,
				employeeId: "admin",
				date: selectedDate,
				type: "pickup",
				status: pickupStatus,
				clothesWeight: weight,
				notes
			}), upsertLaundryPickup({
				studentId: student.id,
				admissionId: student.admissionId,
				laundryId,
				employeeId: "admin",
				date: selectedDate,
				type: "delivery",
				status: deliveryStatus,
				clothesWeight: weight,
				notes
			})]);
			await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
			await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
			toast.success(`Laundry details saved for ${student.fullName}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save details.");
		} finally {
			setUpdatingKey(null);
		}
	}
	function shiftDate(days) {
		const d = new Date(selectedDate);
		d.setDate(d.getDate() + days);
		setSelectedDate(d.toISOString().slice(0, 10));
	}
	const isLoading = laundryLoading || admLoading;
	const studentNameMap = (0, import_react.useMemo)(() => {
		const map = {};
		for (const a of admissions) map[a.id] = a.fullName;
		return map;
	}, [admissions]);
	const exportPreviewRows = (0, import_react.useMemo)(() => {
		return buildExportRows(exportPickups, studentNameMap, "");
	}, [exportPickups, studentNameMap]);
	const exportRowsWithWeight = (0, import_react.useMemo)(() => {
		return exportPreviewRows.filter((r) => r.weightKg > 0).length;
	}, [exportPreviewRows]);
	const handleExport = (0, import_react.useCallback)(async () => {
		if (exporting) return;
		if (exportPickups.length === 0 && !exportFetching) {
			toast.warning("No laundry records found for the selected period.");
			return;
		}
		setExporting(true);
		try {
			const weekLabel = `Week ${getWeekId(exportStart).split("-W")[1] ?? ""}`;
			const weekDateRange = formatWeekRange(exportStart, exportEnd);
			const rows = buildExportRows(exportPickups, studentNameMap, weekLabel);
			if (rows.length === 0) {
				toast.warning("No laundry records found for the selected period.");
				return;
			}
			await exportLaundryBillingExcel({
				rows,
				weekLabel,
				weekDateRange,
				laundryName: laundry?.laundryName ?? "Laundry"
			});
			toast.success(`Exported ${rows.length} record(s) to Excel successfully!`);
		} catch (err) {
			console.error("[export] laundry billing", err);
			toast.error(err instanceof Error ? err.message : "Export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	}, [
		exporting,
		exportPickups,
		exportFetching,
		studentNameMap,
		exportStart,
		exportEnd,
		laundry?.laundryName
	]);
	const handleExportAllWeeks = (0, import_react.useCallback)(async () => {
		if (exporting) return;
		setExporting(true);
		try {
			const allWeeks = [];
			for (let i = 11; i >= 0; i--) {
				const d = new Date(today);
				d.setDate(d.getDate() - i * 7);
				const { weekStart, weekEnd } = getWeekBounds(d.toISOString().slice(0, 10));
				const wNum = getWeekId(weekStart).split("-W")[1] ?? "";
				if (!allWeeks.some((w) => w.weekStart === weekStart)) allWeeks.push({
					weekLabel: `Week ${wNum}`,
					weekDateRange: formatWeekRange(weekStart, weekEnd),
					weekStart,
					weekEnd
				});
			}
			const minDate = allWeeks[allWeeks.length - 1]?.weekStart ?? "";
			const maxDate = allWeeks[0]?.weekEnd ?? "";
			const allPickups = await fetchLaundryPickupsForDateRange(laundryId, minDate, maxDate);
			const weekGroups = allWeeks.map((w) => {
				const pickups = allPickups.filter((p) => p.date >= w.weekStart && p.date <= w.weekEnd);
				return {
					weekLabel: w.weekLabel,
					weekDateRange: w.weekDateRange,
					rows: buildExportRows(pickups, studentNameMap, w.weekLabel)
				};
			}).filter((g) => g.rows.length > 0);
			if (weekGroups.length === 0) {
				toast.warning("No laundry records found across any weeks for this provider.");
				return;
			}
			await exportAllWeeksLaundryBillingExcel({
				weekGroups,
				laundryName: laundry?.laundryName ?? "Laundry"
			});
			const totalRecords = weekGroups.reduce((acc, g) => acc + g.rows.length, 0);
			toast.success(`Exported ${totalRecords} record(s) across ${weekGroups.length} week(s) to Excel!`);
		} catch (err) {
			console.error("[export] all weeks laundry billing", err);
			toast.error(err instanceof Error ? err.message : "Export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	}, [
		exporting,
		today,
		laundryId,
		studentNameMap,
		laundry?.laundryName
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: laundry?.laundryName ?? "Laundry Students",
		subtitle: laundry ? `Owner: ${laundry.ownerName || "—"}  ·  ${students.length} students` : "",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: showExportPanel ? "default" : "outline",
					size: "sm",
					onClick: () => setShowExportPanel((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1.5 size-4" }), showExportPanel ? "Hide Export" : "Export Billing"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/laundry/assign",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-1.5 size-4" }), " Assign Students"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/laundry",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Laundry"]
					})
				})
			]
		}),
		children: [
			showExportPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "Export Laundry Billing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Generates a professionally formatted Excel sheet matching the NIVASI SPACE billing template. Rate: ₹80/Kg."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-xl border border-border overflow-hidden",
						children: [
							{
								key: "current",
								label: "Current Week"
							},
							{
								key: "select",
								label: "Select Week"
							},
							{
								key: "all",
								label: "All Weeks"
							}
						].map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setExportMode(key);
								if (key === "current") {
									setExportStart(currentWeekBounds.weekStart);
									setExportEnd(currentWeekBounds.weekEnd);
								}
							},
							className: `flex-1 px-3 py-2 text-xs font-semibold transition-colors ${exportMode === key ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60"}`,
							children: label
						}, key))
					}),
					exportMode === "current" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/30 border border-border/60 px-3 py-2.5 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Week:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: ["Week ", getWeekId(currentWeekBounds.weekStart).split("-W")[1] ?? ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Period:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: formatWeekRange(currentWeekBounds.weekStart, currentWeekBounds.weekEnd)
									})]
								}),
								!exportFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Pickups in week:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: exportPreviewRows.length
										})]
									}),
									exportPreviewRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "With weight recorded:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [
												exportRowsWithWeight,
												" of ",
												exportPreviewRows.length
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Fixed Rate:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary",
											children: "₹80 / Kg"
										})]
									})
								] }),
								exportFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Loading records..."]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							id: "export-laundry-billing-current-btn",
							onClick: handleExport,
							disabled: exporting || exportFetching,
							className: "w-full",
							children: exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Generating Excel…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 size-4" }), " Export Current Week"] })
						})]
					}),
					exportMode === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Week Start Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: exportStart,
										onChange: (e) => {
											setExportStart(e.target.value);
											if (e.target.value) {
												const d = new Date(e.target.value);
												d.setDate(d.getDate() + 6);
												setExportEnd(d.toISOString().slice(0, 10));
											}
										},
										className: "w-full h-9 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer outline-none focus:ring-1 focus:ring-ring"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Week End Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: exportEnd,
										min: exportStart,
										onChange: (e) => setExportEnd(e.target.value),
										className: "w-full h-9 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer outline-none focus:ring-1 focus:ring-ring"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [
									-3,
									-2,
									-1,
									0
								].map((offset) => {
									const d = new Date(today);
									d.setDate(d.getDate() + offset * 7);
									const { weekStart, weekEnd } = getWeekBounds(d.toISOString().slice(0, 10));
									const wNum = getWeekId(weekStart).split("-W")[1] ?? "";
									const label = offset === 0 ? "This week" : offset === -1 ? "Last week" : `${Math.abs(offset)} weeks ago`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setExportStart(weekStart);
											setExportEnd(weekEnd);
										},
										className: `rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-colors ${exportStart === weekStart && exportEnd === weekEnd ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"}`,
										children: [
											label,
											" (W",
											wNum,
											")"
										]
									}, offset);
								})
							}),
							exportFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Loading records..."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/30 border border-border/60 px-3 py-2.5 text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Period:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: formatWeekRange(exportStart, exportEnd)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Pickups in range:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: exportPreviewRows.length
										})]
									}),
									exportPreviewRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "With weight recorded:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [
												exportRowsWithWeight,
												" of ",
												exportPreviewRows.length
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Fixed Rate:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary",
											children: "₹80 / Kg"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								id: "export-laundry-billing-select-btn",
								onClick: handleExport,
								disabled: exporting || exportFetching,
								className: "w-full",
								children: exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Generating Excel…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 size-4" }), " Export Selected Week"] })
							})
						]
					}),
					exportMode === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/30 border border-border/60 px-3 py-2.5 text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Range:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Last 12 weeks"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Format:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "One sheet per week"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Fixed Rate:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary",
											children: "₹80 / Kg"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Exports all weeks with recorded billing data into a single Excel workbook. Each week gets its own sheet with the standard NIVASI SPACE billing format."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								id: "export-laundry-billing-all-btn",
								onClick: handleExportAllWeeks,
								disabled: exporting,
								className: "w-full",
								children: exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Generating All Weeks…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 size-4" }), " Export All Weeks"] })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							className: "size-8",
							onClick: () => shiftDate(-1),
							"aria-label": "Previous day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: selectedDate,
								onChange: (e) => setSelectedDate(e.target.value),
								className: "cursor-pointer bg-transparent text-sm font-semibold outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							className: "size-8",
							onClick: () => shiftDate(1),
							"aria-label": "Next day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						}),
						selectedDate !== today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							className: "h-8 text-xs font-medium",
							onClick: () => setSelectedDate(today),
							children: "Today"
						}),
						selectedDate === today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[11px] bg-primary/10 text-primary border-primary/30",
							children: "Today"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Showing status and clothes weights for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedDate })]
				})]
			}),
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Picked Up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-success",
								children: summary.pickup["picked_up"] ?? 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Pickups Done"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Delivered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-success",
								children: summary.delivery["picked_up"] ?? 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Deliveries Done"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center col-span-2 sm:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Pending / Default Skipped"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-amber-600 dark:text-amber-400",
								children: students.length > 0 ? Math.max(0, students.length - (summary.pickup["picked_up"] ?? 0)) : summary.pickup["pending"] ?? 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Remaining Students"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search student, phone, property…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: statusFilter,
					onValueChange: setStatusFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Laundry status" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "paused",
							children: "Paused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "cancelled",
							children: "Cancelled"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: search || statusFilter !== "all" ? "No students match your filters." : "No students assigned to this laundry yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/laundry/assign",
								children: "Assign Students"
							})
						})
					]
				}) : filtered.map((student) => {
					const mapUrl = getMapUrl(student, rooms, properties);
					const pickupRecord = getPickup(student.id, "pickup");
					const deliveryRecord = getPickup(student.id, "delivery");
					const rawStatus = student.laundryStatus;
					const lStatus = rawStatus === "paused" || rawStatus === "cancelled" ? rawStatus : "active";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold",
												children: student.fullName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: `text-[11px] capitalize ${lStatus === "active" ? "border-success/30 bg-success/10 text-success" : lStatus === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
												children: ["Laundry: ", lStatus]
											})]
										}),
										student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${student.phoneNumber}`,
											className: "mt-0.5 flex items-center gap-1.5 text-sm text-primary hover:underline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), student.phoneNumber]
										}),
										student.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-sm text-muted-foreground",
											children: [student.propertyName, student.roomNumber ? ` · Room ${student.roomNumber}` : ""]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "shrink-0 h-8 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10",
											onClick: () => setDialogStudent(student),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date & History" })]
										}),
										student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											size: "sm",
											className: "shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `tel:${student.phoneNumber}`,
												"aria-label": `Call ${student.fullName}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-3.5" }), " Call"]
											})
										}),
										mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											size: "sm",
											className: "shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: mapUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5" }), " Map"]
											})
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-warning-foreground" }), "Pickup Status"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: pickupRecord?.status === "picked_up" ? "picked_up" : "pending",
										onValueChange: (v) => setPickupStatus(student, "pickup", v),
										disabled: updatingKey === `${student.id}-pickup` || lStatus === "cancelled",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: `h-9 text-xs font-semibold ${STATUS_COLORS[pickupRecord?.status === "picked_up" ? "picked_up" : "pending"]}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pending",
											children: "Pending"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "picked_up",
											children: "Picked Up"
										})] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success" }), "Delivery Status"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: deliveryRecord?.status === "picked_up" || deliveryRecord?.status === "delivered" ? "picked_up" : "pending",
										onValueChange: (v) => setPickupStatus(student, "delivery", v),
										disabled: updatingKey === `${student.id}-delivery` || lStatus === "cancelled",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: `h-9 text-xs font-semibold ${STATUS_COLORS[deliveryRecord?.status === "picked_up" || deliveryRecord?.status === "delivered" ? "picked_up" : "pending"]}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pending",
											children: "Pending"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "picked_up",
											children: "Delivered"
										})] })]
									})]
								})]
							}),
							(() => {
								const currentWeight = weightMap[student.id] ?? weightMap[`${student.id}-pickup`] ?? pickupRecord?.clothesWeight ?? deliveryRecord?.clothesWeight ?? "";
								const currentNotes = notesMap[student.id] ?? notesMap[`${student.id}-pickup`] ?? pickupRecord?.notes ?? deliveryRecord?.notes ?? "";
								const isSavingDetails = updatingKey === `${student.id}-details`;
								const weightNum = parseFloat(currentWeight);
								const estimatedCost = !isNaN(weightNum) && weightNum > 0 ? (weightNum * 80).toFixed(2) : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5 text-primary" }),
													"Order Details (",
													selectedDate,
													")"
												]
											}), estimatedCost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20",
												children: [
													weightNum,
													" kg · ₹",
													estimatedCost,
													" (@ ₹80/kg)"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[11px] font-medium text-muted-foreground flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3 text-primary" }), " Weight of Clothes"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0",
														step: "0.1",
														placeholder: "e.g. 2.5",
														value: currentWeight,
														onChange: (e) => {
															const val = e.target.value;
															setWeightMap((prev) => ({
																...prev,
																[student.id]: val,
																[`${student.id}-pickup`]: val,
																[`${student.id}-delivery`]: val
															}));
														},
														className: "h-9 text-xs sm:text-sm bg-background pr-10 font-medium"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "pointer-events-none absolute right-3 text-xs font-semibold text-muted-foreground",
														children: "kg"
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[11px] font-medium text-muted-foreground flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3 text-primary" }), " Clothes Count / Notes"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "text",
													placeholder: "e.g. 5 clothes (3 shirts, 2 pants)",
													value: currentNotes,
													onChange: (e) => {
														const val = e.target.value;
														setNotesMap((prev) => ({
															...prev,
															[student.id]: val,
															[`${student.id}-pickup`]: val,
															[`${student.id}-delivery`]: val
														}));
													},
													className: "h-9 text-xs sm:text-sm bg-background"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "default",
											onClick: () => saveStudentDetails(student),
											disabled: isSavingDetails || lStatus === "cancelled",
											className: "w-full h-11 font-semibold text-sm shadow-sm gap-2 mt-1 bg-primary text-primary-foreground hover:bg-primary/90",
											children: isSavingDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Saving Details..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Save Details"] })
										})
									]
								});
							})()
						]
					}, student.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentLaundryDialog, {
				open: !!dialogStudent,
				onClose: () => setDialogStudent(null),
				student: dialogStudent,
				laundryId,
				laundryName: laundry?.laundryName,
				employeeId: "admin",
				initialDate: selectedDate
			})
		]
	});
}
//#endregion
export { LaundryStudentsPage as component };
