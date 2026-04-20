import { NextResponse } from "next/server";
import { mockCenters } from "../../route";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const center = mockCenters.find((c) => c.id === id);
  if (!center) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Simulate slight real-time variance
  const variance = Math.floor(Math.random() * 3) - 1;
  const slots = Math.max(0, center.slotsAvailable + variance);

  return NextResponse.json({
    id,
    slotsAvailable: slots,
    totalCapacity: center.totalCapacity,
    nextAvailableSlot: center.nextAvailableSlot,
    updatedAt: new Date().toISOString(),
  });
}
