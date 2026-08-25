import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getFirebaseApp } from "./auth-DbpSDgTm.mjs";
import { I as Check, c as TriangleAlert, o as User, z as BedDouble } from "../_libs/lucide-react.mjs";
import { y as cn } from "./admin-shell-Di_RTl8C.mjs";
import { i as initials } from "./format-Bg5w10xg.mjs";
import { n as getStorage, r as ref, t as getDownloadURL } from "../_libs/firebase__storage.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-Daqd9jjw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getFirebaseStorage() {
	return getStorage(getFirebaseApp());
}
/**
* Resolves a stored value to a viewable URL.
*
* Priority:
*  1. Already a full http(s) URL  → return as-is
*  2. Starts with "/"             → public-folder path; encode spaces/special
*                                   chars and return so the browser can load it
*  3. Anything else               → legacy Firebase Storage path; resolve via
*                                   getDownloadURL (falls back to null on error)
*/
async function getProfileImageUrl(urlOrPath) {
	if (!urlOrPath) return null;
	if (urlOrPath.startsWith("http")) return urlOrPath;
	if (urlOrPath.startsWith("/")) return urlOrPath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
	try {
		const storage = getFirebaseStorage();
		const storageRef = ref(storage, urlOrPath);
		return await getDownloadURL(storageRef);
	} catch {
		return null;
	}
}
function ProfileAvatar({ path, url, name, className }) {
	const [src, setSrc] = (0, import_react.useState)(url ?? null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (url) {
			setSrc(url);
			return;
		}
		if (!path) {
			setSrc(null);
			return;
		}
		getProfileImageUrl(path).then((resolved) => {
			if (alive) setSrc(resolved);
		});
		return () => {
			alive = false;
		};
	}, [path, url]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft text-sm font-semibold text-primary ring-1 ring-border", className),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: name ? `${name} profile photo` : "Profile photo",
			className: "size-full object-cover",
			loading: "lazy"
		}) : name ? initials(name) || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-1/2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-1/2 opacity-70" })
	});
}
var base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap";
function StatusPill({ ok, okLabel, pendingLabel, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(base, ok ? "bg-success/12 text-success" : "bg-warning/18 text-warning-foreground", className),
		children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), ok ? okLabel : pendingLabel]
	});
}
function PaymentBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
		ok: status === "completed",
		okLabel: "Paid",
		pendingLabel: "Pending",
		className
	});
}
function MattressBadge({ required, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(base, required ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground", className),
		children: [required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, { className: "size-3" }), required ? "Required" : "Not required"]
	});
}
//#endregion
export { StatusPill as i, PaymentBadge as n, ProfileAvatar as r, MattressBadge as t };
