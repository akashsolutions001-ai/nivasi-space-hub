import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { a as useIsMessEmployee, n as useAuth, r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { C as Search, D as Plus, I as LoaderCircle, O as Phone, b as ShieldAlert, c as User, h as ToggleLeft, k as Pencil, m as ToggleRight, o as UtensilsCrossed, p as Trash2, s as Users, u as UserCheck } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { H as updateMess, P as setMessStatus, Q as useAdmissions, d as createMess, gt as useMesses, ot as useEmployees, v as deleteMess } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-DY9scxej.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { o as isValidIndianMobile } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BxSmFKrL.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.mess.index-B7llMXpb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useMessStats(messes, employees, admissions) {
	const employeeList = employees ?? [];
	const admissionList = admissions ?? [];
	return messes.map((m) => ({
		...m,
		employeeCount: employeeList.filter((e) => e.messIds.includes(m.id)).length,
		studentCount: admissionList.filter((a) => a.messId === m.id).length
	}));
}
function MessFormDialog({ open, onClose, existing }) {
	const qc = useQueryClient();
	const [messName, setMessName] = (0, import_react.useState)(existing?.messName ?? "");
	const [serialNumber, setSerialNumber] = (0, import_react.useState)(existing?.serialNumber?.toString() ?? "");
	const [ownerName, setOwnerName] = (0, import_react.useState)(existing?.ownerName ?? "");
	const [ownerPhone, setOwnerPhone] = (0, import_react.useState)(existing?.ownerPhone ?? "");
	const [messDescription, setMessDescription] = (0, import_react.useState)(existing?.messDescription ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	function validate() {
		const e = {};
		if (!messName.trim()) e.messName = "Mess name is required.";
		if (serialNumber.trim() && (isNaN(Number(serialNumber)) || Number(serialNumber) < 1)) e.serialNumber = "Serial number must be a positive number.";
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
			const sn = serialNumber.trim() ? Number(serialNumber.trim()) : void 0;
			if (existing) {
				await updateMess(existing.id, {
					messName: messName.trim(),
					ownerName: ownerName.trim(),
					ownerPhone: phone,
					messDescription: messDescription.trim(),
					serialNumber: sn
				});
				toast.success("Mess updated.");
			} else {
				await createMess({
					messId: "",
					messName: messName.trim(),
					ownerName: ownerName.trim(),
					ownerPhone: phone,
					status: "active",
					messDescription: messDescription.trim(),
					serialNumber: sn
				});
				toast.success("Mess created.");
			}
			await qc.invalidateQueries({ queryKey: ["messes"] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save mess.");
		} finally {
			setSaving(false);
		}
	}
	function handleOpenChange(v) {
		if (!v) {
			setErrors({});
			onClose();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: existing ? "Edit Mess" : "Create Mess" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "serialNumber",
								children: "Serial Number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "serialNumber",
								value: serialNumber,
								onChange: (e) => {
									setSerialNumber(e.target.value.replace(/\D/g, ""));
									setErrors((p) => ({
										...p,
										serialNumber: void 0
									}));
								},
								placeholder: "e.g. 1",
								inputMode: "numeric",
								className: errors.serialNumber ? "border-destructive" : ""
							}),
							errors.serialNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.serialNumber
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Shown to students instead of the mess name."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "messName",
								children: "Mess Name *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "messName",
								value: messName,
								onChange: (e) => {
									setMessName(e.target.value);
									setErrors((p) => ({
										...p,
										messName: void 0
									}));
								},
								placeholder: "e.g. Shree Ganesh Mess",
								className: errors.messName ? "border-destructive" : ""
							}),
							errors.messName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-destructive",
								children: errors.messName
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ownerName",
							children: "Owner Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ownerName",
							value: ownerName,
							onChange: (e) => setOwnerName(e.target.value),
							placeholder: "e.g. Amit Patil"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ownerPhone",
								children: "Owner Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ownerPhone",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "messDescription",
								children: "Mess Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "messDescription",
								value: messDescription,
								onChange: (e) => setMessDescription(e.target.value),
								placeholder: "e.g. Lunch and dinner provided daily. Lunch: 1 PM – 2 PM. Dinner: 8 PM – 9 PM.",
								rows: 4,
								className: "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Visible to assigned students and employees."
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
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), existing ? "Save Changes" : "Create Mess"]
					})] })
				]
			})]
		})
	});
}
function MessIndexPage() {
	const qc = useQueryClient();
	const isGlobalAdmin = useIsGlobalAdmin();
	const isMessEmployee = useIsMessEmployee();
	const { employeeMessIds } = useAuth();
	const { data: messes = [], isLoading } = useMesses();
	const { data: employees } = useEmployees();
	const { data: admissions } = useAdmissions();
	const messStats = useMessStats(messes, employees, admissions);
	const [search, setSearch] = (0, import_react.useState)("");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const filtered = (isMessEmployee ? messStats.filter((m) => employeeMessIds.includes(m.id)) : messStats).filter((m) => !search || m.messName.toLowerCase().includes(search.toLowerCase()) || m.ownerName.toLowerCase().includes(search.toLowerCase()));
	async function toggleStatus(m) {
		setTogglingId(m.id);
		try {
			await setMessStatus(m.id, m.status === "active" ? "inactive" : "active");
			await qc.invalidateQueries({ queryKey: ["messes"] });
			toast.success(`Mess ${m.status === "active" ? "deactivated" : "activated"}.`);
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
			await deleteMess(deleteTarget.id);
			await qc.invalidateQueries({ queryKey: ["messes"] });
			toast.success(`"${deleteTarget.messName}" deleted.`);
			setDeleteTarget(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not delete mess.");
		} finally {
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: isMessEmployee ? "My Messes" : "Mess Management",
		subtitle: isMessEmployee ? "Your assigned messes and their students." : "Manage messes, owners, employees and student assignments.",
		action: !isMessEmployee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/mess/employees",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1.5 size-4" }), "Employees"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/mess/assign",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-1.5 size-4" }), "Assign Students"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setCreateOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), "New Mess"]
				})
			]
		}) : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Search by mess or owner name…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			!isMessEmployee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total Messes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold",
							children: messes.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Active Messes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold text-success",
							children: messes.filter((m) => m.status === "active").length
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: search ? "No messes match your search." : "No messes yet."
							}),
							!search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setCreateOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), " Create First Mess"]
							})
						]
					})
				}) : filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [m.serialNumber != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold shrink-0",
										children: m.serialNumber
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-display text-base font-bold",
										children: m.messName
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: m.status === "active" ? "default" : "secondary",
									className: `mt-1 text-[11px] ${m.status === "active" ? "bg-success/15 text-success border-success/30" : ""}`,
									children: m.status === "active" ? "Active" : "Inactive"
								})]
							}), !isMessEmployee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8",
										onClick: () => setEditTarget(m),
										"aria-label": "Edit mess",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8",
										onClick: () => toggleStatus(m),
										disabled: togglingId === m.id,
										"aria-label": m.status === "active" ? "Deactivate" : "Activate",
										children: togglingId === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : m.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "size-4 text-muted-foreground" })
									}),
									isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
										onClick: () => setDeleteTarget(m),
										"aria-label": "Delete mess",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1.5 border-t border-border pt-3",
							children: [m.ownerName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: m.ownerName
								})]
							}), m.ownerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${m.ownerPhone}`,
									className: "text-primary hover:underline",
									children: m.ownerPhone
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
									children: m.studentCount
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/40 px-3 py-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Employees"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold",
									children: m.employeeCount
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "mt-3 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/mess/$messId",
								params: { messId: m.id },
								children: "View Students"
							})
						})
					]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessFormDialog, {
				open: createOpen,
				onClose: () => setCreateOpen(false)
			}),
			editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessFormDialog, {
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
						deleteTarget?.messName,
						"”?"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block",
						children: [
							"This will permanently delete the mess from the system. This action",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "cannot be undone" }),
							"."
						]
					}), (deleteTarget?.studentCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: [
							"⚠ This mess has",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [deleteTarget.studentCount, " student(s)"] }),
							" assigned. Their mess assignment will be orphaned. Consider reassigning them first."
						]
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: deleting,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
					onClick: handleDelete,
					disabled: deleting,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: [deleting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Yes, Delete Mess"]
				})] })] })
			})
		]
	});
}
//#endregion
export { MessIndexPage as component };
