import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as Slot, F as require_jsx_runtime, _ as DialogTrigger, d as DialogClose, f as DialogContent$1, g as DialogTitle$1, h as DialogPortal$1, m as DialogOverlay$1, p as DialogDescription$1, u as Dialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as updateProfile, t as createUserWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { F as doc, P as collection, R as serverTimestamp, S as where, _ as orderBy, b as setDoc, d as addDoc, g as limit, h as getDocs, m as getDoc, v as query, x as updateDoc, y as runTransaction } from "../_libs/@firebase/firestore+[...].mjs";
import { a as isFirebaseConfigured, i as getFirebaseAuth, n as getDb, o as useAuth, s as useIsGlobalAdmin } from "./auth-DbpSDgTm.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as LogOut, E as LayoutDashboard, F as ChevronDown, I as Check, L as Building2, O as GraduationCap, P as ChevronUp, a as Users, b as Package, d as Stethoscope, f as ShieldAlert, g as RefreshCw, m as Settings, n as Wrench, t as X, x as Menu } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-PYWfz-cc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function NivasiLogo({ className, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "gradient-brand grid size-9 shrink-0 place-items-center rounded-xl shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-5",
				fill: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M3.5 10.6 12 4l8.5 6.6",
						stroke: "white",
						strokeWidth: "1.9",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M5.8 12.2V19a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1v-6.8",
						stroke: "white",
						strokeWidth: "1.9",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "14.6",
						r: "1.7",
						fill: "white"
					})
				]
			})
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block font-display text-[15px] font-bold tracking-tight text-foreground",
				children: ["Nivasi", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "Space"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-[10px] font-medium tracking-wide text-muted-foreground",
				children: "Admission Management"
			})]
		})]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, hideCloseButton, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg overflow-hidden", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", hideCloseButton && "hidden"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 md:text-sm", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function toDate(value) {
	if (!value) return null;
	const ts = value;
	return typeof ts?.toDate === "function" ? ts.toDate() : null;
}
function mapAdmission(snap) {
	const d = snap.data();
	return {
		id: snap.id,
		admissionId: d.admissionId ?? snap.id,
		profileImagePath: d.profileImagePath ?? null,
		profileImageUrl: d.profileImageUrl ?? null,
		fullName: d.fullName ?? "",
		phoneNumber: d.phoneNumber ?? "",
		email: d.email ?? "",
		gender: d.gender ?? "",
		dateOfBirth: d.dateOfBirth ?? "",
		collegeId: d.collegeId ?? "",
		collegeName: d.collegeName ?? "",
		course: d.course ?? "",
		year: d.year ?? "",
		propertyId: d.propertyId ?? "",
		propertyName: d.propertyName ?? "",
		roomNumber: d.roomNumber ?? "",
		bedNumber: d.bedNumber ?? "",
		admissionDate: d.admissionDate ?? "",
		moveInDate: d.moveInDate ?? "",
		packageId: d.packageId ?? "",
		packageName: d.packageName ?? "",
		packageServices: Array.isArray(d.packageServices) ? d.packageServices : [],
		packageAmount: Number(d.packageAmount ?? 0),
		packageStartDate: d.packageStartDate ?? "",
		packageEndDate: d.packageEndDate ?? "",
		amountPaid: Number(d.amountPaid ?? 0),
		balanceAmount: Number(d.balanceAmount ?? 0),
		paymentStatus: d.paymentStatus === "completed" ? "completed" : "pending",
		bagProvided: Boolean(d.bagProvided),
		tiffinProvided: Boolean(d.tiffinProvided),
		mattressRequired: Boolean(d.mattressRequired),
		notes: d.notes ?? "",
		parentName: d.parentName ?? "",
		parentPhone: d.parentPhone ?? "",
		parentRelation: d.parentRelation ?? "",
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt)
	};
}
var friendly = (action) => `Unable to ${action}. Please check your connection and try again.`;
async function generateAdmissionId() {
	const db = getDb();
	const counterRef = doc(db, "counters", "admissions");
	const next = await runTransaction(db, async (tx) => {
		const snap = await tx.get(counterRef);
		const value = (snap.exists() ? Number(snap.data().value ?? 0) : 0) + 1;
		tx.set(counterRef, {
			value,
			updatedAt: serverTimestamp()
		}, { merge: true });
		return value;
	});
	return `NS-ADM-${String(next).padStart(6, "0")}`;
}
async function fetchAdmissions() {
	try {
		return (await getDocs(query(collection(getDb(), "admissions"), orderBy("createdAt", "desc")))).docs.map(mapAdmission);
	} catch (error) {
		console.error("[firestore] fetchAdmissions", error);
		throw new Error(friendly("load admissions"));
	}
}
async function fetchAdmission(admissionId) {
	try {
		const first = (await getDocs(query(collection(getDb(), "admissions"), where("admissionId", "==", admissionId), limit(1)))).docs[0];
		if (first) return mapAdmission(first);
		const byDoc = await getDoc(doc(getDb(), "admissions", admissionId));
		return byDoc.exists() ? mapAdmission(byDoc) : null;
	} catch (error) {
		console.error("[firestore] fetchAdmission", error);
		throw new Error(friendly("load this admission"));
	}
}
async function createAdmission(input) {
	try {
		return (await addDoc(collection(getDb(), "admissions"), {
			...input,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		})).id;
	} catch (error) {
		console.error("[firestore] createAdmission", error);
		throw new Error(friendly("save this admission"));
	}
}
async function updateAdmission(id, patch) {
	try {
		await updateDoc(doc(getDb(), "admissions", id), {
			...patch,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateAdmission", error);
		throw new Error(friendly("update this admission"));
	}
}
async function deleteAdmission(id) {
	try {
		await import("../_libs/firebase.mjs").then((n) => n.t).then(({ deleteDoc }) => deleteDoc(doc(getDb(), "admissions", id)));
	} catch (error) {
		console.error("[firestore] deleteAdmission", error);
		throw new Error(friendly("delete this admission"));
	}
}
async function fetchPackages() {
	try {
		return (await getDocs(collection(getDb(), "packages"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				packageId: d.packageId ?? s.id,
				packageName: d.packageName ?? "",
				services: Array.isArray(d.services) ? d.services : [],
				price: Number(d.price ?? 0),
				duration: Number(d.duration ?? 30),
				active: d.active !== false,
				createdAt: toDate(d.createdAt),
				updatedAt: toDate(d.updatedAt)
			};
		}).sort((a, b) => a.packageName.localeCompare(b.packageName));
	} catch (error) {
		console.error("[firestore] fetchPackages", error);
		throw new Error(friendly("load packages"));
	}
}
async function savePackage(pkg, existingId) {
	try {
		if (existingId) {
			await updateDoc(doc(getDb(), "packages", existingId), {
				...pkg,
				updatedAt: serverTimestamp()
			});
			return;
		}
		const ref = doc(collection(getDb(), "packages"));
		await setDoc(ref, {
			...pkg,
			packageId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] savePackage", error);
		throw new Error(friendly("save this package"));
	}
}
async function setPackageActive(id, active) {
	try {
		await updateDoc(doc(getDb(), "packages", id), {
			active,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] setPackageActive", error);
		throw new Error(friendly("update this package"));
	}
}
async function fetchColleges() {
	try {
		return (await getDocs(collection(getDb(), "colleges"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				collegeId: d.collegeId ?? s.id,
				collegeName: d.collegeName ?? "",
				collegeType: d.collegeType ?? "other",
				city: d.city ?? "",
				active: d.active !== false
			};
		}).sort((a, b) => a.collegeName.localeCompare(b.collegeName));
	} catch (error) {
		console.error("[firestore] fetchColleges", error);
		return [];
	}
}
async function addCollege(collegeName, collegeType = "other", city = "") {
	const ref = doc(collection(getDb(), "colleges"));
	await setDoc(ref, {
		collegeId: ref.id,
		collegeName,
		collegeType,
		city,
		active: true,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
async function setCollegeActive(id, active) {
	await updateDoc(doc(getDb(), "colleges", id), {
		active,
		updatedAt: serverTimestamp()
	});
}
async function updateCollege(id, patch) {
	await updateDoc(doc(getDb(), "colleges", id), {
		...patch,
		updatedAt: serverTimestamp()
	});
}
async function fetchCities() {
	try {
		return (await getDocs(collection(getDb(), "cities"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				cityId: d.cityId ?? s.id,
				cityName: d.cityName ?? "",
				active: d.active !== false
			};
		}).sort((a, b) => a.cityName.localeCompare(b.cityName));
	} catch (error) {
		console.error("[firestore] fetchCities", error);
		return [];
	}
}
async function addCity(cityName) {
	const ref = doc(collection(getDb(), "cities"));
	await setDoc(ref, {
		cityId: ref.id,
		cityName,
		active: true,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
async function setCityActive(id, active) {
	await updateDoc(doc(getDb(), "cities", id), {
		active,
		updatedAt: serverTimestamp()
	});
}
async function fetchProperties() {
	try {
		return (await getDocs(collection(getDb(), "properties"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				propertyId: d.propertyId ?? s.id,
				propertyName: d.propertyName ?? d.name ?? "",
				address: d.address ?? "",
				city: d.city ?? "",
				ownerName: d.ownerName ?? "",
				ownerPhone: d.ownerPhone ?? "",
				totalBeds: Number(d.totalBeds ?? 0),
				active: d.active !== false
			};
		}).filter((p) => p.propertyName).sort((a, b) => a.propertyName.localeCompare(b.propertyName));
	} catch (error) {
		console.error("[firestore] fetchProperties", error);
		return [];
	}
}
/** Fetches all documents from the `rooms` collection and returns their details. */
async function fetchRooms() {
	try {
		return (await getDocs(collection(getDb(), "rooms"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				title: d.title ?? "",
				rooms: d.rooms ?? "",
				roomType: d.roomType ?? "",
				gender: d.gender ?? void 0,
				city: d.city ?? "",
				address: d.address ?? "",
				location: d.location ?? "",
				mapLink: d.mapLink ?? "",
				contact: d.contact ?? d.ownerPhone ?? "",
				college: d.college ?? "",
				rent: Number(d.rent ?? 0),
				pricingType: d.pricingType ?? "",
				billInclusion: d.billInclusion ?? "",
				features: Array.isArray(d.features) ? d.features : [],
				note: d.note ?? "",
				description: d.description ?? "",
				subscriptionStatus: d.subscriptionStatus ?? "",
				paymentStatus: d.paymentStatus ?? "",
				roomStatus: d.roomStatus ?? "",
				verificationStatus: d.verificationStatus ?? "",
				visibility: d.visibility ?? "",
				isPublished: d.isPublished ?? false,
				hidden: d.hidden ?? false,
				addedByAdmin: d.addedByAdmin ?? false,
				ownerName: d.ownerName ?? "",
				ownerPhone: d.ownerPhone ?? ""
			};
		}).filter((r) => r.title).sort((a, b) => a.title.localeCompare(b.title));
	} catch (error) {
		console.error("[firestore] fetchRooms", error);
		return [];
	}
}
async function fetchUserProfile(uid) {
	try {
		const snap = await getDoc(doc(getDb(), "users", uid));
		if (!snap.exists()) return null;
		const d = snap.data();
		return {
			uid: d.uid ?? uid,
			email: d.email ?? "",
			displayName: d.displayName ?? "",
			role: d.role ?? "admin",
			collegeId: d.collegeId ?? "",
			collegeName: d.collegeName ?? ""
		};
	} catch (error) {
		console.error("[firestore] fetchUserProfile", error);
		return null;
	}
}
/**
* Creates a new admin user in Firebase Auth and saves their profile to
* the /users collection so they appear in the admin panel.
*/
async function createAdminUser(input) {
	try {
		const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email.trim(), input.password);
		await updateProfile(user, { displayName: input.displayName });
		const userRef = doc(getDb(), "users", user.uid);
		await setDoc(userRef, {
			uid: user.uid,
			email: input.email.trim(),
			displayName: input.displayName,
			role: "admin",
			collegeId: input.collegeId,
			collegeName: input.collegeName,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return user.uid;
	} catch (error) {
		console.error("[firestore] createAdminUser", error);
		const code = error?.code ?? "";
		if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
		if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
		if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
		throw new Error("Could not create the admin account. Please try again.");
	}
}
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
function useCities() {
	return useQuery({
		queryKey: ["cities"],
		queryFn: fetchCities,
		enabled: isFirebaseConfigured
	});
}
function useUserProfile() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["userProfile", user?.uid],
		queryFn: () => fetchUserProfile(user.uid),
		enabled: isFirebaseConfigured && !!user?.uid
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
function CollegeFilterDialog({ open, onOpenChange }) {
	const { setCollegeFilter, collegeFilter } = useAuth();
	const { data: allColleges = [] } = useColleges();
	const [type, setType] = (0, import_react.useState)(collegeFilter.type);
	const [city, setCity] = (0, import_react.useState)(collegeFilter.city);
	const [college, setCollege] = (0, import_react.useState)(collegeFilter.college);
	(0, import_react.useEffect)(() => {
		if (open) {
			setType(collegeFilter.type);
			setCity(collegeFilter.city);
			setCollege(collegeFilter.college);
		}
	}, [open, collegeFilter]);
	const typeMatchedColleges = allColleges.filter((c) => c.active).filter((c) => {
		if (!type) return true;
		return !c.collegeType || c.collegeType === "other" || c.collegeType === type;
	});
	const relevantCities = Array.from(new Set(typeMatchedColleges.map((c) => c.city?.trim() || "Kolhapur"))).sort((a, b) => a.localeCompare(b));
	const effectiveCity = city || (relevantCities.length >= 1 ? relevantCities[0] : "") || "";
	const filteredColleges = typeMatchedColleges.filter((c) => {
		if (!effectiveCity) return true;
		return (c.city?.trim() || "Kolhapur") === effectiveCity;
	});
	function handleTypeChange(v) {
		setType(v);
		setCity("");
		setCollege("");
	}
	function handleConfirm() {
		if (!type || !college) return;
		setCollegeFilter({
			type,
			city: effectiveCity,
			college
		});
		onOpenChange(false);
	}
	const cityOk = relevantCities.length >= 1;
	const canConfirm = Boolean(type && cityOk && college);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v && !collegeFilter.college) return;
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[90vw] max-w-md p-5 overflow-y-auto max-h-[90dvh]",
			hideCloseButton: !collegeFilter.college,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-left space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 shrink-0 text-primary" }), "Select College View"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground leading-snug",
						children: "Choose the college whose admissions you want to manage."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "1. College Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: ["engineering", "medical"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleTypeChange(t),
									className: cn("flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-colors", type === t ? "border-primary bg-brand-soft text-primary" : "border-border bg-card hover:bg-muted/50"),
									children: [t === "engineering" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-5" }), t === "engineering" ? "Engineering" : "Medical"]
								}, t))
							})]
						}),
						type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "2. City"
							}), relevantCities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground",
								children: [
									"No ",
									type,
									" colleges added yet. Go to Settings to add some."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: effectiveCity || "",
								onValueChange: (v) => {
									setCity(v);
									setCollege("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a city" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: relevantCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c,
									children: c
								}, c)) })]
							})]
						}),
						type && cityOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "3. College"
							}), filteredColleges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground",
								children: [
									"No colleges found for ",
									effectiveCity,
									". Add them in Settings."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: college || "",
								onValueChange: setCollege,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full text-left whitespace-normal h-auto min-h-[44px] py-2 px-3 text-xs [&>span]:line-clamp-2 [&>span]:whitespace-normal",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a college" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									className: "w-[var(--radix-select-trigger-width)] max-h-60",
									children: filteredColleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.collegeName,
										className: "py-2.5 text-xs whitespace-normal break-words pr-8 leading-snug",
										children: c.collegeName
									}, c.id))
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full mt-2",
					disabled: !canConfirm,
					onClick: handleConfirm,
					children: "View Admissions"
				})
			]
		})
	});
}
/**
* Sidebar chip — shows the active college filter and lets global admin change it.
*/
function CollegeFilterChip() {
	const { collegeFilter } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!collegeFilter.college) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "w-full rounded-xl border border-primary/30 bg-brand-soft/60 px-3 py-2 text-left transition-colors hover:bg-brand-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold uppercase tracking-wide text-primary/70",
				children: "Viewing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs font-semibold text-primary break-words leading-snug",
				children: collegeFilter.college
			}),
			collegeFilter.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: collegeFilter.city
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-2.5" }), "Tap to change"]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterDialog, {
		open,
		onOpenChange: setOpen
	})] });
}
var Sheet = Dialog$1;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var NAV = [
	{
		label: "Dashboard",
		to: "/admin/dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Admissions",
		to: "/admin/admissions",
		icon: Users
	},
	{
		label: "Properties",
		to: "/admin/properties",
		icon: Building2
	},
	{
		label: "Packages",
		to: "/admin/packages",
		icon: Package
	},
	{
		label: "Settings",
		to: "/admin/settings",
		icon: Settings
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = pathname.startsWith(item.to);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "gradient-brand text-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-[18px]" }), item.label]
			}, item.to);
		})
	});
}
function AccountBlock({ onNavigate }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	async function handleLogout() {
		onNavigate?.();
		await logout();
		navigate({
			to: "/admin/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-sidebar-border bg-brand-soft/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs font-semibold text-foreground",
				children: user?.displayName || "NivasiSpace Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[11px] text-muted-foreground",
				children: user?.email
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleLogout,
				className: "mt-2 h-8 w-full justify-start gap-2 px-2 text-xs text-muted-foreground hover:text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Log out"]
			})
		]
	});
}
function SidebarInner({ onNavigate }) {
	const isGlobalAdmin = useIsGlobalAdmin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-4 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, { className: "px-1" }),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterChip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBlock, { onNavigate })
		]
	});
}
function AdminShell({ title, subtitle, action, children }) {
	const { user, loading, configured, needsCollegeFilter } = useAuth();
	const isGlobalAdmin = useIsGlobalAdmin();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isGlobalAdmin && needsCollegeFilter) setFilterOpen(true);
	}, [isGlobalAdmin, needsCollegeFilter]);
	(0, import_react.useEffect)(() => {
		if (!loading && configured && !user) navigate({
			to: "/admin/login",
			replace: true
		});
	}, [
		loading,
		configured,
		user,
		navigate
	]);
	if (!configured) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupNotice, {});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen space-y-4 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
	});
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-72 bg-sidebar p-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "sr-only",
								children: "Navigation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setOpen(false) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NivasiLogo, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-3 py-5 sm:px-5 lg:px-6 lg:py-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-xl font-bold sm:text-2xl lg:text-[28px]",
									children: title
								}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground sm:text-sm",
									children: subtitle
								})]
							}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: action
							})]
						}), children]
					})
				})]
			}),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeFilterDialog, {
				open: filterOpen,
				onOpenChange: setFilterOpen
			})
		]
	});
}
function SetupNotice() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg rounded-2xl border border-border bg-card p-8 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Connect your Firebase project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The NivasiSpace Admission Management System is ready, but it still needs your Firebase project details before staff can sign in and admissions can be saved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 rounded-xl bg-muted p-3 font-mono text-xs text-muted-foreground",
					children: "src/lib/firebase-config.ts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Paste the web app config from Firebase Console → Project settings → Your apps, and the whole system comes online."
				})
			]
		})
	});
}
//#endregion
export { setPackageActive as A, deleteAdmission as C, savePackage as D, generateAdmissionId as E, useColleges as F, usePackages as I, useProperties as L, updateCollege as M, useAdmissions as N, setCityActive as O, useCities as P, useRooms as R, createAdmission as S, filterByPeriod as T, addCollege as _, DialogFooter as a, computeStats as b, NivasiLogo as c, SelectItem as d, SelectTrigger as f, addCity as g, Skeleton as h, DialogContent as i, updateAdmission as j, setCollegeActive as k, Select as l, SetupNotice as m, Button as n, DialogHeader as o, SelectValue as p, Dialog as r, DialogTitle as s, AdminShell as t, SelectContent as u, buttonVariants as v, fetchAdmission as w, createAdminUser as x, cn as y, useUserProfile as z };
