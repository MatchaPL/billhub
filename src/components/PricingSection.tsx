"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    quota: 15,
    perSlip: "—",
    badge: null,
    highlight: false,
    description: "ทดลองใช้งาน",
    features: [
      { text: "OCR สลิปธนาคาร", included: true },
      { text: "Dashboard พื้นฐาน", included: true },
      { text: "ใช้งานผ่าน LINE", included: true },
      { text: "ตรวจจับใบเสร็จซ้ำ", included: false },
      { text: "Risk Score", included: false },
      { text: "Export Google Sheets", included: false },
      { text: "Export PDF", included: false },
    ],
    cta: "เริ่มใช้ฟรี",
    overageNote: null,
  },
  {
    name: "Starter",
    monthlyPrice: 290,
    quota: 50,
    perSlip: "฿5.80",
    badge: null,
    highlight: false,
    description: "เหมาะธุรกิจเพิ่งเริ่ม",
    features: [
      { text: "OCR สลิปธนาคาร", included: true },
      { text: "Dashboard พื้นฐาน", included: true },
      { text: "ใช้งานผ่าน LINE", included: true },
      { text: "ตรวจจับใบเสร็จซ้ำ", included: false },
      { text: "Risk Score", included: false },
      { text: "Export Google Sheets", included: false },
      { text: "Export PDF", included: false },
    ],
    cta: "เลือกแพ็กเกจ",
    overageNote: "+฿8/สลิป เกินโควต้า",
  },
  {
    name: "Pro",
    monthlyPrice: 990,
    quota: 200,
    perSlip: "฿4.95",
    badge: "คุ้มค่าที่สุด",
    highlight: true,
    description: "เหมาะ SME ทั่วไป",
    features: [
      { text: "OCR สลิปธนาคาร", included: true },
      { text: "Dashboard วิเคราะห์เต็มรูปแบบ", included: true },
      { text: "ใช้งานผ่าน LINE", included: true },
      { text: "ตรวจจับใบเสร็จซ้ำ ✨", included: true },
      { text: "Risk Score อัตโนมัติ ✨", included: true },
      { text: "Export Google Sheets ✨", included: true },
      { text: "Export PDF", included: true },
    ],
    cta: "เลือก Pro",
    overageNote: "+฿5/สลิป เกินโควต้า",
  },
  {
    name: "Business",
    monthlyPrice: 2290,
    quota: 600,
    perSlip: "฿3.82",
    badge: null,
    highlight: false,
    description: "ทีม 2-5 คน",
    features: [
      { text: "OCR สลิปธนาคาร", included: true },
      { text: "Dashboard วิเคราะห์เต็มรูปแบบ", included: true },
      { text: "ใช้งานผ่าน LINE", included: true },
      { text: "ตรวจจับใบเสร็จซ้ำ ✨", included: true },
      { text: "Risk Score อัตโนมัติ ✨", included: true },
      { text: "Export Google Sheets ✨", included: true },
      { text: "Multi-user 5 คน + Approval", included: true },
    ],
    cta: "เลือกแพ็กเกจ",
    overageNote: "+฿4/สลิป เกินโควต้า",
  },
  {
    name: "Auditor",
    monthlyPrice: 4990,
    quota: 1500,
    perSlip: "฿3.33",
    badge: null,
    highlight: false,
    description: "สำนักงานบัญชี/Enterprise",
    features: [
      { text: "OCR สลิปธนาคาร", included: true },
      { text: "Dashboard วิเคราะห์เต็มรูปแบบ", included: true },
      { text: "ใช้งานผ่าน LINE", included: true },
      { text: "ตรวจจับใบเสร็จซ้ำ ✨", included: true },
      { text: "Risk Score อัตโนมัติ ✨", included: true },
      { text: "Export Google Sheets ✨", included: true },
      { text: "ไม่จำกัดผู้ใช้ + Audit Log", included: true },
    ],
    cta: "ติดต่อทีมงาน",
    overageNote: "+฿3/สลิป เกินโควต้า",
  },
];

const ANNUAL_DISCOUNT = 0.8;

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-warm-gray/20">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#CCBEB1" strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  );
}

