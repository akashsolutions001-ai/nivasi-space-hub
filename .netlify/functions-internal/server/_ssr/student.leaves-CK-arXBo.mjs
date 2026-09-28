import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Ot as useLeaveRequestsForStudent, Q as updateLeaveReturnDate, W as todayISTDateString, m as createLeaveRequest, o as cancelLeaveRequest } from "./hooks-XsXOiSyK.mjs";
import { r as useStudentAuth } from "./studentAuth-D19cUah4.mjs";
import { H as LoaderCircle, N as PhoneCall, Y as FileText, at as CircleAlert, bt as ArrowRight, ht as CalendarCheck, j as Plus, m as Trash2, mt as CalendarDays, nt as CircleX, pt as CalendarOff, rt as CircleCheck, tt as Clock } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Checkbox } from "./checkbox-BvhzXIX4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
import { t as StudentShell } from "./student-shell-C6blVs1I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.leaves-CK-arXBo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDisplayDate(dateStr) {
	if (!dateStr) return "TBD (Open Return)";
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
function calculateDays(from, to) {
	if (!from || !to) return "Open duration";
	try {
		const d1 = new Date(from);
		const d2 = new Date(to);
		const diff = Math.round((d2.getTime() - d1.getTime()) / 864e5) + 1;
		if (diff <= 0) return "1 day";
		return `${diff} ${diff === 1 ? "day" : "days"}`;
	} catch {
		return "";
	}
}
var LEAVE_STATUS_CONFIG = {
	pending: {
		label: "Pending Approval",
		icon: Clock,
		badgeCls: "bg-warning/15 text-warning-foreground border-warning/30"
	},
	approved: {
		label: "Approved",
		icon: CircleCheck,
		badgeCls: "bg-success/15 text-success border-success/30"
	},
	rejected: {
		label: "Rejected",
		icon: CircleX,
		badgeCls: "bg-destructive/15 text-destructive border-destructive/30"
	},
	cancelled: {
		label: "Cancelled",
		icon: CircleAlert,
		badgeCls: "bg-muted text-muted-foreground border-border"
	},
	completed: {
		label: "Completed",
		icon: CalendarCheck,
		badgeCls: "bg-primary/10 text-primary border-primary/20"
	}
};
function StudentLeavesPage() {
	const { session, admission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: leaves = [], isLoading } = useLeaveRequestsForStudent(admission?.id ?? null);
	const [createDialogOpen, setCreateDialogOpen] = (0, import_react.useState)(false);
	const [returnDialogOpen, setReturnDialogOpen] = (0, import_react.useState)(false);
	const [selectedLeave, setSelectedLeave] = (0, import_react.useState)(null);
	const [fromDate, setFromDate] = (0, import_react.useState)("");
	const [toDate, setToDate] = (0, import_react.useState)("");
	const [fillToDateLater, setFillToDateLater] = (0, import_react.useState)(false);
	const [reasonCategory, setReasonCategory] = (0, import_react.useState)("Going Home");
	const [reasonDetails, setReasonDetails] = (0, import_react.useState)("");
	const [emergencyPhone, setEmergencyPhone] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [newReturnDate, setNewReturnDate] = (0, import_react.useState)("");
	const [savingReturnDate, setSavingReturnDate] = (0, import_react.useState)(false);
	const [tabFilter, setTabFilter] = (0, import_react.useState)("all");
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
	(0, import_react.useEffect)(() => {
		if (admission) setEmergencyPhone(admission.parentPhone || admission.phoneNumber || "");
	}, [admission]);
	const openNewLeaveModal = () => {
		const today = todayISTDateString();
		setFromDate(today);
		setToDate("");
		setFillToDateLater(false);
		setReasonCategory("Going Home");
		setReasonDetails("");
		setEmergencyPhone(admission?.parentPhone || admission?.phoneNumber || "");
		setCreateDialogOpen(true);
	};
	const handleCreateLeave = async (e) => {
		e.preventDefault();
		if (!admission) return;
		if (!fromDate) {
			toast.error("From Date is mandatory.");
			return;
		}
		if (!fillToDateLater && toDate && toDate < fromDate) {
			toast.error("To Date cannot be earlier than From Date.");
			return;
		}
		const fullReason = reasonDetails.trim() ? `${reasonCategory}: ${reasonDetails.trim()}` : reasonCategory;
		setSubmitting(true);
		try {
			await createLeaveRequest({
				studentId: admission.id,
				admissionId: admission.admissionId,
				studentName: admission.fullName,
				studentEmail: admission.email || session?.email || "",
				studentPhone: admission.phoneNumber,
				propertyName: admission.propertyName,
				roomNumber: admission.roomNumber,
				bedNumber: admission.bedNumber,
				collegeName: admission.collegeName,
				fromDate,
				toDate: fillToDateLater || !toDate ? null : toDate,
				hasOpenReturn: fillToDateLater || !toDate,
				reason: fullReason,
				emergencyContact: emergencyPhone.trim(),
				status: "pending"
			});
			queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
			toast.success("Leave request submitted! Awaiting administrator approval.");
			setCreateDialogOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to submit leave request.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleOpenSetReturnModal = (leave) => {
		setSelectedLeave(leave);
		setNewReturnDate(leave.toDate || todayISTDateString());
		setReturnDialogOpen(true);
	};
	const handleSaveReturnDate = async () => {
		if (!selectedLeave || !newReturnDate) return;
		if (newReturnDate < selectedLeave.fromDate) {
			toast.error("Return date cannot be earlier than From date.");
			return;
		}
		setSavingReturnDate(true);
		try {
			await updateLeaveReturnDate(selectedLeave.id, newReturnDate);
			queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
			toast.success("Return date updated successfully!");
			setReturnDialogOpen(false);
			setSelectedLeave(null);
		} catch (err) {
			toast.error(err?.message || "Failed to update return date.");
		} finally {
			setSavingReturnDate(false);
		}
	};
	const handleCancelLeave = async (leaveId) => {
		if (!confirm("Are you sure you want to cancel this leave request?")) return;
		try {
			await cancelLeaveRequest(leaveId);
			queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
			toast.success("Leave request cancelled.");
		} catch (err) {
			toast.error(err?.message || "Failed to cancel leave request.");
		}
	};
	const filteredLeaves = leaves.filter((l) => {
		if (tabFilter === "pending") return l.status === "pending";
		if (tabFilter === "approved") return l.status === "approved";
		if (tabFilter === "history") return l.status === "rejected" || l.status === "completed" || l.status === "cancelled";
		return true;
	});
	const pendingCount = leaves.filter((l) => l.status === "pending").length;
	const approvedCount = leaves.filter((l) => l.status === "approved").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentShell, {
		title: "Leave Requests",
		subtitle: "Request permission for leaves, track approval status, and update your return date",
		icon: CalendarOff,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: openNewLeaveModal,
			className: "gradient-brand text-white shadow-soft font-semibold text-xs sm:text-sm gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Apply for Leave"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Total Requests"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold font-display mt-1",
										children: leaves.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "All time submissions"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-warning-foreground",
										children: "Pending Approval"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold font-display text-warning mt-1",
										children: pendingCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Awaiting admin review"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-success",
										children: "Approved Leaves"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold font-display text-success mt-1",
										children: approvedCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Confirmed by hostel admin"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Open Return Leaves"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold font-display text-foreground mt-1",
										children: leaves.filter((l) => l.hasOpenReturn && l.status !== "rejected" && l.status !== "cancelled").length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Return date to be filled"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 overflow-x-auto pb-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tabFilter === "all" ? "default" : "outline",
								size: "sm",
								onClick: () => setTabFilter("all"),
								className: "rounded-xl text-xs h-8",
								children: [
									"All Requests (",
									leaves.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tabFilter === "pending" ? "default" : "outline",
								size: "sm",
								onClick: () => setTabFilter("pending"),
								className: "rounded-xl text-xs h-8",
								children: [
									"Pending (",
									pendingCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tabFilter === "approved" ? "default" : "outline",
								size: "sm",
								onClick: () => setTabFilter("approved"),
								className: "rounded-xl text-xs h-8",
								children: [
									"Approved (",
									approvedCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: tabFilter === "history" ? "default" : "outline",
								size: "sm",
								onClick: () => setTabFilter("history"),
								className: "rounded-xl text-xs h-8",
								children: "History & Other"
							})
						]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center p-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
					}) : filteredLeaves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-base text-foreground",
								children: "No leave requests found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-sm mx-auto",
								children: tabFilter === "all" ? "You haven't submitted any leave requests yet. Need to go home or take time off? Click 'Apply for Leave' above." : `No leave requests match the '${tabFilter}' filter.`
							}),
							tabFilter === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: openNewLeaveModal,
								className: "mt-4 gradient-brand text-white shadow-soft",
								size: "sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-1.5" }), "Apply for Leave"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: filteredLeaves.map((leave) => {
							const statusCfg = LEAVE_STATUS_CONFIG[leave.status] || LEAVE_STATUS_CONFIG.pending;
							const StatusIcon = statusCfg.icon;
							const duration = calculateDays(leave.fromDate, leave.toDate);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: `text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: "size-3.5" }), statusCfg.label]
													}),
													leave.hasOpenReturn && leave.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-xs bg-brand-soft text-brand-dark border-brand-soft",
														children: "Return Date Open"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground",
														children: ["Applied on ", formatDisplayDate(leave.createdAt?.toISOString().slice(0, 10))]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 flex items-center gap-2 text-base sm:text-lg font-bold font-display text-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5 text-primary shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDisplayDate(leave.fromDate) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-muted-foreground" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: leave.toDate ? "text-foreground" : "text-primary italic",
														children: formatDisplayDate(leave.toDate)
													}),
													duration && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted",
														children: duration
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-2 sm:pt-0",
											children: [(leave.hasOpenReturn || !leave.toDate || leave.status === "approved" || leave.status === "pending") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => handleOpenSetReturnModal(leave),
												className: "text-xs rounded-xl h-8",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-3.5 mr-1.5 text-primary" }), leave.toDate ? "Update Return Date" : "Set Return Date"]
											}), leave.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleCancelLeave(leave.id),
												className: "text-xs text-destructive hover:bg-destructive/10 h-8 rounded-xl px-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 mr-1" }), "Cancel"]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-muted-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Reason for Leave"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-foreground mt-0.5",
												children: leave.reason || "Not specified"
											})] })]
										}), leave.emergencyContact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-4 text-muted-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Emergency Contact"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-foreground mt-0.5",
												children: leave.emergencyContact
											})] })]
										})]
									}),
									leave.adminNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 rounded-xl bg-muted/60 p-3 text-xs text-foreground border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-muted-foreground",
												children: "Admin Feedback:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5",
												children: leave.adminNotes
											}),
											leave.reviewedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-muted-foreground mt-1",
												children: ["Reviewed by ", leave.reviewedBy]
											})
										]
									})
								]
							}, leave.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createDialogOpen,
				onOpenChange: setCreateDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md sm:max-w-lg rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg",
						children: "Apply for Leave"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Submit your hostel leave details. Your request will be sent to the administrator for confirmation."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateLeave,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "fromDate",
											className: "text-xs font-semibold",
											children: ["From Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "fromDate",
											type: "date",
											required: true,
											value: fromDate,
											onChange: (e) => setFromDate(e.target.value),
											className: "rounded-xl text-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Mandatory start date of leave"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "toDate",
											className: "text-xs font-semibold",
											children: "To Date (Return Date)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "toDate",
											type: "date",
											disabled: fillToDateLater,
											value: fillToDateLater ? "" : toDate,
											min: fromDate || void 0,
											onChange: (e) => setToDate(e.target.value),
											className: "rounded-xl text-sm disabled:opacity-50"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Optional, can be set later"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center space-x-2 rounded-xl border border-dashed border-border bg-muted/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: "fillLater",
									checked: fillToDateLater,
									onCheckedChange: (checked) => {
										setFillToDateLater(Boolean(checked));
										if (checked) setToDate("");
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "fillLater",
									className: "text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
									children: "I don't know my return date yet (I will fill it later)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "reasonCategory",
									className: "text-xs font-semibold",
									children: "Leave Reason / Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: reasonCategory,
									onValueChange: setReasonCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "reasonCategory",
										className: "rounded-xl text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select reason" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Going Home",
												children: "Going Home / Family Visit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Medical / Health Issue",
												children: "Medical / Sick Leave"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "College Exams / Event",
												children: "Exams / Academic Event"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Family Function",
												children: "Family Function / Festival"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Emergency",
												children: "Emergency"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Vacation / Trip",
												children: "Vacation / Trip"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Other",
												children: "Other Reason"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "reasonDetails",
									className: "text-xs font-semibold",
									children: "Reason Details / Remarks (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "reasonDetails",
									rows: 2,
									placeholder: "Briefly describe your reason or destination...",
									value: reasonDetails,
									onChange: (e) => setReasonDetails(e.target.value),
									className: "rounded-xl text-sm resize-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "emergencyPhone",
										className: "text-xs font-semibold",
										children: "Emergency Contact Number"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "emergencyPhone",
										type: "tel",
										placeholder: "Parent or local guardian contact number",
										value: emergencyPhone,
										onChange: (e) => setEmergencyPhone(e.target.value),
										className: "rounded-xl text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Contact number for emergencies while on leave"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setCreateDialogOpen(false),
									className: "rounded-xl text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: submitting,
									className: "gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold",
									children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), "Submit Leave Request"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: returnDialogOpen,
				onOpenChange: setReturnDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg",
						children: "Update Return Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Set or update your planned return date for this leave."
					})] }), selectedLeave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/50 p-3 text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-muted-foreground",
										children: "Leave Start Date:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatDisplayDate(selectedLeave.fromDate) })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-muted-foreground",
										children: "Reason:"
									}),
									" ",
									selectedLeave.reason
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "updateReturnDate",
									className: "text-xs font-semibold",
									children: ["New Return Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "updateReturnDate",
									type: "date",
									required: true,
									min: selectedLeave.fromDate,
									value: newReturnDate,
									onChange: (e) => setNewReturnDate(e.target.value),
									className: "rounded-xl text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setReturnDialogOpen(false),
									className: "rounded-xl text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									disabled: savingReturnDate || !newReturnDate,
									onClick: handleSaveReturnDate,
									className: "gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold",
									children: [savingReturnDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), "Save Return Date"]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { StudentLeavesPage as component };
