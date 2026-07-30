"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-coffee via-coffee to-coffee/90 px-8 py-16 sm:px-16 sm:py-24 text-center"
        >
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cream/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-ai-blue/10 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-success/10 rounded-full blur-[60px]" />

          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }} />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                เปลี่ยนงานเอกสารบัญชี
                <br />
                <span className="text-cream">ให้เป็นระบบอัตโนมัติ</span>
              </h2>

              <p className="mt-6 text-base sm:text-lg text-cream/80 max-w-xl mx-auto leading-relaxed">
                เริ่มจากการส่งใบเสร็จเข้า LINE แล้วปล่อยให้ AI ช่วยอ่าน ตรวจ และจัดการให้คุณ
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
            >
              <a
                href="#"
                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-coffee bg-cream rounded-2xl hover:bg-white transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
              >
                เริ่มใช้ฟรี
              </a>
              <a
                href="#"
                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-cream border-2 border-cream/30 rounded-2xl hover:border-cream/60 hover:bg-cream/10 transition-all"
              >
                ขอ Demo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex items-center gap-6 justify-center text-sm text-cream/60"
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                ฟรี 10 ใบ/เดือน
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                ไม่ต้องใช้บัตรเครดิต
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                ยกเลิกได้ตลอด
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
