/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownCircle, Plus, Search, Download, Eye, Pencil,
  Loader2, IndianRupee, Clock, CheckCircle2, XCircle,
  RefreshCw, X, ChevronDown, UtensilsCrossed, User,
  Phone, Mail, CalendarDays, CreditCard, FileText, Tag,
  Building2, Users, AlertCircle, CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { StatCard, EmptyState } from "@/components/nivasi/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAllPayouts, useMesses, useAdmissions, useProperties, useLaundries } from "@/lib/hooks";
import {
  createPayout, updatePayout, updatePayoutStatus, generatePayoutId,
} from "@/lib/db";
import { formatINR, formatDate, todayISO, isValidIndianMobile, isValidEmail } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import type {
  Payout, PayoutInput, PayoutType, PayoutStatus, PayoutPaymentMethod,
} from "@/lib/types";

export const Route = createFileRoute("/admin/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts — NivasiSpace Admin" },
      { name: "description", content: "Manage all outgoing / debit transactions." },
    ],
  }),
  component: PayoutsPage,
});

// ── Constants ─────────────────────────────────────────────────────────────────

const PAYOUT_TYPES: { value: PayoutType; label: string }[] = [
  { value: "MESS",             label: "Mess" },
  { value: "TIFFIN",           label: "Tiffin" },
  { value: "LAUNDRY",          label: "Laundry" },
  { value: "CLEANING_STAFF",   label: "Cleaning Staff" },
  { value: "SERVICE_PROVIDER", label: "Service Provider" },
  { value: "REFUND",           label: "Refund" },
  { value: "OTHER",            label: "Other" },
];

const PAYOUT_STATUSES: { value: PayoutStatus; label: string }[] = [
  { value: "PENDING",    label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "PAID",       label: "Paid" },
  { value: "FAILED",     label: "Failed" },
  { value: "CANCELLED",  label: "Cancelled" },
];

const PAYMENT_METHODS: { value: PayoutPaymentMethod; label: string }[] = [
  { value: "UPI",           label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH",          label: "Cash" },
  { value: "OTHER",         label: "Other" },
];

const DATE_PRESETS = [
  { value: "today",      label: "Today" },
  { value: "yesterday",  label: "Yesterday" },
  { value: "week",       label: "Last 7 Days" },
  { value: "month",      label: "This Month" },
  { value: "lastMonth",  label: "Last Month" },
  { value: "all",        label: "All Time" },
];

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PayoutStatus }) {
  const map: Record<PayoutStatus, string> = {
    PENDING:    "border-warning/30 bg-warning/10 text-warning-foreground",
    PROCESSING: "border-primary/30 bg-primary/10 text-primary",
    PAID:       "border-success/30 bg-success/10 text-success",
    FAILED:     "border-destructive/30 bg-destructive/10 text-destructive",
    CANCELLED:  "border-border bg-muted text-muted-foreground",
  };
  const labels: Record<PayoutStatus, string> = {
    PENDING: "Pending", PROCESSING: "Processing",
    PAID: "Paid", FAILED: "Failed", CANCELLED: "Cancelled",
  };
  return (
    <Badge variant="outline" className={`text-[11px] font-semibold ${map[status]}`}>
      {labels[status]}
    </Badge>
  );
}

function TypeBadge({ type }: { type: PayoutType }) {
  const label = PAYOUT_TYPES.find((t) => t.value === type)?.label ?? type;
  return (
    <Badge variant="outline" className="text-[11px] text-muted-foreground">
      {label}
    </Badge>
  );
}

// ── Date range helper ─────────────────────────────────────────────────────────

function getDateRange(preset: string): { start: Date | null; end: Date | null } {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  if (preset === "today")     return { start: today, end: now };
  if (preset === "yesterday") {
    const y = new Date(today); y.setDate(y.getDate() - 1);
    const ye = new Date(y); ye.setHours(23, 59, 59, 999);
    return { start: y, end: ye };
  }
  if (preset === "week") {
    const s = new Date(today); s.setDate(s.getDate() - 6);
    return { start: s, end: now };
  }
  if (preset === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: s, end: now };
  }
  if (preset === "lastMonth") {
    const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start: s, end: e };
  }
  return { start: null, end: null };
}

// ── Financial computations ────────────────────────────────────────────────────

