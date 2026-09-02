import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { C as Search, I as LoaderCircle, _ as Square, u as UserCheck, ut as ArrowLeft, v as SquareCheckBig } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Z as useAdmissions, ht as useMesses, i as assignStudentToMess } from "./hooks-Cx9bJ-2X.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-CxwTuntR.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.mess.assign-C7haWJWt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessAssignPage() {
	const qc = useQueryClient();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: messes = [], isLoading: messLoading } = useMesses();
	const [search, setSearch] = (0, import_react.useState)("");
	const [messFilter, setMessFilter] = (0, import_react.useState)("all");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkMessId, setBulkMessId] = (0, import_react.useState)("");
	const [bulkTiffin, setBulkTiffin] = (0, import_react.useState)("active");
	const [assigning, setAssigning] = (0, import_react.useState)(false);
	const [singleAssigning, setSingleAssigning] = (0, import_react.useState)(null);
	const activeMesses = messes.filter((m) => m.status === "active");
	const filtered = (0, import_react.useMemo)(() => admissions.filter((a) => {
		const matchSearch = !search || a.fullName.toLowerCase().includes(search.toLowerCase()) || a.phoneNumber.includes(search) || (a.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
		const currentMessId = a.messId ?? "";
		return matchSearch && (messFilter === "all" ? true : messFilter === "unassigned" ? !currentMessId : currentMessId === messFilter);
	}), [
		admissions,
		search,
		messFilter
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
	async function assignSingle(studentId, messId, messName, tiffinStatus = "active") {
		setSingleAssigning(studentId);
		try {
			await assignStudentToMess(studentId, messId, messName, tiffinStatus);
			await qc.invalidateQueries({ queryKey: ["admissions"] });
			toast.success("Student assigned.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not assign student.");
		} finally {
			setSingleAssigning(null);
		}
	}
	async function assignBulk() {
		if (!bulkMessId) {
			toast.error("Select a mess to assign to.");
			return;
		}
		if (selectedIds.size === 0) {
			toast.error("Select at least one student.");
			return;
		}
		const mess = messes.find((m) => m.id === bulkMessId);
		if (!mess) return;
		setAssigning(true);
		try {
			await Promise.all([...selectedIds].map((id) => assignStudentToMess(id, bulkMessId, mess.messName, bulkTiffin)));
			await qc.invalidateQueries({ queryKey: ["admissions"] });
			toast.success(`${selectedIds.size} student${selectedIds.size > 1 ? "s" : ""} assigned to ${mess.messName}.`);
			setSelectedIds(/* @__PURE__ */ new Set());
			setBulkMessId("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not complete bulk assignment.");
		} finally {
			setAssigning(false);
		}
	}
	const isLoading = admLoading || messLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Assign Students to Mess",
		subtitle: "Link students to a mess and set their tiffin status.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/mess",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Back to Messes"]
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
					value: messFilter,
					onValueChange: setMessFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by mess" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Students"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "unassigned",
							children: "Not Assigned"
						}),
						messes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.id,
							children: m.messName
						}, m.id))
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
						value: bulkMessId,
						onValueChange: setBulkMessId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose mess" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: activeMesses.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.id,
							children: m.messName
						}, m.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: bulkTiffin,
						onValueChange: (v) => setBulkTiffin(v),
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
							"Assign All"
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
					const currentMessId = student.messId ?? "";
					student.messName;
					const tiffin = student.tiffinStatus ?? "active";
					const currentMess = messes.find((m) => m.id === currentMessId);
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
										currentMess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[11px] border-success/30 bg-success/10 text-success",
											children: currentMess.messName
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[11px] text-muted-foreground",
											children: "Not Assigned"
										}),
										currentMessId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: `text-[11px] capitalize ${tiffin === "active" ? "border-success/30 text-success" : tiffin === "paused" ? "border-warning/30 text-warning-foreground" : "border-destructive/20 text-destructive"}`,
											children: ["Tiffin: ", tiffin]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: [student.phoneNumber, student.propertyName ? ` · ${student.propertyName}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 flex-wrap gap-1.5",
								children: activeMesses.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: m.id === currentMessId ? "default" : "outline",
									size: "sm",
									className: "h-7 text-xs",
									disabled: singleAssigning === student.id,
									onClick: () => assignSingle(student.id, m.id, m.messName),
									children: [singleAssigning === student.id && m.id !== currentMessId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : null, m.messName]
								}, m.id))
							})
						]
					}, student.id);
				})
			})
		]
	});
}
//#endregion
export { MessAssignPage as component };
