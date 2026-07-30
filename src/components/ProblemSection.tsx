"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#664930" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M9 15l3-3 3 3" />
      </svg>
    ),
    title: "ใบเสร็จเยอะเกินไป",
    description: "เก็บใบเสร็จมาเป็นกอง สแกนทีละใบ คีย์ข้อมูลเข้า Excel ทีละบรรทัด เสียเวลาหลายชั่วโมงต่อวัน",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#664930" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10" />
        <path d="M16 7v10" />
        <path d="M2 12h20" />
      </svg>
    ),
    title: "ตรวจใบซ้ำด้วยมือยาก",
    description: "พนักงานส่งใบเสร็จซ้ำ ใช้สลิปเดิมเบิกหลายรอบ ตรวจจับด้วยสายตาแทบเป็นไปไม่ได้",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#664930" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "ส่งบัญชีช้าและผิดพลาดง่าย",
    description: "ข้อมูลกระจายอยู่ในหลายที่ สรุปรายงานช้า ตัวเลขไม่ตรง ปิดงบไม่ทัน",
  },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 grain-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-taupe bg-taupe/10 rounded-full mb-4">
            Pain Points
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            งานเอกสารค่าใช้จ่าย
            <br />
            <span className="text-coffee">ไม่ควรกินเวลาทั้งวัน</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-warm-gray/30 border border-warm-gray/30 p-8 sm:p-10 h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-coffee/[0.08] group-hover:bg-warm-gray/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-coffee/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/60 border border-white/40 flex items-center justify-center mb-6 shadow-sm">
                    {problem.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-taupe">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
