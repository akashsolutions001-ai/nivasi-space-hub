import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { I as LoaderCircle, o as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.login-BsoFlrvJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeLoginPage() {
	const { login, user, userRole, loading } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) {
			if (userRole === "mess_employee") navigate({
				to: "/employee/dashboard",
				replace: true
			});
			else if (userRole === "admin") navigate({
				to: "/admin/dashboard",
				replace: true
			});
		}
	}, [
		loading,
		user,
		userRole,
		navigate
	]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!email.trim() || !password) return;
		setSubmitting(true);
		try {
			await login(email.trim(), password);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
		} finally {
			setSubmitting(false);
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-7 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold",
						children: "Employee Login"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "NivasiSpace Mess & Tiffin Delivery"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									placeholder: "rahul@example.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: "current-password",
									placeholder: "Enter your password",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Employee accounts are created by the administrator. Contact your mess manager if you need access."
				})
			]
		})
	});
}
//#endregion
export { EmployeeLoginPage as component };
