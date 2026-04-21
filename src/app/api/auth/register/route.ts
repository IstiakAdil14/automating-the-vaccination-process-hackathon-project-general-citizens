import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { NidRecord } from "@/lib/models/NidRecord";
import { BirthCertRecord } from "@/lib/models/BirthCertRecord";

function validateNid(nid: string): { ok: boolean; error?: string } {
  if (!/^\d{10}$|^\d{17}$/.test(nid)) return { ok: false, error: "nid_format" };
  const sum = nid.split("").reduce((a, d) => a + parseInt(d), 0);
  if (sum === 0) return { ok: false, error: "nid_checksum" };
  return { ok: true };
}

function validateBirthCert(num: string): { ok: boolean; error?: string } {
  if (!/^\d{17}$/.test(num)) return { ok: false, error: "birth_cert_format" };
  return { ok: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identityType, nid, birthCertNumber, birthCertDob, email, password } = body;

    await connectDB();

    // Identity validation
    if (identityType === "nid") {
      const check = validateNid(nid ?? "");
      if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
    } else {
      const check = validateBirthCert(birthCertNumber ?? "");
      if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
      if (!birthCertDob) return NextResponse.json({ error: "birth_cert_dob_required" }, { status: 400 });
    }

    // Email uniqueness — check both finalized and pending
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { pendingEmail: email.toLowerCase() }] });
    if (existing) return NextResponse.json({ error: "email_exists" }, { status: 409 });

    // NID/BirthCert uniqueness
    if (identityType === "nid") {
      const nidExists = await User.findOne({ nid });
      if (nidExists) return NextResponse.json({ error: "nid_exists" }, { status: 409 });

      // Whitelist check — NID must be pre-approved by admin
      const whitelisted = await NidRecord.findOne({ nid });
      if (!whitelisted) return NextResponse.json({ error: "nid_not_approved" }, { status: 403 });
      if (whitelisted.userId) return NextResponse.json({ error: "nid_exists" }, { status: 409 });
    } else {
      const bcExists = await User.findOne({ birthCertNumber });
      if (bcExists) return NextResponse.json({ error: "birth_cert_exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      identityType,
      nid: identityType === "nid" ? nid : undefined,
      birthCertNumber: identityType === "birth_cert" ? birthCertNumber : undefined,
      birthCertDob: identityType === "birth_cert" ? birthCertDob : undefined,
      pendingEmail: email.toLowerCase(),
      passwordHash,
      isVerified: false,
    });

    if (identityType === "nid") {
      await NidRecord.findOneAndUpdate({ nid }, { userId: user._id });
    } else {
      await BirthCertRecord.create({ birthCertNumber, dateOfBirth: birthCertDob, userId: user._id });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
