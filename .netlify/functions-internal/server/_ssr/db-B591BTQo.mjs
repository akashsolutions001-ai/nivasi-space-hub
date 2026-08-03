import "../_libs/firebase.mjs";
import { F as doc, P as collection, R as serverTimestamp, S as where, _ as orderBy, b as setDoc, d as addDoc, g as limit, h as getDocs, m as getDoc, v as query, x as updateDoc, y as runTransaction } from "../_libs/@firebase/firestore+[...].mjs";
import { n as getDb } from "./auth-CoXP-0dY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-B591BTQo.js
function toDate(value) {
	if (!value) return null;
	const ts = value;
	return typeof ts?.toDate === "function" ? ts.toDate() : null;
}
function mapAdmission(snap) {
	const d = snap.data();
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
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt)
	};
}
var friendly = (action) => `Unable to ${action}. Please check your connection and try again.`;
async function generateAdmissionId() {
	const db = getDb();
	const counterRef = doc(db, "counters", "admissions");
	const next = await runTransaction(db, async (tx) => {
		const snap = await tx.get(counterRef);
		const value = (snap.exists() ? Number(snap.data().value ?? 0) : 0) + 1;
		tx.set(counterRef, {
			value,
			updatedAt: serverTimestamp()
		}, { merge: true });
		return value;
	});
	return `NS-ADM-${String(next).padStart(6, "0")}`;
}
async function fetchAdmissions() {
	try {
		return (await getDocs(query(collection(getDb(), "admissions"), orderBy("createdAt", "desc")))).docs.map(mapAdmission);
	} catch (error) {
		console.error("[firestore] fetchAdmissions", error);
		throw new Error(friendly("load admissions"));
	}
}
async function fetchAdmission(admissionId) {
	try {
		const first = (await getDocs(query(collection(getDb(), "admissions"), where("admissionId", "==", admissionId), limit(1)))).docs[0];
		if (first) return mapAdmission(first);
		const byDoc = await getDoc(doc(getDb(), "admissions", admissionId));
		return byDoc.exists() ? mapAdmission(byDoc) : null;
	} catch (error) {
		console.error("[firestore] fetchAdmission", error);
		throw new Error(friendly("load this admission"));
	}
}
async function createAdmission(input) {
	try {
		return (await addDoc(collection(getDb(), "admissions"), {
			...input,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		})).id;
	} catch (error) {
		console.error("[firestore] createAdmission", error);
		throw new Error(friendly("save this admission"));
	}
}
async function updateAdmission(id, patch) {
	try {
		await updateDoc(doc(getDb(), "admissions", id), {
			...patch,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateAdmission", error);
		throw new Error(friendly("update this admission"));
	}
}
async function deleteAdmission(id) {
	try {
		await import("../_libs/firebase.mjs").then((n) => n.t).then(({ deleteDoc }) => deleteDoc(doc(getDb(), "admissions", id)));
	} catch (error) {
		console.error("[firestore] deleteAdmission", error);
		throw new Error(friendly("delete this admission"));
	}
}
async function fetchPackages() {
	try {
		return (await getDocs(collection(getDb(), "packages"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				packageId: d.packageId ?? s.id,
				packageName: d.packageName ?? "",
				services: Array.isArray(d.services) ? d.services : [],
				price: Number(d.price ?? 0),
				duration: Number(d.duration ?? 30),
				active: d.active !== false,
				createdAt: toDate(d.createdAt),
				updatedAt: toDate(d.updatedAt)
			};
		}).sort((a, b) => a.packageName.localeCompare(b.packageName));
	} catch (error) {
		console.error("[firestore] fetchPackages", error);
		throw new Error(friendly("load packages"));
	}
}
async function savePackage(pkg, existingId) {
	try {
		if (existingId) {
			await updateDoc(doc(getDb(), "packages", existingId), {
				...pkg,
				updatedAt: serverTimestamp()
			});
			return;
		}
		const ref = doc(collection(getDb(), "packages"));
		await setDoc(ref, {
			...pkg,
			packageId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] savePackage", error);
		throw new Error(friendly("save this package"));
	}
}
async function setPackageActive(id, active) {
	try {
		await updateDoc(doc(getDb(), "packages", id), {
			active,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] setPackageActive", error);
		throw new Error(friendly("update this package"));
	}
}
async function fetchColleges() {
	try {
		return (await getDocs(collection(getDb(), "colleges"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				collegeId: d.collegeId ?? s.id,
				collegeName: d.collegeName ?? "",
				active: d.active !== false
			};
		}).sort((a, b) => a.collegeName.localeCompare(b.collegeName));
	} catch (error) {
		console.error("[firestore] fetchColleges", error);
		return [];
	}
}
async function addCollege(collegeName) {
	const ref = doc(collection(getDb(), "colleges"));
	await setDoc(ref, {
		collegeId: ref.id,
		collegeName,
		active: true,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
async function setCollegeActive(id, active) {
	await updateDoc(doc(getDb(), "colleges", id), {
		active,
		updatedAt: serverTimestamp()
	});
}
async function fetchProperties() {
	try {
		return (await getDocs(collection(getDb(), "properties"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				propertyId: d.propertyId ?? s.id,
				propertyName: d.propertyName ?? d.name ?? "",
				address: d.address ?? "",
				city: d.city ?? "",
				active: d.active !== false
			};
		}).filter((p) => p.propertyName).sort((a, b) => a.propertyName.localeCompare(b.propertyName));
	} catch (error) {
		console.error("[firestore] fetchProperties", error);
		return [];
	}
}
/** Fetches all documents from the `rooms` collection and returns their details. */
async function fetchRooms() {
	try {
		return (await getDocs(collection(getDb(), "rooms"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				title: d.title ?? "",
				rooms: d.rooms ?? "",
				gender: d.gender ?? void 0,
				subscriptionStatus: d.subscriptionStatus ?? ""
			};
		}).filter((r) => r.title).sort((a, b) => a.title.localeCompare(b.title));
	} catch (error) {
		console.error("[firestore] fetchRooms", error);
		return [];
	}
}
async function addProperty(propertyName, city) {
	const ref = doc(collection(getDb(), "properties"));
	await setDoc(ref, {
		propertyId: ref.id,
		propertyName,
		city: city ?? "",
		address: "",
		active: true,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
async function setPropertyActive(id, active) {
	await updateDoc(doc(getDb(), "properties", id), {
		active,
		updatedAt: serverTimestamp()
	});
}
var DEFAULT_PACKAGES = [
	{
		packageName: "Room Only",
		services: ["Room"],
		price: 6e3,
		duration: 30
	},
	{
		packageName: "Room + Mess",
		services: ["Room", "Mess"],
		price: 9e3,
		duration: 30
	},
	{
		packageName: "Room + Laundry",
		services: ["Room", "Laundry"],
		price: 7500,
		duration: 30
	},
	{
		packageName: "Room + Ironing",
		services: ["Room", "Ironing"],
		price: 7e3,
		duration: 30
	},
	{
		packageName: "Room + House Cleaning",
		services: ["Room", "House Cleaning"],
		price: 7500,
		duration: 30
	},
	{
		packageName: "Complete Package",
		services: [
			"Room",
			"Mess",
			"Laundry",
			"Ironing",
			"House Cleaning"
		],
		price: 15e3,
		duration: 30
	},
	{
		packageName: "Custom Package",
		services: ["Room"],
		price: 0,
		duration: 30
	}
];
/** Creates starter packages and colleges the first time the app is used. */
async function seedDefaults() {
	const db = getDb();
	const [pkgSnap, collegeSnap] = await Promise.all([getDocs(collection(db, "packages")), getDocs(collection(db, "colleges"))]);
	if (pkgSnap.empty) await Promise.all(DEFAULT_PACKAGES.map((p) => {
		const ref = doc(collection(db, "packages"));
		return setDoc(ref, {
			...p,
			packageId: ref.id,
			active: true,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
	}));
	if (collegeSnap.empty) await Promise.all(["DYP Engineering College", "DYP Medical College"].map((collegeName) => {
		const ref = doc(collection(db, "colleges"));
		return setDoc(ref, {
			collegeId: ref.id,
			collegeName,
			active: true,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
	}));
}
//#endregion
export { updateAdmission as _, fetchAdmission as a, fetchPackages as c, generateAdmissionId as d, savePackage as f, setPropertyActive as g, setPackageActive as h, deleteAdmission as i, fetchProperties as l, setCollegeActive as m, addProperty as n, fetchAdmissions as o, seedDefaults as p, createAdmission as r, fetchColleges as s, addCollege as t, fetchRooms as u };
