import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { getFirebaseApp } from "./firebase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

export function validateProfileImage(file: File): string | null {
  if (!ALLOWED.includes(file.type.toLowerCase())) {
    return "Please choose a JPG, PNG or WEBP image.";
  }
  if (file.size > MAX_BYTES) {
    return "Image is too large. Maximum size is 5 MB.";
  }
  return null;
}

/**
 * Uploads the profile photo to Firebase Storage under a public path and
 * returns the permanent public download URL.
 *
 * Storage path: profile-pictures/{admissionId}/profile.{ext}
 *
 * The URL is fully public (controlled by Firebase Storage rules) and can be
 * read directly from Firestore without any signed-URL generation.
 */
export async function uploadProfileImage(admissionId: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `profile-pictures/${admissionId}/profile.${ext}`;

  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, { contentType: file.type });
  const publicUrl = await getDownloadURL(storageRef);
  return publicUrl;
}

/**
 * Deletes a profile image from Firebase Storage by its public URL or storage path.
 * Silently ignores errors (e.g. file already deleted).
 */
export async function deleteProfileImage(urlOrPath: string): Promise<void> {
  try {
    const storage = getFirebaseStorage();
    // getDownloadURL returns a full https URL — ref() can resolve it directly
    const storageRef = urlOrPath.startsWith("http")
      ? ref(storage, urlOrPath)
      : ref(storage, urlOrPath);
    await deleteObject(storageRef);
  } catch {
    // ignore — file may not exist
  }
}

/**
 * Resolves a stored value to a viewable URL.
 * Since we now store public URLs directly, this is a simple pass-through.
 * Kept for backward-compatibility with any stored paths.
 */
export async function getProfileImageUrl(urlOrPath?: string | null): Promise<string | null> {
  if (!urlOrPath) return null;
  // Already a public URL — return as-is
  if (urlOrPath.startsWith("http")) return urlOrPath;
  // Legacy storage path — resolve to download URL
  try {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, urlOrPath);
    return await getDownloadURL(storageRef);
  } catch {
    return null;
  }
}

/**
 * Batch-resolves stored values to viewable URLs.
 * Public URLs are returned as-is; legacy paths are resolved.
 */
export async function getProfileImageUrls(
  paths: (string | null | undefined)[],
): Promise<Record<string, string>> {
  const entries = paths.filter((p): p is string => Boolean(p));
  if (entries.length === 0) return {};

  const results = await Promise.all(
    entries.map(async (p) => {
      const url = await getProfileImageUrl(p);
      return [p, url] as [string, string | null];
    }),
  );

  const map: Record<string, string> = {};
  results.forEach(([path, url]) => {
    if (url) map[path] = url;
  });
  return map;
}
