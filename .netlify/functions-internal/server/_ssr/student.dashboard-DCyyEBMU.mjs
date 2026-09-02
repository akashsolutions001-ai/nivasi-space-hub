import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-BqzWWd8x.mjs";
import { I as LoaderCircle, J as CircleX, N as MapPin, O as Phone, P as LogOut, Y as CircleCheck, at as CalendarDays, et as ChevronRight, i as WashingMachine, o as UtensilsCrossed, q as Clock, y as SkipForward, z as House } from "../_libs/lucide-react.mjs";
import { ht as useMesses, nt as useDeliveriesForStudent } from "./hooks-Dciv9SEg.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.dashboard-DCyyEBMU.js
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
function formatDate(dateStr) {
	try {
		return new Date(dateStr).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	} catch {
		return dateStr;
	}
}
function getMapUrl(propertyName) {
	if (!propertyName) return null;
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}`;
}
function StudentDashboardPage() {
	const { session, admission, loading, logoutStudent } = useStudentAuth();
	const navigate = useNavigate();
	const { data: messes = [] } = useMesses();
	const { data: deliveries = [], isLoading: delLoading } = useDeliveriesForStudent(admission?.id ?? null);
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
	function handleLogout() {
		logoutStudent();
		navigate({
			to: "/student/login",
			replace: true
		});
	}
	const deliveriesByDate = (0, import_react.useMemo)(() => {
		const map = {};
		for (const d of deliveries) {
			if (!map[d.date]) map[d.date] = [];
			map[d.date].push(d);
		}
		return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
	}, [deliveries]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const messId = admission?.messId ?? "";
	const mess = messes.find((m) => m.id === messId);
	const tiffin = admission?.tiffinStatus ?? "not set";
	const mapUrl = getMapUrl(admission?.propertyName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-lg items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-8 items-center justify-center rounded-xl gradient-brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-bold",
						children: "My Dashboard"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: handleLogout,
					"aria-label": "Log out",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-lg space-y-4 px-4 pt-4",
			children: !admission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "No admission found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"We couldn't find an admission record linked to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session?.email }),
							". Please contact your hostel administrator."
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold",
								children: admission.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: admission.admissionId
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: `capitalize text-[11px] ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
								children: ["Tiffin: ", tiffin]
							})]
						}),
						admission.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${admission.phoneNumber}`,
							className: "mt-2 flex items-center gap-2 text-sm text-primary hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), admission.phoneNumber]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1.5 border-t border-border pt-3",
							children: [admission.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [admission.propertyName, admission.roomNumber ? ` · Room ${admission.roomNumber}` : ""] })]
							}), mess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [mess.messName, mess.ownerName ? ` · ${mess.ownerName}` : ""] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground italic",
								children: "Not assigned to a mess yet."
							})]
						}),
						mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "mt-3 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: mapUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-3.5" }), " Open Map"]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/student/mess",
						className: "flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:bg-primary/5 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-xl gradient-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-5 text-primary-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm",
								children: "My Mess"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground text-center",
								children: "Tiffin & requests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/student/laundry",
						className: "flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:bg-primary/5 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-xl gradient-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-5 text-primary-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm",
								children: "My Laundry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground text-center",
								children: "Weekly service"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayDeliveryCard, { deliveries }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-3 flex items-center gap-2 font-display text-base font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary" }), "Tiffin History"]
					}), delLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-xl" }) : deliveriesByDate.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No delivery records yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: deliveriesByDate.map(([date, records]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: formatDate(date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize text-sm",
									children: r.meal
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `flex items-center gap-1 text-[11px] ${STATUS_COLORS[r.status]}`,
									children: [STATUS_ICONS[r.status], r.status === "not_available" ? "N/A" : r.status.charAt(0).toUpperCase() + r.status.slice(1)]
								})]
							}, r.id))
						})] }, date))
					})]
				})
			] })
		})]
	});
}
function TodayDeliveryCard({ deliveries }) {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayRecords = deliveries.filter((d) => d.date === today);
	const lunch = todayRecords.find((d) => d.meal === "lunch");
	const dinner = todayRecords.find((d) => d.meal === "dinner");
	const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-1 font-display text-base font-bold",
				children: "Today's Delivery"
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
