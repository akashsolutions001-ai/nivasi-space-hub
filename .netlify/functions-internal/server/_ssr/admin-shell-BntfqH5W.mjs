import { o as __toESM } from "../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { a as useIsMessEmployee, i as useIsLaundryEmployee, n as useAuth, r as useIsGlobalAdmin } from "./auth-DCFmY9CZ.mjs";
import { n as hasStudentSession } from "./studentAuth-is6bqiDx.mjs";
import { C as Settings, D as RefreshCw, I as LogOut, M as Package, P as Menu, Q as CircleArrowDown, R as LoaderCircle, U as GraduationCap, _ as Stethoscope, ct as Building2, i as WashingMachine, n as X, o as UtensilsCrossed, r as Wrench, s as Users, x as ShieldAlert, z as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Ct7oRji7.mjs";
import { rt as useColleges } from "./hooks-BH6AsUXG.mjs";
import { a as SheetTrigger, i as SheetTitle, n as SheetContent, t as Sheet } from "./sheet-CtxyGEjc.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-BntfqH5W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
function NivasiLogo({ className, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "gradient-brand grid size-9 shrink-0 place-items-center rounded-xl shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-5",
				fill: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M3.5 10.6 12 4l8.5 6.6",
						stroke: "white",
						strokeWidth: "1.9",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M5.8 12.2V19a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1v-6.8",
						stroke: "white",
						strokeWidth: "1.9",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "14.6",
						r: "1.7",
						fill: "white"
					})
				]
			})
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block font-display text-[15px] font-bold tracking-tight text-foreground",
				children: ["Nivasi", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "Space"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-[10px] font-medium tracking-wide text-muted-foreground",
				children: "Admission Management"
			})]
		})]
	});
}
function FilterForm({ colleges, collegesLoading, canClose, onClose }) {
	const { setCollegeFilter, collegeFilter } = useAuth();
	const [type, setType] = (0, import_react.useState)(collegeFilter.type);
	const [city, setCity] = (0, import_react.useState)(collegeFilter.city);
	const [college, setCollege] = (0, import_react.useState)(collegeFilter.college);
	const typeMatchedColleges = colleges.filter((c) => c.active).filter((c) => {
		if (!type) return true;
		return !c.collegeType || c.collegeType === "other" || c.collegeType === type;
	});
	const relevantCities = Array.from(new Set(typeMatchedColleges.map((c) => c.city?.trim() || "Kolhapur"))).sort((a, b) => a.localeCompare(b));
	const effectiveCity = city || relevantCities[0] || "";
	const filteredColleges = typeMatchedColleges.filter((c) => !effectiveCity || (c.city?.trim() || "Kolhapur") === effectiveCity);
	function handleTypeChange(v) {
		setType(v);
		setCity("");
		setCollege("");
	}
	function handleConfirm() {
		if (!type || !college) return;
		setCollegeFilter({
			type,
			city: effectiveCity,
			college
		});
		onClose();
	}
	const cityOk = relevantCities.length >= 1;
	const canConfirm = Boolean(type && cityOk && college);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "space-between",
			padding: "20px 20px 0",
			flexShrink: 0
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				marginBottom: 4
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { style: {
				width: 18,
				height: 18,
				color: "#c2692a",
				flexShrink: 0
			} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				style: {
					fontSize: 17,
					fontWeight: 700,
					color: "#2d1f0e",
					fontFamily: "Outfit, sans-serif"
				},
				children: "Select College View"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			style: {
				fontSize: 13,
				color: "#7a5c3a",
				lineHeight: 1.45,
				margin: 0
			},
			children: "Choose the college whose admissions you want to manage."
		})] }), canClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onClose,
			"aria-label": "Close",
			style: {
				marginLeft: 12,
				padding: 6,
				border: "none",
				borderRadius: 8,
				background: "rgba(0,0,0,0.06)",
				cursor: "pointer",
				flexShrink: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { style: {
				width: 16,
				height: 16,
				color: "#7a5c3a"
			} })
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			overflowY: "auto",
			overscrollBehavior: "contain",
			padding: "16px 20px 24px",
			display: "flex",
			flexDirection: "column",
			gap: 20,
			flex: 1,
			minHeight: 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.07em",
					color: "#9a7a5a",
					marginBottom: 10
				},
				children: "1. College Type"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 10
				},
				children: ["engineering", "medical"].map((t) => {
					const active = type === t;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleTypeChange(t),
						style: {
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							padding: "14px 10px",
							borderRadius: 14,
							border: `2px solid ${active ? "#c2692a" : "#e0d8ce"}`,
							background: active ? "#fdf1e8" : "#ffffff",
							color: active ? "#c2692a" : "#3d2e1a",
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							transition: "border-color 0.15s, background 0.15s",
							minHeight: 80
						},
						children: [t === "engineering" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { style: {
							width: 22,
							height: 22
						} }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { style: {
							width: 22,
							height: 22
						} }), t === "engineering" ? "Engineering" : "Medical"]
					}, t);
				})
			})] }),
			collegesLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					color: "#9a7a5a",
					fontSize: 13
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { style: {
					width: 16,
					height: 16,
					flexShrink: 0,
					animation: "spin 1s linear infinite"
				} }), "Loading colleges…"]
			}),
			type && !collegesLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.07em",
					color: "#9a7a5a",
					marginBottom: 10
				},
				children: "2. City"
			}), relevantCities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					fontSize: 13,
					color: "#9a7a5a",
					padding: "10px 14px",
					border: "1px dashed #d0c8be",
					borderRadius: 10,
					margin: 0
				},
				children: [
					"No ",
					type,
					" colleges found. Add them in Settings → Colleges."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: effectiveCity,
				onValueChange: (v) => {
					setCity(v);
					setCollege("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					style: {
						width: "100%",
						height: 48,
						fontSize: 14
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a city" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: relevantCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: c,
					style: { fontSize: 14 },
					children: c
				}, c)) })]
			})] }),
			type && cityOk && !collegesLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.07em",
					color: "#9a7a5a",
					marginBottom: 10
				},
				children: "3. College"
			}), filteredColleges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					fontSize: 13,
					color: "#9a7a5a",
					padding: "10px 14px",
					border: "1px dashed #d0c8be",
					borderRadius: 10,
					margin: 0
				},
				children: [
					"No colleges for ",
					effectiveCity,
					". Add them in Settings."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: college || "",
				onValueChange: setCollege,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					style: {
						width: "100%",
						height: "auto",
						minHeight: 48,
						fontSize: 13,
						textAlign: "left",
						whiteSpace: "normal",
						padding: "10px 14px",
						overflow: "hidden"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							flex: 1,
							minWidth: 0
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a college" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
					style: {
						maxHeight: 240,
						width: "var(--radix-select-trigger-width)",
						maxWidth: "var(--radix-select-trigger-width)"
					},
					children: filteredColleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.collegeName,
						style: {
							fontSize: 13,
							whiteSpace: "normal",
							wordBreak: "break-word",
							lineHeight: 1.4,
							padding: "10px 12px"
						},
						children: c.collegeName
					}, c.id))
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !canConfirm,
				onClick: handleConfirm,
				style: {
					width: "100%",
					padding: "14px 0",
					borderRadius: 14,
					border: "none",
					cursor: canConfirm ? "pointer" : "not-allowed",
					background: canConfirm ? "linear-gradient(135deg, #9b4a18 0%, #c2692a 52%, #d4963e 100%)" : "#e0d8ce",
					color: canConfirm ? "#fff" : "#a89880",
					fontSize: 15,
					fontWeight: 700,
					letterSpacing: "0.01em",
					transition: "opacity 0.15s",
					marginTop: 4
				},
				children: "View Admissions"
			})
		]
	})] });
}
var STYLE_ID = "__cf_dialog_styles__";
function ensureStyles() {
	if (typeof document === "undefined") return;
	if (document.getElementById(STYLE_ID)) return;
	const s = document.createElement("style");
	s.id = STYLE_ID;
	s.textContent = `
    #__cf_dialog_host__ {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100dvw !important;
      height: 100dvh !important;
      z-index: 10001 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 16px !important;
      box-sizing: border-box !important;
      pointer-events: none !important;
      transform: none !important;
      translate: none !important;
      rotate: none !important;
      scale: none !important;
      filter: none !important;
      perspective: none !important;
      will-change: auto !important;
      contain: none !important;
      isolation: isolate !important;
    }
    #__cf_dialog_host__[data-open="true"] {
      pointer-events: auto !important;
    }
  `;
	document.head.appendChild(s);
}
function getOrCreateHost() {
	let host = document.getElementById("__cf_dialog_host__");
	if (!host) {
		host = document.createElement("div");
		host.id = "__cf_dialog_host__";
		document.body.appendChild(host);
	}
	return host;
}
function FilterPortal({ open, colleges, collegesLoading, canClose, onClose }) {
	const [host, setHost] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const D = 260;
	(0, import_react.useEffect)(() => {
		ensureStyles();
		const h = getOrCreateHost();
		setHost(h);
		return () => {
			h.dataset.open = "false";
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!host) return;
		if (open) {
			host.dataset.open = "true";
			requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
		} else {
			setVisible(false);
			const t = setTimeout(() => {
				if (host) host.dataset.open = "false";
			}, 300);
			return () => clearTimeout(t);
		}
	}, [open, host]);
	if (!host || typeof document === "undefined") return null;
	if (!open && !visible) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": "true",
		onClick: canClose ? onClose : void 0,
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: "rgba(0,0,0,0.55)",
			opacity: visible ? 1 : 0,
			transition: `opacity ${D}ms ease`
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Select College View",
		style: {
			position: "relative",
			zIndex: 1,
			width: "100%",
			maxWidth: "420px",
			maxHeight: "calc(100dvh - 48px)",
			display: "flex",
			flexDirection: "column",
			background: "#faf8f4",
			borderRadius: 20,
			boxShadow: "0 12px 60px rgba(0,0,0,0.28)",
			overflow: "hidden",
			opacity: visible ? 1 : 0,
			transform: visible ? "scale(1)" : "scale(0.94)",
			transition: `opacity ${D}ms ease, transform ${D}ms cubic-bezier(0.34,1.56,0.64,1)`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterForm, {
			colleges,
			collegesLoading,
			canClose,
			onClose
		})
	})] }), host);
}
function CollegeFilterDialog({ open, onOpenChange }) {
	const { collegeFilter } = useAuth();
	const { data: colleges = [], isLoading: collegesLoading } = useColleges();
	const canClose = Boolean(collegeFilter.college);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPortal, {
		open,
		colleges,
		collegesLoading,
		canClose,
		onClose: () => {
			if (canClose) onOpenChange(false);
		}
	});
}
function CollegeFilterChip({ onNavigate }) {
	const { collegeFilter, setFilterDialogOpen } = useAuth();
	if (!collegeFilter.college) return null;
	function handleTap() {
		onNavigate?.();
		setTimeout(() => setFilterDialogOpen(true), 160);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: handleTap,
		className: "w-full rounded-xl border border-primary/30 bg-brand-soft/60 px-3 py-2 text-left transition-colors hover:bg-brand-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold uppercase tracking-wide text-primary/70",
				children: "Viewing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs font-semibold text-primary break-words leading-snug",
				children: collegeFilter.college
			}),
			collegeFilter.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: collegeFilter.city
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-2.5" }), "Tap to change"]
			})
		]
	});
}
var NAV = [
	{
		label: "Dashboard",
		to: "/admin/dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Admissions",
		to: "/admin/admissions",
		icon: Users
	},
	{
		label: "Properties",
		to: "/admin/properties",
		icon: Building2
	},
	{
		label: "Packages",
		to: "/admin/packages",
		icon: Package
	},
	{
		label: "Mess",
		to: "/admin/mess",
		icon: UtensilsCrossed
	},
	{
		label: "Laundry",
		to: "/admin/laundry",
		icon: WashingMachine
	},
	{
		label: "Payouts",
		to: "/admin/payouts",
		icon: CircleArrowDown
	},
	{
		label: "Settings",
		to: "/admin/settings",
		icon: Settings
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isMessEmployee = useIsMessEmployee();
	const isLaundryEmployee = useIsLaundryEmployee();
	const isEmployee = isMessEmployee || isLaundryEmployee;
	const employeeNav = [
		...isMessEmployee ? [{
			label: "Mess",
			to: "/admin/mess",
			icon: UtensilsCrossed
		}] : [],
		...isLaundryEmployee ? [{
			label: "Laundry",
			to: "/admin/laundry",
			icon: WashingMachine
		}] : [],
		{
			label: "My Payout",
			to: isMessEmployee ? "/employee/mess/payouts" : "/employee/laundry/payouts",
			icon: CircleArrowDown
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: (isEmployee ? employeeNav : NAV).map((item) => {
			const active = pathname.startsWith(item.to);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "gradient-brand text-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-[18px]" }), item.label]
			}, item.to);
		})
	});
}
function AccountBlock({ onNavigate }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	async function handleLogout() {
		onNavigate?.();
		await logout();
		navigate({
			to: "/admin/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-sidebar-border bg-brand-soft/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs font-semibold text-foreground",
				children: user?.displayName || "NivasiSpace Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[11px] text-muted-foreground",
				children: user?.email
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleLogout,
				className: "mt-2 h-8 w-full justify-start gap-2 px-2 text-xs text-muted-foreground hover:text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Log out"]
			})
		]
	});
}
function SidebarInner({ onNavigate }) {
	const isGlobalAdmin = useIsGlobalAdmin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-4 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, { className: "px-1" }),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterChip, { onNavigate }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBlock, { onNavigate })
		]
	});
}
function AdminShell({ title, subtitle, action, children }) {
	const { user, loading, configured, needsCollegeFilter, userRole, filterDialogOpen, setFilterDialogOpen } = useAuth();
	const isGlobalAdmin = useIsGlobalAdmin();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (filterDialogOpen) setOpen(false);
	}, [filterDialogOpen]);
	(0, import_react.useEffect)(() => {
		if (loading || !configured) return;
		if (!user) {
			navigate({
				to: "/admin/login",
				replace: true
			});
			return;
		}
		if (userRole === "unknown") {
			navigate({
				to: "/student/dashboard",
				replace: true
			});
			return;
		}
		if (userRole !== "admin" && userRole !== "mess_employee" && userRole !== "laundry_employee") navigate({
			to: "/admin/login",
			replace: true
		});
	}, [
		loading,
		configured,
		user,
		userRole,
		navigate
	]);
	if (!configured) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupNotice, {});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen space-y-4 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
	});
	if (!user || hasStudentSession()) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen space-y-4 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-72 bg-sidebar p-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "sr-only",
								children: "Navigation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setOpen(false) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-3 py-5 sm:px-5 lg:px-6 lg:py-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-xl font-bold sm:text-2xl lg:text-[28px]",
									children: title
								}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground sm:text-sm",
									children: subtitle
								})]
							}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: action
							})]
						}), children]
					})
				})]
			}),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterDialog, {
				open: filterDialogOpen,
				onOpenChange: setFilterDialogOpen
			})
		]
	});
}
function SetupNotice() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg rounded-2xl border border-border bg-card p-8 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Connect your Firebase project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The NivasiSpace Admission Management System is ready, but it still needs your Firebase project details before staff can sign in and admissions can be saved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 rounded-xl bg-muted p-3 font-mono text-xs text-muted-foreground",
					children: "src/lib/firebase-config.ts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Paste the web app config from Firebase Console → Project settings → Your apps, and the whole system comes online."
				})
			]
		})
	});
}
//#endregion
export { NivasiLogo as n, SetupNotice as r, AdminShell as t };
