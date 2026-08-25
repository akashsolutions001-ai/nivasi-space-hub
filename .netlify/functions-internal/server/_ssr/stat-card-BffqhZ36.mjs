import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as cn } from "./admin-shell-Di_RTl8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-BffqhZ36.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon: Icon, tone = "neutral", onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onClick ? "button" : "div", {
		onClick,
		className: cn("flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-all", onClick && "hover:-translate-y-0.5 hover:shadow-lift"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid size-10 shrink-0 place-items-center rounded-xl", {
				neutral: "bg-muted text-muted-foreground",
				brand: "gradient-brand text-primary-foreground",
				success: "bg-success/12 text-success",
				warning: "bg-warning/20 text-warning-foreground"
			}[tone]),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xl font-bold tabular-nums",
				children: value
			})]
		})]
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-semibold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: action
			})
		]
	});
}
//#endregion
export { StatCard as n, EmptyState as t };
