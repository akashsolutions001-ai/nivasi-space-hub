/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getDb, getFirebaseAuth } from "./firebase";
import type { Admission, AdmissionInput, College, City, PackagePlan, Property } from "./types";

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const ts = value as Timestamp;
  return typeof ts?.toDate === "function" ? ts.toDate() : null;
}

function mapAdmission(snap: QueryDocumentSnapshot<DocumentData>): Admission {
  const d: any = snap.data();
  return {
    id: snap.id,
    admissionId: d.admissionId ?? snap.id,
    profileImagePath: d.profileImagePath ?? null,
    profileImageUrl: d.profileImageUrl ?? null,
    fullName: d.fullName ?? "",
    phoneNumber: d.phoneNumber ?? "",
    email: d.email ?? "",
    gender: d.gender ?? "",
    dateOfBirth: d.dateOfBirth ?? "",
    collegeId: d.collegeId ?? "",
    collegeName: d.collegeName ?? "",
    course: d.course ?? "",
    year: d.year ?? "",
    propertyId: d.propertyId ?? "",
    propertyName: d.propertyName ?? "",
    roomNumber: d.roomNumber ?? "",
    bedNumber: d.bedNumber ?? "",
    admissionDate: d.admissionDate ?? "",
    moveInDate: d.moveInDate ?? "",
    packageId: d.packageId ?? "",
    packageName: d.packageName ?? "",
    packageServices: Array.isArray(d.packageServices) ? d.packageServices : [],
    packageAmount: Number(d.packageAmount ?? 0),
    packageStartDate: d.packageStartDate ?? "",
    packageEndDate: d.packageEndDate ?? "",
    amountPaid: Number(d.amountPaid ?? 0),
    balanceAmount: Number(d.balanceAmount ?? 0),
    paymentStatus: d.paymentStatus === "completed" ? "completed" : "pending",
    bagProvided: Boolean(d.bagProvided),
    bagPaymentCollected: Boolean(d.bagPaymentCollected),
    tiffinProvided: Boolean(d.tiffinProvided),
    tiffinPaymentCollected: Boolean(d.tiffinPaymentCollected),
    mattressRequired: Boolean(d.mattressRequired),
    mattressPaymentCollected: Boolean(d.mattressPaymentCollected),
    paymentMode: d.paymentMode === "online" || d.paymentMode === "cash" ? d.paymentMode : null,
    mealPreference: d.mealPreference === "veg" || d.mealPreference === "non-veg" ? d.mealPreference : undefined,
    notes: d.notes ?? "",
    parentName: d.parentName ?? "",
    parentPhone: d.parentPhone ?? "",
    parentRelation: d.parentRelation ?? "",
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
    // Mess & Tiffin fields — optional extension fields added by the mess module
    messId: d.messId ?? "",
    messName: d.messName ?? "",
    tiffinStatus: d.tiffinStatus ?? "",
  } as any;
}

const friendly = (action: string) => `Unable to ${action}. Please check your connection and try again.`;

/* ---------------------------------- IDs ---------------------------------- */

export async function generateAdmissionId(): Promise<string> {
  const db = getDb();
  const counterRef = doc(db, "counters", "admissions");
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? Number((snap.data() as any).value ?? 0) : 0;
    const value = current + 1;
    tx.set(counterRef, { value, updatedAt: serverTimestamp() }, { merge: true });
    return value;
  });
  return `NS-ADM-${String(next).padStart(6, "0")}`;
}

/* ------------------------------- Admissions ------------------------------ */

export async function fetchAdmissions(): Promise<Admission[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "admissions"), orderBy("createdAt", "desc")));
    return snap.docs.map(mapAdmission);
  } catch (error) {
    console.error("[firestore] fetchAdmissions", error);
    throw new Error(friendly("load admissions"));
  }
}

export async function fetchAdmission(admissionId: string): Promise<Admission | null> {
  try {
    const snap = await getDocs(
      query(collection(getDb(), "admissions"), where("admissionId", "==", admissionId), limit(1)),
    );
    const first = snap.docs[0];
    if (first) return mapAdmission(first);
    const byDoc = await getDoc(doc(getDb(), "admissions", admissionId));
    return byDoc.exists() ? mapAdmission(byDoc as QueryDocumentSnapshot<DocumentData>) : null;
  } catch (error) {
    console.error("[firestore] fetchAdmission", error);
    throw new Error(friendly("load this admission"));
  }
}

export async function createAdmission(input: AdmissionInput): Promise<string> {
  try {
    // 1. Save the admission document to Firestore
    const ref = await addDoc(collection(getDb(), "admissions"), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Create a Firebase Auth account for the student so they can log in.
    //    Use a secondary app instance so the admin's session is never touched.
    //    Email = admission email, password = parentPhone digits only.
    //    Best-effort: failures don't block the admission save.
    const email = (input.email ?? "").trim();
    const parentPhone = (input.parentPhone ?? "");
    if (email && parentPhone.replace(/\D/g, "").length >= 6) {
      await ensureStudentAuthAccount(email, parentPhone, input.fullName ?? "").catch(() => {});
    }

    return ref.id;
  } catch (error) {
    console.error("[firestore] createAdmission", error);
    throw new Error(friendly("save this admission"));
  }
}

export async function updateAdmission(id: string, patch: Partial<AdmissionInput>): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "admissions", id), { ...patch, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] updateAdmission", error);
    throw new Error(friendly("update this admission"));
  }
}

export async function deleteAdmission(id: string): Promise<void> {
  try {
    await import("firebase/firestore").then(({ deleteDoc }) =>
      deleteDoc(doc(getDb(), "admissions", id)),
    );
  } catch (error) {
    console.error("[firestore] deleteAdmission", error);
    throw new Error(friendly("delete this admission"));
  }
}

/**
 * Creates a Firebase Auth account for a single existing student via the
 * Identity Toolkit REST API — no Firebase SDK session changes, no secondary app.
 *
 * Email = admission email, password = parentPhone digits only.
 * Safe to call multiple times — "EMAIL_EXISTS" is silently treated as success.
 */
export async function ensureStudentAuthAccount(
  email: string,
  parentPhone: string,
  fullName: string,
): Promise<"created" | "exists" | "skipped" | "rate-limited"> {
  const password = parentPhone.replace(/\D/g, "");
  if (!email || password.length < 6) return "skipped";

  const { firebaseConfig } = await import("./firebase-config");
  const apiKey = firebaseConfig.apiKey;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, displayName: fullName, returnSecureToken: false }),
      },
    );
    const data = await res.json() as { error?: { message?: string } };
    if (!res.ok) {
      const msg = data?.error?.message ?? "";
      if (msg === "EMAIL_EXISTS") return "exists";
      if (msg.startsWith("TOO_MANY_ATTEMPTS")) return "rate-limited";
      console.warn("[auth] ensureStudentAuthAccount failed:", msg, "email:", email);
      return "skipped";
    }
    return "created";
  } catch (err) {
    console.warn("[auth] ensureStudentAuthAccount network error:", err);
    return "skipped";
  }
}

/* -------------------------------- Packages ------------------------------- */

