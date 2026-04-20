import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    await connectDB();

    // Find by email or NID
    const isEmail = identifier.includes("@");
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { nid: identifier }
    );

    if (!user) return NextResponse.json({ error: "invalid_credentials", attemptsLeft: null }, { status: 401 });

    // Check lock
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      return NextResponse.json({
        error: "account_locked",
        lockedUntil: user.lockedUntil,
      }, { status: 403 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "not_verified" }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
        user.failedLoginAttempts = 0;
        await user.save();
        return NextResponse.json({ error: "account_locked", lockedUntil: user.lockedUntil }, { status: 403 });
      }
      await user.save();
      return NextResponse.json({
        error: "invalid_credentials",
        attemptsLeft: MAX_ATTEMPTS - user.failedLoginAttempts,
      }, { status: 401 });
    }

    // Success — reset attempts
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    const userId = String(user._id);
    const res = NextResponse.json({
      success: true,
      user: {
        id: userId,
        fullName: user.fullName,
        email: user.email,
        language: user.language,
      },
    });

    res.cookies.set("vaxcare_session", userId, {
      httpOnly: true,
      sameSite: "lax",
      path:     "/",
      maxAge:   60 * 60 * 24 * 30, // 30 days
      secure:   process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
