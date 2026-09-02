import { r as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-config-IuKIWniX.js
var firebase_config_IuKIWniX_exports = /* @__PURE__ */ __exportAll$1({
	n: () => firebase_config_exports,
	r: () => isFirebaseConfigured,
	t: () => firebaseConfig
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var firebase_config_exports = /* @__PURE__ */ __exportAll({
	firebaseConfig: () => firebaseConfig,
	isFirebaseConfigured: () => isFirebaseConfigured
});
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
//#endregion
export { firebase_config_IuKIWniX_exports as n, isFirebaseConfigured as r, firebaseConfig as t };
