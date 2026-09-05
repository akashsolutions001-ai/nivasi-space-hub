import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { r as useStudentAuth } from "./studentAuth-DGbYVzMP.mjs";
import { $ as ChevronUp, A as Package, I as LoaderCircle, Y as CircleCheck, at as CalendarDays, i as WashingMachine, nt as ChevronDown } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { D as getOrCreateStudentLaundryRecord, J as updateStudentLaundryRecord, L as todayISTDateString, O as getWeekBounds, St as useStudentLaundryRecords, k as getWeekId, st as useLaundries } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as StudentShell } from "./student-shell-Cdo8m_19.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student.laundry-CE1PXIRE.js
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-52 rounded-2xl" });
	const pickup = record?.pickupStatus ?? "pending";
	const received = record?.receivedStatus ?? "pending";
	const pickupDone = pickup === "completed";
	const receivedDone = received === "completed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Current Week"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 font-display font-bold text-base",
						children: formatDateRange(weekStart, weekEnd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: weekId
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-8 text-muted-foreground/30" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-muted/30 p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Laundry Pickup"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupBadge, { status: pickup }), pickupDone && record?.pickupAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: formatISTTimestamp(record.pickupAt)
						})]
					}),
					!pickupDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onMarkPickup,
						disabled: saving === "pickup",
						className: "w-full h-11 gradient-brand text-primary-foreground shadow-soft text-sm font-semibold",
						children: [saving === "pickup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-4" }), "Mark Pickup"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-muted/30 p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Laundry Received"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [pickupDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivedBadge, { status: received }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[11px] bg-muted text-muted-foreground border-border",
							children: "Awaiting Pickup"
						}), receivedDone && record?.receivedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: formatISTTimestamp(record.receivedAt)
						})]
					}),
					pickupDone && !receivedDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: onMarkReceived,
						disabled: saving === "received",
						className: "w-full h-11 border-success/40 text-success hover:bg-success/10 text-sm font-semibold",
						children: [saving === "received" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-4" }), "Mark Received"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: pickup === "completed" ? "text-success font-medium" : "",
						children: "Pickup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: pickup === "completed" && received === "pending" ? "text-warning-foreground font-medium" : received === "completed" ? "text-success font-medium" : "",
						children: "Return Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: received === "completed" ? "text-success font-medium" : "",
						children: "Received"
					})
				]
			})
		]
	});
}
function LaundryHistoryCard({ records }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const today = todayISTDateString();
	const currentWeekId = getWeekId(today);
	const past = records.filter((r) => r.weekId !== currentWeekId);
	if (past.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center justify-between px-5 py-3.5",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold",
					children: "Laundry History"
				})]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border divide-y divide-border",
			children: past.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-3 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-semibold text-muted-foreground",
					children: [formatDateRange(r.weekStart, r.weekEnd), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1.5 text-[10px] font-normal",
						children: [
							"(",
							r.weekId,
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupBadge, { status: r.pickupStatus }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivedBadge, { status: r.receivedStatus })]
				})]
			}, r.id))
		})]
	});
}
function StudentLaundryPage() {
	const { session, admission: myAdmission, loading } = useStudentAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: laundries = [] } = useLaundries();
	const laundryId = myAdmission?.laundryId ?? "";
	const laundry = laundries.find((l) => l.id === laundryId);
	const today = todayISTDateString();
	const weekId = getWeekId(today);
	const { weekStart, weekEnd } = getWeekBounds(today);
	const [record, setRecord] = (0, import_react.useState)(null);
	const [recordLoading, setRecordLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const { data: allRecords = [] } = useStudentLaundryRecords(myAdmission?.id ?? null);
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
				laundryName: laundry?.laundryName ?? "",
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
		laundry,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentShell, {
		title: "My Laundry",
		backTo: "/student/dashboard",
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
				className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WashingMachine, { className: "mx-auto mb-3 size-10 text-muted-foreground/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Laundry Not Assigned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Please contact administration."
					})
				]
			}),
			myAdmission && laundryId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Laundry Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display font-bold",
							children: laundry?.laundryName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Weekly service"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentWeekCard, {
					record,
					loading: recordLoading,
					onMarkPickup: handleMarkPickup,
					onMarkReceived: handleMarkReceived,
					saving
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaundryHistoryCard, { records: allRecords })
			] })
		]
	});
}
//#endregion
export { StudentLaundryPage as component };
