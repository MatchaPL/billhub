"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const floatingCards = [
  { label: "OCR Completed", icon: "✓", color: "bg-white", delay: 0 },
  { label: "Duplicate Check: Passed", icon: "🛡", color: "bg-white", delay: 0.2 },
  { label: "Risk Score: 92/100", icon: "📊", color: "bg-white", delay: 0.4 },
  { label: "Export to Sheets", icon: "📋", color: "bg-white", delay: 0.6 },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen grain-bg overflow-hidden pt-20 sm:pt-24 lg:pt-32 pb-20">
      <div className="absolute top-20 left-10 w-96 h-96 bg-cream/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-ai-blue/10 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-success/5 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute top-12 left-0 right-0 pointer-events-none select-none overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-4">
          <span
            className="block text-[28vw] sm:text-[22vw] lg:text-[18vw] font-black tracking-tighter leading-[0.85] whitespace-nowrap"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px rgba(102, 73, 48, 0.05)",
            }}
          >
            BillHUB
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute bottom-8 left-0 right-0 pointer-events-none select-none overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-4">
          <span
            className="block text-[10vw] sm:text-[8vw] lg:text-[6vw] font-black tracking-[0.2em] leading-none whitespace-nowrap text-right"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(102, 73, 48, 0.04)",
            }}
          >
            EXPENSE AUDITOR
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight"
            >
              <span className="text-foreground">กรอกใบเสร็จ</span>
              <br />
              <span className="text-coffee">3 ชั่วโมง</span>
              <br />
              <span className="text-foreground">เสร็จได้ใน </span>
              <span className="relative">
                <span className="text-ai-blue">3 นาที</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-ai-blue/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-taupe leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              AI Expense Auditor ที่ช่วยอ่านใบเสร็จ ตรวจใบซ้ำ วิเคราะห์ความเสี่ยง
              และจัดการเอกสารค่าใช้จ่ายผ่าน LINE
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <a
                href="#"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-ai-blue rounded-2xl hover:bg-ai-blue/90 transition-all shadow-xl shadow-ai-blue/25 hover:shadow-2xl hover:shadow-ai-blue/30 hover:-translate-y-0.5 text-center"
              >
                เริ่มใช้ฟรี
              </a>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-coffee bg-white border-2 border-coffee/15 rounded-2xl hover:border-coffee/30 hover:bg-coffee/5 transition-all text-center"
              >
                ดูตัวอย่างระบบ
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-taupe"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                ฟรี 10 ใบ/เดือน
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                ใช้งานผ่าน LINE
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                ไม่ต้องติดตั้ง
              </div>
            </motion.div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-xl min-h-[400px] sm:min-h-[500px]">
            <Scene3D />

            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + card.delay }}
                className={`absolute glass-card px-4 py-3 shadow-lg shadow-black/[0.05] ${
                  i === 0 ? "top-4 right-4 sm:right-8" :
                  i === 1 ? "top-24 right-0 sm:right-2" :
                  i === 2 ? "bottom-32 right-4 sm:right-6" :
                  "bottom-12 right-8 sm:right-16"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    i === 0 ? "bg-success/10" :
                    i === 1 ? "bg-ai-blue/10" :
                    i === 2 ? "bg-cream" :
                    "bg-coffee/10"
                  }`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{card.label}</p>
                    {i === 2 && (
                      <div className="mt-1 w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-success rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 1.5, delay: 1.5 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
