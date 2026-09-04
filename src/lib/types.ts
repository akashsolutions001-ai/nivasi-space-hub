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
  paymentMode?: "online" | "cash" | null;
  bagProvided: boolean;
  bagPaymentCollected: boolean;
  tiffinProvided: boolean;
  tiffinPaymentCollected: boolean;
  mattressRequired: boolean;
  mattressPaymentCollected: boolean;
  mealPreference?: "veg" | "non-veg";
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
  ownerName?: string;
  ownerPhone?: string;
  totalBeds?: number;
  active: boolean;
}

// ── Mess & Tiffin Delivery ────────────────────────────────────────────────────

export type MessStatus = "active" | "inactive";
export type TiffinStatus = "active" | "paused" | "cancelled";
export type DeliveryStatus = "pending" | "delivered" | "not_available" | "skipped";
export type MealType = "lunch" | "dinner";
export type EmployeeRole = "MESS_EMPLOYEE" | "MESS_MANAGER";
export type EmployeeStatus = "active" | "inactive";

export interface Mess {
  id: string;
  messId: string;
  messName: string;
  /** Admin-assigned serial number for display to students instead of the mess name */
  serialNumber?: number;
  /** References the ownerName stored in properties/rooms — no separate owner collection */
  ownerName: string;
  ownerPhone: string;
  /** Optional link to a Property document */
  propertyId?: string;
  /** General mess description — visible to assigned students, assigned employees, and all admins */
  messDescription?: string;
  status: MessStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type MessInput = Omit<Mess, "id" | "createdAt" | "updatedAt">;

export interface MessEmployee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  /** Array of mess IDs this employee is assigned to */
  messIds: string[];
  /** Array of mess names — kept in sync for display */
  messNames: string[];
  role: EmployeeRole;
  status: EmployeeStatus;
  /** Firebase Auth UID — set after account creation */
  uid?: string;
  createdAt?: Date | null;
}

export type MessEmployeeInput = Omit<MessEmployee, "id" | "createdAt">;

export interface Delivery {
  id: string;
  studentId: string;      // admissions document ID
  admissionId: string;    // NS-ADM-XXXXXX
  messId: string;
  employeeId: string;
  date: string;           // ISO date YYYY-MM-DD
  meal: MealType;
  status: DeliveryStatus;
  deliveredAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type DeliveryInput = Omit<Delivery, "id" | "createdAt" | "updatedAt">;

// ── Payouts / Debit Transactions ─────────────────────────────────────────────

export type PayoutType =
  | "MESS"
  | "TIFFIN"
  | "LAUNDRY"
  | "CLEANING_STAFF"
  | "SERVICE_PROVIDER"
  | "REFUND"
  | "OTHER";

export type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

export type PayoutPaymentMethod =
  | "UPI"
  | "BANK_TRANSFER"
  | "CASH"
  | "OTHER";

export interface Payout {
  id: string;
  payoutId: string;       // PAY-YYYYMMDD-XXXXXX
  transactionId: string;  // same as payoutId for display

  // Recipient
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;

  payoutType: PayoutType;
  purpose: string;

  // Optional linkages — store IDs only, fetch names at display time
  messId?: string;
  messName?: string;
  laundryId?: string;
  laundryName?: string;
  propertyId?: string;
  propertyName?: string;
  studentId?: string;
  studentName?: string;

  // Service-provider / other extra fields
  servicePeriod?: string;   // "September 2026" or date range string
  studentCount?: number;    // for tiffin payouts
  relatedItem?: string;
  service?: string;

  amount: number;
  currency: "INR";

  paymentMethod: PayoutPaymentMethod;
  referenceId?: string;

  status: PayoutStatus;
  description?: string;

  // Audit
  createdBy: string;
  createdAt?: Date | null;
  updatedBy?: string;
  updatedAt?: Date | null;
  processedBy?: string;
  processedAt?: Date | null;