export async function fetchPackages(): Promise<PackagePlan[]> {
  try {
    const snap = await getDocs(collection(getDb(), "packages"));
    return snap.docs
      .map((s) => {
        const d: any = s.data();
        return {
          id: s.id,
          packageId: d.packageId ?? s.id,
          packageName: d.packageName ?? "",
          services: Array.isArray(d.services) ? d.services : [],
          price: Number(d.price ?? 0),
          duration: Number(d.duration ?? 30),
          active: d.active !== false,
          createdAt: toDate(d.createdAt),
          updatedAt: toDate(d.updatedAt),
        } satisfies PackagePlan;
      })
      .sort((a, b) => a.packageName.localeCompare(b.packageName));
  } catch (error) {
    console.error("[firestore] fetchPackages", error);
    throw new Error(friendly("load packages"));
  }
}

export async function savePackage(
  pkg: {
    packageName: string;
    price: number;
    duration: number;
    services: string[];
    active: boolean;
  },
  existingId?: string,
): Promise<void> {
  try {
    if (existingId) {
      await updateDoc(doc(getDb(), "packages", existingId), {
        ...pkg,
        updatedAt: serverTimestamp(),
      });
      return;
    }
    const ref = doc(collection(getDb(), "packages"));

    await setDoc(ref, {
      ...pkg,
      packageId: ref.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] savePackage", error);
    throw new Error(friendly("save this package"));
  }
}

export async function setPackageActive(id: string, active: boolean): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "packages", id), { active, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] setPackageActive", error);
    throw new Error(friendly("update this package"));
  }
}

/* -------------------------- Colleges & properties ------------------------ */

export async function fetchColleges(): Promise<College[]> {
  try {
    const snap = await getDocs(collection(getDb(), "colleges"));
    return snap.docs
      .map((s) => {
        const d: any = s.data();
        return {
          id: s.id,
          collegeId: d.collegeId ?? s.id,
          collegeName: d.collegeName ?? "",
          collegeType: d.collegeType ?? "other",
          city: d.city ?? "",
          active: d.active !== false,
        } satisfies College;
      })
      .sort((a, b) => a.collegeName.localeCompare(b.collegeName));
  } catch (error) {
    console.error("[firestore] fetchColleges", error);
    return [];
  }
}

