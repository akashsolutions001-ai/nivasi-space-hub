import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-DGbYVzMP.mjs";
import { $ as ChevronUp, B as History, I as LoaderCircle, J as CircleX, Y as CircleCheck, Z as CircleAlert, at as CalendarDays, k as Pencil, nt as ChevronDown, o as UtensilsCrossed, p as Trash2, q as Clock, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { E as getOrCreateMessRecord, G as updateMessRequest, L as todayISTDateString, W as updateMessRecordField, c as createDoNotWantRecord, gt as useMesses, h as currentISTTime, ht as useMessRequestsForStudent, p as createMessRequest, pt as useMessRecordsForStudent, y as deleteMessRequest } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Checkbox } from "./checkbox-BvhzXIX4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as StudentShell } from "./student-shell-Cdo8m_19.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.mess-lGsXeYAM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getLunchWindow(h, m) {
	const mins = h * 60 + m;
	if (mins < 780) return "before";
	if (mins < 840) return "during";
	return "after";
}
function getDinnerWindow(h, m) {
	const mins = h * 60 + m;
	if (mins < 1200) return "before";
	if (mins < 1260) return "during";
	return "after";
}
function formatISTDate(dateStr) {
	try {
		const parts = dateStr.split("-").map(Number);
		const y = parts[0] ?? (/* @__PURE__ */ new Date()).getFullYear();
		const mo = parts[1] ?? 1;
		const d = parts[2] ?? 1;
		return new Date(y, mo - 1, d).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	} catch {
		return dateStr;
	}
}
function formatISTTimestamp(date) {
	if (!date) return "—";
	return date.toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}
