import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { C as Search, N as MapPin, O as Phone, i as WashingMachine, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { I as todayDateString, Q as useAdmissions, Z as upsertLaundryPickup, bt as useProperties, dt as useLaundryPickupsForDate, st as useLaundries, ut as useLaundryPickupSummary, xt as useRooms } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-DY9scxej.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Route } from "./admin.laundry._laundryId-B3hd1AvJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry._laundryId-BucxySen.js
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
	const { data: laundries = [], isLoading: laundryLoading } = useLaundries();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: pickups = [] } = useLaundryPickupsForDate(laundryId, today);
	const { data: summary } = useLaundryPickupSummary(laundryId, today);
	const { data: rooms = [] } = useRooms();
	const { data: properties = [] } = useProperties();
	const laundry = laundries.find((l) => l.id === laundryId);
	const students = (0, import_react.useMemo)(() => admissions.filter((a) => a.laundryId === laundryId), [admissions, laundryId]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
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
				date: today,
				type,
				status
			});
			await qc.invalidateQueries({ queryKey: [
				"laundryPickups",
				laundryId,
				today
			] });
			await qc.invalidateQueries({ queryKey: [
				"laundryPickupSummary",
				laundryId,
				today
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update pickup status.");
		} finally {
			setUpdatingKey(null);
		}
	}
	const isLoading = laundryLoading || admLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: laundry?.laundryName ?? "Laundry Students",
		subtitle: laundry ? `Owner: ${laundry.ownerName || "—"}  ·  ${students.length} students` : "",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/laundry",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Laundry"]
			})
		}),
		children: [
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
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
					const lStatus = student.laundryStatus ?? "active";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								className: "flex shrink-0 gap-1.5",
								children: [student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									className: "shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `tel:${student.phoneNumber}`,
										"aria-label": `Call ${student.fullName}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-3.5" }), " Call"]
									})
								}), mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
							children: ["pickup", "delivery"].map((type) => {
								const currentStatus = (type === "pickup" ? pickupRecord : deliveryRecord)?.status ?? "pending";
								const key = `${student.id}-${type}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium capitalize text-muted-foreground",
										children: type
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
						})]
					}, student.id);
				})
			})
		]
	});
}
//#endregion
export { LaundryStudentsPage as component };
