import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AdminShell } from "./admin-shell-7z6qK9qe.mjs";
import { t as AdmissionForm } from "./admission-form-bYvAppf2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions.new-WDoy-sAg.js
var import_jsx_runtime = require_jsx_runtime();
function NewAdmissionPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "New Admission",
		subtitle: "A unique NS-ADM ID is generated automatically when you save.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdmissionForm, {})
	});
}
//#endregion
export { NewAdmissionPage as component };
