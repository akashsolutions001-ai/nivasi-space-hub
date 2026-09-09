import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { A as Phone, F as MapPin, R as LoaderCircle, T as Scale, Y as Clock, Z as CircleCheck, at as Check, ft as ArrowLeft, g as StickyNote, i as WashingMachine, nt as ChevronRight, ot as Calendar, rt as ChevronLeft, u as UserCheck, w as Search } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Bm0v3lUY.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { $ as upsertLaundryPickup, Ct as useProperties, I as todayDateString, et as useAdmissions, ft as useLaundryPickupSummary, lt as useLaundries, pt as useLaundryPickupsForDate, wt as useRooms } from "./hooks-CicQrMaL.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-HKDYrhq4.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Route } from "./admin.laundry._laundryId-BsZQtiUO.mjs";
import { t as StudentLaundryDialog } from "./student-laundry-dialog-CEOF4y7G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry._laundryId-BHVbdwz2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABELS = {
	pending: "Pending",
	picked_up: "Picked Up",
	not_available: "Not Available",
	skipped: "Skipped"
};
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
			for (const p of pickups) {
				const key = `${p.studentId}-${p.type}`;
				if (p.notes !== void 0) next[key] = p.notes;
			}
			return next;
		});
		setWeightMap((prev) => {
			const next = { ...prev };
			for (const p of pickups) {
				const key = `${p.studentId}-${p.type}`;
				if (p.clothesWeight !== void 0) next[key] = p.clothesWeight;
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
				clothesWeight: weightMap[key] ?? "",
				notes: notesMap[key] ?? ""
			});
			await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
			await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update pickup status.");
		} finally {
			setUpdatingKey(null);
		}
	}
	async function saveDetails(student, type) {
		const key = `${student.id}-${type}`;
		const status = pickups.find((p) => p.studentId === student.id && p.type === type)?.status ?? "pending";
		setUpdatingKey(key + "-details");
		try {
			await upsertLaundryPickup({
				studentId: student.id,
				admissionId: student.admissionId,
				laundryId,
				employeeId: "admin",
				date: selectedDate,
				type,
				status,
				clothesWeight: weightMap[key] ?? "",
				notes: notesMap[key] ?? ""
			});
			await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
			await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
			toast.success(`${type === "pickup" ? "Pickup" : "Delivery"} details saved for ${student.fullName}.`);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: laundry?.laundryName ?? "Laundry Students",
		subtitle: laundry ? `Owner: ${laundry.ownerName || "—"}  ·  ${students.length} students` : "",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/laundry/assign",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-1.5 size-4" }), " Assign Students"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/laundry",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Laundry"]
				})
			})]
		}),
		children: [
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
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					"picked_up",
					"pending",
					"skipped",
					"not_available"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground capitalize",
							children: STATUS_LABELS[s]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold",
							children: (summary.pickup[s] ?? 0) + (summary.delivery[s] ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground",
							children: [
								"P:",
								summary.pickup[s] ?? 0,
								" / D:",
								summary.delivery[s] ?? 0
							]
						})
					]
				}, s))
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
								children: ["pickup", "delivery"].map((type) => {
									const currentStatus = (type === "pickup" ? pickupRecord : deliveryRecord)?.status ?? "pending";
									const key = `${student.id}-${type}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-medium capitalize text-muted-foreground",
											children: [type, " Status"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: currentStatus,
											onValueChange: (v) => setPickupStatus(student, type, v),
											disabled: updatingKey === key || lStatus === "cancelled",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: `h-8 text-xs ${STATUS_COLORS[currentStatus]}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "pending",
													children: "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "picked_up",
													children: "Picked Up"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "not_available",
													children: "Not Available"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "skipped",
													children: "Skipped"
												})
											] })]
										})]
									}, type);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
								children: ["pickup", "delivery"].map((type) => {
									const key = `${student.id}-${type}`;
									const isSavingDetails = updatingKey === key + "-details";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 rounded-xl border border-border/70 bg-muted/20 p-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs font-semibold capitalize flex items-center gap-1 text-foreground",
												children: [
													type === "pickup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-warning-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }),
													type,
													" Details"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3 text-primary" }), " Weight of Clothes"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "e.g. 2.5 kg",
													value: weightMap[key] ?? "",
													onChange: (e) => setWeightMap((prev) => ({
														...prev,
														[key]: e.target.value
													})),
													className: "h-7 text-xs bg-background"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3 text-primary" }), " Description / Notes"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 2,
													value: notesMap[key] ?? "",
													onChange: (e) => setNotesMap((prev) => ({
														...prev,
														[key]: e.target.value
													})),
													placeholder: `e.g. ${type === "pickup" ? "3 shirts, 2 pants, wash & iron" : "delivered clean & folded"}`,
													className: "w-full resize-none rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => saveDetails(student, type),
												disabled: isSavingDetails,
												className: "flex items-center justify-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50 w-full",
												children: [
													isSavingDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 mr-1" }),
													"Save ",
													type,
													" details"
												]
											})
										]
									}, type);
								})
							})
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
