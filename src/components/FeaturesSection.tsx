"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    title: "AI OCR",
    description: "อ่านใบเสร็จ ใบกำกับภาษี สลิปโอนเงิน และ PDF อัตโนมัติ",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6" />
        <path d="M9 17h3" />
      </svg>
    ),
    color: "#4F6BFF",
    bg: "bg-ai-blue/5",
  },
  {
    title: "Duplicate Detection",
    description: "ตรวจจับใบเสร็จหรือสลิปที่ถูกส่งซ้ำจากข้อมูลเดิม รูปภาพเดิม ยอดเดิม หรือเลขเอกสารเดิม",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="13" height="16" rx="2" />
        <path d="M4 6h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M15 10l-3 3-1.5-1.5" />
      </svg>
    ),
    color: "#22C55E",
    bg: "bg-success/5",
  },
  {
    title: "Risk Score",
    description: "ให้คะแนนความเสี่ยงของเอกสาร เช่น ยอดผิดปกติ วันที่ผิดปกติ หรือข้อมูลไม่ตรงกัน",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    color: "#F59E0B",
    bg: "bg-amber-500/5",
  },
  {
    title: "Slip Verification",
    description: "ช่วยตรวจสอบข้อมูลสลิปโอนเงินและแจ้งเตือนรายการที่น่าสงสัย",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 15h0M2 9.5h20" />
      </svg>
    ),
    color: "#8B5CF6",
    bg: "bg-purple-500/5",
  },
  {
    title: "Approval Workflow",
    description: "ให้หัวหน้าหรือฝ่ายบัญชีอนุมัติค่าใช้จ่ายผ่านระบบได้ง่าย",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    color: "#664930",
    bg: "bg-coffee/5",
  },
  {
    title: "Audit Dashboard",
    description: "ดูรายงานค่าใช้จ่าย รายการซ้ำ รายการเสี่ยง และสถานะการอนุมัติในหน้าเดียว",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
    color: "#4F6BFF",
    bg: "bg-ai-blue/5",
  },
];

function FeatureCard({ feature, index, isInView }: { feature: typeof features[0]; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        animate={{
          rotateX: isHovered ? -2 : 0,
          rotateY: isHovered ? 3 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-3xl bg-white border border-warm-gray/20 p-8 h-full transition-shadow duration-300 hover:shadow-xl hover:shadow-coffee/[0.06]"
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: feature.color + "15" }}
        />

        <div className="relative">
          <div
            className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
            style={{ color: feature.color }}
          >
            {feature.icon}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {feature.title}
          </h3>

          <p className="text-sm leading-relaxed text-taupe">
            {feature.description}
          </p>

          <motion.div
            className="mt-4 flex items-center gap-1 text-sm font-medium"
            style={{ color: feature.color }}
            animate={{ x: isHovered ? 4 : 0 }}
          >
            <span>เรียนรู้เพิ่มเติม</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-cream/20 to-bg" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-ai-blue bg-ai-blue/10 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            ทุกเครื่องมือที่คุณต้องการ
          </h2>
          <p className="mt-4 text-base text-taupe max-w-lg mx-auto">
            ครบจบในที่เดียว ตั้งแต่อ่านเอกสาร ตรวจสอบ ไปจนถึงรายงาน
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
