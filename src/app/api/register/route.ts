import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      lineUserId,
      displayName,
      pictureUrl,
      firstName,
      lastName,
      businessType,
      businessNameTh,
      businessNameEn,
      branchType,
      branchNumber,
      taxId,
      address,
      email,
      phone,
    } = body;

    if (!lineUserId || !firstName || !businessNameTh || !taxId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" },
        { status: 400 }
      );
    }

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("line_user_id", lineUserId)
      .single();

    if (!user) {
      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert({
          line_user_id: lineUserId,
          display_name: displayName || firstName,
          picture_url: pictureUrl || "",
          registered: false,
        })
        .select()
        .single();

      if (userErr) {
        return NextResponse.json({ error: userErr.message }, { status: 500 });
      }
      user = newUser;
    }

    const { data: existingBiz } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingBiz) {
      return NextResponse.json(
        { error: "คุณลงทะเบียนธุรกิจแล้ว" },
        { status: 409 }
      );
    }

    const businessName = businessNameEn
      ? `${businessNameTh} (${businessNameEn})`
      : businessNameTh;

    const addressFull = [
      address,
      branchType === "สาขา" && branchNumber ? `สาขา ${branchNumber}` : branchType,
      businessType,
    ]
      .filter(Boolean)
      .join(" | ");

    const { error: bizErr } = await supabase.from("businesses").insert({
      user_id: user.id,
      name: businessName,
      tax_id: taxId,
      address: addressFull,
      email: email || null,
    });

    if (bizErr) {
      return NextResponse.json({ error: bizErr.message }, { status: 500 });
    }

    await supabase
      .from("users")
      .update({
        registered: true,
        display_name: `${firstName} ${lastName}`.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
