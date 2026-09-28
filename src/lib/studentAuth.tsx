/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
  type Unsubscribe,
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
  /** Full admission record — loaded after session is restored and synced live via Firestore onSnapshot */
  admission: Admission | null;
  loading: boolean;
  loginStudent: (email: string, parentPhone: string) => Promise<void>;
  loginStudentWithGoogle: () => Promise<void>;
  logoutStudent: () => void;
  refreshAdmission: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthState | null>(null);

// ── Auth error messages ───────────────────────────────────────────────────────

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential":
    "Incorrect email or password. Your password is your parent / guardian contact number.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email address. Please contact administration.",
  "auth/wrong-password":
    "Incorrect password. Your password is your parent / guardian contact number.",
  "auth/user-disabled": "This account has been disabled. Please contact administration.",
  "auth/too-many-requests": "Too many login attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network connection issue. Please check your internet connection.",
  "auth/popup-closed-by-user": "Sign in popup was closed. Please try again.",
};

// ── Provider ──────────────────────────────────────────────────────────────────

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StudentSession | null>(loadSession);
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [loading, setLoading] = useState(true);
  const docUnsubRef = useRef<Unsubscribe | null>(null);

  // Helper to subscribe in real-time to the student's admission doc
  const subscribeToAdmissionDoc = (docId: string, currentSession: StudentSession) => {
    if (docUnsubRef.current) {
      docUnsubRef.current();
      docUnsubRef.current = null;
    }

    const docRef = doc(getDb(), "admissions", docId);
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setAdmission(null);
        } else {
          const d = docSnap.data() as Record<string, unknown>;
          const built = buildAdmission(docSnap.id, d);
          setAdmission(built);

          const updatedSession: StudentSession = {
            studentDocId: docSnap.id,
            fullName: built.fullName || currentSession.fullName,
            email: built.email || currentSession.email,
            admissionId: built.admissionId || currentSession.admissionId,
          };
          saveSession(updatedSession);
          setSession(updatedSession);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("[studentAuth] snapshot error:", err);
        setLoading(false);
      },
    );

    docUnsubRef.current = unsub;
  };

  const resolveAndSubscribe = async (storedSession: StudentSession) => {
    const db = getDb();

    // 1. Try direct doc ID first if present
    if (storedSession.studentDocId) {
      try {
        const directSnap = await getDoc(doc(db, "admissions", storedSession.studentDocId));
        if (directSnap.exists()) {
          subscribeToAdmissionDoc(storedSession.studentDocId, storedSession);
          return;
        }
      } catch (err) {
        console.warn("[studentAuth] direct getDoc error:", err);
      }
    }

    // 2. Fallback to searching by lowercase email, then original email, then admissionId
    const emailCandidate = storedSession.email.trim();
    let snap;
    try {
      snap = await getDocs(
        query(
          collection(db, "admissions"),
          where("email", "==", emailCandidate.toLowerCase()),
          limit(1),
        ),
      );
      if (snap.empty) {
        snap = await getDocs(
          query(collection(db, "admissions"), where("email", "==", emailCandidate), limit(1)),
        );
      }
      if (snap.empty && storedSession.admissionId) {
        snap = await getDocs(
          query(
            collection(db, "admissions"),
            where("admissionId", "==", storedSession.admissionId),
            limit(1),
          ),
        );
      }
    } catch (queryErr) {
      console.warn("[studentAuth] query error:", queryErr);
      setLoading(false);
      return;
    }

    if (!snap || snap.empty) {
      clearSession();
      setSession(null);
      setAdmission(null);
      setLoading(false);
      return;
    }

    const docSnap = snap.docs[0]!;
    subscribeToAdmissionDoc(docSnap.id, {
      ...storedSession,
      studentDocId: docSnap.id,
    });
  };

  // Watch Firebase Auth state and set up real-time Firestore listener
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAdmission(null);
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      const storedSession = loadSession();

      if (!firebaseUser || !storedSession) {
        if (docUnsubRef.current) {
          docUnsubRef.current();
          docUnsubRef.current = null;
        }
        if (storedSession) clearSession();
        setSession(null);
        setAdmission(null);
        setLoading(false);
        return;
      }

      // User exists with session — resolve doc and attach real-time snapshot
      await resolveAndSubscribe(storedSession);
    });

    return () => {
      unsubscribeAuth();
      if (docUnsubRef.current) {
        docUnsubRef.current();
        docUnsubRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function refreshAdmission() {
    const s = loadSession();
    if (s) {
      await resolveAndSubscribe(s);
    }
  }

  async function loginStudent(email: string, parentPhone: string) {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    const emailTrimmed = email.trim();
    const phoneCleaned = parentPhone.trim().replace(/\D/g, "");

    // 1. Try to sign in with email and parentPhone
    let signInResult = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      emailTrimmed,
      phoneCleaned,
    ).catch((err) => ({ error: err as { code?: string; message?: string } }));

    // If account doesn't exist, try auto-create via REST then sign in
    if ("error" in signInResult) {
      const code = signInResult.error?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        const { firebaseConfig } = await import("./firebase-config");
        const apiKey = firebaseConfig.apiKey;

        try {
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: emailTrimmed,
                password: phoneCleaned,
                returnSecureToken: false,
              }),
            },
          );
          if (res.ok) {
            signInResult = await signInWithEmailAndPassword(
              getFirebaseAuth(),
              emailTrimmed,
              phoneCleaned,
            ).catch((err) => ({ error: err as { code?: string } }));
          } else {
            const data = (await res.json()) as { error?: { message?: string } };
            const msg = data?.error?.message ?? "";
            if (msg === "EMAIL_EXISTS") {
              throw new Error(
                "Incorrect password. If you previously registered using Google, please click 'Continue with Google'.",
              );
            }
          }
        } catch (autoCreateErr) {
          if (
            autoCreateErr instanceof Error &&
            autoCreateErr.message.includes("Continue with Google")
          ) {
            throw autoCreateErr;
          }
        }
      }

      if ("error" in signInResult) {
        const c = signInResult.error?.code ?? "";
        throw new Error(
          AUTH_ERRORS[c] ??
            "Incorrect email or password. Your password is your parent / guardian contact number.",
        );
      }
    }

    // 2. Fetch the admission record from Firestore (user is authenticated now)
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
          query(collection(getDb(), "admissions"), where("email", "==", emailTrimmed), limit(1)),
        );
      }
    } catch (firestoreErr) {
      console.error("[studentAuth] load admission error:", firestoreErr);
      throw new Error(
        "Signed in, but could not load admission profile. Please contact administration.",
      );
    }

    if (snap.empty) {
      throw new Error(
        "Signed in, but no admission record matches this email address. Please contact administration.",
      );
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
    subscribeToAdmissionDoc(docSnap.id, newSession);
  }

  async function loginStudentWithGoogle() {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const userCredential = await signInWithPopup(getFirebaseAuth(), provider);
    const googleEmail = userCredential.user.email?.trim() ?? "";
    if (!googleEmail) {
      throw new Error("Could not retrieve email from Google account.");
    }

    // Query admission by email (now authenticated)
    let snap;
    try {
      snap = await getDocs(
        query(
          collection(getDb(), "admissions"),
          where("email", "==", googleEmail.toLowerCase()),
          limit(1),
        ),
      );
      if (snap.empty) {
        snap = await getDocs(
          query(collection(getDb(), "admissions"), where("email", "==", googleEmail), limit(1)),
        );
      }
    } catch (firestoreErr) {
      console.error("[studentAuth] google login firestore error:", firestoreErr);
      throw new Error(
        "Signed in with Google, but could not load admission profile. Please contact administration.",
      );
    }

    if (snap.empty) {
      await signOut(getFirebaseAuth());
      throw new Error(
        `No admission record found for Google account (${googleEmail}). Please use the email provided on your admission form.`,
      );
    }

    const docSnap = snap.docs[0]!;
    const d = docSnap.data() as Record<string, unknown>;
    const newSession: StudentSession = {
      studentDocId: docSnap.id,
      fullName: String(d["fullName"] ?? userCredential.user.displayName ?? ""),
      email: String(d["email"] ?? googleEmail),
      admissionId: String(d["admissionId"] ?? docSnap.id),
    };

    saveSession(newSession);
    setSession(newSession);
    setAdmission(buildAdmission(docSnap.id, d));
    subscribeToAdmissionDoc(docSnap.id, newSession);
  }

  async function logoutStudent() {
    if (docUnsubRef.current) {
      docUnsubRef.current();
      docUnsubRef.current = null;
    }
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
    <StudentAuthContext.Provider
      value={{
        session,
        admission,
        loading,
        loginStudent,
        loginStudentWithGoogle,
        logoutStudent,
        refreshAdmission,
      }}
    >
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
    profilePhoto: d["profilePhoto"]
      ? {
          url: String((d["profilePhoto"] as any).url ?? ""),
          publicId: String((d["profilePhoto"] as any).publicId ?? ""),
          storage: String((d["profilePhoto"] as any).storage ?? "cloudinary"),
          uploadedAt: toDate((d["profilePhoto"] as any).uploadedAt),
        }
      : null,
    profileImagePath:
      (d["profileImagePath"] as string | null) ??
      (d["profilePhoto"] ? String((d["profilePhoto"] as any).url ?? "") : null),
    profileImageUrl:
      (d["profileImageUrl"] as string | null) ??
      (d["profilePhoto"] ? String((d["profilePhoto"] as any).url ?? "") : null),
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
    paymentMode:
      d["paymentMode"] === "online" || d["paymentMode"] === "cash" ? d["paymentMode"] : null,
    mealPreference:
      d["mealPreference"] === "veg" || d["mealPreference"] === "non-veg"
        ? d["mealPreference"]
        : undefined,
    notes: String(d["notes"] ?? ""),
    parentName: String(d["parentName"] ?? ""),
    parentPhone: String(d["parentPhone"] ?? ""),
    parentRelation: String(d["parentRelation"] ?? ""),
    messId: typeof d["messId"] === "string" ? d["messId"] : "",
    messName: typeof d["messName"] === "string" ? d["messName"] : "",
    tiffinStatus: (d["tiffinStatus"] as any) || "",
    laundryId: typeof d["laundryId"] === "string" ? d["laundryId"] : "",
    laundryName: typeof d["laundryName"] === "string" ? d["laundryName"] : "",
    laundryStatus: (d["laundryStatus"] as any) || "",
    createdAt: toDate(d["createdAt"]),
    updatedAt: toDate(d["updatedAt"]),
  } as Admission;
}
