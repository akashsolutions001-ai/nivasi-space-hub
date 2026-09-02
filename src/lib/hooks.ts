import { useQuery } from "@tanstack/react-query";

import { fetchAdmissions, fetchCities, fetchColleges, fetchPackages, fetchProperties, fetchRooms, fetchUserProfile } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import type { Admission } from "@/lib/types";

// Helper: true once Firebase is configured AND a user is signed in
function useIsReady() {
  const { user, loading } = useAuth();
  return isFirebaseConfigured && !loading && !!user;
}

export function useAdmissions() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["admissions"],
    queryFn: fetchAdmissions,
    enabled: ready,
  });
}

export function usePackages() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    enabled: ready,
  });
}

export function useColleges() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["colleges"],
    queryFn: fetchColleges,
    enabled: ready,
  });
}

export function useProperties() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    enabled: ready,
  });
}

export function useRooms() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    enabled: ready,
  });
}

export function useCities() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
    enabled: ready,
  });
}

export function useUserProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => fetchUserProfile(user!.uid),
    enabled: isFirebaseConfigured && !!user?.uid,
  });
}

export interface AdmissionStats {
  total: number;
  recent: number;
  paid: number;
  paymentPending: number;
  bagsPending: number;
  bagsProvided: number;
  tiffinPending: number;
  tiffinProvided: number;
  mattressRequired: number;
  mattressNotRequired: number;
  totalValue: number;
  collected: number;
  outstanding: number;
}

export function computeStats(rows: Admission[]): AdmissionStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return rows.reduce<AdmissionStats>(
    (acc, r) => {
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
    },
    {
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
      outstanding: 0,
    },
  );
}

export function filterByPeriod(rows: Admission[], period: string): Admission[] {
  if (period === "all") return rows;
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === "week") start.setDate(start.getDate() - start.getDay());
  if (period === "month") start.setDate(1);
  return rows.filter((r) => {
    const d = r.createdAt ?? (r.admissionDate ? new Date(r.admissionDate) : null);
    return d ? d.getTime() >= start.getTime() : false;
  });
}

// ── Mess & Tiffin hooks ──────────────────────────────────────────────────────

import {
  fetchMesses,
  fetchEmployees,
  fetchEmployeesByMess,
  fetchEmployeeByUid,
  fetchDeliveriesForDate,
  fetchDeliveriesForStudent,
  fetchDeliverySummaryForDate,
  todayDateString,
} from "@/lib/db";

export function useMesses() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["messes"],
    queryFn: fetchMesses,
    enabled: ready,
  });
}

export function useEmployees() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    enabled: ready,
  });
}

export function useEmployeesByMess(messId: string | null) {
  return useQuery({
    queryKey: ["employees", "mess", messId],
    queryFn: () => fetchEmployeesByMess(messId!),
    enabled: isFirebaseConfigured && !!messId,
  });
}

export function useEmployeeByUid(uid: string | undefined) {
  return useQuery({
    queryKey: ["employees", "uid", uid],
    queryFn: () => fetchEmployeeByUid(uid!),
    enabled: isFirebaseConfigured && !!uid,
  });
}

export function useDeliveriesForDate(messId: string | null, date?: string) {
  const d = date ?? todayDateString();
  return useQuery({
    queryKey: ["deliveries", messId, d],
    queryFn: () => fetchDeliveriesForDate(messId!, d),
    enabled: isFirebaseConfigured && !!messId,
  });
}

export function useDeliveriesForStudent(studentId: string | null) {
  return useQuery({
    queryKey: ["deliveries", "student", studentId],
    queryFn: () => fetchDeliveriesForStudent(studentId!),
    enabled: isFirebaseConfigured && !!studentId,
  });
}

export function useDeliverySummary(messId: string | null, date?: string) {
  const d = date ?? todayDateString();
  return useQuery({
    queryKey: ["deliverySummary", messId, d],
    queryFn: () => fetchDeliverySummaryForDate(messId!, d),
    enabled: isFirebaseConfigured && !!messId,
  });
}

// ── Payout hooks ──────────────────────────────────────────────────────────────

import { fetchPayouts, fetchPayoutsByMess, fetchPayoutsByLaundry } from "@/lib/db";
import type { Payout } from "@/lib/types";

/** Load all payouts for the current month by default */
export function usePayouts(startDate?: Date, endDate?: Date) {
  const ready = useIsReady();
  const start = startDate ?? (() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; })();
  const end   = endDate   ?? new Date();
  return useQuery({
    queryKey: ["payouts", start.toISOString().slice(0,10), end.toISOString().slice(0,10)],
    queryFn: () => fetchPayouts({ startDate: start, endDate: end }),
    enabled: ready,
  });
}

/** Load ALL payouts for dashboard stats (no date filter) */
export function useAllPayouts() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["payouts", "all"],
    queryFn: () => fetchPayouts({ limitCount: 2000 }),
    enabled: ready,
  });
}

