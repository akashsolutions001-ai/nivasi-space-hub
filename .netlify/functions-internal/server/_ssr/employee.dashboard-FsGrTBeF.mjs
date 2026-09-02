import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { $ as ChevronUp, C as Search, E as Receipt, I as LoaderCircle, J as CircleX, N as MapPin, O as Phone, P as LogOut, Y as CircleCheck, Z as CircleAlert, j as MessageSquare, nt as ChevronDown, o as UtensilsCrossed, q as Clock, t as Zap, w as RotateCcw, y as SkipForward } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { F as todayDateString, I as todayISTDateString, Y as upsertDelivery, Z as useAdmissions, bt as useRooms, dt as useMessRecordsForDate, ht as useMesses, it as useEmployeeByUid, pt as useMessRequestsForMess, rt as useDeliverySummary, tt as useDeliveriesForDate, yt as useProperties } from "./hooks-Cx9bJ-2X.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.dashboard-FsGrTBeF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	delivered: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
var STATUS_ICONS = {
	pending: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
	delivered: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
	not_available: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }),
	skipped: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-3.5" })
};
var TIFFIN_STATUS_LABELS = {
	pending: "Pending",
	received: "Received",
	do_not_want: "Do Not Want",
	other: "Other"
};
var TIFFIN_STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	received: "bg-success/15 text-success border-success/30",
	do_not_want: "bg-muted text-muted-foreground border-border",
	other: "bg-primary/10 text-primary border-primary/20"
};
var RETURN_STATUS_LABELS = {
	pending: "Return Pending",
	returned: "Returned ✓",
	not_required: "Not Required"
};
var RETURN_STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	returned: "bg-success/15 text-success border-success/30",
	not_required: "bg-muted text-muted-foreground border-border"
};
var REQUEST_TYPE_LABELS = {
	less_quantity: "Less Quantity",
	more_quantity: "More Quantity",
	other: "Other"
};
function TiffinBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[10px] ${TIFFIN_STATUS_COLORS[status] ?? ""}`,
		children: TIFFIN_STATUS_LABELS[status] ?? status
	});
}
function ReturnBadge({ status }) {
	const s = status ?? "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[10px] ${RETURN_STATUS_COLORS[s] ?? ""}`,
		children: RETURN_STATUS_LABELS[s] ?? s
	});
}
function StudentDetailPanel({ student, record, requests }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const activeRequest = requests.find((r) => r.studentId === student.id && r.status === "active");
	const hasActivity = record?.lunchStatus === "other" || record?.dinnerStatus === "other" || activeRequest || record?.lunchStatus === "received" || record?.dinnerStatus === "received";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border mt-2 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center justify-between text-xs text-muted-foreground py-1",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3" }),
					"Tiffin Detail & Requests",
					hasActivity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex size-1.5 rounded-full bg-primary" })
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/30 px-3 py-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Lunch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinBadge, { status: record?.lunchStatus ?? "pending" }),
							record?.lunchStatus === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnBadge, { status: record.lunchReturnStatus }),
								record.lunchReturnedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["→ ", record.lunchReturnedTo]
								})
							] }),
							record?.lunchStatus === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground italic",
								children: [
									"\"",
									record.lunchOtherReason,
									"\""
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/30 px-3 py-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Dinner"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinBadge, { status: record?.dinnerStatus ?? "pending" }),
							record?.dinnerStatus === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnBadge, { status: record.dinnerReturnStatus }),
								record.dinnerReturnedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["→ ", record.dinnerReturnedTo]
								})
							] }),
							record?.dinnerStatus === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground italic",
								children: [
									"\"",
									record.dinnerOtherReason,
									"\""
								]
							})
						]
					})]
				}),
				activeRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-primary flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " Special Request"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px]",
							children: REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType
						}),
						activeRequest.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-foreground mt-0.5",
							children: [
								"\"",
								activeRequest.description,
								"\""
							]
						})
					]
				})
			]
		})]
	});
}
/** Build a Google Maps URL by looking up the student's assigned room/property from Firestore */
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
function EmployeeDashboardPage() {
	const { user, userRole, employeeMessIds, employeeMessNames, loading: authLoading, logout } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const today = todayDateString();
	const { data: employee } = useEmployeeByUid(user?.uid);
	const assignedMessIds = employee?.messIds?.length ? employee.messIds : employeeMessIds;
	const [activeMessId, setActiveMessId] = (0, import_react.useState)("");
	const resolvedMessId = activeMessId || assignedMessIds[0] || "";
	const { data: allMesses = [] } = useMesses();
	const { data: rooms = [] } = useRooms();
	const { data: properties = [] } = useProperties();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: deliveries = [] } = useDeliveriesForDate(resolvedMessId || null, today);
	const { data: summary } = useDeliverySummary(resolvedMessId || null, today);
	const todayIST = todayISTDateString();
	const { data: messRecords = [] } = useMessRecordsForDate(resolvedMessId || null, todayIST);
	const { data: messRequests = [] } = useMessRequestsForMess(resolvedMessId || null);
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
		if (!activeMessId && assignedMessIds.length > 0) setActiveMessId(assignedMessIds[0] ?? "");
	}, [assignedMessIds, activeMessId]);
	const students = (0, import_react.useMemo)(() => resolvedMessId ? admissions.filter((a) => a.messId === resolvedMessId && a.tiffinStatus !== "cancelled") : [], [admissions, resolvedMessId]);
	const filtered = students.filter((s) => {
		if (!search) return true;
		return s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phoneNumber.includes(search) || (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
	});
	function getDelivery(studentId, meal) {
		return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
	}
	async function setStatus(student, meal, status) {
		if (!resolvedMessId || !employee) return;
		const key = `${student.id}-${meal}`;
		setUpdatingKey(key);
		try {
			await upsertDelivery({
				studentId: student.id,
				admissionId: student.admissionId,
				messId: resolvedMessId,
				employeeId: employee.id,
				date: today,
				meal,
				status
			});
			await qc.invalidateQueries({ queryKey: [
				"deliveries",
				resolvedMessId,
				today
			] });
			await qc.invalidateQueries({ queryKey: [
				"deliverySummary",
				resolvedMessId,
				today
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update delivery.");
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
	const activeMessName = allMesses.find((m) => m.id === resolvedMessId)?.messName ?? employee?.messNames?.[0] ?? employeeMessNames[0] ?? "";
	const lunchPending = summary ? summary.lunch["pending"] ?? 0 : students.length;
	const dinnerPending = summary ? summary.dinner["pending"] ?? 0 : students.length;
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
					}), assignedMessIds.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1 mt-1",
						children: assignedMessIds.map((id, i) => {
							const name = allMesses.find((m) => m.id === id)?.messName ?? employee?.messNames?.[i] ?? id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveMessId(id),
								className: `rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${resolvedMessId === id ? "gradient-brand text-primary-foreground shadow-soft" : "border border-border text-muted-foreground hover:bg-muted"}`,
								children: name
							}, id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: activeMessName
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/employee/mess/payouts",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 size-4" }), "Payouts"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "gradient-brand text-primary-foreground shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/employee/delivery",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1.5 size-4" }), "Start Delivery"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: handleLogout,
							"aria-label": "Log out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
						})
					]
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
								children: "Lunch Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-warning-foreground",
								children: lunchPending
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-primary",
								children: "Dinner Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-primary",
								children: dinnerPending
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
				(() => {
					const desc = allMesses.find((m) => m.id === resolvedMessId)?.messDescription;
					if (!desc) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card px-4 py-3 shadow-soft text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wide text-foreground mb-1",
							children: "Mess Description"
						}), desc]
					});
				})(),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search student name or property…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}),
				admLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: search ? "No students match your search." : resolvedMessId ? "No students assigned to this mess." : "No mess assigned to your account."
					})]
				}) : filtered.map((student) => {
					const mapUrl = getMapUrl(student, rooms, properties);
					const lunch = getDelivery(student.id, "lunch");
					const dinner = getDelivery(student.id, "dinner");
					const tiffin = student.tiffinStatus ?? "active";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
											className: `shrink-0 text-[11px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
											children: tiffin
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
								children: ["lunch", "dinner"].map((meal) => {
									const current = (meal === "lunch" ? lunch : dinner)?.status ?? "pending";
									const key = `${student.id}-${meal}`;
									const isUpdating = updatingKey === key;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium capitalize text-muted-foreground",
											children: meal
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-1",
											children: [
												"delivered",
												"pending",
												"not_available",
												"skipped"
											].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												disabled: isUpdating || tiffin === "cancelled",
												onClick: () => setStatus(student, meal, s),
												className: `flex items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${current === s ? STATUS_COLORS[s] + " ring-1 ring-current/30" : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"} ${tiffin === "cancelled" ? "cursor-not-allowed opacity-40" : ""}`,
												children: [STATUS_ICONS[s], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: s === "not_available" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)
												})]
											}, s))
										})]
									}, meal);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDetailPanel, {
								student,
								record: messRecords.find((r) => r.studentId === student.id),
								requests: messRequests
							})
						]
					}, student.id);
				})
			]
		})]
	});
}
//#endregion
export { EmployeeDashboardPage as component };
