import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime, _ as DialogTrigger, d as DialogClose, f as DialogContent, g as DialogTitle, h as DialogPortal, m as DialogOverlay, p as DialogDescription, u as Dialog } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { a as useIsMessEmployee, i as useIsLaundryEmployee, n as useAuth, r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { n as hasStudentSession } from "./studentAuth-BqzWWd8x.mjs";
import { $ as ChevronUp, A as Package, L as LayoutDashboard, M as Menu, P as LogOut, S as Settings, T as RefreshCw, V as GraduationCap, X as CircleArrowDown, b as ShieldAlert, g as Stethoscope, i as WashingMachine, n as X, nt as ChevronDown, o as UtensilsCrossed, ot as Building2, r as Wrench, rt as Check, s as Users } from "../_libs/lucide-react.mjs";
import { a as DialogTitle$1, i as DialogHeader, n as DialogContent$1, t as Dialog$1 } from "./dialog-D4UCyogy.mjs";
import { et as useColleges } from "./hooks-Dciv9SEg.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-D-FgQhih.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 md:text-sm", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function CollegeFilterDialog({ open, onOpenChange }) {
	const { setCollegeFilter, collegeFilter } = useAuth();
	const { data: allColleges = [] } = useColleges();
	const [type, setType] = (0, import_react.useState)(collegeFilter.type);
	const [city, setCity] = (0, import_react.useState)(collegeFilter.city);
	const [college, setCollege] = (0, import_react.useState)(collegeFilter.college);
	(0, import_react.useEffect)(() => {
		if (open) {
			setType(collegeFilter.type);
			setCity(collegeFilter.city);
			setCollege(collegeFilter.college);
		}
	}, [open, collegeFilter]);
	const typeMatchedColleges = allColleges.filter((c) => c.active).filter((c) => {
		if (!type) return true;
		return !c.collegeType || c.collegeType === "other" || c.collegeType === type;
	});
	const relevantCities = Array.from(new Set(typeMatchedColleges.map((c) => c.city?.trim() || "Kolhapur"))).sort((a, b) => a.localeCompare(b));
	const effectiveCity = city || (relevantCities.length >= 1 ? relevantCities[0] : "") || "";
	const filteredColleges = typeMatchedColleges.filter((c) => {
		if (!effectiveCity) return true;
		return (c.city?.trim() || "Kolhapur") === effectiveCity;
	});
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
		onOpenChange(false);
	}
	const cityOk = relevantCities.length >= 1;
	const canConfirm = Boolean(type && cityOk && college);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange: (v) => {
			if (!v && !collegeFilter.college) return;
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "w-[90vw] max-w-md p-5 overflow-y-auto max-h-[90dvh]",
			hideCloseButton: !collegeFilter.college,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-left space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle$1, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 shrink-0 text-primary" }), "Select College View"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground leading-snug",
						children: "Choose the college whose admissions you want to manage."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "1. College Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: ["engineering", "medical"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleTypeChange(t),
									className: cn("flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-colors", type === t ? "border-primary bg-brand-soft text-primary" : "border-border bg-card hover:bg-muted/50"),
									children: [t === "engineering" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-5" }), t === "engineering" ? "Engineering" : "Medical"]
								}, t))
							})]
						}),
						type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "2. City"
							}), relevantCities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground",
								children: [
									"No ",
									type,
									" colleges added yet. Go to Settings to add some."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: effectiveCity || "",
								onValueChange: (v) => {
									setCity(v);
									setCollege("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a city" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: relevantCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c,
									children: c
								}, c)) })]
							})]
						}),
						type && cityOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "3. College"
							}), filteredColleges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground",
								children: [
									"No colleges found for ",
									effectiveCity,
									". Add them in Settings."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: college || "",
								onValueChange: setCollege,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full text-left whitespace-normal h-auto min-h-[44px] py-2 px-3 text-xs [&>span]:line-clamp-2 [&>span]:whitespace-normal",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a college" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									className: "w-[var(--radix-select-trigger-width)] max-h-60",
									children: filteredColleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.collegeName,
										className: "py-2.5 text-xs whitespace-normal break-words pr-8 leading-snug",
										children: c.collegeName
									}, c.id))
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full mt-2",
					disabled: !canConfirm,
					onClick: handleConfirm,
					children: "View Admissions"
				})
			]
		})
	});
}
/**
* Sidebar chip — shows the active college filter and lets global admin change it.
*/
function CollegeFilterChip() {
	const { collegeFilter } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!collegeFilter.college) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
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
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterDialog, {
		open,
		onOpenChange: setOpen
	})] });
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
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
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterChip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBlock, { onNavigate })
		]
	});
}
function AdminShell({ title, subtitle, action, children }) {
	const { user, loading, configured, needsCollegeFilter, userRole } = useAuth();
	const isGlobalAdmin = useIsGlobalAdmin();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isGlobalAdmin && needsCollegeFilter) setFilterOpen(true);
	}, [isGlobalAdmin, needsCollegeFilter]);
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
				open: filterOpen,
				onOpenChange: setFilterOpen
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
export { SelectItem as a, SetupNotice as c, SheetHeader as d, SheetTitle as f, SelectContent as i, Sheet as l, NivasiLogo as n, SelectTrigger as o, Select as r, SelectValue as s, AdminShell as t, SheetContent as u };
