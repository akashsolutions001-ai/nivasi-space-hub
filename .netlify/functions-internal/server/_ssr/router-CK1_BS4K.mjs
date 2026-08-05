import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AuthProvider } from "./auth-DEsgdPor.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$8 } from "./admin.admissions._admissionId.edit-CXOIW4WH.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$9 } from "./admin.admissions._admissionId.index-Di72Kid3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CK1_BS4K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DQtmQzJb.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/dashboard",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go to dashboard"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back to the dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/admin/dashboard",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Dashboard"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
			},
			{ title: "NivasiSpace Admission Management" },
			{
				name: "description",
				content: "Internal admission management system for NivasiSpace student accommodation."
			},
			{
				name: "robots",
				content: "noindex, nofollow"
			},
			{
				property: "og:title",
				content: "NivasiSpace Admission Management"
			},
			{
				property: "og:description",
				content: "Internal admission management system for NivasiSpace student accommodation."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$6 = () => import("./routes-DTEZEvkE.mjs");
var Route$6 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/admin/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.dashboard-IHqS879k.mjs");
var Route$5 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — NivasiSpace Admin" },
		{
			name: "description",
			content: "Live admission, payment and inventory analytics for NivasiSpace."
		},
		{
			property: "og:title",
			content: "Dashboard — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Live admission, payment and inventory analytics for NivasiSpace."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.login-cLuAeJu_.mjs");
var Route$4 = createFileRoute("/admin/login")({
	head: () => ({ meta: [
		{ title: "Staff Login — NivasiSpace Admin" },
		{
			name: "description",
			content: "Secure staff sign-in for the NivasiSpace admission system."
		},
		{
			property: "og:title",
			content: "Staff Login — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Secure staff sign-in for the NivasiSpace admission system."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.packages-D7nRue_K.mjs");
var Route$3 = createFileRoute("/admin/packages")({
	head: () => ({ meta: [
		{ title: "Packages — NivasiSpace Admin" },
		{
			name: "description",
			content: "Create and manage NivasiSpace stay and service packages."
		},
		{
			property: "og:title",
			content: "Packages — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Create and manage NivasiSpace stay and service packages."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.settings-BN9tEjqp.mjs");
var Route$2 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [
		{ title: "Settings — NivasiSpace Admin" },
		{
			name: "description",
			content: "Manage colleges, properties and workspace defaults."
		},
		{
			property: "og:title",
			content: "Settings — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Manage colleges, properties and workspace defaults."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.admissions.index-C8xPkG9x.mjs");
var Route$1 = createFileRoute("/admin/admissions/")({
	head: () => ({ meta: [
		{ title: "Admissions — NivasiSpace Admin" },
		{
			name: "description",
			content: "Search, filter and manage every NivasiSpace student admission."
		},
		{
			property: "og:title",
			content: "Admissions — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Search, filter and manage every NivasiSpace student admission."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.admissions.new-DNg5X6Zn.mjs");
var Route = createFileRoute("/admin/admissions/new")({
	head: () => ({ meta: [
		{ title: "New Admission — NivasiSpace Admin" },
		{
			name: "description",
			content: "Record a new NivasiSpace student admission end to end."
		},
		{
			property: "og:title",
			content: "New Admission — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Record a new NivasiSpace student admission end to end."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AdminDashboardRoute = Route$5.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => Route$7
});
var AdminLoginRoute = Route$4.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$7
});
var AdminPackagesRoute = Route$3.update({
	id: "/admin/packages",
	path: "/admin/packages",
	getParentRoute: () => Route$7
});
var AdminSettingsRoute = Route$2.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$7
});
var AdminAdmissionsIndexRoute = Route$1.update({
	id: "/admin/admissions/",
	path: "/admin/admissions/",
	getParentRoute: () => Route$7
});
var AdminAdmissionsNewRoute = Route.update({
	id: "/admin/admissions/new",
	path: "/admin/admissions/new",
	getParentRoute: () => Route$7
});
var AdminAdmissionsAdmissionIdIndexRoute = Route$9.update({
	id: "/admin/admissions/$admissionId/",
	path: "/admin/admissions/$admissionId/",
	getParentRoute: () => Route$7
});
var rootRouteChildren = {
	IndexRoute,
	AdminDashboardRoute,
	AdminLoginRoute,
	AdminPackagesRoute,
	AdminSettingsRoute,
	AdminAdmissionsNewRoute,
	AdminAdmissionsIndexRoute,
	AdminAdmissionsAdmissionIdEditRoute: Route$8.update({
		id: "/admin/admissions/$admissionId/edit",
		path: "/admin/admissions/$admissionId/edit",
		getParentRoute: () => Route$7
	}),
	AdminAdmissionsAdmissionIdIndexRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