var REQUEST_LABELS = {
	less_quantity: "Less Quantity",
	more_quantity: "More Quantity",
	other: "Other"
};
function TiffinStatusBadge({ status }) {
	const map = {
		pending: {
			cls: "bg-warning/15 text-warning-foreground border-warning/30",
			label: "Pending"
		},
		received: {
			cls: "bg-success/15 text-success border-success/30",
			label: "Received"
		},
		do_not_want: {
			cls: "bg-muted text-muted-foreground border-border",
			label: "Do Not Want"
		},
		other: {
			cls: "bg-primary/10 text-primary border-primary/20",
			label: "Other"
		}
	};
	const { cls, label } = map[status] ?? map.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[11px] ${cls}`,
		children: label
	});
}
function ReturnStatusBadge({ status }) {
	if (!status || status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-warning/15 text-warning-foreground border-warning/30",
		children: "Return Pending"
	});
	if (status === "returned") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-success/15 text-success border-success/30",
		children: "Returned ✓"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-muted text-muted-foreground border-border",
		children: "Not Required"
	});
}
function DoNotWantDialog({ open, onClose, admission, messId, messName, initialMeal }) {
	const today = todayISTDateString();
	const [fromDate, setFromDate] = (0, import_react.useState)(today);
	const [toDate, setToDate] = (0, import_react.useState)(today);
	const [lunchChecked, setLunchChecked] = (0, import_react.useState)(initialMeal === "lunch" || initialMeal === "both");
	const [dinnerChecked, setDinnerChecked] = (0, import_react.useState)(initialMeal === "dinner" || initialMeal === "both");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (open) {
			setFromDate(today);
			setToDate(today);
			setLunchChecked(initialMeal === "lunch" || initialMeal === "both");
			setDinnerChecked(initialMeal === "dinner" || initialMeal === "both");
		}
	}, [
		open,
		today,
		initialMeal
	]);
	async function handleSubmit(e) {
		e.preventDefault();
		const meals = [];
		if (lunchChecked) meals.push("lunch");
		if (dinnerChecked) meals.push("dinner");
		if (meals.length === 0) {
			toast.error("Select at least one meal.");
			return;
		}
		if (toDate < fromDate) {
			toast.error("End date cannot be before start date.");
			return;
		}
		if (fromDate < today) {
			toast.error("Cannot select past dates.");
			return;
		}
		setSaving(true);
		try {
			await createDoNotWantRecord({
				studentId: admission.id,
				studentName: admission.fullName,
				studentEmail: admission.email ?? "",
				admissionId: admission.admissionId,
				messId,
				messName,
				fromDate,
				toDate,
				meals
			});
			const d = /* @__PURE__ */ new Date(fromDate + "T00:00:00");
			const end = /* @__PURE__ */ new Date(toDate + "T00:00:00");
			while (d <= end) {
				const dateStr = d.toLocaleDateString("en-CA");
				const patch = {};
				if (lunchChecked) {
					patch["lunchStatus"] = "do_not_want";
					patch["lunchReturnStatus"] = "not_required";
				}
				if (dinnerChecked) {
					patch["dinnerStatus"] = "do_not_want";
					patch["dinnerReturnStatus"] = "not_required";
				}
				if (Object.keys(patch).length > 0) await updateMessRecordField(admission.id, dateStr, patch);
				d.setDate(d.getDate() + 1);
			}
			toast.success("Do Not Want saved.");
			await qc.invalidateQueries({ queryKey: ["messRecord", admission.id] });
			await qc.invalidateQueries({ queryKey: [
				"messRecords",
				"student",
				admission.id
			] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
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
			className: "max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Do Not Want Tiffin" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "dnw-from",
								children: "From Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "dnw-from",
								type: "date",
								min: today,
								value: fromDate,
								onChange: (e) => setFromDate(e.target.value),
								className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "dnw-to",
								children: "To Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "dnw-to",
								type: "date",
								min: fromDate,
								value: toDate,
								onChange: (e) => setToDate(e.target.value),
								className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Meal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: lunchChecked,
									onCheckedChange: (v) => setLunchChecked(!!v)
								}), "Lunch"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: dinnerChecked,
									onCheckedChange: (v) => setDinnerChecked(!!v)
								}), "Dinner"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						disabled: saving,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Confirm"]
					})] })
				]
			})]
		})
	});
}
function OtherReasonDialog({ open, onClose, meal, admission, messId, messName, date, existingReason }) {
	const [reason, setReason] = (0, import_react.useState)(existingReason ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (open) setReason(existingReason ?? "");
	}, [open, existingReason]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Please enter a reason.");
			return;
		}
		setSaving(true);
		try {
			const patch = meal === "lunch" ? {
				lunchStatus: "other",
				lunchOtherReason: reason.trim(),
				lunchReturnStatus: "not_required"
			} : {
				dinnerStatus: "other",
				dinnerOtherReason: reason.trim(),
				dinnerReturnStatus: "not_required"
			};
			await getOrCreateMessRecord({
				studentId: admission.id,
				studentName: admission.fullName,
				studentEmail: admission.email ?? "",
				admissionId: admission.admissionId,
				messId,
				messName,
				date,
				lunchStatus: "pending",
				dinnerStatus: "pending",
				lunchReturnStatus: "pending",
				dinnerReturnStatus: "pending"
			});
			await updateMessRecordField(admission.id, date, patch);
			toast.success("Reason saved.");
			await qc.invalidateQueries({ queryKey: [
				"messRecord",
				admission.id,
				date
			] });
			await qc.invalidateQueries({ queryKey: [
				"messRecords",
				"student",
				admission.id
			] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
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
			className: "max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Other Reason — ", meal === "lunch" ? "Lunch" : "Dinner"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "other-reason",
						children: "Description *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "other-reason",
						placeholder: "e.g. I am outside today and will collect food later.",
						value: reason,
						onChange: (e) => setReason(e.target.value),
						rows: 3
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					disabled: saving,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: saving || !reason.trim(),
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Submit"]
				})] })]
			})]
		})
	});
}
function MessRequestDialog({ open, onClose, admission, messId, messName, existing }) {
	const [reqType, setReqType] = (0, import_react.useState)(existing?.requestType ?? "less_quantity");
	const [description, setDescription] = (0, import_react.useState)(existing?.description ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (open) {
			setReqType(existing?.requestType ?? "less_quantity");
			setDescription(existing?.description ?? "");
		}
	}, [open, existing]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (reqType === "other" && !description.trim()) {
			toast.error("Description is required for Other request type.");
			return;
		}
		setSaving(true);
		try {
			if (existing) {
				await updateMessRequest(existing.id, {
					requestType: reqType,
					description: description.trim()
				});
				toast.success("Request updated.");
			} else {
				await createMessRequest({
					studentId: admission.id,
					studentName: admission.fullName,
					studentEmail: admission.email ?? "",
					admissionId: admission.admissionId,
					messId,
					messName,
					requestType: reqType,
					description: description.trim(),
					status: "active"
				});
				toast.success("Request submitted.");
			}
			await qc.invalidateQueries({ queryKey: [
				"messRequests",
				"student",
				admission.id
			] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save request.");
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
			className: "max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: existing ? "Edit Mess Request" : "Special Mess Request" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "What do you require?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								{
									value: "less_quantity",
									label: "Less Quantity"
								},
								{
									value: "more_quantity",
									label: "More Quantity"
								},
								{
									value: "other",
									label: "Other"
								}
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReqType(t.value),
								className: `rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${reqType === t.value ? "gradient-brand text-primary-foreground border-transparent shadow-soft" : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"}`,
								children: t.label
							}, t.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "req-desc",
							children: ["Description ", reqType === "other" ? "*" : "(optional)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "req-desc",
							placeholder: reqType === "less_quantity" ? "e.g. Please provide a smaller portion." : reqType === "more_quantity" ? "e.g. Please provide slightly more food." : "e.g. Please provide less spicy food.",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						disabled: saving,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving || reqType === "other" && !description.trim(),
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), existing ? "Save Changes" : "Submit Request"]
					})] })
				]
			})]
		})
	});
}
function MealCard({ meal, window: win, status, returnStatus, returnedTo, returnedAt, receivedAt, otherReason, onReceived, onDoNotWant, onOther, onMarkReturned, saving }) {
	const isLunch = meal === "lunch";
	const timeLabel = isLunch ? "1:00 PM – 2:00 PM" : "8:00 PM – 9:00 PM";
	const returnTo = isLunch ? "Security Cabin" : "Tiffin Collector";
	const mealLabel = isLunch ? "🍱 LUNCH" : "🍽 DINNER";
	const canAct = win === "during";
	const isClosed = win === "after";
	const showReturnBlock = status === "received";
	const returnDone = returnStatus === "returned";
	const returnNotRequired = returnStatus === "not_required";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-bold text-base",
					children: mealLabel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
						" ",
						timeLabel
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinStatusBadge, { status })]
			}),
			isClosed && status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground text-center",
				children: "This meal window is now closed for today."
			}),
			canAct && status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onReceived,
						disabled: saving,
						className: "border-success/40 text-success hover:bg-success/10 text-xs",
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 mr-1" }), "Received"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onDoNotWant,
						disabled: saving,
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5 mr-1" }), "Don't Want"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onOther,
						disabled: saving,
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5 mr-1" }), "Other"]
					})
				]
			}),
			win === "before" && status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground text-center",
				children: "Buttons will activate during the meal window."
			}),
			status === "do_not_want" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
				children: "You have marked this meal as Do Not Want. No return required."
			}),
			status === "other" && otherReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-primary",
					children: "Other reason provided:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground",
					children: otherReason
				})]
			}),
			status === "received" && receivedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: ["Received at ", formatISTTimestamp(receivedAt)]
			}),
			showReturnBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium",
						children: ["Return To: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: returnTo
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnStatusBadge, { status: returnStatus })] }), !returnDone && !returnNotRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onMarkReturned,
						disabled: saving,
						className: "shrink-0 border-success/40 text-success hover:bg-success/10 text-xs",
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5 mr-1" }), "Mark Returned"]
					})]
				}), returnDone && returnedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Returned to ",
						returnedTo,
						" at ",
						formatISTTimestamp(returnedAt)
					]
				})]
			})
		]
	});
}
function StudentMessPage() {
	const { session, admission: myAdmission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: messes = [] } = useMesses();
	const messId = myAdmission?.messId ?? "";
	const mess = messes.find((m) => m.id === messId);
	const today = todayISTDateString();
	const { h, m } = currentISTTime();
	const lunchWin = getLunchWindow(h, m);
	const dinnerWin = getDinnerWindow(h, m);
	const [record, setRecord] = (0, import_react.useState)(null);
	const [recordLoading, setRecordLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const [, forceRender] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => forceRender((n) => n + 1), 6e4);
		return () => clearInterval(t);
	}, []);
	const { data: history = [], isLoading: histLoading } = useMessRecordsForStudent(myAdmission?.id ?? null);
	const { data: requests = [] } = useMessRequestsForStudent(myAdmission?.id ?? null);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [requestsOpen, setRequestsOpen] = (0, import_react.useState)(false);
	const [deletingRequestId, setDeletingRequestId] = (0, import_react.useState)(null);
	const [dnwOpen, setDnwOpen] = (0, import_react.useState)(null);
	const [otherOpen, setOtherOpen] = (0, import_react.useState)(null);
	const [requestDialogOpen, setRequestDialogOpen] = (0, import_react.useState)(false);
	const [editingRequest, setEditingRequest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && !session) navigate({
			to: "/student/login",
			replace: true
		});
	}, [
		loading,
		session,
		navigate
	]);
	const loadRecord = (0, import_react.useCallback)(async () => {
		if (!myAdmission || !messId) return;
		setRecordLoading(true);
		try {
			const r = await getOrCreateMessRecord({
				studentId: myAdmission.id,
				studentName: myAdmission.fullName,
				studentEmail: myAdmission.email ?? "",
				admissionId: myAdmission.admissionId,
				messId,
				messName: mess?.messName ?? "",
				date: today,
				lunchStatus: "pending",
				dinnerStatus: "pending",
				lunchReturnStatus: "pending",
				dinnerReturnStatus: "pending"
			});
			setRecord(r);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unable to load today's tiffin.");
		} finally {
			setRecordLoading(false);
		}
	}, [
		myAdmission,
		messId,
		mess,
		today
	]);
	(0, import_react.useEffect)(() => {
		loadRecord();
	}, [loadRecord]);
	async function handleReceived(meal) {
		if (!myAdmission || !messId || !record) return;
		if ((meal === "lunch" ? lunchWin : dinnerWin) !== "during") {
			toast.error("This meal window is not active right now.");
			return;
		}
		if ((meal === "lunch" ? record.lunchStatus : record.dinnerStatus) === "received") {
			toast.info("Already marked as received.");
			return;
		}
		setSaving(`${meal}-received`);
		try {
			const patch = meal === "lunch" ? {
				lunchStatus: "received",
				lunchReceivedAt: /* @__PURE__ */ new Date(),
				lunchReturnStatus: "pending"
			} : {
				dinnerStatus: "received",
				dinnerReceivedAt: /* @__PURE__ */ new Date(),
				dinnerReturnStatus: "pending"
			};
			await updateMessRecordField(myAdmission.id, today, patch);
			setRecord((r) => r ? {
				...r,
				...patch
			} : r);
			toast.success(`${meal === "lunch" ? "Lunch" : "Dinner"} marked as received.`);
			await qc.invalidateQueries({ queryKey: [
				"messRecords",
				"student",
				myAdmission.id
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(null);
		}
	}
	async function handleMarkReturned(meal) {
		if (!myAdmission || !record) return;
		if ((meal === "lunch" ? record.lunchStatus : record.dinnerStatus) !== "received") {
			toast.error("You can only return a tiffin that was first marked as Received.");
			return;
		}
		const returnTo = meal === "lunch" ? "Security Cabin" : "Tiffin Collector";
		if ((meal === "lunch" ? record.lunchReturnStatus : record.dinnerReturnStatus) === "returned") {
			toast.info("Already marked as returned.");
			return;
		}
		setSaving(`${meal}-return`);
		try {
			const patch = meal === "lunch" ? {
				lunchReturnStatus: "returned",
				lunchReturnedTo: returnTo,
				lunchReturnedAt: /* @__PURE__ */ new Date()
			} : {
				dinnerReturnStatus: "returned",
				dinnerReturnedTo: returnTo,
				dinnerReturnedAt: /* @__PURE__ */ new Date()
			};
			await updateMessRecordField(myAdmission.id, today, patch);
			setRecord((r) => r ? {
				...r,
				...patch
			} : r);
			toast.success(`Tiffin returned to ${returnTo}.`);
			await qc.invalidateQueries({ queryKey: [
				"messRecords",
				"student",
				myAdmission.id
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(null);
		}
	}
	async function handleDeleteRequest(id) {
		setDeletingRequestId(id);
		try {
			await deleteMessRequest(id);
			await qc.invalidateQueries({ queryKey: [
				"messRequests",
				"student",
				myAdmission?.id
			] });
			toast.success("Request deleted.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not delete request.");
		} finally {
			setDeletingRequestId(null);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const activeRequest = requests.find((r) => r.status === "active");
	requests.filter((r) => r.status !== "active" || r.id !== activeRequest?.id);
	const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		timeZone: "Asia/Kolkata",
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentShell, {
		title: "My Mess",
		backTo: "/student/dashboard",
		children: [
			!myAdmission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "No admission found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Contact your administrator."
					})
				]
			}),
			myAdmission && !messId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Mess Not Assigned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Please contact administration."
					})
				]
			}),
			myAdmission && messId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Assigned Mess"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: mess?.serialNumber != null ? `Mess #${mess.serialNumber}` : "Loading…"
						}),
						mess?.messDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
							children: mess.messDescription
						}),
						!mess?.messDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "No description provided."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: ["Today's Tiffin — ", dateLabel]
				}), recordLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-2xl" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealCard, {
						meal: "lunch",
						window: lunchWin,
						status: record?.lunchStatus ?? "pending",
						returnStatus: record?.lunchReturnStatus,
						returnedTo: record?.lunchReturnedTo,
						returnedAt: record?.lunchReturnedAt,
						receivedAt: record?.lunchReceivedAt,
						otherReason: record?.lunchOtherReason,
						onReceived: () => handleReceived("lunch"),
						onDoNotWant: () => setDnwOpen({ meal: "lunch" }),
						onOther: () => setOtherOpen({ meal: "lunch" }),
						onMarkReturned: () => handleMarkReturned("lunch"),
						saving: saving === "lunch-received" || saving === "lunch-return"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealCard, {
						meal: "dinner",
						window: dinnerWin,
						status: record?.dinnerStatus ?? "pending",
						returnStatus: record?.dinnerReturnStatus,
						returnedTo: record?.dinnerReturnedTo,
						returnedAt: record?.dinnerReturnedAt,
						receivedAt: record?.dinnerReceivedAt,
						otherReason: record?.dinnerOtherReason,
						onReceived: () => handleReceived("dinner"),
						onDoNotWant: () => setDnwOpen({ meal: "dinner" }),
						onOther: () => setOtherOpen({ meal: "dinner" }),
						onMarkReturned: () => handleMarkReturned("dinner"),
						saving: saving === "dinner-received" || saving === "dinner-return"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Special Mess Request"
							}), activeRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 gap-1 text-xs",
								onClick: () => {
									setEditingRequest(activeRequest);
									setRequestDialogOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }), " Edit"]
							})]
						}),
						activeRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/40 px-3 py-2.5 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[11px]",
									children: REQUEST_LABELS[activeRequest.requestType]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[11px] bg-success/10 text-success border-success/30",
									children: "Active"
								})]
							}), activeRequest.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: activeRequest.description
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No active request."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "w-full",
							onClick: () => {
								setEditingRequest(null);
								setRequestDialogOpen(true);
							},
							children: activeRequest ? "New Request" : "Submit a Request"
						}),
						requests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex w-full items-center justify-between text-xs text-muted-foreground pb-1",
								onClick: () => setRequestsOpen((v) => !v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3" }), "History"]
								}), requestsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" })]
							}), requestsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border rounded-xl border border-border overflow-hidden",
								children: requests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-3 py-2 space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: req.createdAt ? formatISTTimestamp(req.createdAt) : "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px]",
												children: REQUEST_LABELS[req.requestType]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteRequest(req.id),
											disabled: deletingRequestId === req.id,
											className: "shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40",
											"aria-label": "Delete request",
											children: deletingRequestId === req.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										})]
									}), req.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [
											"\"",
											req.description,
											"\""
										]
									})]
								}, req.id))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex w-full items-center justify-between px-5 py-3.5",
						onClick: () => setHistoryOpen((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: "Tiffin History"
							})]
						}), historyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })]
					}), historyOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border divide-y divide-border",
						children: [
							histLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" })
							}),
							!histLoading && history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-5 py-4 text-sm text-muted-foreground",
								children: "No history yet."
							}),
							!histLoading && history.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: formatISTDate(rec.date)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: ["lunch", "dinner"].map((m) => {
										const st = m === "lunch" ? rec.lunchStatus : rec.dinnerStatus;
										const ret = m === "lunch" ? rec.lunchReturnStatus : rec.dinnerReturnStatus;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-muted/30 px-2.5 py-2 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-medium capitalize text-muted-foreground",
													children: m
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiffinStatusBadge, { status: st }),
												st === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnStatusBadge, { status: ret }),
												st === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground truncate",
													children: m === "lunch" ? rec.lunchOtherReason : rec.dinnerOtherReason
												})
											]
										}, m);
									})
								})]
							}, rec.id))
						]
					})]
				})
			] }),
			dnwOpen && myAdmission && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoNotWantDialog, {
				open: true,
				onClose: () => setDnwOpen(null),
				admission: myAdmission,
				messId,
				messName: mess?.messName ?? "",
				initialMeal: dnwOpen.meal
			}),
			otherOpen && myAdmission && record && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtherReasonDialog, {
				open: true,
				onClose: async () => {
					setOtherOpen(null);
					await loadRecord();
				},
				meal: otherOpen.meal,
				admission: myAdmission,
				messId,
				messName: mess?.messName ?? "",
				date: today,
				existingReason: otherOpen.meal === "lunch" ? record.lunchOtherReason : record.dinnerOtherReason
			}),
			requestDialogOpen && myAdmission && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessRequestDialog, {
				open: true,
				onClose: () => {
					setRequestDialogOpen(false);
					setEditingRequest(null);
				},
				admission: myAdmission,
				messId,
				messName: mess?.messName ?? "",
				existing: editingRequest ?? void 0
			})
		]
	});
}
//#endregion
export { StudentMessPage as component };
