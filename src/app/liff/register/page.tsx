"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

const businessTypes = [
  "บริษัทจำกัด",
  "ห้างหุ้นส่วนจำกัด",
  "บุคคลธรรมดา",
  "ร้านค้า/กิจการ",
  "อื่นๆ",
];

const branchTypes = ["สำนักงานใหญ่", "สาขา", "ไม่มี"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessType: "บริษัทจำกัด",
    businessNameTh: "",
    businessNameEn: "",
    branchType: "สำนักงานใหญ่",
    branchNumber: "",
    taxId: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!LIFF_ID) {
      setError("LIFF ID ยังไม่ได้ตั้งค่า");
      setLoading(false);
      return;
    }

    liff
      .init({ liffId: LIFF_ID })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const p = await liff.getProfile();
        setProfile({
          userId: p.userId,
          displayName: p.displayName,
          pictureUrl: p.pictureUrl,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("ไม่สามารถเชื่อมต่อ LINE ได้");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: profile?.userId,
          displayName: profile?.displayName,
          pictureUrl: profile?.pictureUrl,
          firstName: form.firstName,
          lastName: form.lastName,
          businessType: form.businessType,
          businessNameTh: form.businessNameTh,
          businessNameEn: form.businessNameEn,
          branchType: form.branchType,
          branchNumber: form.branchNumber,
          taxId: form.taxId,
          address: form.address,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      setDone(true);
      setStep(3);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const canGoStep2 = form.firstName.trim() !== "";
  const canSubmit = form.businessNameTh.trim() !== "" && form.taxId.trim() !== "";

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-coffee/20 border-t-coffee rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee/60 text-sm">กำลังเชื่อมต่อ LINE...</p>
        </div>
      </div>
    );
  }

  if (error && !done) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-coffee font-semibold mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-coffee/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-warm-gray/15 z-10">
        <div className="px-5 py-4">
          <p className="text-center font-extrabold text-coffee tracking-tight">BillHUB</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pb-32">
        {/* Mascot & Welcome */}
        <div className="text-center pt-6 pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-ai-blue/10 to-coffee/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-xl font-bold text-coffee">
            {step === 3 ? "พร้อมใช้งานแล้ว!" : "ยินดีต้อนรับสู่ BillHUB"}
          </h1>
          <p className="text-coffee/50 text-sm mt-1">
            {step === 3
              ? "เริ่มส่งใบเสร็จได้เลย"
              : "เริ่มใช้งานฟรีได้ทันที! เพียง 2 ขั้นตอนง่ายๆ"}
          </p>
        </div>

        {/* Steps indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-0 mb-8">
            {[
              { num: 1, label: "ข้อมูลส่วนตัว" },
              { num: 2, label: "สร้างธุรกิจ" },
              { num: 3, label: "เริ่มใช้งาน" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                {i > 0 && (
                  <div
                    className={`w-8 h-[2px] ${
                      step >= s.num ? "bg-coffee" : "bg-warm-gray/30"
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step > s.num
                        ? "bg-success text-white"
                        : step === s.num
                        ? "bg-coffee text-white"
                        : "bg-warm-gray/20 text-coffee/40"
                    }`}
                  >
                    {step > s.num ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step === s.num ? "text-coffee" : "text-coffee/40"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* LINE Profile Card */}
              <div className="bg-white rounded-2xl border border-warm-gray/15 p-4 mb-6">
                <p className="text-xs text-coffee/40 font-medium mb-3">LINE</p>
                <div className="flex items-center gap-3">
                  {profile?.pictureUrl ? (
                    <img
                      src={profile.pictureUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-coffee/10 flex items-center justify-center">
                      <span className="text-coffee font-bold">
                        {profile?.displayName?.[0] || "?"}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-coffee">
                      {profile?.displayName}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name fields */}
              <FormField
                label="ชื่อ"
                required
                placeholder="กรอกชื่อ (ภาษาไทยหรืออังกฤษ)"
                value={form.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
              <FormField
                label="นามสกุล"
                placeholder="กรอกนามสกุล (ภาษาไทยหรืออังกฤษ)"
                value={form.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
              <FormField
                label="เบอร์โทรศัพท์"
                placeholder="0xx-xxx-xxxx"
                type="tel"
                value={form.phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <FormField
                label="อีเมล"
                placeholder="email@example.com"
                type="email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Business Type Select */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-coffee mb-2">
                  ประเภทธุรกิจ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className="w-full bg-white border border-warm-gray/20 rounded-xl px-4 py-3.5 text-coffee text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-coffee/20 focus:border-coffee/30"
                  >
                    {businessTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee/40 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warm-gray/15" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-bg px-3 text-xs text-coffee/40">กรอกข้อมูลธุรกิจ</span>
                </div>
              </div>

              <FormField
                label="ชื่อธุรกิจภาษาไทย"
                required
                placeholder="เช่น บริษัท BillHUB จำกัด"
                value={form.businessNameTh}
                onChange={(v) => handleChange("businessNameTh", v)}
              />
              <FormField
                label="ชื่อธุรกิจภาษาอังกฤษ"
                placeholder="เช่น BillHUB Co., Ltd."
                value={form.businessNameEn}
                onChange={(v) => handleChange("businessNameEn", v)}
              />

              {/* Branch Type */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-coffee mb-2">
                  ประเภทสาขา <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {branchTypes.map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => handleChange("branchType", bt)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                        form.branchType === bt
                          ? "bg-coffee text-white border-coffee"
                          : "bg-white text-coffee/60 border-warm-gray/20 hover:border-coffee/30"
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              {form.branchType === "สาขา" && (
                <FormField
                  label="เลขที่สาขา"
                  placeholder="00001"
                  value={form.branchNumber}
                  onChange={(v) => handleChange("branchNumber", v)}
                />
              )}

              <FormField
                label="เลขผู้เสียภาษี (13 หลัก)"
                required
                placeholder="0000000000000"
                maxLength={13}
                value={form.taxId}
                onChange={(v) => handleChange("taxId", v.replace(/\D/g, ""))}
              />
              <FormField
                label="ที่อยู่"
                placeholder="ที่อยู่สำหรับออกเอกสาร"
                multiline
                value={form.address}
                onChange={(v) => handleChange("address", v)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8"
            >
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-coffee mb-2">สมัครสำเร็จ!</h2>
              <p className="text-coffee/50 mb-8">
                คุณสามารถเริ่มใช้งาน BillHUB ได้ทันที
              </p>

              <div className="bg-white rounded-2xl border border-warm-gray/15 p-5 mb-6 text-left">
                <p className="text-xs text-coffee/40 font-medium mb-3">ข้อมูลธุรกิจ</p>
                <div className="space-y-2">
                  <InfoRow label="ชื่อธุรกิจ" value={form.businessNameTh} />
                  {form.businessNameEn && <InfoRow label="English" value={form.businessNameEn} />}
                  <InfoRow label="ประเภท" value={form.businessType} />
                  <InfoRow label="เลขภาษี" value={form.taxId} />
                  {form.address && <InfoRow label="ที่อยู่" value={form.address} />}
                </div>
              </div>

              <div className="bg-coffee/5 rounded-2xl p-5 text-left">
                <p className="text-sm font-semibold text-coffee mb-3">เริ่มต้นใช้งาน</p>
                <div className="space-y-3">
                  {[
                    { icon: "📸", text: "ถ่ายรูปใบเสร็จแล้วส่งมาในแชท" },
                    { icon: "📄", text: "ส่งไฟล์ PDF เอกสารค่าใช้จ่าย" },
                    { icon: "💬", text: 'พิมพ์ "ช่วยเหลือ" เพื่อดูคำสั่งทั้งหมด' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-sm text-coffee/70">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (liff.isInClient()) {
                    liff.closeWindow();
                  } else {
                    window.close();
                  }
                }}
                className="mt-8 w-full py-4 bg-coffee text-white font-semibold rounded-2xl text-sm hover:bg-coffee/90 transition-colors"
              >
                กลับไปแชท
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-warm-gray/15 p-5">
          <div className="max-w-lg mx-auto flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 text-coffee font-semibold rounded-2xl text-sm border border-warm-gray/20 hover:bg-coffee/5 transition-colors"
              >
                ย้อนกลับ
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => canGoStep2 && setStep(2)}
                disabled={!canGoStep2}
                className={`flex-1 py-4 font-semibold rounded-2xl text-sm transition-colors ${
                  canGoStep2
                    ? "bg-coffee text-white hover:bg-coffee/90"
                    : "bg-warm-gray/20 text-coffee/30 cursor-not-allowed"
                }`}
              >
                ไปสร้างธุรกิจ
              </button>
            )}
            {step === 2 && (
              <button
                onClick={() => canSubmit && handleSubmit()}
                disabled={!canSubmit || submitting}
                className={`flex-1 py-4 font-semibold rounded-2xl text-sm transition-colors ${
                  canSubmit && !submitting
                    ? "bg-coffee text-white hover:bg-coffee/90"
                    : "bg-warm-gray/20 text-coffee/30 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังบันทึก...
                  </span>
                ) : (
                  "เริ่มใช้งาน"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
  maxLength,
  multiline,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  maxLength?: number;
  multiline?: boolean;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-coffee mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white border border-warm-gray/20 rounded-xl px-4 py-3.5 text-coffee text-sm placeholder:text-coffee/30 focus:outline-none focus:ring-2 focus:ring-coffee/20 focus:border-coffee/30 resize-none"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="w-full bg-white border border-warm-gray/20 rounded-xl px-4 py-3.5 text-coffee text-sm placeholder:text-coffee/30 focus:outline-none focus:ring-2 focus:ring-coffee/20 focus:border-coffee/30"
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs text-coffee/40">{label}</span>
      <span className="text-sm text-coffee font-medium text-right">{value}</span>
    </div>
  );
}
