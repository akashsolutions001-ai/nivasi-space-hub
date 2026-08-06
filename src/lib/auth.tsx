import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth, isFirebaseConfigured } from "./firebase";

// Admin email addresses (passwords live only in Firebase Auth, not in code)
const ADMIN_EMAIL = "admin@nivasispace.com";
const GLOBAL_ADMIN_EMAIL = "globaladmin@nivasispace.com";

const COLLEGE_FILTER_KEY = "nivasi_college_filter";

export interface CollegeFilter {
  type: "engineering" | "medical" | "";
  city: string;
  college: string; // collegeName
}

const EMPTY_FILTER: CollegeFilter = { type: "", city: "", college: "" };

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Only set for Global Admin — the active college/type/city filter */
  collegeFilter: CollegeFilter;
  setCollegeFilter: (f: CollegeFilter) => void;
  /** True when global admin has not yet chosen a college filter this session */
  needsCollegeFilter: boolean;
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

function loadFilter(): CollegeFilter {
  if (typeof window === "undefined") return EMPTY_FILTER;
  try {
    const raw = sessionStorage.getItem(COLLEGE_FILTER_KEY);
    if (!raw) return EMPTY_FILTER;
    return JSON.parse(raw) as CollegeFilter;
  } catch {
    return EMPTY_FILTER;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilterState] = useState<CollegeFilter>(loadFilter);

  function setCollegeFilter(f: CollegeFilter) {
    setCollegeFilterState(f);
    sessionStorage.setItem(COLLEGE_FILTER_KEY, JSON.stringify(f));
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      );
      // Clear stale college filter when global admin logs in
      if (credential.user.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL) {
        sessionStorage.removeItem(COLLEGE_FILTER_KEY);
        setCollegeFilterState(EMPTY_FILTER);
      }
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      console.error("[auth] login failed", error);
      throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in right now. Please try again.");
    }
  }

  async function logout() {
    sessionStorage.removeItem(COLLEGE_FILTER_KEY);
    setCollegeFilterState(EMPTY_FILTER);
    try {
      if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    } catch {
      // ignore
    }
  }

  const configured = isFirebaseConfigured;

  const isGlobalAdminUser = user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL;
  // Show the filter popup when global admin is logged in but hasn't picked a college yet
  const needsCollegeFilter = isGlobalAdminUser && !collegeFilter.college;

  return (
    <AuthContext.Provider
      value={{ user, loading, configured, login, logout, collegeFilter, setCollegeFilter, needsCollegeFilter }}
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
