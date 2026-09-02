//#region node_modules/.nitro/vite/services/ssr/assets/format-CWXVlUmU.js
function formatINR(value) {
	return "₹" + Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function formatDate(value) {
	if (!value) return "—";
	const d = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
function isValidIndianMobile(value) {
	return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ""));
}
function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
function addDays(date, days) {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "";
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d.toISOString().slice(0, 10);
}
//#endregion
export { isValidEmail as a, initials as i, formatDate as n, isValidIndianMobile as o, formatINR as r, todayISO as s, addDays as t };
