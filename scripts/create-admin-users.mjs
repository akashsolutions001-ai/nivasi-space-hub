/**
 * One-time script: creates the two admin accounts in Firebase Authentication.
 *
 * Usage:
 *   node scripts/create-admin-users.mjs
 *
 * Requirements:
 *   npm install -g firebase-tools
 *   firebase login
 *   firebase use nivasispace-7ed76   (or set FIREBASE_PROJECT env var)
 *
 * Safe to re-run — it skips users that already exist.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ── Admin accounts to create ──────────────────────────────────────────────────
const ADMINS = [
  {
    email: "admin@nivasispace.com",
    password: "0147@May",
    displayName: "NivasiSpace Admin",
  },
  {
    email: "globaladmin@nivasispace.com",
    password: "16Dec@1980NivasiSpace",
    displayName: "Global Admin",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// Initialise firebase-admin using Application Default Credentials
// (works automatically after `firebase login` via the Firebase CLI)
if (!getApps().length) {
  initializeApp({ projectId: "nivasispace-7ed76" });
}

const auth = getAuth();

for (const admin of ADMINS) {
  try {
    const existing = await auth.getUserByEmail(admin.email).catch(() => null);

    if (existing) {
      console.log(`✓ Already exists: ${admin.email} (uid: ${existing.uid})`);
    } else {
      const created = await auth.createUser({
        email: admin.email,
        password: admin.password,
        displayName: admin.displayName,
        emailVerified: true,
      });
      console.log(`✅ Created: ${admin.email} (uid: ${created.uid})`);
    }
  } catch (err) {
    console.error(`✗ Failed for ${admin.email}:`, err.message);
  }
}

console.log("\nDone. You can now log in with these credentials.");
