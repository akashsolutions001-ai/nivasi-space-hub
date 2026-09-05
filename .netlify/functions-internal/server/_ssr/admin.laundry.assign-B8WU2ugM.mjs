import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { C as Search, I as LoaderCircle, _ as Square, u as UserCheck, ut as ArrowLeft, v as SquareCheckBig } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Q as useAdmissions, r as assignStudentToLaundry, st as useLaundries } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-Gk-9Tmgx.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laundry.assign-B8WU2ugM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LaundryAssignPage() {
	const qc = useQueryClient();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: laundries = [], isLoading: laundryLoading } = useLaundries();
	const [search, setSearch] = (0, import_react.useState)("");
	const [laundryFilter, setLaundryFilter] = (0, import_react.useState)("all");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkLaundryId, setBulkLaundryId] = (0, import_react.useState)("");
	const [bulkStatus, setBulkStatus] = (0, import_react.useState)("active");
	const [assigning, setAssigning] = (0, import_react.useState)(false);
	const [singleAssigning, setSingleAssigning] = (0, import_react.useState)(null);
	const activeLaundries = laundries.filter((l) => l.status === "active");
	const filtered = (0, import_react.useMemo)(() => admissions.filter((a) => {
		const matchSearch = !search || a.fullName.toLowerCase().includes(search.toLowerCase()) || a.phoneNumber.includes(search) || (a.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
		const currentLaundryId = a.laundryId ?? "";
		return matchSearch && (laundryFilter === "all" ? true : laundryFilter === "unassigned" ? !currentLaundryId : currentLaundryId === laundryFilter);
	}), [
		admissions,
		search,
		laundryFilter
	]);
	function toggleSelect(id) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	function selectAll() {
		setSelectedIds(new Set(filtered.map((a) => a.id)));
	}
	function clearSelection() {
		setSelectedIds(/* @__PURE__ */ new Set());
	}
	async function assignSingle(studentId, laundryId, laundryName, status = "active") {
		setSingleAssigning(studentId);
		try {
			await assignStudentToLaundry(studentId, laundryId, laundryName, status);
			await qc.invalidateQueries({ queryKey: ["admissions"] });
			toast.success("Student assigned.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not assign student.");
		} finally {
			setSingleAssigning(null);
		}
	}
	async function assignBulk() {
		if (!bulkLaundryId) {
			toast.error("Select a laundry to assign to.");
			return;
		}
		if (selectedIds.size === 0) {
			toast.error("Select at least one student.");
			return;
		}
		const laundry = laundries.find((l) => l.id === bulkLaundryId);
		if (!laundry) return;
		setAssigning(true);
		try {
			await Promise.all([...selectedIds].map((id) => assignStudentToLaundry(id, bulkLaundryId, laundry.laundryName, bulkStatus)));
			await qc.invalidateQueries({ queryKey: ["admissions"] });
			toast.success(`${selectedIds.size} student${selectedIds.size > 1 ? "s" : ""} assigned to ${laundry.laundryName}.`);
			setSelectedIds(/* @__PURE__ */ new Set());
			setBulkLaundryId("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not complete bulk assignment.");
		} finally {
			setAssigning(false);
		}
	}
	const isLoading = admLoading || laundryLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Assign Students to Laundry",
		subtitle: "Link students to a laundry service and set their subscription status.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/laundry",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Laundry"]
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search student name, phone, property…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: laundryFilter,
					onValueChange: setLaundryFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by laundry" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Students"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "unassigned",
							children: "Not Assigned"
						}),
						laundries.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: l.id,
							children: l.laundryName
						}, l.id))
					] })]
				})]
			}),
			selectedIds.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-medium",
						children: [selectedIds.size, " selected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: bulkLaundryId,
						onValueChange: setBulkLaundryId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose laundry" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: activeLaundries.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: l.id,
							children: l.laundryName
						}, l.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: bulkStatus,
						onValueChange: (v) => setBulkStatus(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "paused",
								children: "Paused"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelled",
								children: "Cancelled"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: assignBulk,
						disabled: assigning,
						children: [
							assigning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-4 animate-spin" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-1.5 size-4" }),
							" Assign All"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: clearSelection,
						children: "Clear"
					})
				]
			}),
			filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: selectedIds.size === filtered.length ? clearSelection : selectAll,
						className: "flex items-center gap-1.5 hover:text-foreground",
						children: [selectedIds.size === filtered.length && filtered.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }), selectedIds.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						filtered.length,
						" student",
						filtered.length !== 1 ? "s" : ""
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "No students found."
					})]
				}) : filtered.map((student) => {
					const currentLaundryId = student.laundryId ?? "";
					const laundryStatus = student.laundryStatus ?? "active";
					const currentLaundry = laundries.find((l) => l.id === currentLaundryId);
					const isSelected = selectedIds.has(student.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${isSelected ? "border-primary/50 bg-primary/5" : "border-border bg-card"} shadow-soft`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleSelect(student.id),
								className: "shrink-0",
								"aria-label": "Select student",
								children: isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-5 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: student.fullName
										}),
										currentLaundry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[11px] border-success/30 bg-success/10 text-success",
											children: currentLaundry.laundryName
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[11px] text-muted-foreground",
											children: "Not Assigned"
										}),
										currentLaundryId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: `text-[11px] capitalize ${laundryStatus === "active" ? "border-success/30 text-success" : laundryStatus === "paused" ? "border-warning/30 text-warning-foreground" : "border-destructive/20 text-destructive"}`,
											children: ["Laundry: ", laundryStatus]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: [student.phoneNumber, student.propertyName ? ` · ${student.propertyName}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 flex-wrap gap-1.5",
								children: activeLaundries.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: l.id === currentLaundryId ? "default" : "outline",
									size: "sm",
									className: "h-7 text-xs",
									disabled: singleAssigning === student.id,
									onClick: () => assignSingle(student.id, l.id, l.laundryName, laundryStatus),
									children: [singleAssigning === student.id && l.id !== currentLaundryId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : null, l.laundryName]
								}, l.id))
							})
						]
					}, student.id);
				})
			})
		]
	});
}
//#endregion
export { LaundryAssignPage as component };