export function usePayoutsByMess(messIds: string[]) {
  return useQuery({
    queryKey: ["payouts", "byMess", messIds.join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        messIds.map((id) => fetchPayoutsByMess(id)),
      );
      const seen = new Set<string>();
      return results.flat().filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
    },
    enabled: isFirebaseConfigured && messIds.length > 0,
  });
}

export function usePayoutsByLaundry(laundryIds: string[]) {
  return useQuery({
    queryKey: ["payouts", "byLaundry", laundryIds.join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        laundryIds.map((id) => fetchPayoutsByLaundry(id)),
      );
      const seen = new Set<string>();
      return results.flat().filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
    },
    enabled: isFirebaseConfigured && laundryIds.length > 0,
  });
}

// ── Laundry hooks ─────────────────────────────────────────────────────────────

import {
  fetchLaundries,
  fetchLaundryEmployees,
  fetchLaundryEmployeeByUid,
  fetchLaundryPickupsForDate,
  fetchLaundryPickupSummaryForDate,
} from "@/lib/db";

export function useLaundries() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["laundries"],
    queryFn: fetchLaundries,
    enabled: ready,
  });
}

export function useLaundryEmployees() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["laundryEmployees"],
    queryFn: fetchLaundryEmployees,
    enabled: ready,
  });
}

export function useLaundryEmployeeByUid(uid: string | undefined) {
  return useQuery({
    queryKey: ["laundryEmployees", "uid", uid],
    queryFn: () => fetchLaundryEmployeeByUid(uid!),
    enabled: isFirebaseConfigured && !!uid,
  });
}

export function useLaundryPickupsForDate(laundryId: string | null, date?: string) {
  const d = date ?? todayDateString();
  return useQuery({
    queryKey: ["laundryPickups", laundryId, d],
    queryFn: () => fetchLaundryPickupsForDate(laundryId!, d),
    enabled: isFirebaseConfigured && !!laundryId,
  });
}

export function useLaundryPickupSummary(laundryId: string | null, date?: string) {
  const d = date ?? todayDateString();
  return useQuery({
    queryKey: ["laundryPickupSummary", laundryId, d],
    queryFn: () => fetchLaundryPickupSummaryForDate(laundryId!, d),
    enabled: isFirebaseConfigured && !!laundryId,
  });
}

// ── Student Mess & Laundry hooks ──────────────────────────────────────────────

import {
  fetchMessRecord,
  fetchMessRecordsForDate,
  fetchMessRecordsForStudent,
  fetchMessRequestsForStudent,
  fetchMessRequestsForMess,
  fetchAllMessRequests,
  fetchStudentLaundryRecords,
  fetchDoNotWantForStudent,
} from "@/lib/db";
import type { MessRecord, MessRequest, StudentLaundryRecord, DoNotWantRecord } from "@/lib/types";

export function useMessRecord(studentId: string | null, date: string) {
  return useQuery({
    queryKey: ["messRecord", studentId, date],
    queryFn: () => fetchMessRecord(studentId!, date),
    enabled: isFirebaseConfigured && !!studentId,
  });
}

export function useMessRecordsForDate(messId: string | null, date: string) {
  return useQuery({
    queryKey: ["messRecords", "date", messId, date],
    queryFn: () => fetchMessRecordsForDate(messId!, date),
    enabled: isFirebaseConfigured && !!messId,
  });
}

export function useMessRecordsForStudent(studentId: string | null) {
  return useQuery({
    queryKey: ["messRecords", "student", studentId],
    queryFn: () => fetchMessRecordsForStudent(studentId!),
    enabled: isFirebaseConfigured && !!studentId,
  });
}

export function useMessRequestsForStudent(studentId: string | null) {
  return useQuery({
    queryKey: ["messRequests", "student", studentId],
    queryFn: () => fetchMessRequestsForStudent(studentId!),
    enabled: isFirebaseConfigured && !!studentId,
  });
}

export function useMessRequestsForMess(messId: string | null) {
  return useQuery({
    queryKey: ["messRequests", "mess", messId],
    queryFn: () => fetchMessRequestsForMess(messId!),
    enabled: isFirebaseConfigured && !!messId,
  });
}

export function useAllMessRequests() {
  const ready = useIsReady();
  return useQuery({
    queryKey: ["messRequests", "all"],
    queryFn: fetchAllMessRequests,
    enabled: ready,
  });
}

export function useStudentLaundryRecords(studentId: string | null) {
  return useQuery({
    queryKey: ["studentLaundryRecords", studentId],
    queryFn: () => fetchStudentLaundryRecords(studentId!),
    enabled: isFirebaseConfigured && !!studentId,
  });
}

export function useDoNotWantForStudent(studentId: string | null) {
  return useQuery({
    queryKey: ["doNotWant", studentId],
    queryFn: () => fetchDoNotWantForStudent(studentId!),
    enabled: isFirebaseConfigured && !!studentId,
  });
}
