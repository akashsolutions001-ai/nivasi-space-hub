import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { C as Search, D as Plus, I as LoaderCircle, O as Phone, b as ShieldAlert, c as User, h as ToggleLeft, i as WashingMachine, k as Pencil, m as ToggleRight, p as Trash2, s as Users, u as UserCheck } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { B as updateLaundry, N as setLaundryStatus, Q as useAdmissions, _ as deleteLaundry, l as createLaundry, lt as useLaundryEmployees, st as useLaundries } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-DY9scxej.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { o as isValidIndianMobile } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BxSmFKrL.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry.index-EmhUlcGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useLaundryStats(laundries, employees, admissions) {
	const empList = employees ?? [];
	const admList = admissions ?? [];
	return laundries.map((l) => ({
		...l,
		employeeCount: empList.filter((e) => e.laundryIds.includes(l.id)).length,
		studentCount: admList.filter((a) => a.laundryId === l.id).length
	}));
}
function LaundryFormDialog({ open, onClose, existing }) {
	const qc = useQueryClient();
	const [laundryName, setLaundryName] = (0, import_react.useState)(existing?.laundryName ?? "");
	const [ownerName, setOwnerName] = (0, import_react.useState)(existing?.ownerName ?? "");
	const [ownerPhone, setOwnerPhone] = (0, import_react.useState)(existing?.ownerPhone ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	function validate() {
		const e = {};
		if (!laundryName.trim()) e.laundryName = "Laundry name is required.";
		if (ownerPhone.trim() && !isValidIndianMobile(ownerPhone)) e.ownerPhone = "Enter a valid 10-digit Indian mobile number.";
		setErrors(e);
		return Object.keys(e).length === 0;
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!validate()) return;
		setSaving(true);
		try {
			const phone = ownerPhone.replace(/\D/g, "");
			if (existing) {
				await updateLaundry(existing.id, {
					laundryName: laundryName.trim(),
					ownerName: ownerName.trim(),
					ownerPhone: phone
				});
				toast.success("Laundry updated.");
			} else {
				await createLaundry({
					laundryId: "",
					laundryName: laundryName.trim(),
					ownerName: ownerName.trim(),
					ownerPhone: phone,
					status: "active"
				});
				toast.success("Laundry created.");
			}
			await qc.invalidateQueries({ queryKey: ["laundries"] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save laundry.");
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: existing ? "Edit Laundry" : "Create Laundry" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "laundryName",
								children: "Laundry Name *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "laundryName",
								value: laundryName,
								onChange: (e) => {
									setLaundryName(e.target.value);
									setErrors((p) => ({
										...p,
										laundryName: void 0
									}));
								},
								placeholder: "e.g. Clean Zone Laundry",
								className: errors.laundryName ? "border-destructive" : ""
							}),
							errors.laundryName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.laundryName
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lOwnerName",
							children: "Owner Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lOwnerName",
							value: ownerName,
							onChange: (e) => setOwnerName(e.target.value),
							placeholder: "e.g. Suresh Patil"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "lOwnerPhone",
								children: "Owner Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lOwnerPhone",
								value: ownerPhone,
								onChange: (e) => {
									setOwnerPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
									setErrors((p) => ({
										...p,
										ownerPhone: void 0
									}));
								},
								placeholder: "e.g. 9876543210",
								inputMode: "numeric",
								maxLength: 10,
								className: errors.ownerPhone ? "border-destructive" : ""
							}),
							errors.ownerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.ownerPhone
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), existing ? "Save Changes" : "Create Laundry"]
					})] })
				]
			})]
		})
	});
}
function LaundryIndexPage() {
	const qc = useQueryClient();
	const isGlobalAdmin = useIsGlobalAdmin();
	const { data: laundries = [], isLoading } = useLaundries();
	const { data: employees } = useLaundryEmployees();
	const { data: admissions } = useAdmissions();
	const laundryStats = useLaundryStats(laundries, employees, admissions);
	const [search, setSearch] = (0, import_react.useState)("");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const filtered = laundryStats.filter((l) => !search || l.laundryName.toLowerCase().includes(search.toLowerCase()) || l.ownerName.toLowerCase().includes(search.toLowerCase()));
	async function toggleStatus(l) {
		setTogglingId(l.id);
		try {
			await setLaundryStatus(l.id, l.status === "active" ? "inactive" : "active");
			await qc.invalidateQueries({ queryKey: ["laundries"] });
			toast.success(`Laundry ${l.status === "active" ? "deactivated" : "activated"}.`);
		} catch {
			toast.error("Could not update status.");
		} finally {
			setTogglingId(null);
		}
	}
	async function handleDelete() {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await deleteLaundry(deleteTarget.id);
			await qc.invalidateQueries({ queryKey: ["laundries"] });
			toast.success(`"${deleteTarget.laundryName}" deleted.`);
			setDeleteTarget(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not delete laundry.");
		} finally {
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Laundry Management",
		subtitle: "Manage laundry services, owners, employees and student assignments.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/laundry/employees",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1.5 size-4" }), "Employees"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/laundry/assign",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-1.5 size-4" }), "Assign Students"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setCreateOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), "New Laundry"]
				})
			]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Search by laundry or owner name…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total Laundries"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold",
							children: laundries.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Active Laundries"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold text-success",
							children: laundries.filter((l) => l.status === "active").length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total Employees"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold",
							children: (employees ?? []).length
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 xl:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: search ? "No laundries match your search." : "No laundries yet."
							}),
							!search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setCreateOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), " Create First Laundry"]
							})
						]
					})
				}) : filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate font-display text-base font-bold",
									children: l.laundryName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: l.status === "active" ? "default" : "secondary",
									className: `mt-1 text-[11px] ${l.status === "active" ? "bg-success/15 text-success border-success/30" : ""}`,
									children: l.status === "active" ? "Active" : "Inactive"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8",
										onClick: () => setEditTarget(l),
										"aria-label": "Edit laundry",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8",
										onClick: () => toggleStatus(l),
										disabled: togglingId === l.id,
										"aria-label": l.status === "active" ? "Deactivate" : "Activate",
										children: togglingId === l.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : l.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "size-4 text-muted-foreground" })
									}),
									isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
										onClick: () => setDeleteTarget(l),
										"aria-label": "Delete laundry",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1.5 border-t border-border pt-3",
							children: [l.ownerName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: l.ownerName
								})]
							}), l.ownerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${l.ownerPhone}`,
									className: "text-primary hover:underline",
									children: l.ownerPhone
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/40 px-3 py-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Students"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold",
									children: l.studentCount
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/40 px-3 py-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Employees"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold",
									children: l.employeeCount
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "mt-3 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/laundry/$laundryId",
								params: { laundryId: l.id },
								children: "View Students"
							})
						})
					]
				}, l.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryFormDialog, {
				open: createOpen,
				onClose: () => setCreateOpen(false)
			}),
			editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryFormDialog, {
				open: !!editTarget,
				onClose: () => setEditTarget(null),
				existing: editTarget
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteTarget,
				onOpenChange: (v) => {
					if (!v) setDeleteTarget(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-destructive" }),
						"Delete “",
						deleteTarget?.laundryName,
						"”?"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block",
						children: [
							"This will permanently delete the laundry from the system. This action",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "cannot be undone" }),
							"."
						]
					}), (deleteTarget?.studentCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: [
							"⚠ This laundry has",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [deleteTarget.studentCount, " student(s)"] }),
							" assigned. Consider reassigning them first."
						]
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: deleting,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
					onClick: handleDelete,
					disabled: deleting,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: [deleting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Yes, Delete Laundry"]
				})] })] })
			})
		]
	});
}
//#endregion
export { LaundryIndexPage as component };
