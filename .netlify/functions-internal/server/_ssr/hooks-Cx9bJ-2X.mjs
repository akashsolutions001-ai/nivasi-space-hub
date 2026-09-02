import { r as isFirebaseConfigured } from "./firebase-config-IuKIWniX.mjs";
import { c as updateProfile, n as createUserWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { F as doc, P as collection, R as serverTimestamp, S as where, _ as orderBy, b as setDoc, d as addDoc, g as limit, h as getDocs, m as getDoc, v as query, x as updateDoc, y as runTransaction } from "../_libs/@firebase/firestore+[...].mjs";
import { r as getFirebaseAuth, t as getDb } from "./firebase-7zuyzO2h.mjs";
import { n as useAuth } from "./auth-D8HbqhQ8.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-Cx9bJ-2X.js
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
		bagPaymentCollected: Boolean(d.bagPaymentCollected),
		tiffinProvided: Boolean(d.tiffinProvided),
		tiffinPaymentCollected: Boolean(d.tiffinPaymentCollected),
		mattressRequired: Boolean(d.mattressRequired),
		mattressPaymentCollected: Boolean(d.mattressPaymentCollected),
		paymentMode: d.paymentMode === "online" || d.paymentMode === "cash" ? d.paymentMode : null,
		notes: d.notes ?? "",
		parentName: d.parentName ?? "",
		parentPhone: d.parentPhone ?? "",
		parentRelation: d.parentRelation ?? "",
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt),
		messId: d.messId ?? "",
		messName: d.messName ?? "",
		tiffinStatus: d.tiffinStatus ?? ""
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
		const ref = await addDoc(collection(getDb(), "admissions"), {
			...input,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		const email = (input.email ?? "").trim();
		const parentPhone = input.parentPhone ?? "";
		if (email && parentPhone.replace(/\D/g, "").length >= 6) await ensureStudentAuthAccount(email, parentPhone, input.fullName ?? "").catch(() => {});
		return ref.id;
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
/**
* Creates a Firebase Auth account for a single existing student via the
* Identity Toolkit REST API — no Firebase SDK session changes, no secondary app.
*
* Email = admission email, password = parentPhone digits only.
* Safe to call multiple times — "EMAIL_EXISTS" is silently treated as success.
*/
async function ensureStudentAuthAccount(email, parentPhone, fullName) {
	const password = parentPhone.replace(/\D/g, "");
	if (!email || password.length < 6) return "skipped";
	const { firebaseConfig } = await import("./firebase-config-IuKIWniX.mjs").then((n) => n.n).then((n) => n.n);
	const apiKey = firebaseConfig.apiKey;
	try {
		const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: email.trim(),
				password,
				displayName: fullName,
				returnSecureToken: false
			})
		});
		const data = await res.json();
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
				collegeType: d.collegeType ?? "other",
				city: d.city ?? "",
				active: d.active !== false
			};
		}).sort((a, b) => a.collegeName.localeCompare(b.collegeName));
	} catch (error) {
		console.error("[firestore] fetchColleges", error);
		return [];
	}
}
async function addCollege(collegeName, collegeType = "other", city = "") {
	const ref = doc(collection(getDb(), "colleges"));
	await setDoc(ref, {
		collegeId: ref.id,
		collegeName,
		collegeType,
		city,
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
async function updateCollege(id, patch) {
	await updateDoc(doc(getDb(), "colleges", id), {
		...patch,
		updatedAt: serverTimestamp()
	});
}
async function fetchCities() {
	try {
		return (await getDocs(collection(getDb(), "cities"))).docs.map((s) => {
			const d = s.data();
			return {
				id: s.id,
				cityId: d.cityId ?? s.id,
				cityName: d.cityName ?? "",
				active: d.active !== false
			};
		}).sort((a, b) => a.cityName.localeCompare(b.cityName));
	} catch (error) {
		console.error("[firestore] fetchCities", error);
		return [];
	}
}
async function addCity(cityName) {
	const ref = doc(collection(getDb(), "cities"));
	await setDoc(ref, {
		cityId: ref.id,
		cityName,
		active: true,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
async function setCityActive(id, active) {
	await updateDoc(doc(getDb(), "cities", id), {
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
				ownerName: d.ownerName ?? "",
				ownerPhone: d.ownerPhone ?? "",
				totalBeds: Number(d.totalBeds ?? 0),
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
				roomType: d.roomType ?? "",
				gender: d.gender ?? void 0,
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
				ownerPhone: d.ownerPhone ?? ""
			};
		}).filter((r) => r.title).sort((a, b) => a.title.localeCompare(b.title));
	} catch (error) {
		console.error("[firestore] fetchRooms", error);
		return [];
	}
}
async function fetchUserProfile(uid) {
	try {
		const snap = await getDoc(doc(getDb(), "users", uid));
		if (!snap.exists()) return null;
		const d = snap.data();
		return {
			uid: d.uid ?? uid,
			email: d.email ?? "",
			displayName: d.displayName ?? "",
			role: d.role ?? "admin",
			collegeId: d.collegeId ?? "",
			collegeName: d.collegeName ?? ""
		};
	} catch (error) {
		console.error("[firestore] fetchUserProfile", error);
		return null;
	}
}
/**
* Creates a new admin user in Firebase Auth and saves their profile to
* the /users collection so they appear in the admin panel.
*/
async function createAdminUser(input) {
	try {
		const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email.trim(), input.password);
		await updateProfile(user, { displayName: input.displayName });
		const userRef = doc(getDb(), "users", user.uid);
		await setDoc(userRef, {
			uid: user.uid,
			email: input.email.trim(),
			displayName: input.displayName,
			role: "admin",
			collegeId: input.collegeId,
			collegeName: input.collegeName,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return user.uid;
	} catch (error) {
		console.error("[firestore] createAdminUser", error);
		const code = error?.code ?? "";
		if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
		if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
		if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
		throw new Error("Could not create the admin account. Please try again.");
	}
}
function mapMess(snap) {
	const d = snap.data();
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
		updatedAt: toDate(d.updatedAt)
	};
}
function mapEmployee(snap) {
	const d = snap.data();
	const messIds = Array.isArray(d.messIds) ? d.messIds : d.messId ? [d.messId] : [];
	const messNames = Array.isArray(d.messNames) ? d.messNames : d.messName ? [d.messName] : [];
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
		createdAt: toDate(d.createdAt)
	};
}
function mapDelivery(snap) {
	const d = snap.data();
	return {
		id: snap.id,
		studentId: d.studentId ?? "",
		admissionId: d.admissionId ?? "",
		messId: d.messId ?? "",
		employeeId: d.employeeId ?? "",
		date: d.date ?? "",
		meal: d.meal === "dinner" ? "dinner" : "lunch",
		status: [
			"pending",
			"delivered",
			"not_available",
			"skipped"
		].includes(d.status) ? d.status : "pending",
		deliveredAt: toDate(d.deliveredAt),
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt)
	};
}
async function fetchMesses() {
	try {
		return (await getDocs(query(collection(getDb(), "messes"), orderBy("messName")))).docs.map(mapMess);
	} catch (error) {
		console.error("[firestore] fetchMesses", error);
		throw new Error("Unable to load messes. Please check your connection and try again.");
	}
}
async function createMess(input) {
	try {
		const ref = doc(collection(getDb(), "messes"));
		await setDoc(ref, {
			...input,
			messId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createMess", error);
		throw new Error("Unable to create mess. Please check your connection and try again.");
	}
}
async function updateMess(id, patch) {
	try {
		await updateDoc(doc(getDb(), "messes", id), {
			...patch,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateMess", error);
		throw new Error("Unable to update mess. Please check your connection and try again.");
	}
}
async function setMessStatus(id, status) {
	try {
		await updateDoc(doc(getDb(), "messes", id), {
			status,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] setMessStatus", error);
		throw new Error("Unable to update mess status.");
	}
}
async function deleteMess(id) {
	try {
		await import("../_libs/firebase.mjs").then((n) => n.t).then(({ deleteDoc }) => deleteDoc(doc(getDb(), "messes", id)));
	} catch (error) {
		console.error("[firestore] deleteMess", error);
		throw new Error("Unable to delete mess. Please check your connection and try again.");
	}
}
async function fetchEmployees() {
	try {
		return (await getDocs(query(collection(getDb(), "employees"), orderBy("name")))).docs.map(mapEmployee);
	} catch (error) {
		console.error("[firestore] fetchEmployees", error);
		throw new Error("Unable to load employees. Please check your connection and try again.");
	}
}
async function fetchEmployeeByUid(uid) {
	try {
		const snap = await getDocs(query(collection(getDb(), "employees"), where("uid", "==", uid), limit(1)));
		return snap.docs[0] ? mapEmployee(snap.docs[0]) : null;
	} catch (error) {
		console.error("[firestore] fetchEmployeeByUid", error);
		return null;
	}
}
async function createMessEmployee(input) {
	try {
		const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email.trim(), input.password);
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
			createdAt: serverTimestamp()
		});
		await setDoc(doc(getDb(), "users", user.uid), {
			uid: user.uid,
			email: input.email.trim(),
			displayName: input.name,
			role: "mess_employee",
			messIds: input.messIds,
			messNames: input.messNames,
			employeeId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createMessEmployee", error);
		const code = error?.code ?? "";
		if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
		if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
		if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
		throw new Error("Could not create employee account. Please try again.");
	}
}
async function updateMessEmployee(id, patch) {
	try {
		await updateDoc(doc(getDb(), "employees", id), { ...patch });
		if (patch.messIds !== void 0) {
			const empSnap = await getDoc(doc(getDb(), "employees", id));
			if (empSnap.exists()) {
				const uid = empSnap.data().uid ?? "";
				if (uid) await updateDoc(doc(getDb(), "users", uid), {
					messIds: patch.messIds,
					messNames: patch.messNames ?? [],
					updatedAt: serverTimestamp()
				});
			}
		}
	} catch (error) {
		console.error("[firestore] updateMessEmployee", error);
		throw new Error("Unable to update employee. Please check your connection and try again.");
	}
}
async function assignStudentToMess(admissionDocId, messId, messName, tiffinStatus = "active") {
	try {
		await updateDoc(doc(getDb(), "admissions", admissionDocId), {
			messId,
			messName,
			tiffinStatus,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] assignStudentToMess", error);
		throw new Error("Unable to assign student to mess. Please check your connection and try again.");
	}
}
async function updateStudentTiffinStatus(admissionDocId, tiffinStatus) {
	try {
		await updateDoc(doc(getDb(), "admissions", admissionDocId), {
			tiffinStatus,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateStudentTiffinStatus", error);
		throw new Error("Unable to update tiffin status.");
	}
}
/** Today's date as YYYY-MM-DD in local time */
function todayDateString() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
async function fetchDeliveriesForDate(messId, date) {
	try {
		return (await getDocs(query(collection(getDb(), "deliveries"), where("messId", "==", messId), where("date", "==", date)))).docs.map(mapDelivery);
	} catch (error) {
		console.error("[firestore] fetchDeliveriesForDate", error);
		return [];
	}
}
async function fetchDeliveriesForStudent(studentId, limitCount = 60) {
	try {
		return (await getDocs(query(collection(getDb(), "deliveries"), where("studentId", "==", studentId), orderBy("date", "desc"), limit(limitCount)))).docs.map(mapDelivery);
	} catch (error) {
		console.error("[firestore] fetchDeliveriesForStudent", error);
		return [];
	}
}
/** Upsert a delivery record — creates if not present, updates if already exists */
async function upsertDelivery(input) {
	try {
		const db = getDb();
		const existing = await getDocs(query(collection(db, "deliveries"), where("studentId", "==", input.studentId), where("date", "==", input.date), where("meal", "==", input.meal), limit(1)));
		if (!existing.empty) {
			const existingDoc = existing.docs[0];
			if (existingDoc) {
				await updateDoc(existingDoc.ref, {
					status: input.status,
					employeeId: input.employeeId,
					deliveredAt: input.status === "delivered" ? serverTimestamp() : null,
					updatedAt: serverTimestamp()
				});
				return existingDoc.id;
			}
		}
		const ref = doc(collection(db, "deliveries"));
		await setDoc(ref, {
			...input,
			deliveredAt: input.status === "delivered" ? serverTimestamp() : null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] upsertDelivery", error);
		throw new Error("Unable to save delivery status. Please check your connection and try again.");
	}
}
async function fetchDeliverySummaryForDate(messId, date) {
	const deliveries = await fetchDeliveriesForDate(messId, date);
	const empty = () => ({
		pending: 0,
		delivered: 0,
		not_available: 0,
		skipped: 0
	});
	const result = {
		lunch: empty(),
		dinner: empty()
	};
	for (const d of deliveries) if (d.meal === "lunch") result.lunch[d.status] = (result.lunch[d.status] ?? 0) + 1;
	else result.dinner[d.status] = (result.dinner[d.status] ?? 0) + 1;
	return result;
}
function mapPayout(snap) {
	const d = snap.data();
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
		refundReason: d.refundReason ?? ""
	};
}
async function generatePayoutId() {
	const db = getDb();
	const counterRef = doc(db, "counters", "payouts");
	const next = await runTransaction(db, async (tx) => {
		const snap = await tx.get(counterRef);
		const value = (snap.exists() ? Number(snap.data().value ?? 0) : 0) + 1;
		tx.set(counterRef, {
			value,
			updatedAt: serverTimestamp()
		}, { merge: true });
		return value;
	});
	const today = /* @__PURE__ */ new Date();
	return `PAY-${`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`}-${String(next).padStart(4, "0")}`;
}
async function fetchPayouts(options) {
	try {
		const db = getDb();
		const constraints = [orderBy("createdAt", "desc")];
		if (options?.startDate) constraints.push(where("createdAt", ">=", options.startDate));
		if (options?.endDate) constraints.push(where("createdAt", "<=", options.endDate));
		if (options?.limitCount) constraints.push(limit(options.limitCount));
		return (await getDocs(query(collection(db, "payouts"), ...constraints))).docs.map(mapPayout);
	} catch (error) {
		console.error("[firestore] fetchPayouts", error);
		throw new Error("Unable to load payouts. Please check your connection and try again.");
	}
}
async function fetchPayoutsByMess(messId) {
	try {
		return (await getDocs(query(collection(getDb(), "payouts"), where("messId", "==", messId), orderBy("createdAt", "desc")))).docs.map(mapPayout);
	} catch (error) {
		console.error("[firestore] fetchPayoutsByMess", error);
		return [];
	}
}
async function fetchPayoutsByLaundry(laundryId) {
	try {
		return (await getDocs(query(collection(getDb(), "payouts"), where("laundryId", "==", laundryId), orderBy("createdAt", "desc")))).docs.map(mapPayout);
	} catch (error) {
		console.error("[firestore] fetchPayoutsByLaundry", error);
		return [];
	}
}
async function createPayout(input) {
	try {
		const ref = doc(collection(getDb(), "payouts"));
		await setDoc(ref, {
			...input,
			status: "PENDING",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createPayout", error);
		throw new Error("Unable to create payout. Please check your connection and try again.");
	}
}
async function updatePayout(id, patch, updatedBy) {
	try {
		await updateDoc(doc(getDb(), "payouts", id), {
			...patch,
			updatedBy,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updatePayout", error);
		throw new Error("Unable to update payout. Please check your connection and try again.");
	}
}
async function updatePayoutStatus(id, status, processedBy) {
	try {
		const patch = {
			status,
			updatedBy: processedBy,
			updatedAt: serverTimestamp()
		};
		if (status === "PAID" || status === "PROCESSING") {
			patch.processedBy = processedBy;
			patch.processedAt = serverTimestamp();
		}
		await updateDoc(doc(getDb(), "payouts", id), patch);
	} catch (error) {
		console.error("[firestore] updatePayoutStatus", error);
		throw new Error("Unable to update payout status.");
	}
}
function mapLaundry(snap) {
	const d = snap.data();
	return {
		id: snap.id,
		laundryId: d.laundryId ?? snap.id,
		laundryName: d.laundryName ?? "",
		ownerName: d.ownerName ?? "",
		ownerPhone: d.ownerPhone ?? "",
		propertyId: d.propertyId ?? "",
		status: d.status === "inactive" ? "inactive" : "active",
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt)
	};
}
function mapLaundryEmployee(snap) {
	const d = snap.data();
	const laundryIds = Array.isArray(d.laundryIds) ? d.laundryIds : d.laundryId ? [d.laundryId] : [];
	const laundryNames = Array.isArray(d.laundryNames) ? d.laundryNames : d.laundryName ? [d.laundryName] : [];
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
		createdAt: toDate(d.createdAt)
	};
}
function mapLaundryPickup(snap) {
	const d = snap.data();
	return {
		id: snap.id,
		studentId: d.studentId ?? "",
		admissionId: d.admissionId ?? "",
		laundryId: d.laundryId ?? "",
		employeeId: d.employeeId ?? "",
		date: d.date ?? "",
		type: d.type === "delivery" ? "delivery" : "pickup",
		status: [
			"pending",
			"picked_up",
			"not_available",
			"skipped"
		].includes(d.status) ? d.status : "pending",
		pickedUpAt: toDate(d.pickedUpAt),
		createdAt: toDate(d.createdAt),
		updatedAt: toDate(d.updatedAt)
	};
}
async function fetchLaundries() {
	try {
		return (await getDocs(query(collection(getDb(), "laundries"), orderBy("laundryName")))).docs.map(mapLaundry);
	} catch (error) {
		console.error("[firestore] fetchLaundries", error);
		throw new Error("Unable to load laundries. Please check your connection and try again.");
	}
}
async function createLaundry(input) {
	try {
		const ref = doc(collection(getDb(), "laundries"));
		await setDoc(ref, {
			...input,
			laundryId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createLaundry", error);
		throw new Error("Unable to create laundry. Please check your connection and try again.");
	}
}
async function updateLaundry(id, patch) {
	try {
		await updateDoc(doc(getDb(), "laundries", id), {
			...patch,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateLaundry", error);
		throw new Error("Unable to update laundry. Please check your connection and try again.");
	}
}
async function setLaundryStatus(id, status) {
	try {
		await updateDoc(doc(getDb(), "laundries", id), {
			status,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] setLaundryStatus", error);
		throw new Error("Unable to update laundry status.");
	}
}
async function deleteLaundry(id) {
	try {
		await import("../_libs/firebase.mjs").then((n) => n.t).then(({ deleteDoc }) => deleteDoc(doc(getDb(), "laundries", id)));
	} catch (error) {
		console.error("[firestore] deleteLaundry", error);
		throw new Error("Unable to delete laundry. Please check your connection and try again.");
	}
}
async function fetchLaundryEmployees() {
	try {
		return (await getDocs(query(collection(getDb(), "laundryEmployees"), orderBy("name")))).docs.map(mapLaundryEmployee);
	} catch (error) {
		console.error("[firestore] fetchLaundryEmployees", error);
		throw new Error("Unable to load laundry employees. Please check your connection and try again.");
	}
}
async function fetchLaundryEmployeeByUid(uid) {
	try {
		const snap = await getDocs(query(collection(getDb(), "laundryEmployees"), where("uid", "==", uid), limit(1)));
		return snap.docs[0] ? mapLaundryEmployee(snap.docs[0]) : null;
	} catch (error) {
		console.error("[firestore] fetchLaundryEmployeeByUid", error);
		return null;
	}
}
async function createLaundryEmployee(input) {
	try {
		const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email.trim(), input.password);
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
			createdAt: serverTimestamp()
		});
		await setDoc(doc(getDb(), "users", user.uid), {
			uid: user.uid,
			email: input.email.trim(),
			displayName: input.name,
			role: "laundry_employee",
			laundryIds: input.laundryIds,
			laundryNames: input.laundryNames,
			employeeId: ref.id,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createLaundryEmployee", error);
		const code = error?.code ?? "";
		if (code === "auth/email-already-in-use") throw new Error("An account with this email already exists.");
		if (code === "auth/weak-password") throw new Error("Password must be at least 6 characters.");
		if (code === "auth/invalid-email") throw new Error("Please enter a valid email address.");
		throw new Error("Could not create employee account. Please try again.");
	}
}
async function updateLaundryEmployee(id, patch) {
	try {
		await updateDoc(doc(getDb(), "laundryEmployees", id), { ...patch });
		if (patch.laundryIds !== void 0) {
			const empSnap = await getDoc(doc(getDb(), "laundryEmployees", id));
			if (empSnap.exists()) {
				const uid = empSnap.data().uid ?? "";
				if (uid) await updateDoc(doc(getDb(), "users", uid), {
					laundryIds: patch.laundryIds,
					laundryNames: patch.laundryNames ?? [],
					updatedAt: serverTimestamp()
				});
			}
		}
	} catch (error) {
		console.error("[firestore] updateLaundryEmployee", error);
		throw new Error("Unable to update laundry employee. Please check your connection and try again.");
	}
}
async function assignStudentToLaundry(admissionDocId, laundryId, laundryName, laundryStatus = "active") {
	try {
		await updateDoc(doc(getDb(), "admissions", admissionDocId), {
			laundryId,
			laundryName,
			laundryStatus,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] assignStudentToLaundry", error);
		throw new Error("Unable to assign student to laundry. Please check your connection and try again.");
	}
}
async function fetchLaundryPickupsForDate(laundryId, date) {
	try {
		return (await getDocs(query(collection(getDb(), "laundryPickups"), where("laundryId", "==", laundryId), where("date", "==", date)))).docs.map(mapLaundryPickup);
	} catch (error) {
		console.error("[firestore] fetchLaundryPickupsForDate", error);
		return [];
	}
}
/** Upsert a laundry pickup record — creates if not present, updates if already exists */
async function upsertLaundryPickup(input) {
	try {
		const db = getDb();
		const existing = await getDocs(query(collection(db, "laundryPickups"), where("studentId", "==", input.studentId), where("date", "==", input.date), where("type", "==", input.type), limit(1)));
		if (!existing.empty) {
			const existingDoc = existing.docs[0];
			if (existingDoc) {
				await updateDoc(existingDoc.ref, {
					status: input.status,
					employeeId: input.employeeId,
					pickedUpAt: input.status === "picked_up" ? serverTimestamp() : null,
					updatedAt: serverTimestamp()
				});
				return existingDoc.id;
			}
		}
		const ref = doc(collection(db, "laundryPickups"));
		await setDoc(ref, {
			...input,
			pickedUpAt: input.status === "picked_up" ? serverTimestamp() : null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] upsertLaundryPickup", error);
		throw new Error("Unable to save laundry pickup status. Please check your connection and try again.");
	}
}
async function fetchLaundryPickupSummaryForDate(laundryId, date) {
	const pickups = await fetchLaundryPickupsForDate(laundryId, date);
	const empty = () => ({
		pending: 0,
		picked_up: 0,
		not_available: 0,
		skipped: 0
	});
	const result = {
		pickup: empty(),
		delivery: empty()
	};
	for (const p of pickups) if (p.type === "pickup") result.pickup[p.status] = (result.pickup[p.status] ?? 0) + 1;
	else result.delivery[p.status] = (result.delivery[p.status] ?? 0) + 1;
	return result;
}
/** Returns today's date string as YYYY-MM-DD in IST (Asia/Kolkata) */
function todayISTDateString() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
/** Returns current IST time as { h, m } (24-hour) */
function currentISTTime() {
	const parts = new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(/* @__PURE__ */ new Date());
	return {
		h: parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10),
		m: parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10)
	};
}
/** Returns ISO week string like "2026-W36" for any YYYY-MM-DD date */
function getWeekId(dateStr) {
	const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
	const jan4 = new Date(d.getFullYear(), 0, 4);
	d.getDay() === 0 || d.getDay();
	const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay();
	const startOfYear = /* @__PURE__ */ new Date(jan4.getTime() - (jan4Day - 1) * 864e5);
	const weekNum = Math.floor((d.getTime() - startOfYear.getTime()) / 6048e5) + 1;
	return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
/** Returns { weekStart, weekEnd } as YYYY-MM-DD for the ISO week containing dateStr */
function getWeekBounds(dateStr) {
	const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
	const day = d.getDay() === 0 ? 7 : d.getDay();
	const mon = /* @__PURE__ */ new Date(d.getTime() - (day - 1) * 864e5);
	const sun = new Date(mon.getTime() + 5184e5);
	const fmt = (dt) => dt.toLocaleDateString("en-CA");
	return {
		weekStart: fmt(mon),
		weekEnd: fmt(sun)
	};
}
function mapMessRecord(snap) {
	const d = snap.data();
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
		updatedAt: toDate(d.updatedAt)
	};
}
function mapMessRequest(snap) {
	const d = snap.data();
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
		updatedAt: toDate(d.updatedAt)
	};
}
function mapStudentLaundryRecord(snap) {
	const d = snap.data();
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
		updatedAt: toDate(d.updatedAt)
	};
}
/** Fetch or auto-create today's mess record for a student (upsert pattern) */
async function getOrCreateMessRecord(input) {
	try {
		const db = getDb();
		const docId = `${input.studentId}_${input.date}`;
		const ref = doc(db, "messRecords", docId);
		const snap = await getDoc(ref);
		if (snap.exists()) return mapMessRecord(snap);
		const data = {
			...input,
			lunchStatus: "pending",
			lunchOtherReason: "",
			lunchReceivedAt: null,
			lunchReturnStatus: "pending",
			lunchReturnedTo: "",
			lunchReturnedAt: null,
			dinnerStatus: "pending",
			dinnerOtherReason: "",
			dinnerReceivedAt: null,
			dinnerReturnStatus: "pending",
			dinnerReturnedTo: "",
			dinnerReturnedAt: null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		};
		await setDoc(ref, data);
		return {
			id: docId,
			...input,
			lunchStatus: "pending",
			lunchReturnStatus: "pending",
			dinnerStatus: "pending",
			dinnerReturnStatus: "pending",
			createdAt: null,
			updatedAt: null
		};
	} catch (error) {
		console.error("[firestore] getOrCreateMessRecord", error);
		throw new Error("Unable to load today's tiffin record. Please check your connection.");
	}
}
async function updateMessRecordField(studentId, date, patch) {
	try {
		const docId = `${studentId}_${date}`;
		const ref = doc(getDb(), "messRecords", docId);
		await setDoc(ref, {
			...patch,
			updatedAt: serverTimestamp()
		}, { merge: true });
	} catch (error) {
		console.error("[firestore] updateMessRecordField", error);
		throw new Error("Unable to update tiffin status. Please check your connection.");
	}
}
/** Fetch all mess records for a specific mess and date (for employee/admin view) */
async function fetchMessRecordsForDate(messId, date) {
	try {
		return (await getDocs(query(collection(getDb(), "messRecords"), where("messId", "==", messId), where("date", "==", date)))).docs.map(mapMessRecord);
	} catch (error) {
		console.error("[firestore] fetchMessRecordsForDate", error);
		return [];
	}
}
/** Fetch recent mess records for a student (history) */
async function fetchMessRecordsForStudent(studentId, limitCount = 30) {
	try {
		return (await getDocs(query(collection(getDb(), "messRecords"), where("studentId", "==", studentId), orderBy("date", "desc"), limit(limitCount)))).docs.map(mapMessRecord);
	} catch (error) {
		console.error("[firestore] fetchMessRecordsForStudent", error);
		return [];
	}
}
async function createDoNotWantRecord(input) {
	try {
		const db = getDb();
		const existing = await getDocs(query(collection(db, "doNotWantRecords"), where("studentId", "==", input.studentId), where("fromDate", "==", input.fromDate), where("toDate", "==", input.toDate), limit(1)));
		if (!existing.empty) {
			const existingDoc = existing.docs[0];
			if (existingDoc) {
				await updateDoc(existingDoc.ref, {
					meals: input.meals,
					updatedAt: serverTimestamp()
				});
				return existingDoc.id;
			}
		}
		const ref = doc(collection(db, "doNotWantRecords"));
		await setDoc(ref, {
			...input,
			createdAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createDoNotWantRecord", error);
		throw new Error("Unable to save Do Not Want record. Please check your connection.");
	}
}
async function createMessRequest(input) {
	try {
		const ref = doc(collection(getDb(), "messRequests"));
		await setDoc(ref, {
			...input,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return ref.id;
	} catch (error) {
		console.error("[firestore] createMessRequest", error);
		throw new Error("Unable to save mess request. Please check your connection.");
	}
}
async function updateMessRequest(id, patch) {
	try {
		await updateDoc(doc(getDb(), "messRequests", id), {
			...patch,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error("[firestore] updateMessRequest", error);
		throw new Error("Unable to update mess request. Please check your connection.");
	}
}
async function fetchMessRequestsForStudent(studentId) {
	try {
		return (await getDocs(query(collection(getDb(), "messRequests"), where("studentId", "==", studentId), orderBy("createdAt", "desc"), limit(20)))).docs.map(mapMessRequest);
	} catch (error) {
		console.error("[firestore] fetchMessRequestsForStudent", error);
		return [];
	}
}
async function fetchMessRequestsForMess(messId) {
	try {
		return (await getDocs(query(collection(getDb(), "messRequests"), where("messId", "==", messId), limit(100)))).docs.map(mapMessRequest).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
	} catch (error) {
		console.error("[firestore] fetchMessRequestsForMess", error);
		return [];
	}
}
async function getOrCreateStudentLaundryRecord(input) {
	try {
		const db = getDb();
		const docId = `${input.studentId}_${input.weekId}`;
		const ref = doc(db, "studentLaundryRecords", docId);
		const snap = await getDoc(ref);
		if (snap.exists()) return mapStudentLaundryRecord(snap);
		const data = {
			...input,
			pickupStatus: "pending",
			pickupAt: null,
			receivedStatus: "pending",
			receivedAt: null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
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
			updatedAt: null
		};
	} catch (error) {
		console.error("[firestore] getOrCreateStudentLaundryRecord", error);
		throw new Error("Unable to load laundry record. Please check your connection.");
	}
}
async function updateStudentLaundryRecord(studentId, weekId, patch) {
	try {
		const docId = `${studentId}_${weekId}`;
		const ref = doc(getDb(), "studentLaundryRecords", docId);
		await setDoc(ref, {
			...patch,
			updatedAt: serverTimestamp()
		}, { merge: true });
	} catch (error) {
		console.error("[firestore] updateStudentLaundryRecord", error);
		throw new Error("Unable to update laundry record. Please check your connection.");
	}
}
async function fetchStudentLaundryRecords(studentId, limitCount = 10) {
	try {
		return (await getDocs(query(collection(getDb(), "studentLaundryRecords"), where("studentId", "==", studentId), orderBy("weekStart", "desc"), limit(limitCount)))).docs.map(mapStudentLaundryRecord);
	} catch (error) {
		console.error("[firestore] fetchStudentLaundryRecords", error);
		return [];
	}
}
function useIsReady() {
	const { user, loading } = useAuth();
	return isFirebaseConfigured && !loading && !!user;
}
function useAdmissions() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["admissions"],
		queryFn: fetchAdmissions,
		enabled: ready
	});
}
function usePackages() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["packages"],
		queryFn: fetchPackages,
		enabled: ready
	});
}
function useColleges() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["colleges"],
		queryFn: fetchColleges,
		enabled: ready
	});
}
function useProperties() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["properties"],
		queryFn: fetchProperties,
		enabled: ready
	});
}
function useRooms() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["rooms"],
		queryFn: fetchRooms,
		enabled: ready
	});
}
function useCities() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["cities"],
		queryFn: fetchCities,
		enabled: ready
	});
}
function useUserProfile() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["userProfile", user?.uid],
		queryFn: () => fetchUserProfile(user.uid),
		enabled: isFirebaseConfigured && !!user?.uid
	});
}
function computeStats(rows) {
	const weekAgo = Date.now() - 6048e5;
	return rows.reduce((acc, r) => {
		acc.total += 1;
		if (r.createdAt && r.createdAt.getTime() >= weekAgo) acc.recent += 1;
		if (r.paymentStatus === "completed") acc.paid += 1;
		else acc.paymentPending += 1;
		if (r.bagProvided) acc.bagsProvided += 1;
		else acc.bagsPending += 1;
		if (r.tiffinProvided) acc.tiffinProvided += 1;
		else acc.tiffinPending += 1;
		if (r.mattressRequired) acc.mattressRequired += 1;
		else acc.mattressNotRequired += 1;
		acc.totalValue += r.packageAmount;
		acc.collected += r.amountPaid;
		acc.outstanding += Math.max(0, r.balanceAmount);
		return acc;
	}, {
		total: 0,
		recent: 0,
		paid: 0,
		paymentPending: 0,
		bagsPending: 0,
		bagsProvided: 0,
		tiffinPending: 0,
		tiffinProvided: 0,
		mattressRequired: 0,
		mattressNotRequired: 0,
		totalValue: 0,
		collected: 0,
		outstanding: 0
	});
}
function filterByPeriod(rows, period) {
	if (period === "all") return rows;
	const start = /* @__PURE__ */ new Date(/* @__PURE__ */ new Date());
	start.setHours(0, 0, 0, 0);
	if (period === "week") start.setDate(start.getDate() - start.getDay());
	if (period === "month") start.setDate(1);
	return rows.filter((r) => {
		const d = r.createdAt ?? (r.admissionDate ? new Date(r.admissionDate) : null);
		return d ? d.getTime() >= start.getTime() : false;
	});
}
function useMesses() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["messes"],
		queryFn: fetchMesses,
		enabled: ready
	});
}
function useEmployees() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["employees"],
		queryFn: fetchEmployees,
		enabled: ready
	});
}
function useEmployeeByUid(uid) {
	return useQuery({
		queryKey: [
			"employees",
			"uid",
			uid
		],
		queryFn: () => fetchEmployeeByUid(uid),
		enabled: isFirebaseConfigured && !!uid
	});
}
function useDeliveriesForDate(messId, date) {
	const d = date ?? todayDateString();
	return useQuery({
		queryKey: [
			"deliveries",
			messId,
			d
		],
		queryFn: () => fetchDeliveriesForDate(messId, d),
		enabled: isFirebaseConfigured && !!messId
	});
}
function useDeliveriesForStudent(studentId) {
	return useQuery({
		queryKey: [
			"deliveries",
			"student",
			studentId
		],
		queryFn: () => fetchDeliveriesForStudent(studentId),
		enabled: isFirebaseConfigured && !!studentId
	});
}
function useDeliverySummary(messId, date) {
	const d = date ?? todayDateString();
	return useQuery({
		queryKey: [
			"deliverySummary",
			messId,
			d
		],
		queryFn: () => fetchDeliverySummaryForDate(messId, d),
		enabled: isFirebaseConfigured && !!messId
	});
}
/** Load ALL payouts for dashboard stats (no date filter) */
function useAllPayouts() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["payouts", "all"],
		queryFn: () => fetchPayouts({ limitCount: 2e3 }),
		enabled: ready
	});
}
function usePayoutsByMess(messIds) {
	return useQuery({
		queryKey: [
			"payouts",
			"byMess",
			messIds.join(",")
		],
		queryFn: async () => {
			const results = await Promise.all(messIds.map((id) => fetchPayoutsByMess(id)));
			const seen = /* @__PURE__ */ new Set();
			return results.flat().filter((p) => {
				if (seen.has(p.id)) return false;
				seen.add(p.id);
				return true;
			}).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
		},
		enabled: isFirebaseConfigured && messIds.length > 0
	});
}
function usePayoutsByLaundry(laundryIds) {
	return useQuery({
		queryKey: [
			"payouts",
			"byLaundry",
			laundryIds.join(",")
		],
		queryFn: async () => {
			const results = await Promise.all(laundryIds.map((id) => fetchPayoutsByLaundry(id)));
			const seen = /* @__PURE__ */ new Set();
			return results.flat().filter((p) => {
				if (seen.has(p.id)) return false;
				seen.add(p.id);
				return true;
			}).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
		},
		enabled: isFirebaseConfigured && laundryIds.length > 0
	});
}
function useLaundries() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["laundries"],
		queryFn: fetchLaundries,
		enabled: ready
	});
}
function useLaundryEmployees() {
	const ready = useIsReady();
	return useQuery({
		queryKey: ["laundryEmployees"],
		queryFn: fetchLaundryEmployees,
		enabled: ready
	});
}
function useLaundryEmployeeByUid(uid) {
	return useQuery({
		queryKey: [
			"laundryEmployees",
			"uid",
			uid
		],
		queryFn: () => fetchLaundryEmployeeByUid(uid),
		enabled: isFirebaseConfigured && !!uid
	});
}
function useLaundryPickupsForDate(laundryId, date) {
	const d = date ?? todayDateString();
	return useQuery({
		queryKey: [
			"laundryPickups",
			laundryId,
			d
		],
		queryFn: () => fetchLaundryPickupsForDate(laundryId, d),
		enabled: isFirebaseConfigured && !!laundryId
	});
}
function useLaundryPickupSummary(laundryId, date) {
	const d = date ?? todayDateString();
	return useQuery({
		queryKey: [
			"laundryPickupSummary",
			laundryId,
			d
		],
		queryFn: () => fetchLaundryPickupSummaryForDate(laundryId, d),
		enabled: isFirebaseConfigured && !!laundryId
	});
}
function useMessRecordsForDate(messId, date) {
	return useQuery({
		queryKey: [
			"messRecords",
			"date",
			messId,
			date
		],
		queryFn: () => fetchMessRecordsForDate(messId, date),
		enabled: isFirebaseConfigured && !!messId
	});
}
function useMessRecordsForStudent(studentId) {
	return useQuery({
		queryKey: [
			"messRecords",
			"student",
			studentId
		],
		queryFn: () => fetchMessRecordsForStudent(studentId),
		enabled: isFirebaseConfigured && !!studentId
	});
}
function useMessRequestsForStudent(studentId) {
	return useQuery({
		queryKey: [
			"messRequests",
			"student",
			studentId
		],
		queryFn: () => fetchMessRequestsForStudent(studentId),
		enabled: isFirebaseConfigured && !!studentId
	});
}
function useMessRequestsForMess(messId) {
	return useQuery({
		queryKey: [
			"messRequests",
			"mess",
			messId
		],
		queryFn: () => fetchMessRequestsForMess(messId),
		enabled: isFirebaseConfigured && !!messId
	});
}
function useStudentLaundryRecords(studentId) {
	return useQuery({
		queryKey: ["studentLaundryRecords", studentId],
		queryFn: () => fetchStudentLaundryRecords(studentId),
		enabled: isFirebaseConfigured && !!studentId
	});
}
//#endregion
export { useCities as $, setCityActive as A, updateLaundryEmployee as B, generateAdmissionId as C, getWeekBounds as D, getOrCreateStudentLaundryRecord as E, todayDateString as F, updatePayout as G, updateMessEmployee as H, todayISTDateString as I, updateStudentTiffinStatus as J, updatePayoutStatus as K, updateAdmission as L, setLaundryStatus as M, setMessStatus as N, getWeekId as O, setPackageActive as P, useAllPayouts as Q, updateCollege as R, filterByPeriod as S, useUserProfile as St, getOrCreateMessRecord as T, updateMessRecordField as U, updateMess as V, updateMessRequest as W, upsertLaundryPickup as X, upsertDelivery as Y, useAdmissions as Z, deleteLaundry as _, usePayoutsByLaundry as _t, computeStats as a, useEmployees as at, fetchAdmission as b, useRooms as bt, createDoNotWantRecord as c, useLaundryEmployees as ct, createMess as d, useMessRecordsForDate as dt, useColleges as et, createMessEmployee as f, useMessRecordsForStudent as ft, deleteAdmission as g, usePackages as gt, currentISTTime as h, useMesses as ht, assignStudentToMess as i, useEmployeeByUid as it, setCollegeActive as j, savePackage as k, createLaundry as l, useLaundryPickupSummary as lt, createPayout as m, useMessRequestsForStudent as mt, addCollege as n, useDeliveriesForStudent as nt, createAdminUser as o, useLaundries as ot, createMessRequest as p, useMessRequestsForMess as pt, updateStudentLaundryRecord as q, assignStudentToLaundry as r, useDeliverySummary as rt, createAdmission as s, useLaundryEmployeeByUid as st, addCity as t, useDeliveriesForDate as tt, createLaundryEmployee as u, useLaundryPickupsForDate as ut, deleteMess as v, usePayoutsByMess as vt, generatePayoutId as w, fetchAdmissions as x, useStudentLaundryRecords as xt, ensureStudentAuthAccount as y, useProperties as yt, updateLaundry as z };
