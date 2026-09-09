import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { H as History, R as LoaderCircle, T as Scale, Y as Clock, Z as CircleCheck, at as Check, g as StickyNote, nt as ChevronRight, ot as Calendar, rt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CMFXK8lR.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Bm0v3lUY.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { $ as upsertLaundryPickup, I as todayDateString, mt as useLaundryPickupsForStudent } from "./hooks-CicQrMaL.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-laundry-dialog-CEOF4y7G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	pending: "bg-warning/15 text-warning-foreground border-warning/30",
	picked_up: "bg-success/15 text-success border-success/30",
	not_available: "bg-muted text-muted-foreground border-border",
	skipped: "bg-destructive/10 text-destructive border-destructive/20"
};
function StudentLaundryDialog({ open, onClose, student, laundryId, laundryName, employeeId = "admin", initialDate }) {
	const qc = useQueryClient();
	const today = todayDateString();
	const [date, setDate] = (0, import_react.useState)(initialDate || today);
	const [activeTab, setActiveTab] = (0, import_react.useState)("pickup");
	const [pickupStatus, setPickupStatus] = (0, import_react.useState)("pending");
	const [pickupWeight, setPickupWeight] = (0, import_react.useState)("");
	const [pickupNotes, setPickupNotes] = (0, import_react.useState)("");
	const [deliveryStatus, setDeliveryStatus] = (0, import_react.useState)("pending");
	const [deliveryWeight, setDeliveryWeight] = (0, import_react.useState)("");
	const [deliveryNotes, setDeliveryNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: studentPickups = [], isLoading: pickupsLoading } = useLaundryPickupsForStudent(student?.id ?? null);
	(0, import_react.useEffect)(() => {
		if (open) setDate(initialDate || today);
	}, [
		open,
		initialDate,
		today
	]);
	(0, import_react.useEffect)(() => {
		if (!studentPickups) return;
		const p = studentPickups.find((r) => r.date === date && r.type === "pickup");
		const d = studentPickups.find((r) => r.date === date && r.type === "delivery");
		if (p) {
			setPickupStatus(p.status);
			setPickupWeight(p.clothesWeight ?? "");
			setPickupNotes(p.notes ?? "");
		} else {
			setPickupStatus("pending");
			setPickupWeight("");
			setPickupNotes("");
		}
		if (d) {
			setDeliveryStatus(d.status);
			setDeliveryWeight(d.clothesWeight ?? "");
			setDeliveryNotes(d.notes ?? "");
		} else {
			setDeliveryStatus("pending");
			setDeliveryWeight("");
			setDeliveryNotes("");
		}
	}, [date, studentPickups]);
	const historyRecords = (0, import_react.useMemo)(() => {
		return studentPickups.slice().sort((a, b) => b.date.localeCompare(a.date));
	}, [studentPickups]);
	async function handleSave(typeToSave) {
		if (!student || !laundryId) return;
		const targets = typeToSave === "pickup" ? ["pickup"] : typeToSave === "delivery" ? ["delivery"] : ["pickup", "delivery"];
		setSaving(true);
		try {
			for (const type of targets) {
				const isPickup = type === "pickup";
				const status = isPickup ? pickupStatus : deliveryStatus;
				const clothesWeight = isPickup ? pickupWeight.trim() : deliveryWeight.trim();
				const notes = isPickup ? pickupNotes.trim() : deliveryNotes.trim();
				await upsertLaundryPickup({
					studentId: student.id,
					admissionId: student.admissionId,
					laundryId,
					employeeId,
					date,
					type,
					status,
					clothesWeight,
					notes
				});
			}
			await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
			await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
			toast.success(`Saved laundry details for ${student.fullName} on ${date}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save laundry details.");
		} finally {
			setSaving(false);
		}
	}
	function shiftDate(days) {
		const d = new Date(date);
		d.setDate(d.getDate() + days);
		setDate(d.toISOString().slice(0, 10));
	}
	if (!student) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Laundry Record — ", student.fullName] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					student.phoneNumber && `Phone: ${student.phoneNumber}`,
					student.propertyName ? ` · ${student.propertyName}` : "",
					student.roomNumber ? ` · Room ${student.roomNumber}` : "",
					laundryName ? ` · ${laundryName}` : ""
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-primary/20 bg-primary/5 p-3 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-primary" }), "Calendar Laundry Date"]
						}), date === today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] bg-primary/10 text-primary border-primary/30",
							children: "Today"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								className: "size-8 shrink-0",
								onClick: () => shiftDate(-1),
								"aria-label": "Previous day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: "h-8 font-medium text-sm text-center bg-background"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								className: "size-8 shrink-0",
								onClick: () => shiftDate(1),
								"aria-label": "Next day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							}),
							date !== today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-8 text-xs shrink-0",
								onClick: () => setDate(today),
								children: "Today"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-xl border border-border p-1 bg-muted/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab("pickup"),
						className: `flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${activeTab === "pickup" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: "Pickup Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab("delivery"),
						className: `flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${activeTab === "delivery" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: "Delivery Details"
					})]
				}),
				activeTab === "pickup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-2xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-semibold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-warning-foreground" }), "Pickup Record"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: pickupStatus,
								onValueChange: (v) => setPickupStatus(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: `h-7 w-32 text-xs font-medium capitalize ${STATUS_COLORS[pickupStatus]}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "picked_up",
										children: "Picked Up"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "not_available",
										children: "Not Available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "skipped",
										children: "Skipped"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "pickupWeight",
								className: "text-xs font-medium flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5 text-muted-foreground" }), "Weight of Clothes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pickupWeight",
								placeholder: "e.g. 2.5 kg, 3.2 kg",
								value: pickupWeight,
								onChange: (e) => setPickupWeight(e.target.value),
								className: "h-8 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "pickupNotes",
								className: "text-xs font-medium flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3.5 text-muted-foreground" }), "Description / Clothes Details"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "pickupNotes",
								rows: 2,
								placeholder: "e.g. 3 shirts, 2 pants, 1 bedsheet (white shirt separate)",
								value: pickupNotes,
								onChange: (e) => setPickupNotes(e.target.value),
								className: "w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							disabled: saving,
							onClick: () => handleSave("pickup"),
							className: "w-full",
							children: [
								saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 size-4" }),
								"Save Pickup Details for ",
								date
							]
						})
					]
				}),
				activeTab === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-2xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-semibold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-success" }), "Delivery Record"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: deliveryStatus,
								onValueChange: (v) => setDeliveryStatus(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: `h-7 w-32 text-xs font-medium capitalize ${STATUS_COLORS[deliveryStatus]}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "picked_up",
										children: "Delivered"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "not_available",
										children: "Not Available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "skipped",
										children: "Skipped"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "deliveryWeight",
								className: "text-xs font-medium flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5 text-muted-foreground" }), "Weight of Clothes (Delivered)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "deliveryWeight",
								placeholder: "e.g. 2.5 kg",
								value: deliveryWeight,
								onChange: (e) => setDeliveryWeight(e.target.value),
								className: "h-8 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "deliveryNotes",
								className: "text-xs font-medium flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3.5 text-muted-foreground" }), "Description / Delivery Notes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "deliveryNotes",
								rows: 2,
								placeholder: "e.g. Delivered folded to student in Room 102",
								value: deliveryNotes,
								onChange: (e) => setDeliveryNotes(e.target.value),
								className: "w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							disabled: saving,
							onClick: () => handleSave("delivery"),
							className: "w-full",
							children: [
								saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 size-4" }),
								"Save Delivery Details for ",
								date
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5 text-primary" }),
								"Laundry Date History (",
								student.fullName,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Click date to edit"
						})]
					}), pickupsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted-foreground" })
					}) : historyRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground text-center py-4 italic border border-dashed rounded-xl",
						children: "No laundry records recorded yet for this student."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5 max-h-48 overflow-y-auto pr-1 divide-y divide-border",
						children: historyRecords.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDate(rec.date),
							className: `w-full text-left p-2 rounded-xl transition-colors flex flex-col gap-1 ${rec.date === date ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-xs text-foreground",
											children: rec.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] capitalize",
											children: rec.type
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] capitalize ${STATUS_COLORS[rec.status]}`,
											children: rec.status === "picked_up" && rec.type === "delivery" ? "Delivered" : rec.status
										})
									]
								}), rec.clothesWeight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-primary flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3" }), rec.clothesWeight]
								})]
							}), rec.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground truncate flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3 shrink-0" }), rec.notes]
							})]
						}, rec.id))
					})]
				})
			]
		})
	});
}
//#endregion
export { StudentLaundryDialog as t };
