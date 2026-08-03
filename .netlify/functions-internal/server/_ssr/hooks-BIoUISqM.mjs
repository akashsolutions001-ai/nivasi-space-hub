import { i as isFirebaseConfigured } from "./auth-Cs7xu7wX.mjs";
import { c as fetchPackages, l as fetchProperties, o as fetchAdmissions, s as fetchColleges, u as fetchRooms } from "./db-CHlv9xOD.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-BIoUISqM.js
function useAdmissions() {
	return useQuery({
		queryKey: ["admissions"],
		queryFn: fetchAdmissions,
		enabled: isFirebaseConfigured
	});
}
function usePackages() {
	return useQuery({
		queryKey: ["packages"],
		queryFn: fetchPackages,
		enabled: isFirebaseConfigured
	});
}
function useColleges() {
	return useQuery({
		queryKey: ["colleges"],
		queryFn: fetchColleges,
		enabled: isFirebaseConfigured
	});
}
function useProperties() {
	return useQuery({
		queryKey: ["properties"],
		queryFn: fetchProperties,
		enabled: isFirebaseConfigured
	});
}
function useRooms() {
	return useQuery({
		queryKey: ["rooms"],
		queryFn: fetchRooms,
		enabled: isFirebaseConfigured
	});
}
function computeStats(rows) {
	const weekAgo = Date.now() - 6048e5;
	return rows.reduce((acc, r) => {
		acc.total += 1;
		if (r.createdAt && r.createdAt.getTime() >= weekAgo) acc.recent += 1;
		if (r.paymentStatus === "completed") acc.paid += 1;
		else acc.paymentPending += 1;
		if (r.bagProvided) acc.bagsProvided += 1;
		else acc.bagsPending += 1;
		if (r.tiffinProvided) acc.tiffinProvided += 1;
		else acc.tiffinPending += 1;
		if (r.mattressRequired) acc.mattressRequired += 1;
		else acc.mattressNotRequired += 1;
		acc.totalValue += r.packageAmount;
		acc.collected += r.amountPaid;
		acc.outstanding += Math.max(0, r.balanceAmount);
		return acc;
	}, {
		total: 0,
		recent: 0,
		paid: 0,
		paymentPending: 0,
		bagsPending: 0,
		bagsProvided: 0,
		tiffinPending: 0,
		tiffinProvided: 0,
		mattressRequired: 0,
		mattressNotRequired: 0,
		totalValue: 0,
		collected: 0,
		outstanding: 0
	});
}
function filterByPeriod(rows, period) {
	if (period === "all") return rows;
	const start = /* @__PURE__ */ new Date(/* @__PURE__ */ new Date());
	start.setHours(0, 0, 0, 0);
	if (period === "week") start.setDate(start.getDate() - start.getDay());
	if (period === "month") start.setDate(1);
	return rows.filter((r) => {
		const d = r.createdAt ?? (r.admissionDate ? new Date(r.admissionDate) : null);
		return d ? d.getTime() >= start.getTime() : false;
	});
}
//#endregion
export { usePackages as a, useColleges as i, filterByPeriod as n, useProperties as o, useAdmissions as r, useRooms as s, computeStats as t };
