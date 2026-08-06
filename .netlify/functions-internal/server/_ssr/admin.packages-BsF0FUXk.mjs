import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as useIsGlobalAdmin } from "./auth-DbpSDgTm.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Lock, _ as Plus, v as Pencil, w as LoaderCircle, y as Package } from "../_libs/lucide-react.mjs";
import { A as setPackageActive, D as savePackage, I as usePackages, a as DialogFooter, h as Skeleton, i as DialogContent, n as Button, o as DialogHeader, r as Dialog, s as DialogTitle, t as AdminShell } from "./admin-shell-DbLl1eJ-.mjs";
import { t as Input } from "./input-BRq9ZYTb.mjs";
import { t as Label } from "./label-CwHe0bR-.mjs";
import { n as SERVICE_OPTIONS, t as Checkbox } from "./types-B2AqjYmj.mjs";
import { r as formatINR } from "./format-Bg5w10xg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./stat-card-DO4KCARC.mjs";
import { t as Switch } from "./switch-Aj459Xsd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.packages-BsF0FUXk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PackagesPage() {
	const { data: packages = [], isLoading } = usePackages();
	const queryClient = useQueryClient();
	const isGlobalAdmin = useIsGlobalAdmin();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	async function toggle(pkg, active) {
		if (!isGlobalAdmin) {
			toast.error("Only the Global Admin can modify packages.");
			return;
		}
		try {
			await setPackageActive(pkg.id, active);
			await queryClient.invalidateQueries({ queryKey: ["packages"] });
		} catch {
			toast.error("Could not update the package.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Packages",
		subtitle: isGlobalAdmin ? "Define the stay and service plans staff can assign to students." : "View available stay and service plans. Contact the Global Admin to make changes.",
		action: isGlobalAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => {
				setEditing(null);
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New Package"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), "Global Admin only"]
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
							"aria-label": "Package active",
							disabled: !isGlobalAdmin
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-base font-bold",
						children: pkg.packageName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-base font-bold text-muted-foreground",
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
					isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
		}), isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageDialog, {
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
