import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth } from "./auth-CoXP-0dY.mjs";
import { E as Building2, l as Sparkles, p as Plus, v as LoaderCircle, x as GraduationCap } from "../_libs/lucide-react.mjs";
import { a as Skeleton, n as Button, t as AdminShell } from "./admin-shell-CHBrYa7c.mjs";
import { t as Input } from "./input-D7CPUA3X.mjs";
import { g as setPropertyActive, m as setCollegeActive, n as addProperty, p as seedDefaults, t as addCollege } from "./db-B591BTQo.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { i as useColleges, o as useProperties } from "./hooks-CvIMf7dK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-D6CkgN0l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DeZYobjv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [seeding, setSeeding] = (0, import_react.useState)(false);
	async function runSeed() {
		setSeeding(true);
		try {
			await seedDefaults();
			await queryClient.invalidateQueries();
			toast.success("Default colleges and packages are ready.");
		} catch {
			toast.error("Could not load the default data.");
		} finally {
			setSeeding(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Settings",
		subtitle: "Workspace configuration for the NivasiSpace team.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold",
							children: "Signed-in Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: user?.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Staff accounts are created by an administrator in Firebase Authentication. Self sign-up is disabled for this workspace."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-primary/25 bg-brand-soft/60 p-5 shadow-soft lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold",
							children: "Starter Data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Load the default NivasiSpace packages and a starter college list. Existing records are never overwritten."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-4",
							onClick: runSeed,
							disabled: seeding,
							children: [seeding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Load Default Packages & Colleges"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegesCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertiesCard, {})
			]
		})
	});
}
function CollegesCard() {
	const { data: colleges = [], isLoading } = useColleges();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addCollege(name.trim());
			await queryClient.invalidateQueries({ queryKey: ["colleges"] });
			setName("");
			toast.success("College added");
		} catch {
			toast.error("Could not add the college.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), "Colleges"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Add a college"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: saving,
					"aria-label": "Add college",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : colleges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No colleges yet."
				}) : colleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: c.collegeName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: c.active,
						"aria-label": "College active",
						onCheckedChange: async (v) => {
							await setCollegeActive(c.id, v);
							await queryClient.invalidateQueries({ queryKey: ["colleges"] });
						}
					})]
				}, c.id))
			})
		]
	});
}
function PropertiesCard() {
	const { data: properties = [], isLoading } = useProperties();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addProperty(name.trim());
			await queryClient.invalidateQueries({ queryKey: ["properties"] });
			setName("");
			toast.success("Property added");
		} catch {
			toast.error("Could not add the property.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-primary" }), "Properties"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Add a property"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: saving,
					"aria-label": "Add property",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : properties.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No properties yet."
				}) : properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: p.propertyName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: p.active,
						"aria-label": "Property active",
						onCheckedChange: async (v) => {
							await setPropertyActive(p.id, v);
							await queryClient.invalidateQueries({ queryKey: ["properties"] });
						}
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