export async function addCollege(
  collegeName: string,
  collegeType: "engineering" | "medical" | "other" = "other",
  city: string = "",
): Promise<void> {
  const ref = doc(collection(getDb(), "colleges"));
  await setDoc(ref, {
    collegeId: ref.id,
    collegeName,
    collegeType,
    city,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function setCollegeActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(getDb(), "colleges", id), { active, updatedAt: serverTimestamp() });
}

export async function updateCollege(
  id: string,
  patch: { collegeName?: string; collegeType?: "engineering" | "medical" | "other"; city?: string },
): Promise<void> {
  await updateDoc(doc(getDb(), "colleges", id), { ...patch, updatedAt: serverTimestamp() });
}

/* --------------------------------- Cities -------------------------------- */

export async function fetchCities(): Promise<City[]> {
  try {
    const snap = await getDocs(collection(getDb(), "cities"));
    return snap.docs
      .map((s) => {
        const d: any = s.data();
        return {
          id: s.id,
          cityId: d.cityId ?? s.id,
          cityName: d.cityName ?? "",
          active: d.active !== false,
        } satisfies City;
      })
      .sort((a, b) => a.cityName.localeCompare(b.cityName));
  } catch (error) {
    console.error("[firestore] fetchCities", error);
    return [];
  }
}

export async function addCity(cityName: string): Promise<void> {
  const ref = doc(collection(getDb(), "cities"));
  await setDoc(ref, {
    cityId: ref.id,
    cityName,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function setCityActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(getDb(), "cities", id), { active, updatedAt: serverTimestamp() });
}

export async function fetchProperties(): Promise<Property[]> {
  try {
    const snap = await getDocs(collection(getDb(), "properties"));
    return snap.docs
      .map((s) => {
        const d: any = s.data();
        return {
          id: s.id,
          propertyId: d.propertyId ?? s.id,
          propertyName: d.propertyName ?? d.name ?? "",
          address: d.address ?? "",
          city: d.city ?? "",
          ownerName: d.ownerName ?? "",
          ownerPhone: d.ownerPhone ?? "",
          totalBeds: Number(d.totalBeds ?? 0),
          active: d.active !== false,
        } satisfies Property;
      })
      .filter((p) => p.propertyName)
      .sort((a, b) => a.propertyName.localeCompare(b.propertyName));
  } catch (error) {
    console.error("[firestore] fetchProperties", error);
    return [];
  }
}

/* --------------------------------- Rooms --------------------------------- */

export interface Room {
  id: string;
  title: string;
  rooms?: string;
  roomType?: string;
  gender?: string;
  city?: string;
  address?: string;
  location?: string;
  mapLink?: string;
  contact?: string;
  college?: string;
  rent?: number;
  pricingType?: string;
  billInclusion?: string;
  features?: string[];
  note?: string;
  description?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  roomStatus?: string;
  verificationStatus?: string;
  visibility?: string;
  isPublished?: boolean;
  hidden?: boolean;
  addedByAdmin?: boolean;
  ownerName?: string;
  ownerPhone?: string;
}

/** Fetches all documents from the `rooms` collection and returns their details. */
export async function fetchRooms(): Promise<Room[]> {
  try {
    const snap = await getDocs(collection(getDb(), "rooms"));
    return snap.docs
      .map((s) => {
        const d: any = s.data();
        return {
          id: s.id,
          title: (d.title as string) ?? "",
          rooms: d.rooms ?? "",
          roomType: d.roomType ?? "",
          gender: (d.gender as string | undefined) ?? undefined,
          city: d.city ?? "",
          address: d.address ?? "",
          location: d.location ?? "",
          mapLink: d.mapLink ?? "",
          contact: d.contact ?? d.ownerPhone ?? "",
          college: d.college ?? "",
          rent: Number(d.rent ?? 0),
          pricingType: d.pricingType ?? "",
          billInclusion: d.billInclusion ?? "",
          features: Array.isArray(d.features) ? d.features : [],
          note: d.note ?? "",
          description: d.description ?? "",
          subscriptionStatus: d.subscriptionStatus ?? "",
          paymentStatus: d.paymentStatus ?? "",
          roomStatus: d.roomStatus ?? "",
          verificationStatus: d.verificationStatus ?? "",
          visibility: d.visibility ?? "",
          isPublished: d.isPublished ?? false,
          hidden: d.hidden ?? false,
          addedByAdmin: d.addedByAdmin ?? false,
          ownerName: d.ownerName ?? "",
          ownerPhone: d.ownerPhone ?? "",
        } satisfies Room;
      })
      .filter((r) => r.title)
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("[firestore] fetchRooms", error);
    return [];
  }
}

export async function addProperty(
  propertyName: string,
  city?: string,
  ownerName?: string,
  ownerPhone?: string,
  totalBeds?: number,
): Promise<void> {
  const ref = doc(collection(getDb(), "properties"));
  await setDoc(ref, {
    propertyId: ref.id,
    propertyName,
    city: city ?? "",
    address: "",
    ownerName: ownerName ?? "",
    ownerPhone: ownerPhone ?? "",
    totalBeds: totalBeds ?? 0,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProperty(
  id: string,
  patch: {
    propertyName?: string;
    city?: string;
    address?: string;
    ownerName?: string;
    ownerPhone?: string;
    totalBeds?: number;
  },
): Promise<void> {
  await updateDoc(doc(getDb(), "properties", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function setPropertyActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(getDb(), "properties", id), { active, updatedAt: serverTimestamp() });
}

/* --------------------------------- Current User Profile ------------------ */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  collegeId?: string;
  collegeName?: string;
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(getDb(), "users", uid));
    if (!snap.exists()) return null;
    const d: any = snap.data();
    return {
      uid: d.uid ?? uid,
      email: d.email ?? "",
      displayName: d.displayName ?? "",
      role: d.role ?? "admin",
      collegeId: d.collegeId ?? "",
      collegeName: d.collegeName ?? "",
    };
  } catch (error) {
    console.error("[firestore] fetchUserProfile", error);
    return null;
  }
}

export interface AdminUserInput {
  email: string;
  password: string;
  displayName: string;
  collegeId: string;
  collegeName: string;
}

/**
 * Creates a new admin user in Firebase Auth and saves their profile to
 * the /users collection so they appear in the admin panel.
 */
export async function createAdminUser(input: AdminUserInput): Promise<string> {
  try {
    // 1. Create the Firebase Auth account
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email.trim(),
      input.password,
    );
    const { user } = credential;

    // 2. Set the display name on the auth profile
    await updateProfile(user, { displayName: input.displayName });

    // 3. Write to /users collection
    const userRef = doc(getDb(), "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: input.email.trim(),
      displayName: input.displayName,
      role: "admin",
      collegeId: input.collegeId,
      collegeName: input.collegeName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user.uid;
  } catch (error) {
    console.error("[firestore] createAdminUser", error);
    const code = (error as { code?: string })?.code ?? "";
    if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
    if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
    if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
    throw new Error("Could not create the admin account. Please try again.");
  }
}

/* --------------------------------- Seed ---------------------------------- */

const DEFAULT_PACKAGES = [
  { packageName: "Room Only", services: ["Room"], price: 6000, duration: 30 },
  { packageName: "Room + Mess", services: ["Room", "Mess"], price: 9000, duration: 30 },
  { packageName: "Room + Laundry", services: ["Room", "Laundry"], price: 7500, duration: 30 },
  { packageName: "Room + Ironing", services: ["Room", "Ironing"], price: 7000, duration: 30 },
  {
    packageName: "Room + House Cleaning",
    services: ["Room", "House Cleaning"],
    price: 7500,
    duration: 30,
  },
  {
    packageName: "Complete Package",
    services: ["Room", "Mess", "Laundry", "Ironing", "House Cleaning"],
    price: 15000,
    duration: 30,
  },
  { packageName: "Custom Package", services: ["Room"], price: 0, duration: 30 },
];

/** Creates starter packages and colleges the first time the app is used. */
export async function seedDefaults(): Promise<void> {
  const db = getDb();
  const [pkgSnap, collegeSnap] = await Promise.all([
    getDocs(collection(db, "packages")),
    getDocs(collection(db, "colleges")),
  ]);

  if (pkgSnap.empty) {
    await Promise.all(
      DEFAULT_PACKAGES.map((p) => {
        const ref = doc(collection(db, "packages"));
        return setDoc(ref, {
          ...p,
          packageId: ref.id,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }),
    );
  }

  if (collegeSnap.empty) {
    await Promise.all(
      [
        { collegeName: "Dr. D.Y.Patil Pratishthan's College of Engineering Salokhenagar Kolhapur", collegeType: "engineering" as const, city: "Kolhapur" },
        { collegeName: "DYP Medical College", collegeType: "medical" as const, city: "Kolhapur" },
      ].map(({ collegeName, collegeType, city }) => {
        const ref = doc(collection(db, "colleges"));
        return setDoc(ref, {
          collegeId: ref.id,
          collegeName,
          collegeType,
          city,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }),
    );
  }

  // Seed default city if cities collection is empty
  const citySnap = await getDocs(collection(db, "cities"));
  if (citySnap.empty) {
    const ref = doc(collection(db, "cities"));
    await setDoc(ref, {
      cityId: ref.id,
      cityName: "Kolhapur",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESS & TIFFIN DELIVERY — Firestore helpers
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Mess,
  MessInput,
  MessEmployee,
  MessEmployeeInput,
  Delivery,
  DeliveryInput,
  TiffinStatus,
} from "./types";

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapMess(snap: QueryDocumentSnapshot<DocumentData>): Mess {
  const d: any = snap.data();
  return {
    id: snap.id,
    messId: d.messId ?? snap.id,
    messName: d.messName ?? "",
    ownerName: d.ownerName ?? "",
    ownerPhone: d.ownerPhone ?? "",
    propertyId: d.propertyId ?? "",
    messDescription: d.messDescription ?? "",
    status: d.status === "inactive" ? "inactive" : "active",
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

function mapEmployee(snap: QueryDocumentSnapshot<DocumentData>): MessEmployee {
  const d: any = snap.data();
  // Support both old single-mess format and new multi-mess format
  const messIds: string[] = Array.isArray(d.messIds)
    ? d.messIds
    : d.messId ? [d.messId] : [];
  const messNames: string[] = Array.isArray(d.messNames)
    ? d.messNames
    : d.messName ? [d.messName] : [];
  return {
    id: snap.id,
    employeeId: d.employeeId ?? snap.id,
    name: d.name ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    messIds,
    messNames,
    role: d.role === "MESS_MANAGER" ? "MESS_MANAGER" : "MESS_EMPLOYEE",
    status: d.status === "inactive" ? "inactive" : "active",
    uid: d.uid ?? "",
    createdAt: toDate(d.createdAt),
  };
}

function mapDelivery(snap: QueryDocumentSnapshot<DocumentData>): Delivery {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    admissionId: d.admissionId ?? "",
    messId: d.messId ?? "",
    employeeId: d.employeeId ?? "",
    date: d.date ?? "",
    meal: d.meal === "dinner" ? "dinner" : "lunch",
    status: (["pending", "delivered", "not_available", "skipped"].includes(d.status)
      ? d.status
      : "pending") as Delivery["status"],
    deliveredAt: toDate(d.deliveredAt),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

// ── Messes ───────────────────────────────────────────────────────────────────

export async function fetchMesses(): Promise<Mess[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "messes"), orderBy("messName")));
    return snap.docs.map(mapMess);
  } catch (error) {
    console.error("[firestore] fetchMesses", error);
    throw new Error("Unable to load messes. Please check your connection and try again.");
  }
}

export async function fetchMess(messId: string): Promise<Mess | null> {
  try {
    const snap = await getDoc(doc(getDb(), "messes", messId));
    return snap.exists() ? mapMess(snap as QueryDocumentSnapshot<DocumentData>) : null;
  } catch (error) {
    console.error("[firestore] fetchMess", error);
    return null;
  }
}

export async function createMess(input: MessInput): Promise<string> {
  try {
    const ref = doc(collection(getDb(), "messes"));
    await setDoc(ref, {
      ...input,
      messId: ref.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] createMess", error);
    throw new Error("Unable to create mess. Please check your connection and try again.");
  }
}

export async function updateMess(id: string, patch: Partial<MessInput>): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "messes", id), { ...patch, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] updateMess", error);
    throw new Error("Unable to update mess. Please check your connection and try again.");
  }
}

export async function setMessStatus(id: string, status: "active" | "inactive"): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "messes", id), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] setMessStatus", error);
    throw new Error("Unable to update mess status.");
  }
}

export async function deleteMess(id: string): Promise<void> {
  try {
    await import("firebase/firestore").then(({ deleteDoc }) =>
      deleteDoc(doc(getDb(), "messes", id)),
    );
  } catch (error) {
    console.error("[firestore] deleteMess", error);
    throw new Error("Unable to delete mess. Please check your connection and try again.");
  }
}

// ── Employees ────────────────────────────────────────────────────────────────

export async function fetchEmployees(): Promise<MessEmployee[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "employees"), orderBy("name")));
    return snap.docs.map(mapEmployee);
  } catch (error) {
    console.error("[firestore] fetchEmployees", error);
    throw new Error("Unable to load employees. Please check your connection and try again.");
  }
}

