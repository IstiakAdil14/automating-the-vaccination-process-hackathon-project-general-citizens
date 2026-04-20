import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  // In production: query DB aggregates
  const stats = {
    dosesAdministered: 142_800_000,
    registeredCitizens: 68_400_000,
    activeCenters: 14_320,
    divisionsCovered: 8,
    targetPopulation: 170_000_000,
    vaccinatedPopulation: 119_000_000,
    coveragePercent: 70,
    lastUpdated: new Date().toISOString(),
  };
  return NextResponse.json(stats);
}
