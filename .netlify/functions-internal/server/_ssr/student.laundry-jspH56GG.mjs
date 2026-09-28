import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { Ct as useLaundries, F as getWeekBounds, G as todayISTDateString, Ht as useStudentLaundryRecords, I as getWeekId, P as getOrCreateStudentLaundryRecord, kt as useLaundryPickupsForStudent, ot as updateStudentLaundryRecord } from "./hooks-D7EEodvy.mjs";
import { r as useStudentAuth } from "./studentAuth-FxJDGa_E.mjs";
import { D as Scale, I as Package, U as LoaderCircle, bt as CalendarDays, dt as ChevronUp, i as WashingMachine, mt as ChevronDown, st as CircleCheck, v as StickyNote } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as StudentShell } from "./student-shell-DuGS20Uo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.laundry-jspH56GG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDateRange(start, end) {
	try {
		const fmt = (d) => {
			const parts = d.split("-").map(Number);
			const y = parts[0] ?? (/* @__PURE__ */ new Date()).getFullYear();
			const mo = parts[1] ?? 1;
			const day = parts[2] ?? 1;
			return new Date(y, mo - 1, day).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short"
			});
		};
		return `${fmt(start)} – ${fmt(end)}`;
	} catch {
		return `${start} – ${end}`;
	}
}
function formatISTTimestamp(date) {
	if (!date) return "—";
	return date.toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}