export async function fetchEmployeesByMess(messId: string): Promise<MessEmployee[]> {
  try {
    // Query using array-contains for the new messIds field
    const snap = await getDocs(
      query(collection(getDb(), "employees"), where("messIds", "array-contains", messId)),
    );
    // Also catch old single-messId documents
    const snap2 = await getDocs(
      query(collection(getDb(), "employees"), where("messId", "==", messId)),
    );
    const seen = new Set<string>();
    const results: MessEmployee[] = [];
    for (const s of [...snap.docs, ...snap2.docs]) {
      if (!seen.has(s.id)) { seen.add(s.id); results.push(mapEmployee(s)); }
    }
    return results.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("[firestore] fetchEmployeesByMess", error);
    return [];
  }
}

export async function fetchEmployeeByUid(uid: string): Promise<MessEmployee | null> {
  try {
    const snap = await getDocs(
      query(collection(getDb(), "employees"), where("uid", "==", uid), limit(1)),
    );
    return snap.docs[0] ? mapEmployee(snap.docs[0]) : null;
  } catch (error) {
    console.error("[firestore] fetchEmployeeByUid", error);
    return null;
  }
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  messIds: string[];
  messNames: string[];
  role: "MESS_EMPLOYEE" | "MESS_MANAGER";
}

export async function createMessEmployee(input: CreateEmployeeInput): Promise<string> {
  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email.trim(),
      input.password,
    );
    const { user } = credential;
    await updateProfile(user, { displayName: input.name });

    const ref = doc(collection(getDb(), "employees"));
    await setDoc(ref, {
      employeeId: ref.id,
      name: input.name,
      email: input.email.trim(),
      phone: input.phone,
      messIds: input.messIds,
      messNames: input.messNames,
      role: input.role,
      status: "active",
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    // Write /users doc with messIds so auth can resolve all assigned messes
    await setDoc(doc(getDb(), "users", user.uid), {
      uid: user.uid,
      email: input.email.trim(),
      displayName: input.name,
      role: "mess_employee",
      messIds: input.messIds,
      messNames: input.messNames,
      employeeId: ref.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    console.error("[firestore] createMessEmployee", error);
    const code = (error as { code?: string })?.code ?? "";
    if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
    if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
    if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
    throw new Error("Could not create employee account. Please try again.");
  }
}

export async function updateMessEmployee(
  id: string,
  patch: Partial<Pick<MessEmployeeInput, "name" | "phone" | "messIds" | "messNames" | "role" | "status">>,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "employees", id), { ...patch });
    // If messIds changed, keep /users doc in sync
    if (patch.messIds !== undefined) {
      const empSnap = await getDoc(doc(getDb(), "employees", id));
      if (empSnap.exists()) {
        const uid: string = (empSnap.data() as any).uid ?? "";
        if (uid) {
          await updateDoc(doc(getDb(), "users", uid), {
            messIds: patch.messIds,
            messNames: patch.messNames ?? [],
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
  } catch (error) {
    console.error("[firestore] updateMessEmployee", error);
    throw new Error("Unable to update employee. Please check your connection and try again.");
  }
}

// ── Student → Mess Assignment ─────────────────────────────────────────────────

export async function assignStudentToMess(
  admissionDocId: string,
  messId: string,
  messName: string,
  tiffinStatus: TiffinStatus = "active",
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "admissions", admissionDocId), {
      messId,
      messName,
      tiffinStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] assignStudentToMess", error);
    throw new Error("Unable to assign student to mess. Please check your connection and try again.");
  }
}

export async function updateStudentTiffinStatus(
  admissionDocId: string,
  tiffinStatus: TiffinStatus,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "admissions", admissionDocId), {
      tiffinStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] updateStudentTiffinStatus", error);
    throw new Error("Unable to update tiffin status.");
  }
}

// ── Deliveries ────────────────────────────────────────────────────────────────

/** Today's date as YYYY-MM-DD in local time */
export function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function fetchDeliveriesForDate(messId: string, date: string): Promise<Delivery[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "deliveries"),
        where("messId", "==", messId),
        where("date", "==", date),
      ),
    );
    return snap.docs.map(mapDelivery);
  } catch (error) {
    console.error("[firestore] fetchDeliveriesForDate", error);
    return [];
  }
}

export async function fetchDeliveriesForStudent(
  studentId: string,
  limitCount = 60,
): Promise<Delivery[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "deliveries"),
        where("studentId", "==", studentId),
        orderBy("date", "desc"),
        limit(limitCount),
      ),
    );
    return snap.docs.map(mapDelivery);
  } catch (error) {
    console.error("[firestore] fetchDeliveriesForStudent", error);
    return [];
  }
}

/** Upsert a delivery record — creates if not present, updates if already exists */
export async function upsertDelivery(input: DeliveryInput): Promise<string> {
  try {
    const db = getDb();
    // Check if a record already exists for (studentId + date + meal)
    const existing = await getDocs(
      query(
        collection(db, "deliveries"),
        where("studentId", "==", input.studentId),
        where("date", "==", input.date),
        where("meal", "==", input.meal),
        limit(1),
      ),
    );

    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      if (existingDoc) {
        await updateDoc(existingDoc.ref, {
          status: input.status,
          employeeId: input.employeeId,
          deliveredAt: input.status === "delivered" ? serverTimestamp() : null,
          updatedAt: serverTimestamp(),
        });
        return existingDoc.id;
      }
    }

    // Create new
    const ref = doc(collection(db, "deliveries"));
    await setDoc(ref, {
      ...input,
      deliveredAt: input.status === "delivered" ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] upsertDelivery", error);
    throw new Error("Unable to save delivery status. Please check your connection and try again.");
  }
}

