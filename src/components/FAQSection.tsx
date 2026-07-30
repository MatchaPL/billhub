"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const faqs = [
  {
    q: "BillHUB ใช้งานยังไง?",
    a: "เพียงเพิ่ม BillHUB เป็นเพื่อนใน LINE แล้วส่งรูปใบเสร็จ สลิปโอนเงิน หรือไฟล์ PDF เข้ามา AI จะอ่านข้อมูล จัดหมวดหมู่ ตรวจซ้ำ และส่งกลับผลลัพธ์ให้ทันที",
  },
  {
    q: "รองรับเอกสารประเภทใดบ้าง?",
    a: "รองรับใบเสร็จรับเงิน ใบกำกับภาษี สลิปโอนเงินจากทุกธนาคาร ไฟล์ PDF และรูปภาพ รวมถึงเอกสารภาษาไทยและอังกฤษ",
  },
  {
    q: "ตรวจจับใบเสร็จซ้ำได้อย่างไร?",
    a: "ระบบใช้ AI เปรียบเทียบทั้งข้อมูลตัวอักษร (ร้านค้า วันที่ ยอดเงิน เลขเอกสาร) และรูปภาพ เพื่อตรวจจับเอกสารที่ถูกส่งซ้ำ แม้จะถ่ายรูปคนละมุมก็ตาม",
  },
  {
    q: "Risk Score คืออะไร?",
    a: "Risk Score คือคะแนนความน่าเชื่อถือของเอกสาร (0-100) โดย AI จะวิเคราะห์ปัจจัยต่างๆ เช่น ยอดเงินผิดปกติ วันที่ไม่สอดคล้อง ข้อมูลไม่ครบ หรือรูปแบบที่น่าสงสัย คะแนนยิ่งสูงยิ่งน่าเชื่อถือ",
  },
  {
    q: "สามารถใช้งานหลายคนในทีมได้ไหม?",
    a: "ได้ ในแพ็กเกจ Business ขึ้นไป รองรับหลายผู้ใช้ มีระบบ Approval Workflow ให้หัวหน้าอนุมัติค่าใช้จ่าย และใช้งานผ่าน LINE Group ได้",
  },
  {
    q: "ข้อมูลปลอดภัยไหม?",
    a: "ข้อมูลทั้งหมดถูกเข้ารหัสทั้งขณะส่งและจัดเก็บ เราไม่แชร์ข้อมูลกับบุคคลที่สาม และปฏิบัติตาม PDPA อย่างเคร่งครัด",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-warm-gray/20 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-base sm:text-lg font-semibold text-foreground pr-8 group-hover:text-coffee transition-colors">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-coffee/5 flex items-center justify-center group-hover:bg-coffee/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#664930" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm sm:text-base leading-relaxed text-taupe max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-taupe bg-taupe/10 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            คำถามที่พบบ่อย
          </h2>
        </motion.div>

        <div className="glass-card p-2 sm:p-4 shadow-lg shadow-black/[0.03]">
          <div className="bg-white rounded-2xl px-6 sm:px-8">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
