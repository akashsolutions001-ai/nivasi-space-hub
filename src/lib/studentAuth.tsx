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

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";
import type { Admission } from "./types";

// ── Session shape stored in sessionStorage ────────────────────────────────────

export interface StudentSession {
  /** Firestore admissions document ID */
  studentDocId: string;
  fullName: string;
  email: string;
  admissionId: string;
}

const SESSION_KEY = "nivasi_student_session";

function loadSession(): StudentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StudentSession) : null;
  } catch {
    return null;
  }
}

/** Returns true if there is an active student session (no React context needed) */
export function hasStudentSession(): boolean {
  return loadSession() !== null;
}

function saveSession(s: StudentSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface StudentAuthState {
  session: StudentSession | null;
  /** Full admission record — loaded after session is restored */
  admission: Admission | null;
  loading: boolean;
  loginStudent: (email: string, parentPhone: string) => Promise<void>;
  logoutStudent: () => void;
}

const StudentAuthContext = createContext<StudentAuthState | null>(null);

// ── Auth error messages ───────────────────────────────────────────────────────

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential":    "Incorrect email or password. Your password is your parent / guardian contact number.",
  "auth/invalid-email":         "Please enter a valid email address.",
  "auth/user-not-found":        "No admission found with this email address. Please contact administration.",
  "auth/wrong-password":        "Incorrect password. Your password is your parent / guardian contact number.",
  "auth/user-disabled":         "This account has been disabled. Please contact administration.",
  "auth/too-many-requests":     "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed":"Unable to reach the server. Please check your internet connection.",
};