export async function fetchDeliverySummaryForDate(
  messId: string,
  date: string,
): Promise<{ lunch: Record<string, number>; dinner: Record<string, number> }> {
  const deliveries = await fetchDeliveriesForDate(messId, date);
  const empty = () => ({ pending: 0, delivered: 0, not_available: 0, skipped: 0 });
  const result = { lunch: empty(), dinner: empty() };
  for (const d of deliveries) {
    if (d.meal === "lunch") result.lunch[d.status] = (result.lunch[d.status] ?? 0) + 1;
    else result.dinner[d.status] = (result.dinner[d.status] ?? 0) + 1;
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYOUTS / DEBIT — Firestore helpers
// ═══════════════════════════════════════════════════════════════════════════

import type { Payout, PayoutInput, PayoutStatus } from "./types";

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapPayout(snap: QueryDocumentSnapshot<DocumentData>): Payout {
  const d: any = snap.data();
  return {
    id: snap.id,
    payoutId: d.payoutId ?? snap.id,
    transactionId: d.transactionId ?? d.payoutId ?? snap.id,
    recipientName: d.recipientName ?? "",
    recipientPhone: d.recipientPhone ?? "",
    recipientEmail: d.recipientEmail ?? "",
    payoutType: d.payoutType ?? "OTHER",
    purpose: d.purpose ?? "",
    messId: d.messId ?? "",
    messName: d.messName ?? "",
    laundryId: d.laundryId ?? "",
    laundryName: d.laundryName ?? "",
    propertyId: d.propertyId ?? "",
    propertyName: d.propertyName ?? "",
    studentId: d.studentId ?? "",
    studentName: d.studentName ?? "",
    servicePeriod: d.servicePeriod ?? "",
    studentCount: Number(d.studentCount ?? 0),
    relatedItem: d.relatedItem ?? "",
    service: d.service ?? "",
    amount: Number(d.amount ?? 0),
    currency: "INR",
    paymentMethod: d.paymentMethod ?? "CASH",
    referenceId: d.referenceId ?? "",
    status: d.status ?? "PENDING",
    description: d.description ?? "",
    createdBy: d.createdBy ?? "",
    createdAt: toDate(d.createdAt),
    updatedBy: d.updatedBy ?? "",
    updatedAt: toDate(d.updatedAt),
    processedBy: d.processedBy ?? "",
    processedAt: toDate(d.processedAt),
    originalTransactionId: d.originalTransactionId ?? "",
    originalAmount: Number(d.originalAmount ?? 0),
    refundReason: d.refundReason ?? "",
  };
}

// ── ID generator ──────────────────────────────────────────────────────────────

export async function generatePayoutId(): Promise<string> {
  const db = getDb();
  const counterRef = doc(db, "counters", "payouts");
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? Number((snap.data() as any).value ?? 0) : 0;
    const value = current + 1;
    tx.set(counterRef, { value, updatedAt: serverTimestamp() }, { merge: true });
    return value;
  });
  const today = new Date();
  const yyyymmdd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  return `PAY-${yyyymmdd}-${String(next).padStart(4, "0")}`;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function fetchPayouts(options?: {
  startDate?: Date;
  endDate?: Date;
  limitCount?: number;
}): Promise<Payout[]> {
  try {
    const db = getDb();
    const constraints: any[] = [orderBy("createdAt", "desc")];
    if (options?.startDate) constraints.push(where("createdAt", ">=", options.startDate));
    if (options?.endDate)   constraints.push(where("createdAt", "<=", options.endDate));
    if (options?.limitCount) constraints.push(limit(options.limitCount));
    const snap = await getDocs(query(collection(db, "payouts"), ...constraints));
    return snap.docs.map(mapPayout);
  } catch (error) {
    console.error("[firestore] fetchPayouts", error);
    throw new Error("Unable to load payouts. Please check your connection and try again.");
  }
}

export async function fetchPayout(id: string): Promise<Payout | null> {
  try {
    const snap = await getDoc(doc(getDb(), "payouts", id));
    return snap.exists() ? mapPayout(snap as QueryDocumentSnapshot<DocumentData>) : null;
  } catch (error) {
    console.error("[firestore] fetchPayout", error);
    return null;
  }
}

export async function fetchPayoutsByMess(messId: string): Promise<Payout[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "payouts"),
        where("messId", "==", messId),
        orderBy("createdAt", "desc"),
      ),
    );
    return snap.docs.map(mapPayout);
  } catch (error) {
    console.error("[firestore] fetchPayoutsByMess", error);
    return [];
  }
}

export async function fetchPayoutsByLaundry(laundryId: string): Promise<Payout[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "payouts"),
        where("laundryId", "==", laundryId),
        orderBy("createdAt", "desc"),
      ),
    );
    return snap.docs.map(mapPayout);
  } catch (error) {
    console.error("[firestore] fetchPayoutsByLaundry", error);
    return [];
  }
}

export async function createPayout(input: PayoutInput): Promise<string> {
  try {
    const ref = doc(collection(getDb(), "payouts"));
    await setDoc(ref, {
      ...input,
      status: "PENDING",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] createPayout", error);
    throw new Error("Unable to create payout. Please check your connection and try again.");
  }
}

export async function updatePayout(
  id: string,
  patch: Partial<Omit<PayoutInput, "createdBy" | "payoutId" | "transactionId">>,
  updatedBy: string,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "payouts", id), {
      ...patch,
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] updatePayout", error);
    throw new Error("Unable to update payout. Please check your connection and try again.");
  }
}

export async function updatePayoutStatus(
  id: string,
  status: PayoutStatus,
  processedBy: string,
): Promise<void> {
  try {
    const patch: Record<string, any> = {
      status,
      updatedBy: processedBy,
      updatedAt: serverTimestamp(),
    };
    if (status === "PAID" || status === "PROCESSING") {
      patch.processedBy  = processedBy;
      patch.processedAt  = serverTimestamp();
    }
    await updateDoc(doc(getDb(), "payouts", id), patch);
  } catch (error) {
    console.error("[firestore] updatePayoutStatus", error);
    throw new Error("Unable to update payout status.");
  }
}

export async function deletePayoutRecord(id: string): Promise<void> {
  try {
    await import("firebase/firestore").then(({ deleteDoc }) =>
      deleteDoc(doc(getDb(), "payouts", id)),
    );
  } catch (error) {
    console.error("[firestore] deletePayoutRecord", error);
    throw new Error("Unable to delete payout. Please check your connection and try again.");
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LAUNDRY — Firestore helpers
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Laundry, LaundryInput, LaundryEmployee, LaundryEmployeeInput,
  LaundryPickup, LaundryPickupInput, LaundrySubscriptionStatus,
} from "./types";

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapLaundry(snap: QueryDocumentSnapshot<DocumentData>): Laundry {
  const d: any = snap.data();
  return {
    id: snap.id,
    laundryId: d.laundryId ?? snap.id,
    laundryName: d.laundryName ?? "",
    ownerName: d.ownerName ?? "",
    ownerPhone: d.ownerPhone ?? "",
    propertyId: d.propertyId ?? "",
    status: d.status === "inactive" ? "inactive" : "active",
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

function mapLaundryEmployee(snap: QueryDocumentSnapshot<DocumentData>): LaundryEmployee {
  const d: any = snap.data();
  const laundryIds: string[] = Array.isArray(d.laundryIds)
    ? d.laundryIds
    : d.laundryId ? [d.laundryId] : [];
  const laundryNames: string[] = Array.isArray(d.laundryNames)
    ? d.laundryNames
    : d.laundryName ? [d.laundryName] : [];
  return {
    id: snap.id,
    employeeId: d.employeeId ?? snap.id,
    name: d.name ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    laundryIds,
    laundryNames,
    role: d.role === "LAUNDRY_MANAGER" ? "LAUNDRY_MANAGER" : "LAUNDRY_EMPLOYEE",
    status: d.status === "inactive" ? "inactive" : "active",
    uid: d.uid ?? "",
    createdAt: toDate(d.createdAt),
  };
}

function mapLaundryPickup(snap: QueryDocumentSnapshot<DocumentData>): LaundryPickup {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    admissionId: d.admissionId ?? "",
    laundryId: d.laundryId ?? "",
    employeeId: d.employeeId ?? "",
    date: d.date ?? "",
    type: d.type === "delivery" ? "delivery" : "pickup",
    status: (["pending", "picked_up", "not_available", "skipped"].includes(d.status)
      ? d.status
      : "pending") as LaundryPickup["status"],
    pickedUpAt: toDate(d.pickedUpAt),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

// ── Laundries ─────────────────────────────────────────────────────────────────

export async function fetchLaundries(): Promise<Laundry[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "laundries"), orderBy("laundryName")));
    return snap.docs.map(mapLaundry);
  } catch (error) {
    console.error("[firestore] fetchLaundries", error);
    throw new Error("Unable to load laundries. Please check your connection and try again.");
  }
}

