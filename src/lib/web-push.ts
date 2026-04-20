import webpush from "web-push";

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;
const VAPID_EMAIL   = process.env.VAPID_EMAIL ?? "mailto:admin@vaxcare.app";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.warn("[web-push] VAPID keys not set — push notifications disabled");
} else {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

export { webpush };

export async function sendPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string }
) {
  return webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys:     subscription.keys,
    },
    JSON.stringify(payload)
  );
}
