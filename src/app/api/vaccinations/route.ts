import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vaccination } from "@/lib/models/Vaccination";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const now = new Date();
    const soonThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const records = await Vaccination.find({ userId: auth.user.id })
      .sort({ dueDate: 1 })
      .lean();

    // Recompute status dynamically
    const vaccines = records.map((v) => {
      let status = v.status;
      if (status !== "completed") {
        if (v.dueDate < now)           status = "overdue";
        else if (v.dueDate < soonThreshold) status = "due_soon";
        else                           status = "scheduled";
      }
      return {
        id:            String(v._id),
        vaccine:       v.vaccine,
        doseNumber:    v.doseNumber,
        dueDate:       v.dueDate,
        completedDate: v.completedDate ?? null,
        facility:      v.facility ?? null,
        status,
      };
    });

    return NextResponse.json({ vaccines });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
