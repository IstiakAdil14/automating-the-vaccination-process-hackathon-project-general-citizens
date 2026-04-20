import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vaccination } from "@/lib/models/Vaccination";
import { User } from "@/lib/models/User";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const [user, records] = await Promise.all([
      User.findById(auth.user.id)
        .select("fullName nid birthCertNumber identityType dateOfBirth createdAt")
        .lean(),
      Vaccination.find({ userId: auth.user.id })
        .sort({ completedDate: 1 })
        .lean(),
    ]);

    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const completed = records.filter((v) => v.status === "completed");

    // Group by vaccine name for summary
    const summaryMap = new Map<string, { given: number; total: number }>();
    records.forEach((v) => {
      const existing = summaryMap.get(v.vaccine) ?? { given: 0, total: 0 };
      existing.total = Math.max(existing.total, v.doseNumber);
      if (v.status === "completed") existing.given += 1;
      summaryMap.set(v.vaccine, existing);
    });

    const identityDisplay =
      user.identityType === "nid"
        ? `NID: ****-****-${(user.nid ?? "").slice(-4)}`
        : `Birth Cert: ****${(user.birthCertNumber ?? "").slice(-4)}`;

    const initials = (user.fullName ?? "?")
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    // Deterministic certificate ID from userId
    const certId = `VAXCARE-${initials}-${new Date(user.createdAt).getFullYear()}-${auth.user.id.slice(-6).toUpperCase()}`;

    return NextResponse.json({
      profile: {
        fullName:        user.fullName,
        initials,
        identityDisplay,
        dateOfBirth:     user.dateOfBirth ?? "",
        totalDoses:      completed.length,
        isFullyVaccinated: completed.length > 0,
        certId,
        issuedYear:      new Date().getFullYear(),
      },
      history: completed.map((v) => ({
        id:            String(v._id),
        vaccine:       v.vaccine,
        dose:          `Dose ${v.doseNumber}`,
        date:          v.completedDate
          ? new Date(v.completedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : "—",
        facility:      v.facility ?? "—",
      })),
      summary: Array.from(summaryMap.entries()).map(([vaccine, { given, total }]) => ({
        vaccine,
        given,
        total,
        complete: given >= total && total > 0,
      })),
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
