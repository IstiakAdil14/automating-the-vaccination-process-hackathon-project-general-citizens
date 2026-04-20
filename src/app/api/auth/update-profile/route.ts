import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, dateOfBirth, gender, division, district, subDistrict, village } = await req.json();
    if (!email) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { pendingEmail: email.toLowerCase() }],
    });
    if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    if (!user.isVerified) return NextResponse.json({ error: "not_verified" }, { status: 403 });

    user.fullName = fullName;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.division = division;
    user.district = district;
    user.subDistrict = subDistrict;
    user.village = village;

    // Finalize email
    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
