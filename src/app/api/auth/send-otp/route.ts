import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();
    if (!email || !type) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { pendingEmail: email.toLowerCase() }],
    });
    if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otpHash;
    user.otpExpiry = otpExpiry;
    user.otpType = type;
    await user.save();

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
