import crypto from "crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Known administrator emails from Admission Hub configuration
const ADMIN_EMAILS = ["admin@nivasispace.com", "globaladmin@nivasispace.com"];

// Initialize Firebase Admin safely
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  // 1. Check if complete service account JSON is provided
  const saEnv = process.env["FIREBASE_SERVICE_ACCOUNT"];
  if (saEnv) {
    try {
      const sa = typeof saEnv === "string" ? JSON.parse(saEnv) : saEnv;
      return initializeApp({
        credential: cert(sa),
        projectId: sa.project_id || process.env["FIREBASE_PROJECT_ID"] || "nivasispace-7ed76",
      });
    } catch (e) {
      console.error("[delete-cloudinary] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", e);
    }
  }

  // 2. Check if individual service account fields are provided
  const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
  const privateKeyRaw = process.env["FIREBASE_PRIVATE_KEY"];
  if (clientEmail && privateKeyRaw) {
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({
        projectId: process.env["FIREBASE_PROJECT_ID"] || "nivasispace-7ed76",
        clientEmail,
        privateKey,
      }),
      projectId: process.env["FIREBASE_PROJECT_ID"] || "nivasispace-7ed76",
    });
  }

  // 3. Fallback: Initialize with Project ID only (verifies token signatures against Google public keys)
  return initializeApp({
    projectId: process.env["FIREBASE_PROJECT_ID"] || "nivasispace-7ed76",
  });
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

interface RequestPayload {
  publicId?: string;
  studentId?: string;
}

/**
 * Netlify Serverless Function: delete-cloudinary-image
 *
 * Securely deletes a student's profile picture from Cloudinary.
 * Authenticates via Firebase ID token, verifies user role and image ownership,
 * and ensures no arbitrary Cloudinary assets can be deleted.
 */
export async function handler(event: {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  // 1. Authenticate Request via Bearer Token
  const authHeader = event.headers["authorization"] || event.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Unauthorized: Missing Authorization Bearer token." }),
    };
  }

  const idToken = authHeader.substring(7).trim();
  if (!idToken) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Unauthorized: Token empty." }),
    };
  }

  let callerUid: string;
  let callerEmail: string;

  try {
    const app = getAdminApp();
    const auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(idToken);
    callerUid = decodedToken.uid;
    callerEmail = (decodedToken.email || "").toLowerCase();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[delete-cloudinary] Token verification failed:", msg);
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Unauthorized: Invalid or expired Firebase ID token." }),
    };
  }

  // 2. Parse & Validate Payload
  let payload: RequestPayload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Bad Request: Invalid JSON body." }),
    };
  }

  const publicId = payload.publicId?.trim();
  const studentId = payload.studentId?.trim();

  if (!publicId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Bad Request: publicId is required." }),
    };
  }

  // Security: prevent directory traversal or malicious injection in publicId
  if (publicId.includes("..") || publicId.includes("\\") || publicId.includes("//")) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Bad Request: Invalid publicId format." }),
    };
  }

  // 3. Authorization & PublicId Ownership Verification via Firestore
  const app = getAdminApp();
  const db = getFirestore(app);

  let isAdmin = ADMIN_EMAILS.includes(callerEmail);

  if (!isAdmin) {
    try {
      const userDoc = await db.collection("users").doc(callerUid).get();
      if (userDoc.exists && userDoc.data()?.["role"] === "admin") {
        isAdmin = true;
      }
    } catch {
      // If Firestore users collection read fails, reliance remains on ADMIN_EMAILS
    }
  }

  let targetAdmissionDocId = "";

  try {
    if (isAdmin) {
      // Admin flow: studentId must be provided
      if (!studentId) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Bad Request: studentId is required for admin deletion." }),
        };
      }

      const admissionSnap = await db.collection("admissions").doc(studentId).get();
      if (!admissionSnap.exists) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Student admission record not found." }),
        };
      }

      const admissionData = admissionSnap.data();
      const storedPublicId = admissionData?.["profilePhoto"]?.["publicId"];

      // Security: An admin can ONLY delete the publicId currently stored on that student's record
      if (!storedPublicId || storedPublicId !== publicId) {
        return {
          statusCode: 403,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: "Forbidden: The publicId does not match the student's stored profile photo.",
          }),
        };
      }

      targetAdmissionDocId = admissionSnap.id;
    } else {
      // Student flow: verify the caller owns the student profile
      let admissionSnap;
      if (studentId) {
        admissionSnap = await db.collection("admissions").doc(studentId).get();
      } else {
        const querySnap = await db
          .collection("admissions")
          .where("email", "==", callerEmail)
          .limit(1)
          .get();
        admissionSnap = querySnap.docs[0];
      }

      if (!admissionSnap || !admissionSnap.exists) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Student admission record not found." }),
        };
      }

      const admissionData = admissionSnap.data();
      const studentEmail = String(admissionData?.["email"] || "").toLowerCase();

      // Security: verify student email matches authenticated token email
      if (studentEmail !== callerEmail) {
        return {
          statusCode: 403,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: "Forbidden: You are not authorized to modify this student record.",
          }),
        };
      }

      const storedPublicId = admissionData?.["profilePhoto"]?.["publicId"];
      if (!storedPublicId || storedPublicId !== publicId) {
        return {
          statusCode: 403,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: "Forbidden: The publicId does not match your stored profile photo.",
          }),
        };
      }

      targetAdmissionDocId = admissionSnap.id;
    }
  } catch (dbErr: unknown) {
    const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
    console.error("[delete-cloudinary] Firestore verification error:", msg);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Server verification failed. Please verify server-side Firebase Admin credentials.",
      }),
    };
  }

  // 4. Delete Cloudinary Asset using authenticated API
  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"] || "hwec58j0";
  const apiKey = process.env["CLOUDINARY_API_KEY"];
  const apiSecret = process.env["CLOUDINARY_API_SECRET"];

  if (!apiKey || !apiSecret) {
    console.error("[delete-cloudinary] Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.");
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error:
          "Server configuration missing: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set in Netlify environment variables.",
      }),
    };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  try {
    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    if (!cloudRes.ok) {
      const errText = await cloudRes.text();
      console.error("[delete-cloudinary] Cloudinary destroy failed:", errText);
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Failed to delete photo from Cloudinary." }),
      };
    }

    const cloudData = (await cloudRes.json()) as { result?: string };
    if (cloudData.result !== "ok" && cloudData.result !== "not found") {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: `Cloudinary error: ${cloudData.result || "Deletion failed"}`,
        }),
      };
    }

    // 5. Only after Cloudinary deletion succeeds, clear photo fields in Firestore
    if (targetAdmissionDocId) {
      try {
        await db.collection("admissions").doc(targetAdmissionDocId).update({
          profilePhoto: null,
          profileImageUrl: null,
          profileImagePath: null,
          updatedAt: new Date(),
        });
      } catch (patchErr) {
        console.warn("[delete-cloudinary] Firestore sync warning:", patchErr);
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: "Profile picture deleted successfully.",
      }),
    };
  } catch (fetchErr: unknown) {
    const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    console.error("[delete-cloudinary] Network error during Cloudinary call:", msg);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Network error during Cloudinary deletion." }),
    };
  }
}