  // Original transaction for refunds
  originalTransactionId?: string;
  originalAmount?: number;
  refundReason?: string;
}

export type PayoutInput = Omit<Payout, "id" | "createdAt" | "updatedAt" | "processedAt">;

// ── Laundry Management ────────────────────────────────────────────────────────

export type LaundryStatus = "active" | "inactive";
export type LaundrySubscriptionStatus = "active" | "paused" | "cancelled";
export type LaundryPickupStatus = "pending" | "picked_up" | "not_available" | "skipped";
export type LaundryEmployeeRole = "LAUNDRY_EMPLOYEE" | "LAUNDRY_MANAGER";

export interface Laundry {
  id: string;
  laundryId: string;
  laundryName: string;
  ownerName: string;
  ownerPhone: string;
  propertyId?: string;
  status: LaundryStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type LaundryInput = Omit<Laundry, "id" | "createdAt" | "updatedAt">;

export interface LaundryEmployee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  laundryIds: string[];
  laundryNames: string[];
  role: LaundryEmployeeRole;
  status: EmployeeStatus;
  uid?: string;
  createdAt?: Date | null;
}

export type LaundryEmployeeInput = Omit<LaundryEmployee, "id" | "createdAt">;

export type LaundryPickupType = "pickup" | "delivery";

export interface LaundryPickup {
  id: string;
  studentId: string;
  admissionId: string;
  laundryId: string;
  employeeId: string;
  date: string;           // YYYY-MM-DD
  type: LaundryPickupType;
  status: LaundryPickupStatus;
  pickedUpAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type LaundryPickupInput = Omit<LaundryPickup, "id" | "createdAt" | "updatedAt">;

// ── Student Mess Records (daily tiffin per student) ───────────────────────────

export type TiffinStudentStatus = "pending" | "received" | "do_not_want" | "other";
export type ReturnStatus = "not_required" | "pending" | "returned";

export interface MessRecord {
  id: string;
  /** Firestore admissions document ID */
  studentId: string;
  studentName: string;
  studentEmail: string;
  admissionId: string;
  messId: string;
  messName: string;
  /** ISO date YYYY-MM-DD in IST */
  date: string;

  // Lunch
  lunchStatus: TiffinStudentStatus;
  lunchOtherReason?: string;
  lunchReceivedAt?: Date | null;
  lunchReturnStatus?: ReturnStatus;
  lunchReturnedTo?: string;
  lunchReturnedAt?: Date | null;

  // Dinner
  dinnerStatus: TiffinStudentStatus;
  dinnerOtherReason?: string;
  dinnerReceivedAt?: Date | null;
  dinnerReturnStatus?: ReturnStatus;
  dinnerReturnedTo?: string;
  dinnerReturnedAt?: Date | null;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type MessRecordInput = Omit<MessRecord, "id" | "createdAt" | "updatedAt">;

// ── Do Not Want date-range records ────────────────────────────────────────────

export interface DoNotWantRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  admissionId: string;
  messId: string;
  messName: string;
  fromDate: string;   // YYYY-MM-DD
  toDate: string;     // YYYY-MM-DD
  meals: ("lunch" | "dinner")[];
  createdAt?: Date | null;
}

// ── Student Special Mess Requests ─────────────────────────────────────────────

export type MessRequestType = "less_quantity" | "more_quantity" | "other";
export type MessRequestStatus = "active" | "resolved";

export interface MessRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  admissionId: string;
  messId: string;
  messName: string;
  requestType: MessRequestType;
  description: string;
  status: MessRequestStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type MessRequestInput = Omit<MessRequest, "id" | "createdAt" | "updatedAt">;

// ── Student Laundry Records (weekly) ─────────────────────────────────────────

export type LaundryWeekPickupStatus = "pending" | "completed";
export type LaundryWeekReceivedStatus = "pending" | "completed";

export interface StudentLaundryRecord {
  id: string;
  /** Firestore admissions document ID */
  studentId: string;
  studentName: string;
  studentEmail: string;
  admissionId: string;
  laundryId: string;
  laundryName: string;
  /** ISO week string e.g. "2026-W36" */
  weekId: string;
  /** Monday of the week, YYYY-MM-DD */
  weekStart: string;
  /** Sunday of the week, YYYY-MM-DD */
  weekEnd: string;

  pickupStatus: LaundryWeekPickupStatus;
  pickupAt?: Date | null;
  receivedStatus: LaundryWeekReceivedStatus;
  receivedAt?: Date | null;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type StudentLaundryRecordInput = Omit<StudentLaundryRecord, "id" | "createdAt" | "updatedAt">;
