import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vaccination } from "@/lib/models/Vaccination";
import { PushSubscriptionModel } from "@/lib/models/PushSubscription";
import { Notification } from "@/lib/models/Notification";
import { sendPush } from "@/lib/web-push";

// Vercel Cron: runs daily at 08:00 UTC
// vercel.json: { "crons": [{ "path": "/api/push/cron", "schedule": "0 8 * * *" }] }
export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const now  = new Date();
    const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find all vaccinations due within 7 days that are not completed
    const dueSoon = await Vaccination.find({
      status:  { $in: ["scheduled", "due_soon"] },
      dueDate: { $gte: now, $lte: in7d },
    }).lean();

    let sent = 0;
    let failed = 0;

    for (const vax of dueSoon) {
      const daysLeft = Math.ceil(
        (vax.dueDate.getTime() - now.getTime()) / 86_400_000
      );
      const message = `💉 ${vax.vaccine} Dose ${vax.doseNumber} is due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

      // Get all push subscriptions for this user
      const subs = await PushSubscriptionModel.find({
        userId:                       vax.userId,
        "preferences.doseReminders":  { $ne: false },
      }).lean();

      for (const sub of subs) {
        try {
          await sendPush(
            { endpoint: sub.endpoint, keys: sub.keys },
            { title: "VaxCare Reminder", body: message, url: "/dashboard" }
          );
          sent++;
        } catch {
          // Subscription expired — remove it
          await PushSubscriptionModel.deleteOne({ _id: sub._id });
          failed++;
        }
      }

      // Also create in-app notification (deduplicate by checking today)
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const exists = await Notification.findOne({
        userId:    vax.userId,
        type:      "dose_reminder",
        message,
        createdAt: { $gte: todayStart },
      });
      if (!exists) {
        await Notification.create({ userId: vax.userId, type: "dose_reminder", message });
      }
    }

    return NextResponse.json({ processed: dueSoon.length, sent, failed });
  } catch (err) {
    console.error("[cron] push failed:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
