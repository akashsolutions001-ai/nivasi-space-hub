import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth, r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { C as Search, D as Plus, K as Download } from "../_libs/lucide-react.mjs";
import { Z as useAdmissions } from "./hooks-Cx9bJ-2X.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-CxwTuntR.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as formatDate, r as formatINR } from "./format-CWXVlUmU.mjs";
import { t as EmptyState } from "./stat-card-GZrf7Gbg.mjs";
import { i as StatusPill, n as PaymentBadge, r as ProfileAvatar, t as MattressBadge } from "./badges-BnuszMg2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions.index-D1YdWzcS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function exportToExcel(data) {
	const headers = [
		"Sr No",
		"Student Name",
		"Phone No",
		"Email",
		"Gender",
		"Date of Birth",
		"Year",
		"Branch",
		"College"
	];
	const escape = (val) => {
		const s = String(val ?? "");
		return s.includes(",") || s.includes("\"") || s.includes("\n") ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	const csv = "﻿" + [headers, ...data.map((a, idx) => [
		idx + 1,
		a.fullName,
		a.phoneNumber,
		a.email ?? "",
		a.gender ?? "",
		a.dateOfBirth ? formatDate(a.dateOfBirth) : "",
		a.year ?? "",
		a.course ?? "",
		a.collegeName ?? ""
	])].map((row) => row.map(escape).join(",")).join("\r\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `admissions_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
function AdmissionsListPage() {
	const { data: admissions = [], isLoading } = useAdmissions();
	const isGlobalAdmin = useIsGlobalAdmin();
	const { collegeFilter } = useAuth();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [payment, setPayment] = (0, import_react.useState)("all");
	const [items, setItems] = (0, import_react.useState)("all");
	const [packageFilter, setPackageFilter] = (0, import_react.useState)("all");
	const [propertyFilter, setPropertyFilter] = (0, import_react.useState)("all");
	const packageOptions = (0, import_react.useMemo)(() => {
		const seen = /* @__PURE__ */ new Set();
		const opts = [];
		for (const a of admissions) {
			const key = a.packageName?.trim();
			if (key && !seen.has(key)) {
				seen.add(key);
				opts.push({
					id: key,
					name: key
				});
			}
		}
		return opts.sort((a, b) => a.name.localeCompare(b.name));
	}, [admissions]);
	const collegeAdmissions = (0, import_react.useMemo)(() => {
		if (!isGlobalAdmin || !collegeFilter.college) return admissions;
		return admissions.filter((a) => a.collegeName === collegeFilter.college);
	}, [
		admissions,
		isGlobalAdmin,
		collegeFilter.college
	]);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return collegeAdmissions.filter((a) => {
			if (q && !`${a.fullName} ${a.admissionId} ${a.phoneNumber} ${a.collegeName} ${a.roomNumber}`.toLowerCase().includes(q)) return false;
			if (payment !== "all" && a.paymentStatus !== payment) return false;
			if (packageFilter !== "all" && a.packageName?.trim() !== packageFilter) return false;
			if (propertyFilter === "allotted" && !a.propertyName?.trim()) return false;
			if (propertyFilter === "not-allotted" && !!a.propertyName?.trim()) return false;
			if (items === "bag-pending" && a.bagProvided) return false;
			if (items === "tiffin-pending" && a.tiffinProvided) return false;
			if (items === "mattress-required" && !a.mattressRequired) return false;
			return true;
		});
	}, [
		admissions,
		query,
		payment,
		packageFilter,
		propertyFilter,
		items
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Admissions",
		subtitle: isGlobalAdmin && collegeFilter.college ? `${collegeAdmissions.length} student${collegeAdmissions.length === 1 ? "" : "s"} · ${collegeFilter.college}` : `${admissions.length} student${admissions.length === 1 ? "" : "s"} on record`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => exportToExcel(rows),
				disabled: rows.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export Excel"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/admissions/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Admission"]
				})
			})]
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
					value: packageFilter,
					onValueChange: setPackageFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All packages" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All packages"
					}), packageOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: p.id,
						children: p.name
					}, p.id))] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: propertyFilter,
					onValueChange: setPropertyFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All properties" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All properties"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "allotted",
							children: "Property allotted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "not-allotted",
							children: "Not allotted"
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
							className: "px-4 py-3 w-10",
							children: "Sr"
						}),
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
							children: "Property"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Package"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Mess"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-success",
							children: "Paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-destructive",
							children: "Pending"
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border transition-colors hover:bg-muted/40 cursor-pointer",
					onClick: () => navigate({
						to: "/admin/admissions/$admissionId",
						params: { admissionId: a.admissionId }
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs text-muted-foreground font-medium",
							children: idx + 1
						}),
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
							className: "px-4 py-3 text-muted-foreground",
							children: [a.propertyName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate max-w-[140px]",
								children: a.propertyName
							}) : "—", a.roomNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted-foreground/70",
								children: [
									"Room ",
									a.roomNumber,
									a.bedNumber ? ` · Bed ${a.bedNumber}` : ""
								]
							})]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: a.messName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-medium text-success",
								children: ["🍱 ", a.messName]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-success",
								children: formatINR(a.amountPaid)
							}), a.paymentStatus === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[10px] font-medium text-success",
								children: "✓ Paid"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: a.balanceAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-destructive",
								children: formatINR(a.balanceAmount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[10px] font-medium text-destructive",
								children: "⚠ Due"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "—"
							})
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
			children: rows.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/admissions/$admissionId",
				params: { admissionId: a.admissionId },
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-xs font-semibold text-muted-foreground w-5",
								children: idx + 1
							}),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-success",
								children: ["Paid: ", formatINR(a.amountPaid)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-right font-semibold ${a.balanceAmount > 0 ? "text-destructive" : "text-muted-foreground"}`,
								children: a.balanceAmount > 0 ? `Due: ${formatINR(a.balanceAmount)}` : "✓ Cleared"
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MattressBadge, { required: a.mattressRequired }),
							a.messName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-medium text-success",
								children: ["🍱 ", a.messName]
							})
						]
					})
				]
			}, a.id))
		})] })]
	});
}
//#endregion
export { AdmissionsListPage as component };
