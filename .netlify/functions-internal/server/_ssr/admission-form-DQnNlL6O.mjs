import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { P as Check, h as Search, j as ChevronsUpDown, o as User, w as LoaderCircle } from "../_libs/lucide-react.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { E as generateAdmissionId, F as useColleges, I as usePackages, L as useProperties, R as useRooms, S as createAdmission, d as SelectItem, f as SelectTrigger, j as updateAdmission, l as Select, n as Button, p as SelectValue, u as SelectContent, y as cn } from "./admin-shell-DbLl1eJ-.mjs";
import { t as Input } from "./input-BRq9ZYTb.mjs";
import { t as Label } from "./label-CwHe0bR-.mjs";
import { n as SERVICE_OPTIONS, t as Checkbox } from "./types-B2AqjYmj.mjs";
import { a as isValidIndianMobile, o as todayISO, r as formatINR, t as addDays } from "./format-Bg5w10xg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admission-form-DQnNlL6O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function toForm(a) {
	return {
		profileImagePath: a?.profileImagePath ?? "",
		fullName: a?.fullName ?? "",
		phoneNumber: a?.phoneNumber ?? "",
		email: a?.email ?? "",
		gender: a?.gender ?? "",
		dateOfBirth: a?.dateOfBirth ?? "",
		parentName: a?.parentName ?? "",
		parentPhone: a?.parentPhone ?? "",
		parentRelation: a?.parentRelation ?? "",
		collegeId: a?.collegeId ?? "",
		collegeName: a?.collegeName ?? "",
		course: a?.course ?? "",
		year: a?.year ?? "",
		propertyId: a?.propertyId ?? "",
		propertyName: a?.propertyName ?? "",
		roomNumber: a?.roomNumber ?? "",
		bedNumber: a?.bedNumber ?? "",
		admissionDate: a?.admissionDate || todayISO(),
		moveInDate: a?.moveInDate ?? "",
		packageId: a?.packageId ?? "",
		packageName: a?.packageName ?? "",
		packageServices: a?.packageServices ?? [],
		packageAmount: a ? String(a.packageAmount) : "",
		packageStartDate: a?.packageStartDate ?? "",
		packageEndDate: a?.packageEndDate ?? "",
		amountPaid: a ? String(a.amountPaid) : "0",
		bagProvided: a?.bagProvided ?? false,
		tiffinProvided: a?.tiffinProvided ?? false,
		mattressRequired: a?.mattressRequired ?? false,
		notes: a?.notes ?? ""
	};
}
function Section({ title, description, children, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-2xl border p-5 shadow-soft sm:p-6", highlight ? "border-primary/30 bg-brand-soft/70" : "border-border bg-card"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-bold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children
			})
		]
	});
}
function Field({ label, required, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "text-xs font-semibold text-foreground",
				children: [
					label,
					" ",
					required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "*"
					})
				]
			}),
			children,
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium text-destructive",
				children: error
			})
		]
	});
}
var grid = "grid gap-4 sm:grid-cols-2";
function AdmissionForm({ existing }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: packages = [] } = usePackages();
	const { data: colleges = [] } = useColleges();
	const { data: properties = [] } = useProperties();
	const { data: rooms = [] } = useRooms();
	const [form, setForm] = (0, import_react.useState)(() => toForm(existing));
	const [errors, setErrors] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(null);
	const [savedForm, setSavedForm] = (0, import_react.useState)(null);
	const previewSrc = (() => {
		const raw = form.profileImagePath.trim();
		if (!raw) return null;
		if (raw.startsWith("http")) return raw;
		return raw.split("/").map((seg) => encodeURIComponent(seg)).join("/");
	})();
	const activePackages = (0, import_react.useMemo)(() => packages.filter((p) => p.active), [packages]);
	const selectedPackage = activePackages.find((p) => p.packageId === form.packageId);
	const isCustom = (selectedPackage?.packageName ?? form.packageName).toLowerCase().includes("custom");
	/**
	* Filter rooms by the selected student gender.
	*
	* Match logic (case-insensitive):
	*  1. If room has a `gender` field — match "male"/"boys" for Male students,
	*     "female"/"girls" for Female, and always show "any"/"co-ed"/"mixed".
	*  2. If no `gender` field — fall back to title keyword matching.
	*  3. If student gender is not set — show all rooms.
	*/
	const filteredRooms = (0, import_react.useMemo)(() => {
		const g = form.gender.toLowerCase();
		if (!g) return rooms;
		return rooms.filter((room) => {
			const roomGender = (room.gender ?? "").toLowerCase();
			const titleLower = room.title.toLowerCase();
			if ([
				"any",
				"co-ed",
				"mixed",
				"coed",
				"unisex"
			].some((tag) => roomGender === tag || titleLower.includes(tag))) return true;
			if (g === "male") {
				if (roomGender) return [
					"male",
					"boys",
					"boy",
					"gents",
					"men"
				].includes(roomGender);
				return titleLower.includes("boy") || titleLower.includes("male") || titleLower.includes("gents") || titleLower.includes("men");
			}
			if (g === "female") {
				if (roomGender) return [
					"female",
					"girls",
					"girl",
					"ladies",
					"women"
				].includes(roomGender);
				return titleLower.includes("girl") || titleLower.includes("female") || titleLower.includes("ladies") || titleLower.includes("women");
			}
			return true;
		});
	}, [rooms, form.gender]);
	const amount = Number(form.packageAmount || 0);
	const paid = Number(form.amountPaid || 0);
	const balance = Math.max(0, amount - paid);
	const paymentStatus = amount - paid <= 0 && amount > 0 ? "completed" : "pending";
	function set(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function onSelectPackage(packageId) {
		const pkg = activePackages.find((p) => p.packageId === packageId);
		setForm((prev) => ({
			...prev,
			packageId,
			packageName: pkg?.packageName ?? "",
			packageServices: pkg?.services ?? [],
			packageAmount: pkg && pkg.price > 0 ? String(pkg.price) : prev.packageAmount,
			packageEndDate: prev.packageStartDate && pkg?.duration ? addDays(prev.packageStartDate, pkg.duration) : prev.packageEndDate
		}));
	}
	function onStartDate(value) {
		setForm((prev) => ({
			...prev,
			packageStartDate: value,
			packageEndDate: value && selectedPackage?.duration ? addDays(value, selectedPackage.duration) : prev.packageEndDate
		}));
	}
	function validate() {
		const next = {};
		if (!form.fullName.trim()) next.fullName = "Full name is required.";
		if (!form.phoneNumber.trim()) next.phoneNumber = "Phone number is required.";
		else if (!isValidIndianMobile(form.phoneNumber)) next.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
		if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
		if (!form.collegeName) next.collegeName = "College is required.";
		if (!form.admissionDate) next.admissionDate = "Admission date is required.";
		if (paid < 0) next.amountPaid = "Amount paid cannot be negative.";
		setErrors(next);
		if (Object.keys(next).length) toast.error("Please fix the highlighted fields.");
		return Object.keys(next).length === 0;
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (saving) return;
		if (!validate()) return;
		setSaving(true);
		try {
			const admissionId = existing?.admissionId ?? await generateAdmissionId();
			const profileImagePath = form.profileImagePath.trim() || null;
			const payload = {
				admissionId,
				profileImagePath,
				profileImageUrl: profileImagePath,
				fullName: form.fullName.trim(),
				phoneNumber: form.phoneNumber.replace(/\D/g, ""),
				email: form.email.trim(),
				gender: form.gender,
				dateOfBirth: form.dateOfBirth,
				parentName: form.parentName.trim(),
				parentPhone: form.parentPhone.replace(/\D/g, ""),
				parentRelation: form.parentRelation,
				collegeId: form.collegeId,
				collegeName: form.collegeName,
				course: form.course.trim(),
				year: form.year,
				propertyId: form.propertyId,
				propertyName: form.propertyName,
				roomNumber: form.roomNumber.trim(),
				bedNumber: form.bedNumber.trim(),
				admissionDate: form.admissionDate,
				moveInDate: form.moveInDate,
				packageId: form.packageId,
				packageName: form.packageName,
				packageServices: form.packageServices,
				packageAmount: amount,
				packageStartDate: form.packageStartDate,
				packageEndDate: form.packageEndDate,
				amountPaid: paid,
				balanceAmount: balance,
				paymentStatus,
				bagProvided: form.bagProvided,
				tiffinProvided: form.tiffinProvided,
				mattressRequired: form.mattressRequired,
				notes: form.notes.trim()
			};
			if (existing) {
				await updateAdmission(existing.id, payload);
				await queryClient.invalidateQueries({ queryKey: ["admissions"] });
				toast.success("Admission updated");
				navigate({
					to: "/admin/admissions/$admissionId",
					params: { admissionId }
				});
				return;
			}
			await createAdmission(payload);
			await queryClient.invalidateQueries({ queryKey: ["admissions"] });
			setSavedForm({ ...form });
			setSaved(admissionId);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to save admission.");
		} finally {
			setSaving(false);
		}
	}
	function resetForNext() {
		setForm(toForm(null));
		setErrors({});
		setSaved(null);
		setSavedForm(null);
	}
	if (saved && savedForm) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg rounded-2xl border border-success/30 bg-card p-8 text-center shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid size-12 place-items-center rounded-full bg-success/12 text-success",
				children: "✓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-xl font-bold",
				children: "Admission Saved Successfully"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Admission ID"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-lg font-bold text-primary",
				children: saved
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-xl border border-border bg-muted/40 p-4 text-left space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
					children: "Share Fee Receipt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptShareButtons, {
					admissionId: saved,
					formData: savedForm
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({
							to: "/admin/admissions/$admissionId",
							params: { admissionId: saved }
						}),
						children: "View Student"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: resetForNext,
						children: "Add Another Admission"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => navigate({ to: "/admin/dashboard" }),
						children: "Go to Dashboard"
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-5 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Profile Photo",
				description: "Enter the public path to the student's photo (e.g. /Akash/profile.jpg). Place the image inside the public folder.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft ring-1 ring-border",
						children: previewSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: previewSrc,
							alt: "Profile preview",
							className: "size-full object-cover",
							onError: (e) => {
								e.currentTarget.style.display = "none";
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-9 text-primary/50" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-48 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Photo Path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.profileImagePath,
								onChange: (e) => set("profileImagePath", e.target.value),
								placeholder: "/Akash/profile.jpg",
								className: "font-mono text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Path is relative to the ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "font-mono",
										children: "public/"
									}),
									" folder."
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Student Details",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: grid,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full Name",
							required: true,
							error: errors.fullName,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.fullName,
								onChange: (e) => set("fullName", e.target.value),
								placeholder: "Rahul Sharma"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone Number",
							required: true,
							error: errors.phoneNumber,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phoneNumber,
								inputMode: "numeric",
								maxLength: 10,
								onChange: (e) => set("phoneNumber", e.target.value.replace(/\D/g, "")),
								placeholder: "9876543210"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							error: errors.email,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: form.email,
								onChange: (e) => set("email", e.target.value),
								placeholder: "student@example.com"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Gender",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.gender,
								onValueChange: (v) => {
									setForm((prev) => ({
										...prev,
										gender: v,
										propertyId: "",
										propertyName: ""
									}));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select gender" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Male",
										children: "Male"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Female",
										children: "Female"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Other",
										children: "Other"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Date of Birth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DobPicker, {
								value: form.dateOfBirth,
								onChange: (v) => set("dateOfBirth", v)
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Parent / Guardian Details",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: grid,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Parent / Guardian Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.parentName,
								onChange: (e) => set("parentName", e.target.value),
								placeholder: "Ramesh Sharma"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Parent Phone Number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.parentPhone,
								inputMode: "numeric",
								maxLength: 10,
								onChange: (e) => set("parentPhone", e.target.value.replace(/\D/g, "")),
								placeholder: "9876543210"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Relation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.parentRelation,
								onValueChange: (v) => set("parentRelation", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select relation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Father",
										children: "Father"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Mother",
										children: "Mother"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Guardian",
										children: "Guardian"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Sibling",
										children: "Sibling"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Other",
										children: "Other"
									})
								] })]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "College Details",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: grid,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "College / Institution",
							required: true,
							error: errors.collegeName,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.collegeId || form.collegeName,
								onValueChange: (v) => {
									const c = colleges.find((x) => x.collegeId === v);
									setForm((prev) => ({
										...prev,
										collegeId: c?.collegeId ?? "",
										collegeName: c?.collegeName ?? v
									}));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select college" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: colleges.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.collegeId,
									children: c.collegeName
								}, c.collegeId)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Course",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.course,
								onValueChange: (v) => set("course", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select course" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Computer Science Engineering",
										children: "B.Tech Computer Science Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Computer Science & Engineering (AI & ML)",
										children: "B.Tech CSE (AI & ML)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Computer Science & Engineering (Data Science)",
										children: "B.Tech CSE (Data Science)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Computer Science & Engineering (Cyber Security)",
										children: "B.Tech CSE (Cyber Security)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Computer Science & Engineering (IoT)",
										children: "B.Tech CSE (IoT)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Information Technology",
										children: "B.Tech Information Technology"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Electronics & Communication Engineering",
										children: "B.Tech Electronics & Communication Engg."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Electronics & Telecommunication Engineering",
										children: "B.Tech Electronics & Telecom Engg."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Electrical Engineering",
										children: "B.Tech Electrical Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Electrical & Electronics Engineering",
										children: "B.Tech Electrical & Electronics Engg."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Mechanical Engineering",
										children: "B.Tech Mechanical Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Civil Engineering",
										children: "B.Tech Civil Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Chemical Engineering",
										children: "B.Tech Chemical Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Biotechnology",
										children: "B.Tech Biotechnology"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Automobile Engineering",
										children: "B.Tech Automobile Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Aeronautical Engineering",
										children: "B.Tech Aeronautical Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Agricultural Engineering",
										children: "B.Tech Agricultural Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Environmental Engineering",
										children: "B.Tech Environmental Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Production Engineering",
										children: "B.Tech Production Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Industrial Engineering",
										children: "B.Tech Industrial Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Mining Engineering",
										children: "B.Tech Mining Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Metallurgical Engineering",
										children: "B.Tech Metallurgical Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Instrumentation Engineering",
										children: "B.Tech Instrumentation Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Textile Engineering",
										children: "B.Tech Textile Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "B.Tech Petroleum Engineering",
										children: "B.Tech Petroleum Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Other",
										children: "Other"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Year",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.year,
								onValueChange: (v) => set("year", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select year" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									"1st Year",
									"2nd Year",
									"3rd Year",
									"4th Year",
									"5th Year"
								].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: y,
									children: y
								}, y)) })]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Stay Details",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: grid,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Property / PG",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									role: "combobox",
									disabled: !form.gender,
									className: "w-full justify-between font-normal",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: form.propertyId ? filteredRooms.find((r) => r.id === form.propertyId)?.title ?? form.propertyName : !form.gender ? "Select gender first" : filteredRooms.length === 0 ? "No rooms for this gender" : "Search property / PG…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "ml-2 size-4 shrink-0 opacity-50" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
								className: "w-[--radix-popover-trigger-width] p-0",
								align: "start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Type to search rooms…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No rooms found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: filteredRooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: `${r.title}${r.rooms ? ` ${r.rooms}` : ""}`,
									onSelect: () => {
										setForm((prev) => ({
											...prev,
											propertyId: prev.propertyId === r.id ? "" : r.id,
											propertyName: prev.propertyId === r.id ? "" : r.title
										}));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mr-2 size-4", form.propertyId === r.id ? "opacity-100" : "opacity-0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex-1",
										children: [r.title, r.rooms && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 text-xs text-muted-foreground",
											children: ["— ", r.rooms]
										})]
									})]
								}, r.id)) })] })] })
							})] }), !form.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Select a gender above to see matching rooms."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Room Number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.roomNumber,
								onChange: (e) => set("roomNumber", e.target.value),
								placeholder: "A-204"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bed Number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.bedNumber,
								onChange: (e) => set("bedNumber", e.target.value),
								placeholder: "2"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Admission Date",
							required: true,
							error: errors.admissionDate,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.admissionDate,
								onChange: (e) => set("admissionDate", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Move-in Date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.moveInDate,
								onChange: (e) => set("moveInDate", e.target.value)
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Package Allotted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: grid,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Package",
								error: errors.packageName,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.packageId,
									onValueChange: onSelectPackage,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select package" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: activePackages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.packageId,
										children: p.packageName
									}, p.packageId)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Package Start Date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.packageStartDate,
									onChange: (e) => onStartDate(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Package End Date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.packageEndDate,
									onChange: (e) => set("packageEndDate", e.target.value)
								})
							})
						]
					}),
					selectedPackage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-border bg-muted/50 p-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: selectedPackage.packageName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: selectedPackage.services.join(" · ") || "No services listed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground",
								children: [
									formatINR(selectedPackage.price),
									" · ",
									selectedPackage.duration,
									" days"
								]
							})
						]
					}),
					isCustom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-primary/25 bg-brand-soft/60 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold",
								children: "Select Included Services"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid gap-2 sm:grid-cols-3",
								children: SERVICE_OPTIONS.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: form.packageServices.includes(service),
										onCheckedChange: (checked) => set("packageServices", checked ? [...form.packageServices, service] : form.packageServices.filter((s) => s !== service))
									}), service]
								}, service))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: ["Selected: ", form.packageServices.join(", ") || "None"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Payment Details",
				highlight: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Total Package Amount ₹",
							error: errors.packageAmount,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: form.packageAmount,
								onChange: (e) => set("packageAmount", e.target.value.replace(/[^\d]/g, "")),
								placeholder: "15000"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount Paid ₹",
							error: errors.amountPaid,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: form.amountPaid,
								onChange: (e) => set("amountPaid", e.target.value.replace(/[^\d]/g, "")),
								placeholder: "0"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Balance Amount ₹",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: formatINR(balance),
								readOnly: true,
								className: "bg-muted font-semibold"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold", paymentStatus === "completed" ? "bg-success/12 text-success" : "bg-warning/20 text-warning-foreground"),
					children: paymentStatus === "completed" ? "✓ Payment Completed" : "⚠ Payment Pending"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Provided Items",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Bag Provided?",
							value: form.bagProvided,
							onChange: (v) => set("bagProvided", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Tiffin Provided?",
							value: form.tiffinProvided,
							onChange: (v) => set("tiffinProvided", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Mattress Required?",
							value: form.mattressRequired,
							onChange: (v) => set("mattressRequired", v)
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Additional Notes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: form.notes,
					onChange: (e) => set("notes", e.target.value),
					rows: 3,
					maxLength: 1e3,
					placeholder: "Student requested mattress before move-in."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => navigate({ to: "/admin/admissions" }),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					className: "min-w-52",
					children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Saving Admission…"] }) : existing ? "Save Changes →" : "Save Admission →"
				})]
			})
		]
	});
}
function buildReceiptText(admissionId, f) {
	const paid = Number(f.amountPaid || 0);
	const total = Number(f.packageAmount || 0);
	const balance = Math.max(0, total - paid);
	const status = total > 0 && balance <= 0 ? "PAID ✅" : "PENDING ⚠️";
	return [
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		"🏠 *NivasiSpace*",
		"   Admission Fee Receipt",
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		`📋 Admission ID : ${admissionId}`,
		`📅 Date         : ${f.admissionDate}`,
		"",
		"👤 *Student Details*",
		`   Name    : ${f.fullName}`,
		`   Phone   : ${f.phoneNumber}`,
		...f.email ? [`   Email   : ${f.email}`] : [],
		...f.gender ? [`   Gender  : ${f.gender}`] : [],
		"",
		...f.parentName ? [
			"👨‍👩‍👧 *Parent / Guardian*",
			`   Name     : ${f.parentName}`,
			`   Phone    : ${f.parentPhone || "—"}`,
			...f.parentRelation ? [`   Relation : ${f.parentRelation}`] : [],
			""
		] : [],
		"🎓 *College*",
		`   ${f.collegeName}`,
		...f.course ? [`   ${f.course}${f.year ? ` — ${f.year}` : ""}`] : [],
		"",
		"🏠 *Stay*",
		`   Property : ${f.propertyName || "—"}`,
		`   Room     : ${f.roomNumber || "—"}`,
		`   Bed      : ${f.bedNumber || "—"}`,
		...f.moveInDate ? [`   Move-in  : ${f.moveInDate}`] : [],
		"",
		"📦 *Package*",
		`   ${f.packageName || "—"}`,
		...f.packageServices.length ? [`   Services : ${f.packageServices.join(", ")}`] : [],
		...f.packageStartDate ? [`   Period   : ${f.packageStartDate} → ${f.packageEndDate || "—"}`] : [],
		"",
		"💰 *Payment Summary*",
		`   Total Amount  : ₹${total.toLocaleString("en-IN")}`,
		`   Amount Paid   : ₹${paid.toLocaleString("en-IN")}`,
		`   Balance Due   : ₹${balance.toLocaleString("en-IN")}`,
		`   Status        : ${status}`,
		"",
		"━━━━━━━━━━━━━━━━━━━━━━━━",
		"Thank you for choosing NivasiSpace! 🙏",
		"━━━━━━━━━━━━━━━━━━━━━━━━"
	].join("\n");
}
function ReceiptShareButtons({ admissionId, formData }) {
	const text = buildReceiptText(admissionId, formData);
	const encoded = encodeURIComponent(text);
	function downloadPDF() {
		import("./receipt-pdf-C7QXnUd6.mjs").then(({ downloadReceiptPDF }) => {
			const amount = Number(formData.packageAmount || 0);
			const paid = Number(formData.amountPaid || 0);
			const balance = Math.max(0, amount - paid);
			downloadReceiptPDF({
				id: admissionId,
				admissionId,
				fullName: formData.fullName,
				phoneNumber: formData.phoneNumber,
				email: formData.email,
				gender: formData.gender,
				dateOfBirth: formData.dateOfBirth,
				parentName: formData.parentName,
				parentPhone: formData.parentPhone,
				parentRelation: formData.parentRelation,
				collegeName: formData.collegeName,
				course: formData.course,
				year: formData.year,
				propertyName: formData.propertyName,
				roomNumber: formData.roomNumber,
				bedNumber: formData.bedNumber,
				admissionDate: formData.admissionDate,
				moveInDate: formData.moveInDate,
				packageName: formData.packageName,
				packageServices: formData.packageServices,
				packageAmount: amount,
				packageStartDate: formData.packageStartDate,
				packageEndDate: formData.packageEndDate,
				amountPaid: paid,
				balanceAmount: balance,
				paymentStatus: balance <= 0 && amount > 0 ? "completed" : "pending",
				bagProvided: formData.bagProvided,
				tiffinProvided: formData.tiffinProvided,
				mattressRequired: formData.mattressRequired,
				notes: formData.notes
			});
		});
	}
	function shareViaWebShare() {
		if (navigator.share) navigator.share({
			title: `Fee Receipt — ${admissionId}`,
			text
		}).catch(() => {});
		else navigator.clipboard.writeText(text).then(() => toast.success("Receipt copied to clipboard!")).catch(() => toast.error("Could not copy receipt."));
	}
	function openWhatsApp(phone) {
		const clean = phone.replace(/\D/g, "");
		const num = clean.length === 10 ? `91${clean}` : clean;
		window.open(`https://wa.me/${num}?text=${encoded}`, "_blank");
	}
	const studentPhone = formData.phoneNumber.replace(/\D/g, "");
	const parentPhone = formData.parentPhone.replace(/\D/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				className: "w-full justify-start gap-2",
				onClick: downloadPDF,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📄" }), " Download Receipt PDF"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				className: "w-full justify-start gap-2",
				onClick: shareViaWebShare,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋" }), " Copy / Share Receipt"]
			}),
			studentPhone.length >= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				className: "w-full justify-start gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]",
				onClick: () => openWhatsApp(studentPhone),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }),
					" WhatsApp Student (",
					formData.fullName.split(" ")[0],
					")"
				]
			}),
			parentPhone.length >= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				className: "w-full justify-start gap-2 bg-[#128C7E] text-white hover:bg-[#0f7a6d]",
				onClick: () => openWhatsApp(parentPhone),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }),
					" WhatsApp Parent (",
					formData.parentName || "Guardian",
					")"
				]
			})
		]
	});
}
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function DobPicker({ value, onChange }) {
	const [day, setDay] = (0, import_react.useState)(() => value ? String(Number(value.split("-")[2] ?? "")) : "");
	const [month, setMonth] = (0, import_react.useState)(() => value ? String(Number(value.split("-")[1] ?? "")) : "");
	const [year, setYear] = (0, import_react.useState)(() => value ? value.split("-")[0] ?? "" : "");
	function notify(y, m, d) {
		if (y && m && d) onChange(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
	}
	function handleDay(v) {
		setDay(v);
		notify(year, month, v);
	}
	function handleMonth(v) {
		setMonth(v);
		const maxDays = year ? new Date(Number(year), Number(v), 0).getDate() : 31;
		const safeDay = Number(day) > maxDays ? "" : day;
		if (Number(day) > maxDays) setDay("");
		notify(year, v, safeDay);
	}
	function handleYear(v) {
		setYear(v);
		notify(v, month, day);
	}
	const daysInMonth = year && month ? new Date(Number(year), Number(month), 0).getDate() : 31;
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const years = Array.from({ length: 55 }, (_, i) => currentYear - 5 - i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-3 gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: day,
				onValueChange: handleDay,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Day" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Array.from({ length: daysInMonth }, (_, i) => String(i + 1)).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: d,
					children: d
				}, d)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: month,
				onValueChange: handleMonth,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Month" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(i + 1),
					children: m
				}, m)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: year,
				onValueChange: handleYear,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Year" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(y),
					children: y
				}, y)) })]
			})
		]
	});
}
function ToggleRow({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-2",
			children: [true, false].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(option),
				className: cn("flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", value === option ? "gradient-brand text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"),
				children: option ? "Yes" : "No"
			}, String(option)))
		})]
	});
}
//#endregion
export { AdmissionForm as t };
