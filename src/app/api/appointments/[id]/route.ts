import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AppointmentRecord } from "@/lib/models/AppointmentRecord";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  const { id } = await params;

  try {
    await connectDB();

    const appointment = await AppointmentRecord.findOne({ _id: id, userId: auth.user.id });
    if (!appointment) return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (appointment.status === "completed" || appointment.status === "cancelled")
      return NextResponse.json({ error: "cannot_cancel" }, { status: 409 });

    appointment.status = "cancelled";
    await appointment.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
