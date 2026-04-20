import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { Notification } from "@/lib/models/Notification";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

const BookSchema = z.object({
  vaccine:         z.string().min(2).max(100),
  doseNumber:      z.number().int().min(1).max(10),
  facility:        z.string().min(2).max(200),
  facilityAddress: z.string().max(300).optional(),
  datetime:        z.string().datetime(),
  googleMapsLink:  z.string().url().optional(),
  notes:           z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = BookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { vaccine, doseNumber, facility, facilityAddress, datetime, googleMapsLink, notes } =
    parsed.data;

  try {
    await connectDB();

    // Prevent duplicate booking for same vaccine+dose
    const existing = await AppointmentRecord.findOne({
      userId:     auth.user.id,
      vaccine,
      doseNumber,
      status:     { $in: ["confirmed", "pending"] },
    });
    if (existing) {
      return NextResponse.json({ error: "duplicate_booking" }, { status: 409 });
    }

    const appointment = await AppointmentRecord.create({
      userId: auth.user.id,
      vaccine,
      doseNumber,
      facility,
      facilityAddress: facilityAddress ?? "",
      datetime:        new Date(datetime),
      status:          "confirmed",
      googleMapsLink,
      notes,
    });

    // Create in-app notification
    await Notification.create({
      userId:  auth.user.id,
      type:    "appointment_confirmed",
      message: `Your ${vaccine} (Dose ${doseNumber}) appointment at ${facility} is confirmed.`,
    });

    return NextResponse.json({ appointment: { id: String(appointment._id), ...parsed.data } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
