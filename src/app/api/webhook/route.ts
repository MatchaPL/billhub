import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { messagingApi, webhook } from "@line/bot-sdk";
import type { Readable } from "stream";
import { supabase } from "@/lib/supabase";
import { extractReceiptData } from "@/lib/ocr";

const channelSecret = process.env.LINE_CHANNEL_SECRET || "";
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";

const client = new messagingApi.MessagingApiClient({ channelAccessToken });
const blobClient = new messagingApi.MessagingApiBlobClient({ channelAccessToken });

function validateSignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

async function getOrCreateUser(lineUserId: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("line_user_id", lineUserId)
    .single();

  if (existing) return existing;

  let displayName = "";
  let pictureUrl = "";
  try {
    const profile = await client.getProfile(lineUserId);
    displayName = profile.displayName;
    pictureUrl = profile.pictureUrl || "";
  } catch {
    // profile fetch failed, continue without it
  }

  const { data: newUser } = await supabase
    .from("users")
    .insert({
      line_user_id: lineUserId,
      display_name: displayName,
      picture_url: pictureUrl,
      registered: false,
    })
    .select()
    .single();

  return newUser;
}

async function handleFollow(event: webhook.FollowEvent) {
  if (!event.source || !("userId" in event.source) || !event.source.userId) return;

  const user = await getOrCreateUser(event.source.userId);

  const liffUrl = liffId ? `https://liff.line.me/${liffId}` : "";

  const messages: messagingApi.Message[] = [
    {
      type: "text",
      text: `สวัสดีครับ! ยินดีต้อนรับสู่ BillHUB 🎉\n\nผมคือ AI Expense Auditor ที่ช่วยคุณ:\n📄 อ่านใบเสร็จอัตโนมัติ\n🔍 ตรวจจับใบเสร็จซ้ำ\n📊 วิเคราะห์ความเสี่ยง\n📋 Export ข้อมูลไป Sheets/Drive`,
    },
  ];

  if (liffUrl) {
    messages.push({
      type: "template",
      altText: "กดเพื่อเริ่มใช้งาน BillHUB",
      template: {
        type: "buttons",
        title: "เริ่มต้นใช้งาน",
        text: "ลงทะเบียนธุรกิจเพื่อเริ่มส่งใบเสร็จ\nเพียง 2 ขั้นตอนง่ายๆ",
        actions: [
          {
            type: "uri",
            label: "ลงทะเบียนเลย",
            uri: liffUrl,
          },
        ],
      },
    });
  } else {
    messages.push({
      type: "text",
      text: `เริ่มต้นง่ายๆ:\n1️⃣ พิมพ์ "ลงทะเบียน" ตั้งค่าธุรกิจ\n2️⃣ ถ่ายรูปใบเสร็จ แล้วส่งมา\n3️⃣ หรือส่งไฟล์ PDF`,
    });
  }

  await client.replyMessage({
    replyToken: event.replyToken!,
    messages,
  });
}