function PickupBadge({ status }) {
	return status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-success/15 text-success border-success/30",
		children: "Pickup Completed ✓"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-warning/15 text-warning-foreground border-warning/30",
		children: "Pickup Pending"
	});
}
function ReceivedBadge({ status }) {
	return status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-success/15 text-success border-success/30",
		children: "Received ✓"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[11px] bg-muted text-muted-foreground border-border",
		children: "Return Pending"
	});
}
function CurrentWeekCard({ record, loading, onMarkPickup, onMarkReceived, saving }) {
	const today = todayISTDateString();
	const weekId = getWeekId(today);
	const { weekStart, weekEnd } = getWeekBounds(today);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-2xl" });
	const pickup = record?.pickupStatus ?? "pending";
	const received = record?.receivedStatus ?? "pending";
	const pickupDone = pickup === "completed";
	const receivedDone = received === "completed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Current Weekly Cycle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] font-mono",
						children: weekId
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display font-bold text-lg sm:text-xl text-foreground",
					children: formatDateRange(weekStart, weekEnd)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-6" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold",
									children: "1. Clothes Handover"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupBadge, { status: pickup })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: pickupDone ? `Handed over on ${formatISTTimestamp(record?.pickupAt)}` : "Hand over your laundry bag to the staff when collected."
						})]
					}), !pickupDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onMarkPickup,
						disabled: saving === "pickup",
						className: "w-full h-10 gradient-brand text-primary-foreground shadow-soft text-xs font-semibold",
						children: [saving === "pickup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-3.5" }), "Mark as Picked Up"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold",
									children: "2. Laundry Received"
								})]
							}), pickupDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivedBadge, { status: received }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[11px] bg-muted text-muted-foreground border-border",
								children: "Awaiting Pickup"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: receivedDone ? `Received back on ${formatISTTimestamp(record?.receivedAt)}` : pickupDone ? "Your clothes are being processed. Mark received once returned." : "Available after laundry handover is confirmed."
						})]
					}), pickupDone && !receivedDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: onMarkReceived,
						disabled: saving === "received",
						className: "w-full h-10 border-success/40 text-success hover:bg-success/10 text-xs font-semibold",
						children: [saving === "received" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-3.5" }), "Confirm Received"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl bg-muted/30 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-1.5 ${pickupDone ? "text-success font-semibold" : "text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex size-5 items-center justify-center rounded-full text-[10px] ${pickupDone ? "bg-success text-success-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`,
								children: "1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Handed Over" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 flex-1 mx-3 bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-1.5 ${pickupDone && !receivedDone ? "text-warning-foreground font-semibold" : receivedDone ? "text-success font-semibold" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex size-5 items-center justify-center rounded-full text-[10px] ${receivedDone ? "bg-success text-success-foreground" : pickupDone ? "bg-warning text-warning-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`,
								children: "2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processing" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 flex-1 mx-3 bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-1.5 ${receivedDone ? "text-success font-semibold" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex size-5 items-center justify-center rounded-full text-[10px] ${receivedDone ? "bg-success text-success-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`,
								children: "3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Returned" })]
						})
					]
				})
			})
		]
	});
}
function LaundryHistoryCard({ records }) {
	const [open, setOpen] = (0, import_react.useState)(true);
	const today = todayISTDateString();
	const currentWeekId = getWeekId(today);
	const past = records.filter((r) => r.weekId !== currentWeekId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold",
						children: "Past Cycles History"
					}),
					past.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] px-1.5 py-0",
						children: past.length
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border divide-y divide-border max-h-72 overflow-y-auto",
			children: past.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-6 text-center text-xs text-muted-foreground",
				children: "No previous week cycles found."
			}) : past.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-3 space-y-1.5 hover:bg-muted/20 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-foreground",
						children: formatDateRange(r.weekStart, r.weekEnd)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono text-muted-foreground",
						children: r.weekId
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupBadge, { status: r.pickupStatus }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivedBadge, { status: r.receivedStatus })]
				})]
			}, r.id))
		})]
	});
}
function DailyLaundryLogsCard({ pickups }) {
	const [open, setOpen] = (0, import_react.useState)(true);
	const byDate = pickups.reduce((acc, p) => {
		const entry = acc[p.date] ?? {};
		if (p.type === "pickup") entry.pickup = p;
		else entry.delivery = p;
		acc[p.date] = entry;
		return acc;
	}, {});
	const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold",
						children: "Staff Clothes Weight & Pickup Logs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20",
						children: [dates.length, " Logged"]
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: dates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 text-center text-muted-foreground text-sm space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-8 mx-auto text-muted-foreground/30 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "No staff entries logged yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "When laundry staff weighs or logs your clothes pickup, the details appear here in real-time."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: dates.map((d) => {
					const row = byDate[d];
					const p = row?.pickup;
					const del = row?.delivery;
					const weight = p?.clothesWeight || del?.clothesWeight;
					const notes = p?.notes || del?.notes;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3.5 space-y-2 hover:bg-muted/15 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-semibold text-foreground",
									children: d
								}), weight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3" }), weight]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5 flex-wrap",
								children: [p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `text-[10px] capitalize ${p.status === "picked_up" ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning-foreground border-warning/30"}`,
									children: ["Pickup: ", p.status === "picked_up" ? "Picked Up" : "Pending"]
								}), del && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `text-[10px] capitalize ${del.status === "picked_up" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground"}`,
									children: ["Delivery: ", del.status === "picked_up" ? "Delivered" : "Pending"]
								})]
							})]
						}), notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Staff Note: ", notes] })]
						})]
					}, d);
				})
			})
		})]
	});
}
function LaundryGuidelinesCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display font-bold text-sm",
				children: "Hostel Laundry Guidelines"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Please put all clothes in your designated laundry bag before handover." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Empty all pockets and tag delicate or woolen garments." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Weight is recorded by the laundry team upon collection." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Inspect clean clothes promptly when returned and confirm in portal." })
			]
		})]
	});
}
function StudentLaundryPage() {
	const { session, admission: myAdmission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: laundries = [] } = useLaundries();
	const laundryId = myAdmission?.laundryId || "";
	const resolvedLaundryName = laundries.find((l) => l.id === laundryId)?.laundryName || myAdmission?.laundryName || "Assigned Laundry Provider";
	const hasLaundryInPackage = myAdmission?.packageServices?.some((s) => s.toLowerCase().includes("laundry")) || !!laundryId;
	const today = todayISTDateString();
	const weekId = getWeekId(today);
	const { weekStart, weekEnd } = getWeekBounds(today);
	const [record, setRecord] = (0, import_react.useState)(null);
	const [recordLoading, setRecordLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const { data: allRecords = [] } = useStudentLaundryRecords(myAdmission?.id ?? null);
	const { data: dailyPickups = [] } = useLaundryPickupsForStudent(myAdmission?.id ?? null, myAdmission?.admissionId);
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
	const loadRecord = (0, import_react.useCallback)(async () => {
		if (!myAdmission || !laundryId) return;
		setRecordLoading(true);
		try {
			const r = await getOrCreateStudentLaundryRecord({
				studentId: myAdmission.id,
				studentName: myAdmission.fullName,
				studentEmail: myAdmission.email ?? "",
				admissionId: myAdmission.admissionId,
				laundryId,
				laundryName: resolvedLaundryName,
				weekId,
				weekStart,
				weekEnd,
				pickupStatus: "pending",
				pickupAt: null,
				receivedStatus: "pending",
				receivedAt: null
			});
			setRecord(r);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unable to load laundry record.");
		} finally {
			setRecordLoading(false);
		}
	}, [
		myAdmission,
		laundryId,
		resolvedLaundryName,
		weekId,
		weekStart,
		weekEnd
	]);
	(0, import_react.useEffect)(() => {
		loadRecord();
	}, [loadRecord]);
	async function handleMarkPickup() {
		if (!myAdmission || !record) return;
		if (record.pickupStatus === "completed") {
			toast.info("Already marked as picked up.");
			return;
		}
		setSaving("pickup");
		try {
			await updateStudentLaundryRecord(myAdmission.id, weekId, {
				pickupStatus: "completed",
				pickupAt: /* @__PURE__ */ new Date()
			});
			setRecord((r) => r ? {
				...r,
				pickupStatus: "completed",
				pickupAt: /* @__PURE__ */ new Date()
			} : r);
			toast.success("Laundry pickup marked.");
			await qc.invalidateQueries({ queryKey: ["studentLaundryRecords", myAdmission.id] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(null);
		}
	}
	async function handleMarkReceived() {
		if (!myAdmission || !record) return;
		if (record.pickupStatus !== "completed") {
			toast.error("Laundry must be picked up before it can be marked as received.");
			return;
		}
		if (record.receivedStatus === "completed") {
			toast.info("Already marked as received.");
			return;
		}
		setSaving("received");
		try {
			await updateStudentLaundryRecord(myAdmission.id, weekId, {
				receivedStatus: "completed",
				receivedAt: /* @__PURE__ */ new Date()
			});
			setRecord((r) => r ? {
				...r,
				receivedStatus: "completed",
				receivedAt: /* @__PURE__ */ new Date()
			} : r);
			toast.success("Laundry marked as received.");
			await qc.invalidateQueries({ queryKey: ["studentLaundryRecords", myAdmission.id] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(null);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	const latestWeight = dailyPickups.find((p) => p.clothesWeight)?.clothesWeight;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, {
		title: "My Laundry",
		subtitle: "Track your weekly laundry schedule, pickup status, and recorded clothes weight",
		backTo: "/student/dashboard",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				!myAdmission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "No admission found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Contact your administrator."
						})
					]
				}),
				myAdmission && !laundryId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "mx-auto mb-2 size-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-base",
							children: hasLaundryInPackage ? "Laundry Included in Package" : "Laundry Not Assigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground max-w-sm mx-auto",
							children: hasLaundryInPackage ? "Your admission package includes laundry services. Your manager or administrator will assign a laundry provider shortly." : "No laundry service has been assigned to your account. Please contact your hostel administrator."
						})
					]
				}),
				myAdmission && laundryId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate",
									children: "Provider"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm sm:text-base font-bold truncate mt-1",
									children: resolvedLaundryName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-1.5 rounded-full bg-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] sm:text-[11px] text-success capitalize truncate",
										children: myAdmission.laundryStatus || "Active"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate",
									children: "Current Cycle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm sm:text-base font-bold truncate mt-1",
									children: formatDateRange(weekStart, weekEnd)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-mono text-muted-foreground mt-1.5 truncate",
									children: weekId
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate",
									children: "Pickup Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupBadge, { status: record?.pickupStatus ?? "pending" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 truncate",
									children: record?.pickupAt ? formatISTTimestamp(record.pickupAt) : "Awaiting handover"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate",
									children: "Latest Weight"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm sm:text-base font-bold text-primary mt-1 flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5 sm:size-4 shrink-0" }), latestWeight || "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 truncate",
									children: [dailyPickups.length, " logged records"]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-8 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentWeekCard, {
							record,
							loading: recordLoading,
							onMarkPickup: handleMarkPickup,
							onMarkReceived: handleMarkReceived,
							saving
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyLaundryLogsCard, { pickups: dailyPickups })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Laundry Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-success/30 bg-success/10 text-success text-[11px] capitalize",
										children: myAdmission.laundryStatus || "active"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-base",
									children: resolvedLaundryName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Weekly collection & delivery"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryGuidelinesCard, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryHistoryCard, { records: allRecords })
						]
					})]
				})] })
			]
		})
	});
}
//#endregion
export { StudentLaundryPage as component };
