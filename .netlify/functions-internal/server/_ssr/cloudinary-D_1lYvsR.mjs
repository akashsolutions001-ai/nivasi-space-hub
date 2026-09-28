import { r as getFirebaseAuth } from "./firebase-7zuyzO2h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloudinary-D_1lYvsR.js
/**
* Cloudinary Direct Browser Upload Utility for Nivasi Admission Hub.
*
* Uses direct browser-to-Cloudinary unsigned upload API.
* Never stores or uses Cloudinary API secret on the client.
*/
var CLOUDINARY_CLOUD_NAME = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_CLOUDINARY_CLOUD_NAME": "hwec58j0",
	"VITE_CLOUDINARY_UPLOAD_PRESET": "nivasi_admission",
	"VITE_SUPABASE_PROJECT_ID": "wridrwlznywbbreqkxks",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_No_dtF9zi_B3uTg9rOPnag_7Euj_Vru",
	"VITE_SUPABASE_URL": "https://wridrwlznywbbreqkxks.supabase.co"
}["VITE_CLOUDINARY_CLOUD_NAME"]?.trim() || "hwec58j0";
var CLOUDINARY_UPLOAD_PRESET = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_CLOUDINARY_CLOUD_NAME": "hwec58j0",
	"VITE_CLOUDINARY_UPLOAD_PRESET": "nivasi_admission",
	"VITE_SUPABASE_PROJECT_ID": "wridrwlznywbbreqkxks",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_No_dtF9zi_B3uTg9rOPnag_7Euj_Vru",
	"VITE_SUPABASE_URL": "https://wridrwlznywbbreqkxks.supabase.co"
}["VITE_CLOUDINARY_UPLOAD_PRESET"]?.trim() || "nivasi_admission";
var CLOUDINARY_ASSET_FOLDER = "nivasi/admission-hub";
var CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
var ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
var ALLOWED_IMAGE_EXTENSIONS = [
	"jpg",
	"jpeg",
	"png",
	"webp"
];
/**
* Validates image type and file size before uploading.
* - Allowed formats: JPG, JPEG, PNG, WEBP
* - Max size: 5 MB
*/
function validateProfilePicture(file) {
	if (!file) return {
		valid: false,
		error: "Please select an image file."
	};
	const ext = file.name.split(".").pop()?.toLowerCase() || "";
	if (!(ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || ALLOWED_IMAGE_EXTENSIONS.includes(ext))) return {
		valid: false,
		error: "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image."
	};
	if (file.size > 5242880) return {
		valid: false,
		error: `File size (${(file.size / 1048576).toFixed(2)} MB) exceeds the 5 MB limit. Please select a smaller image.`
	};
	return { valid: true };
}
/**
* Uploads an image file directly to Cloudinary using an unsigned upload preset.
*/
async function uploadProfilePictureToCloudinary(file, folder = CLOUDINARY_ASSET_FOLDER) {
	const validation = validateProfilePicture(file);
	if (!validation.valid) throw new Error(validation.error || "Invalid image file");
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
	if (folder) formData.append("folder", folder);
	const response = await fetch(CLOUDINARY_UPLOAD_URL, {
		method: "POST",
		body: formData
	});
	if (!response.ok) {
		let errorMessage = "Image upload failed. Please try again.";
		try {
			const errorJson = await response.json();
			if (errorJson?.error?.message) errorMessage = errorJson.error.message;
		} catch {
			errorMessage = `Upload failed with HTTP status ${response.status}`;
		}
		throw new Error(errorMessage);
	}
	const data = await response.json();
	if (!data?.secure_url || !data?.public_id) throw new Error("Invalid response received from Cloudinary.");
	return data;
}
/**
* Returns an optimized Cloudinary delivery URL with smart face/subject cropping and web-optimized format/quality.
* Preserves the original asset while avoiding downloading large files for small profile thumbnails.
*/
function getOptimizedCloudinaryUrl(url, size = 320) {
	if (!url) return "";
	if (!url.includes("cloudinary.com") || !url.includes("/image/upload/")) return url;
	if (url.includes("/image/upload/c_") || url.includes("/image/upload/w_")) return url;
	return url.replace("/image/upload/", `/image/upload/c_fill,g_auto,w_${size},h_${size},q_auto,f_auto/`);
}
/**
* Invokes the secure Netlify serverless function to delete a Cloudinary profile picture.
* Obtains the current Firebase Auth ID token and sends it in the Authorization header.
*
* Never touches or requires Cloudinary API Secret on the frontend.
*/
async function deleteProfilePictureViaNetlify({ publicId, studentId }) {
	if (!publicId) throw new Error("Cannot delete profile picture: missing publicId.");
	const currentUser = getFirebaseAuth().currentUser;
	if (!currentUser) throw new Error("You must be signed in to perform this action.");
	const idToken = await currentUser.getIdToken();
	let response = await fetch("/.netlify/functions/delete-cloudinary-image", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`
		},
		body: JSON.stringify({
			publicId,
			studentId
		})
	});
	if (response.status === 404) response = await fetch("/api/delete-cloudinary-image", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`
		},
		body: JSON.stringify({
			publicId,
			studentId
		})
	});
	let responseData = {};
	try {
		responseData = await response.json();
	} catch {
		responseData = {};
	}
	if (!response.ok) {
		const errorMsg = responseData.error || `Failed to delete profile picture (status ${response.status}).`;
		throw new Error(errorMsg);
	}
	return {
		success: true,
		message: responseData.message || "Profile picture deleted successfully."
	};
}
//#endregion
export { validateProfilePicture as i, getOptimizedCloudinaryUrl as n, uploadProfilePictureToCloudinary as r, deleteProfilePictureViaNetlify as t };