async function handleMessage(event: webhook.MessageEvent) {
  if (!event.source || !("userId" in event.source) || !event.source.userId || !event.replyToken) return;

  const user = await getOrCreateUser(event.source.userId);
  const msg = event.message;

  if (msg.type === "text") {
    const text = (msg as webhook.TextMessageContent).text.trim();

    if (text === "ลงทะเบียน" || text === "สมัคร" || text === "register") {
      if (user?.registered) {
        const { data: biz } = await supabase
          .from("businesses")
          .select("name")
          .eq("user_id", user.id)
          .single();

        await client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `คุณลงทะเบียนแล้วครับ ✅\n\nธุรกิจ: ${biz?.name || "-"}\n\nพิมพ์ "สถานะ" เพื่อดูข้อมูลบัญชี\nหรือส่งใบเสร็จมาได้เลย!`,
            },
          ],
        });
        return;
      }

      const liffUrl = liffId
        ? `https://liff.line.me/${liffId}`
        : "";

      if (liffUrl) {
        await client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "template",
              altText: "ลงทะเบียน BillHUB — กดลิงก์เพื่อเริ่มต้น",
              template: {
                type: "buttons",
                title: "ลงทะเบียน BillHUB",
                text: "กรอกข้อมูลธุรกิจเพื่อเริ่มใช้งาน\nเพียง 2 ขั้นตอนง่ายๆ",
                actions: [
                  {
                    type: "uri",
                    label: "เริ่มลงทะเบียน",
                    uri: liffUrl,
                  },
                ],
              },
            },
          ],
        });
      } else {
        await client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `📝 ลงทะเบียนธุรกิจ\n\nกรุณาพิมพ์ข้อมูลธุรกิจในรูปแบบนี้:\n\nชื่อธุรกิจ: [ชื่อบริษัท]\nเลขภาษี: [เลข 13 หลัก]\nอีเมล: [อีเมล]\n\nตัวอย่าง:\nชื่อธุรกิจ: บริษัท ABC จำกัด\nเลขภาษี: 0123456789012\nอีเมล: acc@abc.co.th`,
            },
          ],
        });
      }
      return;
    }

    if (text.includes("ชื่อธุรกิจ:")) {
      const nameMatch = text.match(/ชื่อธุรกิจ:\s*(.+)/);
      const taxMatch = text.match(/เลขภาษี:\s*(\d+)/);
      const emailMatch = text.match(/อีเมล:\s*(\S+)/);

      if (nameMatch && user) {
        const { error } = await supabase.from("businesses").insert({
          user_id: user.id,
          name: nameMatch[1].trim(),
          tax_id: taxMatch?.[1] || null,
          email: emailMatch?.[1] || null,
        });

        if (!error) {
          await supabase
            .from("users")
            .update({ registered: true })
            .eq("id", user.id);

          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "text",
                text: `✅ ลงทะเบียนสำเร็จ!\n\nธุรกิจ: ${nameMatch[1].trim()}\n${taxMatch ? `เลขภาษี: ${taxMatch[1]}` : ""}\n${emailMatch ? `อีเมล: ${emailMatch[1]}` : ""}\n\nตอนนี้คุณสามารถส่งใบเสร็จมาได้เลย!\nผมจะอ่านข้อมูลและบันทึกให้อัตโนมัติ 🚀`,
              },
            ],
          });
          return;
        }
      }
    }

    if (text === "สถานะ" || text === "status") {
      const { data: biz } = await supabase
        .from("businesses")
        .select("name, tax_id, email")
        .eq("user_id", user?.id)
        .single();

      const { count } = await supabase
        .from("receipts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: `📊 สถานะบัญชี BillHUB\n\n👤 ${user?.display_name || "-"}\n🏢 ${biz?.name || "ยังไม่ลงทะเบียน"}\n${biz?.tax_id ? `🔢 ${biz.tax_id}` : ""}\n📄 ใบเสร็จทั้งหมด: ${count || 0} ใบ\n\n${!biz ? 'พิมพ์ "ลงทะเบียน" เพื่อเริ่มต้น' : "ส่งใบเสร็จมาได้เลย!"}`,
          },
        ],
      });
      return;
    }

    if (text === "ช่วยเหลือ" || text === "help" || text === "เมนู") {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: `📋 คำสั่ง BillHUB\n\n📸 ส่งรูปใบเสร็จ — บันทึกค่าใช้จ่าย\n📎 ส่งไฟล์ PDF — อ่านเอกสาร\n\n💬 คำสั่งพิมพ์:\n• "ลงทะเบียน" — ตั้งค่าธุรกิจ\n• "สถานะ" — ดูข้อมูลบัญชี\n• "ช่วยเหลือ" — เมนูนี้`,
          },
        ],
      });
      return;
    }

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: `ได้รับข้อความ: "${text}"\n\n💡 ส่งรูปใบเสร็จหรือสลิปมาได้เลย\nหรือพิมพ์ "ช่วยเหลือ" เพื่อดูคำสั่งทั้งหมด`,
        },
      ],
    });
    return;
  }

  if (msg.type === "image") {
    if (!user?.registered) {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: "text", text: `กรุณาลงทะเบียนก่อนนะครับ\nพิมพ์ "ลงทะเบียน" เพื่อเริ่มต้น` }],
      });
      return;
    }

    // Reply immediately to avoid timeout
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: "text", text: `📄 ได้รับรูปแล้ว! กำลังอ่านข้อมูล OCR...\n⏳ รอสักครู่นะครับ` }],
    });

    // Download image from LINE
    const imageStream = await blobClient.getMessageContent(msg.id) as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of imageStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const imageBuffer = Buffer.concat(chunks);

    // Run OCR
    let ocrResult;
    let ocrError = "";
    try {
      ocrResult = await extractReceiptData(imageBuffer);
    } catch (e) {
      ocrError = e instanceof Error ? e.message : String(e);
      console.error("OCR error:", ocrError);
    }

    // Check for duplicate (same store + amount + date)
    let isDuplicate = false;
    let duplicateOf = null;
    if (ocrResult?.amount && ocrResult?.receiptDate) {
      const { data: existing } = await supabase
        .from("receipts")
        .select("id")
        .eq("user_id", user.id)
        .eq("amount", ocrResult.amount)
        .eq("receipt_date", ocrResult.receiptDate)
        .limit(1)
        .single();
      if (existing) {
        isDuplicate = true;
        duplicateOf = existing.id;
      }
    }

    // Risk score (simple heuristic)
    let riskScore = 0;
    const riskFlags: string[] = [];
    if (isDuplicate) { riskScore += 50; riskFlags.push("ใบเสร็จซ้ำ"); }
    if (ocrResult?.amount && ocrResult.amount > 50000) { riskScore += 20; riskFlags.push("ยอดสูงผิดปกติ"); }
    if (!ocrResult?.documentNumber) { riskScore += 10; riskFlags.push("ไม่มีเลขที่เอกสาร"); }
    if (!ocrResult?.receiptDate) { riskScore += 10; riskFlags.push("ไม่มีวันที่"); }

    // Get business
    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data: receipt } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        business_id: biz?.id || null,
        store_name: ocrResult?.storeName || null,
        receipt_date: ocrResult?.receiptDate || null,
        amount: ocrResult?.amount || null,
        tax_amount: ocrResult?.taxAmount || null,
        document_number: ocrResult?.documentNumber || null,
        category: ocrResult?.category || null,
        ocr_raw_text: ocrResult?.rawText || null,
        ocr_confidence: ocrResult?.confidence || null,
        is_duplicate: isDuplicate,
        duplicate_of: duplicateOf,
        risk_score: riskScore,
        risk_flags: riskFlags,
        status: "pending",
      })
      .select()
      .single();

    // Build reply message
    const riskEmoji = riskScore >= 50 ? "🔴" : riskScore >= 20 ? "🟡" : "🟢";
    let replyText = `✅ บันทึกค่าใช้จ่ายสำเร็จ\n`;
    replyText += `\n🆔 Receipt #${receipt?.id?.slice(0, 8)}`;
    if (ocrResult?.storeName) replyText += `\n🏪 ร้านค้า: ${ocrResult.storeName}`;
    if (ocrResult?.receiptDate) replyText += `\n📅 วันที่: ${ocrResult.receiptDate}`;
    if (ocrResult?.amount) replyText += `\n💰 ยอดเงิน: ${ocrResult.amount.toLocaleString()} บาท`;
    if (ocrResult?.taxAmount) replyText += `\n🧾 ภาษี: ${ocrResult.taxAmount.toLocaleString()} บาท`;
    if (ocrResult?.category) replyText += `\n📂 หมวดหมู่: ${ocrResult.category}`;
    if (ocrResult?.documentNumber) replyText += `\n📋 เลขที่: ${ocrResult.documentNumber}`;
    replyText += `\n\n${riskEmoji} Risk Score: ${riskScore}/100`;
    if (riskFlags.length > 0) replyText += `\n⚠️ ${riskFlags.join(", ")}`;
    if (isDuplicate) replyText += `\n\n⚠️ ตรวจพบใบเสร็จซ้ำ!`;
    if (ocrError) replyText += `\n\n🔧 OCR Error: ${ocrError.slice(0, 200)}`;

    await client.pushMessage({
      to: event.source.userId!,
      messages: [{ type: "text", text: replyText }],
    });
    return;
  }

  if (msg.type === "file") {
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: `📎 ได้รับไฟล์แล้ว!\n\n⏳ ระบบอ่าน PDF กำลังพัฒนา\nเร็วๆ นี้จะรองรับ:\n• ใบกำกับภาษี PDF\n• ใบเสร็จอิเล็กทรอนิกส์\n• เอกสารค่าใช้จ่ายต่างๆ`,
        },
      ],
    });
    return;
  }
}

async function handleEvent(event: webhook.Event) {
  if (event.type === "follow") {
    await handleFollow(event as webhook.FollowEvent);
    return;
  }

  if (event.type === "message") {
    await handleMessage(event as webhook.MessageEvent);
    return;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  if (!validateSignature(body, signature)) {
    console.error("Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed = JSON.parse(body);
  const events: webhook.Event[] = parsed.events;

  await Promise.all(events.map(handleEvent));

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({ status: "BillHUB webhook is running" });
}
