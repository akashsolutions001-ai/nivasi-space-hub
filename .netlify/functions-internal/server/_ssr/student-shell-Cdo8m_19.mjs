import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-DGbYVzMP.mjs";
import { L as LayoutDashboard, M as Menu, P as LogOut, et as ChevronRight, i as WashingMachine, o as UtensilsCrossed, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as SheetTitle, n as SheetContent, t as Sheet } from "./sheet-CC_D2WPG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-shell-Cdo8m_19.js
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
	}
];
function SidebarInner({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { session, admission, logoutStudent } = useStudentAuth();
	const navigate = useNavigate();
	async function handleLogout() {
		onNavigate?.();
		logoutStudent();
		navigate({
			to: "/student/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-5 py-5 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-9 items-center justify-center rounded-xl gradient-brand shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4 text-white" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-bold text-sm leading-tight truncate",
						children: "NivasiSpace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "Student Portal"
					})]
				})]
			}),
			admission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 rounded-xl bg-muted/60 px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold truncate",
					children: admission.fullName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground mt-0.5",
					children: admission.admissionId
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 px-3 mt-4 space-y-1",
				children: STUDENT_NAV.map(({ label, to, icon: Icon }) => {
					const active = pathname === to || pathname.startsWith(to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						onClick: onNavigate,
						className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", active ? "gradient-brand text-white shadow-sm" : "text-foreground hover:bg-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: label
							}),
							!active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground" })
						]
					}, to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 pb-6 pt-3 border-t border-border mt-4",
				children: [session?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 mb-2 text-[11px] text-muted-foreground truncate",
					children: session.email
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleLogout,
					className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 shrink-0" }), "Log Out"]
				})]
			})
		]
	});
}
function StudentShell({ title, backTo, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-lg items-center gap-3",
				children: [
					backTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "icon",
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: backTo,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(true),
							className: "flex size-9 items-center justify-center rounded-xl hover:bg-muted transition-colors",
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-72 p-0 bg-card border-r border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "sr-only",
								children: "Student Navigation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setOpen(false) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-7 items-center justify-center rounded-lg gradient-brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: title
						})]
					}),
					backTo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(true),
								className: "flex size-9 items-center justify-center rounded-xl hover:bg-muted transition-colors",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "left",
								className: "w-72 p-0 bg-card border-r border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "sr-only",
									children: "Student Navigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setOpen(false) })]
							})]
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-lg space-y-4 px-4 pt-4",
			children
		})]
	});
}
//#endregion
export { StudentShell as t };
