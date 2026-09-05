import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { C as Search, E as Receipt, I as LoaderCircle, J as CircleX, N as MapPin, O as Phone, P as LogOut, Y as CircleCheck, i as WashingMachine, q as Clock, y as SkipForward } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { I as todayDateString, Q as useAdmissions, Z as upsertLaundryPickup, bt as useProperties, ct as useLaundryEmployeeByUid, dt as useLaundryPickupsForDate, st as useLaundries, ut as useLaundryPickupSummary, xt as useRooms } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.laundry-DRuo-E74.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	picked_up: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
var STATUS_ICONS = {
	pending: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
	picked_up: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
	not_available: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }),
	skipped: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-3.5" })
};
var STATUS_LABELS = {
	pending: "Pending",
	picked_up: "Picked Up",
	not_available: "N/A",
	skipped: "Skipped"
};
function getMapUrl(student, rooms, properties) {
	const s = student;
	if (s.propertyId) {
		const room = rooms.find((r) => r.id === s.propertyId);
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (student.propertyName) {
		const room = rooms.find((r) => r.title?.toLowerCase() === student.propertyName.toLowerCase());
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (s.propertyId) {
		const prop = properties.find((p) => p.propertyId === s.propertyId);
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (student.propertyName) {
		const prop = properties.find((p) => p.propertyName?.toLowerCase() === student.propertyName.toLowerCase());
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (student.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(student.propertyName)}`;
	return null;
}
function greetingByHour() {
	const h = (/* @__PURE__ */ new Date()).getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function LaundryEmployeeDashboardPage() {
	const { user, userRole, loading: authLoading, logout } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const today = todayDateString();
	const { data: employee } = useLaundryEmployeeByUid(user?.uid);
	const assignedLaundryIds = employee?.laundryIds ?? [];
	const [activeLaundryId, setActiveLaundryId] = (0, import_react.useState)("");
	const resolvedLaundryId = activeLaundryId || assignedLaundryIds[0] || "";
	const { data: allLaundries = [] } = useLaundries();
	const { data: rooms = [] } = useRooms();
	const { data: properties = [] } = useProperties();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: pickups = [] } = useLaundryPickupsForDate(resolvedLaundryId || null, today);
	const { data: summary } = useLaundryPickupSummary(resolvedLaundryId || null, today);
	const [search, setSearch] = (0, import_react.useState)("");
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!authLoading && (!user || userRole === "admin")) navigate({
			to: "/employee/login",
			replace: true
		});
	}, [
		authLoading,
		user,
		userRole,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!activeLaundryId && assignedLaundryIds.length > 0) setActiveLaundryId(assignedLaundryIds[0]);
	}, [assignedLaundryIds, activeLaundryId]);
	const students = (0, import_react.useMemo)(() => resolvedLaundryId ? admissions.filter((a) => a.laundryId === resolvedLaundryId && a.laundryStatus !== "cancelled") : [], [admissions, resolvedLaundryId]);
	const filtered = students.filter((s) => {
		if (!search) return true;
		return s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phoneNumber.includes(search) || (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
	});
	function getPickup(studentId, type) {
		return pickups.find((p) => p.studentId === studentId && p.type === type);
	}
	async function setStatus(student, type, status) {
		if (!resolvedLaundryId || !employee) return;
		const key = `${student.id}-${type}`;
		setUpdatingKey(key);
		try {
			await upsertLaundryPickup({
				studentId: student.id,
				admissionId: student.admissionId,
				laundryId: resolvedLaundryId,
				employeeId: employee.id,
				date: today,
				type,
				status
			});
			await qc.invalidateQueries({ queryKey: [
				"laundryPickups",
				resolvedLaundryId,
				today
			] });
			await qc.invalidateQueries({ queryKey: [
				"laundryPickupSummary",
				resolvedLaundryId,
				today
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update status.");
		} finally {
			setUpdatingKey(null);
		}
	}
	async function handleLogout() {
		await logout();
		navigate({
			to: "/employee/login",
			replace: true
		});
	}
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const greeting = `${greetingByHour()}, ${employee?.name?.split(" ")[0] ?? "there"} 👋`;
	const activeLaundryName = allLaundries.find((l) => l.id === resolvedLaundryId)?.laundryName ?? employee?.laundryNames?.[0] ?? "";
	const pickupPending = summary ? summary.pickup["pending"] ?? 0 : students.length;
	const deliveryPending = summary ? summary.delivery["pending"] ?? 0 : students.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-2xl items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold",
						children: greeting
					}), assignedLaundryIds.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex flex-wrap gap-1",
						children: assignedLaundryIds.map((id, i) => {
							const name = allLaundries.find((l) => l.id === id)?.laundryName ?? employee?.laundryNames?.[i] ?? id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveLaundryId(id),
								className: `rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${resolvedLaundryId === id ? "gradient-brand text-primary-foreground shadow-soft" : "border border-border text-muted-foreground hover:bg-muted"}`,
								children: name
							}, id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: activeLaundryName
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/employee/laundry/payouts",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 size-4" }), "Payouts"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: handleLogout,
						"aria-label": "Log out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4 px-4 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Students"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold",
								children: students.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-warning/30 bg-warning/10 p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-warning-foreground",
								children: "Pickup Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-warning-foreground",
								children: pickupPending
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-primary",
								children: "Delivery Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-primary",
								children: deliveryPending
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-xs font-medium uppercase tracking-widest text-muted-foreground",
					children: [
						"Today —",
						" ",
						(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "long",
							year: "numeric"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search student, phone, property…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}),
				admLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: search ? "No students match your search." : resolvedLaundryId ? "No students assigned to this laundry." : "No laundry assigned to your account."
					})]
				}) : filtered.map((student) => {
					const mapUrl = getMapUrl(student, rooms, properties);
					const pickupRec = getPickup(student.id, "pickup");
					const deliveryRec = getPickup(student.id, "delivery");
					const lStatus = student.laundryStatus ?? "active";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: student.fullName
								}), student.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 truncate text-sm text-muted-foreground",
									children: [student.propertyName, student.roomNumber ? ` · Room ${student.roomNumber}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${student.phoneNumber}`,
											"aria-label": `Call ${student.fullName}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-3.5" }), "Call"]
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
											"aria-label": "Open in Maps",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5" }), "Map"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `shrink-0 text-[11px] capitalize ${lStatus === "active" ? "border-success/30 bg-success/10 text-success" : lStatus === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
										children: lStatus
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
							children: ["pickup", "delivery"].map((type) => {
								const current = (type === "pickup" ? pickupRec : deliveryRec)?.status ?? "pending";
								const key = `${student.id}-${type}`;
								const isUpdating = updatingKey === key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium capitalize text-muted-foreground",
										children: type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-1",
										children: [
											"picked_up",
											"pending",
											"not_available",
											"skipped"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											disabled: isUpdating || lStatus === "cancelled",
											onClick: () => setStatus(student, type, s),
											className: `flex items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${current === s ? STATUS_COLORS[s] + " ring-1 ring-current/30" : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"} ${lStatus === "cancelled" ? "cursor-not-allowed opacity-40" : ""}`,
											children: [STATUS_ICONS[s], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: STATUS_LABELS[s]
											})]
										}, s))
									})]
								}, type);
							})
						})]
					}, student.id);
				})
			]
		})]
	});
}
//#endregion
export { LaundryEmployeeDashboardPage as component };