export async function createLaundry(input: LaundryInput): Promise<string> {
  try {
    const ref = doc(collection(getDb(), "laundries"));
    await setDoc(ref, {
      ...input,
      laundryId: ref.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] createLaundry", error);
    throw new Error("Unable to create laundry. Please check your connection and try again.");
  }
}

export async function updateLaundry(id: string, patch: Partial<LaundryInput>): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "laundries", id), { ...patch, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] updateLaundry", error);
    throw new Error("Unable to update laundry. Please check your connection and try again.");
  }
}

export async function setLaundryStatus(id: string, status: "active" | "inactive"): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "laundries", id), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("[firestore] setLaundryStatus", error);
    throw new Error("Unable to update laundry status.");
  }
}

export async function deleteLaundry(id: string): Promise<void> {
  try {
    await import("firebase/firestore").then(({ deleteDoc }) =>
      deleteDoc(doc(getDb(), "laundries", id)),
    );
  } catch (error) {
    console.error("[firestore] deleteLaundry", error);
    throw new Error("Unable to delete laundry. Please check your connection and try again.");
  }
}

// ── Laundry Employees ─────────────────────────────────────────────────────────

export async function fetchLaundryEmployees(): Promise<LaundryEmployee[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "laundryEmployees"), orderBy("name")));
    return snap.docs.map(mapLaundryEmployee);
  } catch (error) {
    console.error("[firestore] fetchLaundryEmployees", error);
    throw new Error("Unable to load laundry employees. Please check your connection and try again.");
  }
}

export async function fetchLaundryEmployeeByUid(uid: string): Promise<LaundryEmployee | null> {
  try {
    const snap = await getDocs(
      query(collection(getDb(), "laundryEmployees"), where("uid", "==", uid), limit(1)),
    );
    return snap.docs[0] ? mapLaundryEmployee(snap.docs[0]) : null;
  } catch (error) {
    console.error("[firestore] fetchLaundryEmployeeByUid", error);
    return null;
  }
}

export interface CreateLaundryEmployeeInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  laundryIds: string[];
  laundryNames: string[];
  role: "LAUNDRY_EMPLOYEE" | "LAUNDRY_MANAGER";
}

export async function createLaundryEmployee(input: CreateLaundryEmployeeInput): Promise<string> {
  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email.trim(),
      input.password,
    );
    const { user } = credential;
    await updateProfile(user, { displayName: input.name });

    const ref = doc(collection(getDb(), "laundryEmployees"));
    await setDoc(ref, {
      employeeId: ref.id,
      name: input.name,
      email: input.email.trim(),
      phone: input.phone,
      laundryIds: input.laundryIds,
      laundryNames: input.laundryNames,
      role: input.role,
      status: "active",
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    // Write /users doc so auth can resolve the laundry employee role
    await setDoc(doc(getDb(), "users", user.uid), {
      uid: user.uid,
      email: input.email.trim(),
      displayName: input.name,
      role: "laundry_employee",
      laundryIds: input.laundryIds,
      laundryNames: input.laundryNames,
      employeeId: ref.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    console.error("[firestore] createLaundryEmployee", error);
    const code = (error as { code?: string })?.code ?? "";
    if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
    if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
    if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
    throw new Error("Could not create employee account. Please try again.");
  }
}

export async function updateLaundryEmployee(
  id: string,
  patch: Partial<Pick<LaundryEmployeeInput, "name" | "phone" | "laundryIds" | "laundryNames" | "role" | "status">>,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "laundryEmployees", id), { ...patch });
    if (patch.laundryIds !== undefined) {
      const empSnap = await getDoc(doc(getDb(), "laundryEmployees", id));
      if (empSnap.exists()) {
        const uid: string = (empSnap.data() as any).uid ?? "";
        if (uid) {
          await updateDoc(doc(getDb(), "users", uid), {
            laundryIds: patch.laundryIds,
            laundryNames: patch.laundryNames ?? [],
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
  } catch (error) {
    console.error("[firestore] updateLaundryEmployee", error);
    throw new Error("Unable to update laundry employee. Please check your connection and try again.");
  }
}

// ── Student → Laundry Assignment ──────────────────────────────────────────────

export async function assignStudentToLaundry(
  admissionDocId: string,
  laundryId: string,
  laundryName: string,
  laundryStatus: LaundrySubscriptionStatus = "active",
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "admissions", admissionDocId), {
      laundryId,
      laundryName,
      laundryStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] assignStudentToLaundry", error);
    throw new Error("Unable to assign student to laundry. Please check your connection and try again.");
  }
}

export async function updateStudentLaundryStatus(
  admissionDocId: string,
  laundryStatus: LaundrySubscriptionStatus,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "admissions", admissionDocId), {
      laundryStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] updateStudentLaundryStatus", error);
    throw new Error("Unable to update laundry status.");
  }
}

// ── Laundry Pickups ───────────────────────────────────────────────────────────

export async function fetchLaundryPickupsForDate(laundryId: string, date: string): Promise<LaundryPickup[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "laundryPickups"),
        where("laundryId", "==", laundryId),
        where("date", "==", date),
      ),
    );
    return snap.docs.map(mapLaundryPickup);
  } catch (error) {
    console.error("[firestore] fetchLaundryPickupsForDate", error);
    return [];
  }
}

/** Upsert a laundry pickup record — creates if not present, updates if already exists */
export async function upsertLaundryPickup(input: LaundryPickupInput): Promise<string> {
  try {
    const db = getDb();
    const existing = await getDocs(
      query(
        collection(db, "laundryPickups"),
        where("studentId", "==", input.studentId),
        where("date", "==", input.date),
        where("type", "==", input.type),
        limit(1),
      ),
    );

    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      if (existingDoc) {
        await updateDoc(existingDoc.ref, {
          status: input.status,
          employeeId: input.employeeId,
          pickedUpAt: input.status === "picked_up" ? serverTimestamp() : null,
          updatedAt: serverTimestamp(),
        });
        return existingDoc.id;
      }
    }

    const ref = doc(collection(db, "laundryPickups"));
    await setDoc(ref, {
      ...input,
      pickedUpAt: input.status === "picked_up" ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] upsertLaundryPickup", error);
    throw new Error("Unable to save laundry pickup status. Please check your connection and try again.");
  }
}

