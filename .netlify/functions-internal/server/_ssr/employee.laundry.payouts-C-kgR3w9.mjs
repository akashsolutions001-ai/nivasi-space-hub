import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { E as Receipt, J as CircleX, T as RefreshCw, Y as CircleCheck, nt as ChevronDown, q as Clock } from "../_libs/lucide-react.mjs";
import { ct as useLaundryEmployeeByUid, st as useLaundries, vt as usePayoutsByLaundry } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-Gk-9Tmgx.mjs";
import { n as formatDate, r as formatINR } from "./format-CWXVlUmU.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.laundry.payouts-C-kgR3w9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAYOUT_TYPES = {
	MESS: "Mess",
	TIFFIN: "Tiffin",
	LAUNDRY: "Laundry",
	CLEANING_STAFF: "Cleaning Staff",
	SERVICE_PROVIDER: "Service Provider",
	REFUND: "Refund",
	OTHER: "Other"
};
var STATUS_COLORS = {
	PENDING: "border-warning/30 bg-warning/10 text-warning-foreground",
	PROCESSING: "border-primary/30 bg-primary/10 text-primary",
	PAID: "border-success/30 bg-success/10 text-success",
	FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
	CANCELLED: "border-border bg-muted text-muted-foreground"
};
var STATUS_ICONS = {
	PENDING: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
	PROCESSING: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }),
	PAID: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
	FAILED: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }),
	CANCELLED: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" })
};
function Row({ label, value }) {
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right",
			children: value
		})]
	});
}
function ReceiptCard({ payout }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const p = payout;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-start justify-between gap-3 p-4 text-left",
			onClick: () => setExpanded((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-primary",
							children: payout.payoutId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `text-[11px] font-semibold ${STATUS_COLORS[payout.status]}`,
							children: [STATUS_ICONS[payout.status], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1",
								children: payout.status
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-sm font-semibold",
						children: payout.purpose
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatDate(payout.createdAt),
							" · ",
							PAYOUT_TYPES[payout.payoutType]
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg font-bold",
					children: formatINR(payout.amount)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}` })]
			})]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-muted/20 px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 space-y-2 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-2 border-b border-dashed border-border pb-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold not-italic",
							children: "PAYOUT RECEIPT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: payout.payoutId
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Date",
						value: formatDate(payout.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Recipient",
						value: payout.recipientName
					}),
					payout.recipientPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Phone",
						value: payout.recipientPhone
					}),
					payout.recipientEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Email",
						value: payout.recipientEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-border my-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Type",
						value: PAYOUT_TYPES[payout.payoutType]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Purpose",
						value: payout.purpose
					}),
					p.laundryName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Laundry",
						value: p.laundryName
					}),
					payout.servicePeriod && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Period",
						value: payout.servicePeriod
					}),
					payout.service && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Service",
						value: payout.service
					}),
					payout.relatedItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Item",
						value: payout.relatedItem
					}),
					payout.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Note",
						value: payout.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-border my-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Payment Method",
						value: payout.paymentMethod
					}),
					payout.referenceId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Ref ID",
						value: payout.referenceId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border mt-2 pt-2 flex justify-between font-bold text-sm not-italic",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(payout.amount) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-dashed border-border pt-2 text-center text-[10px] text-muted-foreground not-italic",
						children: ["Issued by NivasiSpace · ", payout.createdBy]
					})
				]
			})
		})]
	});
}
function LaundryEmployeePayoutsPage() {
	const { user, userRole, loading: authLoading, logout } = useAuth();
	const navigate = useNavigate();
	const { data: employee } = useLaundryEmployeeByUid(user?.uid);
	const assignedLaundryIds = employee?.laundryIds ?? [];
	const { data: allLaundries = [] } = useLaundries();
	const { data: payouts = [], isLoading } = usePayoutsByLaundry(assignedLaundryIds);
	const [laundryFilter, setLaundryFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
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
	const filtered = (0, import_react.useMemo)(() => payouts.filter((p) => {
		if (laundryFilter !== "all" && p.laundryId !== laundryFilter) return false;
		if (statusFilter !== "all" && p.status !== statusFilter) return false;
		return true;
	}), [
		payouts,
		laundryFilter,
		statusFilter
	]);
	const totalPaid = filtered.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
	const totalPending = filtered.filter((p) => p.status === "PENDING" || p.status === "PROCESSING").reduce((s, p) => s + p.amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "My Payouts",
		subtitle: assignedLaundryIds.map((id) => allLaundries.find((l) => l.id === id)?.laundryName ?? id).join(", "),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-success/30 bg-success/10 p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-success",
							children: "Total Paid"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xl font-bold text-success",
							children: formatINR(totalPaid)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-warning/30 bg-warning/10 p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-warning-foreground",
							children: "Pending / Processing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xl font-bold text-warning-foreground",
							children: formatINR(totalPending)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [assignedLaundryIds.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: laundryFilter,
						onValueChange: setLaundryFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Laundries" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Laundries"
						}), assignedLaundryIds.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: id,
							children: allLaundries.find((l) => l.id === id)?.laundryName ?? id
						}, id))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "PENDING",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "PROCESSING",
								children: "Processing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "PAID",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "FAILED",
								children: "Failed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "CANCELLED",
								children: "Cancelled"
							})
						] })]
					})]
				}),
				isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "No payouts found."
					})]
				}) : filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptCard, { payout: p }, p.id))
			]
		})
	});
}
//#endregion
export { LaundryEmployeePayoutsPage as component };
