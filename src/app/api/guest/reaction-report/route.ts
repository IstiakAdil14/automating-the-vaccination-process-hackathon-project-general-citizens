import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter: ip → [timestamps]
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) return true;
  rateLimitMap.set(ip, [...timestamps, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.phone || !body.vaccine || !body.description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // In production: persist to DB or send to MoH webhook
  console.log("[ReactionReport]", {
    ip,
    name: body.name ?? "anonymous",
    phone: body.phone,
    vaccine: body.vaccine,
    description: body.description,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
