import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as isFirebaseConfigured } from "./auth-DbpSDgTm.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./admin.admissions._admissionId.edit-t6Nx2Tu-.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as Skeleton, n as Button, t as AdminShell, w as fetchAdmission } from "./admin-shell-Di_RTl8C.mjs";
import { t as AdmissionForm } from "./admission-form-Dv48CO-c.mjs";
import { t as EmptyState } from "./stat-card-BffqhZ36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.edit-DXdBtLAw.js
var import_jsx_runtime = require_jsx_runtime();
function EditAdmissionPage() {
	const { admissionId } = Route.useParams();
	const { data, isLoading } = useQuery({
		queryKey: ["admission", admissionId],
		queryFn: () => fetchAdmission(admissionId),
		enabled: isFirebaseConfigured
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Edit Admission",
		subtitle: admissionId,
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-2xl" }, i))
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
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdmissionForm, { existing: data })
	});
}
//#endregion
export { EditAdmissionPage as component };
