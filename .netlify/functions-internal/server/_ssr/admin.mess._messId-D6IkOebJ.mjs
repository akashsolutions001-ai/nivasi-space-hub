import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useIsAdmin } from "./auth-C-wItvgy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Bt as useProperties, Ft as useMesses, G as todayISTDateString, Nt as useMessRequestsForMess, Vt as useRooms, W as todayDateString, bt as useDeliverySummary, et as updateMess, ft as useAdmissions, jt as useMessRecordsForDate, pt as useAllLeaveRequests, q as unassignStudentFromMess, ut as upsertDelivery, vt as useDeliveriesForDate } from "./hooks-D7EEodvy.mjs";
import { Dt as ArrowLeft, E as Search, Et as ArrowRight, F as Pencil, L as MessageSquare, N as Phone, O as RotateCcw, U as LoaderCircle, X as FileText, dt as ChevronUp, lt as CircleAlert, mt as ChevronDown, nt as Copy, o as UtensilsCrossed, tt as Download, u as UserMinus, z as MapPin } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-Ckhlq4Fy.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CMFXK8lR.mjs";
import { t as Route } from "./admin.mess._messId-i24xTLEB.mjs";
import { t as MessExportDialog } from "./mess-export-dialog-HfISSI_h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.mess._messId-D6IkOebJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABELS = {
	pending: "Pending",
	delivered: "Delivered",
	not_available: "Not Available",
	skipped: "Skipped"
};
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	delivered: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
function getMapUrl(admission, rooms, properties) {
	const a = admission;
	if (a.propertyId) {
		const room = rooms.find((r) => r.title && r.id === a.propertyId);
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (admission.propertyName) {
		const room = rooms.find((r) => r.title?.toLowerCase() === admission.propertyName.toLowerCase());
		if (room?.mapLink) return room.mapLink;
		if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
		if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
	}
	if (a.propertyId) {
		const prop = properties.find((p) => p.propertyId === a.propertyId);
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (admission.propertyName) {
		const prop = properties.find((p) => p.propertyName?.toLowerCase() === admission.propertyName.toLowerCase());
		if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
	}
	if (admission.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(admission.propertyName)}`;
	return null;
}
var TIFFIN_STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	received: "bg-success/15 text-success border-success/30",
	do_not_want: "bg-muted text-muted-foreground border-border",
	other: "bg-primary/10 text-primary border-primary/20"
};
var TIFFIN_STATUS_LABELS = {
	pending: "Pending",
	received: "Received",
	do_not_want: "Do Not Want",
	other: "Other"
};
var RETURN_STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	returned: "bg-success/15 text-success border-success/30",
	not_required: "bg-muted text-muted-foreground border-border"
};
var RETURN_STATUS_LABELS = {
	pending: "Return Pending",
	returned: "Returned ✓",
	not_required: "Not Required"
};
var REQUEST_TYPE_LABELS = {
	less_quantity: "Less Quantity",
	more_quantity: "More Quantity",
	other: "Other"
};
function TiffinBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[10px] ${TIFFIN_STATUS_COLORS[status] ?? ""}`,
		children: TIFFIN_STATUS_LABELS[status] ?? status
	});
}
function ReturnBadge({ status }) {
	const s = status ?? "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[10px] ${RETURN_STATUS_COLORS[s] ?? ""}`,
		children: RETURN_STATUS_LABELS[s] ?? s
	});
}
function StudentDetailPanel({ student, record, requests }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const activeRequest = requests.find((r) => r.studentId === student.id && r.status === "active");
	const hasActivity = record?.lunchStatus === "other" || record?.dinnerStatus === "other" || activeRequest || record?.lunchStatus === "received" || record?.dinnerStatus === "received";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border mt-2 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center justify-between text-xs text-muted-foreground py-1",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3 shrink-0" }), activeRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType
					}),
					activeRequest.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground truncate max-w-[180px]",
						children: [
							"\"",
							activeRequest.description,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex size-1.5 rounded-full bg-primary shrink-0" })
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Requests" }), hasActivity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex size-1.5 rounded-full bg-primary shrink-0" })] })]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3 shrink-0" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/30 px-3 py-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide",
						children: "Lunch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinBadge, { status: record?.lunchStatus ?? "pending" }),
							record?.lunchStatus === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnBadge, { status: record.lunchReturnStatus }),
								record.lunchReturnedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["→ ", record.lunchReturnedTo]
								})
							] }),
							record?.lunchStatus === "other" && record.lunchOtherReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground italic",
								children: [
									"\"",
									record.lunchOtherReason,
									"\""
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/30 px-3 py-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide",
						children: "Dinner"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinBadge, { status: record?.dinnerStatus ?? "pending" }),
							record?.dinnerStatus === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnBadge, { status: record.dinnerReturnStatus }),
								record.dinnerReturnedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["→ ", record.dinnerReturnedTo]
								})
							] }),
							record?.dinnerStatus === "other" && record.dinnerOtherReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground italic",
								children: [
									"\"",
									record.dinnerOtherReason,
									"\""
								]
							})
						]
					})]
				}),
				activeRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-semibold text-primary flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " Special Request"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px]",
							children: REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType
						}),
						activeRequest.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-foreground",
							children: [
								"\"",
								activeRequest.description,
								"\""
							]
						})
					]
				}),
				!hasActivity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground px-1",
					children: "No tiffin activity recorded today."
				})
			]
		})]
	});
}
function DescriptionDialog({ open, onClose, messId, currentDescription }) {
	const [value, setValue] = (0, import_react.useState)(currentDescription);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await updateMess(messId, { messDescription: value.trim() });
			await qc.invalidateQueries({ queryKey: ["messes"] });
			toast.success("Mess description updated.");
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update description.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Mess Description" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mess-desc",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "mess-desc",
							value,
							onChange: (e) => setValue(e.target.value),
							rows: 5,
							placeholder: "e.g. Lunch and dinner provided daily. Lunch: 1 PM – 2 PM. Dinner: 8 PM – 9 PM."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "This description is visible to all assigned students and mess employees."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					disabled: saving,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: saving,
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Save Description"]
				})] })]
			})]
		})
	});
}
function MessStudentsPage() {
	const { messId } = Route.useParams();
	const qc = useQueryClient();
	const today = todayDateString();
	const todayIST = todayISTDateString();
	const { data: messes = [], isLoading: messLoading } = useMesses();
	const { data: admissions = [], isLoading: admLoading } = useAdmissions();
	const { data: deliveries = [] } = useDeliveriesForDate(messId, today);
	const { data: summary } = useDeliverySummary(messId, today);
	const { data: rooms = [] } = useRooms();
	const { data: properties = [] } = useProperties();
	const { data: messRecords = [] } = useMessRecordsForDate(messId, todayIST);
	const { data: messRequests = [] } = useMessRequestsForMess(messId);
	const { data: allLeaves = [] } = useAllLeaveRequests();
	const mess = messes.find((m) => m.id === messId);
	const students = (0, import_react.useMemo)(() => admissions.filter((a) => a.messId === messId), [admissions, messId]);
	const studentLeaveMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const l of allLeaves) if (l.status === "approved") {
			const from = l.fromDate;
			const to = l.toDate;
			if (from <= todayIST && (!to || todayIST <= to)) {
				if (l.admissionId) map.set(l.admissionId, l);
				if (l.studentId) map.set(l.studentId, l);
			}
		}
		return map;
	}, [allLeaves, todayIST]);
	const kitchenCounts = (0, import_react.useMemo)(() => {
		let present = 0;
		let onLeave = 0;
		let veg = 0;
		let nonVeg = 0;
		for (const s of students) {
			if (s.tiffinStatus === "cancelled") continue;
			if (studentLeaveMap.get(s.admissionId) || studentLeaveMap.get(s.id)) onLeave++;
			else {
				present++;
				if ((s.mealPreference || "veg").toLowerCase().includes("non")) nonVeg++;
				else veg++;
			}
		}
		return {
			present,
			onLeave,
			veg,
			nonVeg,
			totalActive: present + onLeave
		};
	}, [students, studentLeaveMap]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [tiffinFilter, setTiffinFilter] = (0, import_react.useState)("all");
	const [attendanceFilter, setAttendanceFilter] = (0, import_react.useState)("all");
	const [mealFilter, setMealFilter] = (0, import_react.useState)("all");
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
	const [descDialogOpen, setDescDialogOpen] = (0, import_react.useState)(false);
	const [exportOpen, setExportOpen] = (0, import_react.useState)(false);
	const [unassigningId, setUnassigningId] = (0, import_react.useState)(null);
	const isAdmin = useIsAdmin();
	const handleCopyKitchenSummary = () => {
		const text = `📋 *${(mess?.messName || "MESS").toUpperCase()} KITCHEN COUNT*\n📅 *Date:* ${todayIST}\n-----------------------------------\n🟢 *Veg Meals to Cook:* ${kitchenCounts.veg}\n🍗 *Non-Veg Meals to Cook:* ${kitchenCounts.nonVeg}\n👥 *Total Students Present:* ${kitchenCounts.present}\n✈️ *Students on Leave (Skip):* ${kitchenCounts.onLeave}\n📊 *Total Active Subscriptions:* ${kitchenCounts.totalActive}`;
		navigator.clipboard.writeText(text);
		toast.success("Kitchen meal count copied! Ready to paste into WhatsApp.");
	};
	async function handleUnassign(student) {
		if (!window.confirm(`Are you sure you want to unassign ${student.fullName} from ${mess?.messName ?? "this mess"}?`)) return;
		setUnassigningId(student.id);
		try {
			await unassignStudentFromMess(student.id);
			await qc.invalidateQueries({ queryKey: ["admissions"] });
			toast.success(`${student.fullName} unassigned from mess.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not unassign student.");
		} finally {
			setUnassigningId(null);
		}
	}
	const filtered = students.filter((s) => {
		const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phoneNumber.includes(search) || (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
		const matchTiffin = tiffinFilter === "all" || s.tiffinStatus === tiffinFilter;
		const isPresent = !(studentLeaveMap.get(s.admissionId) || studentLeaveMap.get(s.id));
		const matchAttendance = attendanceFilter === "all" || attendanceFilter === "present" && isPresent || attendanceFilter === "on_leave" && !isPresent;
		const isNonVeg = (s.mealPreference || "veg").toLowerCase().includes("non");
		return matchSearch && matchTiffin && matchAttendance && (mealFilter === "all" || mealFilter === "veg" && !isNonVeg || mealFilter === "non_veg" && isNonVeg);
	});
	function getDelivery(studentId, meal) {
		return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
	}
	async function setDeliveryStatus(student, meal, status) {
		const key = `${student.id}-${meal}`;
		setUpdatingKey(key);
		try {
			await upsertDelivery({
				studentId: student.id,
				admissionId: student.admissionId,
				messId,
				employeeId: "admin",
				date: today,
				meal,
				status
			});
			await qc.invalidateQueries({ queryKey: [
				"deliveries",
				messId,
				today
			] });
			await qc.invalidateQueries({ queryKey: [
				"deliverySummary",
				messId,
				today
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update delivery.");
		} finally {
			setUpdatingKey(null);
		}
	}
	const isLoading = messLoading || admLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: mess?.messName ?? "Mess Students",
		subtitle: mess ? `Owner: ${mess.ownerName || "—"}  ·  ${students.length} students enrolled` : "",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setExportOpen(true),
					className: "gap-1.5 text-xs h-8 border-orange-500/30 bg-orange-50/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:text-orange-700 dark:hover:text-orange-300 font-medium shadow-soft",
					title: "Export Student Register to Excel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export Register"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleCopyKitchenSummary,
					className: "gap-1.5 text-xs h-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copy Kitchen Count"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "h-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/student-headcount",
						children: ["Full Headcount ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 size-3.5" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "h-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/mess",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-3.5" }), " Back"]
					})
				})
			]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-sm",
							children: "Today's Kitchen Preparation Headcount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Excludes students currently away on approved leave"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7 text-xs gap-1.5 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40",
							onClick: () => setExportOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Export Excel Register"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							className: "h-7 text-xs gap-1.5",
							onClick: handleCopyKitchenSummary,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), " WhatsApp Kitchen Summary"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-emerald-800 dark:text-emerald-300",
									children: "🟢 Pure Veg Meals"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-emerald-700 dark:text-emerald-400",
									children: kitchenCounts.veg
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Cook for present students"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-amber-800 dark:text-amber-300",
									children: "🍗 Non-Veg Meals"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-amber-700 dark:text-amber-400",
									children: kitchenCounts.nonVeg
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Cook for present students"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "👥 Present (Eating)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground",
									children: kitchenCounts.present
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Total to serve today"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-sky-800 dark:text-sky-300",
									children: "✈️ On Leave (Skip)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-sky-700 dark:text-sky-400",
									children: kitchenCounts.onLeave
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Approved leave away"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), " Mess Description"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 gap-1 text-xs",
						onClick: () => setDescDialogOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }), " Edit"]
					})]
				}), mess?.messDescription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
					children: mess.messDescription
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground italic",
					children: "No description set. Click Edit to add one."
				})]
			}),
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					"delivered",
					"pending",
					"skipped",
					"not_available"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-3 shadow-soft text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground capitalize",
							children: STATUS_LABELS[s]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold",
							children: (summary.lunch[s] ?? 0) + (summary.dinner[s] ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground",
							children: [
								"L:",
								summary.lunch[s] ?? 0,
								" / D:",
								summary.dinner[s] ?? 0
							]
						})
					]
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-48",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Search student, phone, property…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: attendanceFilter,
						onValueChange: setAttendanceFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Attendance" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Attendance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "present",
								children: "Present (Eating)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "on_leave",
								children: "On Leave (Skip)"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: mealFilter,
						onValueChange: setMealFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Meal Type" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Meals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "veg",
								children: "Pure Veg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "non_veg",
								children: "Non-Veg"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: tiffinFilter,
						onValueChange: setTiffinFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Tiffin status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Tiffin"
							}),
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
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-2xl" }, i)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: search || tiffinFilter !== "all" ? "No students match your filters." : "No students assigned to this mess yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/mess/assign",
								children: "Assign Students"
							})
						})
					]
				}) : filtered.map((student) => {
					const mapUrl = getMapUrl(student, rooms, properties);
					const lunch = getDelivery(student.id, "lunch");
					const dinner = getDelivery(student.id, "dinner");
					const tiffin = student.tiffinStatus ?? "active";
					const leave = studentLeaveMap.get(student.admissionId) || studentLeaveMap.get(student.id);
					const isNonVeg = (student.mealPreference || "veg").toLowerCase().includes("non");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-2xl border bg-card p-4 shadow-soft transition-colors ${leave ? "border-sky-500/30 bg-sky-500/[0.02]" : "border-border"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-semibold",
													children: student.fullName
												}),
												isNonVeg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[11px] border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
													children: "🍗 Non-Veg"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[11px] border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
													children: "🥬 Pure Veg"
												}),
												leave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "text-[11px] border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium",
													children: [
														"✈️ On Leave (",
														leave.fromDate,
														leave.toDate ? ` → ${leave.toDate}` : " · Open",
														")"
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: `text-[11px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
													children: ["Tiffin: ", tiffin]
												})
											]
										}),
										leave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-sky-700 dark:text-sky-400 font-medium",
											children: ["Student is on approved leave. Do not prepare meal.", leave.reason ? ` Reason: "${leave.reason}"` : ""]
										}),
										student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${student.phoneNumber}`,
											className: "mt-0.5 flex items-center gap-1.5 text-sm text-primary hover:underline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), student.phoneNumber]
										}),
										student.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-sm text-muted-foreground",
											children: [student.propertyName, student.roomNumber ? ` · Room ${student.roomNumber}` : ""]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-1.5",
									children: [student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${student.phoneNumber}`,
											"aria-label": `Call ${student.fullName}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-3.5" }), " Call"]
										})
									}), mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: mapUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5" }), " Map"]
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
								children: [leave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 rounded-lg bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-[11px] text-sky-700 dark:text-sky-300 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "✈️ Meals paused · Student is on approved leave"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] opacity-80",
										children: [
											leave.fromDate,
											" to ",
											leave.toDate || "Open"
										]
									})]
								}), ["lunch", "dinner"].map((meal) => {
									const currentStatus = (meal === "lunch" ? lunch : dinner)?.status ?? "pending";
									const key = `${student.id}-${meal}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium capitalize text-muted-foreground",
											children: meal
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: currentStatus,
											onValueChange: (v) => setDeliveryStatus(student, meal, v),
											disabled: updatingKey === key || tiffin === "cancelled",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: `h-8 text-xs ${STATUS_COLORS[currentStatus]}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "pending",
													children: "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "delivered",
													children: "Delivered"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "not_available",
													children: "Not Available"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "skipped",
													children: "Skipped"
												})
											] })]
										})]
									}, meal);
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDetailPanel, {
								student,
								record: messRecords.find((r) => r.studentId === student.id),
								requests: messRequests
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 pt-2.5 border-t border-dashed border-border/80 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Mess Assignment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: unassigningId === student.id,
									onClick: () => handleUnassign(student),
									className: "h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5",
									children: [unassigningId === student.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "size-3" }), "Unassign Mess"]
								})]
							})
						]
					}, student.id);
				})
			}),
			mess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescriptionDialog, {
				open: descDialogOpen,
				onClose: () => setDescDialogOpen(false),
				messId,
				currentDescription: mess?.messDescription ?? ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessExportDialog, {
				open: exportOpen,
				onClose: () => setExportOpen(false),
				mess: mess ?? null,
				admissions
			})
		]
	});
}
//#endregion
export { MessStudentsPage as component };
