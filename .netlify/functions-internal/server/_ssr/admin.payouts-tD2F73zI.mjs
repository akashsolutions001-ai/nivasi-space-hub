import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { C as Search, D as Plus, H as FileText, I as LoaderCircle, J as CircleX, K as Download, T as RefreshCw, U as Eye, X as CircleArrowDown, Y as CircleCheck, et as ChevronRight, it as Calendar$1, k as Pencil, nt as ChevronDown, q as Clock, tt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-D4UCyogy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { G as updatePayout, K as updatePayoutStatus, Q as useAllPayouts, Z as useAdmissions, ht as useMesses, m as createPayout, ot as useLaundries, w as generatePayoutId, yt as useProperties } from "./hooks-Dciv9SEg.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, d as SheetHeader, f as SheetTitle, i as SelectContent, l as Sheet, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell, u as SheetContent } from "./admin-shell-D-FgQhih.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-glMkOKxn.mjs";
import { a as isValidEmail, n as formatDate, o as isValidIndianMobile, r as formatINR, s as todayISO } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as StatCard, t as EmptyState } from "./stat-card-GZrf7Gbg.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.payouts-tD2F73zI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers["focused"]) ref.current?.focus();
	}, [modifiers]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers["selected"] && !modifiers["range_start"] && !modifiers["range_end"] && !modifiers["range_middle"],
		"data-range-start": modifiers["range_start"],
		"data-range-end": modifiers["range_end"],
		"data-range-middle": modifiers["range_middle"],
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var PAYOUT_TYPES = [
	{
		value: "MESS",
		label: "Mess"
	},
	{
		value: "TIFFIN",
		label: "Tiffin"
	},
	{
		value: "LAUNDRY",
		label: "Laundry"
	},
	{
		value: "CLEANING_STAFF",
		label: "Cleaning Staff"
	},
	{
		value: "SERVICE_PROVIDER",
		label: "Service Provider"
	},
	{
		value: "REFUND",
		label: "Refund"
	},
	{
		value: "OTHER",
		label: "Other"
	}
];
var PAYOUT_STATUSES = [
	{
		value: "PENDING",
		label: "Pending"
	},
	{
		value: "PROCESSING",
		label: "Processing"
	},
	{
		value: "PAID",
		label: "Paid"
	},
	{
		value: "FAILED",
		label: "Failed"
	},
	{
		value: "CANCELLED",
		label: "Cancelled"
	}
];
var PAYMENT_METHODS = [
	{
		value: "UPI",
		label: "UPI"
	},
	{
		value: "BANK_TRANSFER",
		label: "Bank Transfer"
	},
	{
		value: "CASH",
		label: "Cash"
	},
	{
		value: "OTHER",
		label: "Other"
	}
];
var DATE_PRESETS = [
	{
		value: "today",
		label: "Today"
	},
	{
		value: "yesterday",
		label: "Yesterday"
	},
	{
		value: "week",
		label: "Last 7 Days"
	},
	{
		value: "month",
		label: "This Month"
	},
	{
		value: "lastMonth",
		label: "Last Month"
	},
	{
		value: "all",
		label: "All Time"
	}
];
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `text-[11px] font-semibold ${{
			PENDING: "border-warning/30 bg-warning/10 text-warning-foreground",
			PROCESSING: "border-primary/30 bg-primary/10 text-primary",
			PAID: "border-success/30 bg-success/10 text-success",
			FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
			CANCELLED: "border-border bg-muted text-muted-foreground"
		}[status]}`,
		children: {
			PENDING: "Pending",
			PROCESSING: "Processing",
			PAID: "Paid",
			FAILED: "Failed",
			CANCELLED: "Cancelled"
		}[status]
	});
}
function TypeBadge({ type }) {
	const label = PAYOUT_TYPES.find((t) => t.value === type)?.label ?? type;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] text-muted-foreground",
		children: label
	});
}
function getDateRange(preset) {
	const now = /* @__PURE__ */ new Date();
	const today = new Date(now);
	today.setHours(0, 0, 0, 0);
	if (preset === "today") return {
		start: today,
		end: now
	};
	if (preset === "yesterday") {
		const y = new Date(today);
		y.setDate(y.getDate() - 1);
		const ye = new Date(y);
		ye.setHours(23, 59, 59, 999);
		return {
			start: y,
			end: ye
		};
	}
	if (preset === "week") {
		const s = new Date(today);
		s.setDate(s.getDate() - 6);
		return {
			start: s,
			end: now
		};
	}
	if (preset === "month") return {
		start: new Date(now.getFullYear(), now.getMonth(), 1),
		end: now
	};
	if (preset === "lastMonth") return {
		start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
		end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
	};
	return {
		start: null,
		end: null
	};
}
function computePayoutStats(payouts) {
	const active = payouts.filter((p) => p.status !== "CANCELLED");
	const total = active.reduce((s, p) => s + p.amount, 0);
	const paid = active.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
	const pending = active.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
	const processing = active.filter((p) => p.status === "PROCESSING").reduce((s, p) => s + p.amount, 0);
	const failed = active.filter((p) => p.status === "FAILED").reduce((s, p) => s + p.amount, 0);
	const todayStr = todayISO();
	const todayTotal = active.filter((p) => p.createdAt && p.createdAt.toISOString().slice(0, 10) === todayStr).reduce((s, p) => s + p.amount, 0);
	const now = /* @__PURE__ */ new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const monthTotal = active.filter((p) => p.createdAt && p.createdAt >= monthStart).reduce((s, p) => s + p.amount, 0);
	const byType = {
		MESS: 0,
		TIFFIN: 0,
		LAUNDRY: 0,
		CLEANING_STAFF: 0,
		SERVICE_PROVIDER: 0,
		REFUND: 0,
		OTHER: 0
	};
	for (const p of active) byType[p.payoutType] = (byType[p.payoutType] ?? 0) + p.amount;
	return {
		total,
		paid,
		pending,
		processing,
		failed,
		todayTotal,
		monthTotal,
		byType,
		count: active.length
	};
}
function exportPayoutsCSV(payouts) {
	const headers = [
		"Date",
		"Transaction ID",
		"Recipient Name",
		"Recipient Phone",
		"Recipient Email",
		"Payout Type",
		"Purpose",
		"Mess",
		"Property",
		"Student",
		"Amount",
		"Payment Method",
		"Reference ID",
		"Status",
		"Description",
		"Created By",
		"Created At",
		"Processed By",
		"Processed At"
	];
	const esc = (v) => {
		const s = String(v ?? "");
		return s.includes(",") || s.includes("\"") || s.includes("\n") ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	const csv = "﻿" + [headers, ...payouts.map((p) => [
		formatDate(p.createdAt),
		p.transactionId,
		p.recipientName,
		p.recipientPhone ?? "",
		p.recipientEmail ?? "",
		PAYOUT_TYPES.find((t) => t.value === p.payoutType)?.label ?? p.payoutType,
		p.purpose,
		p.messName ?? "",
		p.propertyName ?? "",
		p.studentName ?? "",
		p.amount,
		PAYMENT_METHODS.find((m) => m.value === p.paymentMethod)?.label ?? p.paymentMethod,
		p.referenceId ?? "",
		p.status,
		p.description ?? "",
		p.createdBy,
		p.createdAt ? p.createdAt.toLocaleString("en-IN") : "",
		p.processedBy ?? "",
		p.processedAt ? p.processedAt.toLocaleString("en-IN") : ""
	])].map((r) => r.map(esc).join(",")).join("\r\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `payouts_${todayISO()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
function PayoutFormDialog({ open, onClose, existing }) {
	const qc = useQueryClient();
	const { user } = useAuth();
	const { data: messes = [] } = useMesses();
	const { data: laundries = [] } = useLaundries();
	const { data: admissions = [] } = useAdmissions();
	const { data: properties = [] } = useProperties();
	const [payoutType, setPayoutType] = (0, import_react.useState)(existing?.payoutType ?? "MESS");
	const [generatedId, setGeneratedId] = (0, import_react.useState)("");
	const [recipientName, setRecipientName] = (0, import_react.useState)(existing?.recipientName ?? "");
	const [recipientPhone, setRecipientPhone] = (0, import_react.useState)(existing?.recipientPhone ?? "");
	const [recipientEmail, setRecipientEmail] = (0, import_react.useState)(existing?.recipientEmail ?? "");
	const [purpose, setPurpose] = (0, import_react.useState)(existing?.purpose ?? "");
	const [paymentFrequency, setPaymentFrequency] = (0, import_react.useState)("monthly");
	const [paymentDate, setPaymentDate] = (0, import_react.useState)(void 0);
	const [paymentDateTo, setPaymentDateTo] = (0, import_react.useState)(void 0);
	const [calendarOpen, setCalendarOpen] = (0, import_react.useState)(false);
	const [messId, setMessId] = (0, import_react.useState)(existing?.messId ?? "");
	const [otherMessName, setOtherMessName] = (0, import_react.useState)(existing?.messName ?? "");
	const [laundryId, setLaundryId] = (0, import_react.useState)(existing?.laundryId ?? "");
	const [otherLaundryName, setOtherLaundryName] = (0, import_react.useState)(existing?.laundryName ?? "");
	const [propertyId, setPropertyId] = (0, import_react.useState)(existing?.propertyId ?? "");
	const [studentId, setStudentId] = (0, import_react.useState)(existing?.studentId ?? "");
	const [servicePeriod, setServicePeriod] = (0, import_react.useState)(existing?.servicePeriod ?? "");
	const [studentCount, setStudentCount] = (0, import_react.useState)(String(existing?.studentCount ?? ""));
	const [service, setService] = (0, import_react.useState)(existing?.service ?? "");
	const [relatedItem, setRelatedItem] = (0, import_react.useState)(existing?.relatedItem ?? "");
	const [amount, setAmount] = (0, import_react.useState)(String(existing?.amount ?? ""));
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)(existing?.paymentMethod ?? "CASH");
	const [referenceId, setReferenceId] = (0, import_react.useState)(existing?.referenceId ?? "");
	const [description, setDescription] = (0, import_react.useState)(existing?.description ?? "");
	const [originalTxId, setOriginalTxId] = (0, import_react.useState)(existing?.originalTransactionId ?? "");
	const [originalAmount, setOriginalAmount] = (0, import_react.useState)(String(existing?.originalAmount ?? ""));
	const [refundReason, setRefundReason] = (0, import_react.useState)(existing?.refundReason ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open && !existing) generatePayoutId().then(setGeneratedId).catch(() => {});
	}, [open, existing]);
	const selectedMess = messes.find((m) => m.id === messId);
	const selectedLaundry = laundries.find((l) => l.id === laundryId);
	const selectedProperty = properties.find((p) => p.id === propertyId);
	const selectedStudent = admissions.find((a) => a.id === studentId);
	function buildPurposeFromDate(freq, from, to, type) {
		if (!from) return;
		const typeName = type === "MESS" ? "Mess Settlement" : type === "TIFFIN" ? "Tiffin Settlement" : type === "LAUNDRY" ? "Laundry Settlement" : type === "CLEANING_STAFF" ? "Cleaning Staff Payment" : type === "SERVICE_PROVIDER" ? "Service Payment" : type === "REFUND" ? "Refund" : type === "OTHER" ? "Miscellaneous Payment" : "Payment";
		const monthName = from.toLocaleDateString("en-IN", {
			month: "long",
			year: "numeric"
		});
		const dateStr = from.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
		const toDateStr = to ? to.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}) : "";
		if (freq === "monthly") setPurpose(`Monthly ${typeName} — ${monthName}`);
		else if (freq === "weekly" && to) setPurpose(`Weekly ${typeName} — ${dateStr} to ${toDateStr}`);
		else if (freq === "weekly") setPurpose(`Weekly ${typeName} — ${dateStr}`);
		else setPurpose(`${typeName} — ${dateStr}`);
	}
	function handleMessChange(id) {
		setMessId(id);
		if (payoutType === "MESS" || payoutType === "TIFFIN") {
			const m = messes.find((x) => x.id === id);
			if (m) {
				setRecipientName(m.ownerName || m.messName);
				setRecipientPhone(m.ownerPhone ?? "");
			}
		}
		if (payoutType === "TIFFIN") {
			const count = admissions.filter((a) => a.messId === id && a.tiffinStatus !== "cancelled").length;
			setStudentCount(String(count));
		}
	}
	function handleLaundryChange(id) {
		setLaundryId(id);
		const l = laundries.find((x) => x.id === id);
		if (l) {
			setRecipientName(l.ownerName || l.laundryName);
			setRecipientPhone(l.ownerPhone ?? "");
		}
	}
	function handleTypeChange(t) {
		setPayoutType(t);
		setMessId("");
		setLaundryId("");
		setPropertyId("");
		setStudentId("");
		setRecipientName("");
		setRecipientPhone("");
		setStudentCount("");
		setOtherMessName("");
		setOtherLaundryName("");
		if (paymentDate) buildPurposeFromDate(paymentFrequency, paymentDate, paymentDateTo, t);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		const amt = Number(amount);
		if (!recipientName.trim()) {
			toast.error("Recipient name is required.");
			return;
		}
		if (!purpose.trim()) {
			toast.error("Purpose is required.");
			return;
		}
		if (!amt || amt <= 0) {
			toast.error("Enter a valid amount.");
			return;
		}
		if (recipientPhone.trim() && !isValidIndianMobile(recipientPhone)) {
			toast.error("Enter a valid 10-digit Indian mobile number.");
			return;
		}
		if (recipientEmail.trim() && !isValidEmail(recipientEmail)) {
			toast.error("Enter a valid email address.");
			return;
		}
		if ((payoutType === "MESS" || payoutType === "TIFFIN") && !messId) {
			toast.error("Select a mess for this payout type.");
			return;
		}
		if ((payoutType === "MESS" || payoutType === "TIFFIN") && messId === "other" && !otherMessName.trim()) {
			toast.error("Enter the mess name.");
			return;
		}
		if (payoutType === "LAUNDRY" && !laundryId) {
			toast.error("Select a laundry for this payout type.");
			return;
		}
		if (payoutType === "LAUNDRY" && laundryId === "other" && !otherLaundryName.trim()) {
			toast.error("Enter the laundry name.");
			return;
		}
		setSaving(true);
		try {
			const payoutId = existing?.payoutId ?? generatedId ?? await generatePayoutId();
			const input = {
				payoutId,
				transactionId: payoutId,
				recipientName: recipientName.trim(),
				recipientPhone: recipientPhone.replace(/\D/g, ""),
				recipientEmail: recipientEmail.trim(),
				payoutType,
				purpose: purpose.trim(),
				messId: messId === "other" ? "" : messId || "",
				messName: messId === "other" ? otherMessName.trim() : selectedMess?.messName ?? "",
				laundryId: laundryId === "other" ? "" : laundryId || "",
				laundryName: laundryId === "other" ? otherLaundryName.trim() : selectedLaundry?.laundryName ?? "",
				propertyId: propertyId || "",
				propertyName: selectedProperty?.propertyName ?? "",
				studentId: studentId || "",
				studentName: selectedStudent?.fullName ?? "",
				servicePeriod: servicePeriod.trim(),
				studentCount: Number(studentCount) || 0,
				service: service.trim(),
				relatedItem: relatedItem.trim(),
				amount: amt,
				currency: "INR",
				paymentMethod,
				referenceId: referenceId.trim(),
				status: existing?.status ?? "PENDING",
				description: description.trim(),
				createdBy: user?.displayName || user?.email || "Admin",
				updatedBy: user?.displayName || user?.email || "Admin",
				processedBy: existing?.processedBy ?? "",
				originalTransactionId: originalTxId.trim(),
				originalAmount: Number(originalAmount) || 0,
				refundReason: refundReason.trim()
			};
			if (existing) {
				if (existing.status === "PAID" && amt !== existing.amount) {
					toast.error("Cannot change the amount of a PAID payout.");
					setSaving(false);
					return;
				}
				await updatePayout(existing.id, input, user?.displayName || user?.email || "Admin");
				toast.success("Payout updated.");
			} else {
				await createPayout(input);
				toast.success(`Payout ${payoutId} created.`);
			}
			await qc.invalidateQueries({ queryKey: ["payouts"] });
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save payout.");
		} finally {
			setSaving(false);
		}
	}
	const isMessType = payoutType === "MESS" || payoutType === "TIFFIN";
	const isLaundryType = payoutType === "LAUNDRY";
	const isOtherLinked = [
		"CLEANING_STAFF",
		"SERVICE_PROVIDER",
		"OTHER"
	].includes(payoutType);
	const isRefund = payoutType === "REFUND";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl flex flex-col max-h-[90vh] overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "px-6 pt-6 pb-2 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: existing ? "Edit Payout" : "Create Payout" }),
							!existing && generatedId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-normal text-muted-foreground border border-border rounded-lg px-2 py-1",
								children: generatedId
							}),
							existing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-normal text-muted-foreground border border-border rounded-lg px-2 py-1",
								children: existing.payoutId
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "payout-form",
						onSubmit: handleSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payout Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: payoutType,
									onValueChange: (v) => handleTypeChange(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYOUT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t.value,
										children: t.label
									}, t.value)) })]
								})]
							}),
							isMessType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mess *" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: messId,
										onValueChange: (id) => {
											setMessId(id);
											if (id !== "other") handleMessChange(id);
											else setOtherMessName("");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select mess…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [messes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: m.id,
											children: m.messName
										}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "Other (type manually)"
										})] })]
									}),
									messId === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: otherMessName,
										onChange: (e) => {
											setOtherMessName(e.target.value);
											setRecipientName(e.target.value);
										},
										placeholder: "Enter mess name…",
										autoFocus: true
									}),
									messId !== "other" && selectedMess?.ownerName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Owner: ",
											selectedMess.ownerName,
											selectedMess.ownerPhone ? ` · ${selectedMess.ownerPhone}` : ""
										]
									})
								]
							}),
							isLaundryType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Laundry *" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: laundryId,
										onValueChange: (id) => {
											setLaundryId(id);
											if (id !== "other") handleLaundryChange(id);
											else setOtherLaundryName("");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select laundry…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [laundries.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: l.id,
											children: l.laundryName
										}, l.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "Other (type manually)"
										})] })]
									}),
									laundryId === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: otherLaundryName,
										onChange: (e) => {
											setOtherLaundryName(e.target.value);
											setRecipientName(e.target.value);
										},
										placeholder: "Enter laundry name…",
										autoFocus: true
									}),
									laundryId !== "other" && selectedLaundry?.ownerName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Owner: ",
											selectedLaundry.ownerName,
											selectedLaundry.ownerPhone ? ` · ${selectedLaundry.ownerPhone}` : ""
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2 space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Recipient Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: recipientName,
											onChange: (e) => setRecipientName(e.target.value),
											placeholder: "e.g. Raj Mess Owner"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: recipientPhone,
											onChange: (e) => setRecipientPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
											placeholder: "9876543210",
											inputMode: "numeric",
											maxLength: 10
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: recipientEmail,
											onChange: (e) => setRecipientEmail(e.target.value),
											placeholder: "optional",
											type: "email"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purpose *" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: [
											"one_time",
											"weekly",
											"monthly"
										].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setPaymentFrequency(f);
												setPaymentDate(void 0);
												setPaymentDateTo(void 0);
											},
											className: `flex-1 rounded-xl border px-2 py-1.5 text-xs font-medium transition-colors ${paymentFrequency === f ? "gradient-brand text-primary-foreground border-primary shadow-soft" : "border-border text-muted-foreground hover:bg-muted"}`,
											children: f === "one_time" ? "One-time" : f === "weekly" ? "Weekly" : "Monthly"
										}, f))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
										open: calendarOpen,
										onOpenChange: setCalendarOpen,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												className: "w-full justify-start text-left font-normal",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "mr-2 size-4 text-muted-foreground" }), paymentFrequency === "monthly" && paymentDate ? paymentDate.toLocaleDateString("en-IN", {
													month: "long",
													year: "numeric"
												}) : paymentFrequency === "weekly" && paymentDate ? paymentDate.toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short"
												}) + (paymentDateTo ? ` → ${paymentDateTo.toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric"
												})}` : " (select end date)") : paymentDate ? paymentDate.toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: paymentFrequency === "monthly" ? "Select month…" : paymentFrequency === "weekly" ? "Select start date…" : "Select date…"
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
											className: "w-auto p-0",
											align: "start",
											children: paymentFrequency === "monthly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
												mode: "single",
												selected: paymentDate,
												onSelect: (d) => {
													setPaymentDate(d);
													if (d) {
														const first = new Date(d.getFullYear(), d.getMonth(), 1);
														setPaymentDate(first);
														buildPurposeFromDate("monthly", first, void 0, payoutType);
														setServicePeriod(first.toLocaleDateString("en-IN", {
															month: "long",
															year: "numeric"
														}));
													}
													setCalendarOpen(false);
												}
											}) : paymentFrequency === "weekly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-medium text-muted-foreground",
														children: !paymentDate ? "Select start date" : "Select end date"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
														mode: "single",
														selected: !paymentDate ? void 0 : paymentDateTo ?? paymentDate,
														onSelect: (d) => {
															if (!paymentDate) setPaymentDate(d);
															else {
																setPaymentDateTo(d);
																buildPurposeFromDate("weekly", paymentDate, d, payoutType);
																if (paymentDate && d) {
																	const from = paymentDate.toLocaleDateString("en-IN", {
																		day: "numeric",
																		month: "short"
																	});
																	const to = d.toLocaleDateString("en-IN", {
																		day: "numeric",
																		month: "short",
																		year: "numeric"
																	});
																	setServicePeriod(`${from} – ${to}`);
																}
																setCalendarOpen(false);
															}
														}
													}),
													paymentDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "sm",
														className: "w-full text-xs",
														onClick: () => {
															setPaymentDate(void 0);
															setPaymentDateTo(void 0);
														},
														children: "Reset dates"
													})
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
												mode: "single",
												selected: paymentDate,
												onSelect: (d) => {
													setPaymentDate(d);
													if (d) buildPurposeFromDate("one_time", d, void 0, payoutType);
													setCalendarOpen(false);
												}
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: purpose,
										onChange: (e) => setPurpose(e.target.value),
										placeholder: payoutType === "MESS" ? "e.g. Monthly Mess Settlement — August 2026" : payoutType === "TIFFIN" ? "e.g. Monthly Tiffin Settlement — August 2026" : payoutType === "LAUNDRY" ? "e.g. Monthly Laundry Settlement — August 2026" : payoutType === "CLEANING_STAFF" ? "e.g. Monthly Cleaning Staff Payment" : payoutType === "SERVICE_PROVIDER" ? "e.g. Mattress supply — Raj Residency" : payoutType === "REFUND" ? "e.g. Refund for Student A" : payoutType === "OTHER" ? "e.g. Transport, Maintenance, Miscellaneous…" : "e.g. Maintenance expense"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Pick a frequency & date above to auto-fill, or type manually."
									})
								]
							}),
							(isMessType || isLaundryType || payoutType === "CLEANING_STAFF" || payoutType === "OTHER") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `grid gap-3 ${payoutType === "TIFFIN" ? "grid-cols-2" : "grid-cols-1"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service Period" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: servicePeriod,
										onChange: (e) => setServicePeriod(e.target.value),
										placeholder: "e.g. August 2026"
									})]
								}), payoutType === "TIFFIN" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "No. of Students" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: studentCount,
										onChange: (e) => setStudentCount(e.target.value),
										placeholder: "Auto-calculated",
										type: "number",
										min: 0
									})]
								})]
							}),
							payoutType === "SERVICE_PROVIDER" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service / Item" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: service,
										onChange: (e) => setService(e.target.value),
										placeholder: "e.g. Mattress supply…"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Related Item" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: relatedItem,
										onChange: (e) => setRelatedItem(e.target.value),
										placeholder: "e.g. 10 single mattresses"
									})]
								})]
							}),
							payoutType === "OTHER" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category / Expense Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: service,
										onChange: (e) => setService(e.target.value),
										placeholder: "e.g. Transport, Maintenance…"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Related Item" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: relatedItem,
										onChange: (e) => setRelatedItem(e.target.value),
										placeholder: "e.g. Plumbing repair"
									})]
								})]
							}),
							isRefund && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Student" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: studentId,
											onValueChange: setStudentId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select student…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: admissions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: a.id,
												children: [
													a.fullName,
													" · ",
													a.admissionId
												]
											}, a.id)) })]
										}),
										selectedStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["Phone: ", selectedStudent.phoneNumber]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Original Transaction ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: originalTxId,
											onChange: (e) => setOriginalTxId(e.target.value),
											placeholder: "PAY-…"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Original Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: originalAmount,
											onChange: (e) => setOriginalAmount(e.target.value),
											type: "number",
											min: 0,
											placeholder: "₹"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Refund Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: refundReason,
										onChange: (e) => setRefundReason(e.target.value),
										placeholder: "Reason for refund…"
									})]
								})
							] }),
							isOtherLinked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Related Property" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: propertyId,
									onValueChange: setPropertyId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Optional — select property" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "",
										children: "None"
									}), properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.propertyName
									}, p.id))] })]
								})]
							}),
							(isLaundryType || isOtherLinked) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Related Mess (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: messId,
									onValueChange: setMessId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Optional — select mess" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "",
										children: "None"
									}), messes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.id,
										children: m.messName
									}, m.id))] })]
								})]
							}),
							(payoutType === "SERVICE_PROVIDER" || payoutType === "OTHER") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Related Student (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: studentId,
									onValueChange: setStudentId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Optional — select student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "",
										children: "None"
									}), admissions.slice(0, 100).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: a.id,
										children: [
											a.fullName,
											" · ",
											a.admissionId
										]
									}, a.id))] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹) *" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: amount,
											onChange: (e) => setAmount(e.target.value),
											type: "number",
											min: 1,
											placeholder: "0"
										}),
										existing?.status === "PAID" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-warning-foreground",
											children: "⚠ Amount cannot change on a PAID payout"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Method *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: paymentMethod,
										onValueChange: (v) => setPaymentMethod(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: m.value,
											children: m.label
										}, m.value)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reference ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: referenceId,
									onChange: (e) => setReferenceId(e.target.value),
									placeholder: "UPI/bank reference (optional)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description / Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: description,
									onChange: (e) => setDescription(e.target.value),
									placeholder: "Additional notes…",
									rows: 2
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-t border-border bg-background px-6 py-4 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						form: "payout-form",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), existing ? "Save Changes" : "Create Payout"]
					})]
				})
			]
		})
	});
}
function PayoutDetailsSheet({ payout, onClose, onEdit, onStatusChange }) {
	if (!payout) return null;
	function Row({ label, value }) {
		if (!value && value !== 0) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between gap-4 border-b border-border/60 py-2 last:border-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-xs font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-right text-sm font-medium",
				children: value
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!payout,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Payout Details"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold",
								children: payout.transactionId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: formatDate(payout.createdAt)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: payout.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-2xl border border-border bg-muted/40 p-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground uppercase tracking-wide",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-3xl font-bold",
									children: formatINR(payout.amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeBadge, { type: payout.payoutType })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Recipient",
							value: payout.recipientName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: payout.recipientPhone || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: payout.recipientEmail || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Purpose",
							value: payout.purpose
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Mess",
							value: payout.messName || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Laundry",
							value: payout.laundryName || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Property",
							value: payout.propertyName || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Student",
							value: payout.studentName || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Service",
							value: payout.service || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Related Item",
							value: payout.relatedItem || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Service Period",
							value: payout.servicePeriod || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Student Count",
							value: payout.studentCount || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Payment Method",
							value: PAYMENT_METHODS.find((m) => m.value === payout.paymentMethod)?.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Reference ID",
							value: payout.referenceId || void 0
						}),
						payout.payoutType === "REFUND" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Original Txn",
								value: payout.originalTransactionId || void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Original Amt",
								value: payout.originalAmount ? formatINR(payout.originalAmount) : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Refund Reason",
								value: payout.refundReason || void 0
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Description",
							value: payout.description || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Created By",
							value: payout.createdBy
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Created At",
							value: payout.createdAt?.toLocaleString("en-IN")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Processed By",
							value: payout.processedBy || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Processed At",
							value: payout.processedAt?.toLocaleString("en-IN") || void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Last Updated",
							value: payout.updatedAt?.toLocaleString("en-IN")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Update Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: PAYOUT_STATUSES.filter((s) => s.value !== payout.status).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 text-xs",
							onClick: () => onStatusChange(payout.id, s.value),
							children: ["→ ", s.label]
						}, s.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "flex-1",
						onClick: () => {
							onClose();
							onEdit(payout);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1.5 size-3.5" }), " Edit"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClose,
						children: "Close"
					})]
				})
			]
		})
	});
}
function PayoutsPage() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const { data: allPayouts = [], isLoading } = useAllPayouts();
	const { data: messes = [] } = useMesses();
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [messFilter, setMessFilter] = (0, import_react.useState)("all");
	const [methodFilter, setMethodFilter] = (0, import_react.useState)("all");
	const [datePreset, setDatePreset] = (0, import_react.useState)("month");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [detailsPayout, setDetailsPayout] = (0, import_react.useState)(null);
	const [updatingStatusId, setUpdatingStatusId] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const { start, end } = getDateRange(datePreset);
		const q = search.trim().toLowerCase();
		return allPayouts.filter((p) => {
			if (typeFilter !== "all" && p.payoutType !== typeFilter) return false;
			if (statusFilter !== "all" && p.status !== statusFilter) return false;
			if (messFilter !== "all" && p.messId !== messFilter) return false;
			if (methodFilter !== "all" && p.paymentMethod !== methodFilter) return false;
			if (start && p.createdAt && p.createdAt < start) return false;
			if (end && p.createdAt && p.createdAt > end) return false;
			if (q && ![
				p.transactionId,
				p.recipientName,
				p.recipientPhone ?? "",
				p.recipientEmail ?? "",
				p.referenceId ?? "",
				p.purpose,
				p.description ?? "",
				p.messName ?? "",
				p.propertyName ?? "",
				p.studentName ?? ""
			].some((v) => v.toLowerCase().includes(q))) return false;
			return true;
		});
	}, [
		allPayouts,
		search,
		typeFilter,
		statusFilter,
		messFilter,
		methodFilter,
		datePreset
	]);
	const stats = (0, import_react.useMemo)(() => computePayoutStats(allPayouts), [allPayouts]);
	const filteredStats = (0, import_react.useMemo)(() => computePayoutStats(filtered), [filtered]);
	async function handleStatusChange(id, status) {
		setUpdatingStatusId(id);
		try {
			await updatePayoutStatus(id, status, user?.displayName || user?.email || "Admin");
			await qc.invalidateQueries({ queryKey: ["payouts"] });
			toast.success(`Status updated to ${status}.`);
			if (detailsPayout?.id === id) setDetailsPayout((prev) => prev ? {
				...prev,
				status
			} : null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update status.");
		} finally {
			setUpdatingStatusId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Payouts",
		subtitle: "All outgoing / debit transactions.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => exportPayoutsCSV(filtered),
				disabled: filtered.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 size-4" }), "Export CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setCreateOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), "Create Payout"]
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Debit",
						value: formatINR(stats.total),
						icon: CircleArrowDown,
						tone: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Paid",
						value: formatINR(stats.paid),
						icon: CircleCheck,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: formatINR(stats.pending),
						icon: Clock,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Processing",
						value: formatINR(stats.processing),
						icon: RefreshCw,
						tone: "neutral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Failed",
						value: formatINR(stats.failed),
						icon: CircleX,
						tone: "neutral"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: "Today's Debit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-bold",
							children: formatINR(stats.todayTotal)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: "This Month's Debit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-bold",
							children: formatINR(stats.monthTotal)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: "Total Transactions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-bold",
							children: stats.count
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-sm font-bold",
					children: "Payout Breakdown"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
					children: PAYOUT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium",
							children: t.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tabular-nums",
							children: formatINR(stats.byType[t.value])
						})]
					}, t.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-48",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Search by recipient, ID, purpose…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: datePreset,
						onValueChange: setDatePreset,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DATE_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p.value,
							children: p.label
						}, p.value)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: typeFilter,
						onValueChange: setTypeFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Types" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Types"
						}), PAYOUT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t.value,
							children: t.label
						}, t.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Status"
						}), PAYOUT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.value,
							children: s.label
						}, s.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: messFilter,
						onValueChange: setMessFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Messes" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Messes"
						}), messes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.id,
							children: m.messName
						}, m.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: methodFilter,
						onValueChange: setMethodFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Methods" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Methods"
						}), PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.value,
							children: m.label
						}, m.value))] })]
					})
				]
			}),
			!isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					filtered.length,
					" transaction",
					filtered.length !== 1 ? "s" : "",
					filtered.length !== allPayouts.length ? ` (filtered from ${allPayouts.length})` : "",
					" · ",
					"Total: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatINR(filteredStats.total) })
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-2xl" }, i))
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No payout transactions yet",
				description: allPayouts.length === 0 ? "Create your first payout to start tracking outgoing payments." : "No transactions match your current filters.",
				action: allPayouts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setCreateOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4" }), " Create Payout"]
				}) : void 0
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Transaction ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Recipient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Purpose"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Mess / Property"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer border-t border-border transition-colors hover:bg-muted/40",
						onClick: () => setDetailsPayout(p),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted-foreground",
								children: formatDate(p.createdAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs text-primary",
								children: p.transactionId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p.recipientName
								}), p.recipientPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.recipientPhone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeBadge, { type: p.payoutType })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 max-w-[180px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: p.purpose
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-foreground",
								children: p.messName || p.propertyName || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right font-semibold",
								children: formatINR(p.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted-foreground",
								children: PAYMENT_METHODS.find((m) => m.value === p.paymentMethod)?.label ?? p.paymentMethod
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-7 px-2 text-xs",
									onClick: (e) => {
										e.stopPropagation();
										setDetailsPayout(p);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 size-3.5" }), " View"]
								})
							})
						]
					}, p.id)) })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2 lg:hidden",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-soft",
					onClick: () => setDetailsPayout(p),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: p.recipientName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-primary",
									children: p.transactionId
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-bold",
									children: formatINR(p.amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeBadge, { type: p.payoutType }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(p.createdAt) }),
								p.messName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", p.messName] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-sm text-muted-foreground",
							children: p.purpose
						})
					]
				}, p.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutFormDialog, {
				open: createOpen,
				onClose: () => setCreateOpen(false)
			}),
			editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutFormDialog, {
				open: !!editTarget,
				onClose: () => setEditTarget(null),
				existing: editTarget
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutDetailsSheet, {
				payout: detailsPayout,
				onClose: () => setDetailsPayout(null),
				onEdit: (p) => {
					setDetailsPayout(null);
					setEditTarget(p);
				},
				onStatusChange: handleStatusChange
			})
		]
	});
}
//#endregion
export { PayoutsPage as component };
