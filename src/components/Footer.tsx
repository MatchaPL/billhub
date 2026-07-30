"use client";

export default function Footer() {
  return (
    <footer className="border-t border-warm-gray/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="font-extrabold text-coffee tracking-tight">BillHUB</span>

          <p className="text-sm text-taupe">
            © 2026 BillHUB. AI Expense Auditor. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-taupe hover:text-coffee transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="text-sm text-taupe hover:text-coffee transition-colors">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
