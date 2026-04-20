import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const appointment = await AppointmentRecord.findOne({
      userId:   auth.user.id,
      status:   { $in: ["confirmed", "pending"] },
      datetime: { $gte: new Date() },
    })
      .sort({ datetime: 1 })
      .lean();

    if (!appointment) {
      return NextResponse.json({ appointment: null });
    }

    const dt = new Date(appointment.datetime);
    const date = dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    return NextResponse.json({
      appointment: {
        id:            String(appointment._id),
        vaccineName:   appointment.vaccine,
        doseNumber:    `Dose ${appointment.doseNumber}`,
        date,
        time,
        centerName:    appointment.facility,
        centerAddress: appointment.facilityAddress ?? "",
        status:        appointment.status,
        mapsUrl:       appointment.googleMapsLink ?? `https://maps.google.com/?q=${encodeURIComponent(appointment.facility)}`,
        notes:         appointment.notes ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
