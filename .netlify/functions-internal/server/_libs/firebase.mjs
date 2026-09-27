import { r as __exportAll } from "../_runtime.mjs";
import { c as registerVersion } from "./@firebase/app+[...].mjs";
import "./firebase__auth.mjs";
import { A as Firestore, C as where, D as DocumentKey, E as Bytes, I as doc, L as ensureFirestoreConfigured, M as Query, N as Timestamp, O as DocumentReference, P as cast, S as updateDoc, T as AutoId, _ as onSnapshot, a as QueryFieldFilterConstraint, b as runTransaction, c as QuerySnapshot, d as addDoc, f as deleteDoc, g as limit, h as getDocs, i as QueryDocumentSnapshot, j as FirestoreError, k as FieldPath, l as SnapshotMetadata, m as getDoc, n as QueryCompositeFilterConstraint, o as QueryLimitConstraint, p as executeWrite, r as QueryConstraint, s as QueryOrderByConstraint, t as DocumentSnapshot, u as Transaction, v as orderBy, w as AbstractUserDataWriter, x as setDoc, y as query } from "./@firebase/firestore+[...].mjs";
import "./firebase__storage.mjs";
//#region node_modules/firebase/firestore/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	AbstractUserDataWriter: () => AbstractUserDataWriter,
	Bytes: () => Bytes,
	CACHE_SIZE_UNLIMITED: () => -1,
	DocumentReference: () => DocumentReference,
	DocumentSnapshot: () => DocumentSnapshot,
	FieldPath: () => FieldPath,
	Firestore: () => Firestore,
	FirestoreError: () => FirestoreError,
	Query: () => Query,
	QueryCompositeFilterConstraint: () => QueryCompositeFilterConstraint,
	QueryConstraint: () => QueryConstraint,
	QueryDocumentSnapshot: () => QueryDocumentSnapshot,
	QueryFieldFilterConstraint: () => QueryFieldFilterConstraint,
	QueryLimitConstraint: () => QueryLimitConstraint,
	QueryOrderByConstraint: () => QueryOrderByConstraint,
	QuerySnapshot: () => QuerySnapshot,
	SnapshotMetadata: () => SnapshotMetadata,
	Timestamp: () => Timestamp,
	Transaction: () => Transaction,
	_AutoId: () => AutoId,
	_DocumentKey: () => DocumentKey,
	_cast: () => cast,
	addDoc: () => addDoc,
	deleteDoc: () => deleteDoc,
	doc: () => doc,
	ensureFirestoreConfigured: () => ensureFirestoreConfigured,
	executeWrite: () => executeWrite,
	getDoc: () => getDoc,
	getDocs: () => getDocs,
	limit: () => limit,
	onSnapshot: () => onSnapshot,
	orderBy: () => orderBy,
	query: () => query,
	runTransaction: () => runTransaction,
	setDoc: () => setDoc,
	updateDoc: () => updateDoc,
	where: () => where
});
//#endregion
//#region node_modules/firebase/app/dist/index.mjs
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.17.0", "app");
//#endregion
export { dist_exports as t };
