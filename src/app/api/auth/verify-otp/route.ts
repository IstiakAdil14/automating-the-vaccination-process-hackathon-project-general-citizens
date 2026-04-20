import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { pendingEmail: email.toLowerCase() }],
    });
    if (!user || !user.otp || !user.otpExpiry) {
      return NextResponse.json({ error: "otp_not_found" }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "otp_expired" }, { status: 400 });
    }

    const valid = await bcrypt.compare(otp, user.otp);
    if (!valid) return NextResponse.json({ error: "otp_invalid" }, { status: 400 });

    // Clear OTP and mark verified if registering
    user.otp = undefined;
    user.otpExpiry = undefined;
    if (user.otpType === "register") user.isVerified = true;
    user.otpType = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
