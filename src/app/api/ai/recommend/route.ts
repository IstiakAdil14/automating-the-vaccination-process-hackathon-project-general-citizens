import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vaccination } from "@/lib/models/Vaccination";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

function daysFromNow(date: Date): number {
  return Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const now = new Date();
    const soonThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [vaccinations, nextAppointment] = await Promise.all([
      Vaccination.find({ userId: auth.user.id }).sort({ dueDate: 1 }).lean(),
      AppointmentRecord.findOne({
        userId:   auth.user.id,
        status:   { $in: ["confirmed", "pending"] },
        datetime: { $gte: now },
      }).sort({ datetime: 1 }).lean(),
    ]);

    // Priority 1 — overdue dose
    const overdue = vaccinations.find(
      (v) => v.status !== "completed" && new Date(v.dueDate) < now
    );
    if (overdue) {
      const days = Math.abs(daysFromNow(new Date(overdue.dueDate)));
      return NextResponse.json({
        tip: `⚠️ Your ${overdue.vaccine} (Dose ${overdue.doseNumber}) is overdue by ${days} day${days !== 1 ? "s" : ""}. Book an appointment soon.`,
      });
    }

    // Priority 2 — due within 7 days
    const dueSoon = vaccinations.find(
      (v) => v.status !== "completed" && new Date(v.dueDate) <= soonThreshold && new Date(v.dueDate) >= now
    );
    if (dueSoon) {
      const days = daysFromNow(new Date(dueSoon.dueDate));
      return NextResponse.json({
        tip: `💉 Your ${dueSoon.vaccine} (Dose ${dueSoon.doseNumber}) is due in ${days} day${days !== 1 ? "s" : ""}. Book your slot now.`,
      });
    }

    // Priority 3 — upcoming appointment reminder
    if (nextAppointment) {
      const days = daysFromNow(new Date(nextAppointment.datetime));
      if (days === 0)
        return NextResponse.json({ tip: `📅 You have a ${nextAppointment.vaccine} appointment today at ${nextAppointment.facility}. Don't forget!` });
      if (days <= 3)
        return NextResponse.json({ tip: `📅 Your ${nextAppointment.vaccine} appointment is in ${days} day${days !== 1 ? "s" : ""} at ${nextAppointment.facility}.` });
    }

    // Priority 4 — all complete
    const pending = vaccinations.filter((v) => v.status !== "completed");
    if (pending.length === 0 && vaccinations.length > 0) {
      return NextResponse.json({ tip: "✅ You're fully up to date on all scheduled vaccinations. Great work staying protected!" });
    }

    // Priority 5 — no records yet
    if (vaccinations.length === 0) {
      return NextResponse.json({ tip: "👋 Welcome! Start by booking your first vaccination appointment to stay protected." });
    }

    // Fallback — next scheduled dose
    const next = vaccinations.find((v) => v.status !== "completed");
    if (next) {
      const days = daysFromNow(new Date(next.dueDate));
      return NextResponse.json({
        tip: `💡 Your next scheduled dose is ${next.vaccine} (Dose ${next.doseNumber}) in ${days} day${days !== 1 ? "s" : ""}.`,
      });
    }

    return NextResponse.json({ tip: "💡 Keep your vaccination schedule up to date for the best protection." });
  } catch {
    return NextResponse.json({ tip: "💡 Keep your vaccination schedule up to date for the best protection." });
  }
}
