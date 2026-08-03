import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as isFirebaseConfigured } from "./auth-yKdBkDzp.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Trash2, k as ArrowLeft, m as Pencil } from "../_libs/lucide-react.mjs";
import { a as Skeleton, n as Button, o as buttonVariants, s as cn, t as AdminShell } from "./admin-shell-q_SH2sYS.mjs";
import { a as fetchAdmission, i as deleteAdmission } from "./db-CtvUGKRP.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatDate, r as formatINR } from "./format-Bg5w10xg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./stat-card-CICCBvWu.mjs";
import { t as Route } from "./admin.admissions._admissionId.index-C6bTmobl.mjs";
import { i as StatusPill, n as PaymentBadge, r as ProfileAvatar, t as MattressBadge } from "./badges-CB69Mx94.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.index-DjiVZGGS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4 border-b border-border/70 py-2.5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-muted-foreground shrink-0",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right text-sm font-medium break-words",
			children: value || "—"
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-base font-bold mb-3",
			children: title
		}), children]
	});
}
function AdmissionDetailPage() {
	const { admissionId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const { data, isLoading } = useQuery({
		queryKey: ["admission", admissionId],
		queryFn: () => fetchAdmission(admissionId),
		enabled: isFirebaseConfigured
	});
	async function handleDelete() {
		if (!data) return;
		setDeleting(true);
		try {
			await deleteAdmission(data.id);
			await queryClient.invalidateQueries({ queryKey: ["admissions"] });
			toast.success("Admission deleted successfully.");
			navigate({
				to: "/admin/admissions",
				replace: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to delete admission.");
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: data?.fullName ?? "Admission Details",
		subtitle: admissionId,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/admissions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
				})
			}), data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/admissions/$admissionId/edit",
					params: { admissionId },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "destructive",
					size: "sm",
					disabled: deleting,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this admission?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"This will permanently remove ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.fullName }),
				" (",
				data.admissionId,
				") from the system. This action cannot be undone."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: handleDelete,
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Yes, Delete"
			})] })] })] })] })]
		}),
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-52 rounded-2xl" }, i))
		}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Admission not found",
			description: "This admission ID doesn't exist or has been removed.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/admissions",
					children: "Back to admissions"
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "gradient-brand flex items-center gap-5 rounded-2xl p-6 text-primary-foreground shadow-lift lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
						path: data.profileImagePath,
						name: data.fullName,
						className: "size-24 shrink-0 ring-2 ring-white/40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-bold leading-tight",
								children: data.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm opacity-90 mt-0.5",
								children: data.admissionId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-90",
								children: [
									data.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📞 ", data.phoneNumber] }),
									data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["✉️ ", data.email] }),
									data.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["👤 ", data.gender] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: data.paymentStatus })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "👤 Personal Details",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Full Name",
							value: data.fullName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone Number",
							value: data.phoneNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: data.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Gender",
							value: data.gender
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Date of Birth",
							value: formatDate(data.dateOfBirth)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "🎓 College Details",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "College",
							value: data.collegeName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Course",
							value: data.course
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Year",
							value: data.year
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "🏠 Stay Details",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Property / PG",
							value: data.propertyName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Room Number",
							value: data.roomNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Bed Number",
							value: data.bedNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Admission Date",
							value: formatDate(data.admissionDate)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Move-in Date",
							value: formatDate(data.moveInDate)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "📦 Package Allotted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Package Name",
							value: data.packageName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Services Included",
							value: data.packageServices.length ? data.packageServices.join(", ") : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Package Start",
							value: formatDate(data.packageStartDate)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Package End",
							value: formatDate(data.packageEndDate)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "💰 Payment Details",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Total Package Amount",
							value: formatINR(data.packageAmount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Amount Paid",
							value: formatINR(data.amountPaid)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Balance Due",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: data.balanceAmount > 0 ? "text-destructive font-bold" : "text-success font-bold",
								children: formatINR(data.balanceAmount)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Payment Status",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: data.paymentStatus })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "🎒 Provided Items",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 mt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								ok: data.bagProvided,
								okLabel: "Bag Provided",
								pendingLabel: "Bag Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								ok: data.tiffinProvided,
								okLabel: "Tiffin Provided",
								pendingLabel: "Tiffin Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MattressBadge, { required: data.mattressRequired })
						]
					})
				}),
				data.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "📝 Additional Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap",
						children: data.notes
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "🕐 Record Info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Created",
						value: data.createdAt ? formatDate(data.createdAt.toISOString()) : "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Last Updated",
						value: data.updatedAt ? formatDate(data.updatedAt.toISOString()) : "—"
					})]
				})
			]
		})
	});
}
//#endregion
export { AdmissionDetailPage as component };
