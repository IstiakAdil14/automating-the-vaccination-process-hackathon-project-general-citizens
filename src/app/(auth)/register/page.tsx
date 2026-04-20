"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Syringe, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Globe, ArrowLeft, IdCard, FileText } from "lucide-react";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";
import { t, Lang } from "@/lib/i18n";

const DIVISIONS: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Kishoreganj", "Tangail"],
  Chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Feni", "Brahmanbaria", "Rangamati", "Noakhali", "Chandpur", "Lakshmipur", "Khagrachhari", "Bandarban"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Chuadanga", "Jhenaidah", "Kushtia", "Magura", "Meherpur", "Narail"],
  Barisal: ["Barisal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokati", "Barguna"],
  Rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

const STEPS = ["stepIdentity", "stepVerify", "stepProfile", "stepPassword"] as const;

export default function RegisterPage() {
  const [lang, setLang] = useState<Lang>("en");
  const T = t[lang];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Identity
  const [identityType, setIdentityType] = useState<"nid" | "birth_cert">("nid");
  const [nid, setNid] = useState("");
  const [birthCertNumber, setBirthCertNumber] = useState("");
  const [birthCertDob, setBirthCertDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Step 2 — OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpExpiry, setOtpExpiry] = useState(0); // timestamp
  const [countdown, setCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 — Profile
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [village, setVillage] = useState("");

  // Step 4 — Password confirm
  const [confirmPw, setConfirmPw] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = passwordStrength(password);
  const strengthLabels = [T.strengthWeak, T.strengthFair, T.strengthGood, T.strengthStrong];
  const strengthColors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  // OTP countdown timer
  useEffect(() => {
    if (!otpExpiry) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((otpExpiry - Date.now()) / 1000));
      setCountdown(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [otpExpiry]);

  // Resend cooldown timer
  useEffect(() => {
    if (!resendCooldown) return;
    const id = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleOtpInput = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const sendOtp = async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "register" }),
    });
    if (res.ok) {
      setOtpExpiry(Date.now() + 5 * 60 * 1000);
      setResendCooldown(60);
    }
  };

  // Step 1 submit
  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (strength < 2) { setError(T.passwordWeak); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identityType, nid, birthCertNumber, birthCertDob, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const map: Record<string, string> = {
          nid_format: T.nidInvalid, nid_checksum: T.nidChecksumFail, nid_not_found: T.nidNotFound,
          birth_cert_format: T.birthCertInvalid, email_exists: T.emailExists,
        };
        setError(map[data.error] ?? data.error);
        return;
      }
      await sendOtp();
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "otp_expired" ? T.otpExpired : T.otpInvalid);
        return;
      }
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, dateOfBirth: dob, gender, division, district, subDistrict, village }),
      });
      if (!res.ok) { setError((await res.json()).error); return; }
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Step 4 submit — just redirect, password already set
  const handlePasswordConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) { setError(T.passwordMismatch); return; }
    setRedirecting(true);
    setTimeout(() => { window.location.href = "/login"; }, 1500);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    await sendOtp();
  };

  return (
    <>
      <AuthLoadingOverlay variant="signup" visible={redirecting} />
      <div className="min-h-screen flex items-center justify-center p-6 mesh-bg">
      <div className="w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
              <Syringe size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl">Vax<span style={{ color: "var(--accent)" }}>Care</span></span>
          </Link>
          <button
            onClick={() => setLang((l) => l === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ border: "1.5px solid var(--border-strong)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
          >
            <Globe size={13} /> {lang === "en" ? "বাংলা" : "English"}
          </button>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {STEPS.map((key, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={
                      i < step ? { background: "var(--success)", color: "white" }
                      : i === step ? { background: "var(--accent)", color: "white", boxShadow: "0 0 0 3px var(--accent-subtle)" }
                      : { background: "var(--bg-secondary)", color: "var(--text-muted)" }
                    }
                  >
                    {i < step ? <CheckCircle size={13} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {T[key]}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px mx-1" style={{ background: i < step ? "var(--success)" : "var(--border-strong)" }} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          {/* ── Step 0: Identity ── */}
          {step === 0 && (
            <form onSubmit={handleIdentitySubmit} className="space-y-4 animate-fade-up">
              <div className="text-center mb-6">
                <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{T.registerTitle}</h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{T.registerSub}</p>
              </div>

              {/* Identity type toggle */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>{T.identityType}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["nid", "birth_cert"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIdentityType(type)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={identityType === type
                        ? { background: "var(--accent-subtle)", color: "var(--accent)", border: "1.5px solid var(--accent)" }
                        : { background: "var(--surface-raised)", color: "var(--text-secondary)", border: "1.5px solid var(--border-strong)" }}
                    >
                      {type === "nid" ? <IdCard size={15} /> : <FileText size={15} />}
                      {type === "nid" ? T.useNid : T.useBirthCert}
                    </button>
                  ))}
                </div>
              </div>

              {identityType === "nid" ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.nidNumber}</label>
                  <input value={nid} onChange={(e) => setNid(e.target.value)} type="text" placeholder={T.nidPlaceholder} className="input-field" required pattern="\d{10}|\d{17}" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.birthCertNumber}</label>
                    <input value={birthCertNumber} onChange={(e) => setBirthCertNumber(e.target.value)} type="text" placeholder={T.birthCertPlaceholder} className="input-field" required pattern="\d{17}" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.birthCertDob}</label>
                    <input value={birthCertDob} onChange={(e) => setBirthCertDob(e.target.value)} type="date" className="input-field" required />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.emailAddress}</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={T.emailPlaceholder} className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.newPassword}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? "text" : "password"} placeholder={T.passwordPlaceholder} className="input-field pl-10 pr-10" required minLength={8} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength - 1 ? strengthColors[strength - 1] : "var(--border-strong)" }} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColors[strength - 1] ?? "var(--text-muted)" }}>
                      {strength > 0 ? strengthLabels[strength - 1] : ""} — {T.passwordRules}
                    </p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2" style={{ padding: "13px", fontSize: "0.95rem" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{T.continue}</span><ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* ── Step 1: OTP ── */}
          {step === 1 && (
            <form onSubmit={handleOtpSubmit} className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-subtle)" }}>
                  <Shield size={24} color="var(--accent)" />
                </div>
                <h1 className="font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>{T.otpTitle}</h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {T.otpSub} <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
                </p>
                {countdown > 0 && (
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    {T.otpExpiry} {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
                  </p>
                )}
                {countdown === 0 && otpExpiry > 0 && (
                  <p className="text-xs mt-2" style={{ color: "var(--danger)" }}>{T.otpExpired}</p>
                )}
              </div>

              <div className="flex gap-2 justify-center mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl transition-all"
                    style={{
                      border: `2px solid ${digit ? "var(--accent)" : "var(--border-strong)"}`,
                      background: digit ? "var(--accent-subtle)" : "var(--surface-raised)",
                      color: "var(--text-primary)", outline: "none",
                    }}
                  />
                ))}
              </div>

              <button type="submit" disabled={otp.some((d) => !d) || loading} className="btn-primary w-full justify-center" style={{ padding: "13px", fontSize: "0.95rem", opacity: otp.some((d) => !d) ? 0.5 : 1 }}>
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{T.verifyAndContinue}</span><ArrowRight size={16} /></>}
              </button>

              <p className="text-center text-sm mt-4" style={{ color: "var(--text-muted)" }}>
                {resendCooldown > 0
                  ? <span>{T.resendIn} {resendCooldown}s</span>
                  : <button type="button" onClick={handleResend} className="font-semibold" style={{ color: "var(--accent)" }}>{T.resend}</button>
                }
              </p>
            </form>
          )}

          {/* ── Step 2: Profile ── */}
          {step === 2 && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 animate-fade-up">
              <div className="text-center mb-6">
                <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{T.stepProfile}</h1>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.fullName}</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder={T.fullNamePlaceholder} className="input-field" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.dateOfBirth}</label>
                  <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.gender}</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field" required>
                    <option value="">{T.selectGender}</option>
                    <option value="male">{T.male}</option>
                    <option value="female">{T.female}</option>
                    <option value="other">{T.other}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.division}</label>
                  <select value={division} onChange={(e) => { setDivision(e.target.value); setDistrict(""); }} className="input-field" required>
                    <option value="">{T.selectDivision}</option>
                    {Object.keys(DIVISIONS).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.district}</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field" required disabled={!division}>
                    <option value="">{T.selectDistrict}</option>
                    {(DIVISIONS[division] ?? []).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.subDistrict}</label>
                  <input value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)} type="text" placeholder={T.subDistrictPlaceholder} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.village}</label>
                  <input value={village} onChange={(e) => setVillage(e.target.value)} type="text" placeholder={T.villagePlaceholder} className="input-field" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2" style={{ padding: "13px", fontSize: "0.95rem" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{T.continue}</span><ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* ── Step 3: Confirm Password ── */}
          {step === 3 && (
            <form onSubmit={handlePasswordConfirm} className="space-y-4 animate-fade-up">
              <div className="text-center mb-6">
                <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{T.createPassword}</h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{T.createPasswordSub}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.newPassword}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={password} readOnly type={showPw ? "text" : "password"} className="input-field pl-10 pr-10" style={{ opacity: 0.7 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.confirmPassword}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} type={showConfirm ? "text" : "password"} placeholder={T.confirmPasswordPlaceholder} className="input-field pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPw && password !== confirmPw && (
                  <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{T.passwordMismatch}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-2 glow-pulse" style={{ padding: "13px", fontSize: "0.95rem" }}>
                <span>{T.completeRegistration}</span><CheckCircle size={16} />
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          {lang === "en" ? "Already have an account?" : "ইতিমধ্যে অ্যাকাউন্ট আছে?"}{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--accent)" }}>{lang === "en" ? "Sign in" : "প্রবেশ করুন"}</Link>
        </p>
      </div>
    </div>
    </>
  );
}
