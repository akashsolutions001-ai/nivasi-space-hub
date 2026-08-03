import { useQuery } from "@tanstack/react-query";

import { fetchAdmissions, fetchColleges, fetchPackages, fetchProperties, fetchRooms } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Admission } from "@/lib/types";

export function useAdmissions() {
  return useQuery({
    queryKey: ["admissions"],
    queryFn: fetchAdmissions,
    enabled: isFirebaseConfigured,
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    enabled: isFirebaseConfigured,
  });
}

export function useColleges() {
  return useQuery({
    queryKey: ["colleges"],
    queryFn: fetchColleges,
    enabled: isFirebaseConfigured,
  });
}

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    enabled: isFirebaseConfigured,
  });
}

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    enabled: isFirebaseConfigured,
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
