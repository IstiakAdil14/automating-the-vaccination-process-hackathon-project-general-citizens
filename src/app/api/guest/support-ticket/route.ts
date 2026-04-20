import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const ts = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (ts.length >= MAX_REQUESTS) return true;
  rateLimitMap.set(ip, [...ts, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(ip)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.message) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

  // In production: persist to DB / send email
  console.log("[SupportTicket]", { ip, name: body.name ?? "anonymous", email: body.email, message: body.message, ts: new Date().toISOString() });

  return NextResponse.json({ success: true }, { status: 201 });
}
