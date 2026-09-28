import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { Nt as useMesses, Rt as useProperties, W as todayISTDateString, dt as useAllLeaveRequests, ut as useAdmissions } from "./hooks-LYI2QAXV.mjs";
import { T as Search, d as UserCheck, et as Download, gt as CalendarOff, mt as Calendar, o as UtensilsCrossed, pt as Check, s as Users, tt as Copy, yt as Building2 } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as AdminShell } from "./admin-shell-XA26k4Ve.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as formatDate } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-BiHV7YXM.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C2pytTEu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.student-headcount-D24bg23g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function getActiveLeaveForDate(studentId, date, leaves) {
	return leaves.find((l) => {
		if (l.studentId !== studentId) return false;
		if (l.status !== "approved") return false;
		if (!l.fromDate || l.fromDate > date) return false;
		if (l.toDate && l.toDate < date) return false;
		return true;
	});
}
function StudentHeadcountPage() {
	const { data: rawAdmissions = [], isLoading: admLoading } = useAdmissions();
	const { data: messes = [], isLoading: messLoading } = useMesses();
	const { data: properties = [] } = useProperties();
	const { data: leaves = [], isLoading: leavesLoading } = useAllLeaveRequests();
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(todayISTDateString());
	const [selectedMess, setSelectedMess] = (0, import_react.useState)("all");
	const [selectedProperty, setSelectedProperty] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("present");
	const messStudents = (0, import_react.useMemo)(() => {
		return rawAdmissions.filter((a) => {
			const hasMess = a.messId || a.messName;
			const isSubscribed = a.tiffinStatus === "active" || a.packageServices?.some((s) => s.toLowerCase().includes("mess"));
			return hasMess && isSubscribed;
		});
	}, [rawAdmissions]);
	const evaluatedStudents = (0, import_react.useMemo)(() => {
		return messStudents.map((student) => {
			const activeLeave = getActiveLeaveForDate(student.id, selectedDate, leaves);
			const isPresent = !activeLeave;
			const pref = (student.mealPreference || "veg").toLowerCase().includes("non") ? "non-veg" : "veg";
			return {
				...student,
				isPresent,
				activeLeave,
				resolvedPref: pref
			};
		});
	}, [
		messStudents,
		selectedDate,
		leaves
	]);
	const filteredStudents = (0, import_react.useMemo)(() => {
		return evaluatedStudents.filter((s) => {
			if (selectedMess !== "all" && s.messId !== selectedMess) return false;
			if (selectedProperty !== "all" && s.propertyId !== selectedProperty) return false;
			if (search.trim()) {
				const q = search.toLowerCase();
				const matchesName = s.fullName?.toLowerCase().includes(q);
				const matchesAdm = s.admissionId?.toLowerCase().includes(q);
				const matchesRoom = s.roomNumber?.toLowerCase().includes(q);
				const matchesProp = s.propertyName?.toLowerCase().includes(q);
				const matchesMess = s.messName?.toLowerCase().includes(q);
				if (!matchesName && !matchesAdm && !matchesRoom && !matchesProp && !matchesMess) return false;
			}
			return true;
		});
	}, [
		evaluatedStudents,
		selectedMess,
		selectedProperty,
		search
	]);
	const presentStudents = (0, import_react.useMemo)(() => filteredStudents.filter((s) => s.isPresent), [filteredStudents]);
	const onLeaveStudents = (0, import_react.useMemo)(() => filteredStudents.filter((s) => !s.isPresent), [filteredStudents]);
	const totalEnrolled = filteredStudents.length;
	const totalPresent = presentStudents.length;
	const totalOnLeave = onLeaveStudents.length;
	const vegCount = presentStudents.filter((s) => s.resolvedPref === "veg").length;
	const nonVegCount = presentStudents.filter((s) => s.resolvedPref === "non-veg").length;
	const handleCopyKitchenSummary = (messName) => {
		let summaryText = "";
		const dateFormatted = formatDate(selectedDate);
		if (messName) {
			const messObj = messes.find((m) => m.messName === messName || m.id === messName);
			const mStudents = evaluatedStudents.filter((s) => messObj ? s.messId === messObj.id : true);
			const mPresent = mStudents.filter((s) => s.isPresent);
			const mLeave = mStudents.filter((s) => !s.isPresent);
			const mVeg = mPresent.filter((s) => s.resolvedPref === "veg").length;
			const mNonVeg = mPresent.filter((s) => s.resolvedPref === "non-veg").length;
			summaryText = `📋 *NIVASISPACE MESS MEAL COUNT*\n📅 *Date:* ${dateFormatted}\n🍽️ *Mess:* ${messObj?.messName || messName}\n-----------------------------------\n🟢 *Veg Meals to Cook:* ${mVeg}\n🍗 *Non-Veg Meals to Cook:* ${mNonVeg}\n👥 *Total Present:* ${mPresent.length}\n✈️ *Students on Leave:* ${mLeave.length}\n📊 *Total Enrolled:* ${mStudents.length}`;
		} else summaryText = `📋 *NIVASISPACE ALL MESSES MEAL COUNT*\n📅 *Date:* ${dateFormatted}\n-----------------------------------\n🟢 *Total Veg Meals:* ${vegCount}\n🍗 *Total Non-Veg Meals:* ${nonVegCount}\n👥 *Total Students Present:* ${totalPresent}\n✈️ *Total On Leave (Skip Meals):* ${totalOnLeave}\n📊 *Total Active Mess Subscriptions:* ${totalEnrolled}`;
		navigator.clipboard.writeText(summaryText);
		toast.success("Kitchen meal summary copied to clipboard! Ready to paste into WhatsApp.");
	};
	const handleExportCsv = () => {
		const headers = [
			"Sr No",
			"Admission ID",
			"Student Name",
			"Phone",
			"Property",
			"Room",
			"Assigned Mess",
			"Attendance Status",
			"Meal Preference",
			"Leave Start Date",
			"Leave Return Date",
			"Leave Reason"
		];
		const rows = filteredStudents.map((s, idx) => [
			idx + 1,
			s.admissionId,
			s.fullName,
			s.phoneNumber || "",
			s.propertyName || "",
			s.roomNumber || "",
			s.messName || "",
			s.isPresent ? "Present (Eating in Mess)" : "On Approved Leave",
			s.resolvedPref === "veg" ? "Pure Veg" : "Non-Veg",
			s.activeLeave?.fromDate ? formatDate(s.activeLeave.fromDate) : "—",
			s.activeLeave?.toDate ? formatDate(s.activeLeave.toDate) : s.activeLeave ? "Open Return (TBD)" : "—",
			s.activeLeave?.reason || "—"
		]);
		downloadCsv(`nivasispace_mess_headcount_${selectedDate}.csv`, headers, rows);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Mess Headcount & Attendance",
		subtitle: "Live student meal count for mess kitchens, excluding students on approved leaves, with pure Veg and Non-Veg breakdowns.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => handleCopyKitchenSummary(),
				className: "gap-1.5 text-xs h-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy Kitchen Count"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: handleExportCsv,
				className: "gradient-brand text-white shadow-soft gap-1.5 text-xs h-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export Headcount CSV"]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }), "Selected Date:"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: selectedDate,
									onChange: (e) => setSelectedDate(e.target.value),
									className: "w-44 rounded-xl text-xs h-9 font-semibold"
								}),
								selectedDate === todayISTDateString() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]",
									children: "Today"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setSelectedDate(todayISTDateString()),
									className: "text-xs h-7 px-2 text-primary",
									children: "Set to Today"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedMess,
									onValueChange: setSelectedMess,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
										className: "w-[180px] rounded-xl text-xs h-9",
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedProperty,
									onValueChange: setSelectedProperty,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
										className: "w-[170px] rounded-xl text-xs h-9",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 mr-1.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Properties" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Properties"
										}), properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p.id,
											children: p.propertyName
										}, p.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-[200px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Search student, room...",
										value: search,
										onChange: (e) => setSearch(e.target.value),
										className: "pl-8 rounded-xl text-xs h-9"
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-primary",
										children: "Total Meals to Cook"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-foreground font-display mt-2",
									children: totalPresent
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Present students eating today"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300",
										children: "🟢 Veg Meals"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-emerald-500 animate-pulse" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-display mt-2",
									children: vegCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5",
									children: "Pure Vegetarian portions"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300",
										children: "🍗 Non-Veg Meals"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-amber-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-display mt-2",
									children: nonVegCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-amber-800/80 dark:text-amber-400/80 mt-0.5",
									children: "Non-Vegetarian portions"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-destructive",
										children: "✈️ On Leave (Skipped)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-destructive font-display mt-2",
									children: totalOnLeave
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Meals not needed today"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-soft col-span-2 sm:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Total Enrolled"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-foreground font-display mt-2",
									children: totalEnrolled
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Active mess subscribers"
								})
							]
						})
					]
				}),
				selectedMess === "all" && messes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-foreground flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4 text-primary" }),
								"Kitchen Headcount per Mess (",
								formatDate(selectedDate),
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Click copy button on any mess to send meal numbers to the cook"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
						children: messes.map((m) => {
							const mStudents = evaluatedStudents.filter((s) => s.messId === m.id);
							const mPresent = mStudents.filter((s) => s.isPresent);
							const mLeave = mStudents.filter((s) => !s.isPresent);
							const mVeg = mPresent.filter((s) => s.resolvedPref === "veg").length;
							const mNonVeg = mPresent.filter((s) => s.resolvedPref === "non-veg").length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border border-border shadow-soft hover:border-primary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-base font-bold truncate",
											children: m.messName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => handleCopyKitchenSummary(m.messName),
											className: "h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), "Copy Count"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
										className: "text-xs",
										children: [
											"Owner: ",
											m.ownerName || "—",
											" ",
											m.ownerPhone ? `• ${m.ownerPhone}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "p-4 pt-2 space-y-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-4 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-[10px]",
												children: "To Cook"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-extrabold text-foreground text-base",
												children: mPresent.length
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-[10px]",
												children: "🟢 Veg"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-extrabold text-emerald-600 text-base",
												children: mVeg
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-[10px]",
												children: "🍗 Non-Veg"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-extrabold text-amber-600 text-base",
												children: mNonVeg
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-[10px]",
												children: "✈️ Leave"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-extrabold text-destructive text-base",
												children: mLeave.length
											})] })
										]
									})
								})]
							}, m.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border border-border/80 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base font-bold",
							children: ["Student Attendance & Mess Roster for ", formatDate(selectedDate)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs mt-0.5",
							children: "Present students are counted for meal preparation. Students on leave are automatically excused and deducted."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
							value: activeTab,
							onValueChange: (val) => setActiveTab(val),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "bg-muted p-1 rounded-xl h-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "present",
										className: "rounded-lg text-xs gap-1.5 py-1 px-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-emerald-600" }),
											"Present (",
											totalPresent,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "on-leave",
										className: "rounded-lg text-xs gap-1.5 py-1 px-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "size-3.5 text-destructive" }),
											"On Leave (",
											totalOnLeave,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "all",
										className: "rounded-lg text-xs py-1 px-3",
										children: [
											"All (",
											filteredStudents.length,
											")"
										]
									})
								]
							})
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
										className: "py-2.5 px-3 font-semibold",
										children: "Attendance Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 font-semibold",
										children: "Leave Details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-semibold text-right",
										children: "Phone"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/60",
								children: (activeTab === "present" ? presentStudents : activeTab === "on-leave" ? onLeaveStudents : filteredStudents).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									colSpan: 7,
									className: "py-8 text-center text-muted-foreground",
									children: [
										"No students found in this category for ",
										formatDate(selectedDate),
										"."
									]
								}) }) : (activeTab === "present" ? presentStudents : activeTab === "on-leave" ? onLeaveStudents : filteredStudents).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
												className: "font-medium text-foreground",
												children: s.propertyName || "—"
											}), s.roomNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground block",
												children: ["Room ", s.roomNumber]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-medium text-foreground",
											children: s.messName || "Unassigned"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: s.resolvedPref === "veg" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
												children: "🟢 Pure Veg"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
												children: "🍗 Non-Veg"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: s.isPresent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), "Present (Cooking)"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "size-3" }), "On Leave"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: s.activeLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-medium text-destructive block",
													children: [
														formatDate(s.activeLeave.fromDate),
														" →",
														" ",
														s.activeLeave.toDate ? formatDate(s.activeLeave.toDate) : "TBD (Open Return)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground truncate block max-w-[200px]",
													title: s.activeLeave.reason,
													children: s.activeLeave.reason
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-4 text-right font-mono text-muted-foreground",
											children: s.phoneNumber || "—"
										})
									]
								}, s.id))
							})]
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { StudentHeadcountPage as component };
