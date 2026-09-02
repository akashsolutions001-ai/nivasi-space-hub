import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { J as CircleX, N as MapPin, O as Phone, Y as CircleCheck, et as ChevronRight, o as UtensilsCrossed, q as Clock, tt as ChevronLeft, ut as ArrowLeft, y as SkipForward } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { F as todayDateString, Y as upsertDelivery, Z as useAdmissions, ht as useMesses, it as useEmployeeByUid, tt as useDeliveriesForDate } from "./hooks-Dciv9SEg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.delivery-B7QtdD--.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getMapUrl(student) {
	const s = student;
	if (s.mapLink) return s.mapLink;
	const addr = s.address ?? s.location;
	if (addr) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
	if (student.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(student.propertyName)}`;
	return null;
}
var DELIVERY_OPTIONS = [
	{
		status: "delivered",
		label: "Delivered",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }),
		color: "border-success bg-success/15 text-success hover:bg-success/25"
	},
	{
		status: "not_available",
		label: "Not Available",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5" }),
		color: "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
	},
	{
		status: "skipped",
		label: "Skipped",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" }),
		color: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
	},
	{
		status: "pending",
		label: "Pending",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5" }),
		color: "border-warning/30 bg-warning/10 text-warning-foreground hover:bg-warning/20"
	}
];
function EmployeeDeliveryPage() {
	const { user, userRole, employeeMessIds, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const today = todayDateString();
	const { data: employee } = useEmployeeByUid(user?.uid);
	const { data: allMesses = [] } = useMesses();
	const assignedMessIds = employee?.messIds?.length ? employee.messIds : employeeMessIds;
	const [activeMessId, setActiveMessId] = (0, import_react.useState)("");
	const resolvedMessId = activeMessId || assignedMessIds[0] || "";
	(0, import_react.useEffect)(() => {
		if (!activeMessId && assignedMessIds.length > 0) setActiveMessId(assignedMessIds[0]);
	}, [assignedMessIds, activeMessId]);
	const { data: admissions = [] } = useAdmissions();
	const { data: deliveries = [] } = useDeliveriesForDate(resolvedMessId || null, today);
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const [updatingKey, setUpdatingKey] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!authLoading && (!user || userRole === "admin")) navigate({
			to: "/employee/login",
			replace: true
		});
	}, [
		authLoading,
		user,
		userRole,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setCurrentIndex(0);
	}, [resolvedMessId]);
	const students = (0, import_react.useMemo)(() => resolvedMessId ? admissions.filter((a) => a.messId === resolvedMessId && a.tiffinStatus !== "cancelled") : [], [admissions, resolvedMessId]);
	const student = students[currentIndex] ?? null;
	const total = students.length;
	function getDelivery(studentId, meal) {
		return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
	}
	async function setStatus(meal, status) {
		if (!student || !resolvedMessId || !employee) return;
		const key = `${student.id}-${meal}`;
		setUpdatingKey(key);
		try {
			await upsertDelivery({
				studentId: student.id,
				admissionId: student.admissionId,
				messId: resolvedMessId,
				employeeId: employee.id,
				date: today,
				meal,
				status
			});
			await qc.invalidateQueries({ queryKey: [
				"deliveries",
				resolvedMessId,
				today
			] });
			await qc.invalidateQueries({ queryKey: [
				"deliverySummary",
				resolvedMessId,
				today
			] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save delivery.");
		} finally {
			setUpdatingKey(null);
		}
	}
	function prev() {
		if (currentIndex > 0) setCurrentIndex((i) => i - 1);
	}
	function next() {
		if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
	}
	if (authLoading) return null;
	const activeMessName = allMesses.find((m) => m.id === resolvedMessId)?.messName ?? employee?.messNames?.[0] ?? "";
	if (!resolvedMessId || students.length === 0 && !authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-12 text-muted-foreground/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: !resolvedMessId ? "No mess assigned to your account." : "No students in this mess."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/employee/dashboard",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), "Back to Dashboard"]
				})
			})
		]
	});
	const mapUrl = student ? getMapUrl(student) : null;
	const lunch = student ? getDelivery(student.id, "lunch") : void 0;
	const dinner = student ? getDelivery(student.id, "dinner") : void 0;
	const tiffin = student ? student.tiffinStatus ?? "active" : "active";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/employee/dashboard",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 size-4" }), " Dashboard"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-medium text-muted-foreground",
							children: [
								currentIndex + 1,
								" / ",
								total
							]
						}), activeMessName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: activeMessName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-24" })
				]
			}),
			assignedMessIds.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none",
				children: assignedMessIds.map((id, i) => {
					const name = allMesses.find((m) => m.id === id)?.messName ?? employee?.messNames?.[i] ?? id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveMessId(id),
						className: `shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${resolvedMessId === id ? "gradient-brand text-primary-foreground shadow-soft" : "border border-border text-muted-foreground hover:bg-muted"}`,
						children: name
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 w-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full gradient-brand transition-all duration-300",
					style: { width: total > 0 ? `${(currentIndex + 1) / total * 100}%` : "0%" }
				})
			}),
			student && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: student.fullName
								}), student.propertyName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: [student.propertyName, student.roomNumber ? ` · Room ${student.roomNumber}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `shrink-0 capitalize text-[11px] ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning-foreground"}`,
								children: tiffin
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [student.phoneNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "flex-1 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${student.phoneNumber}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-4" }), student.phoneNumber]
								})
							}), mapUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mapUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 size-4" }), "Navigate"]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealSection, {
						meal: "lunch",
						currentStatus: lunch?.status ?? "pending",
						disabled: tiffin === "cancelled",
						updating: updatingKey === `${student.id}-lunch`,
						onSelect: (s) => setStatus("lunch", s)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealSection, {
						meal: "dinner",
						currentStatus: dinner?.status ?? "pending",
						disabled: tiffin === "cancelled",
						updating: updatingKey === `${student.id}-dinner`,
						onSelect: (s) => setStatus("dinner", s)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 flex gap-3 border-t border-border bg-background p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "lg",
					className: "flex-1 text-base",
					onClick: prev,
					disabled: currentIndex === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-1 size-5" }), " Prev"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "flex-1 text-base gradient-brand text-primary-foreground shadow-soft",
					onClick: next,
					disabled: currentIndex === total - 1,
					children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 size-5" })]
				})]
			})
		]
	});
}
function MealSection({ meal, currentStatus, disabled, updating, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-2 text-base font-semibold capitalize",
			children: meal
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2",
			children: DELIVERY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				disabled: disabled || updating,
				onClick: () => onSelect(opt.status),
				className: `flex items-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-medium transition-all active:scale-95 ${currentStatus === opt.status ? opt.color + " ring-2 ring-current/20" : "border-border bg-card text-muted-foreground hover:bg-muted/60"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`,
				children: [opt.icon, opt.label]
			}, opt.status))
		})]
	});
}
//#endregion
export { EmployeeDeliveryPage as component };
