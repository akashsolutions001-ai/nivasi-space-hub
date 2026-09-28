import { getFirebaseAuth } from "./firebase";

/**
 * Cloudinary Direct Browser Upload Utility for Nivasi Admission Hub.
 *
 * Uses direct browser-to-Cloudinary unsigned upload API.
 * Never stores or uses Cloudinary API secret on the client.
 */

export const CLOUDINARY_CLOUD_NAME =
  (import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined)?.trim() || "hwec58j0";

export const CLOUDINARY_UPLOAD_PRESET =
  (import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] as string | undefined)?.trim() ||
  "nivasi_admission";

export const CLOUDINARY_ASSET_FOLDER = "nivasi/admission-hub";

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Validation limits (5 MB maximum)
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates image type and file size before uploading.
 * - Allowed formats: JPG, JPEG, PNG, WEBP
 * - Max size: 5 MB
 */
export function validateProfilePicture(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: "Please select an image file." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isTypeAllowed =
    ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || ALLOWED_IMAGE_EXTENSIONS.includes(ext);

  if (!isTypeAllowed) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeInMb} MB) exceeds the 5 MB limit. Please select a smaller image.`,
    };
  }

  return { valid: true };
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  original_filename?: string;
  created_at?: string;
}

/**
 * Uploads an image file directly to Cloudinary using an unsigned upload preset.
 */
export async function uploadProfilePictureToCloudinary(
  file: File,
  folder: string = CLOUDINARY_ASSET_FOLDER,
): Promise<CloudinaryUploadResult> {
  const validation = validateProfilePicture(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Image upload failed. Please try again.";
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      errorMessage = `Upload failed with HTTP status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as CloudinaryUploadResult;

  if (!data?.secure_url || !data?.public_id) {
    throw new Error("Invalid response received from Cloudinary.");
  }

  return data;
}

/**
 * Returns an optimized Cloudinary delivery URL with smart face/subject cropping and web-optimized format/quality.
 * Preserves the original asset while avoiding downloading large files for small profile thumbnails.
 */
export function getOptimizedCloudinaryUrl(url?: string | null, size = 320): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  // Avoid duplicate transformations
  if (url.includes("/image/upload/c_") || url.includes("/image/upload/w_")) {
    return url;
  }
  return url.replace(
    "/image/upload/",
    `/image/upload/c_fill,g_auto,w_${size},h_${size},q_auto,f_auto/`,
  );
}

export interface DeleteProfilePictureParams {
  publicId: string;
  studentId?: string;
}

/**
 * Invokes the secure Netlify serverless function to delete a Cloudinary profile picture.
 * Obtains the current Firebase Auth ID token and sends it in the Authorization header.
 *
 * Never touches or requires Cloudinary API Secret on the frontend.
 */
export async function deleteProfilePictureViaNetlify({
  publicId,
  studentId,
}: DeleteProfilePictureParams): Promise<{ success: boolean; message: string }> {
  if (!publicId) {
    throw new Error("Cannot delete profile picture: missing publicId.");
  }

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to perform this action.");
  }

  const idToken = await currentUser.getIdToken();
  const endpoint = "/.netlify/functions/delete-cloudinary-image";

  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ publicId, studentId }),
  });

  // Fallback to /api/delete-cloudinary-image if the direct netlify endpoint is rewrote
  if (response.status === 404) {
    response = await fetch("/api/delete-cloudinary-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ publicId, studentId }),
    });
  }

  interface DeleteResponsePayload {
    success?: boolean;
    message?: string;
    error?: string;
  }

  let responseData: DeleteResponsePayload = {};
  try {
    responseData = (await response.json()) as DeleteResponsePayload;
  } catch {
    responseData = {};
  }

  if (!response.ok) {
    const errorMsg =
      responseData.error || `Failed to delete profile picture (status ${response.status}).`;
    throw new Error(errorMsg);
  }

  return {
    success: true,
    message: responseData.message || "Profile picture deleted successfully.",
  };
}