function computePayoutStats(payouts: Payout[]) {
  const active = payouts.filter((p) => p.status !== "CANCELLED");
  const total      = active.reduce((s, p) => s + p.amount, 0);
  const paid       = active.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pending    = active.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const processing = active.filter((p) => p.status === "PROCESSING").reduce((s, p) => s + p.amount, 0);
  const failed     = active.filter((p) => p.status === "FAILED").reduce((s, p) => s + p.amount, 0);

  const todayStr = todayISO();
  const todayTotal = active
    .filter((p) => p.createdAt && p.createdAt.toISOString().slice(0, 10) === todayStr)
    .reduce((s, p) => s + p.amount, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTotal = active
    .filter((p) => p.createdAt && p.createdAt >= monthStart)
    .reduce((s, p) => s + p.amount, 0);

  // Category breakdown
  const byType: Record<PayoutType, number> = {
    MESS: 0, TIFFIN: 0, LAUNDRY: 0, CLEANING_STAFF: 0,
    SERVICE_PROVIDER: 0, REFUND: 0, OTHER: 0,
  };
  for (const p of active) byType[p.payoutType] = (byType[p.payoutType] ?? 0) + p.amount;

  return { total, paid, pending, processing, failed, todayTotal, monthTotal, byType, count: active.length };
}

// ── CSV Export ────────────────────────────────────────────────────────────────

function exportPayoutsCSV(payouts: Payout[]) {
  const headers = [
    "Date", "Transaction ID", "Recipient Name", "Recipient Phone", "Recipient Email",
    "Payout Type", "Purpose", "Mess", "Property", "Student",
    "Amount", "Payment Method", "Reference ID", "Status", "Description",
    "Created By", "Created At", "Processed By", "Processed At",
  ];
  const esc = (v: any) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = payouts.map((p) => [
    formatDate(p.createdAt),
    p.transactionId,
    p.recipientName,
    p.recipientPhone ?? "",
    p.recipientEmail ?? "",
    PAYOUT_TYPES.find((t) => t.value === p.payoutType)?.label ?? p.payoutType,
    p.purpose,
    p.messName ?? "",
    p.propertyName ?? "",
    p.studentName ?? "",
    p.amount,
    PAYMENT_METHODS.find((m) => m.value === p.paymentMethod)?.label ?? p.paymentMethod,
    p.referenceId ?? "",
    p.status,
    p.description ?? "",
    p.createdBy,
    p.createdAt ? p.createdAt.toLocaleString("en-IN") : "",
    p.processedBy ?? "",
    p.processedAt ? p.processedAt.toLocaleString("en-IN") : "",
  ]);
  const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payouts_${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Payout Form ───────────────────────────────────────────────────────────────

interface PayoutFormProps {
  open: boolean;
  onClose: () => void;
  existing?: Payout;
}

function PayoutFormDialog({ open, onClose, existing }: PayoutFormProps) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: messes = [] } = useMesses();
  const { data: laundries = [] } = useLaundries();
  const { data: admissions = [] } = useAdmissions();
  const { data: properties = [] } = useProperties();

  const [payoutType, setPayoutType] = useState<PayoutType>(existing?.payoutType ?? "MESS");
  const [generatedId, setGeneratedId] = useState<string>("");
  const [recipientName, setRecipientName] = useState(existing?.recipientName ?? "");
  const [recipientPhone, setRecipientPhone] = useState(existing?.recipientPhone ?? "");
  const [recipientEmail, setRecipientEmail] = useState(existing?.recipientEmail ?? "");
  const [purpose, setPurpose] = useState(existing?.purpose ?? "");
  const [paymentFrequency, setPaymentFrequency] = useState<"one_time" | "weekly" | "monthly">("monthly");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [paymentDateTo, setPaymentDateTo] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [messId, setMessId] = useState(existing?.messId ?? "");
  const [otherMessName, setOtherMessName] = useState(existing?.messName ?? "");
  const [laundryId, setLaundryId] = useState(existing?.laundryId ?? "");
  const [otherLaundryName, setOtherLaundryName] = useState(existing?.laundryName ?? "");
  const [propertyId, setPropertyId] = useState(existing?.propertyId ?? "");
  const [studentId, setStudentId] = useState(existing?.studentId ?? "");
  const [servicePeriod, setServicePeriod] = useState(existing?.servicePeriod ?? "");
  const [studentCount, setStudentCount] = useState(String(existing?.studentCount ?? ""));
  const [service, setService] = useState(existing?.service ?? "");
  const [relatedItem, setRelatedItem] = useState(existing?.relatedItem ?? "");
  const [amount, setAmount] = useState(String(existing?.amount ?? ""));
  const [paymentMethod, setPaymentMethod] = useState<PayoutPaymentMethod>(existing?.paymentMethod ?? "CASH");
  const [referenceId, setReferenceId] = useState(existing?.referenceId ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [originalTxId, setOriginalTxId] = useState(existing?.originalTransactionId ?? "");
  const [originalAmount, setOriginalAmount] = useState(String(existing?.originalAmount ?? ""));
  const [refundReason, setRefundReason] = useState(existing?.refundReason ?? "");
  const [saving, setSaving] = useState(false);

  // Generate a unique PAY- ID when dialog opens for new payout
  useEffect(() => {
    if (open && !existing) {
      generatePayoutId().then(setGeneratedId).catch(() => {});
    }
  }, [open, existing]);

  const selectedMess     = messes.find((m) => m.id === messId);
  const selectedLaundry  = laundries.find((l) => l.id === laundryId);
  const selectedProperty = properties.find((p) => p.id === propertyId);
  const selectedStudent  = admissions.find((a) => a.id === studentId);

  // Auto-build purpose text from frequency + date selection
  function buildPurposeFromDate(
    freq: "one_time" | "weekly" | "monthly",
    from: Date | undefined,
    to: Date | undefined,
    type: PayoutType,
  ) {
    if (!from) return;
    const typeName =
      type === "MESS"           ? "Mess Settlement" :
      type === "TIFFIN"         ? "Tiffin Settlement" :
      type === "LAUNDRY"        ? "Laundry Settlement" :
      type === "CLEANING_STAFF" ? "Cleaning Staff Payment" :
      type === "SERVICE_PROVIDER" ? "Service Payment" :
      type === "REFUND"         ? "Refund" :
      type === "OTHER"          ? "Miscellaneous Payment" : "Payment";

    const monthName = from.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    const dateStr   = from.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const toDateStr = to ? to.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

    if (freq === "monthly")  setPurpose(`Monthly ${typeName} — ${monthName}`);
    else if (freq === "weekly" && to) setPurpose(`Weekly ${typeName} — ${dateStr} to ${toDateStr}`);
    else if (freq === "weekly")       setPurpose(`Weekly ${typeName} — ${dateStr}`);
    else                              setPurpose(`${typeName} — ${dateStr}`);
  }

  // Auto-fill recipient when mess selected (MESS / TIFFIN)
  function handleMessChange(id: string) {
    setMessId(id);
    if (payoutType === "MESS" || payoutType === "TIFFIN") {
      const m = messes.find((x) => x.id === id);
      if (m) { setRecipientName(m.ownerName || m.messName); setRecipientPhone(m.ownerPhone ?? ""); }
    }
    if (payoutType === "TIFFIN") {
      const count = admissions.filter(
        (a) => (a as any).messId === id && (a as any).tiffinStatus !== "cancelled",
      ).length;
      setStudentCount(String(count));
    }
  }

  // Auto-fill recipient when laundry selected (LAUNDRY)
  function handleLaundryChange(id: string) {
    setLaundryId(id);
    const l = laundries.find((x) => x.id === id);
    if (l) { setRecipientName(l.ownerName || l.laundryName); setRecipientPhone(l.ownerPhone ?? ""); }
  }

  // Reset cross-type linkage fields when type changes
  function handleTypeChange(t: PayoutType) {
    setPayoutType(t as PayoutType);
    setMessId(""); setLaundryId(""); setPropertyId(""); setStudentId("");
    setRecipientName(""); setRecipientPhone(""); setStudentCount("");
    setOtherMessName(""); setOtherLaundryName("");
    // Rebuild purpose if a date is already selected
    if (paymentDate) buildPurposeFromDate(paymentFrequency, paymentDate, paymentDateTo, t as PayoutType);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!recipientName.trim()) { toast.error("Recipient name is required."); return; }
    if (!purpose.trim())        { toast.error("Purpose is required."); return; }
    if (!amt || amt <= 0)       { toast.error("Enter a valid amount."); return; }
    if (recipientPhone.trim() && !isValidIndianMobile(recipientPhone)) {
      toast.error("Enter a valid 10-digit Indian mobile number."); return;
    }
    if (recipientEmail.trim() && !isValidEmail(recipientEmail)) {
      toast.error("Enter a valid email address."); return;
    }
    // Type-specific required fields
    if ((payoutType === "MESS" || payoutType === "TIFFIN") && !messId) {
      toast.error("Select a mess for this payout type."); return;
    }
    if ((payoutType === "MESS" || payoutType === "TIFFIN") && messId === "other" && !otherMessName.trim()) {
      toast.error("Enter the mess name."); return;
    }
    if (payoutType === "LAUNDRY" && !laundryId) {
      toast.error("Select a laundry for this payout type."); return;
    }
    if (payoutType === "LAUNDRY" && laundryId === "other" && !otherLaundryName.trim()) {
      toast.error("Enter the laundry name."); return;
    }

    setSaving(true);
    try {
      const payoutId = existing?.payoutId ?? generatedId ?? (await generatePayoutId());
      const input: PayoutInput = {
        payoutId,
        transactionId: payoutId,
        recipientName:  recipientName.trim(),
        recipientPhone: recipientPhone.replace(/\D/g, ""),
        recipientEmail: recipientEmail.trim(),
        payoutType,
        purpose:        purpose.trim(),
        messId:         messId === "other" ? "" : (messId || ""),
        messName:       messId === "other" ? otherMessName.trim() : (selectedMess?.messName ?? ""),
        laundryId:      laundryId === "other" ? "" : (laundryId || ""),
        laundryName:    laundryId === "other" ? otherLaundryName.trim() : (selectedLaundry?.laundryName ?? ""),
        propertyId:     propertyId || "",
        propertyName:   selectedProperty?.propertyName ?? "",
        studentId:      studentId || "",
        studentName:    selectedStudent?.fullName ?? "",
        servicePeriod:  servicePeriod.trim(),
        studentCount:   Number(studentCount) || 0,
        service:        service.trim(),
        relatedItem:    relatedItem.trim(),
        amount: amt,
        currency: "INR",
        paymentMethod,
        referenceId:    referenceId.trim(),
        status:         existing?.status ?? "PENDING",
        description:    description.trim(),
        createdBy:      user?.displayName || user?.email || "Admin",
        updatedBy:      user?.displayName || user?.email || "Admin",
        processedBy:    existing?.processedBy ?? "",
        originalTransactionId: originalTxId.trim(),
        originalAmount: Number(originalAmount) || 0,
        refundReason:   refundReason.trim(),
      };

      if (existing) {
        if (existing.status === "PAID" && amt !== existing.amount) {
          toast.error("Cannot change the amount of a PAID payout."); setSaving(false); return;
        }
        await updatePayout(existing.id, input, user?.displayName || user?.email || "Admin");
        toast.success("Payout updated.");
      } else {
        await createPayout(input);
        toast.success(`Payout ${payoutId} created.`);
      }
      await qc.invalidateQueries({ queryKey: ["payouts"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save payout.");
    } finally {
      setSaving(false);
    }
  }

  const isMessType     = payoutType === "MESS" || payoutType === "TIFFIN";
  const isLaundryType  = payoutType === "LAUNDRY";
  const isOtherLinked  = ["CLEANING_STAFF", "SERVICE_PROVIDER", "OTHER"].includes(payoutType);
  const isRefund       = payoutType === "REFUND";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl flex flex-col max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{existing ? "Edit Payout" : "Create Payout"}</span>
            {!existing && generatedId && (
              <span className="font-mono text-xs font-normal text-muted-foreground border border-border rounded-lg px-2 py-1">{generatedId}</span>
            )}
            {existing && (
              <span className="font-mono text-xs font-normal text-muted-foreground border border-border rounded-lg px-2 py-1">{existing.payoutId}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6">
          <form id="payout-form" onSubmit={handleSubmit} className="space-y-4 py-2">

          {/* Payout Type */}
          <div className="space-y-1.5">
            <Label>Payout Type *</Label>
            <Select value={payoutType} onValueChange={(v) => handleTypeChange(v as PayoutType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYOUT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MESS / TIFFIN — Mess selector */}
          {isMessType && (
            <div className="space-y-1.5">
              <Label>Mess *</Label>
              <Select value={messId} onValueChange={(id) => {
                setMessId(id);
                if (id !== "other") handleMessChange(id);
                else { setOtherMessName(""); }
              }}>
                <SelectTrigger><SelectValue placeholder="Select mess…" /></SelectTrigger>
                <SelectContent>
                  {messes.map((m) => <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>)}
                  <SelectItem value="other">Other (type manually)</SelectItem>
                </SelectContent>
              </Select>
              {messId === "other" && (
                <Input
                  value={otherMessName}
                  onChange={(e) => {
                    setOtherMessName(e.target.value);
                    setRecipientName(e.target.value);
                  }}
                  placeholder="Enter mess name…"
                  autoFocus
                />
              )}
              {messId !== "other" && selectedMess?.ownerName && (
                <p className="text-xs text-muted-foreground">
                  Owner: {selectedMess.ownerName}{selectedMess.ownerPhone ? ` · ${selectedMess.ownerPhone}` : ""}
                </p>
              )}
            </div>
          )}

          {/* LAUNDRY — Laundry selector */}
          {isLaundryType && (
            <div className="space-y-1.5">
              <Label>Laundry *</Label>
              <Select value={laundryId} onValueChange={(id) => {
                setLaundryId(id);
                if (id !== "other") handleLaundryChange(id);
                else { setOtherLaundryName(""); }
              }}>
                <SelectTrigger><SelectValue placeholder="Select laundry…" /></SelectTrigger>
                <SelectContent>
                  {laundries.map((l) => <SelectItem key={l.id} value={l.id}>{l.laundryName}</SelectItem>)}
                  <SelectItem value="other">Other (type manually)</SelectItem>
                </SelectContent>
              </Select>
              {laundryId === "other" && (
                <Input
                  value={otherLaundryName}
                  onChange={(e) => {
                    setOtherLaundryName(e.target.value);
                    setRecipientName(e.target.value);
                  }}
                  placeholder="Enter laundry name…"
                  autoFocus
                />
              )}
              {laundryId !== "other" && selectedLaundry?.ownerName && (
                <p className="text-xs text-muted-foreground">
                  Owner: {selectedLaundry.ownerName}{selectedLaundry.ownerPhone ? ` · ${selectedLaundry.ownerPhone}` : ""}
                </p>
              )}
            </div>
          )}

          {/* Recipient */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Recipient Name *</Label>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Raj Mess Owner" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" inputMode="numeric" maxLength={10} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="optional" type="email" />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <Label>Purpose *</Label>

            {/* Frequency selector */}
            <div className="flex gap-2">
              {(["one_time", "weekly", "monthly"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setPaymentFrequency(f);
                    setPaymentDate(undefined);
                    setPaymentDateTo(undefined);
                  }}
                  className={`flex-1 rounded-xl border px-2 py-1.5 text-xs font-medium transition-colors ${
                    paymentFrequency === f
                      ? "gradient-brand text-primary-foreground border-primary shadow-soft"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "one_time" ? "One-time" : f === "weekly" ? "Weekly" : "Monthly"}
                </button>
              ))}
            </div>

            {/* Date picker */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {paymentFrequency === "monthly" && paymentDate
                    ? paymentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                    : paymentFrequency === "weekly" && paymentDate
                    ? paymentDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
                      (paymentDateTo ? ` → ${paymentDateTo.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : " (select end date)")
                    : paymentDate
                    ? paymentDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : <span className="text-muted-foreground">
                        {paymentFrequency === "monthly" ? "Select month…" : paymentFrequency === "weekly" ? "Select start date…" : "Select date…"}
                      </span>
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {paymentFrequency === "monthly" ? (
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(d) => {
                      setPaymentDate(d);
                      if (d) {
                        // For monthly, snap to first of month
                        const first = new Date(d.getFullYear(), d.getMonth(), 1);
                        setPaymentDate(first);
                        buildPurposeFromDate("monthly", first, undefined, payoutType);
                        // Also set servicePeriod
                        setServicePeriod(first.toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
                      }
                      setCalendarOpen(false);
                    }}
                  />
                ) : paymentFrequency === "weekly" ? (
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {!paymentDate ? "Select start date" : "Select end date"}
                    </p>
                    <Calendar
                      mode="single"
                      selected={!paymentDate ? undefined : paymentDateTo ?? paymentDate}
                      onSelect={(d) => {
                        if (!paymentDate) {
                          setPaymentDate(d);
                        } else {
                          setPaymentDateTo(d);
                          buildPurposeFromDate("weekly", paymentDate, d, payoutType);
                          if (paymentDate && d) {
                            const from = paymentDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                            const to   = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                            setServicePeriod(`${from} – ${to}`);
                          }
                          setCalendarOpen(false);
                        }
                      }}
                    />
                    {paymentDate && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => { setPaymentDate(undefined); setPaymentDateTo(undefined); }}
                      >
                        Reset dates
                      </Button>
                    )}
                  </div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(d) => {
                      setPaymentDate(d);
                      if (d) buildPurposeFromDate("one_time", d, undefined, payoutType);
                      setCalendarOpen(false);
                    }}
                  />
                )}
              </PopoverContent>
            </Popover>

            {/* Editable purpose text */}
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={
                payoutType === "MESS"             ? "e.g. Monthly Mess Settlement — August 2026" :
                payoutType === "TIFFIN"           ? "e.g. Monthly Tiffin Settlement — August 2026" :
                payoutType === "LAUNDRY"          ? "e.g. Monthly Laundry Settlement — August 2026" :
                payoutType === "CLEANING_STAFF"   ? "e.g. Monthly Cleaning Staff Payment" :
                payoutType === "SERVICE_PROVIDER" ? "e.g. Mattress supply — Raj Residency" :
                payoutType === "REFUND"           ? "e.g. Refund for Student A" :
                payoutType === "OTHER"            ? "e.g. Transport, Maintenance, Miscellaneous…" :
                "e.g. Maintenance expense"
              }
            />
            <p className="text-[11px] text-muted-foreground">
              Pick a frequency &amp; date above to auto-fill, or type manually.
            </p>
          </div>

          {/* Service Period — Mess, Tiffin, Laundry, Cleaning, Other */}
          {(isMessType || isLaundryType || payoutType === "CLEANING_STAFF" || payoutType === "OTHER") && (
            <div className={`grid gap-3 ${payoutType === "TIFFIN" ? "grid-cols-2" : "grid-cols-1"}`}>
              <div className="space-y-1.5">
                <Label>Service Period</Label>
                <Input value={servicePeriod} onChange={(e) => setServicePeriod(e.target.value)} placeholder="e.g. August 2026" />
              </div>
              {payoutType === "TIFFIN" && (
                <div className="space-y-1.5">
                  <Label>No. of Students</Label>
                  <Input value={studentCount} onChange={(e) => setStudentCount(e.target.value)} placeholder="Auto-calculated" type="number" min={0} />
                </div>
              )}
            </div>
          )}

          {/* SERVICE_PROVIDER fields */}
          {payoutType === "SERVICE_PROVIDER" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Service / Item</Label>
                <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Mattress supply…" />
              </div>
              <div className="space-y-1.5">
                <Label>Related Item</Label>
                <Input value={relatedItem} onChange={(e) => setRelatedItem(e.target.value)} placeholder="e.g. 10 single mattresses" />
              </div>
            </div>
          )}

          {/* OTHER fields */}
          {payoutType === "OTHER" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category / Expense Type</Label>
                <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Transport, Maintenance…" />
              </div>
              <div className="space-y-1.5">
                <Label>Related Item</Label>
                <Input value={relatedItem} onChange={(e) => setRelatedItem(e.target.value)} placeholder="e.g. Plumbing repair" />
              </div>
            </div>
          )}

          {/* REFUND fields */}
          {isRefund && (
            <>
              <div className="space-y-1.5">
                <Label>Student</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger><SelectValue placeholder="Select student…" /></SelectTrigger>
                  <SelectContent>
                    {admissions.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.fullName} · {a.admissionId}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStudent && <p className="text-xs text-muted-foreground">Phone: {selectedStudent.phoneNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Original Transaction ID</Label>
                  <Input value={originalTxId} onChange={(e) => setOriginalTxId(e.target.value)} placeholder="PAY-…" />
                </div>
                <div className="space-y-1.5">
                  <Label>Original Amount</Label>
                  <Input value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} type="number" min={0} placeholder="₹" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Refund Reason</Label>
                <Input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason for refund…" />
              </div>
            </>
          )}

          {/* Property — Cleaning, ServiceProvider, Other */}
          {isOtherLinked && (
            <div className="space-y-1.5">
              <Label>Related Property</Label>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger><SelectValue placeholder="Optional — select property" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Optional mess link for non-mess types */}
          {(isLaundryType || isOtherLinked) && (
            <div className="space-y-1.5">
              <Label>Related Mess (optional)</Label>
              <Select value={messId} onValueChange={setMessId}>
                <SelectTrigger><SelectValue placeholder="Optional — select mess" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {messes.map((m) => <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Optional student for SERVICE_PROVIDER / OTHER */}
          {(payoutType === "SERVICE_PROVIDER" || payoutType === "OTHER") && (
            <div className="space-y-1.5">
              <Label>Related Student (optional)</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Optional — select student" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {admissions.slice(0, 100).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.fullName} · {a.admissionId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Amount + Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Amount (₹) *</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} placeholder="0" />
              {existing?.status === "PAID" && (
                <p className="text-[11px] text-warning-foreground">⚠ Amount cannot change on a PAID payout</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PayoutPaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference ID */}
          <div className="space-y-1.5">
            <Label>Reference ID</Label>
            <Input value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="UPI/bank reference (optional)" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description / Notes</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional notes…" rows={2} />
          </div>

          </form>
        </div>

        {/* Pinned footer — always visible, never overlapping */}
        <div className="shrink-0 border-t border-border bg-background px-6 py-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="payout-form" disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {existing ? "Save Changes" : "Create Payout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// ── Payout Details Drawer ─────────────────────────────────────────────────────

function PayoutDetailsSheet({
  payout,
  onClose,
  onEdit,
  onStatusChange,
}: {
  payout: Payout | null;
  onClose: () => void;
  onEdit: (p: Payout) => void;
  onStatusChange: (id: string, status: PayoutStatus) => void;
}) {
  if (!payout) return null;

  function Row({ label, value }: { label: string; value?: React.ReactNode }) {
    if (!value && value !== 0) return null;
    return (
      <div className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-right text-sm font-medium">{value}</span>
      </div>
    );
  }

  return (
    <Sheet open={!!payout} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            Payout Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-bold">{payout.transactionId}</p>
              <p className="text-sm text-muted-foreground">{formatDate(payout.createdAt)}</p>
            </div>
            <StatusBadge status={payout.status} />
          </div>

          {/* Amount highlight */}
          <div className="mb-4 rounded-2xl border border-border bg-muted/40 p-4 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Amount</p>
            <p className="mt-1 text-3xl font-bold">{formatINR(payout.amount)}</p>
            <TypeBadge type={payout.payoutType} />
          </div>

          <Row label="Recipient"       value={payout.recipientName} />
          <Row label="Phone"           value={payout.recipientPhone || undefined} />
          <Row label="Email"           value={payout.recipientEmail || undefined} />
          <Row label="Purpose"         value={payout.purpose} />
          <Row label="Mess"            value={payout.messName || undefined} />
          <Row label="Laundry"         value={(payout as any).laundryName || undefined} />
          <Row label="Property"        value={payout.propertyName || undefined} />
          <Row label="Student"         value={payout.studentName || undefined} />
          <Row label="Service"         value={payout.service || undefined} />
          <Row label="Related Item"    value={payout.relatedItem || undefined} />
          <Row label="Service Period"  value={payout.servicePeriod || undefined} />
          <Row label="Student Count"   value={payout.studentCount || undefined} />
          <Row label="Payment Method"  value={PAYMENT_METHODS.find((m) => m.value === payout.paymentMethod)?.label} />
          <Row label="Reference ID"    value={payout.referenceId || undefined} />
          {payout.payoutType === "REFUND" && (
            <>
              <Row label="Original Txn"   value={payout.originalTransactionId || undefined} />
              <Row label="Original Amt"   value={payout.originalAmount ? formatINR(payout.originalAmount) : undefined} />
              <Row label="Refund Reason"  value={payout.refundReason || undefined} />
            </>
          )}
          <Row label="Description"     value={payout.description || undefined} />
          <Row label="Created By"      value={payout.createdBy} />
          <Row label="Created At"      value={payout.createdAt?.toLocaleString("en-IN")} />
          <Row label="Processed By"    value={payout.processedBy || undefined} />
          <Row label="Processed At"    value={payout.processedAt?.toLocaleString("en-IN") || undefined} />
          <Row label="Last Updated"    value={payout.updatedAt?.toLocaleString("en-IN")} />
        </div>

        {/* Status update */}
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update Status</p>
          <div className="flex flex-wrap gap-1.5">
            {PAYOUT_STATUSES.filter((s) => s.value !== payout.status).map((s) => (
              <Button
                key={s.value}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onStatusChange(payout.id, s.value)}
              >
                → {s.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => { onClose(); onEdit(payout); }}
          >
            <Pencil className="mr-1.5 size-3.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function PayoutsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: allPayouts = [], isLoading } = useAllPayouts();
  const { data: messes = [] } = useMesses();

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messFilter, setMessFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("month");

  // UI state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Payout | null>(null);
  const [detailsPayout, setDetailsPayout] = useState<Payout | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Filter payouts
  const filtered = useMemo(() => {
    const { start, end } = getDateRange(datePreset);
    const q = search.trim().toLowerCase();

    return allPayouts.filter((p) => {
      if (typeFilter   !== "all" && p.payoutType     !== typeFilter)   return false;
      if (statusFilter !== "all" && p.status         !== statusFilter) return false;
      if (messFilter   !== "all" && p.messId         !== messFilter)   return false;
      if (methodFilter !== "all" && p.paymentMethod  !== methodFilter) return false;
      if (start && p.createdAt && p.createdAt < start) return false;
      if (end   && p.createdAt && p.createdAt > end)   return false;
      if (q && ![
        p.transactionId, p.recipientName, p.recipientPhone ?? "",
        p.recipientEmail ?? "", p.referenceId ?? "", p.purpose,
        p.description ?? "", p.messName ?? "", p.propertyName ?? "",
        p.studentName ?? "",
      ].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [allPayouts, search, typeFilter, statusFilter, messFilter, methodFilter, datePreset]);

  const stats = useMemo(() => computePayoutStats(allPayouts), [allPayouts]);
  const filteredStats = useMemo(() => computePayoutStats(filtered), [filtered]);

  async function handleStatusChange(id: string, status: PayoutStatus) {
    setUpdatingStatusId(id);
    try {
      await updatePayoutStatus(id, status, user?.displayName || user?.email || "Admin");
      await qc.invalidateQueries({ queryKey: ["payouts"] });
      toast.success(`Status updated to ${status}.`);
      // Update details pane if open
      if (detailsPayout?.id === id) {
        setDetailsPayout((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <AdminShell
      title="Payouts"
      subtitle="All outgoing / debit transactions."
      action={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportPayoutsCSV(filtered)}
            disabled={filtered.length === 0}
          >
            <Download className="mr-1.5 size-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            Create Payout
          </Button>
        </div>
      }
    >
      {/* ── Summary stat cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Debit"  value={formatINR(stats.total)}      icon={ArrowDownCircle} tone="brand" />
        <StatCard label="Paid"         value={formatINR(stats.paid)}        icon={CheckCircle2}    tone="success" />
        <StatCard label="Pending"      value={formatINR(stats.pending)}     icon={Clock}           tone="warning" />
        <StatCard label="Processing"   value={formatINR(stats.processing)}  icon={RefreshCw}       tone="neutral" />
        <StatCard label="Failed"       value={formatINR(stats.failed)}      icon={XCircle}         tone="neutral" />
      </div>

      {/* Secondary stats row */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Today's Debit</p>
          <p className="mt-1 text-xl font-bold">{formatINR(stats.todayTotal)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">This Month's Debit</p>
          <p className="mt-1 text-xl font-bold">{formatINR(stats.monthTotal)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Transactions</p>
          <p className="mt-1 text-xl font-bold">{stats.count}</p>
        </div>
      </div>

      {/* ── Category breakdown ── */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="mb-3 font-display text-sm font-bold">Payout Breakdown</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PAYOUT_TYPES.map((t) => (
            <div key={t.value} className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2">
              <span className="text-xs font-medium">{t.label}</span>
              <span className="font-semibold tabular-nums">{formatINR(stats.byType[t.value])}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by recipient, ID, purpose…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={datePreset} onValueChange={setDatePreset}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PAYOUT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {PAYOUT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={messFilter} onValueChange={setMessFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Messes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messes</SelectItem>
            {messes.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {PAYMENT_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="mt-2 text-xs text-muted-foreground">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== allPayouts.length ? ` (filtered from ${allPayouts.length})` : ""}
          {" · "}Total: <strong>{formatINR(filteredStats.total)}</strong>
        </p>
      )}

      {/* ── Transaction list ── */}
      {isLoading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No payout transactions yet"
          description={
            allPayouts.length === 0
              ? "Create your first payout to start tracking outgoing payments."
              : "No transactions match your current filters."
          }
          action={
            allPayouts.length === 0 ? (
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1.5 size-4" /> Create Payout
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Mess / Property</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-muted/40"
                    onClick={() => setDetailsPayout(p)}
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{p.transactionId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.recipientName}</p>
                      {p.recipientPhone && (
                        <p className="text-xs text-muted-foreground">{p.recipientPhone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={p.payoutType} /></td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="truncate text-sm">{p.purpose}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.messName || p.propertyName || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatINR(p.amount)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {PAYMENT_METHODS.find((m) => m.value === p.paymentMethod)?.label ?? p.paymentMethod}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => { e.stopPropagation(); setDetailsPayout(p); }}
                      >
                        <Eye className="mr-1 size-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-2 lg:hidden">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-soft"
                onClick={() => setDetailsPayout(p)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.recipientName}</p>
                    <p className="font-mono text-xs text-primary">{p.transactionId}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-lg font-bold">{formatINR(p.amount)}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <TypeBadge type={p.payoutType} />
                  <span>{formatDate(p.createdAt)}</span>
                  {p.messName && <span>· {p.messName}</span>}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{p.purpose}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Dialogs / Sheets ── */}
      <PayoutFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      {editTarget && (
        <PayoutFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          existing={editTarget}
        />
      )}
      <PayoutDetailsSheet
        payout={detailsPayout}
        onClose={() => setDetailsPayout(null)}
        onEdit={(p) => { setDetailsPayout(null); setEditTarget(p); }}
        onStatusChange={handleStatusChange}
      />
    </AdminShell>
  );
}
