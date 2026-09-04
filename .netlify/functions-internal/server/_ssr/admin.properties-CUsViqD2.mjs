import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { $ as ChevronUp, G as ExternalLink, N as MapPin, O as Phone, c as User, lt as BedDouble, nt as ChevronDown, ot as Building2 } from "../_libs/lucide-react.mjs";
import { Ct as useUserProfile, Q as useAdmissions, xt as useRooms } from "./hooks-DuEyU5xF.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as AdminShell } from "./admin-shell-DY9scxej.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { n as formatDate } from "./format-CWXVlUmU.mjs";
import { n as PaymentBadge, r as ProfileAvatar } from "./badges-BnuszMg2.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.properties-CUsViqD2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalizeGender(g) {
	if (!g) return null;
	const v = g.toLowerCase();
	if ([
		"boy",
		"boys",
		"male"
	].includes(v)) return "boys";
	if ([
		"girl",
		"girls",
		"female"
	].includes(v)) return "girls";
	if ([
		"co-ed",
		"coed",
		"any"
	].includes(v)) return "coed";
	return null;
}
function genderLabel(g) {
	const n = normalizeGender(g);
	if (n === "boys") return "Boys";
	if (n === "girls") return "Girls";
	if (n === "coed") return "Co-ed";
	return null;
}
/** Extract required student count from note text e.g. "2 Boys Required", "4 GIRLS needed" */
function parseCapacity(note) {
	if (!note) return null;
	const m = note.match(/(\d+)\s*(boy|girl|student|boys|girls|students|required|needed)/i);
	return m && m[1] ? parseInt(m[1], 10) : null;
}
function PropertyCard({ room }) {
	const { data: admissions = [] } = useAdmissions();
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const students = (0, import_react.useMemo)(() => admissions.filter((a) => a.propertyId === room.id), [admissions, room.id]);
	const occupied = students.length;
	const capacity = parseCapacity(room.note);
	const gl = genderLabel(room.gender);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold leading-tight",
							children: room.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5",
							children: [
								room.roomType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-xs h-6 px-2",
									children: room.roomType
								}),
								gl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `text-xs h-6 px-2 font-semibold
                    ${gl === "Boys" ? "border-blue-300 text-blue-700 bg-blue-50" : ""}
                    ${gl === "Girls" ? "border-pink-300 text-pink-700 bg-pink-50" : ""}
                    ${gl === "Co-ed" ? "border-purple-300 text-purple-700 bg-purple-50" : ""}`,
									children: [
										gl === "Boys" ? "👦" : gl === "Girls" ? "👧" : "👫",
										" ",
										gl
									]
								}),
								room.rent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-semibold text-primary",
									children: [
										"₹",
										room.rent.toLocaleString("en-IN"),
										"/mo"
									]
								}) : null
							]
						})]
					})]
				}),
				(() => {
					const needed = capacity !== null ? Math.max(0, capacity - occupied) : null;
					const available = capacity !== null ? Math.max(0, capacity - occupied) : null;
					const full = capacity !== null && occupied >= capacity;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-amber-200 bg-amber-50 py-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl font-black text-amber-600 leading-none",
									children: occupied
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs font-bold text-amber-700/80 uppercase tracking-wider",
									children: "Filled"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-2xl border py-4 text-center
                ${capacity === null ? "border-border bg-muted/40" : full ? "border-destructive/30 bg-destructive/10" : "border-emerald-200 bg-emerald-50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-4xl font-black leading-none
                  ${capacity === null ? "text-muted-foreground" : full ? "text-destructive" : "text-emerald-600"}`,
									children: capacity !== null ? available : "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1.5 text-xs font-bold uppercase tracking-wider
                  ${capacity === null ? "text-muted-foreground" : full ? "text-destructive/70" : "text-emerald-700/80"}`,
									children: full ? "Full" : "Vacant"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-2xl border py-4 text-center
                ${needed === null ? "border-border bg-muted/40" : needed === 0 ? "border-destructive/30 bg-destructive/10" : "border-blue-200 bg-blue-50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-4xl font-black leading-none
                  ${needed === null ? "text-muted-foreground" : needed === 0 ? "text-destructive" : "text-blue-600"}`,
									children: needed ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1.5 text-xs font-bold uppercase tracking-wider
                  ${needed === null ? "text-muted-foreground" : needed === 0 ? "text-destructive/70" : "text-blue-700/80"}`,
									children: "Need More"
								})]
							})
						]
					});
				})(),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [
						(room.address || room.city) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-base font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 mt-0.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: [room.address, room.city].filter(Boolean).join(", ") })]
						}),
						room.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-base font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.location })]
						}),
						room.contact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-base font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:${room.contact}`,
								className: "hover:underline text-primary",
								children: room.contact
							})]
						})
					]
				}),
				room.mapLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: room.mapLink,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "View on Google Maps"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "flex w-full items-center justify-between px-6 py-4 text-base font-semibold hover:bg-muted/40 transition-colors",
				onClick: () => setExpanded((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Students (",
					students.length,
					")",
					capacity !== null ? ` / ${capacity} capacity` : ""
				] }), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5 text-muted-foreground" })]
			}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 pb-5",
				children: students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-3 text-sm text-muted-foreground",
					children: "No students assigned to this property."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "hidden w-full text-sm lg:table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 w-8",
									children: "Sr"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Admission ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Room / Bed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Year"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "College"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Move-in"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: students.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: idx + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin/admissions/$admissionId",
										params: { admissionId: s.admissionId },
										className: "flex items-center gap-2 hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
											path: s.profileImagePath,
											name: s.fullName,
											className: "size-7 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold leading-tight",
											children: s.fullName
										}), s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: s.email
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-primary",
									children: s.admissionId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-xs",
									children: [s.roomNumber ? `Room ${s.roomNumber}` : "—", s.bedNumber ? ` · Bed ${s.bedNumber}` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs",
									children: s.year || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground max-w-[160px] truncate",
									children: s.collegeName || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs",
									children: s.phoneNumber || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: s.paymentStatus })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: formatDate(s.moveInDate ?? s.admissionDate)
								})
							]
						}, s.id)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden divide-y divide-border",
						children: students.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/admissions/$admissionId",
							params: { admissionId: s.admissionId },
							className: "flex gap-3 p-3 hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 w-5 shrink-0 text-xs font-semibold text-muted-foreground",
									children: idx + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
									path: s.profileImagePath,
									name: s.fullName,
									className: "size-9 shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold truncate",
											children: s.fullName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] text-primary",
											children: s.admissionId
										}),
										s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground truncate",
											children: s.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground",
											children: [
												s.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📞 ", s.phoneNumber] }),
												s.year && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Year ", s.year] }),
												s.roomNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Room ",
													s.roomNumber,
													s.bedNumber ? ` · Bed ${s.bedNumber}` : ""
												] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: s.paymentStatus })
										})
									]
								})
							]
						}, s.id))
					})]
				})
			})]
		})]
	});
}
function PropertiesPage() {
	const { data: allRooms = [], isLoading } = useRooms();
	const { data: admissions = [] } = useAdmissions();
	const isGlobalAdmin = useIsGlobalAdmin();
	const { data: userProfile } = useUserProfile();
	const [search, setSearch] = (0, import_react.useState)("");
	const [genderFilter, setGenderFilter] = (0, import_react.useState)("all");
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const verifiedRooms = (0, import_react.useMemo)(() => allRooms.filter((r) => {
		if (r.hidden === true) return false;
		if (r.verificationStatus && r.verificationStatus !== "verified") return false;
		if (r.paymentStatus && r.paymentStatus !== "paid") return false;
		return true;
	}), [allRooms]);
	const adminCollege = (0, import_react.useMemo)(() => {
		if (isGlobalAdmin) return "";
		return userProfile?.collegeName ?? "";
	}, [isGlobalAdmin, userProfile?.collegeName]);
	const rooms = (0, import_react.useMemo)(() => {
		if (!adminCollege) return verifiedRooms;
		const col = adminCollege.trim().toLowerCase();
		return verifiedRooms.filter((r) => {
			const roomCollege = (r.college ?? "").trim().toLowerCase();
			if (!roomCollege) return true;
			return roomCollege === col || roomCollege.includes(col) || col.includes(roomCollege);
		});
	}, [verifiedRooms, adminCollege]);
	function studentCount(r) {
		return admissions.filter((a) => a.propertyId === r.id).length;
	}
	const genderCounts = (0, import_react.useMemo)(() => ({
		all: rooms.length,
		boys: rooms.filter((r) => normalizeGender(r.gender) === "boys").length,
		girls: rooms.filter((r) => normalizeGender(r.gender) === "girls").length,
		coed: rooms.filter((r) => normalizeGender(r.gender) === "coed").length
	}), [rooms]);
	const genderFiltered = (0, import_react.useMemo)(() => {
		if (genderFilter === "all") return rooms;
		return rooms.filter((r) => normalizeGender(r.gender) === genderFilter);
	}, [rooms, genderFilter]);
	const statusTypeCounts = (0, import_react.useMemo)(() => {
		return {
			vacant: genderFiltered.filter((r) => studentCount(r) === 0).length,
			occupied: genderFiltered.filter((r) => studentCount(r) > 0).length,
			types: [...new Set(genderFiltered.map((r) => r.roomType).filter(Boolean))]
		};
	}, [genderFiltered, admissions]);
	const totalStudentsAssigned = (0, import_react.useMemo)(() => admissions.filter((a) => a.propertyId && a.propertyId !== "").length, [admissions]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = genderFiltered;
		if (activeFilter === "vacant") list = list.filter((r) => studentCount(r) === 0);
		else if (activeFilter === "occupied") list = list.filter((r) => studentCount(r) > 0);
		else if (activeFilter.startsWith("type:")) {
			const t = activeFilter.slice(5);
			list = list.filter((r) => r.roomType === t);
		}
		const q = search.trim().toLowerCase();
		if (q) list = list.filter((r) => r.title.toLowerCase().includes(q) || (r.city ?? "").toLowerCase().includes(q) || (r.contact ?? "").toLowerCase().includes(q) || (r.college ?? "").toLowerCase().includes(q));
		return [...list].sort((a, b) => {
			const aOcc = studentCount(a);
			const bOcc = studentCount(b);
			if (aOcc === 0 && bOcc > 0) return -1;
			if (aOcc > 0 && bOcc === 0) return 1;
			return a.title.localeCompare(b.title);
		});
	}, [
		genderFiltered,
		admissions,
		search,
		activeFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Properties",
		subtitle: isGlobalAdmin ? `All verified rooms · ${allRooms.length} total` : adminCollege ? `Verified rooms · ${adminCollege}` : "Verified rooms — occupancy overview.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					{
						label: "Total Properties",
						value: rooms.length,
						icon: Building2
					},
					{
						label: "Students Placed",
						value: totalStudentsAssigned,
						icon: User
					},
					{
						label: "Total Admissions",
						value: admissions.length,
						icon: BedDouble
					}
				].map(({ label, value, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-bold",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Gender"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						{
							key: "all",
							label: "All",
							emoji: "🏠",
							cls: "border-primary/40 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
						},
						{
							key: "boys",
							label: "Boys",
							emoji: "👦",
							cls: "border-blue-300  data-[active=true]:bg-blue-500  data-[active=true]:text-white"
						},
						{
							key: "girls",
							label: "Girls",
							emoji: "👧",
							cls: "border-pink-300  data-[active=true]:bg-pink-500  data-[active=true]:text-white"
						},
						{
							key: "coed",
							label: "Co-ed",
							emoji: "👫",
							cls: "border-purple-300 data-[active=true]:bg-purple-500 data-[active=true]:text-white"
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						"data-active": genderFilter === tab.key,
						onClick: () => {
							setGenderFilter(tab.key);
							setActiveFilter("all");
						},
						className: `flex items-center gap-2 rounded-xl border px-5 py-3 text-base font-semibold transition-all shadow-sm
                ${tab.cls}
                ${genderFilter === tab.key ? "shadow-md scale-105" : "bg-card text-foreground hover:bg-muted"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: tab.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-xs font-bold
                ${genderFilter === tab.key ? "bg-white/25" : "bg-muted text-muted-foreground"}`,
								children: genderCounts[tab.key]
							})
						]
					}, tab.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Filter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						{
							key: "all",
							label: "All",
							count: genderFiltered.length,
							emoji: "🔍",
							cls: "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
						},
						{
							key: "vacant",
							label: "Vacant",
							count: statusTypeCounts.vacant,
							emoji: "🟢",
							cls: "data-[active=true]:bg-emerald-500 data-[active=true]:text-white"
						},
						{
							key: "occupied",
							label: "Occupied",
							count: statusTypeCounts.occupied,
							emoji: "🟡",
							cls: "data-[active=true]:bg-amber-500 data-[active=true]:text-white"
						}
					].map((card) => {
						const isActive = activeFilter === card.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							"data-active": isActive,
							onClick: () => setActiveFilter(isActive ? "all" : card.key),
							className: `flex items-center gap-2 rounded-xl border px-5 py-3 text-base font-medium transition-all shadow-sm
                  ${card.cls}
                  ${isActive ? "border-transparent shadow-md scale-105" : "border-border bg-card text-foreground hover:bg-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg",
									children: card.emoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: card.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-xs font-bold
                  ${isActive ? "bg-white/25" : "bg-muted text-muted-foreground"}`,
									children: card.count
								})
							]
						}, card.key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search by property name, city, college or contact…",
					className: "max-w-sm"
				})
			}),
			!isLoading && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-xs text-muted-foreground",
				children: [
					"Showing ",
					filtered.length,
					" propert",
					filtered.length !== 1 ? "ies" : "y",
					" — sorted by vacancy"
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }, i))
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground",
				children: rooms.length === 0 ? "No verified rooms found for this college." : "No properties match your filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyCard, { room: r }, r.id))
			})
		]
	});
}
//#endregion
export { PropertiesPage as component };
