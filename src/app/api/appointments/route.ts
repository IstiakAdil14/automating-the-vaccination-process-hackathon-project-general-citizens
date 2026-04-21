import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const records = await AppointmentRecord.find({ userId: auth.user.id })
      .sort({ datetime: -1 })
      .lean();

    const appointments = records.map((a) => {
      const dt = new Date(a.datetime);
      return {
        id:              String(a._id),
        vaccine:         a.vaccine,
        doseNumber:      a.doseNumber,
        date:            dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        time:            dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        datetime:        a.datetime,
        facility:        a.facility,
        facilityAddress: a.facilityAddress ?? "",
        status:          a.status,
        googleMapsLink:  a.googleMapsLink ?? null,
        notes:           a.notes ?? null,
      };
    });

    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
