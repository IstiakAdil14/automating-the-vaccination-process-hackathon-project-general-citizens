import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp, newPassword } = body;

    await connectDB();

    // Step 1: send OTP
    if (action === "send") {
      const user = await User.findOne({ email: email.toLowerCase() });
      // Always return success to prevent email enumeration
      if (!user) return NextResponse.json({ success: true });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = await bcrypt.hash(code, 10);
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      user.otpType = "forgot_password";
      await user.save();
      await sendOtpEmail(email, code);
      return NextResponse.json({ success: true });
    }

    // Step 2: verify OTP
    if (action === "verify") {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.otp || !user.otpExpiry) {
        return NextResponse.json({ error: "otp_not_found" }, { status: 400 });
      }
      if (new Date() > user.otpExpiry) {
        return NextResponse.json({ error: "otp_expired" }, { status: 400 });
      }
      const valid = await bcrypt.compare(otp, user.otp);
      if (!valid) return NextResponse.json({ error: "otp_invalid" }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    // Step 3: reset password
    if (action === "reset") {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.otp || !user.otpExpiry) {
        return NextResponse.json({ error: "otp_not_found" }, { status: 400 });
      }
      if (new Date() > user.otpExpiry) {
        return NextResponse.json({ error: "otp_expired" }, { status: 400 });
      }
      const valid = await bcrypt.compare(otp, user.otp);
      if (!valid) return NextResponse.json({ error: "otp_invalid" }, { status: 400 });

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpType = undefined;
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      await user.save();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
