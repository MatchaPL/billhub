"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "ส่งใบเสร็จผ่าน LINE",
    description: "ถ่ายรูปใบเสร็จ ส่งไฟล์ PDF หรือสลิปโอนเงิน เข้ามาใน LINE ได้เลย ง่ายเหมือนแชทหาเพื่อน",
    visual: (
      <div className="relative w-48 h-80 mx-auto">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl shadow-black/20 p-2">
          <div className="w-full h-full rounded-[1.6rem] bg-white overflow-hidden">
            <div className="h-8 bg-[#06C755] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">LINE</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-end">
                <div className="bg-[#06C755] text-white text-[8px] px-3 py-2 rounded-2xl rounded-tr-sm max-w-[70%]">
                  📎 receipt_june.jpg
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-20 h-16 bg-cream/50 rounded-xl border border-warm-gray/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#997E67" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 text-[8px] px-3 py-2 rounded-2xl rounded-tl-sm text-gray-700">
                  กำลังอ่านข้อมูล... ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    color: "from-[#06C755]/10 to-transparent",
  },
  {
    number: "02",
    title: "AI อ่านและจัดหมวดหมู่",
    description: "AI อ่านข้อมูลจากเอกสารโดยอัตโนมัติ แยกร้านค้า วันที่ ยอดเงิน และจัดหมวดหมู่ให้ทันที",
    visual: (
      <div className="space-y-3 w-56 mx-auto">
        <div className="glass-card p-3 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-ai-blue/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4F6BFF" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <span className="text-[10px] font-semibold text-foreground">ข้อมูลที่อ่านได้</span>
          </div>
          <div className="space-y-1.5 text-[9px]">
            <div className="flex justify-between"><span className="text-taupe">ร้านค้า</span><span className="font-medium">ABC Office</span></div>
            <div className="flex justify-between"><span className="text-taupe">วันที่</span><span className="font-medium">12/06/2026</span></div>
            <div className="flex justify-between"><span className="text-taupe">ยอดรวม</span><span className="font-medium text-coffee">฿1,250</span></div>
            <div className="flex justify-between"><span className="text-taupe">หมวดหมู่</span><span className="font-medium text-ai-blue">ค่าอุปกรณ์</span></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 glass-card p-2 text-center">
            <div className="text-[8px] text-taupe mb-1">Confidence</div>
            <div className="text-sm font-bold text-success">98%</div>
          </div>
          <div className="flex-1 glass-card p-2 text-center">
            <div className="text-[8px] text-taupe mb-1">Speed</div>
            <div className="text-sm font-bold text-ai-blue">1.2s</div>
          </div>
        </div>
      </div>
    ),
    color: "from-ai-blue/10 to-transparent",
  },
  {
    number: "03",
    title: "ตรวจซ้ำและความผิดปกติ",
    description: "ระบบตรวจจับใบเสร็จซ้ำโดยอัตโนมัติ ให้คะแนนความเสี่ยง และแจ้งเตือนรายการที่ต้องตรวจสอบ",
    visual: (
      <div className="space-y-3 w-56 mx-auto">
        <div className="glass-card p-3 shadow-md border-l-4 border-l-success">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-[10px] font-semibold text-foreground">ไม่พบใบซ้ำ</span>
          </div>
        </div>
        <div className="glass-card p-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold">Risk Score</span>
            <span className="text-sm font-bold text-success">94/100</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-success to-success/70 rounded-full" style={{ width: "94%" }} />
          </div>
          <p className="text-[8px] text-taupe mt-1.5">ความเสี่ยงต่ำ — เอกสารปกติ</p>
        </div>
        <div className="glass-card p-3 shadow-md border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center">
              <span className="text-[8px]">⚠️</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-foreground">พบ 1 รายการต้องตรวจ</span>
              <p className="text-[8px] text-taupe">ยอดเงินสูงกว่าค่าเฉลี่ย</p>
            </div>
          </div>
        </div>
      </div>
    ),
    color: "from-success/10 to-transparent",
  },
  {
    number: "04",
    title: "Export และส่งบัญชี",
    description: "ส่งข้อมูลออกเป็น Excel, Google Sheets, Google Drive หรือดูรายงานใน Dashboard ได้ทันที",
    visual: (
      <div className="grid grid-cols-2 gap-2 w-56 mx-auto">
        {[
          { name: "Google Sheets", color: "bg-green-500/10", icon: "📊" },
          { name: "Excel", color: "bg-emerald-500/10", icon: "📗" },
          { name: "Google Drive", color: "bg-blue-500/10", icon: "☁️" },
          { name: "Dashboard", color: "bg-ai-blue/10", icon: "📈" },
        ].map((item) => (
          <div key={item.name} className="glass-card p-3 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-2`}>
              <span className="text-lg">{item.icon}</span>
            </div>
            <span className="text-[9px] font-medium text-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    ),
    color: "from-coffee/10 to-transparent",
  },
];

export default function WorkflowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="workflow" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-ai-blue bg-ai-blue/10 rounded-full mb-4">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            ทำงานยังไง
          </h2>
          <p className="mt-4 text-base text-taupe max-w-lg mx-auto">
            เพียง 4 ขั้นตอน จากใบเสร็จในมือ สู่รายงานค่าใช้จ่ายอัตโนมัติ
          </p>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="text-5xl font-black text-coffee/10">{step.number}</span>
                  <div className="h-px w-8 bg-coffee/20" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-base text-taupe leading-relaxed max-w-md mx-auto lg:mx-0">
                  {step.description}
                </p>
              </div>

              <div className="flex-1 w-full max-w-sm">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-3xl bg-gradient-to-b ${step.color} p-8 border border-warm-gray/20`}
                >
                  <div className="absolute inset-0 rounded-3xl bg-white/20 backdrop-blur-sm" />
                  <div className="relative">{step.visual}</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