export async function fetchLaundryPickupSummaryForDate(
  laundryId: string,
  date: string,
): Promise<{ pickup: Record<string, number>; delivery: Record<string, number> }> {
  const pickups = await fetchLaundryPickupsForDate(laundryId, date);
  const empty = () => ({ pending: 0, picked_up: 0, not_available: 0, skipped: 0 });
  const result = { pickup: empty(), delivery: empty() };
  for (const p of pickups) {
    if (p.type === "pickup") result.pickup[p.status] = (result.pickup[p.status] ?? 0) + 1;
    else result.delivery[p.status] = (result.delivery[p.status] ?? 0) + 1;
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// STUDENT MESS RECORDS — daily tiffin per student
// ═══════════════════════════════════════════════════════════════════════════

import type {
  MessRecord, MessRecordInput,
  DoNotWantRecord,
  MessRequest, MessRequestInput,
  StudentLaundryRecord, StudentLaundryRecordInput,
} from "./types";

// ── IST helpers ───────────────────────────────────────────────────────────────

/** Returns today's date string as YYYY-MM-DD in IST (Asia/Kolkata) */
export function todayISTDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Returns current IST time as { h, m } (24-hour) */
export function currentISTTime(): { h: number; m: number } {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  return { h, m };
}

/** Returns ISO week string like "2026-W36" for any YYYY-MM-DD date */
export function getWeekId(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  // Use ISO week: Thursday determines the week year
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay(); // Mon=1 … Sun=7
  const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay();
  const startOfYear = new Date(jan4.getTime() - (jan4Day - 1) * 86400000);
  const weekNum = Math.floor((d.getTime() - startOfYear.getTime()) / (7 * 86400000)) + 1;
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** Returns { weekStart, weekEnd } as YYYY-MM-DD for the ISO week containing dateStr */
export function getWeekBounds(dateStr: string): { weekStart: string; weekEnd: string } {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay() === 0 ? 7 : d.getDay(); // Mon=1 … Sun=7
  const mon = new Date(d.getTime() - (day - 1) * 86400000);
  const sun = new Date(mon.getTime() + 6 * 86400000);
  const fmt = (dt: Date) => dt.toLocaleDateString("en-CA");
  return { weekStart: fmt(mon), weekEnd: fmt(sun) };
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapMessRecord(snap: QueryDocumentSnapshot<DocumentData>): MessRecord {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    studentName: d.studentName ?? "",
    studentEmail: d.studentEmail ?? "",
    admissionId: d.admissionId ?? "",
    messId: d.messId ?? "",
    messName: d.messName ?? "",
    date: d.date ?? "",
    lunchStatus: d.lunchStatus ?? "pending",
    lunchOtherReason: d.lunchOtherReason ?? "",
    lunchReceivedAt: toDate(d.lunchReceivedAt),
    lunchReturnStatus: d.lunchReturnStatus ?? "pending",
    lunchReturnedTo: d.lunchReturnedTo ?? "",
    lunchReturnedAt: toDate(d.lunchReturnedAt),
    dinnerStatus: d.dinnerStatus ?? "pending",
    dinnerOtherReason: d.dinnerOtherReason ?? "",
    dinnerReceivedAt: toDate(d.dinnerReceivedAt),
    dinnerReturnStatus: d.dinnerReturnStatus ?? "pending",
    dinnerReturnedTo: d.dinnerReturnedTo ?? "",
    dinnerReturnedAt: toDate(d.dinnerReturnedAt),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

function mapDoNotWant(snap: QueryDocumentSnapshot<DocumentData>): DoNotWantRecord {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    studentName: d.studentName ?? "",
    studentEmail: d.studentEmail ?? "",
    admissionId: d.admissionId ?? "",
    messId: d.messId ?? "",
    messName: d.messName ?? "",
    fromDate: d.fromDate ?? "",
    toDate: d.toDate ?? "",
    meals: Array.isArray(d.meals) ? d.meals : [],
    createdAt: toDate(d.createdAt),
  };
}

function mapMessRequest(snap: QueryDocumentSnapshot<DocumentData>): MessRequest {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    studentName: d.studentName ?? "",
    studentEmail: d.studentEmail ?? "",
    admissionId: d.admissionId ?? "",
    messId: d.messId ?? "",
    messName: d.messName ?? "",
    requestType: d.requestType ?? "other",
    description: d.description ?? "",
    status: d.status === "resolved" ? "resolved" : "active",
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

function mapStudentLaundryRecord(snap: QueryDocumentSnapshot<DocumentData>): StudentLaundryRecord {
  const d: any = snap.data();
  return {
    id: snap.id,
    studentId: d.studentId ?? "",
    studentName: d.studentName ?? "",
    studentEmail: d.studentEmail ?? "",
    admissionId: d.admissionId ?? "",
    laundryId: d.laundryId ?? "",
    laundryName: d.laundryName ?? "",
    weekId: d.weekId ?? "",
    weekStart: d.weekStart ?? "",
    weekEnd: d.weekEnd ?? "",
    pickupStatus: d.pickupStatus ?? "pending",
    pickupAt: toDate(d.pickupAt),
    receivedStatus: d.receivedStatus ?? "pending",
    receivedAt: toDate(d.receivedAt),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

// ── Mess Records ──────────────────────────────────────────────────────────────

/** Fetch or auto-create today's mess record for a student (upsert pattern) */
export async function getOrCreateMessRecord(
  input: MessRecordInput,
): Promise<MessRecord> {
  try {
    const db = getDb();
    const docId = `${input.studentId}_${input.date}`;
    const ref = doc(db, "messRecords", docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return mapMessRecord(snap as QueryDocumentSnapshot<DocumentData>);
    }
    const data = {
      ...input,
      lunchStatus: "pending" as const,
      lunchOtherReason: "",
      lunchReceivedAt: null,
      lunchReturnStatus: "pending" as const,
      lunchReturnedTo: "",
      lunchReturnedAt: null,
      dinnerStatus: "pending" as const,
      dinnerOtherReason: "",
      dinnerReceivedAt: null,
      dinnerReturnStatus: "pending" as const,
      dinnerReturnedTo: "",
      dinnerReturnedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return { id: docId, ...input, lunchStatus: "pending", lunchReturnStatus: "pending", dinnerStatus: "pending", dinnerReturnStatus: "pending", createdAt: null, updatedAt: null };
  } catch (error) {
    console.error("[firestore] getOrCreateMessRecord", error);
    throw new Error("Unable to load today's tiffin record. Please check your connection.");
  }
}

export async function fetchMessRecord(studentId: string, date: string): Promise<MessRecord | null> {
  try {
    const docId = `${studentId}_${date}`;
    const snap = await getDoc(doc(getDb(), "messRecords", docId));
    return snap.exists() ? mapMessRecord(snap as QueryDocumentSnapshot<DocumentData>) : null;
  } catch (error) {
    console.error("[firestore] fetchMessRecord", error);
    return null;
  }
}

export async function updateMessRecordField(
  studentId: string,
  date: string,
  patch: Partial<Omit<MessRecord, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  try {
    const docId = `${studentId}_${date}`;
    const ref = doc(getDb(), "messRecords", docId);
    await setDoc(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("[firestore] updateMessRecordField", error);
    throw new Error("Unable to update tiffin status. Please check your connection.");
  }
}

/** Fetch all mess records for a specific mess and date (for employee/admin view) */
export async function fetchMessRecordsForDate(messId: string, date: string): Promise<MessRecord[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "messRecords"),
        where("messId", "==", messId),
        where("date", "==", date),
      ),
    );
    return snap.docs.map(mapMessRecord);
  } catch (error) {
    console.error("[firestore] fetchMessRecordsForDate", error);
    return [];
  }
}

/** Fetch recent mess records for a student (history) */
export async function fetchMessRecordsForStudent(
  studentId: string,
  limitCount = 30,
): Promise<MessRecord[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "messRecords"),
        where("studentId", "==", studentId),
        orderBy("date", "desc"),
        limit(limitCount),
      ),
    );
    return snap.docs.map(mapMessRecord);
  } catch (error) {
    console.error("[firestore] fetchMessRecordsForStudent", error);
    return [];
  }
}

// ── Do Not Want Records ───────────────────────────────────────────────────────

export async function createDoNotWantRecord(
  input: Omit<DoNotWantRecord, "id" | "createdAt">,
): Promise<string> {
  try {
    const db = getDb();
    // Check for overlapping records (same student, overlapping date range, same meals)
    const existing = await getDocs(
      query(
        collection(db, "doNotWantRecords"),
        where("studentId", "==", input.studentId),
        where("fromDate", "==", input.fromDate),
        where("toDate", "==", input.toDate),
        limit(1),
      ),
    );
    if (!existing.empty) {
      // Update meals on existing record
      const existingDoc = existing.docs[0];
      if (existingDoc) {
        await updateDoc(existingDoc.ref, { meals: input.meals, updatedAt: serverTimestamp() });
        return existingDoc.id;
      }
    }
    const ref = doc(collection(db, "doNotWantRecords"));
    await setDoc(ref, { ...input, createdAt: serverTimestamp() });
    return ref.id;
  } catch (error) {
    console.error("[firestore] createDoNotWantRecord", error);
    throw new Error("Unable to save Do Not Want record. Please check your connection.");
  }
}

export async function fetchDoNotWantForStudent(studentId: string): Promise<DoNotWantRecord[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "doNotWantRecords"),
        where("studentId", "==", studentId),
        orderBy("fromDate", "desc"),
        limit(30),
      ),
    );
    return snap.docs.map(mapDoNotWant);
  } catch (error) {
    console.error("[firestore] fetchDoNotWantForStudent", error);
    return [];
  }
}

