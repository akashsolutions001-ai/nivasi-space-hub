import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-D19cUah4.mjs";
import { B as LoaderCircle, pt as BookOpen } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.login-C9zPngFl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoogleIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		width: "18",
		height: "18",
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
			})
		]
	});
}
function StudentLoginPage() {
	const { session, loading, loginStudent, loginStudentWithGoogle, logoutStudent } = useStudentAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [googleSubmitting, setGoogleSubmitting] = (0, import_react.useState)(false);
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
	async function handleGoogleLogin() {
		setGoogleSubmitting(true);
		try {
			await loginStudentWithGoogle();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google sign in failed. Please try again.");
		} finally {
			setGoogleSubmitting(false);
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
		className: "flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: handleGoogleLogin,
							disabled: googleSubmitting || submitting,
							className: "w-full h-11 gap-2.5 font-semibold text-sm border-border hover:bg-muted",
							children: [googleSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), "Continue with Google"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-card px-2 text-[11px] uppercase tracking-wider text-muted-foreground absolute font-medium",
								children: "or with password"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleLogin,
							className: "space-y-4 pt-1",
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
									className: "w-full h-10 font-semibold",
									disabled: submitting || googleSubmitting,
									children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Sign In with Password"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "Password = Parent / Guardian Contact Number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px]",
						children: "If your admission was created with Google, you can sign in directly using \"Continue with Google\"."
					})]
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
