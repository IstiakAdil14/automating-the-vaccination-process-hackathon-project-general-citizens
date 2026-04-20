import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { PushSubscriptionModel } from "@/lib/models/PushSubscription";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth:   z.string(),
  }),
  preferences: z.object({
    doseReminders:        z.boolean().optional(),
    appointmentReminders: z.boolean().optional(),
    systemAlerts:         z.boolean().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();
    await PushSubscriptionModel.findOneAndUpdate(
      { endpoint: parsed.data.endpoint },
      { userId: auth.user.id, ...parsed.data },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  const { endpoint } = await req.json().catch(() => ({}));
  if (!endpoint) return NextResponse.json({ error: "missing_endpoint" }, { status: 400 });

  try {
    await connectDB();
    await PushSubscriptionModel.deleteOne({ userId: auth.user.id, endpoint });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
