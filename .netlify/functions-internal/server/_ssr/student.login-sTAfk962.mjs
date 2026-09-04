import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-DGbYVzMP.mjs";
import { I as LoaderCircle, ct as BookOpen } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.login-sTAfk962.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentLoginPage() {
	const { session, loading, loginStudent, logoutStudent } = useStudentAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [signingOutForStaff, setSigningOutForStaff] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && session) navigate({
			to: "/student/dashboard",
			replace: true
		});
	}, [
		loading,
		session,
		navigate
	]);
	async function handleLogin(e) {
		e.preventDefault();
		if (!email.trim() || !password.trim()) return;
		setSubmitting(true);
		try {
			await loginStudent(email.trim(), password.trim());
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}
	async function handleGoToStaffLogin() {
		setSigningOutForStaff(true);
		try {
			await logoutStudent();
		} finally {
			setSigningOutForStaff(false);
			navigate({ to: "/admin/login" });
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-14 items-center justify-center rounded-2xl gradient-brand shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-7 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold",
						children: "Student Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "NivasiSpace · Mess, Laundry & Tiffin"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLogin,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "st-email",
									children: "Admission Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "st-email",
									type: "email",
									autoComplete: "email",
									placeholder: "your@email.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "st-password",
									children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 text-[11px] font-normal text-muted-foreground",
										children: "(parent contact number)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "st-password",
									type: "password",
									autoComplete: "current-password",
									inputMode: "numeric",
									placeholder: "e.g. 9876543210",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full",
								disabled: submitting,
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Sign In"]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use the email address from your admission form." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: "Password = Parent / Guardian contact number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px]",
							children: "Example: if your parent's number is 9876543210, use that as your password."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: [
						"Staff?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleGoToStaffLogin,
							disabled: signingOutForStaff,
							className: "font-medium text-foreground underline underline-offset-2 disabled:opacity-50",
							children: signingOutForStaff ? "Signing out…" : "Sign in here"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { StudentLoginPage as component };
