import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

// HEAD — lightweight auth check used by the client layout guard
export async function HEAD(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return new Response(null, { status: 401 });
  return new Response(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();
    const user = await User.findById(auth.user.id)
      .select("fullName email pendingEmail nid birthCertNumber identityType dateOfBirth gender division district subDistrict village language isVerified createdAt")
      .lean();

    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const initials = (user.fullName ?? "?")
      .split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

    const identityDisplay =
      user.identityType === "nid"
        ? `NID: ****-****-${(user.nid ?? "").slice(-4)}`
        : `Birth Cert: ****${(user.birthCertNumber ?? "").slice(-4)}`;

    const memberSince = new Date(user.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

    return NextResponse.json({
      profile: {
        fullName:        user.fullName ?? "",
        email:           user.email ?? user.pendingEmail ?? "",
        initials,
        identityDisplay,
        dateOfBirth:     user.dateOfBirth ?? "",
        gender:          user.gender ?? "",
        division:        user.division ?? "",
        district:        user.district ?? "",
        subDistrict:     user.subDistrict ?? "",
        village:         user.village ?? "",
        language:        user.language ?? "en",
        isVerified:      user.isVerified,
        memberSince,
      },
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

const UpdateSchema = z.object({
  fullName:    z.string().min(2).max(100),
  dateOfBirth: z.string().optional(),
  gender:      z.enum(["male", "female", "other", ""]).optional(),
  division:    z.string().max(100).optional(),
  district:    z.string().max(100).optional(),
  subDistrict: z.string().max(100).optional(),
  village:     z.string().max(100).optional(),
  language:    z.enum(["en", "bn"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "validation_error", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  try {
    await connectDB();
    await User.findByIdAndUpdate(auth.user.id, { $set: parsed.data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
