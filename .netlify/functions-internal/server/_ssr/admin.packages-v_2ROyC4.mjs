import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, d as DialogClose, f as DialogContent$1, g as DialogTitle$1, h as DialogPortal$1, m as DialogOverlay$1, p as DialogDescription$1, u as Dialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Package, m as Pencil, p as Plus, t as X, v as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as Skeleton, n as Button, s as cn, t as AdminShell } from "./admin-shell-BEyrPzKA.mjs";
import { t as Input } from "./input-D5zZVfJK.mjs";
import { t as Label } from "./label-DNpubL_K.mjs";
import { n as SERVICE_OPTIONS, t as Checkbox } from "./types-DMN9mVru.mjs";
import { f as savePackage, h as setPackageActive } from "./db-CHlv9xOD.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as usePackages } from "./hooks-BIoUISqM.mjs";
import { r as formatINR } from "./format-Bg5w10xg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./stat-card-DupRkhzd.mjs";
import { t as Switch } from "./switch-D5qFC-Js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.packages-v_2ROyC4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function PackagesPage() {
	const { data: packages = [], isLoading } = usePackages();
	const queryClient = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	async function toggle(pkg, active) {
		try {
			await setPackageActive(pkg.id, active);
			await queryClient.invalidateQueries({ queryKey: ["packages"] });
		} catch {
			toast.error("Could not update the package.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Packages",
		subtitle: "Define the stay and service plans staff can assign to students.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => {
				setEditing(null);
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Package"]
		}),
		children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-2xl" }, i))
		}) : packages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No packages yet",
			description: "Create your first package to assign it during admissions."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: packages.map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-xl bg-brand-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-[18px]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: pkg.active,
							onCheckedChange: (v) => toggle(pkg, v),
							"aria-label": "Package active"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-base font-bold",
						children: pkg.packageName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: pkg.services.join(" · ") || "No services listed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-xl font-bold text-primary",
						children: pkg.price > 0 ? formatINR(pkg.price) : "Custom pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [pkg.duration, " days"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "mt-4",
						onClick: () => {
							setEditing(pkg);
							setOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Edit"]
					})
				]
			}, pkg.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageDialog, {
			open,
			onOpenChange: setOpen,
			editing
		})]
	});
}
function PackageDialog({ open, onOpenChange, editing }) {
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("30");
	const [services, setServices] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [key, setKey] = (0, import_react.useState)("");
	const editKey = editing?.id ?? "new";
	if (open && key !== editKey) {
		setKey(editKey);
		setName(editing?.packageName ?? "");
		setPrice(editing ? String(editing.price) : "");
		setDuration(editing ? String(editing.duration) : "30");
		setServices(editing?.services ?? []);
	}
	async function submit(e) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Package name is required.");
			return;
		}
		setSaving(true);
		try {
			await savePackage({
				packageName: name.trim(),
				price: Number(price || 0),
				duration: Number(duration || 30),
				services,
				active: editing?.active ?? true
			}, editing?.id);
			await queryClient.invalidateQueries({ queryKey: ["packages"] });
			toast.success(editing ? "Package updated" : "Package created");
			setKey("");
			onOpenChange(false);
		} catch {
			toast.error("Could not save the package.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) setKey("");
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Package" : "New Package" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold",
							children: "Package Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Stay + Food"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Price ₹"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: price,
								onChange: (e) => setPrice(e.target.value.replace(/[^\d]/g, "")),
								placeholder: "0 for custom"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Duration (days)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: duration,
								onChange: (e) => setDuration(e.target.value.replace(/[^\d]/g, ""))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs font-semibold",
						children: "Included Services"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-2 sm:grid-cols-2",
						children: SERVICE_OPTIONS.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: services.includes(service),
								onCheckedChange: (checked) => setServices((prev) => checked ? [...prev, service] : prev.filter((s) => s !== service))
							}), service]
						}, service))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), editing ? "Save Changes" : "Create Package"]
					}) })
				]
			})]
		})
	});
}
//#endregion
export { PackagesPage as component };
