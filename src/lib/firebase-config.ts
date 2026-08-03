/**
 * NivasiSpace — Firebase project configuration.
 *
 * These values are PUBLISHABLE (they identify the project, they do not grant
 * access). Access is controlled by Firebase Authentication + Firestore rules.
 *
 * Paste the config object from:
 *   Firebase Console -> Project settings -> Your apps -> Web app -> SDK setup
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDRSIJWgHCexVhqMepsox6V7m4EdhAQfIo",
  authDomain: "nivasispace-7ed76.firebaseapp.com",
  projectId: "nivasispace-7ed76",
  storageBucket: "nivasispace-7ed76.firebasestorage.app",
  messagingSenderId: "98552673378",
  appId: "1:98552673378:web:bb2f0106187cd000198d3b",
  measurementId: "G-CV9WC2ZV8R",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);
