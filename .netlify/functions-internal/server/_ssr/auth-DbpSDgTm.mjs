import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { a as signOut, i as signInWithEmailAndPassword, n as getAuth, r as onAuthStateChanged } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { L as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DbpSDgTm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* NivasiSpace — Firebase project configuration.
*
* These values are PUBLISHABLE (they identify the project, they do not grant
* access). Access is controlled by Firebase Authentication + Firestore rules.
*
* Paste the config object from:
*   Firebase Console -> Project settings -> Your apps -> Web app -> SDK setup
*/
var firebaseConfig = {
	apiKey: "AIzaSyDRSIJWgHCexVhqMepsox6V7m4EdhAQfIo",
	authDomain: "nivasispace-7ed76.firebaseapp.com",
	projectId: "nivasispace-7ed76",
	storageBucket: "nivasispace-7ed76.firebasestorage.app",
	messagingSenderId: "98552673378",
	appId: "1:98552673378:web:bb2f0106187cd000198d3b",
	measurementId: "G-CV9WC2ZV8R"
};
var isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
var app = null;
function getFirebaseApp() {
	if (!isFirebaseConfigured) throw new Error("FIREBASE_NOT_CONFIGURED");
	if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
	return app;
}
function getFirebaseAuth() {
	return getAuth(getFirebaseApp());
}
function getDb() {
	return getFirestore(getFirebaseApp());
}
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
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
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
		return onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
			setUser(firebaseUser);
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
			console.error("[auth] login failed", error);
			throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in right now. Please try again.");
		}
	}
	async function logout() {
		sessionStorage.removeItem(COLLEGE_FILTER_KEY);
		setCollegeFilterState(EMPTY_FILTER);
		try {
			if (isFirebaseConfigured) await signOut(getFirebaseAuth());
		} catch {}
	}
	const configured = isFirebaseConfigured;
	const needsCollegeFilter = user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL && !collegeFilter.college;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading,
			configured,
			login,
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
/** Returns true only when the currently logged-in user is the Global Admin. */
function useIsGlobalAdmin() {
	const { user } = useAuth();
	return user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL.toLowerCase();
}
//#endregion
export { isFirebaseConfigured as a, getFirebaseAuth as i, getDb as n, useAuth as o, getFirebaseApp as r, useIsGlobalAdmin as s, AuthProvider as t };
