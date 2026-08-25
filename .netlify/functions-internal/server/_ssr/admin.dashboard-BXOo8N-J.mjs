import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as useAuth, s as useIsGlobalAdmin } from "./auth-DbpSDgTm.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as EyeOff, D as IndianRupee, R as Briefcase, _ as Plus, a as Users, i as UtensilsCrossed, k as Eye, l as TrendingUp, r as Wallet, z as BedDouble } from "../_libs/lucide-react.mjs";
import { N as useAdmissions, T as filterByPeriod, b as computeStats, h as Skeleton, n as Button, t as AdminShell, y as cn } from "./admin-shell-Di_RTl8C.mjs";
import { n as formatDate, r as formatINR } from "./format-Bg5w10xg.mjs";
import { n as StatCard, t as EmptyState } from "./stat-card-BffqhZ36.mjs";
import { n as PaymentBadge, r as ProfileAvatar } from "./badges-Daqd9jjw.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-BXOo8N-J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var PERIODS = [
	{
		value: "today",
		label: "Today"
	},
	{
		value: "week",
		label: "This Week"
	},
	{
		value: "month",
		label: "This Month"
	},
	{
		value: "all",
		label: "All Time"
	}
];
function DashboardPage() {
	const { data: admissions = [], isLoading } = useAdmissions();
	const isGlobalAdmin = useIsGlobalAdmin();
	const { collegeFilter } = useAuth();
	const [period, setPeriod] = (0, import_react.useState)("all");
	const [showMoney, setShowMoney] = (0, import_react.useState)(false);
	const filteredAdmissions = (0, import_react.useMemo)(() => {
		if (!isGlobalAdmin || !collegeFilter.college) return admissions;
		return admissions.filter((a) => a.collegeName === collegeFilter.college);
	}, [
		admissions,
		isGlobalAdmin,
		collegeFilter.college
	]);
	const scoped = (0, import_react.useMemo)(() => filterByPeriod(filteredAdmissions, period), [filteredAdmissions, period]);
	const stats = (0, import_react.useMemo)(() => computeStats(scoped), [scoped]);
	const recent = (0, import_react.useMemo)(() => filteredAdmissions.slice(0, 6), [filteredAdmissions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Dashboard",
		subtitle: isGlobalAdmin && collegeFilter.college ? `Showing data for: ${collegeFilter.college}` : "A live view of admissions, payments and provided items.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/admissions/new",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Admission"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: period,
			onValueChange: setPeriod,
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: p.value,
				children: p.label
			}, p.value)) })
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-2xl" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Admissions",
						value: stats.total,
						icon: Users,
						tone: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Added This Week",
						value: stats.recent,
						icon: TrendingUp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Payments Completed",
						value: stats.paid,
						icon: Wallet,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Payments Pending",
						value: stats.paymentPending,
						icon: IndianRupee,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Bags Pending",
						value: stats.bagsPending,
						icon: Briefcase,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tiffins Pending",
						value: stats.tiffinPending,
						icon: UtensilsCrossed,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Mattress Required",
						value: stats.mattressRequired,
						icon: BedDouble
					}),
					isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Outstanding Balance",
						value: formatINR(stats.outstanding),
						icon: IndianRupee,
						tone: "warning"
					})
				]
			}),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold",
						children: "Financials"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowMoney((v) => !v),
						className: "ml-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
						"aria-label": showMoney ? "Hide financials" : "Show financials",
						children: showMoney ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
					})]
				}), showMoney ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCard, {
							label: "Total Package Value",
							value: formatINR(stats.totalValue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCard, {
							label: "Amount Collected",
							value: formatINR(stats.collected),
							accent: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCard, {
							label: "Balance Outstanding",
							value: formatINR(stats.outstanding)
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground",
					children: "Financial data is hidden. Click the eye icon to reveal."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold",
						children: "Recent Admissions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/admissions",
							children: "View all"
						})
					})]
				}), recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No admissions yet",
					description: "Add your first student to see live analytics here.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/admissions/new",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Admission"]
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: recent.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/admissions/$admissionId",
						params: { admissionId: a.admissionId },
						className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
								path: a.profileImagePath,
								name: a.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: a.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										a.admissionId,
										" · ",
										a.collegeName || "College not set"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: a.paymentStatus }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: formatDate(a.admissionDate)
								})]
							})
						]
					}, a.id))
				})]
			})
		] })]
	});
}
function MoneyCard({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: accent ? "gradient-brand rounded-2xl p-5 text-primary-foreground shadow-lift" : "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-semibold tracking-wide uppercase opacity-80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl font-bold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { DashboardPage as component };
