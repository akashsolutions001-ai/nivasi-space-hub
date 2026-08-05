import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as isFirebaseConfigured, o as useIsGlobalAdmin } from "./auth-DEsgdPor.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Eye, M as ArrowLeft, c as Trash2, d as Share2, h as Pencil, u as ShieldAlert, w as EyeOff } from "../_libs/lucide-react.mjs";
import { a as Skeleton, n as Button, o as buttonVariants, s as cn, t as AdminShell } from "./admin-shell-DP6Px5xO.mjs";
import { t as Input } from "./input-BsluoI9p.mjs";
import { t as Label } from "./label-BTiKZXOQ.mjs";
import { a as fetchAdmission, i as deleteAdmission } from "./db-jYdwf0ru.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatDate, r as formatINR } from "./format-Bg5w10xg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./stat-card-DjmB8MfY.mjs";
import { t as Route } from "./admin.admissions._admissionId.index-Di72Kid3.mjs";
import { i as StatusPill, n as PaymentBadge, r as ProfileAvatar, t as MattressBadge } from "./badges-BIwieoDo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.index-6VF5YLzs.js
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
var GLOBAL_EMAIL = "Globaladmin@nivasispace.com";
var GLOBAL_PASSWORD = "16Dec@1980NivasiSpace";
function buildReceiptFromAdmission(a) {
	const balance = Math.max(0, a.balanceAmount);
	const status = a.paymentStatus === "completed" ? "PAID ✅" : "PENDING ⚠️";
	return [
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		"🏠 *NivasiSpace*",
		"   Admission Fee Receipt",
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		`📋 Admission ID : ${a.admissionId}`,
		`📅 Date         : ${a.admissionDate}`,
		"",
		"👤 *Student Details*",
		`   Name    : ${a.fullName}`,
		`   Phone   : ${a.phoneNumber}`,
		...a.email ? [`   Email   : ${a.email}`] : [],
		...a.gender ? [`   Gender  : ${a.gender}`] : [],
		"",
		...a.parentName ? [
			"👨‍👩‍👧 *Parent / Guardian*",
			`   Name     : ${a.parentName}`,
			...a.parentPhone ? [`   Phone    : ${a.parentPhone}`] : [],
			...a.parentRelation ? [`   Relation : ${a.parentRelation}`] : [],
			""
		] : [],
		"🎓 *College*",
		`   ${a.collegeName}`,
		...a.course ? [`   ${a.course}${a.year ? ` — ${a.year}` : ""}`] : [],
		"",
		"🏠 *Stay*",
		`   Property : ${a.propertyName || "—"}`,
		`   Room     : ${a.roomNumber || "—"}`,
		`   Bed      : ${a.bedNumber || "—"}`,
		...a.moveInDate ? [`   Move-in  : ${a.moveInDate}`] : [],
		"",
		"📦 *Package*",
		`   ${a.packageName || "—"}`,
		...a.packageServices.length ? [`   Services : ${a.packageServices.join(", ")}`] : [],
		...a.packageStartDate ? [`   Period   : ${a.packageStartDate} → ${a.packageEndDate || "—"}`] : [],
		"",
		"💰 *Payment Summary*",
		`   Total Amount  : ₹${a.packageAmount.toLocaleString("en-IN")}`,
		`   Amount Paid   : ₹${a.amountPaid.toLocaleString("en-IN")}`,
		`   Balance Due   : ₹${balance.toLocaleString("en-IN")}`,
		`   Status        : ${status}`,
		"",
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		"Thank you for choosing NivasiSpace! 🙏",
		"━━━━━━━━━━━━━━━━━━━━━━━━"
	].join("\n");
}
function ShareReceiptPopover({ admission }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const text = buildReceiptFromAdmission(admission);
	const encoded = encodeURIComponent(text);
	const studentPhone = (admission.phoneNumber ?? "").replace(/\D/g, "");
	const parentPhone = (admission.parentPhone ?? "").replace(/\D/g, "");
	const parentName = admission.parentName ?? "";
	function downloadPDF() {
		import("./receipt-pdf-BbqChljv.mjs").then(({ downloadReceiptPDF }) => downloadReceiptPDF(admission));
		setOpen(false);
	}
	function shareGeneric() {
		if (navigator.share) navigator.share({
			title: `Fee Receipt — ${admission.admissionId}`,
			text
		}).catch(() => {});
		else navigator.clipboard.writeText(text).then(() => toast.success("Receipt copied to clipboard!")).catch(() => toast.error("Could not copy receipt."));
		setOpen(false);
	}
	function openWhatsApp(phone) {
		const num = phone.length === 10 ? `91${phone}` : phone;
		window.open(`https://wa.me/${num}?text=${encoded}`, "_blank");
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Share Receipt"]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-lift space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Share Fee Receipt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90",
					onClick: downloadPDF,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📄" }), " Download Receipt PDF"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
					onClick: shareGeneric,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋" }), " Copy / Share Receipt"]
				}),
				studentPhone.length >= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",
					onClick: () => openWhatsApp(studentPhone),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }), " WhatsApp Student"]
				}),
				parentPhone.length >= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-center gap-2 rounded-xl bg-[#128C7E] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",
					onClick: () => openWhatsApp(parentPhone),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }),
						" WhatsApp Parent",
						parentName ? ` (${parentName.split(" ")[0]})` : ""
					]
				})
			]
		})] })]
	});
}
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
/** Payment section with eye toggle — global admin can hide/show amounts */
function PaymentSection({ data, isGlobalAdmin }) {
	const [show, setShow] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-bold",
				children: "💰 Payment Details"
			}), isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setShow((v) => !v),
				className: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
				"aria-label": show ? "Hide amounts" : "Show amounts",
				children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
			})]
		}), isGlobalAdmin ? show ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground py-2",
			children: "Amounts hidden. Click 👁 to reveal."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
			label: "Payment Status",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: data.paymentStatus })
		})]
	});
}
function DeleteButton({ isGlobalAdmin, deleting, onConfirmedDelete, studentName, admissionId }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [credError, setCredError] = (0, import_react.useState)("");
	function handleGlobalAdminConfirm() {
		if (email.trim().toLowerCase() === GLOBAL_EMAIL.toLowerCase() && password === GLOBAL_PASSWORD) {
			setCredError("");
			onConfirmedDelete();
		} else setCredError("Incorrect Global Admin credentials. Delete not authorised.");
	}
	if (isGlobalAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "destructive",
			size: "sm",
			disabled: deleting,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this admission?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
		"This will permanently remove ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: studentName }),
		" (",
		admissionId,
		") from the system. This action cannot be undone."
	] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: onConfirmedDelete,
		className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
		children: "Yes, Delete"
	})] })] })] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, {
		onOpenChange: (open) => {
			if (!open) {
				setEmail("");
				setPassword("");
				setCredError("");
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "destructive",
				size: "sm",
				disabled: deleting,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-destructive" }), "Global Admin Approval Required"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Deleting ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: studentName }),
				" (",
				admissionId,
				") requires Global Admin authorisation. Enter the Global Admin credentials to proceed."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold",
							children: "Global Admin Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "Globaladmin@nivasispace.com",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold",
							children: "Global Admin Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							autoComplete: "off"
						})]
					}),
					credError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive",
						children: credError
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: handleGlobalAdminConfirm,
				disabled: !email || !password,
				children: "Authorise & Delete"
			})] })
		] })]
	});
}
function AdmissionDetailPage() {
	const { admissionId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isGlobalAdmin = useIsGlobalAdmin();
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
			}), data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareReceiptPopover, { admission: data }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/admissions/$admissionId/edit",
						params: { admissionId },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteButton, {
					isGlobalAdmin,
					deleting,
					onConfirmedDelete: handleDelete,
					studentName: data.fullName,
					admissionId: data.admissionId
				})
			] })]
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
				data.parentName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "👨‍👩‍👧 Parent / Guardian",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Name",
							value: data.parentName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: data.parentPhone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Relation",
							value: data.parentRelation
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentSection, {
					data,
					isGlobalAdmin
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