function PricingCard({
  plan,
  index,
  isInView,
  isAnnual,
}: {
  plan: (typeof plans)[0];
  index: number;
  isInView: boolean;
  isAnnual: boolean;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!plan.highlight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };

  const displayPrice = isAnnual && plan.monthlyPrice > 0
    ? Math.round(plan.monthlyPrice * ANNUAL_DISCOUNT)
    : plan.monthlyPrice;

  const originalPrice = plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="relative"
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-coffee rounded-full shadow-lg shadow-coffee/30">
            {plan.badge}
          </span>
        </div>
      )}

      <div
        className={`relative overflow-hidden rounded-3xl p-6 h-full flex flex-col transition-all duration-300 ${
          plan.highlight
            ? "bg-coffee text-white shadow-2xl shadow-coffee/25 border-0 scale-[1.02]"
            : "bg-white border border-warm-gray/20 hover:shadow-lg hover:shadow-coffee/[0.06]"
        }`}
      >
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-start justify-between mb-1">
            <h3 className={`text-base font-bold ${plan.highlight ? "text-white" : "text-foreground"}`}>
              {plan.name}
            </h3>
            {plan.perSlip !== "—" && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                plan.highlight
                  ? "bg-white/20 text-white"
                  : "bg-coffee/8 text-coffee"
              }`}>
                {plan.perSlip}/สลิป
              </span>
            )}
          </div>

          <p className={`text-xs mb-3 ${plan.highlight ? "text-white/70" : "text-taupe"}`}>
            {plan.description}
          </p>

          <div className="flex items-end gap-1.5">
            {isAnnual && plan.monthlyPrice > 0 && (
              <span className={`text-sm line-through ${plan.highlight ? "text-white/40" : "text-warm-gray"}`}>
                ฿{originalPrice.toLocaleString()}
              </span>
            )}
            <span className={`text-3xl font-extrabold leading-none ${plan.highlight ? "text-white" : "text-foreground"}`}>
              {plan.monthlyPrice === 0 ? "ฟรี" : `฿${displayPrice.toLocaleString()}`}
            </span>
            {plan.monthlyPrice > 0 && (
              <span className={`text-xs mb-0.5 ${plan.highlight ? "text-white/60" : "text-taupe"}`}>
                /เดือน
              </span>
            )}
          </div>

          {isAnnual && plan.monthlyPrice > 0 && (
            <p className={`text-[10px] font-semibold mt-1 ${plan.highlight ? "text-yellow-300" : "text-success"}`}>
              ประหยัด ฿{((originalPrice - displayPrice) * 12).toLocaleString()}/ปี
            </p>
          )}

          <p className={`text-xs font-semibold mt-2 ${plan.highlight ? "text-white/80" : "text-coffee/70"}`}>
            {plan.quota.toLocaleString()} สลิป/เดือน
          </p>
        </div>

        {/* Divider */}
        <div className={`h-px mb-5 ${plan.highlight ? "bg-white/15" : "bg-warm-gray/15"}`} />

        {/* Features */}
        <div className="space-y-2.5 mb-6 flex-1">
          {plan.features.map((feature) => (
            <div key={feature.text} className="flex items-center gap-2.5">
              {plan.highlight ? (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  feature.included ? "bg-white/20" : "bg-white/10"
                }`}>
                  {feature.included ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
              ) : (
                <CheckIcon included={feature.included} />
              )}
              <span className={`text-xs ${
                plan.highlight
                  ? feature.included ? "text-white" : "text-white/35"
                  : feature.included ? "text-foreground/80" : "text-warm-gray line-through"
              }`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Overage note */}
        {plan.overageNote && (
          <p className={`text-[10px] text-center mb-3 ${plan.highlight ? "text-white/50" : "text-taupe/60"}`}>
            {plan.overageNote}
          </p>
        )}

        {/* CTA */}
        <button
          className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
            plan.highlight
              ? "bg-white text-coffee hover:bg-cream shadow-lg"
              : "bg-coffee/8 text-coffee hover:bg-coffee/15"
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" ref={ref} className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-cream/15 to-bg" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-coffee bg-coffee/10 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            แพ็กเกจที่เหมาะกับธุรกิจคุณ
          </h2>
          <p className="mt-4 text-base text-taupe max-w-lg mx-auto">
            จ้างนักบัญชีตรวจสลิป = <span className="line-through text-warm-gray">฿300–500/ชั่วโมง</span>
            <span className="font-bold text-coffee"> BillHUB Pro = ฿990/เดือน</span>
          </p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm font-medium ${!isAnnual ? "text-coffee" : "text-taupe"}`}>
              รายเดือน
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isAnnual ? "bg-coffee" : "bg-warm-gray/40"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                isAnnual ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-coffee" : "text-taupe"}`}>
              รายปี
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold text-success bg-success/10 rounded-full">
              ประหยัด 20%
            </span>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={i}
              isInView={isInView}
              isAnnual={isAnnual}
            />
          ))}
        </div>

        {/* Value callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: "🔍", title: "ตรวจซ้ำอัตโนมัติ", desc: "ไม่มีเบิกซ้ำอีกต่อไป ประหยัดได้หลักพัน" },
            { icon: "⚡", title: "OCR ภายใน 3 วินาที", desc: "ส่งสลิปในไลน์ → ได้ผลทันที" },
            { icon: "📊", title: "Export ได้ทุกรูปแบบ", desc: "Google Sheets, PDF พร้อมส่งสรรพากร" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-white border border-warm-gray/15">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-coffee">{item.title}</p>
                <p className="text-xs text-taupe mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-xs text-taupe/50 mt-6"
        >
          ไม่ต้องใช้บัตรเครดิตในการทดลองใช้ · ยกเลิกได้ทุกเมื่อ · ราคายังไม่รวม VAT 7%
        </motion.p>
      </div>
    </section>
  );
}
