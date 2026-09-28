import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-C-wItvgy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Q as updateLeaveReturnDate, W as todayISTDateString, Z as updateLeaveRequestStatus, dt as useAllLeaveRequests } from "./hooks-XsXOiSyK.mjs";
import { H as LoaderCircle, K as House, M as Phone, T as Search, at as CircleAlert, bt as ArrowRight, dt as Check, ft as Calendar, ht as CalendarCheck, mt as CalendarDays, n as X, nt as CircleX, pt as CalendarOff, rt as CircleCheck, tt as Clock } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as AdminShell } from "./admin-shell-Cw69BSgV.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as formatDate } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.leaves-BX1sFWa3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function calculateDuration(from, to) {
	if (!from) return "—";
	if (!to) return "Open Duration";
	try {
		const d1 = new Date(from);
		const d2 = new Date(to);
		const diff = Math.round((d2.getTime() - d1.getTime()) / 864e5) + 1;
		if (diff <= 0) return "1 day";
		return `${diff} ${diff === 1 ? "day" : "days"}`;
	} catch {
		return "—";
	}
}
function isCurrentlyActive(leave, today) {
	if (leave.status !== "approved") return false;
	if (!leave.fromDate) return false;
	if (leave.fromDate > today) return false;
	if (leave.toDate && leave.toDate < today) return false;
	return true;
}
var STATUS_CONFIG = {
	pending: {
		label: "Pending Review",
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
function AdminLeavesPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: leaves = [], isLoading } = useAllLeaveRequests();
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [propertyFilter, setPropertyFilter] = (0, import_react.useState)("all");
	const [reviewDialog, setReviewDialog] = (0, import_react.useState)({
		open: false,
		leave: null,
		action: "approve"
	});
	const [adminNotes, setAdminNotes] = (0, import_react.useState)("");
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const [returnDialog, setReturnDialog] = (0, import_react.useState)({
		open: false,
		leave: null
	});
	const [newReturnDate, setNewReturnDate] = (0, import_react.useState)("");
	const [savingReturnDate, setSavingReturnDate] = (0, import_react.useState)(false);
	const today = todayISTDateString();
	const uniqueProperties = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		leaves.forEach((l) => {
			if (l.propertyName) set.add(l.propertyName);
		});
		return Array.from(set).sort();
	}, [leaves]);
	const filteredLeaves = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return leaves.filter((leave) => {
			if (q) {
				const matchesName = leave.studentName?.toLowerCase().includes(q);
				const matchesAdmId = leave.admissionId?.toLowerCase().includes(q);
				const matchesProp = leave.propertyName?.toLowerCase().includes(q);
				const matchesRoom = leave.roomNumber?.toLowerCase().includes(q);
				const matchesReason = leave.reason?.toLowerCase().includes(q);
				if (!matchesName && !matchesAdmId && !matchesProp && !matchesRoom && !matchesReason) return false;
			}
			if (statusFilter === "currently_on_leave") {
				if (!isCurrentlyActive(leave, today)) return false;
			} else if (statusFilter !== "all" && leave.status !== statusFilter) return false;
			if (propertyFilter !== "all" && leave.propertyName !== propertyFilter) return false;
			return true;
		});
	}, [
		leaves,
		query,
		statusFilter,
		propertyFilter,
		today
	]);
	const pendingCount = leaves.filter((l) => l.status === "pending").length;
	const approvedCount = leaves.filter((l) => l.status === "approved").length;
	const currentlyOnLeaveCount = leaves.filter((l) => isCurrentlyActive(l, today)).length;
	const openReturnCount = leaves.filter((l) => l.hasOpenReturn && l.status === "approved").length;
	const handleOpenReview = (leave, action) => {
		setReviewDialog({
			open: true,
			leave,
			action
		});
		setAdminNotes("");
	};
	const handleConfirmReview = async () => {
		const { leave, action } = reviewDialog;
		if (!leave) return;
		setActionLoading(true);
		try {
			const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "completed";
			const reviewerName = user?.displayName || user?.email || "Admin";
			await updateLeaveRequestStatus(leave.id, newStatus, adminNotes.trim(), reviewerName);
			queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
			toast.success(action === "approve" ? "Leave request approved!" : action === "reject" ? "Leave request rejected." : "Leave marked as completed / returned.");
			setReviewDialog({
				open: false,
				leave: null,
				action: "approve"
			});
		} catch (err) {
			toast.error(err?.message || "Failed to update leave status.");
		} finally {
			setActionLoading(false);
		}
	};
	const handleOpenReturnModal = (leave) => {
		setReturnDialog({
			open: true,
			leave
		});
		setNewReturnDate(leave.toDate || today);
	};
	const handleSaveReturnDate = async () => {
		const { leave } = returnDialog;
		if (!leave || !newReturnDate) return;
		setSavingReturnDate(true);
		try {
			await updateLeaveReturnDate(leave.id, newReturnDate);
			queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
			toast.success("Return date updated successfully!");
			setReturnDialog({
				open: false,
				leave: null
			});
		} catch (err) {
			toast.error(err?.message || "Failed to update return date.");
		} finally {
			setSavingReturnDate(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Leave Requests",
		subtitle: "Review, approve, and track student hostel leave applications",
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
										className: "text-[11px] font-semibold uppercase tracking-wider text-primary",
										children: "Currently on Leave"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold font-display text-primary mt-1",
										children: currentlyOnLeaveCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Students out today"
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
										children: "Total approved leaves"
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
										children: openReturnCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Approved without end date"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search by student name, admission ID, property, room...",
								className: "pl-9 rounded-xl text-sm"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[170px] rounded-xl text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Statuses" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "rounded-xl text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Requests"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: "pending",
											children: [
												"Pending Approval (",
												pendingCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: "currently_on_leave",
											children: [
												"Currently On Leave (",
												currentlyOnLeaveCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "approved",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "completed",
											children: "Completed / Returned"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "rejected",
											children: "Rejected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "cancelled",
											children: "Cancelled"
										})
									]
								})]
							}), uniqueProperties.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: propertyFilter,
								onValueChange: setPropertyFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[160px] rounded-xl text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Properties" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "rounded-xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Properties"
									}), uniqueProperties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p))]
								})]
							})]
						})]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center p-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
					}) : filteredLeaves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-base text-foreground",
								children: "No leave requests found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-sm mx-auto",
								children: query || statusFilter !== "all" || propertyFilter !== "all" ? "Try adjusting your search criteria or status filters." : "No student leave requests have been submitted yet."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: filteredLeaves.map((leave) => {
							const statusCfg = STATUS_CONFIG[leave.status] || STATUS_CONFIG.pending;
							const StatusIcon = statusCfg.icon;
							const duration = calculateDuration(leave.fromDate, leave.toDate);
							const activeNow = isCurrentlyActive(leave, today);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft hover:border-primary/30 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-base text-foreground font-display",
														children: leave.studentName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-xs font-mono bg-muted/60",
														children: leave.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: `text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: "size-3" }), statusCfg.label]
													}),
													activeNow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-xs bg-primary/15 text-primary border-primary/30 font-semibold",
														children: "Currently Away Today"
													}),
													leave.hasOpenReturn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-xs bg-amber-500/10 text-amber-600 border-amber-500/20",
														children: "Return Date Open (TBD)"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
												children: [
													leave.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 text-primary" }),
															leave.propertyName,
															leave.roomNumber ? ` · Room ${leave.roomNumber}` : "",
															leave.bedNumber ? ` (Bed ${leave.bedNumber})` : ""
														]
													}),
													leave.studentPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 text-primary" }), leave.studentPhone]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground/80",
														children: ["Submitted: ", formatDate(leave.createdAt?.toISOString().slice(0, 10))]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold font-display text-foreground pt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(leave.fromDate) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-muted-foreground" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: leave.toDate ? "text-foreground" : "text-amber-600 italic font-semibold",
														children: leave.toDate ? formatDate(leave.toDate) : "TBD (Return Date to be filled)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted",
														children: duration
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-muted-foreground",
															children: "Reason:"
														}),
														" ",
														leave.reason || "Not specified"
													]
												}), leave.emergencyContact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-muted-foreground",
															children: "Emergency Contact:"
														}),
														" ",
														leave.emergencyContact
													]
												})]
											}),
											leave.adminNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-muted/60 p-2.5 text-xs text-foreground mt-2 border border-border",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-muted-foreground",
														children: "Admin Note:"
													}),
													" ",
													leave.adminNotes,
													leave.reviewedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground ml-2",
														children: [
															"(",
															leave.reviewedBy,
															")"
														]
													})
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0",
										children: [leave.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => handleOpenReview(leave, "approve"),
											className: "bg-success text-white hover:bg-success/90 rounded-xl text-xs h-8 shadow-soft",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }), "Approve"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleOpenReview(leave, "reject"),
											className: "border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl text-xs h-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5 mr-1" }), "Reject"]
										})] }), leave.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleOpenReturnModal(leave),
											className: "text-xs rounded-xl h-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 mr-1 text-primary" }), leave.toDate ? "Change Return Date" : "Set Return Date"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleOpenReview(leave, "complete"),
											className: "text-xs rounded-xl h-8 border-success/30 text-success hover:bg-success/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-3.5 mr-1" }), "Mark Returned"]
										})] })]
									})]
								})
							}, leave.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: reviewDialog.open,
				onOpenChange: (open) => !open && setReviewDialog({
					open: false,
					leave: null,
					action: "approve"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg",
						children: reviewDialog.action === "approve" ? "Approve Leave Request" : reviewDialog.action === "reject" ? "Reject Leave Request" : "Mark Leave as Returned / Completed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							reviewDialog.leave?.studentName,
							" (",
							reviewDialog.leave?.admissionId,
							") · ",
							reviewDialog.leave?.propertyName
						]
					})] }), reviewDialog.leave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/60 p-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-muted-foreground",
										children: "Leave Duration:"
									}),
									" ",
									formatDate(reviewDialog.leave.fromDate),
									" →",
									" ",
									reviewDialog.leave.toDate ? formatDate(reviewDialog.leave.toDate) : "Open Return (TBD)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-muted-foreground",
										children: "Reason:"
									}),
									" ",
									reviewDialog.leave.reason
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "adminNotes",
									className: "text-xs font-semibold",
									children: reviewDialog.action === "reject" ? "Reason for Rejection *" : "Remarks / Admin Note (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "adminNotes",
									rows: 3,
									placeholder: reviewDialog.action === "reject" ? "Explain why the leave request is rejected..." : "Optional remarks for the student records...",
									value: adminNotes,
									onChange: (e) => setAdminNotes(e.target.value),
									className: "rounded-xl text-xs resize-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setReviewDialog({
										open: false,
										leave: null,
										action: "approve"
									}),
									className: "rounded-xl text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: actionLoading || reviewDialog.action === "reject" && !adminNotes.trim(),
									onClick: handleConfirmReview,
									className: `rounded-xl text-xs font-semibold ${reviewDialog.action === "approve" ? "bg-success text-white hover:bg-success/90" : reviewDialog.action === "reject" ? "bg-destructive text-white hover:bg-destructive/90" : "gradient-brand text-white shadow-soft"}`,
									children: [actionLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), reviewDialog.action === "approve" ? "Confirm Approval" : reviewDialog.action === "reject" ? "Confirm Rejection" : "Confirm Return"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: returnDialog.open,
				onOpenChange: (open) => !open && setReturnDialog({
					open: false,
					leave: null
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg",
						children: "Update Student Return Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Record the student's return date for ",
							returnDialog.leave?.studentName,
							"."
						]
					})] }), returnDialog.leave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "adminReturnDate",
								className: "text-xs font-semibold",
								children: ["Return Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adminReturnDate",
								type: "date",
								required: true,
								min: returnDialog.leave.fromDate,
								value: newReturnDate,
								onChange: (e) => setNewReturnDate(e.target.value),
								className: "rounded-xl text-sm"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setReturnDialog({
									open: false,
									leave: null
								}),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: savingReturnDate || !newReturnDate,
								onClick: handleSaveReturnDate,
								className: "gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold",
								children: [savingReturnDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), "Save Return Date"]
							})]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminLeavesPage as component };
