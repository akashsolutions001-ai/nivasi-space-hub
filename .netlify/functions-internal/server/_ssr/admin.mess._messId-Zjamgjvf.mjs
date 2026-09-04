import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { $ as ChevronUp, C as Search, H as FileText, I as LoaderCircle, N as MapPin, O as Phone, Z as CircleAlert, j as MessageSquare, k as Pencil, nt as ChevronDown, o as UtensilsCrossed, ut as ArrowLeft, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { H as updateMess, I as todayDateString, L as todayISTDateString, Q as useAdmissions, X as upsertDelivery, bt as useProperties, ft as useMessRecordsForDate, gt as useMesses, it as useDeliverySummary, mt as useMessRequestsForMess, nt as useDeliveriesForDate, xt as useRooms } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-DY9scxej.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Route } from "./admin.mess._messId-wq5AiFqz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.mess._messId-Zjamgjvf.js
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
	const mess = messes.find((m) => m.id === messId);
	const students = (0, import_react.useMemo)(() => admissions.filter((a) => a.messId === messId), [admissions, messId]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [tiffinFilter, setTiffinFilter] = (0, import_react.useState)("all");
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
	const [descDialogOpen, setDescDialogOpen] = (0, import_react.useState)(false);
	const filtered = students.filter((s) => {
		const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phoneNumber.includes(search) || (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
		const matchTiffin = tiffinFilter === "all" || s.tiffinStatus === tiffinFilter;
		return matchSearch && matchTiffin;
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
		subtitle: mess ? `Owner: ${mess.ownerName || "—"}  ·  ${students.length} students` : "",
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search student, phone, property…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: tiffinFilter,
					onValueChange: setTiffinFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-40",
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
				})]
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
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold",
												children: student.fullName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: `text-[11px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
												children: ["Tiffin: ", tiffin]
											})]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3",
								children: ["lunch", "dinner"].map((meal) => {
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
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDetailPanel, {
								student,
								record: messRecords.find((r) => r.studentId === student.id),
								requests: messRequests
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
			})
		]
	});
}
//#endregion
export { MessStudentsPage as component };
