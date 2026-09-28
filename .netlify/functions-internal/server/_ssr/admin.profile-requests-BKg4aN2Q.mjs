import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-C-wItvgy.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { L as rejectProfileUpdateRequest, ht as useAllProfileUpdateRequests, r as approveProfileUpdateRequest } from "./hooks-D7EEodvy.mjs";
import { B as Mail, E as Search, Et as ArrowRight, U as LoaderCircle, d as UserCheck, ht as Check, it as Clock, lt as CircleAlert, n as X, ot as CircleX, q as House, st as CircleCheck } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as AdminShell } from "./admin-shell-Ckhlq4Fy.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as formatDate } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.profile-requests-BKg4aN2Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELD_LABELS = {
	fullName: "Full Name",
	phoneNumber: "Student Phone",
	email: "Email Address",
	dateOfBirth: "Date of Birth",
	gender: "Gender",
	address: "Permanent Address",
	parentName: "Parent / Guardian Name",
	parentPhone: "Parent / Guardian Phone",
	parentRelation: "Parent Relationship",
	collegeName: "College Name",
	course: "Course / Branch",
	year: "Academic Year",
	mealPreference: "Meal Preference"
};
var STATUS_CONFIG = {
	pending: {
		label: "Pending Review",
		icon: Clock,
		badgeCls: "bg-warning/15 text-warning-foreground border-warning/30"
	},
	approved: {
		label: "Approved & Updated",
		icon: CircleCheck,
		badgeCls: "bg-success/15 text-success border-success/30"
	},
	rejected: {
		label: "Rejected",
		icon: CircleX,
		badgeCls: "bg-destructive/15 text-destructive border-destructive/30"
	},
	cancelled: {
		label: "Cancelled by Student",
		icon: CircleAlert,
		badgeCls: "bg-muted text-muted-foreground border-border"
	}
};
function AdminProfileRequestsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: requests = [], isLoading } = useAllProfileUpdateRequests();
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("pending");
	const [reviewDialog, setReviewDialog] = (0, import_react.useState)({
		open: false,
		request: null,
		action: "approve"
	});
	const [adminNotes, setAdminNotes] = (0, import_react.useState)("");
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const filteredRequests = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return requests.filter((req) => {
			if (q) {
				const matchesName = req.studentName?.toLowerCase().includes(q);
				const matchesAdmId = req.admissionId?.toLowerCase().includes(q);
				const matchesProp = req.propertyName?.toLowerCase().includes(q);
				const matchesRoom = req.roomNumber?.toLowerCase().includes(q);
				const matchesField = req.changedFields?.some((f) => (FIELD_LABELS[f] || f).toLowerCase().includes(q));
				if (!matchesName && !matchesAdmId && !matchesProp && !matchesRoom && !matchesField) return false;
			}
			if (statusFilter !== "all" && req.status !== statusFilter) return false;
			return true;
		});
	}, [
		requests,
		query,
		statusFilter
	]);
	const pendingCount = requests.filter((r) => r.status === "pending").length;
	const approvedCount = requests.filter((r) => r.status === "approved").length;
	const rejectedCount = requests.filter((r) => r.status === "rejected").length;
	const handleOpenReview = (request, action) => {
		setReviewDialog({
			open: true,
			request,
			action
		});
		setAdminNotes("");
	};
	const handleConfirmReview = async () => {
		const { request, action } = reviewDialog;
		if (!request) return;
		setActionLoading(true);
		try {
			const adminName = user?.displayName || user?.email || "Admin";
			if (action === "approve") {
				await approveProfileUpdateRequest(request.id, request.studentId, request.requestedData, adminName, adminNotes.trim() || void 0);
				toast.success("Profile update approved! Student admission record has been updated.");
			} else {
				await rejectProfileUpdateRequest(request.id, adminName, adminNotes.trim() || void 0);
				toast.success("Profile update request rejected.");
			}
			queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
			queryClient.invalidateQueries({ queryKey: ["admissions"] });
			setReviewDialog({
				open: false,
				request: null,
				action: "approve"
			});
		} catch (err) {
			toast.error(err?.message || "Failed to process profile update request.");
		} finally {
			setActionLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Profile Requests",
		subtitle: "Review and confirm student profile update requests before changes apply to admission records",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									children: "Pending Review"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold font-display text-warning mt-1",
									children: pendingCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Awaiting confirmation"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-success",
									children: "Approved Updates"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold font-display text-success mt-1",
									children: approvedCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Applied to admissions"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-destructive",
									children: "Rejected"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold font-display text-destructive mt-1",
									children: rejectedCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Declined requests"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Total Requests"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold font-display text-foreground mt-1",
									children: requests.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "All time submissions"
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
							placeholder: "Search by student, admission ID, property, field...",
							className: "pl-9 rounded-xl text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: setStatusFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px] rounded-xl text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status filter" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-xl text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: "pending",
										children: [
											"Pending Review (",
											pendingCount,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: "all",
										children: [
											"All Requests (",
											requests.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: "approved",
										children: [
											"Approved (",
											approvedCount,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: "rejected",
										children: [
											"Rejected (",
											rejectedCount,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cancelled",
										children: "Cancelled"
									})
								]
							})]
						})
					})]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center p-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
				}) : filteredRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-base text-foreground",
							children: "No profile update requests found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground max-w-sm mx-auto",
							children: query || statusFilter !== "all" ? "No requests match the selected search or status filters." : "No student profile update requests have been submitted yet."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: filteredRequests.map((req) => {
						const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
						const StatusIcon = statusCfg.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary/30 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col lg:flex-row lg:items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-base text-foreground font-display",
														children: req.studentName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-xs font-mono bg-muted/60",
														children: req.admissionId
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: `text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: "size-3" }), statusCfg.label]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
												children: [
													req.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 text-primary" }),
															req.propertyName,
															req.roomNumber ? ` · Room ${req.roomNumber}` : ""
														]
													}),
													req.studentEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5 text-primary" }), req.studentEmail]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Submitted: ", formatDate(req.createdAt?.toISOString().slice(0, 10))] })
												]
											}),
											req.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-foreground italic pt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-muted-foreground not-italic",
														children: "Student Remark:"
													}),
													" ",
													"\"",
													req.reason,
													"\""
												]
											})
										]
									}), req.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 pt-2 lg:pt-0 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => handleOpenReview(req, "approve"),
											className: "bg-success text-white hover:bg-success/90 rounded-xl text-xs h-8 shadow-soft",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }), "Approve & Update"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleOpenReview(req, "reject"),
											className: "border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl text-xs h-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5 mr-1" }), "Reject"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-xl border border-border bg-muted/30 overflow-hidden text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 bg-muted/70 px-4 py-2 font-semibold text-muted-foreground border-b border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Field Requested to Change" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Official Record" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proposed New Value" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "divide-y divide-border",
										children: req.changedFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-3 px-4 py-2.5 items-center gap-1 sm:gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: FIELD_LABELS[field] || field
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground truncate",
													children: String(req.currentData?.[field] || "—")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 font-bold text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3 text-muted-foreground hidden sm:inline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "bg-primary/10 px-2 py-0.5 rounded text-primary",
														children: String(req.requestedData?.[field] || "—")
													})]
												})
											]
										}, field))
									})]
								}),
								req.adminNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 rounded-xl bg-muted/60 p-2.5 text-xs text-foreground border border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-muted-foreground",
											children: "Admin Feedback:"
										}),
										" ",
										req.adminNotes,
										req.reviewedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground ml-2",
											children: [
												"(Reviewed by ",
												req.reviewedBy,
												" on ",
												formatDate(req.reviewedAt?.toISOString().slice(0, 10)),
												")"
											]
										})
									]
								})
							]
						}, req.id);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: reviewDialog.open,
			onOpenChange: (open) => !open && setReviewDialog({
				open: false,
				request: null,
				action: "approve"
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-lg",
					children: reviewDialog.action === "approve" ? "Approve Profile Update" : "Reject Profile Update"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: [
						reviewDialog.request?.studentName,
						" (",
						reviewDialog.request?.admissionId,
						")"
					]
				})] }), reviewDialog.request && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-2 text-xs",
					children: [
						reviewDialog.action === "approve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-success/10 border border-success/30 p-3 text-success space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Confirm profile update:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-foreground",
								children: [
									"Approving will automatically update the student's admission record with all requested changes (",
									reviewDialog.request.changedFields.map((f) => FIELD_LABELS[f] || f).join(", "),
									")."
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-destructive space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Reject profile update:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-foreground",
								children: "The requested changes will be declined and will not affect the official admission record."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reqAdminNotes",
								className: "text-xs font-semibold",
								children: reviewDialog.action === "reject" ? "Reason for Rejection *" : "Admin Remarks (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "reqAdminNotes",
								rows: 3,
								placeholder: reviewDialog.action === "reject" ? "Explain why the changes were rejected..." : "Optional note for records...",
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
									request: null,
									action: "approve"
								}),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: actionLoading || reviewDialog.action === "reject" && !adminNotes.trim(),
								onClick: handleConfirmReview,
								className: `rounded-xl text-xs font-semibold ${reviewDialog.action === "approve" ? "bg-success text-white hover:bg-success/90" : "bg-destructive text-white hover:bg-destructive/90"}`,
								children: [actionLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), reviewDialog.action === "approve" ? "Confirm & Apply Changes" : "Confirm Rejection"]
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { AdminProfileRequestsPage as component };
