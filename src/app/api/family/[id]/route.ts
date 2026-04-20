import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FamilyGroup } from "@/lib/models/FamilyGroup";
import { requireAuth, isAuthUser } from "@/lib/auth-middleware";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!isAuthUser(auth)) return auth;

  const { id } = await params;

  if (id === auth.user.id)
    return NextResponse.json({ error: "cannot_remove_self" }, { status: 409 });

  try {
    await connectDB();

    const group = await FamilyGroup.findOne({ ownerId: auth.user.id });
    if (!group) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const before = group.members.length;
    group.members = group.members.filter((m) => String(m.userId) !== id) as typeof group.members;
    if (group.members.length === before)
      return NextResponse.json({ error: "not_found" }, { status: 404 });

    await group.save();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
