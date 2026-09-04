import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route$26 } from "./admin.admissions._admissionId.edit-vLrZTFbs.mjs";
import { t as AuthProvider } from "./auth-D8HbqhQ8.mjs";
import { t as StudentAuthProvider } from "./studentAuth-DGbYVzMP.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$27 } from "./admin.admissions._admissionId.index-DBuSPmZv.mjs";
import { t as Route$28 } from "./admin.laundry._laundryId-B3hd1AvJ.mjs";
import { t as Route$29 } from "./admin.mess._messId-wq5AiFqz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-tQ68rbwQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DuR7-QNm.css";
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
var Route$25 = createRootRouteWithContext()({
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
	const { queryClient } = Route$25.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentAuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] }) })
	});
}
var $$splitComponentImporter$24 = () => import("./routes-DTEZEvkE.mjs");
var Route$24 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/admin/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin.dashboard-BmCyeRkD.mjs");
var Route$23 = createFileRoute("/admin/dashboard")({
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
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.login-DMMmIaDa.mjs");
var Route$22 = createFileRoute("/admin/login")({
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
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.packages-BIXBrNj8.mjs");
var Route$21 = createFileRoute("/admin/packages")({
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
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./admin.payouts-BUTZzPnb.mjs");
var Route$20 = createFileRoute("/admin/payouts")({
	head: () => ({ meta: [{ title: "Payouts — NivasiSpace Admin" }, {
		name: "description",
		content: "Manage all outgoing / debit transactions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin.properties-CUsViqD2.mjs");
var Route$19 = createFileRoute("/admin/properties")({
	head: () => ({ meta: [
		{ title: "Properties — NivasiSpace Admin" },
		{
			name: "description",
			content: "View all properties, occupancy and student details."
		},
		{
			property: "og:title",
			content: "Properties — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "View all properties, occupancy and student details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
/** Extract required student count from note text e.g. "2 Boys Required", "4 GIRLS needed" */
var $$splitComponentImporter$18 = () => import("./admin.settings-BxPaJd9G.mjs");
var Route$18 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [
		{ title: "Settings — NivasiSpace Admin" },
		{
			name: "description",
			content: "Manage colleges, admins and workspace defaults."
		},
		{
			property: "og:title",
			content: "Settings — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Manage colleges, admins and workspace defaults."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
/** Small pause so Firebase doesn't rate-limit the bulk signUp calls. */
var $$splitComponentImporter$17 = () => import("./employee.dashboard-DyWqGW7v.mjs");
var Route$17 = createFileRoute("/employee/dashboard")({
	head: () => ({ meta: [{ title: "Delivery Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
/** Build a Google Maps URL by looking up the student's assigned room/property from Firestore */
var $$splitComponentImporter$16 = () => import("./employee.delivery-MCxxnOy2.mjs");
var Route$16 = createFileRoute("/employee/delivery")({
	head: () => ({ meta: [{ title: "Quick Delivery — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./employee.laundry-C1MBCv1y.mjs");
var Route$15 = createFileRoute("/employee/laundry")({
	head: () => ({ meta: [{ title: "Laundry Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./employee.login-BsoFlrvJ.mjs");
var Route$14 = createFileRoute("/employee/login")({
	head: () => ({ meta: [{ title: "Employee Login — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./student.dashboard-DRnzmLZX.mjs");
var Route$13 = createFileRoute("/student/dashboard")({
	head: () => ({ meta: [{ title: "My Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./student.laundry-Dvtd44WD.mjs");
var Route$12 = createFileRoute("/student/laundry")({
	head: () => ({ meta: [{ title: "My Laundry — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./student.login-sTAfk962.mjs");
var Route$11 = createFileRoute("/student/login")({
	head: () => ({ meta: [{ title: "Student Login — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./student.mess-lGsXeYAM.mjs");
var Route$10 = createFileRoute("/student/mess")({
	head: () => ({ meta: [{ title: "My Mess — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.admissions.index-CFnWeC4l.mjs");
var Route$9 = createFileRoute("/admin/admissions/")({
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
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.admissions.new-BlBhcjju.mjs");
var Route$8 = createFileRoute("/admin/admissions/new")({
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
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.laundry.index-EmhUlcGL.mjs");
var Route$7 = createFileRoute("/admin/laundry/")({
	head: () => ({ meta: [{ title: "Laundry Management — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.laundry.assign-CpQkJXWm.mjs");
var Route$6 = createFileRoute("/admin/laundry/assign")({
	head: () => ({ meta: [{ title: "Assign Students to Laundry — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.laundry.employees-kLPUvbAR.mjs");
var Route$5 = createFileRoute("/admin/laundry/employees")({
	head: () => ({ meta: [{ title: "Laundry Employees — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.mess.index-B7llMXpb.mjs");
var Route$4 = createFileRoute("/admin/mess/")({
	head: () => ({ meta: [{ title: "Mess Management — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.mess.assign-D0JLD1gk.mjs");
var Route$3 = createFileRoute("/admin/mess/assign")({
	head: () => ({ meta: [{ title: "Assign Students to Mess — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.mess.employees-B_8SOyRb.mjs");
var Route$2 = createFileRoute("/admin/mess/employees")({
	head: () => ({ meta: [{ title: "Mess Employees — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./employee.laundry.payouts-CYsP2v0j.mjs");
var Route$1 = createFileRoute("/employee/laundry/payouts")({
	head: () => ({ meta: [{ title: "My Laundry Payouts — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./employee.mess.payouts-DeSfMQMc.mjs");
var Route = createFileRoute("/employee/mess/payouts")({
	head: () => ({ meta: [{ title: "My Payouts — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AdminDashboardRoute = Route$23.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => Route$25
});
var AdminLoginRoute = Route$22.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$25
});
var AdminPackagesRoute = Route$21.update({
	id: "/admin/packages",
	path: "/admin/packages",
	getParentRoute: () => Route$25
});
var AdminPayoutsRoute = Route$20.update({
	id: "/admin/payouts",
	path: "/admin/payouts",
	getParentRoute: () => Route$25
});
var AdminPropertiesRoute = Route$19.update({
	id: "/admin/properties",
	path: "/admin/properties",
	getParentRoute: () => Route$25
});
var AdminSettingsRoute = Route$18.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$25
});
var EmployeeDashboardRoute = Route$17.update({
	id: "/employee/dashboard",
	path: "/employee/dashboard",
	getParentRoute: () => Route$25
});
var EmployeeDeliveryRoute = Route$16.update({
	id: "/employee/delivery",
	path: "/employee/delivery",
	getParentRoute: () => Route$25
});
var EmployeeLaundryRoute = Route$15.update({
	id: "/employee/laundry",
	path: "/employee/laundry",
	getParentRoute: () => Route$25
});
var EmployeeLoginRoute = Route$14.update({
	id: "/employee/login",
	path: "/employee/login",
	getParentRoute: () => Route$25
});
var StudentDashboardRoute = Route$13.update({
	id: "/student/dashboard",
	path: "/student/dashboard",
	getParentRoute: () => Route$25
});
var StudentLaundryRoute = Route$12.update({
	id: "/student/laundry",
	path: "/student/laundry",
	getParentRoute: () => Route$25
});
var StudentLoginRoute = Route$11.update({
	id: "/student/login",
	path: "/student/login",
	getParentRoute: () => Route$25
});
var StudentMessRoute = Route$10.update({
	id: "/student/mess",
	path: "/student/mess",
	getParentRoute: () => Route$25
});
var AdminAdmissionsIndexRoute = Route$9.update({
	id: "/admin/admissions/",
	path: "/admin/admissions/",
	getParentRoute: () => Route$25
});
var AdminAdmissionsNewRoute = Route$8.update({
	id: "/admin/admissions/new",
	path: "/admin/admissions/new",
	getParentRoute: () => Route$25
});
var AdminLaundryIndexRoute = Route$7.update({
	id: "/admin/laundry/",
	path: "/admin/laundry/",
	getParentRoute: () => Route$25
});
var AdminLaundryLaundryIdRoute = Route$28.update({
	id: "/admin/laundry/$laundryId",
	path: "/admin/laundry/$laundryId",
	getParentRoute: () => Route$25
});
var AdminLaundryAssignRoute = Route$6.update({
	id: "/admin/laundry/assign",
	path: "/admin/laundry/assign",
	getParentRoute: () => Route$25
});
var AdminLaundryEmployeesRoute = Route$5.update({
	id: "/admin/laundry/employees",
	path: "/admin/laundry/employees",
	getParentRoute: () => Route$25
});
var AdminMessIndexRoute = Route$4.update({
	id: "/admin/mess/",
	path: "/admin/mess/",
	getParentRoute: () => Route$25
});
var AdminMessMessIdRoute = Route$29.update({
	id: "/admin/mess/$messId",
	path: "/admin/mess/$messId",
	getParentRoute: () => Route$25
});
var AdminMessAssignRoute = Route$3.update({
	id: "/admin/mess/assign",
	path: "/admin/mess/assign",
	getParentRoute: () => Route$25
});
var AdminMessEmployeesRoute = Route$2.update({
	id: "/admin/mess/employees",
	path: "/admin/mess/employees",
	getParentRoute: () => Route$25
});
var EmployeeLaundryPayoutsRoute = Route$1.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => EmployeeLaundryRoute
});
var EmployeeMessPayoutsRoute = Route.update({
	id: "/employee/mess/payouts",
	path: "/employee/mess/payouts",
	getParentRoute: () => Route$25
});
var AdminAdmissionsAdmissionIdIndexRoute = Route$27.update({
	id: "/admin/admissions/$admissionId/",
	path: "/admin/admissions/$admissionId/",
	getParentRoute: () => Route$25
});
var AdminAdmissionsAdmissionIdEditRoute = Route$26.update({
	id: "/admin/admissions/$admissionId/edit",
	path: "/admin/admissions/$admissionId/edit",
	getParentRoute: () => Route$25
});
var EmployeeLaundryRouteChildren = { EmployeeLaundryPayoutsRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminDashboardRoute,
	AdminLoginRoute,
	AdminPackagesRoute,
	AdminPayoutsRoute,
	AdminPropertiesRoute,
	AdminSettingsRoute,
	EmployeeDashboardRoute,
	EmployeeDeliveryRoute,
	EmployeeLaundryRoute: EmployeeLaundryRoute._addFileChildren(EmployeeLaundryRouteChildren),
	EmployeeLoginRoute,
	StudentDashboardRoute,
	StudentLaundryRoute,
	StudentLoginRoute,
	StudentMessRoute,
	AdminAdmissionsNewRoute,
	AdminLaundryLaundryIdRoute,
	AdminLaundryAssignRoute,
	AdminLaundryEmployeesRoute,
	AdminMessMessIdRoute,
	AdminMessAssignRoute,
	AdminMessEmployeesRoute,
	EmployeeMessPayoutsRoute,
	AdminAdmissionsIndexRoute,
	AdminLaundryIndexRoute,
	AdminMessIndexRoute,
	AdminAdmissionsAdmissionIdEditRoute,
	AdminAdmissionsAdmissionIdIndexRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
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
