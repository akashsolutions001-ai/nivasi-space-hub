import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Search, p as Plus } from "../_libs/lucide-react.mjs";
import { a as Skeleton, n as Button, t as AdminShell } from "./admin-shell-q_SH2sYS.mjs";
import { t as Input } from "./input-D8rGBYdA.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cdk1ACxq.mjs";
import { r as useAdmissions } from "./hooks-B1VfaGDB.mjs";
import { n as formatDate, r as formatINR } from "./format-Bg5w10xg.mjs";
import { t as EmptyState } from "./stat-card-CICCBvWu.mjs";
import { i as StatusPill, n as PaymentBadge, r as ProfileAvatar, t as MattressBadge } from "./badges-CB69Mx94.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions.index-ColEIlY8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdmissionsListPage() {
	const { data: admissions = [], isLoading } = useAdmissions();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [payment, setPayment] = (0, import_react.useState)("all");
	const [items, setItems] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return admissions.filter((a) => {
			if (q && !`${a.fullName} ${a.admissionId} ${a.phoneNumber} ${a.collegeName} ${a.roomNumber}`.toLowerCase().includes(q)) return false;
			if (payment !== "all" && a.paymentStatus !== payment) return false;
			if (items === "bag-pending" && a.bagProvided) return false;
			if (items === "tiffin-pending" && a.tiffinProvided) return false;
			if (items === "mattress-required" && !a.mattressRequired) return false;
			return true;
		});
	}, [
		admissions,
		query,
		payment,
		items
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Admissions",
		subtitle: `${admissions.length} student${admissions.length === 1 ? "" : "s"} on record`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/admissions/new",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Admission"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-56 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search name, admission ID, phone, college…",
						className: "pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: payment,
					onValueChange: setPayment,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All payments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "completed",
							children: "Paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "pending",
							children: "Pending"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: items,
					onValueChange: setItems,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "bag-pending",
							children: "Bag pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "tiffin-pending",
							children: "Tiffin pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "mattress-required",
							children: "Mattress required"
						})
					] })]
				})
			]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-2xl" }, i))
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: admissions.length === 0 ? "No admissions yet" : "No matching admissions",
			description: admissions.length === 0 ? "Create your first admission to get started." : "Try adjusting your search or filters.",
			action: admissions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/admissions/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Admission"]
				})
			}) : void 0
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/60 text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Student"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Admission ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "College"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Package"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Date"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border transition-colors hover:bg-muted/40 cursor-pointer",
					onClick: () => navigate({
						to: "/admin/admissions/$admissionId",
						params: { admissionId: a.admissionId }
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
									path: a.profileImagePath,
									name: a.fullName,
									className: "size-9"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: a.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: a.phoneNumber
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-primary",
							children: a.admissionId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: a.collegeName || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: a.packageName || "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: formatINR(a.packageAmount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: a.paymentStatus }), a.balanceAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-[11px] text-muted-foreground",
								children: ["Due ", formatINR(a.balanceAmount)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									ok: a.bagProvided,
									okLabel: "Bag",
									pendingLabel: "Bag"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									ok: a.tiffinProvided,
									okLabel: "Tiffin",
									pendingLabel: "Tiffin"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs text-muted-foreground",
							children: formatDate(a.admissionDate)
						})
					]
				}, a.id)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 lg:hidden",
			children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/admissions/$admissionId",
				params: { admissionId: a.admissionId },
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
								path: a.profileImagePath,
								name: a.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: a.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-mono text-xs text-primary",
									children: a.admissionId
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: a.paymentStatus })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.collegeName || "College not set" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-right",
								children: a.packageName || "No package"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(a.admissionDate) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-right font-semibold text-foreground",
								children: formatINR(a.packageAmount)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								ok: a.bagProvided,
								okLabel: "Bag given",
								pendingLabel: "Bag pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								ok: a.tiffinProvided,
								okLabel: "Tiffin given",
								pendingLabel: "Tiffin pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MattressBadge, { required: a.mattressRequired })
						]
					})
				]
			}, a.id))
		})] })]
	});
}
//#endregion
export { AdmissionsListPage as component };
