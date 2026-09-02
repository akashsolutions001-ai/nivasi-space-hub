import { r as isFirebaseConfigured, t as firebaseConfig } from "./firebase-config-IuKIWniX.mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { r as getAuth } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { L as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-7zuyzO2h.js
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
//#endregion
export { getFirebaseApp as n, getFirebaseAuth as r, getDb as t };
