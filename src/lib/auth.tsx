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

const GLOBAL_ADMIN_EMAIL = "Globaladmin@nivasispace.com";
const GLOBAL_ADMIN_PASSWORD = "16Dec@1980NivasiSpace";

const LOCAL_AUTH_KEY = "nivasi_admin_authed";

// Synthetic user object for the hardcoded admin
const HARDCODED_ADMIN_USER = {
  uid: "hardcoded-admin",
  email: ADMIN_EMAIL,
  displayName: "Admin",
} as unknown as User;

const GLOBAL_ADMIN_USER = {
  uid: "global-admin",
  email: GLOBAL_ADMIN_EMAIL,
  displayName: "Global Admin",
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
    if (typeof window !== "undefined") {
      const key = sessionStorage.getItem(LOCAL_AUTH_KEY);
      if (key === "1") return HARDCODED_ADMIN_USER;
      if (key === "global") return GLOBAL_ADMIN_USER;
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
        sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
        setUser(firebaseUser);
      } else {
        const key = sessionStorage.getItem(LOCAL_AUTH_KEY);
        if (key === "1") setUser(HARDCODED_ADMIN_USER);
        else if (key === "global") setUser(GLOBAL_ADMIN_USER);
        else setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    // Check hardcoded admin credentials first — no Firebase call to avoid 400 errors
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
      setUser(HARDCODED_ADMIN_USER);
      return;
    }

    // Global admin
    if (email.trim() === GLOBAL_ADMIN_EMAIL && password === GLOBAL_ADMIN_PASSWORD) {
      sessionStorage.setItem(LOCAL_AUTH_KEY, "global");
      setUser(GLOBAL_ADMIN_USER);
      return;
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
    sessionStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
    try {
      if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    } catch {
      // ignore
    }
  }

  // App is "configured" for any hardcoded admin or when Firebase is set up
  const configured =
    isFirebaseConfigured ||
    user === HARDCODED_ADMIN_USER ||
    user === GLOBAL_ADMIN_USER;

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

/** Returns true only when the currently logged-in user is the Global Admin. */
export function useIsGlobalAdmin(): boolean {
  const { user } = useAuth();
  return user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL.toLowerCase();
}
