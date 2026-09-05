import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { C as Search, D as Plus, I as LoaderCircle, h as ToggleLeft, k as Pencil, m as ToggleRight, n as X, s as Users, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { V as updateLaundryEmployee, lt as useLaundryEmployees, st as useLaundries, u as createLaundryEmployee } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-Gk-9Tmgx.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { a as isValidEmail, o as isValidIndianMobile } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry.employees-xxNeH4nG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LaundryMultiPicker({ allLaundries, selectedIds, onChange }) {
	function toggle(id) {
		onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [selectedIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5",
			children: selectedIds.map((id) => {
				const l = allLaundries.find((x) => x.id === id);
				if (!l) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary",
					children: [l.laundryName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toggle(id),
						className: "ml-0.5 rounded-full hover:text-destructive",
						"aria-label": `Remove ${l.laundryName}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
					})]
				}, id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: "",
			onValueChange: (v) => {
				if (v) toggle(v);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: selectedIds.length === 0 ? "Select laundry(s)…" : "Add another laundry…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [allLaundries.filter((l) => !selectedIds.includes(l.id)).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: l.id,
				children: l.laundryName
			}, l.id)), allLaundries.every((l) => selectedIds.includes(l.id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-2 text-xs text-muted-foreground",
				children: "All laundries selected"
			})] })]
		})]
	});
}
function EmployeeFormDialog({ open, onClose, existing, laundries }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "");
	const [email, setEmail] = (0, import_react.useState)(existing?.email ?? "");
	const [phone, setPhone] = (0, import_react.useState)(existing?.phone ?? "");
	const [password, setPassword] = (0, import_react.useState)("");
	const [selectedLaundryIds, setSelectedLaundryIds] = (0, import_react.useState)(existing?.laundryIds ?? []);
	const [role, setRole] = (0, import_react.useState)(existing?.role ?? "LAUNDRY_EMPLOYEE");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	function getLaundryNames(ids) {
		return ids.map((id) => laundries.find((l) => l.id === id)?.laundryName ?? "").filter(Boolean);
	}
	function validate() {
		const e = {};
		if (!name.trim()) e.name = "Full name is required.";
		else if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
		if (!existing) {
			if (!email.trim()) e.email = "Email is required.";
			else if (!isValidEmail(email)) e.email = "Enter a valid email address.";
		}
		if (phone.trim() && !isValidIndianMobile(phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
		if (!existing) {
			if (!password) e.password = "Password is required.";
			else if (password.length < 6) e.password = "Password must be at least 6 characters.";
		}
		setErrors(e);
		return Object.keys(e).length === 0;
	}
	function clearErr(field) {
		setErrors((p) => ({
			...p,
			[field]: void 0
		}));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!validate()) return;
		if (selectedLaundryIds.length === 0) {
			toast.error("Assign at least one laundry.");
			return;
		}
		setSaving(true);
		try {
			const laundryNames = getLaundryNames(selectedLaundryIds);
			if (existing) {
				await updateLaundryEmployee(existing.id, {
					name: name.trim(),
					phone: phone.replace(/\D/g, ""),
					laundryIds: selectedLaundryIds,
					laundryNames,
					role
				});
				toast.success("Employee updated.");
			} else {
				await createLaundryEmployee({
					name: name.trim(),
					email: email.trim(),
					password,
					phone: phone.replace(/\D/g, ""),
					laundryIds: selectedLaundryIds,
					laundryNames,
					role
				});
				toast.success(`Employee account created for ${name.trim()}.`);
			}
			await qc.invalidateQueries({ queryKey: ["laundryEmployees"] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save employee.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) {
				setErrors({});
				onClose();
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: existing ? "Edit Employee" : "Add Employee" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "le-name",
								children: "Full Name *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "le-name",
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									clearErr("name");
								},
								placeholder: "Rahul Patil",
								className: errors.name ? "border-destructive" : ""
							}),
							errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.name
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "le-email",
								children: "Email *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "le-email",
								type: "email",
								value: email,
								onChange: (e) => {
									setEmail(e.target.value);
									clearErr("email");
								},
								placeholder: "rahul@example.com",
								disabled: !!existing,
								className: errors.email ? "border-destructive" : ""
							}),
							errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.email
							})
						]
					}),
					!existing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "le-password",
								children: "Password * (min 6 chars)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "le-password",
								type: "password",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									clearErr("password");
								},
								autoComplete: "new-password",
								className: errors.password ? "border-destructive" : ""
							}),
							errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.password
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "le-phone",
								children: "Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "le-phone",
								value: phone,
								onChange: (e) => {
									setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
									clearErr("phone");
								},
								placeholder: "9876543210",
								inputMode: "numeric",
								maxLength: 10,
								className: errors.phone ? "border-destructive" : ""
							}),
							errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.phone
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assigned Laundry(s) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryMultiPicker, {
							allLaundries: laundries,
							selectedIds: selectedLaundryIds,
							onChange: setSelectedLaundryIds
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: role,
							onValueChange: (v) => setRole(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "LAUNDRY_EMPLOYEE",
								children: "Laundry Employee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "LAUNDRY_MANAGER",
								children: "Laundry Manager"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), existing ? "Save Changes" : "Create Employee"]
					})] })
				]
			})]
		})
	});
}
function LaundryEmployeesPage() {
	const qc = useQueryClient();
	const { data: employees = [], isLoading } = useLaundryEmployees();
	const { data: laundries = [] } = useLaundries();
	const [search, setSearch] = (0, import_react.useState)("");
	const [laundryFilter, setLaundryFilter] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const filtered = employees.filter((e) => {
		const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search);
		const matchLaundry = laundryFilter === "all" || e.laundryIds.includes(laundryFilter);
		return matchSearch && matchLaundry;
	});
	async function toggleStatus(emp) {
		setTogglingId(emp.id);
		try {
			await updateLaundryEmployee(emp.id, { status: emp.status === "active" ? "inactive" : "active" });
			await qc.invalidateQueries({ queryKey: ["laundryEmployees"] });
			toast.success(`Employee ${emp.status === "active" ? "deactivated" : "activated"}.`);
		} catch {
			toast.error("Could not update status.");
		} finally {
			setTogglingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Laundry Employees",
		subtitle: "Manage laundry staff. Each employee can be assigned to multiple laundries.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/laundry",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Laundry"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setCreateOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), " Add Employee"]
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search name, email, phone…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: laundryFilter,
					onValueChange: setLaundryFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by laundry" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All Laundries"
					}), laundries.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: l.id,
						children: l.laundryName
					}, l.id))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: search || laundryFilter !== "all" ? "No employees match your filters." : "No employees yet."
						}),
						!search && laundryFilter === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setCreateOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), " Add First Employee"]
						})
					]
				}) : filtered.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: emp.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[11px]",
										children: emp.role === "LAUNDRY_MANAGER" ? "Manager" : "Employee"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-[11px] ${emp.status === "active" ? "border-success/30 bg-success/10 text-success" : "text-muted-foreground"}`,
										children: emp.status
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-sm text-muted-foreground",
								children: emp.email
							}),
							emp.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: emp.phone
							}),
							emp.laundryIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1",
								children: emp.laundryIds.map((id, i) => {
									const name = emp.laundryNames[i] ?? laundries.find((l) => l.id === id)?.laundryName ?? id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary",
										children: name
									}, id);
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-1 pt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-8",
							onClick: () => setEditTarget(emp),
							"aria-label": "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-8",
							onClick: () => toggleStatus(emp),
							disabled: togglingId === emp.id,
							"aria-label": emp.status === "active" ? "Deactivate" : "Activate",
							children: togglingId === emp.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : emp.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "size-4 text-muted-foreground" })
						})]
					})]
				}, emp.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFormDialog, {
				open: createOpen,
				onClose: () => setCreateOpen(false),
				laundries
			}),
			editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFormDialog, {
				open: !!editTarget,
				onClose: () => setEditTarget(null),
				existing: editTarget,
				laundries
			})
		]
	});
}
//#endregion
export { LaundryEmployeesPage as component };
