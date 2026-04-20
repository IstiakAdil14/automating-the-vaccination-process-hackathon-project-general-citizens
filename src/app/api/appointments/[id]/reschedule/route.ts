import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

const RescheduleSchema = z.object({
  datetime: z.string().datetime(),
  notes:    z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = RescheduleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    const appointment = await AppointmentRecord.findOne({
      _id:    id,
      userId: auth.user.id,
    });

    if (!appointment) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (appointment.status === "completed" || appointment.status === "cancelled") {
      return NextResponse.json({ error: "cannot_reschedule" }, { status: 409 });
    }

    appointment.datetime = new Date(parsed.data.datetime);
    appointment.status   = "rescheduled";
    if (parsed.data.notes) appointment.notes = parsed.data.notes;
    await appointment.save();

    return NextResponse.json({ success: true, datetime: appointment.datetime });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
