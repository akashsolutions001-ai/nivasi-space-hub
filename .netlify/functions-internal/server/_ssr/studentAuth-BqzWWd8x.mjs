import { o as __toESM } from "../_runtime.mjs";
import { r as isFirebaseConfigured } from "./firebase-config-IuKIWniX.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as signInWithEmailAndPassword, i as onAuthStateChanged, s as signOut } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { P as collection, S as where, g as limit, h as getDocs, v as query } from "../_libs/@firebase/firestore+[...].mjs";
import { r as getFirebaseAuth, t as getDb } from "./firebase-7zuyzO2h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studentAuth-BqzWWd8x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Student authentication — Firebase Auth (email + parentPhone as password).
*
* Login flow:
*   1. signInWithEmailAndPassword(email, parentPhone)
*   2. On success, query /admissions to get the student's full record
*   3. Store the admission doc ID + name + email in sessionStorage
*
* Account creation:
*   createAdmission() in db.ts also calls createUserWithEmailAndPassword
*   so every student has a real Firebase Auth account from day one.
*/
var SESSION_KEY = "nivasi_student_session";
function loadSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
/** Returns true if there is an active student session (no React context needed) */
function hasStudentSession() {
	return loadSession() !== null;
}
function saveSession(s) {
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
function clearSession() {
	sessionStorage.removeItem(SESSION_KEY);
}
var StudentAuthContext = (0, import_react.createContext)(null);
var AUTH_ERRORS = {
	"auth/invalid-credential": "Incorrect email or password. Your password is your parent / guardian contact number.",
	"auth/invalid-email": "Please enter a valid email address.",
	"auth/user-not-found": "No admission found with this email address. Please contact administration.",
	"auth/wrong-password": "Incorrect password. Your password is your parent / guardian contact number.",
	"auth/user-disabled": "This account has been disabled. Please contact administration.",
	"auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
	"auth/network-request-failed": "Unable to reach the server. Please check your internet connection."
};
function StudentAuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(loadSession);
	const [admission, setAdmission] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!isFirebaseConfigured) {
			setAdmission(null);
			setLoading(false);
			return;
		}
		return onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
			const storedSession = loadSession();
			if (!firebaseUser || !storedSession) {
				if (storedSession) clearSession();
				setSession(null);
				setAdmission(null);
				setLoading(false);
				return;
			}
			try {
				const snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", storedSession.email), limit(1)));
				if (snap.empty) {
					clearSession();
					setSession(null);
					setAdmission(null);
				} else {
					const docSnap = snap.docs[0];
					setSession(storedSession);
					setAdmission(buildAdmission(docSnap.id, docSnap.data()));
				}
			} catch {
				setSession(storedSession);
				setAdmission(null);
			} finally {
				setLoading(false);
			}
		});
	}, []);
	async function loginStudent(email, parentPhone) {
		if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
		const emailTrimmed = email.trim();
		const phoneCleaned = parentPhone.trim().replace(/\D/g, "");
		const { firebaseConfig } = await import("./firebase-config-IuKIWniX.mjs").then((n) => n.n).then((n) => n.n);
		const apiKey = firebaseConfig.apiKey;
		let signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned).catch((err) => ({ error: err }));
		if ("error" in signInResult) {
			const code = signInResult.error?.code ?? "";
			if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
				let admSnap;
				try {
					admSnap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed.toLowerCase()), limit(1)));
					if (admSnap.empty) admSnap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed), limit(1)));
				} catch {
					throw new Error("Unable to reach the server. Please check your internet connection.");
				}
				if (admSnap.empty) throw new Error("No admission found with this email address. Please contact administration.");
				const admData = admSnap.docs[0].data();
				const storedPhone = String(admData["parentPhone"] ?? "").replace(/\D/g, "");
				if (!storedPhone || storedPhone !== phoneCleaned) throw new Error("Incorrect password. Your password is your parent / guardian contact number.");
				const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: emailTrimmed,
						password: phoneCleaned,
						displayName: String(admData["fullName"] ?? ""),
						returnSecureToken: false
					})
				});
				if (!res.ok) {
					if (((await res.json())?.error?.message ?? "") !== "EMAIL_EXISTS") throw new Error("Could not create login account. Please contact administration.");
				}
				signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned).catch((err) => ({ error: err }));
			}
			if ("error" in signInResult) {
				const c = signInResult.error?.code ?? "";
				throw new Error(AUTH_ERRORS[c] ?? "Unable to sign in. Please try again.");
			}
		}
		let snap;
		try {
			snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed.toLowerCase()), limit(1)));
			if (snap.empty) snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed), limit(1)));
		} catch {
			throw new Error("Unable to reach the server. Please check your internet connection.");
		}
		if (snap.empty) throw new Error("Signed in but no admission record found. Please contact administration.");
		const docSnap = snap.docs[0];
		const d = docSnap.data();
		const newSession = {
			studentDocId: docSnap.id,
			fullName: String(d["fullName"] ?? ""),
			email: String(d["email"] ?? emailTrimmed),
			admissionId: String(d["admissionId"] ?? docSnap.id)
		};
		saveSession(newSession);
		setSession(newSession);
		setAdmission(buildAdmission(docSnap.id, d));
	}
	async function logoutStudent() {
		clearSession();
		setSession(null);
		setAdmission(null);
		try {
			if (isFirebaseConfigured) await signOut(getFirebaseAuth());
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAuthContext.Provider, {
		value: {
			session,
			admission,
			loading,
			loginStudent,
			logoutStudent
		},
		children
	});
}
function useStudentAuth() {
	const ctx = (0, import_react.useContext)(StudentAuthContext);
	if (!ctx) throw new Error("useStudentAuth must be used inside StudentAuthProvider");
	return ctx;
}
function buildAdmission(id, d) {
	function toDate(v) {
		if (!v) return null;
		const ts = v;
		return typeof ts.toDate === "function" ? ts.toDate() : null;
	}
	return {
		id,
		admissionId: String(d["admissionId"] ?? id),
		profileImagePath: d["profileImagePath"] ?? null,
		profileImageUrl: d["profileImageUrl"] ?? null,
		fullName: String(d["fullName"] ?? ""),
		phoneNumber: String(d["phoneNumber"] ?? ""),
		email: String(d["email"] ?? ""),
		gender: String(d["gender"] ?? ""),
		dateOfBirth: String(d["dateOfBirth"] ?? ""),
		collegeId: String(d["collegeId"] ?? ""),
		collegeName: String(d["collegeName"] ?? ""),
		course: String(d["course"] ?? ""),
		year: String(d["year"] ?? ""),
		propertyId: String(d["propertyId"] ?? ""),
		propertyName: String(d["propertyName"] ?? ""),
		roomNumber: String(d["roomNumber"] ?? ""),
		bedNumber: String(d["bedNumber"] ?? ""),
		admissionDate: String(d["admissionDate"] ?? ""),
		moveInDate: String(d["moveInDate"] ?? ""),
		packageId: String(d["packageId"] ?? ""),
		packageName: String(d["packageName"] ?? ""),
		packageServices: Array.isArray(d["packageServices"]) ? d["packageServices"] : [],
		packageAmount: Number(d["packageAmount"] ?? 0),
		packageStartDate: String(d["packageStartDate"] ?? ""),
		packageEndDate: String(d["packageEndDate"] ?? ""),
		amountPaid: Number(d["amountPaid"] ?? 0),
		balanceAmount: Number(d["balanceAmount"] ?? 0),
		paymentStatus: d["paymentStatus"] === "completed" ? "completed" : "pending",
		bagProvided: Boolean(d["bagProvided"]),
		bagPaymentCollected: Boolean(d["bagPaymentCollected"]),
		tiffinProvided: Boolean(d["tiffinProvided"]),
		tiffinPaymentCollected: Boolean(d["tiffinPaymentCollected"]),
		mattressRequired: Boolean(d["mattressRequired"]),
		mattressPaymentCollected: Boolean(d["mattressPaymentCollected"]),
		paymentMode: d["paymentMode"] === "online" || d["paymentMode"] === "cash" ? d["paymentMode"] : null,
		notes: String(d["notes"] ?? ""),
		parentName: String(d["parentName"] ?? ""),
		parentPhone: String(d["parentPhone"] ?? ""),
		parentRelation: String(d["parentRelation"] ?? ""),
		...d["messId"] !== void 0 ? { messId: String(d["messId"]) } : {},
		...d["messName"] !== void 0 ? { messName: String(d["messName"]) } : {},
		...d["tiffinStatus"] !== void 0 ? { tiffinStatus: d["tiffinStatus"] } : {},
		...d["laundryId"] !== void 0 ? { laundryId: String(d["laundryId"]) } : {},
		...d["laundryName"] !== void 0 ? { laundryName: String(d["laundryName"]) } : {},
		createdAt: toDate(d["createdAt"]),
		updatedAt: toDate(d["updatedAt"])
	};
}
//#endregion
export { hasStudentSession as n, useStudentAuth as r, StudentAuthProvider as t };
