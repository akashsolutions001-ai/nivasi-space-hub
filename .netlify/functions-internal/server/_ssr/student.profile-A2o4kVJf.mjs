import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Lt as useProfileUpdateRequestsForStudent, s as cancelProfileUpdateRequest, y as createProfileUpdateRequest } from "./hooks-LYI2QAXV.mjs";
import { r as useStudentAuth } from "./studentAuth-D19cUah4.mjs";
import { H as LoaderCircle, J as GraduationCap, K as House, M as Phone, P as Pencil, S as ShieldAlert, W as Info, at as CircleCheck, c as User, it as CircleX, nt as Clock, s as Users, z as Mail } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2nICxKuJ.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { n as formatDate } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
import { t as StudentShell } from "./student-shell-li9FEt_l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.profile-A2o4kVJf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELD_LABELS = {
	fullName: "Full Name",
	phoneNumber: "Student Phone Number",
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
function StudentProfilePage() {
	const { session, admission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: updateRequests = [], isLoading: reqLoading } = useProfileUpdateRequestsForStudent(admission?.id ?? null);
	const [editDialogOpen, setEditDialogOpen] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phoneNumber, setPhoneNumber] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [dateOfBirth, setDateOfBirth] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [parentName, setParentName] = (0, import_react.useState)("");
	const [parentPhone, setParentPhone] = (0, import_react.useState)("");
	const [parentRelation, setParentRelation] = (0, import_react.useState)("");
	const [collegeName, setCollegeName] = (0, import_react.useState)("");
	const [course, setCourse] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)("");
	const [mealPreference, setMealPreference] = (0, import_react.useState)("veg");
	const [updateReason, setUpdateReason] = (0, import_react.useState)("");
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
	const openEditModal = () => {
		if (!admission) return;
		setFullName(admission.fullName || "");
		setPhoneNumber(admission.phoneNumber || "");
		setEmail(admission.email || session?.email || "");
		setDateOfBirth(admission.dateOfBirth || "");
		setGender(admission.gender || "");
		setAddress(admission.address || "");
		setParentName(admission.parentName || "");
		setParentPhone(admission.parentPhone || "");
		setParentRelation(admission.parentRelation || "");
		setCollegeName(admission.collegeName || "");
		setCourse(admission.course || "");
		setYear(admission.year || "");
		setMealPreference(admission.mealPreference === "non-veg" ? "non-veg" : "veg");
		setUpdateReason("");
		setEditDialogOpen(true);
	};
	const handleCreateRequest = async (e) => {
		e.preventDefault();
		if (!admission) return;
		const proposed = {
			fullName: fullName.trim(),
			phoneNumber: phoneNumber.trim(),
			email: email.trim(),
			dateOfBirth: dateOfBirth.trim(),
			gender: gender.trim(),
			address: address.trim(),
			parentName: parentName.trim(),
			parentPhone: parentPhone.trim(),
			parentRelation: parentRelation.trim(),
			collegeName: collegeName.trim(),
			course: course.trim(),
			year: year.trim(),
			mealPreference
		};
		const currentData = {};
		const requestedData = {};
		const changedFields = [];
		for (const [key, val] of Object.entries(proposed)) {
			const origVal = admission[key] ?? "";
			if (String(val).trim() !== String(origVal).trim()) {
				changedFields.push(key);
				currentData[key] = origVal;
				requestedData[key] = val;
			}
		}
		if (changedFields.length === 0) {
			toast.info("No profile changes detected.");
			return;
		}
		setSubmitting(true);
		try {
			await createProfileUpdateRequest({
				studentId: admission.id,
				admissionId: admission.admissionId,
				studentName: admission.fullName,
				studentEmail: admission.email || session?.email || "",
				propertyName: admission.propertyName,
				roomNumber: admission.roomNumber,
				currentData,
				requestedData,
				changedFields,
				reason: updateReason.trim(),
				status: "pending"
			});
			queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
			toast.success("Profile update request submitted! Awaiting administrator approval.");
			setEditDialogOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to submit profile update request.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleCancelRequest = async (requestId) => {
		if (!confirm("Are you sure you want to cancel this pending update request?")) return;
		try {
			await cancelProfileUpdateRequest(requestId);
			queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
			toast.success("Profile update request cancelled.");
		} catch (err) {
			toast.error(err?.message || "Failed to cancel request.");
		}
	};
	const pendingRequest = updateRequests.find((r) => r.status === "pending");
	const pastRequests = updateRequests.filter((r) => r.status !== "pending");
	if (!admission) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, {
		title: "My Profile",
		icon: User,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center p-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentShell, {
		title: "My Profile",
		subtitle: "View your complete hostel admission records and submit profile updates for admin confirmation",
		icon: User,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: openEditModal,
			disabled: Boolean(pendingRequest),
			className: "gradient-brand text-white shadow-soft font-semibold text-xs sm:text-sm gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), pendingRequest ? "Update Pending Approval" : "Request Profile Update"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 sm:space-y-6 max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openEditModal,
						disabled: Boolean(pendingRequest),
						className: "w-full gradient-brand text-white shadow-soft font-semibold text-sm gap-2 h-11 rounded-xl active:scale-[0.98] transition-transform",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), pendingRequest ? "Profile Update Pending Approval" : "Request Profile Update"]
					})
				}),
				pendingRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-warning/40 bg-warning/10 p-4 sm:p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-warning shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm sm:text-base text-foreground",
									children: "Profile Update Request Pending Admin Approval"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: [
										"You submitted changes on ",
										formatDate(pendingRequest.createdAt?.toISOString().slice(0, 10)),
										". They will be applied to your admission record once verified by the administrator."
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleCancelRequest(pendingRequest.id),
								className: "text-xs rounded-xl border-warning/40 text-foreground hover:bg-warning/20 shrink-0 self-start",
								children: "Cancel Request"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 hidden sm:block rounded-xl border border-warning/30 bg-background/80 overflow-hidden text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 bg-muted/60 px-3 py-2 font-semibold text-muted-foreground border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Field" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Value" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Requested Value" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border",
								children: pendingRequest.changedFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 px-3 py-2 items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: FIELD_LABELS[field] || field
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground truncate pr-2",
											children: String(pendingRequest.currentData?.[field] || "—")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary truncate pr-2",
											children: String(pendingRequest.requestedData?.[field] || "—")
										})
									]
								}, field))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3.5 space-y-2 sm:hidden text-xs",
							children: pendingRequest.changedFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-warning/30 bg-background/90 p-3 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground text-xs block",
									children: FIELD_LABELS[field] || field
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground line-through truncate max-w-[45%]",
										children: String(pendingRequest.currentData?.[field] || "—")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-lg truncate max-w-[50%]",
										children: String(pendingRequest.requestedData?.[field] || "—")
									})]
								})]
							}, field))
						}),
						pendingRequest.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2.5 text-xs text-muted-foreground italic",
							children: [
								"Reason given: \"",
								pendingRequest.reason,
								"\""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-20 rounded-2xl gradient-brand text-white flex items-center justify-center font-display text-2xl font-bold shadow-soft shrink-0",
							children: admission.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "ST"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl sm:text-2xl font-bold font-display text-foreground",
										children: admission.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "bg-primary/10 text-primary border-primary/20 text-xs font-mono",
										children: admission.admissionId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "bg-success/10 text-success border-success/30 text-xs",
										children: "Active Student"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5 text-primary" }), admission.email || "No email on file"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 text-primary" }), admission.phoneNumber || "No phone on file"]
									}),
									admission.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 capitalize",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 text-primary" }), admission.gender]
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pb-2 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Personal & Contact Info"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.fullName
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Contact Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.phoneNumber || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.email || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Date of Birth"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.dateOfBirth ? formatDate(admission.dateOfBirth) : "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold capitalize",
											children: admission.gender || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium block",
											children: "Permanent Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-foreground font-semibold mt-0.5 leading-relaxed",
											children: admission.address || "No address specified"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pb-2 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Parent / Guardian Details"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Guardian Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.parentName || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Relationship"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold capitalize",
											children: admission.parentRelation || "Parent"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Guardian Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.parentPhone || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-brand-soft/60 p-3 text-[11px] text-muted-foreground space-y-1 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5 text-primary" }), "Student Portal Login Note:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your parent/guardian phone number is also configured as your student portal account password. Updating it will keep hostel contact records accurate." })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pb-2 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Academic Information"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "College Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold text-right max-w-[60%]",
											children: admission.collegeName || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Course / Branch"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.course || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Academic Year"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.year || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Admission Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.admissionDate ? formatDate(admission.admissionDate) : "—"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pb-2 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Accommodation & Services"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Hostel Property"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.propertyName || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Room & Bed"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-foreground font-semibold",
											children: [admission.roomNumber ? `Room ${admission.roomNumber}` : "—", admission.bedNumber ? ` · Bed ${admission.bedNumber}` : ""]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Package Plan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: admission.packageName || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-medium",
											children: "Meal Preference"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold capitalize",
											children: admission.mealPreference || "Veg"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-medium block pb-1",
										children: "Included Services"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: admission.packageServices && admission.packageServices.length > 0 ? admission.packageServices.map((svc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] bg-muted/60 border-border",
											children: svc
										}, svc)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Standard Package Services"
										})
									})] })
								]
							})]
						})
					]
				}),
				pastRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-foreground",
						children: "Profile Update History"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: pastRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-soft text-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [req.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "bg-success/15 text-success border-success/30 text-xs gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Approved"]
										}) : req.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "bg-destructive/15 text-destructive border-destructive/30 text-xs gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }), "Rejected"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "bg-muted text-muted-foreground text-xs",
											children: req.status
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["Submitted ", formatDate(req.createdAt?.toISOString().slice(0, 10))]
										})]
									}), req.reviewedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: ["Reviewed ", formatDate(req.reviewedAt.toISOString().slice(0, 10))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Fields updated:"
									}), req.changedFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md",
										children: FIELD_LABELS[f] || f
									}, f))]
								}),
								req.adminNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "rounded-xl bg-muted/50 p-2 text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-muted-foreground",
											children: "Admin Feedback:"
										}),
										" ",
										req.adminNotes
									]
								})
							]
						}, req.id))
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: editDialogOpen,
			onOpenChange: setEditDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl w-[calc(100vw-1.5rem)] max-h-[88vh] overflow-y-auto rounded-2xl p-4 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg",
						children: "Request Profile Update"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Submit changes to your admission details. To safeguard official records, changes will be sent to the administrator for review before taking effect."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-brand-soft/70 border border-brand-soft p-3 flex items-start gap-2.5 text-xs text-brand-dark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your requested updates will not directly change your profile until confirmed and approved by your hostel administrator." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateRequest,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "fullName",
											className: "text-xs font-semibold",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "fullName",
											required: true,
											value: fullName,
											onChange: (e) => setFullName(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "phoneNumber",
											className: "text-xs font-semibold",
											children: "Student Phone Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "phoneNumber",
											required: true,
											type: "tel",
											value: phoneNumber,
											onChange: (e) => setPhoneNumber(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "email",
											className: "text-xs font-semibold",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "email",
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "dob",
											className: "text-xs font-semibold",
											children: "Date of Birth"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "dob",
											type: "date",
											value: dateOfBirth,
											onChange: (e) => setDateOfBirth(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "gender",
											className: "text-xs font-semibold",
											children: "Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: gender,
											onValueChange: setGender,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "gender",
												className: "rounded-xl text-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select gender" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
												className: "rounded-xl",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Male",
														children: "Male"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Female",
														children: "Female"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Other",
														children: "Other"
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "mealPref",
											className: "text-xs font-semibold",
											children: "Meal Preference"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: mealPreference,
											onValueChange: (val) => setMealPreference(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "mealPref",
												className: "rounded-xl text-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Meal preference" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
												className: "rounded-xl",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "veg",
													children: "Vegetarian"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "non-veg",
													children: "Non-Vegetarian"
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "parentName",
											className: "text-xs font-semibold",
											children: "Parent / Guardian Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "parentName",
											value: parentName,
											onChange: (e) => setParentName(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "parentPhone",
											className: "text-xs font-semibold",
											children: "Parent / Guardian Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "parentPhone",
											type: "tel",
											value: parentPhone,
											onChange: (e) => setParentPhone(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "parentRel",
											className: "text-xs font-semibold",
											children: "Parent Relationship"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "parentRel",
											placeholder: "Father / Mother / Guardian",
											value: parentRelation,
											onChange: (e) => setParentRelation(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "college",
											className: "text-xs font-semibold",
											children: "College Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "college",
											value: collegeName,
											onChange: (e) => setCollegeName(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "course",
											className: "text-xs font-semibold",
											children: "Course / Branch"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "course",
											placeholder: "e.g. B.Tech Computer Engineering",
											value: course,
											onChange: (e) => setCourse(e.target.value),
											className: "rounded-xl text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "year",
											className: "text-xs font-semibold",
											children: "Year of Study"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "year",
											placeholder: "e.g. 1st Year, 2nd Year",
											value: year,
											onChange: (e) => setYear(e.target.value),
											className: "rounded-xl text-sm"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "address",
									className: "text-xs font-semibold",
									children: "Permanent Residential Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "address",
									rows: 2,
									value: address,
									onChange: (e) => setAddress(e.target.value),
									className: "rounded-xl text-sm resize-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "reason",
									className: "text-xs font-semibold",
									children: "Reason for Update (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "reason",
									rows: 2,
									placeholder: "Why are you requesting this update? (e.g. Changed contact number, typo in name)",
									value: updateReason,
									onChange: (e) => setUpdateReason(e.target.value),
									className: "rounded-xl text-sm resize-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setEditDialogOpen(false),
									className: "rounded-xl text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: submitting,
									className: "gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold",
									children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }), "Submit Request for Admin Approval"]
								})]
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { StudentProfilePage as component };
