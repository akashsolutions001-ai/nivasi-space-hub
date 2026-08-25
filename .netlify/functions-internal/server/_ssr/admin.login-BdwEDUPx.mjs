import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as useAuth } from "./auth-DbpSDgTm.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as NivasiLogo, m as SetupNotice, n as Button } from "./admin-shell-Di_RTl8C.mjs";
import { t as Input } from "./input-CC5v3XE9.mjs";
import { t as Label } from "./label-CciR_X34.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-BdwEDUPx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { login, user, loading, configured } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: "/admin/dashboard",
			replace: true
		});
	}, [
		loading,
		user,
		navigate
	]);
	if (!configured) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupNotice, {});
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!email.trim() || !password) {
			setError("Please enter your email and password.");
			return;
		}
		setSubmitting(true);
		try {
			await login(email, password);
			navigate({
				to: "/admin/dashboard",
				replace: true
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to sign in.");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-[1.05fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "gradient-brand relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, { compact: true }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-4xl leading-tight font-extrabold",
							children: [
								"Every admission,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"beautifully organised."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm/6 text-primary-foreground/85",
							children: "Record student details, assign packages, track payments and provided items — all from one warm, fast admin workspace built for the NivasiSpace team."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 space-y-2 text-sm text-primary-foreground/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Unique NS-ADM admission IDs" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Live payment and item tracking" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Secure staff-only access" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-primary-foreground/70",
					children: "NivasiSpace · Internal use only"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center bg-background px-5 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-8 font-display text-2xl font-bold lg:mt-0",
						children: "Staff Sign In"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Use the credentials issued by your administrator."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									className: "text-xs font-semibold",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "admin@nivasispace.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									className: "text-xs font-semibold",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: "current-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••"
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: submitting,
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Signing in…"] }) : "Sign In"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: "Accounts are created by your administrator. Self sign-up is disabled."
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
