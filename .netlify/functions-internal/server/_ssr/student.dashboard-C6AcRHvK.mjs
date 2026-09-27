import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { L as todayDateString, R as todayISTDateString, bt as useMessRequestsForStudent, gt as useLaundryPickupsForStudent, ot as useDeliveriesForStudent, ut as useLaundries, xt as useMesses } from "./hooks-Bt5d4SEa.mjs";
import { r as useStudentAuth } from "./studentAuth-D19cUah4.mjs";
import { A as Phone, F as MapPin, Q as CircleCheck, R as LoaderCircle, T as Scale, V as House, X as Clock, Z as CircleX, b as SkipForward, ct as CalendarDays, i as WashingMachine, o as UtensilsCrossed, rt as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as StudentShell } from "./student-shell-DhvnwOHB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.dashboard-C6AcRHvK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_ICONS = {
	pending: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
	delivered: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
	not_available: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }),
	skipped: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-3.5" })
};
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	delivered: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
function getMapUrl(propertyName) {
	if (!propertyName) return null;
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}`;
}
function StudentDashboardPage() {
	const { session, admission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const { data: messes = [] } = useMesses();
	const { data: laundries = [] } = useLaundries();
	const { data: deliveries = [] } = useDeliveriesForStudent(admission?.id ?? null, admission?.admissionId);
	const { data: messRequests = [], isLoading: reqLoading } = useMessRequestsForStudent(admission?.id ?? null);
	const { data: laundryPickups = [] } = useLaundryPickupsForStudent(admission?.id ?? null, admission?.admissionId);
	(0, import_react.useEffect)(() => {
		if (!loading && !session) navigate({
			to: "/student/login",
			replace: true
		});
	}, [
		loading,
		session,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const messId = admission?.messId || "";
	const mess = messes.find((m) => m.id === messId);
	const tiffin = admission?.tiffinStatus || "not set";
	const laundryId = admission?.laundryId || "";
	const laundry = laundries.find((l) => l.id === laundryId);
	const laundryStatus = admission?.laundryStatus || "not set";
	const mapUrl = getMapUrl(admission?.propertyName);
	const hasMessInPackage = admission?.packageServices?.some((s) => s.toLowerCase().includes("mess")) || !!messId;
	const hasLaundryInPackage = admission?.packageServices?.some((s) => s.toLowerCase().includes("laundry")) || !!laundryId;
	const latestLaundryPickup = laundryPickups[0];
	const resolvedMessName = mess?.serialNumber != null ? `Mess #${mess.serialNumber}` : mess?.messName || "Assigned Mess";
	const resolvedLaundryName = laundry?.laundryName || "Assigned Laundry Provider";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, {
		title: "My Dashboard",
		subtitle: "Overview of your hostel mess, laundry schedule, and daily updates",
		children: !admission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-base",
					children: "No admission record found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground max-w-sm mx-auto",
					children: [
						"We couldn't find an active admission record linked to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session?.email }),
						". Please contact your hostel administrator."
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Mess Plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold truncate mt-1",
								children: mess ? resolvedMessName : "Not Assigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-1.5 rounded-full ${tiffin === "active" ? "bg-success" : "bg-warning"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] capitalize text-muted-foreground",
									children: ["Tiffin: ", tiffin]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Laundry Plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold truncate mt-1",
								children: laundry ? resolvedLaundryName : "Not Assigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-1.5 rounded-full ${laundryStatus === "active" ? "bg-success" : "bg-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] capitalize text-muted-foreground",
									children: ["Laundry: ", laundryStatus]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Room Assignment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold truncate mt-1",
								children: admission.roomNumber ? `Room ${admission.roomNumber}` : "Room Assigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground truncate mt-1.5",
								children: admission.propertyName || "Hostel Residence"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Latest Laundry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base font-bold text-primary mt-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4 shrink-0" }), latestLaundryPickup?.clothesWeight || (latestLaundryPickup ? "Logged" : "No logs yet")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1.5 capitalize",
								children: latestLaundryPickup ? latestLaundryPickup.status.replace("_", " ") : "Awaiting cycle"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/student/mess",
								className: "group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning-foreground"}`,
											children: tiffin
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-bold text-foreground",
										children: "My Mess Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: mess ? mess.messName : hasMessInPackage ? "Included in Package" : "View Mess Status"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Mess Portal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 transition-transform group-hover:translate-x-0.5" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/student/laundry",
								className: "group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] capitalize ${laundryStatus === "active" ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
											children: laundryStatus
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-bold text-foreground",
										children: "My Laundry Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: laundry ? laundry.laundryName : hasLaundryInPackage ? "Included in Package" : "View Laundry Status"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Laundry Portal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 transition-transform group-hover:translate-x-0.5" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayDeliveryCard, { deliveries }),
						latestLaundryPickup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-base font-bold",
											children: "Latest Laundry Update"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] uppercase tracking-wider font-semibold",
										children: latestLaundryPickup.type === "pickup" ? "Pickup Log" : "Delivery Log"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl bg-muted/30 p-3.5 text-sm border border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-xs text-muted-foreground font-mono",
										children: new Date(latestLaundryPickup.date).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											year: "numeric"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold capitalize text-foreground mt-0.5",
										children: ["Status: ", latestLaundryPickup.status.replace("_", " ")]
									})] }), latestLaundryPickup.clothesWeight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Weight: ", latestLaundryPickup.clothesWeight] })]
									})]
								}),
								latestLaundryPickup.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Staff Note:" }),
										" ",
										latestLaundryPickup.notes
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-4 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold",
									children: admission.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground font-mono mt-0.5",
									children: admission.admissionId
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] capitalize bg-muted/40",
									children: "Student"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 text-xs",
								children: [
									admission.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `tel:${admission.phoneNumber}`,
										className: "flex items-center gap-2 text-primary hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: admission.phoneNumber })]
									}),
									admission.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 shrink-0 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [admission.propertyName, admission.roomNumber ? ` · Room ${admission.roomNumber}` : ""] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5 shrink-0 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mess ? resolvedMessName : "No mess assigned" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-3.5 shrink-0 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: laundry ? resolvedLaundryName : "No laundry assigned" })]
									})
								]
							}),
							mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "w-full text-xs font-semibold h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mapUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5 text-primary" }), " Open Location Map"]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "flex items-center gap-2 font-display text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary" }), "Mess Requests History"]
						}), reqLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-xl" }) : messRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground text-center py-4",
							children: "No special mess requests yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border max-h-64 overflow-y-auto",
							children: messRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] capitalize",
											children: req.requestType === "less_quantity" ? "Less Quantity" : req.requestType === "more_quantity" ? "More Quantity" : "Other"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[9px] ${req.status === "active" ? "border-success/30 bg-success/10 text-success" : "text-muted-foreground"}`,
											children: req.status === "active" ? "Active" : "Inactive"
										})]
									}),
									req.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"\"",
											req.description,
											"\""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: req.createdAt ? req.createdAt.toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short"
										}) : "—"
									})
								]
							}, req.id))
						})]
					})]
				})]
			})]
		})
	});
}
function TodayDeliveryCard({ deliveries }) {
	const todayIST = todayISTDateString();
	const todayLocal = todayDateString();
	const todayRecords = deliveries.filter((d) => d.date === todayIST || d.date === todayLocal);
	const lunch = todayRecords.find((d) => d.meal === "lunch");
	const dinner = todayRecords.find((d) => d.meal === "dinner");
	const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		timeZone: "Asia/Kolkata",
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-bold",
					children: "Today's Delivery"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-success animate-pulse" }), "Live"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted-foreground",
				children: dateLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3",
				children: ["lunch", "dinner"].map((meal) => {
					const status = (meal === "lunch" ? lunch : dinner)?.status ?? "pending";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col items-center gap-1.5 rounded-xl border p-3 ${STATUS_COLORS[status]}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium capitalize text-muted-foreground",
							children: meal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-semibold",
							children: [STATUS_ICONS[status], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: status === "not_available" ? "N/A" : status.charAt(0).toUpperCase() + status.slice(1)
							})]
						})]
					}, meal);
				})
			})
		]
	});
}
//#endregion
export { StudentDashboardPage as component };
