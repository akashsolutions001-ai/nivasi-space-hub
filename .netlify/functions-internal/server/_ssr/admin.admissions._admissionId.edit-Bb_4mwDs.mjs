import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.edit-Bb_4mwDs.js
var $$splitComponentImporter = () => import("./admin.admissions._admissionId.edit-B0MyI4d4.mjs");
var Route = createFileRoute("/admin/admissions/$admissionId/edit")({
	head: () => ({ meta: [
		{ title: "Edit Admission — NivasiSpace Admin" },
		{
			name: "description",
			content: "Update student, package, payment and item details."
		},
		{
			property: "og:title",
			content: "Edit Admission — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Update student, package, payment and item details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
