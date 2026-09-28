import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-FxJDGa_E.mjs";
import { Dt as ArrowLeft, R as Menu, V as LogOut, W as LayoutDashboard, c as User, ft as ChevronRight, i as WashingMachine, o as UtensilsCrossed, q as House, yt as CalendarOff } from "../_libs/lucide-react.mjs";
import { a as SheetTitle, n as Sheet, r as SheetContent, t as NivasiLogo } from "./sheet-BQfzzsld.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-shell-DuGS20Uo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STUDENT_NAV = [
	{
		label: "Dashboard",
		to: "/student/dashboard",
		icon: LayoutDashboard
	},
	{
		label: "My Mess",
		to: "/student/mess",
		icon: UtensilsCrossed
	},
	{
		label: "My Laundry",
		to: "/student/laundry",
		icon: WashingMachine
	},
	{
		label: "Leave Requests",
		to: "/student/leaves",
		icon: CalendarOff
	},
	{
		label: "My Profile",
		to: "/student/profile",
		icon: User
	}
];
function SidebarInner({ onNavigate }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { session, admission, logoutStudent } = useStudentAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	async function handleLogout() {
		onNavigate?.();
		logoutStudent();
		navigate({
			to: "/student/login",
			replace: true
		});
	}
	const tiffinStatus = admission?.tiffinStatus || "not set";
	const laundryStatus = admission?.laundryStatus || "not set";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3 px-5 py-5 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, {})
			}),
			mounted && admission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/student/profile",
				onClick: onNavigate,
				className: "mx-4 mt-4 block rounded-2xl border border-border bg-muted/40 p-3.5 space-y-2 hover:bg-muted/70 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold font-display truncate text-foreground",
								children: admission.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: admission.admissionId
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground shrink-0" })]
					}),
					admission.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [admission.propertyName, admission.roomNumber ? ` · Rm ${admission.roomNumber}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `text-[10px] capitalize px-1.5 py-0.5 ${tiffinStatus === "active" ? "border-success/30 bg-success/10 text-success" : tiffinStatus === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-border text-muted-foreground"}`,
							children: ["Mess: ", tiffinStatus]
						}), admission.packageServices?.some((s) => s.toLowerCase().includes("laundry")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `text-[10px] capitalize px-1.5 py-0.5 ${laundryStatus === "active" ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
							children: ["Laundry: ", laundryStatus]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 px-3 mt-4 space-y-1",
				children: STUDENT_NAV.map(({ label, to, icon: Icon }) => {
					const active = pathname === to || pathname.startsWith(to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						onClick: onNavigate,
						className: cn("flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all", active ? "gradient-brand text-white shadow-soft" : "text-foreground hover:bg-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px] shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: label
							}),
							!active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground/60" })
						]
					}, to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-t border-border mt-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-3 shadow-soft space-y-2",
					children: [mounted && session?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground truncate font-mono",
						children: session.email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: handleLogout,
						className: "w-full justify-start text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5 mr-2 shrink-0" }), "Log Out"]
					})]
				})
			})
		]
	});
}
function StudentShell({ title, subtitle, backTo, icon: CustomIcon, action, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const { admission } = useStudentAuth();
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const ResolvedIcon = CustomIcon ?? (title.toLowerCase().includes("laundry") ? WashingMachine : title.toLowerCase().includes("mess") ? UtensilsCrossed : title.toLowerCase().includes("leave") ? CalendarOff : title.toLowerCase().includes("profile") ? User : LayoutDashboard);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-card lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setOpen(true),
								className: "size-9 rounded-xl shrink-0",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-7 shrink-0 items-center justify-center rounded-lg gradient-brand text-white shadow-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedIcon, { className: "size-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-bold text-base truncate",
									children: title
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: backTo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "icon",
								className: "size-9 rounded-xl",
								"aria-label": "Back",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: backTo,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "left",
								className: "w-72 p-0 bg-card border-r border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "sr-only",
									children: "Student Navigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setOpen(false) })]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden lg:flex items-center justify-between border-b border-border bg-card/60 px-8 py-4 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [backTo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "rounded-xl h-9 gap-1.5 text-xs font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: backTo,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-bold text-foreground",
							children: title
						}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: subtitle
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [action, mounted && admission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-success animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: admission.fullName
								}),
								admission.roomNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["· Rm ", admission.roomNumber]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-3.5 py-4 pb-8 sm:px-6 sm:py-6 lg:px-8 lg:py-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-full max-w-7xl",
						children
					})
				})
			]
		})]
	});
}
//#endregion
export { StudentShell as t };
