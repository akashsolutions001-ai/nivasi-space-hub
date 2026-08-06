import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as isFirebaseConfigured } from "./auth-DtLQDrss.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./admin.admissions._admissionId.edit-C48XS9Az.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as Skeleton, n as Button, t as AdminShell, w as fetchAdmission } from "./admin-shell-7z6qK9qe.mjs";
import { t as AdmissionForm } from "./admission-form-bYvAppf2.mjs";
import { t as EmptyState } from "./stat-card-SA_CMkic.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.edit-DiMM6O5d.js
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
