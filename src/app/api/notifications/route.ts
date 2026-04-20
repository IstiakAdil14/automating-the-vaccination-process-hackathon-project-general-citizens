import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: auth.user.id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Notification.countDocuments({ userId: auth.user.id, read: false }),
    ]);

    return NextResponse.json({
      unreadCount,
      notifications: notifications.map((n) => ({
        id:        String(n._id),
        type:      n.type,
        message:   n.message,
        read:      n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// PATCH /api/notifications — mark all as read
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  try {
    await connectDB();
    await Notification.updateMany({ userId: auth.user.id, read: false }, { read: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
