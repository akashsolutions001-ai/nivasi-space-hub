import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route$32 } from "./admin.admissions._admissionId.edit-COQQLvzK.mjs";
import { t as AuthProvider } from "./auth-C-wItvgy.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as StudentAuthProvider } from "./studentAuth-D19cUah4.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$33 } from "./admin.admissions._admissionId.index-hUNx-5CY.mjs";
import { t as Route$34 } from "./admin.laundry._laundryId-ugjGtmTe.mjs";
import { t as Route$35 } from "./admin.mess._messId-DxIR8Uw9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B_aZ9mHG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D-qzGbi1.css";
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
var Route$31 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "NivasiSpace" },
			{
				name: "description",
				content: "Admission management, mess, laundry & tiffin — all in one place."
			},
			{
				name: "robots",
				content: "noindex, nofollow"
			},
			{
				name: "theme-color",
				content: "#c2692a"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "NivasiSpace"
			},
			{
				name: "msapplication-TileColor",
				content: "#c2692a"
			},
			{
				name: "msapplication-tap-highlight",
				content: "no"
			},
			{
				name: "format-detection",
				content: "telephone=no"
			},
			{
				property: "og:title",
				content: "NivasiSpace"
			},
			{
				property: "og:description",
				content: "Admission management, mess, laundry & tiffin — all in one place."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: "/icons/icon-512.png"
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
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/apple-touch-icon.png"
			},
			{
				rel: "apple-touch-icon",
				sizes: "192x192",
				href: "/icons/icon-192.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	(0, import_react.useEffect)(() => {
		if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => console.warn("[SW] Registration failed:", err));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$31.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentAuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] }) })
	});
}
var $$splitComponentImporter$30 = () => import("./routes-DTEZEvkE.mjs");
var Route$30 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/admin/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./admin.dashboard-Dl5uj2H4.mjs");
var Route$29 = createFileRoute("/admin/dashboard")({
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
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.leaves-BvWFYjkd.mjs");
var Route$28 = createFileRoute("/admin/leaves")({
	head: () => ({ meta: [{ title: "Leave Requests — NivasiSpace Admin" }, {
		name: "description",
		content: "Review and approve student hostel leave requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./admin.login-pZBmI4lR.mjs");
var Route$27 = createFileRoute("/admin/login")({
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
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./admin.packages-sewy7y3O.mjs");
var Route$26 = createFileRoute("/admin/packages")({
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
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./admin.payouts-BKqgco3J.mjs");
var Route$25 = createFileRoute("/admin/payouts")({
	head: () => ({ meta: [{ title: "Payouts — NivasiSpace Admin" }, {
		name: "description",
		content: "Manage all outgoing / debit transactions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./admin.profile-requests-njFSbtAk.mjs");
var Route$24 = createFileRoute("/admin/profile-requests")({
	head: () => ({ meta: [{ title: "Profile Update Requests — NivasiSpace Admin" }, {
		name: "description",
		content: "Review and approve student profile update requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin.properties-CqhSUiyq.mjs");
var Route$23 = createFileRoute("/admin/properties")({
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
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
/** Extract required student count from note text e.g. "2 Boys Required", "4 GIRLS needed" */
var $$splitComponentImporter$22 = () => import("./admin.reports-Ch6AhRnq.mjs");
var Route$22 = createFileRoute("/admin/reports")({
	head: () => ({ meta: [{ title: "Reports & Analytics — NivasiSpace Admin" }, {
		name: "description",
		content: "Comprehensive system reports for Mess, Laundry, Students, and Financial data."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.settings-C59aQO6P.mjs");
var Route$21 = createFileRoute("/admin/settings")({
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
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
/** Small pause so Firebase doesn't rate-limit the bulk signUp calls. */
var $$splitComponentImporter$20 = () => import("./admin.student-headcount-D24bg23g.mjs");
var Route$20 = createFileRoute("/admin/student-headcount")({
	head: () => ({ meta: [{ title: "Mess Headcount & Attendance — NivasiSpace Admin" }, {
		name: "description",
		content: "Live student attendance, approved leave exclusions, and Veg vs Non-Veg kitchen headcounts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./employee.dashboard-C38DgUxZ.mjs");
var Route$19 = createFileRoute("/employee/dashboard")({
	head: () => ({ meta: [{ title: "Delivery Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
/** Build a Google Maps URL by looking up the student's assigned room/property from Firestore */
var $$splitComponentImporter$18 = () => import("./employee.delivery-BRz76Es9.mjs");
var Route$18 = createFileRoute("/employee/delivery")({
	head: () => ({ meta: [{ title: "Quick Delivery — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./employee.laundry-eIGLBgLe.mjs");
var Route$17 = createFileRoute("/employee/laundry")({
	head: () => ({ meta: [{ title: "Laundry Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./employee.login-fJYrlQj4.mjs");
var Route$16 = createFileRoute("/employee/login")({
	head: () => ({ meta: [{ title: "Employee Login — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./student.dashboard-CconzfMO.mjs");
var Route$15 = createFileRoute("/student/dashboard")({
	head: () => ({ meta: [{ title: "My Dashboard — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./student.laundry-BUH_G2HT.mjs");
var Route$14 = createFileRoute("/student/laundry")({
	head: () => ({ meta: [{ title: "My Laundry — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./student.leaves-tygka32g.mjs");
var Route$13 = createFileRoute("/student/leaves")({
	head: () => ({ meta: [{ title: "My Leave Requests — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./student.login-C9zPngFl.mjs");
var Route$12 = createFileRoute("/student/login")({
	head: () => ({ meta: [{ title: "Student Login — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./student.mess-CHDRjEv5.mjs");
var Route$11 = createFileRoute("/student/mess")({
	head: () => ({ meta: [{ title: "My Mess — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./student.profile-A2o4kVJf.mjs");
var Route$10 = createFileRoute("/student/profile")({
	head: () => ({ meta: [{ title: "My Profile — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.admissions.index-VFnQ1l36.mjs");
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
var $$splitComponentImporter$8 = () => import("./admin.admissions.new-kfq4yXjj.mjs");
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
var $$splitComponentImporter$7 = () => import("./admin.laundry.index-D7GpJ9Q3.mjs");
var Route$7 = createFileRoute("/admin/laundry/")({
	head: () => ({ meta: [{ title: "Laundry Management — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.laundry.assign-BteuCmXJ.mjs");
var Route$6 = createFileRoute("/admin/laundry/assign")({
	head: () => ({ meta: [{ title: "Assign Students to Laundry — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.laundry.employees-c1XN17SN.mjs");
var Route$5 = createFileRoute("/admin/laundry/employees")({
	head: () => ({ meta: [{ title: "Laundry Employees — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.mess.index-CY0jAfon.mjs");
var Route$4 = createFileRoute("/admin/mess/")({
	head: () => ({ meta: [{ title: "Mess Management — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.mess.assign-Bu3C8mTM.mjs");
var Route$3 = createFileRoute("/admin/mess/assign")({
	head: () => ({ meta: [{ title: "Assign Students to Mess — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.mess.employees-rmxmAFvb.mjs");
var Route$2 = createFileRoute("/admin/mess/employees")({
	head: () => ({ meta: [{ title: "Mess Employees — NivasiSpace Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./employee.laundry.payouts-DnN76GDX.mjs");
var Route$1 = createFileRoute("/employee/laundry/payouts")({
	head: () => ({ meta: [{ title: "My Laundry Payouts — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./employee.mess.payouts-D6erggfn.mjs");
var Route = createFileRoute("/employee/mess/payouts")({
	head: () => ({ meta: [{ title: "My Payouts — NivasiSpace" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$30.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$31
});
var AdminDashboardRoute = Route$29.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => Route$31
});
var AdminLeavesRoute = Route$28.update({
	id: "/admin/leaves",
	path: "/admin/leaves",
	getParentRoute: () => Route$31
});
var AdminLoginRoute = Route$27.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$31
});
var AdminPackagesRoute = Route$26.update({
	id: "/admin/packages",
	path: "/admin/packages",
	getParentRoute: () => Route$31
});
var AdminPayoutsRoute = Route$25.update({
	id: "/admin/payouts",
	path: "/admin/payouts",
	getParentRoute: () => Route$31
});
var AdminProfileRequestsRoute = Route$24.update({
	id: "/admin/profile-requests",
	path: "/admin/profile-requests",
	getParentRoute: () => Route$31
});
var AdminPropertiesRoute = Route$23.update({
	id: "/admin/properties",
	path: "/admin/properties",
	getParentRoute: () => Route$31
});
var AdminReportsRoute = Route$22.update({
	id: "/admin/reports",
	path: "/admin/reports",
	getParentRoute: () => Route$31
});
var AdminSettingsRoute = Route$21.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$31
});
var AdminStudentHeadcountRoute = Route$20.update({
	id: "/admin/student-headcount",
	path: "/admin/student-headcount",
	getParentRoute: () => Route$31
});
var EmployeeDashboardRoute = Route$19.update({
	id: "/employee/dashboard",
	path: "/employee/dashboard",
	getParentRoute: () => Route$31
});
var EmployeeDeliveryRoute = Route$18.update({
	id: "/employee/delivery",
	path: "/employee/delivery",
	getParentRoute: () => Route$31
});
var EmployeeLaundryRoute = Route$17.update({
	id: "/employee/laundry",
	path: "/employee/laundry",
	getParentRoute: () => Route$31
});
var EmployeeLoginRoute = Route$16.update({
	id: "/employee/login",
	path: "/employee/login",
	getParentRoute: () => Route$31
});
var StudentDashboardRoute = Route$15.update({
	id: "/student/dashboard",
	path: "/student/dashboard",
	getParentRoute: () => Route$31
});
var StudentLaundryRoute = Route$14.update({
	id: "/student/laundry",
	path: "/student/laundry",
	getParentRoute: () => Route$31
});
var StudentLeavesRoute = Route$13.update({
	id: "/student/leaves",
	path: "/student/leaves",
	getParentRoute: () => Route$31
});
var StudentLoginRoute = Route$12.update({
	id: "/student/login",
	path: "/student/login",
	getParentRoute: () => Route$31
});
var StudentMessRoute = Route$11.update({
	id: "/student/mess",
	path: "/student/mess",
	getParentRoute: () => Route$31
});
var StudentProfileRoute = Route$10.update({
	id: "/student/profile",
	path: "/student/profile",
	getParentRoute: () => Route$31
});
var AdminAdmissionsIndexRoute = Route$9.update({
	id: "/admin/admissions/",
	path: "/admin/admissions/",
	getParentRoute: () => Route$31
});
var AdminAdmissionsNewRoute = Route$8.update({
	id: "/admin/admissions/new",
	path: "/admin/admissions/new",
	getParentRoute: () => Route$31
});
var AdminLaundryIndexRoute = Route$7.update({
	id: "/admin/laundry/",
	path: "/admin/laundry/",
	getParentRoute: () => Route$31
});
var AdminLaundryLaundryIdRoute = Route$34.update({
	id: "/admin/laundry/$laundryId",
	path: "/admin/laundry/$laundryId",
	getParentRoute: () => Route$31
});
var AdminLaundryAssignRoute = Route$6.update({
	id: "/admin/laundry/assign",
	path: "/admin/laundry/assign",
	getParentRoute: () => Route$31
});
var AdminLaundryEmployeesRoute = Route$5.update({
	id: "/admin/laundry/employees",
	path: "/admin/laundry/employees",
	getParentRoute: () => Route$31
});
var AdminMessIndexRoute = Route$4.update({
	id: "/admin/mess/",
	path: "/admin/mess/",
	getParentRoute: () => Route$31
});
var AdminMessMessIdRoute = Route$35.update({
	id: "/admin/mess/$messId",
	path: "/admin/mess/$messId",
	getParentRoute: () => Route$31
});
var AdminMessAssignRoute = Route$3.update({
	id: "/admin/mess/assign",
	path: "/admin/mess/assign",
	getParentRoute: () => Route$31
});
var AdminMessEmployeesRoute = Route$2.update({
	id: "/admin/mess/employees",
	path: "/admin/mess/employees",
	getParentRoute: () => Route$31
});
var EmployeeLaundryPayoutsRoute = Route$1.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => EmployeeLaundryRoute
});
var EmployeeMessPayoutsRoute = Route.update({
	id: "/employee/mess/payouts",
	path: "/employee/mess/payouts",
	getParentRoute: () => Route$31
});
var AdminAdmissionsAdmissionIdIndexRoute = Route$33.update({
	id: "/admin/admissions/$admissionId/",
	path: "/admin/admissions/$admissionId/",
	getParentRoute: () => Route$31
});
var AdminAdmissionsAdmissionIdEditRoute = Route$32.update({
	id: "/admin/admissions/$admissionId/edit",
	path: "/admin/admissions/$admissionId/edit",
	getParentRoute: () => Route$31
});
var EmployeeLaundryRouteChildren = { EmployeeLaundryPayoutsRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminDashboardRoute,
	AdminLeavesRoute,
	AdminLoginRoute,
	AdminPackagesRoute,
	AdminPayoutsRoute,
	AdminProfileRequestsRoute,
	AdminPropertiesRoute,
	AdminReportsRoute,
	AdminSettingsRoute,
	AdminStudentHeadcountRoute,
	EmployeeDashboardRoute,
	EmployeeDeliveryRoute,
	EmployeeLaundryRoute: EmployeeLaundryRoute._addFileChildren(EmployeeLaundryRouteChildren),
	EmployeeLoginRoute,
	StudentDashboardRoute,
	StudentLaundryRoute,
	StudentLeavesRoute,
	StudentLoginRoute,
	StudentMessRoute,
	StudentProfileRoute,
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
var routeTree = Route$31._addFileChildren(rootRouteChildren)._addFileTypes();
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
