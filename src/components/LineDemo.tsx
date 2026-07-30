"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const messages = [
  { type: "user", content: "📎 receipt_office_supplies.jpg", isImage: true },
  { type: "bot", content: "กำลังอ่านข้อมูล...", typing: true },
  {
    type: "bot",
    content: "read_result",
    isResult: true,
    data: {
      status: "อ่านข้อมูลสำเร็จ ✓",
      fields: [
        { label: "ร้านค้า", value: "ABC Office" },
        { label: "วันที่", value: "12/06/2026" },
        { label: "หมวดหมู่", value: "ค่าอุปกรณ์สำนักงาน" },
        { label: "ยอดรวม", value: "1,250 บาท" },
        { label: "สถานะ", value: "ไม่พบใบซ้ำ", isGreen: true },
        { label: "Risk Score", value: "94/100", isGreen: true },
      ],
    },
  },
];

export default function LineDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const delays = [0, 800, 1800, 2600];
    const timers = delays.map((delay, i) =>
      setTimeout(() => setVisibleMessages(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section id="demo" ref={ref} className="relative py-24 sm:py-32 grain-bg overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#06C755]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-ai-blue/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#06C755] bg-[#06C755]/10 rounded-full mb-4">
            Live Demo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            ลองดูการทำงานจริง
          </h2>
          <p className="mt-4 text-base text-taupe max-w-lg mx-auto">
            ส่งใบเสร็จเข้า LINE แล้ว AI จะตอบกลับข้อมูลให้ทันที
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-[320px] sm:w-[360px]">
              <div className="rounded-[2.5rem] bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-2xl shadow-black/30">
                <div className="w-full rounded-[2rem] bg-white overflow-hidden">
                  <div className="h-12 bg-[#06C755] flex items-center px-4 gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
                        </div>
                        <span className="text-white text-sm font-semibold">BillHUB AI</span>
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                  </div>

                  <div className="h-[480px] bg-[#8CABD9]/10 p-4 space-y-3 overflow-hidden">
                    <div className="text-center">
                      <span className="text-[10px] text-gray-400 bg-white/60 px-3 py-1 rounded-full">วันนี้</span>
                    </div>

                    {visibleMessages >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="flex justify-end"
                      >
                        <div className="max-w-[75%]">
                          <div className="bg-[#06C755] text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm">
                            📎 receipt_office_supplies.jpg
                          </div>
                          <div className="mt-1.5 bg-[#06C755]/90 rounded-xl p-2">
                            <div className="w-full h-24 bg-white/20 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="mx-auto mb-1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                                <span className="text-[9px] text-white/80">ใบเสร็จ</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {visibleMessages >= 2 && visibleMessages < 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm">
                          <div className="flex items-center gap-2">
                            <span>กำลังอ่านข้อมูล</span>
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                            >
                              ✨
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {visibleMessages >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm p-4 max-w-[85%] w-full">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <span className="text-sm font-semibold text-success">อ่านข้อมูลสำเร็จ</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            {[
                              { label: "ร้านค้า", value: "ABC Office" },
                              { label: "วันที่", value: "12/06/2026" },
                              { label: "หมวดหมู่", value: "ค่าอุปกรณ์สำนักงาน" },
                              { label: "ยอดรวม", value: "1,250 บาท", isBold: true },
                            ].map((f) => (
                              <div key={f.label} className="flex justify-between items-center">
                                <span className="text-gray-500">{f.label}</span>
                                <span className={f.isBold ? "font-semibold text-coffee" : "font-medium"}>{f.value}</span>
                              </div>
                            ))}

                            <div className="h-px bg-gray-100 my-2" />

                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">สถานะ</span>
                              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                                ไม่พบใบซ้ำ ✓
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Risk Score</span>
                              <span className="text-xs font-bold text-success">94/100</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            {["บันทึก", "ส่งอนุมัติ", "Export"].map((btn) => (
                              <button
                                key={btn}
                                className={`flex-1 text-[11px] font-semibold py-2 rounded-xl transition-colors ${
                                  btn === "บันทึก"
                                    ? "bg-ai-blue text-white"
                                    : btn === "ส่งอนุมัติ"
                                    ? "bg-coffee/10 text-coffee"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="h-14 bg-white border-t border-gray-100 flex items-center px-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </div>
                    <div className="flex-1 h-9 bg-gray-50 rounded-full px-4 flex items-center">
                      <span className="text-xs text-gray-400">ส่งใบเสร็จหรือสลิป...</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06C755" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-20 h-20 bg-success/10 rounded-full blur-[40px]" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-ai-blue/10 rounded-full blur-[40px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