// ── Provider ──────────────────────────────────────────────────────────────────

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StudentSession | null>(loadSession);
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a session, re-fetch the admission doc to get latest data.
  // Also watch Firebase Auth state so logout from another tab clears the session.
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAdmission(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      const storedSession = loadSession();

      if (!firebaseUser || !storedSession) {
        // Not signed in via Firebase Auth — clear any stale session
        if (storedSession) clearSession();
        setSession(null);
        setAdmission(null);
        setLoading(false);
        return;
      }

      // Firebase user exists and we have a session — fetch the admission doc
      try {
        const snap = await getDocs(
          query(
            collection(getDb(), "admissions"),
            where("email", "==", storedSession.email),
            limit(1),
          ),
        );
        if (snap.empty) {
          clearSession();
          setSession(null);
          setAdmission(null);
        } else {
          const docSnap = snap.docs[0]!;
          setSession(storedSession);
          setAdmission(buildAdmission(docSnap.id, docSnap.data() as Record<string, unknown>));
        }
      } catch {
        // Network error — keep session but no full admission data
        setSession(storedSession);
        setAdmission(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loginStudent(email: string, parentPhone: string) {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    const emailTrimmed = email.trim();
    const phoneCleaned = parentPhone.trim().replace(/\D/g, "");

    // 1. Try to sign in. If account doesn't exist yet, create it first.
    const { firebaseConfig } = await import("./firebase-config");
    const apiKey = firebaseConfig.apiKey;

    let signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned)
      .catch((err) => ({ error: err as { code?: string } }));

    // If account doesn't exist, auto-create it via REST then sign in
    if ("error" in signInResult) {
      const code = signInResult.error?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        // First verify admission exists with matching parentPhone
        let admSnap;
        try {
          admSnap = await getDocs(
            query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed.toLowerCase()), limit(1)),
          );
          if (admSnap.empty) {
            admSnap = await getDocs(
              query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed), limit(1)),
            );
          }
        } catch {
          throw new Error("Unable to reach the server. Please check your internet connection.");
        }
        if (admSnap.empty) {
          throw new Error("No admission found with this email address. Please contact administration.");
        }
        const admData = admSnap.docs[0]!.data() as Record<string, unknown>;
        const storedPhone = String(admData["parentPhone"] ?? "").replace(/\D/g, "");
        if (!storedPhone || storedPhone !== phoneCleaned) {
          throw new Error("Incorrect password. Your password is your parent / guardian contact number.");
        }
        // Create the Firebase Auth account via REST
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailTrimmed, password: phoneCleaned, displayName: String(admData["fullName"] ?? ""), returnSecureToken: false }),
          },
        );
        if (!res.ok) {
          const data = await res.json() as { error?: { message?: string } };
          const msg = data?.error?.message ?? "";
          if (msg !== "EMAIL_EXISTS") throw new Error("Could not create login account. Please contact administration.");
        }
        // Now sign in
        signInResult = await signInWithEmailAndPassword(getFirebaseAuth(), emailTrimmed, phoneCleaned)
          .catch((err) => ({ error: err as { code?: string } }));
      }
      if ("error" in signInResult) {
        const c = signInResult.error?.code ?? "";
        throw new Error(AUTH_ERRORS[c] ?? "Unable to sign in. Please try again.");
      }
    }

    // 2. Fetch the admission record from Firestore
    let snap;
    try {
      snap = await getDocs(
        query(
          collection(getDb(), "admissions"),
          where("email", "==", emailTrimmed.toLowerCase()),
          limit(1),
        ),
      );
      if (snap.empty) {
        snap = await getDocs(
          query(
            collection(getDb(), "admissions"),
            where("email", "==", emailTrimmed),
            limit(1),
          ),
        );
      }
    } catch {
      throw new Error("Unable to reach the server. Please check your internet connection.");
    }

    if (snap.empty) {
      throw new Error("Signed in but no admission record found. Please contact administration.");
    }

    const docSnap = snap.docs[0]!;
    const d = docSnap.data() as Record<string, unknown>;
    const newSession: StudentSession = {
      studentDocId: docSnap.id,
      fullName: String(d["fullName"] ?? ""),
      email: String(d["email"] ?? emailTrimmed),
      admissionId: String(d["admissionId"] ?? docSnap.id),
    };

    saveSession(newSession);
    setSession(newSession);
    setAdmission(buildAdmission(docSnap.id, d));
  }

  async function logoutStudent() {
    clearSession();
    setSession(null);
    setAdmission(null);
    try {
      if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    } catch {
      // ignore
    }
  }

  return (
    <StudentAuthContext.Provider value={{ session, admission, loading, loginStudent, logoutStudent }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStudentAuth(): StudentAuthState {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error("useStudentAuth must be used inside StudentAuthProvider");
  return ctx;
}

// ── Admission builder (mirrors db.ts mapAdmission without QueryDocumentSnapshot dep) ──

function buildAdmission(id: string, d: Record<string, unknown>): Admission {
  function toDate(v: unknown): Date | null {
    if (!v) return null;
    const ts = v as { toDate?: () => Date };
    return typeof ts.toDate === "function" ? ts.toDate() : null;
  }
  return {
    id,
    admissionId: String(d["admissionId"] ?? id),
    profileImagePath: (d["profileImagePath"] as string | null) ?? null,
    profileImageUrl: (d["profileImageUrl"] as string | null) ?? null,
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
    packageServices: Array.isArray(d["packageServices"]) ? (d["packageServices"] as string[]) : [],
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
    notes: String(d["notes"] ?? ""),
    parentName: String(d["parentName"] ?? ""),
    parentPhone: String(d["parentPhone"] ?? ""),
    parentRelation: String(d["parentRelation"] ?? ""),
    ...(d["messId"] !== undefined ? { messId: String(d["messId"]) } : {}),
    ...(d["messName"] !== undefined ? { messName: String(d["messName"]) } : {}),
    ...(d["tiffinStatus"] !== undefined ? { tiffinStatus: d["tiffinStatus"] } : {}),
    ...(d["laundryId"] !== undefined ? { laundryId: String(d["laundryId"]) } : {}),
    ...(d["laundryName"] !== undefined ? { laundryName: String(d["laundryName"]) } : {}),
    createdAt: toDate(d["createdAt"]),
    updatedAt: toDate(d["updatedAt"]),
  } as Admission;
}
