import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { FamilyGroup } from "@/lib/models/FamilyGroup";
import { Vaccination } from "@/lib/models/Vaccination";
import { User } from "@/lib/models/User";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const group = await FamilyGroup.findOne({ ownerId: auth.user.id }).lean();

    const memberIds = [
      auth.user.id,
      ...(group?.members.map((m) => String(m.userId)) ?? []),
    ];
    const relations: Record<string, string> = { [auth.user.id]: "Self" };
    group?.members.forEach((m) => { relations[String(m.userId)] = m.relation; });

    const users = await User.find({ _id: { $in: memberIds } })
      .select("fullName dateOfBirth")
      .lean();

    const now = new Date();

    const members = await Promise.all(
      users.map(async (u) => {
        const uid = String(u._id);
        const vaccinations = await Vaccination.find({ userId: uid }).lean();
        const total     = vaccinations.length;
        const completed = vaccinations.filter((v) => v.status === "completed").length;
        const progress  = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Next pending due date
        const pending = vaccinations
          .filter((v) => v.status !== "completed" && v.dueDate)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        const nextDue = pending[0]?.dueDate
          ? new Date(pending[0].dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : null;

        // Age from dateOfBirth (stored as "YYYY-MM-DD" string)
        let age: number | null = null;
        if (u.dateOfBirth) {
          const dob = new Date(u.dateOfBirth);
          if (!isNaN(dob.getTime())) {
            age = now.getFullYear() - dob.getFullYear();
            const m = now.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
          }
        }

        const status = total === 0 ? "none" : completed >= total ? "complete" : "partial";

        return {
          id:            uid,
          name:          u.fullName || "Member",
          relation:      relations[uid] ?? "Family",
          age,
          progress,
          vaccinesGiven: completed,
          vaccinesTotal: total,
          nextDue,
          status,
        };
      })
    );

    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

const AddSchema = z.object({
  nid:             z.string().min(4).optional(),
  birthCertNumber: z.string().min(4).optional(),
  relation:        z.string().min(2).max(50),
}).refine((d) => d.nid || d.birthCertNumber, { message: "nid or birthCertNumber required" });

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = AddSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "validation_error", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const { nid, birthCertNumber, relation } = parsed.data;

  try {
    await connectDB();

    // Find the user to add
    const query = nid ? { nid } : { birthCertNumber };
    const target = await User.findOne(query).select("_id").lean();
    if (!target) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

    const targetId = String(target._id);
    if (targetId === auth.user.id)
      return NextResponse.json({ error: "cannot_add_self" }, { status: 409 });

    // Upsert family group
    const group = await FamilyGroup.findOne({ ownerId: auth.user.id });
    if (group) {
      const alreadyAdded = group.members.some((m) => String(m.userId) === targetId);
      if (alreadyAdded) return NextResponse.json({ error: "already_member" }, { status: 409 });
      group.members.push({ userId: target._id as never, relation, addedAt: new Date() });
      await group.save();
    } else {
      await FamilyGroup.create({
        ownerId: auth.user.id,
        members: [{ userId: target._id, relation, addedAt: new Date() }],
      });
    }

    return NextResponse.json({ success: true, memberId: targetId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
