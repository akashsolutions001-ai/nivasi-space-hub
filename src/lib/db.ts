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
    tiffinProvided: Boolean(d.tiffinProvided),
    mattressRequired: Boolean(d.mattressRequired),
    notes: d.notes ?? "",
    parentName: d.parentName ?? "",
    parentPhone: d.parentPhone ?? "",
    parentRelation: d.parentRelation ?? "",
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
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
    const ref = await addDoc(collection(getDb(), "admissions"), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
  gender?: string;       // e.g. "male", "female", "boys", "girls", "any", "co-ed"
  subscriptionStatus?: string;
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
          gender: (d.gender as string | undefined) ?? undefined,
          subscriptionStatus: d.subscriptionStatus ?? "",
        } satisfies Room;
      })
      .filter((r) => r.title)
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("[firestore] fetchRooms", error);
    return [];
  }
}

export async function addProperty(propertyName: string, city?: string): Promise<void> {
  const ref = doc(collection(getDb(), "properties"));
  await setDoc(ref, {
    propertyId: ref.id,
    propertyName,
    city: city ?? "",
    address: "",
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function setPropertyActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(getDb(), "properties", id), { active, updatedAt: serverTimestamp() });
}

/* --------------------------------- Admin Users ---------------------------- */

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
