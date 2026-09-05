import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-DGbYVzMP.mjs";
import { I as LoaderCircle, J as CircleX, N as MapPin, O as Phone, Y as CircleCheck, at as CalendarDays, o as UtensilsCrossed, q as Clock, y as SkipForward, z as House } from "../_libs/lucide-react.mjs";
import { gt as useMesses, ht as useMessRequestsForStudent, rt as useDeliveriesForStudent } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as StudentShell } from "./student-shell-Cdo8m_19.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.dashboard-C8ieqcjR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_ICONS = {
	pending: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
	delivered: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
	not_available: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }),
	skipped: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-3.5" })
};
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	delivered: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
function getMapUrl(propertyName) {
	if (!propertyName) return null;
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}`;
}
function StudentDashboardPage() {
	const { session, admission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const { data: messes = [] } = useMesses();
	const { data: deliveries = [], isLoading: delLoading } = useDeliveriesForStudent(admission?.id ?? null);
	const { data: messRequests = [], isLoading: reqLoading } = useMessRequestsForStudent(admission?.id ?? null);
	(0, import_react.useEffect)(() => {
		if (!loading && !session) navigate({
			to: "/student/login",
			replace: true
		});
	}, [
		loading,
		session,
		navigate
	]);
	(0, import_react.useMemo)(() => {
		const map = {};
		for (const d of deliveries) {
			if (!map[d.date]) map[d.date] = [];
			map[d.date].push(d);
		}
		return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
	}, [deliveries]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const messId = admission?.messId ?? "";
	const mess = messes.find((m) => m.id === messId);
	const tiffin = admission?.tiffinStatus ?? "not set";
	const mapUrl = getMapUrl(admission?.propertyName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, {
		title: "My Dashboard",
		children: !admission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "No admission found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"We couldn't find an admission record linked to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session?.email }),
						". Please contact your hostel administrator."
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: admission.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: admission.admissionId
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `capitalize text-[11px] ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
							children: ["Tiffin: ", tiffin]
						})]
					}),
					admission.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:${admission.phoneNumber}`,
						className: "mt-2 flex items-center gap-2 text-sm text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), admission.phoneNumber]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1.5 border-t border-border pt-3",
						children: [admission.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [admission.propertyName, admission.roomNumber ? ` · Room ${admission.roomNumber}` : ""] })]
						}), mess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mess.serialNumber != null ? `Mess #${mess.serialNumber}` : mess.messName })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "Not assigned to a mess yet."
						})]
					}),
					mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "mt-3 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: mapUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5" }), " Open Map"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayDeliveryCard, { deliveries }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-3 flex items-center gap-2 font-display text-base font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary" }), "Request History"]
				}), reqLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-xl" }) : messRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No requests yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: messRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2.5 space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[11px] capitalize",
									children: req.requestType === "less_quantity" ? "Less Quantity" : req.requestType === "more_quantity" ? "More Quantity" : "Other"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[11px] ${req.status === "active" ? "border-success/30 bg-success/10 text-success" : "text-muted-foreground"}`,
									children: req.status === "active" ? "Active" : "Inactive"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground shrink-0",
								children: req.createdAt ? req.createdAt.toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short"
								}) : "—"
							})]
						}), req.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"\"",
								req.description,
								"\""
							]
						})]
					}, req.id))
				})]
			})
		] })
	});
}
function TodayDeliveryCard({ deliveries }) {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayRecords = deliveries.filter((d) => d.date === today);
	const lunch = todayRecords.find((d) => d.meal === "lunch");
	const dinner = todayRecords.find((d) => d.meal === "dinner");
	const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-1 font-display text-base font-bold",
				children: "Today's Delivery"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted-foreground",
				children: dateLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3",
				children: ["lunch", "dinner"].map((meal) => {
					const status = (meal === "lunch" ? lunch : dinner)?.status ?? "pending";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col items-center gap-1.5 rounded-xl border p-3 ${STATUS_COLORS[status]}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium capitalize text-muted-foreground",
							children: meal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-semibold",
							children: [STATUS_ICONS[status], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: status === "not_available" ? "N/A" : status.charAt(0).toUpperCase() + status.slice(1)
							})]
						})]
					}, meal);
				})
			})
		]
	});
}
//#endregion
export { StudentDashboardPage as component };
