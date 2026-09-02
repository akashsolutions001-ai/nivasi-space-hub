import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { getFirebaseAuth, isFirebaseConfigured, getDb } from "./firebase";

const ADMIN_EMAIL = "admin@nivasispace.com";
const GLOBAL_ADMIN_EMAIL = "globaladmin@nivasispace.com";
const COLLEGE_FILTER_KEY = "nivasi_college_filter";

export interface CollegeFilter {
  type: "engineering" | "medical" | "";
  city: string;
  college: string;
}

const EMPTY_FILTER: CollegeFilter = { type: "", city: "", college: "" };

export type UserRole = "admin" | "mess_employee" | "laundry_employee" | "student" | "unknown";

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  userRole: UserRole;
  /** All mess IDs the employee is assigned to */
  employeeMessIds: string[];
  /** All mess names the employee is assigned to (parallel array) */
  employeeMessNames: string[];
  /** All laundry IDs the laundry employee is assigned to */
  employeeLaundryIds: string[];
  /** All laundry names the laundry employee is assigned to (parallel array) */
  employeeLaundryNames: string[];
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  collegeFilter: CollegeFilter;
  setCollegeFilter: (f: CollegeFilter) => void;
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

async function resolveUserRole(firebaseUser: User): Promise<{
  role: UserRole;
  messIds: string[];
  messNames: string[];
  laundryIds: string[];
  laundryNames: string[];
}> {
  try {
    const snap = await getDoc(doc(getDb(), "users", firebaseUser.uid));
    if (!snap.exists()) return { role: "unknown", messIds: [], messNames: [], laundryIds: [], laundryNames: [] };
    const d = snap.data() as Record<string, unknown>;
    const role = (d["role"] as string) ?? "unknown";

    if (role === "mess_employee") {
      const messIds: string[] = Array.isArray(d["messIds"])
        ? (d["messIds"] as string[])
        : d["messId"] ? [d["messId"] as string] : [];
      const messNames: string[] = Array.isArray(d["messNames"])
        ? (d["messNames"] as string[])
        : d["messName"] ? [d["messName"] as string] : [];
      return { role: "mess_employee", messIds, messNames, laundryIds: [], laundryNames: [] };
    }
    if (role === "laundry_employee") {
      const laundryIds: string[] = Array.isArray(d["laundryIds"])
        ? (d["laundryIds"] as string[])
        : d["laundryId"] ? [d["laundryId"] as string] : [];
      const laundryNames: string[] = Array.isArray(d["laundryNames"])
        ? (d["laundryNames"] as string[])
        : d["laundryName"] ? [d["laundryName"] as string] : [];
      return { role: "laundry_employee", messIds: [], messNames: [], laundryIds, laundryNames };
    }
    if (role === "admin") return { role: "admin", messIds: [], messNames: [], laundryIds: [], laundryNames: [] };
    return { role: "unknown", messIds: [], messNames: [], laundryIds: [], laundryNames: [] };
  } catch (err) {
    console.error("[auth] resolveUserRole failed:", err);
    return { role: "unknown", messIds: [], messNames: [], laundryIds: [], laundryNames: [] };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("unknown");
  const [employeeMessIds, setEmployeeMessIds] = useState<string[]>([]);
  const [employeeMessNames, setEmployeeMessNames] = useState<string[]>([]);
  const [employeeLaundryIds, setEmployeeLaundryIds] = useState<string[]>([]);
  const [employeeLaundryNames, setEmployeeLaundryNames] = useState<string[]>([]);
  const [collegeFilter, setCollegeFilterState] = useState<CollegeFilter>(loadFilter);

  function setCollegeFilter(f: CollegeFilter) {
    setCollegeFilterState(f);
    sessionStorage.setItem(COLLEGE_FILTER_KEY, JSON.stringify(f));
  }

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
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
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      if (credential.user.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL) {
        sessionStorage.removeItem(COLLEGE_FILTER_KEY);
        setCollegeFilterState(EMPTY_FILTER);
      }
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in right now. Please try again.");
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(getFirebaseAuth(), provider);
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user") throw new Error("Sign-in cancelled.");
      throw new Error(AUTH_ERRORS[code] ?? "Unable to sign in with Google. Please try again.");
    }
  }

  async function logout() {
    sessionStorage.removeItem(COLLEGE_FILTER_KEY);
    setCollegeFilterState(EMPTY_FILTER);
    try { if (isFirebaseConfigured) await signOut(getFirebaseAuth()); } catch { /* ignore */ }
  }

  const isGlobalAdminUser = user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL;
  const needsCollegeFilter = isGlobalAdminUser && !collegeFilter.college;

  return (
    <AuthContext.Provider value={{
      user, loading, configured: isFirebaseConfigured,
      userRole, employeeMessIds, employeeMessNames,
      employeeLaundryIds, employeeLaundryNames,
      login, loginWithGoogle, logout,
      collegeFilter, setCollegeFilter, needsCollegeFilter,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useIsGlobalAdmin(): boolean {
  const { user } = useAuth();
  return user?.email?.toLowerCase() === GLOBAL_ADMIN_EMAIL.toLowerCase();
}

export function useIsAdmin(): boolean {
  const { userRole, user } = useAuth();
  const email = user?.email?.toLowerCase() ?? "";
  return userRole === "admin" || email === GLOBAL_ADMIN_EMAIL || email === ADMIN_EMAIL;
}

export function useIsMessEmployee(): boolean {
  const { userRole } = useAuth();
  return userRole === "mess_employee";
}

export function useIsLaundryEmployee(): boolean {
  const { userRole } = useAuth();
  return userRole === "laundry_employee";
}
