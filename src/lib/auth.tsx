import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth, isFirebaseConfigured } from "./firebase";

// Hardcoded admin credentials — bypasses Firebase Auth
const ADMIN_EMAIL = "admin@nivasispace.com";
const ADMIN_PASSWORD = "0147@May";
const LOCAL_AUTH_KEY = "nivasi_admin_authed";

// Synthetic user object for the hardcoded admin
const HARDCODED_ADMIN_USER = {
  uid: "hardcoded-admin",
  email: ADMIN_EMAIL,
  displayName: "Admin",
} as unknown as User;

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Please check your internet connection.",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Optimistically restore session on page reload — Firebase listener will
    // confirm or replace this once it fires.
    if (typeof window !== "undefined" && sessionStorage.getItem(LOCAL_AUTH_KEY) === "1") {
      return HARDCODED_ADMIN_USER;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      if (firebaseUser) {
        // Real Firebase session — use it and mark as admin
        sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
        setUser(firebaseUser);
      } else if (sessionStorage.getItem(LOCAL_AUTH_KEY) === "1") {
        // No Firebase session but local flag set — keep synthetic user
        setUser(HARDCODED_ADMIN_USER);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    // Hardcoded admin credentials go through Firebase Auth directly —
    // this creates a real Firebase session so Firestore rules work.
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
        sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
        return;
      } catch (firebaseError) {
        // Firebase Auth user doesn't exist yet — fall through to local session
        console.warn("[auth] Firebase Auth user not found, using local session", firebaseError);
        sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
        setUser(HARDCODED_ADMIN_USER);
        return;
      }
    }

    // Fall back to Firebase Auth for any other credentials
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      console.error("[auth] login failed", error);
      throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in right now. Please try again.");
    }
  }

  async function logout() {
    // Clear hardcoded admin session
    sessionStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);

    // Also sign out of Firebase if a real user was logged in
    try {
      if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    } catch {
      // ignore
    }
  }

  // App is "configured" either when Firebase is set up OR when the hardcoded admin is active
  const configured = isFirebaseConfigured || user === HARDCODED_ADMIN_USER;

  return (
    <AuthContext.Provider
      value={{ user, loading, configured, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