/** Check if a student has Do Not Want for a specific date + meal */
export async function isDoNotWant(
  studentId: string,
  date: string,
  meal: "lunch" | "dinner",
): Promise<boolean> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "doNotWantRecords"),
        where("studentId", "==", studentId),
        where("fromDate", "<=", date),
        where("toDate", ">=", date),
      ),
    );
    return snap.docs.some((d) => {
      const data = d.data();
      const meals: string[] = Array.isArray(data["meals"]) ? (data["meals"] as string[]) : [];
      return meals.includes(meal);
    });
  } catch {
    return false;
  }
}

// ── Mess Requests ─────────────────────────────────────────────────────────────

export async function createMessRequest(input: MessRequestInput): Promise<string> {
  try {
    const ref = doc(collection(getDb(), "messRequests"));
    await setDoc(ref, {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("[firestore] createMessRequest", error);
    throw new Error("Unable to save mess request. Please check your connection.");
  }
}

export async function updateMessRequest(
  id: string,
  patch: Partial<Pick<MessRequestInput, "requestType" | "description" | "status">>,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), "messRequests", id), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[firestore] updateMessRequest", error);
    throw new Error("Unable to update mess request. Please check your connection.");
  }
}

export async function fetchMessRequestsForStudent(studentId: string): Promise<MessRequest[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "messRequests"),
        where("studentId", "==", studentId),
        orderBy("createdAt", "desc"),
        limit(20),
      ),
    );
    return snap.docs.map(mapMessRequest);
  } catch (error) {
    console.error("[firestore] fetchMessRequestsForStudent", error);
    return [];
  }
}

export async function fetchMessRequestsForMess(messId: string): Promise<MessRequest[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "messRequests"),
        where("messId", "==", messId),
        limit(100),
      ),
    );
    // Sort client-side to avoid requiring a composite Firestore index
    return snap.docs
      .map(mapMessRequest)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  } catch (error) {
    console.error("[firestore] fetchMessRequestsForMess", error);
    return [];
  }
}

export async function fetchAllMessRequests(): Promise<MessRequest[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "messRequests"),
        orderBy("createdAt", "desc"),
        limit(200),
      ),
    );
    return snap.docs.map(mapMessRequest);
  } catch (error) {
    console.error("[firestore] fetchAllMessRequests", error);
    return [];
  }
}

// ── Student Laundry Records (weekly) ─────────────────────────────────────────

export async function getOrCreateStudentLaundryRecord(
  input: StudentLaundryRecordInput,
): Promise<StudentLaundryRecord> {
  try {
    const db = getDb();
    const docId = `${input.studentId}_${input.weekId}`;
    const ref = doc(db, "studentLaundryRecords", docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return mapStudentLaundryRecord(snap as QueryDocumentSnapshot<DocumentData>);
    }
    const data = {
      ...input,
      pickupStatus: "pending" as const,
      pickupAt: null,
      receivedStatus: "pending" as const,
      receivedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return {
      id: docId,
      ...input,
      pickupStatus: "pending",
      pickupAt: null,
      receivedStatus: "pending",
      receivedAt: null,
      createdAt: null,
      updatedAt: null,
    };
  } catch (error) {
    console.error("[firestore] getOrCreateStudentLaundryRecord", error);
    throw new Error("Unable to load laundry record. Please check your connection.");
  }
}

export async function updateStudentLaundryRecord(
  studentId: string,
  weekId: string,
  patch: Partial<Pick<StudentLaundryRecord, "pickupStatus" | "pickupAt" | "receivedStatus" | "receivedAt">>,
): Promise<void> {
  try {
    const docId = `${studentId}_${weekId}`;
    const ref = doc(getDb(), "studentLaundryRecords", docId);
    await setDoc(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("[firestore] updateStudentLaundryRecord", error);
    throw new Error("Unable to update laundry record. Please check your connection.");
  }
}

export async function fetchStudentLaundryRecords(
  studentId: string,
  limitCount = 10,
): Promise<StudentLaundryRecord[]> {
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "studentLaundryRecords"),
        where("studentId", "==", studentId),
        orderBy("weekStart", "desc"),
        limit(limitCount),
      ),
    );
    return snap.docs.map(mapStudentLaundryRecord);
  } catch (error) {
    console.error("[firestore] fetchStudentLaundryRecords", error);
    return [];
  }
}
