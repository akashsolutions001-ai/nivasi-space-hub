import { o as __toESM } from "../_runtime.mjs";
import { r as isFirebaseConfigured } from "./firebase-config-IuKIWniX.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as signInWithEmailAndPassword, i as onAuthStateChanged, o as signInWithPopup, s as signOut, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { C as where, F as collection, I as doc, _ as onSnapshot, g as limit, h as getDocs, m as getDoc, y as query } from "../_libs/@firebase/firestore+[...].mjs";
import { r as getFirebaseAuth, t as getDb } from "./firebase-7zuyzO2h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studentAuth-D19cUah4.js
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
	"auth/user-not-found": "No account found with this email address. Please contact administration.",
	"auth/wrong-password": "Incorrect password. Your password is your parent / guardian contact number.",
	"auth/user-disabled": "This account has been disabled. Please contact administration.",
	"auth/too-many-requests": "Too many login attempts. Please wait a moment and try again.",
	"auth/network-request-failed": "Network connection issue. Please check your internet connection.",
	"auth/popup-closed-by-user": "Sign in popup was closed. Please try again."
};
function StudentAuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(loadSession);
	const [admission, setAdmission] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const docUnsubRef = (0, import_react.useRef)(null);
	const subscribeToAdmissionDoc = (docId, currentSession) => {
		if (docUnsubRef.current) {
			docUnsubRef.current();
			docUnsubRef.current = null;
		}
		const docRef = doc(getDb(), "admissions", docId);
		const unsub = onSnapshot(docRef, (docSnap) => {
			if (!docSnap.exists()) setAdmission(null);
			else {
				const d = docSnap.data();
				const built = buildAdmission(docSnap.id, d);
				setAdmission(built);
				const updatedSession = {
					studentDocId: docSnap.id,
					fullName: built.fullName || currentSession.fullName,
					email: built.email || currentSession.email,
					admissionId: built.admissionId || currentSession.admissionId
				};
				saveSession(updatedSession);
				setSession(updatedSession);
			}
			setLoading(false);
		}, (err) => {
			console.warn("[studentAuth] snapshot error:", err);
			setLoading(false);
		});
		docUnsubRef.current = unsub;
	};
	const resolveAndSubscribe = async (storedSession) => {
		const db = getDb();
		if (storedSession.studentDocId) try {
			if ((await getDoc(doc(db, "admissions", storedSession.studentDocId))).exists()) {
				subscribeToAdmissionDoc(storedSession.studentDocId, storedSession);
				return;
			}
		} catch (err) {
			console.warn("[studentAuth] direct getDoc error:", err);
		}
		const emailCandidate = storedSession.email.trim();
		let snap;
		try {
			snap = await getDocs(query(collection(db, "admissions"), where("email", "==", emailCandidate.toLowerCase()), limit(1)));
			if (snap.empty) snap = await getDocs(query(collection(db, "admissions"), where("email", "==", emailCandidate), limit(1)));
			if (snap.empty && storedSession.admissionId) snap = await getDocs(query(collection(db, "admissions"), where("admissionId", "==", storedSession.admissionId), limit(1)));
		} catch (queryErr) {
			console.warn("[studentAuth] query error:", queryErr);
			setLoading(false);
			return;
		}
		if (!snap || snap.empty) {
			clearSession();
			setSession(null);
			setAdmission(null);
			setLoading(false);
			return;
		}
		const docSnap = snap.docs[0];
		subscribeToAdmissionDoc(docSnap.id, {
			...storedSession,
			studentDocId: docSnap.id
		});
	};
	(0, import_react.useEffect)(() => {
		if (!isFirebaseConfigured) {
			setAdmission(null);
			setLoading(false);
			return;
		}
		const unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
			const storedSession = loadSession();
			if (!firebaseUser || !storedSession) {
				if (docUnsubRef.current) {
					docUnsubRef.current();
					docUnsubRef.current = null;
				}
				if (storedSession) clearSession();
				setSession(null);
				setAdmission(null);
				setLoading(false);
				return;
			}
			await resolveAndSubscribe(storedSession);
		});
		return () => {
			unsubscribeAuth();
			if (docUnsubRef.current) {
				docUnsubRef.current();
				docUnsubRef.current = null;
			}
		};
	}, []);
	async function refreshAdmission() {
		const s = loadSession();
		if (s) await resolveAndSubscribe(s);
	}
	async function loginStudent(email, parentPhone) {
		if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
		const emailTrimmed = email.trim();
		const phoneCleaned = parentPhone.trim().replace(/\D/g, "");
		let signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned).catch((err) => ({ error: err }));
		if ("error" in signInResult) {
			const code = signInResult.error?.code ?? "";
			if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
				const { firebaseConfig } = await import("./firebase-config-IuKIWniX.mjs").then((n) => n.n).then((n) => n.n);
				const apiKey = firebaseConfig.apiKey;
				try {
					const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: emailTrimmed,
							password: phoneCleaned,
							returnSecureToken: false
						})
					});
					if (res.ok) signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned).catch((err) => ({ error: err }));
					else if (((await res.json())?.error?.message ?? "") === "EMAIL_EXISTS") throw new Error("Incorrect password. If you previously registered using Google, please click 'Continue with Google'.");
				} catch (autoCreateErr) {
					if (autoCreateErr instanceof Error && autoCreateErr.message.includes("Continue with Google")) throw autoCreateErr;
				}
			}
			if ("error" in signInResult) {
				const c = signInResult.error?.code ?? "";
				throw new Error(AUTH_ERRORS[c] ?? "Incorrect email or password. Your password is your parent / guardian contact number.");
			}
		}
		let snap;
		try {
			snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed.toLowerCase()), limit(1)));
			if (snap.empty) snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed), limit(1)));
		} catch (firestoreErr) {
			console.error("[studentAuth] load admission error:", firestoreErr);
			throw new Error("Signed in, but could not load admission profile. Please contact administration.");
		}
		if (snap.empty) throw new Error("Signed in, but no admission record matches this email address. Please contact administration.");
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
		subscribeToAdmissionDoc(docSnap.id, newSession);
	}
	async function loginStudentWithGoogle() {
		if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		const userCredential = await signInWithPopup(getFirebaseAuth(), provider);
		const googleEmail = userCredential.user.email?.trim() ?? "";
		if (!googleEmail) throw new Error("Could not retrieve email from Google account.");
		let snap;
		try {
			snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", googleEmail.toLowerCase()), limit(1)));
			if (snap.empty) snap = await getDocs(query(collection(getDb(), "admissions"), where("email", "==", googleEmail), limit(1)));
		} catch (firestoreErr) {
			console.error("[studentAuth] google login firestore error:", firestoreErr);
			throw new Error("Signed in with Google, but could not load admission profile. Please contact administration.");
		}
		if (snap.empty) {
			await signOut(getFirebaseAuth());
			throw new Error(`No admission record found for Google account (${googleEmail}). Please use the email provided on your admission form.`);
		}
		const docSnap = snap.docs[0];
		const d = docSnap.data();
		const newSession = {
			studentDocId: docSnap.id,
			fullName: String(d["fullName"] ?? userCredential.user.displayName ?? ""),
			email: String(d["email"] ?? googleEmail),
			admissionId: String(d["admissionId"] ?? docSnap.id)
		};
		saveSession(newSession);
		setSession(newSession);
		setAdmission(buildAdmission(docSnap.id, d));
		subscribeToAdmissionDoc(docSnap.id, newSession);
	}
	async function logoutStudent() {
		if (docUnsubRef.current) {
			docUnsubRef.current();
			docUnsubRef.current = null;
		}
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
			loginStudentWithGoogle,
			logoutStudent,
			refreshAdmission
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
		mealPreference: d["mealPreference"] === "veg" || d["mealPreference"] === "non-veg" ? d["mealPreference"] : void 0,
		notes: String(d["notes"] ?? ""),
		parentName: String(d["parentName"] ?? ""),
		parentPhone: String(d["parentPhone"] ?? ""),
		parentRelation: String(d["parentRelation"] ?? ""),
		messId: typeof d["messId"] === "string" ? d["messId"] : "",
		messName: typeof d["messName"] === "string" ? d["messName"] : "",
		tiffinStatus: d["tiffinStatus"] || "",
		laundryId: typeof d["laundryId"] === "string" ? d["laundryId"] : "",
		laundryName: typeof d["laundryName"] === "string" ? d["laundryName"] : "",
		laundryStatus: d["laundryStatus"] || "",
		createdAt: toDate(d["createdAt"]),
		updatedAt: toDate(d["updatedAt"])
	};
}
//#endregion
export { hasStudentSession as n, useStudentAuth as r, StudentAuthProvider as t };
