import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  language: string;
}

/**
 * Reads the vaxcare_session cookie (set at login) and returns the user.
 * Returns a 401 NextResponse if unauthenticated.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  // Support both cookie-based session and Authorization: Bearer <userId>
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("vaxcare_session")?.value;
  const bearerHeader  = req.headers.get("authorization")?.replace("Bearer ", "");
  const userId        = sessionCookie ?? bearerHeader;

  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(userId).select("fullName email language").lean();
    if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    return {
      user: {
        id:       String(user._id),
        fullName: user.fullName,
        email:    user.email ?? "",
        language: user.language,
      },
    };
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/** Type-guard: true when requireAuth returned a user, not a response */
export function isAuthUser(
  result: { user: AuthUser } | NextResponse
): result is { user: AuthUser } {
  return "user" in result;
}
