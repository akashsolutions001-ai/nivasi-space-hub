import { r as isFirebaseConfigured } from "./firebase-config-IuKIWniX.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin.admissions._admissionId.edit-BO-vvnqT.mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as fetchAdmission } from "./hooks-Cx9bJ-2X.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-CxwTuntR.mjs";
import { t as AdmissionForm } from "./admission-form-ygiKW78s.mjs";
import { t as EmptyState } from "./stat-card-GZrf7Gbg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.edit-Ge43WGdD.js
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
