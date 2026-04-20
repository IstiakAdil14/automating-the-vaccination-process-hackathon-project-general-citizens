import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

const Schema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = Schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "validation_error", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const { currentPassword, newPassword } = parsed.data;

  try {
    await connectDB();
    const user = await User.findById(auth.user.id).select("passwordHash").lean();
    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "wrong_password" }, { status: 401 });

    const hash = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(auth.user.id, { passwordHash: hash });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
