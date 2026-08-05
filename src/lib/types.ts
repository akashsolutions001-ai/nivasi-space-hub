export type PaymentStatus = "completed" | "pending";

export const SERVICE_OPTIONS = [
  "Room",
  "Mess",
  "Laundry",
  "Ironing",
  "House Cleaning",
] as const;

export interface Admission {
  id: string;
  admissionId: string;
  profileImagePath?: string | null;
  profileImageUrl?: string | null;
  fullName: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  // Parent / Guardian info
  parentName?: string;
  parentPhone?: string;
  parentRelation?: string;
  collegeId?: string;
  collegeName: string;
  course?: string;
  year?: string;
  propertyId?: string;
  propertyName?: string;
  roomNumber?: string;
  bedNumber?: string;
  admissionDate: string;
  moveInDate?: string;
  packageId?: string;
  packageName: string;
  packageServices: string[];
  packageAmount: number;
  packageStartDate?: string;
  packageEndDate?: string;
  amountPaid: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  bagProvided: boolean;
  tiffinProvided: boolean;
  mattressRequired: boolean;
  notes?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type AdmissionInput = Omit<Admission, "id" | "createdAt" | "updatedAt">;

export interface PackagePlan {
  id: string;
  packageId: string;
  packageName: string;
  services: string[];
  price: number;
  duration: number;
  active: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface College {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeType?: "engineering" | "medical" | "other";
  city?: string;
  active: boolean;
}

export interface City {
  id: string;
  cityId: string;
  cityName: string;
  active: boolean;
}

export interface Property {
  id: string;
  propertyId: string;
  propertyName: string;
  address?: string;
  city?: string;
  active: boolean;
}
