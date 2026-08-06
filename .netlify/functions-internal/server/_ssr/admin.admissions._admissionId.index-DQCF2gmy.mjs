import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admissions._admissionId.index-DQCF2gmy.js
var $$splitComponentImporter = () => import("./admin.admissions._admissionId.index-BMuR8j7D.mjs");
var Route = createFileRoute("/admin/admissions/$admissionId/")({
	head: () => ({ meta: [
		{ title: "Admission Details — NivasiSpace Admin" },
		{
			name: "description",
			content: "Full profile, package, payment and item record for a student."
		},
		{
			property: "og:title",
			content: "Admission Details — NivasiSpace Admin"
		},
		{
			property: "og:description",
			content: "Full profile, package, payment and item record for a student."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
