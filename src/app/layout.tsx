import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BillHUB — AI Expense Auditor | ตรวจใบเสร็จอัตโนมัติผ่าน LINE",
  description: "AI Expense Auditor ที่ช่วยอ่านใบเสร็จ ตรวจใบซ้ำ วิเคราะห์ความเสี่ยง และจัดการเอกสารค่าใช้จ่ายผ่าน LINE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
