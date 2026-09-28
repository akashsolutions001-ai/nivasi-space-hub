import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { i as useIsGlobalAdmin, n as useAuth } from "./auth-C-wItvgy.mjs";
import { Nt as useMesses, Pt as usePackages, Rt as useProperties, dt as useAllLeaveRequests, ut as useAdmissions, xt as useLaundries } from "./hooks-LYI2QAXV.mjs";
import { A as Printer, G as IndianRupee, M as Phone, T as Search, at as CircleCheck, et as Download, gt as CalendarOff, i as WashingMachine, mt as Calendar, o as UtensilsCrossed, s as Users, yt as Building2 } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-XA26k4Ve.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as formatDate, r as formatINR } from "./format-CWXVlUmU.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BiHV7YXM.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C2pytTEu.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-Ch6AhRnq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function escapeCsv(cell) {
	return `"${(cell == null ? "" : String(cell)).replace(/"/g, "\"\"")}"`;
}
function downloadCsv(filename, headers, rows) {
	const csv = "﻿" + [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function getStudentLeaveDaysInMonth(studentId, year, month, leaves) {
	const monthStartStr = `${year}-${String(month).padStart(2, "0")}-01`;
	const totalDays = new Date(year, month, 0).getDate();
	const monthEndStr = `${year}-${String(month).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
	let leaveDays = 0;
	const leaveSpans = [];
	const studentApprovedLeaves = leaves.filter((l) => l.studentId === studentId && l.status === "approved");
	for (const l of studentApprovedLeaves) {
		if (!l.fromDate || l.fromDate > monthEndStr) continue;
		const leaveTo = l.toDate || monthEndStr;
		if (leaveTo < monthStartStr) continue;
		const start = l.fromDate < monthStartStr ? monthStartStr : l.fromDate;
		const end = leaveTo > monthEndStr ? monthEndStr : leaveTo;
		const d1 = new Date(start);
		const d2 = new Date(end);
		const days = Math.round((d2.getTime() - d1.getTime()) / 864e5) + 1;
		if (days > 0) {
			leaveDays += days;
			leaveSpans.push(`${formatDate(start)} to ${formatDate(end)} (${days}d: ${l.reason || "Leave"})`);
		}
	}
	leaveDays = Math.min(leaveDays, totalDays);
	return {
		leaveDays,
		leaveSpans
	};
}
function ReportsPage() {
	const { data: rawAdmissions = [], isLoading: admissionsLoading } = useAdmissions();
	const { data: messes = [], isLoading: messesLoading } = useMesses();
	const { data: laundries = [], isLoading: laundriesLoading } = useLaundries();
	const { data: properties = [], isLoading: propertiesLoading } = useProperties();
	const { data: packages = [] } = usePackages();
	const { data: allLeaves = [], isLoading: leavesLoading } = useAllLeaveRequests();
	const isGlobalAdmin = useIsGlobalAdmin();
	const { collegeFilter } = useAuth();
	const [activeTab, setActiveTab] = (0, import_react.useState)("all-students");
	const [messMonth, setMessMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth() + 1);
	const [messYear, setMessYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedProperty, setSelectedProperty] = (0, import_react.useState)("all");
	const [selectedPaymentStatus, setSelectedPaymentStatus] = (0, import_react.useState)("all");
	const [selectedMess, setSelectedMess] = (0, import_react.useState)("all");
	const [selectedLaundry, setSelectedLaundry] = (0, import_react.useState)("all");
	const [selectedTiffinStatus, setSelectedTiffinStatus] = (0, import_react.useState)("all");
	const admissions = (0, import_react.useMemo)(() => {
		if (!isGlobalAdmin || !collegeFilter.college) return rawAdmissions;
		return rawAdmissions.filter((a) => a.collegeName === collegeFilter.college);
	}, [
		rawAdmissions,
		isGlobalAdmin,
		collegeFilter.college
	]);
	const stats = (0, import_react.useMemo)(() => {
		const total = admissions.length;
		let paidCount = 0;
		let pendingCount = 0;
		let totalRevenue = 0;
		let collectedAmount = 0;
		let balanceDue = 0;
		let activeMessCount = 0;
		let vegCount = 0;
		let nonVegCount = 0;
		let activeLaundryCount = 0;
		let bagsDelivered = 0;
		let tiffinsDelivered = 0;
		let mattressesRequired = 0;
		for (const a of admissions) {
			if (a.paymentStatus === "completed") paidCount++;
			else pendingCount++;
			totalRevenue += a.packageAmount || 0;
			collectedAmount += a.amountPaid || 0;
			balanceDue += Math.max(0, a.balanceAmount || 0);
			if (a.messId || a.messName) {
				if (a.tiffinStatus === "active") activeMessCount++;
				const pref = (a.mealPreference || "").toLowerCase();
				if (pref.includes("non")) nonVegCount++;
				else if (pref.includes("veg")) vegCount++;
			}
			if ((a.laundryId || a.laundryName) && a.laundryStatus === "active") activeLaundryCount++;
			if (a.bagProvided) bagsDelivered++;
			if (a.tiffinProvided) tiffinsDelivered++;
			if (a.mattressRequired) mattressesRequired++;
		}
		const collectionPercentage = totalRevenue > 0 ? Math.round(collectedAmount / totalRevenue * 100) : 0;
		return {
			total,
			paidCount,
			pendingCount,
			totalRevenue,
			collectedAmount,
			balanceDue,
			collectionPercentage,
			activeMessCount,
			vegCount,
			nonVegCount,
			activeLaundryCount,
			bagsDelivered,
			tiffinsDelivered,
			mattressesRequired
		};
	}, [admissions]);
	const filteredStudents = (0, import_react.useMemo)(() => {
		return admissions.filter((a) => {
			if (search.trim()) {
				const q = search.toLowerCase();
				const matchesName = a.fullName?.toLowerCase().includes(q);
				const matchesId = a.admissionId?.toLowerCase().includes(q);
				const matchesPhone = a.phoneNumber?.includes(q) || a.parentPhone?.includes(q);
				const matchesEmail = a.email?.toLowerCase().includes(q);
				const matchesRoom = a.roomNumber?.toLowerCase().includes(q);
				if (!matchesName && !matchesId && !matchesPhone && !matchesEmail && !matchesRoom) return false;
			}
			if (selectedProperty !== "all" && a.propertyId !== selectedProperty) return false;
			if (selectedPaymentStatus !== "all" && a.paymentStatus !== selectedPaymentStatus) return false;
			if (selectedMess !== "all" && a.messId !== selectedMess) return false;
			if (selectedLaundry !== "all" && a.laundryId !== selectedLaundry) return false;
			if (selectedTiffinStatus !== "all" && a.tiffinStatus !== selectedTiffinStatus) return false;
			return true;
		});
	}, [
		admissions,
		search,
		selectedProperty,
		selectedPaymentStatus,
		selectedMess,
		selectedLaundry,
		selectedTiffinStatus
	]);
	const exportMasterCsv = () => {
		const headers = [
			"Sr No",
			"Admission ID",
			"Full Name",
			"Student Mobile",
			"Parent Mobile",
			"Parent Name",
			"Relation",
			"Email",
			"Gender",
			"Date of Birth",
			"College Name",
			"Course",
			"Year",
			"Property / PG",
			"Room Number",
			"Bed Number",
			"Admission Date",
			"Move In Date",
			"Package Name",
			...isGlobalAdmin ? [
				"Package Fee (INR)",
				"Amount Paid (INR)",
				"Balance Due (INR)"
			] : [],
			"Payment Status",
			"Payment Mode",
			"Mess Provider",
			"Tiffin Status",
			"Meal Preference",
			"Laundry Provider",
			"Laundry Status",
			"Bag Provided",
			"Tiffin Box Provided",
			"Mattress Required"
		];
		const rows = admissions.map((a, i) => [
			i + 1,
			a.admissionId || a.id,
			a.fullName || "",
			a.phoneNumber || "",
			a.parentPhone || "",
			a.parentName || "",
			a.parentRelation || "",
			a.email || "",
			a.gender || "",
			a.dateOfBirth ? formatDate(a.dateOfBirth) : "",
			a.collegeName || "",
			a.course || "",
			a.year || "",
			a.propertyName || "",
			a.roomNumber || "",
			a.bedNumber || "",
			a.admissionDate ? formatDate(a.admissionDate) : "",
			a.moveInDate ? formatDate(a.moveInDate) : "",
			a.packageName || "",
			...isGlobalAdmin ? [
				a.packageAmount || 0,
				a.amountPaid || 0,
				a.balanceAmount || 0
			] : [],
			a.paymentStatus || "pending",
			a.paymentMode || "",
			a.messName || "Unassigned",
			a.tiffinStatus || "none",
			a.mealPreference || "",
			a.laundryName || "Unassigned",
			a.laundryStatus || "none",
			a.bagProvided ? "Yes" : "No",
			a.tiffinProvided ? "Yes" : "No",
			a.mattressRequired ? "Yes" : "No"
		]);
		downloadCsv(`nivasispace_master_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, headers, rows);
	};
	const exportMessCsv = () => {
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const headers = [
			"Sr No",
			"Admission ID",
			"Student Name",
			"Student Phone",
			"Property",
			"Room",
			"Mess Provider",
			"Tiffin Status",
			"Meal Preference",
			"Today's Leave Status",
			"Tiffin Box Provided",
			"Admission Date"
		];
		const rows = admissions.filter((a) => a.messId || a.messName).map((a, i) => {
			const leave = allLeaves.find((l) => l.studentId === a.id && l.status === "approved" && l.fromDate <= today && (!l.toDate || l.toDate >= today));
			return [
				i + 1,
				a.admissionId,
				a.fullName,
				a.phoneNumber,
				a.propertyName || "",
				a.roomNumber || "",
				a.messName || "",
				a.tiffinStatus || "none",
				a.mealPreference || "Veg",
				leave ? `On Leave (${formatDate(leave.fromDate)} to ${leave.toDate ? formatDate(leave.toDate) : "TBD"})` : "Present",
				a.tiffinProvided ? "Yes" : "No",
				a.admissionDate ? formatDate(a.admissionDate) : ""
			];
		});
		downloadCsv(`nivasispace_mess_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, headers, rows);
	};
	const exportMonthlyMessAndLeavesCsv = () => {
		const totalDaysInMonth = new Date(messYear, messMonth, 0).getDate();
		const monthName = new Date(messYear, messMonth - 1, 1).toLocaleString("en-IN", {
			month: "long",
			year: "numeric"
		});
		const headers = [
			"Sr No",
			"Admission ID",
			"Student Name",
			"Student Phone",
			"Property",
			"Room Number",
			"Assigned Mess",
			"Meal Preference",
			"Billing Month",
			"Days in Month",
			"Days on Approved Leave",
			"Net Active Mess Days (Served)",
			"Mess Attendance %",
			"Leave Periods & Details"
		];
		const rows = admissions.filter((a) => selectedMess === "all" ? a.messId || a.messName : a.messId === selectedMess).map((a, i) => {
			const { leaveDays, leaveSpans } = getStudentLeaveDaysInMonth(a.id, messYear, messMonth, allLeaves);
			const netDays = Math.max(0, totalDaysInMonth - leaveDays);
			const attPct = totalDaysInMonth > 0 ? (netDays / totalDaysInMonth * 100).toFixed(1) + "%" : "100%";
			return [
				i + 1,
				a.admissionId,
				a.fullName,
				a.phoneNumber || "",
				a.propertyName || "",
				a.roomNumber || "",
				a.messName || "Unassigned",
				a.mealPreference || "Veg",
				monthName,
				totalDaysInMonth,
				leaveDays,
				netDays,
				attPct,
				leaveSpans.join(" | ") || "No leaves taken"
			];
		});
		downloadCsv(`nivasispace_monthly_mess_leaves_${messYear}_${String(messMonth).padStart(2, "0")}.csv`, headers, rows);
	};
	const exportLaundryCsv = () => {
		const headers = [
			"Sr No",
			"Admission ID",
			"Student Name",
			"Student Phone",
			"Property",
			"Room",
			"Laundry Provider",
			"Subscription Status",
			"Package Allotted",
			"Laundry Bag Provided",
			"Admission Date"
		];
		const rows = admissions.filter((a) => a.laundryId || a.laundryName).map((a, i) => [
			i + 1,
			a.admissionId,
			a.fullName,
			a.phoneNumber,
			a.propertyName || "",
			a.roomNumber || "",
			a.laundryName || "",
			a.laundryStatus || "none",
			a.packageName || "",
			a.bagProvided ? "Yes" : "No",
			a.admissionDate ? formatDate(a.admissionDate) : ""
		]);
		downloadCsv(`nivasispace_laundry_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, headers, rows);
	};
	const exportFinancialCsv = () => {
		const headers = [
			"Sr No",
			"Admission ID",
			"Student Name",
			"Student Phone",
			"Parent Phone",
			"Property / PG",
			"Room",
			"Package Name",
			"Total Package (INR)",
			"Amount Paid (INR)",
			"Balance Due (INR)",
			"Payment Status",
			"Payment Mode"
		];
		const rows = admissions.map((a, i) => [
			i + 1,
			a.admissionId,
			a.fullName,
			a.phoneNumber,
			a.parentPhone,
			a.propertyName || "",
			a.roomNumber || "",
			a.packageName || "",
			a.packageAmount || 0,
			a.amountPaid || 0,
			a.balanceAmount || 0,
			a.paymentStatus || "pending",
			a.paymentMode || ""
		]);
		downloadCsv(`nivasispace_financial_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, headers, rows);
	};
	if (admissionsLoading || messesLoading || laundriesLoading || propertiesLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Reports & Analytics",
		subtitle: "Loading system reports...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					1,
					2,
					3,
					4
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, n))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-2xl" })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Reports & Analytics",
		subtitle: `Complete system data across ${stats.total} student admissions, mess, laundry, and financial operations.`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => window.print(),
				className: "hidden sm:inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: exportMasterCsv,
				size: "sm",
				className: "gradient-brand text-primary-foreground shadow-soft inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export All Data (CSV)"]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 pb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Total Enrolled"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold",
									children: stats.total
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-600 font-semibold",
											children: [stats.paidCount, " paid"]
										}),
										" • ",
										stats.pendingCount,
										" pending fee"
									]
								})]
							})]
						}),
						isGlobalAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Total Collected"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold text-emerald-600",
										children: formatINR(stats.collectedAmount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-muted-foreground mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Due: ", formatINR(stats.balanceDue)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [stats.collectionPercentage, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: stats.collectionPercentage,
										className: "h-1 mt-1 bg-muted"
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Fee Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-2xl font-bold text-emerald-600",
									children: [stats.paidCount, " Paid"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: [stats.pendingCount, " students have pending fees"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Mess & Tiffins"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-amber-600",
									children: stats.activeMessCount
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: [
										"Active tiffins (",
										stats.vegCount,
										" Veg, ",
										stats.nonVegCount,
										" Non-Veg)"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Active Laundry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-sky-600",
									children: stats.activeLaundryCount
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Active student laundry subscriptions"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-card border border-border/80 rounded-2xl p-4 shadow-soft space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search by student name, ID, phone, email, or room...",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "pl-9 h-10 rounded-xl"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedProperty,
									onValueChange: setSelectedProperty,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
										className: "w-[160px] h-10 rounded-xl text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 mr-1.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Property" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Properties"
									}), properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.propertyName
									}, p.id))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedPaymentStatus,
									onValueChange: setSelectedPaymentStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[140px] h-10 rounded-xl text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Payment" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Payments"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "completed",
											children: "Paid in Full"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pending",
											children: "Pending Dues"
										})
									] })]
								}),
								(search || selectedProperty !== "all" || selectedPaymentStatus !== "all" || selectedMess !== "all" || selectedLaundry !== "all" || selectedTiffinStatus !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setSearch("");
										setSelectedProperty("all");
										setSelectedPaymentStatus("all");
										setSelectedMess("all");
										setSelectedLaundry("all");
										setSelectedTiffinStatus("all");
									},
									className: "h-10 text-xs px-2.5 text-muted-foreground hover:text-foreground",
									children: "Clear Filters"
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: activeTab,
					onValueChange: setActiveTab,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 overflow-x-auto pb-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "bg-muted/70 p-1 rounded-xl h-auto flex flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "all-students",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
											"Students & Admissions (",
											filteredStudents.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "mess-report",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5" }), "Mess & Tiffins"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "monthly-mess",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "size-3.5" }), "Monthly Mess & Leaves"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "laundry-report",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-3.5" }), "Laundry Operations"]
									}),
									isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "financial-report",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-3.5" }), "Fee & Dues Collection"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "property-report",
										className: "rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5" }), "Property Occupancy"]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "all-students",
							className: "space-y-4 m-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border/80 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: "Student Admissions Directory"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
										className: "text-xs",
										children: [
											"Showing ",
											filteredStudents.length,
											" of ",
											admissions.length,
											" registered students"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: exportMasterCsv,
										className: "gap-1.5 text-xs h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Download CSV"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 text-muted-foreground border-b border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Student / ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Contact Info"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Stay / Property"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "College & Course"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: isGlobalAdmin ? "Package & Fee" : "Package & Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Mess Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Laundry Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Items Given"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold text-right",
													children: "Action"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/60",
											children: filteredStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 9,
												className: "py-8 text-center text-muted-foreground",
												children: "No students matched your search criteria."
											}) }) : filteredStudents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/admin/admissions/$admissionId",
															params: { admissionId: a.id },
															className: "font-medium text-foreground hover:text-primary transition-colors block",
															children: a.fullName
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground font-mono",
															children: a.admissionId
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1 text-foreground",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.phoneNumber || "—" })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground truncate block max-w-[130px]",
															children: a.email || "No email"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium text-foreground block truncate max-w-[120px]",
															children: a.propertyName || "—"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-muted-foreground",
															children: [
																"Room: ",
																a.roomNumber || "—",
																" ",
																a.bedNumber ? `• Bed ${a.bedNumber}` : ""
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3 max-w-[150px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate block font-medium text-foreground",
															children: a.collegeName || "—"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground truncate block",
															children: a.course || "—"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: isGlobalAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-semibold text-foreground",
															children: formatINR(a.packageAmount || 0)
														}), a.paymentStatus === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 h-4",
															children: "Paid"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-rose-600 font-medium",
															children: ["Due: ", formatINR(a.balanceAmount || 0)]
														})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-medium text-foreground",
															children: a.packageName || "Standard"
														}), a.paymentStatus === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 h-4",
															children: "Paid"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 h-4",
															children: "Pending"
														})] })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium block truncate max-w-[100px]",
															children: a.messName || "Unassigned"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground",
															children: a.tiffinStatus === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-emerald-600 font-medium",
																children: [
																	"Tiffin Active (",
																	a.mealPreference || "Veg",
																	")"
																]
															}) : "Inactive"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium block truncate max-w-[100px]",
															children: a.laundryName || "Unassigned"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground",
															children: a.laundryStatus === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-sky-600 font-medium",
																children: "Active"
															}) : "Inactive"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex gap-1",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	title: "Laundry Bag",
																	className: `size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${a.bagProvided ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`,
																	children: "B"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	title: "Tiffin Box",
																	className: `size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${a.tiffinProvided ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`,
																	children: "T"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	title: "Mattress",
																	className: `size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${a.mattressRequired ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`,
																	children: "M"
																})
															]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/admin/admissions/$admissionId",
															params: { admissionId: a.id },
															className: "text-xs font-medium text-primary hover:underline",
															children: "View Details"
														})
													})
												]
											}, a.id))
										})]
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "mess-report",
							className: "space-y-4 m-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: messes.map((m) => {
									const assigned = admissions.filter((a) => a.messId === m.id || a.messName?.toLowerCase() === m.messName?.toLowerCase());
									const activeTiffins = assigned.filter((a) => a.tiffinStatus === "active").length;
									const veg = assigned.filter((a) => (a.mealPreference || "").toLowerCase() === "veg").length;
									const nonVeg = assigned.filter((a) => (a.mealPreference || "").toLowerCase().includes("non")).length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border border-border/80 shadow-soft",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
											className: "p-4 pb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-base font-semibold",
													children: m.messName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "bg-amber-50 text-amber-700 border-amber-200",
													children: [activeTiffins, " Active Tiffins"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
												className: "text-xs",
												children: [
													"Owner: ",
													m.ownerName || "—",
													" • ",
													m.ownerPhone || "—"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "p-4 pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground text-[10px]",
														children: "Total Enrolled"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-foreground text-sm",
														children: assigned.length
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground text-[10px]",
														children: "Pure Veg"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-emerald-600 text-sm",
														children: veg
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground text-[10px]",
														children: "Non-Veg"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-amber-600 text-sm",
														children: nonVeg
													})] })
												]
											})
										})]
									}, m.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border/80 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: "Mess & Tiffin Subscriber Register"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "List of students assigned to messes with current delivery and meal choices"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: exportMessCsv,
										className: "gap-1.5 text-xs h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export Mess CSV"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 text-muted-foreground border-b border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Student Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Admission ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Phone"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Property & Room"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Assigned Mess"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Tiffin Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Meal Preference"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Tiffin Box"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/60",
											children: admissions.filter((a) => selectedMess === "all" ? true : a.messId === selectedMess).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 font-medium text-foreground",
														children: a.fullName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-mono text-muted-foreground",
														children: a.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.phoneNumber || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [
															a.propertyName || "—",
															" ",
															a.roomNumber ? `(Rm ${a.roomNumber})` : ""
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-medium",
														children: a.messName || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.tiffinStatus === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]",
															children: "Active"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-muted text-muted-foreground text-[10px]",
															children: a.tiffinStatus || "None"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `px-2 py-0.5 rounded text-[11px] font-medium ${(a.mealPreference || "").toLowerCase().includes("non") ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`,
															children: a.mealPreference || "Veg"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4",
														children: a.tiffinProvided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-emerald-600 font-medium",
															children: "Provided"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-amber-600",
															children: "Pending"
														})
													})
												]
											}, a.id))
										})]
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "monthly-mess",
							className: "space-y-4 m-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5 whitespace-nowrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }), "Billing Month:"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(messMonth),
												onValueChange: (val) => setMessMonth(Number(val)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-[140px] rounded-xl text-xs h-9",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "rounded-xl text-xs",
													children: [
														"January",
														"February",
														"March",
														"April",
														"May",
														"June",
														"July",
														"August",
														"September",
														"October",
														"November",
														"December"
													].map((name, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: String(idx + 1),
														children: name
													}, name))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(messYear),
												onValueChange: (val) => setMessYear(Number(val)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-[100px] rounded-xl text-xs h-9",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "rounded-xl text-xs",
													children: [
														2024,
														2025,
														2026,
														2027,
														2028
													].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: String(y),
														children: y
													}, y))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: selectedMess,
												onValueChange: setSelectedMess,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
													className: "w-[170px] rounded-xl text-xs h-9",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5 mr-1.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Messes" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
													className: "rounded-xl text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "all",
														children: "All Mess Providers"
													}), messes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: m.id,
														children: m.messName
													}, m.id))]
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: exportMonthlyMessAndLeavesCsv,
										size: "sm",
										className: "gradient-brand text-white shadow-soft gap-1.5 text-xs h-9",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Download Monthly Report (CSV)"]
									})]
								})
							}), (() => {
								const daysInMonth = new Date(messYear, messMonth, 0).getDate();
								const monthlyStudents = admissions.filter((a) => selectedMess === "all" ? a.messId || a.messName : a.messId === selectedMess).map((s) => {
									const { leaveDays, leaveSpans } = getStudentLeaveDaysInMonth(s.id, messYear, messMonth, allLeaves);
									const netDays = Math.max(0, daysInMonth - leaveDays);
									const pref = (s.mealPreference || "veg").toLowerCase().includes("non") ? "non-veg" : "veg";
									return {
										...s,
										leaveDays,
										netDays,
										leaveSpans,
										pref
									};
								});
								const totalEnrolled = monthlyStudents.length;
								const totalPossibleDays = totalEnrolled * daysInMonth;
								const totalLeaveDaysDeducted = monthlyStudents.reduce((acc, s) => acc + s.leaveDays, 0);
								const totalNetDaysServed = monthlyStudents.reduce((acc, s) => acc + s.netDays, 0);
								const totalVegDays = monthlyStudents.filter((s) => s.pref === "veg").reduce((acc, s) => acc + s.netDays, 0);
								const totalNonVegDays = monthlyStudents.filter((s) => s.pref === "non-veg").reduce((acc, s) => acc + s.netDays, 0);
								const attendanceRate = totalPossibleDays > 0 ? Math.round(totalNetDaysServed / totalPossibleDays * 100) : 100;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
													children: "Enrolled Students"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold font-display mt-1 text-foreground",
													children: totalEnrolled
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: [daysInMonth, " calendar days in month"]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-soft",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold uppercase tracking-wider text-destructive",
													children: "✈️ Leave Days Deducted"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold font-display mt-1 text-destructive",
													children: totalLeaveDaysDeducted
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: "Meals saved via approved leave"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-soft",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold uppercase tracking-wider text-primary",
													children: "🍽️ Net Mess Days Served"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold font-display mt-1 text-primary",
													children: totalNetDaysServed
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: "Billable student-days"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-soft",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300",
													children: "🟢 Veg Portions"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold font-display mt-1 text-emerald-700 dark:text-emerald-400",
													children: totalVegDays
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: "Veg student-days served"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-soft",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300",
													children: "🍗 Non-Veg Portions"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold font-display mt-1 text-amber-700 dark:text-amber-400",
													children: totalNonVegDays
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: "Non-Veg student-days served"
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border border-border/80 shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-base font-semibold",
											children: [
												"Monthly Student Mess & Leave Register —",
												" ",
												new Date(messYear, messMonth - 1, 1).toLocaleString("en-IN", {
													month: "long",
													year: "numeric"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
											className: "text-xs",
											children: [
												"Per-student breakdown of calendar days, approved leaves deducted, and net meal days. Overall attendance: ",
												attendanceRate,
												"%."
											]
										})] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-left text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "bg-muted/50 text-muted-foreground border-b border-border/60",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-4 font-semibold",
														children: "Student / ID"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold",
														children: "Property & Room"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold",
														children: "Mess Provider"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold",
														children: "Meal Preference"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold text-center",
														children: "Month Days"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold text-center",
														children: "Leave Days"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold text-center",
														children: "Net Mess Days"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-semibold text-center",
														children: "Attendance %"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-4 font-semibold",
														children: "Leave Periods in Month"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
												className: "divide-y divide-border/60",
												children: monthlyStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 9,
													className: "py-8 text-center text-muted-foreground",
													children: "No mess subscribers found for the selected filters."
												}) }) : monthlyStudents.map((s) => {
													const attPct = daysInMonth > 0 ? Math.round(s.netDays / daysInMonth * 100) : 100;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "hover:bg-muted/30 transition-colors",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "py-2.5 px-4",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold text-foreground block",
																	children: s.fullName
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-muted-foreground font-mono",
																	children: s.admissionId
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "py-2.5 px-3",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-foreground",
																	children: s.propertyName || "—"
																}), s.roomNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-[10px] text-muted-foreground block",
																	children: ["Rm ", s.roomNumber]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-3 font-medium text-foreground",
																children: s.messName || "Unassigned"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-3",
																children: s.pref === "veg" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]",
																	children: "🟢 Pure Veg"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: "bg-amber-50 text-amber-700 border-amber-200 text-[10px]",
																	children: "🍗 Non-Veg"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-3 text-center font-mono",
																children: daysInMonth
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-3 text-center",
																children: s.leaveDays > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
																	variant: "outline",
																	className: "bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold",
																	children: [
																		"-",
																		s.leaveDays,
																		" days"
																	]
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground",
																	children: "0"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "py-2.5 px-3 text-center font-bold text-foreground font-mono",
																children: [s.netDays, " days"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-3 text-center font-mono",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: `px-2 py-0.5 rounded text-[11px] font-bold ${attPct >= 85 ? "text-emerald-700 bg-emerald-50" : attPct >= 65 ? "text-amber-700 bg-amber-50" : "text-destructive bg-destructive/10"}`,
																	children: [attPct, "%"]
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-2.5 px-4",
																children: s.leaveSpans.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "space-y-1",
																	children: s.leaveSpans.map((span, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[11px] text-destructive bg-destructive/5 px-2 py-0.5 rounded block max-w-sm truncate",
																		title: span,
																		children: span
																	}, idx))
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-[11px]",
																	children: "No leaves taken"
																})
															})
														]
													}, s.id);
												})
											})]
										})
									})]
								})] });
							})()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "laundry-report",
							className: "space-y-4 m-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: laundries.map((l) => {
									const assigned = admissions.filter((a) => a.laundryId === l.id || a.laundryName?.toLowerCase() === l.laundryName?.toLowerCase());
									const active = assigned.filter((a) => a.laundryStatus === "active").length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border border-border/80 shadow-soft",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
											className: "p-4 pb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-base font-semibold",
													children: l.laundryName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "bg-sky-50 text-sky-700 border-sky-200",
													children: [active, " Active Subscriptions"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
												className: "text-xs",
												children: [
													"Owner: ",
													l.ownerName || "—",
													" • ",
													l.ownerPhone || "—"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "p-4 pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted-foreground text-[10px]",
													children: "Total Assigned"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-foreground text-sm",
													children: assigned.length
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted-foreground text-[10px]",
													children: "Active Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-sky-600 text-sm",
													children: active
												})] })]
											})
										})]
									}, l.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border/80 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: "Student Laundry Allocation Register"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Assigned students, active subscription status, and laundry bag handovers"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: exportLaundryCsv,
										className: "gap-1.5 text-xs h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export Laundry CSV"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 text-muted-foreground border-b border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Student Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Admission ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Phone"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Property & Room"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Laundry Vendor"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Subscription Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Package Allotted"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Laundry Bag"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/60",
											children: admissions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 font-medium text-foreground",
														children: a.fullName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-mono text-muted-foreground",
														children: a.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.phoneNumber || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [
															a.propertyName || "—",
															" ",
															a.roomNumber ? `(Rm ${a.roomNumber})` : ""
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-medium",
														children: a.laundryName || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.laundryStatus === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-sky-50 text-sky-700 border-sky-200 text-[10px]",
															children: "Active"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-muted text-muted-foreground text-[10px]",
															children: a.laundryStatus || "None"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 text-muted-foreground",
														children: a.packageName || "Standard"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4",
														children: a.bagProvided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-emerald-600 font-medium",
															children: "Provided"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-amber-600",
															children: "Pending"
														})
													})
												]
											}, a.id))
										})]
									})
								})]
							})]
						}),
						isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "financial-report",
							className: "space-y-4 m-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
								children: properties.map((p) => {
									const residents = admissions.filter((a) => a.propertyId === p.id);
									const propertyTotal = residents.reduce((sum, r) => sum + (r.packageAmount || 0), 0);
									const propertyPaid = residents.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
									const propertyDue = residents.reduce((sum, r) => sum + Math.max(0, r.balanceAmount || 0), 0);
									const rate = propertyTotal > 0 ? Math.round(propertyPaid / propertyTotal * 100) : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border border-border/80 shadow-soft",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
											className: "p-4 pb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-base font-semibold",
													children: p.propertyName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-semibold text-foreground",
													children: [rate, "% Collected"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
												className: "text-xs",
												children: [residents.length, " Enrolled Students"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-4 pt-2 space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Collected:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-emerald-600",
														children: formatINR(propertyPaid)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Outstanding Dues:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-rose-600",
														children: formatINR(propertyDue)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
													value: rate,
													className: "h-1.5 bg-muted"
												})
											]
										})]
									}, p.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border/80 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: "Outstanding Dues & Follow-up List"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Students with balance payments pending, sorted by balance amount"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: exportFinancialCsv,
										className: "gap-1.5 text-xs h-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export Dues CSV"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 text-muted-foreground border-b border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Student Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Admission ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Student Contact"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Parent Contact"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Property & Room"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Total Fee"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Amount Paid"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Balance Due"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold text-right",
													children: "Quick Contact"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/60",
											children: admissions.filter((a) => (a.balanceAmount || 0) > 0).sort((a, b) => (b.balanceAmount || 0) - (a.balanceAmount || 0)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 font-medium text-foreground",
														children: a.fullName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-mono text-muted-foreground",
														children: a.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.phoneNumber || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-medium text-foreground",
														children: a.parentPhone ? `${a.parentPhone} (${a.parentRelation || "Parent"})` : "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-2.5 px-3",
														children: [
															a.propertyName || "—",
															" ",
															a.roomNumber ? `• Rm ${a.roomNumber}` : ""
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: formatINR(a.packageAmount || 0)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 text-emerald-600 font-medium",
														children: formatINR(a.amountPaid || 0)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 text-rose-600 font-bold",
														children: formatINR(a.balanceAmount || 0)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 text-right",
														children: a.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
															href: `tel:${a.phoneNumber}`,
															className: "inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3" }), " Call"]
														})
													})
												]
											}, a.id))
										})]
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "property-report",
							className: "space-y-4 m-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border/80 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: "Property Bed Allocation & Residency Roster"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Active room and bed assignments for all residents across properties"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 text-muted-foreground border-b border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Student Resident"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Admission ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Property / PG"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Room Number"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Bed Number"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Admission Date"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-3 font-semibold",
													children: "Move In Date"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2.5 px-4 font-semibold",
													children: "Mattress"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/60",
											children: admissions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/30",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4 font-medium text-foreground",
														children: a.fullName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-mono text-muted-foreground",
														children: a.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-medium",
														children: a.propertyName || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 font-semibold",
														children: a.roomNumber || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3",
														children: a.bedNumber || "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 text-muted-foreground",
														children: a.admissionDate ? formatDate(a.admissionDate) : "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-3 text-muted-foreground",
														children: a.moveInDate ? formatDate(a.moveInDate) : "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-2.5 px-4",
														children: a.mattressRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-amber-50 text-amber-700 border-amber-200 text-[10px]",
															children: "Required"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Not needed"
														})
													})
												]
											}, a.id))
										})]
									})
								})]
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ReportsPage as component };
