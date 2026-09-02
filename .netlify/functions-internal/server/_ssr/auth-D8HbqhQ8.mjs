import { o as __toESM } from "../_runtime.mjs";
import { r as isFirebaseConfigured } from "./firebase-config-IuKIWniX.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as signInWithEmailAndPassword, i as onAuthStateChanged, o as signInWithPopup, s as signOut, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { F as doc, m as getDoc } from "../_libs/@firebase/firestore+[...].mjs";
import { r as getFirebaseAuth, t as getDb } from "./firebase-7zuyzO2h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D8HbqhQ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_EMAIL = "admin@nivasispace.com";
var GLOBAL_ADMIN_EMAIL = "globaladmin@nivasispace.com";
var COLLEGE_FILTER_KEY = "nivasi_college_filter";
var EMPTY_FILTER = {
	type: "",
	city: "",
	college: ""
};
var AuthContext = (0, import_react.createContext)(null);
var AUTH_ERRORS = {
	"auth/invalid-credential": "Incorrect email or password.",
	"auth/invalid-email": "Please enter a valid email address.",
	"auth/user-not-found": "Incorrect email or password.",
	"auth/wrong-password": "Incorrect email or password.",
	"auth/user-disabled": "This account has been disabled.",
	"auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
	"auth/network-request-failed": "Please check your internet connection."
};
function loadFilter() {
	if (typeof window === "undefined") return EMPTY_FILTER;
	try {
		const raw = sessionStorage.getItem(COLLEGE_FILTER_KEY);
		if (!raw) return EMPTY_FILTER;
		return JSON.parse(raw);
	} catch {
		return EMPTY_FILTER;
	}
}
async function resolveUserRole(firebaseUser) {
	try {
		const snap = await getDoc(doc(getDb(), "users", firebaseUser.uid));
		if (!snap.exists()) return {
			role: "unknown",
			messIds: [],
			messNames: [],
			laundryIds: [],
			laundryNames: []
		};
		const d = snap.data();
		const role = d["role"] ?? "unknown";
		if (role === "mess_employee") return {
			role: "mess_employee",
			messIds: Array.isArray(d["messIds"]) ? d["messIds"] : d["messId"] ? [d["messId"]] : [],
			messNames: Array.isArray(d["messNames"]) ? d["messNames"] : d["messName"] ? [d["messName"]] : [],
			laundryIds: [],
			laundryNames: []
		};
		if (role === "laundry_employee") return {
			role: "laundry_employee",
			messIds: [],
			messNames: [],
			laundryIds: Array.isArray(d["laundryIds"]) ? d["laundryIds"] : d["laundryId"] ? [d["laundryId"]] : [],
			laundryNames: Array.isArray(d["laundryNames"]) ? d["laundryNames"] : d["laundryName"] ? [d["laundryName"]] : []
		};
		if (role === "admin") return {
			role: "admin",
			messIds: [],
			messNames: [],
			laundryIds: [],
			laundryNames: []
		};
		return {
			role: "unknown",
			messIds: [],
			messNames: [],
			laundryIds: [],
			laundryNames: []
		};
	} catch (err) {
		console.error("[auth] resolveUserRole failed:", err);
		return {
			role: "unknown",
			messIds: [],
			messNames: [],
			laundryIds: [],
			laundryNames: []
		};
	}
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [userRole, setUserRole] = (0, import_react.useState)("unknown");
	const [employeeMessIds, setEmployeeMessIds] = (0, import_react.useState)([]);
	const [employeeMessNames, setEmployeeMessNames] = (0, import_react.useState)([]);
	const [employeeLaundryIds, setEmployeeLaundryIds] = (0, import_react.useState)([]);
	const [employeeLaundryNames, setEmployeeLaundryNames] = (0, import_react.useState)([]);
	const [collegeFilter, setCollegeFilterState] = (0, import_react.useState)(loadFilter);
	function setCollegeFilter(f) {
		setCollegeFilterState(f);
		sessionStorage.setItem(COLLEGE_FILTER_KEY, JSON.stringify(f));
	}
	(0, import_react.useEffect)(() => {
		if (!isFirebaseConfigured) {
			setLoading(false);
			return;
		}
		return onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
			setUser(firebaseUser);
			if (firebaseUser) {
				const email = firebaseUser.email?.toLowerCase() ?? "";
				if (email === GLOBAL_ADMIN_EMAIL || email === ADMIN_EMAIL) {
					setUserRole("admin");
					setEmployeeMessIds([]);
					setEmployeeMessNames([]);
					setEmployeeLaundryIds([]);
					setEmployeeLaundryNames([]);
				} else {
					const { role, messIds, messNames, laundryIds, laundryNames } = await resolveUserRole(firebaseUser);
					setUserRole(role);
					setEmployeeMessIds(messIds);
					setEmployeeMessNames(messNames);
					setEmployeeLaundryIds(laundryIds);
					setEmployeeLaundryNames(laundryNames);
				}
			} else {
				setUserRole("unknown");
				setEmployeeMessIds([]);
				setEmployeeMessNames([]);
				setEmployeeLaundryIds([]);
				setEmployeeLaundryNames([]);
			}
			setLoading(false);
		});
	}, []);
	async function login(email, password) {
		try {
			if ((await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)).user.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL) {
				sessionStorage.removeItem(COLLEGE_FILTER_KEY);
				setCollegeFilterState(EMPTY_FILTER);
			}
		} catch (error) {
			const code = error?.code ?? "";
			throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in right now. Please try again.");
		}
	}
	async function loginWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(getFirebaseAuth(), provider);
		} catch (error) {
			const code = error?.code ?? "";
			if (code === "auth/popup-closed-by-user") throw new Error("Sign-in cancelled.");
			throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in with Google. Please try again.");
		}
	}
	async function logout() {
		sessionStorage.removeItem(COLLEGE_FILTER_KEY);
		setCollegeFilterState(EMPTY_FILTER);
		try {
			if (isFirebaseConfigured) await signOut(getFirebaseAuth());
		} catch {}
	}
	const needsCollegeFilter = user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL && !collegeFilter.college;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading,
			configured: isFirebaseConfigured,
			userRole,
			employeeMessIds,
			employeeMessNames,
			employeeLaundryIds,
			employeeLaundryNames,
			login,
			loginWithGoogle,
			logout,
			collegeFilter,
			setCollegeFilter,
			needsCollegeFilter
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
function useIsGlobalAdmin() {
	const { user } = useAuth();
	return user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL.toLowerCase();
}
function useIsMessEmployee() {
	const { userRole } = useAuth();
	return userRole === "mess_employee";
}
function useIsLaundryEmployee() {
	const { userRole } = useAuth();
	return userRole === "laundry_employee";
}
//#endregion
export { useIsMessEmployee as a, useIsLaundryEmployee as i, useAuth as n, useIsGlobalAdmin as r, AuthProvider as t };
