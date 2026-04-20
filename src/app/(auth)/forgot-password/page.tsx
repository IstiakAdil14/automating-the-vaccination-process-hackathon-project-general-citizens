"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Syringe, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, CheckCircle, Globe } from "lucide-react";
import { t, Lang } from "@/lib/i18n";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";

function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

export default function ForgotPasswordPage() {
  const [lang, setLang] = useState<Lang>("en");
  const T = t[lang];

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0=email, 1=otp, 2=new pw, 3=success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const strength = passwordStrength(newPassword);
  const strengthColors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const strengthLabels = [T.strengthWeak, T.strengthFair, T.strengthGood, T.strengthStrong];

  useEffect(() => {
    if (!otpExpiry) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((otpExpiry - Date.now()) / 1000));
      setCountdown(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [otpExpiry]);

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

  const sendOtp = async (emailAddr: string) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", email: emailAddr }),
    });
    if (res.ok) {
      setOtpExpiry(Date.now() + 5 * 60 * 1000);
      setResendCooldown(60);
    }
  };

  // Step 0: send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOtp(email);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp: otp.join("") }),
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

  // Step 2: reset password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPw) { setError(T.passwordMismatch); return; }
    if (strength < 2) { setError(T.passwordWeak); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", email, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "otp_expired" ? T.otpExpired : data.error);
        return;
      }
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthLoadingOverlay variant="login" visible={redirecting} />
    <div className="min-h-screen flex items-center justify-center p-6 mesh-bg">
      <div className="w-full max-w-md animate-scale-in">
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
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          {/* ── Step 0: Email ── */}
          {step === 0 && (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-subtle)" }}>
                  <Lock size={24} color="var(--accent)" />
                </div>
                <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{T.forgotTitle}</h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{T.forgotSub}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.emailAddress}</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={T.emailPlaceholder} className="input-field pl-9" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center" style={{ padding: "13px", fontSize: "0.95rem" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{T.sendResetCode}</span><ArrowRight size={16} /></>}
              </button>

              <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                <ArrowLeft size={14} /> {T.backToLogin}
              </Link>
            </form>
          )}

          {/* ── Step 1: OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} className="animate-fade-up">
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
                  : <button type="button" onClick={() => { setOtp(["","","","","",""]); setError(""); sendOtp(email); }} className="font-semibold" style={{ color: "var(--accent)" }}>{T.resend}</button>
                }
              </p>
            </form>
          )}

          {/* ── Step 2: New Password ── */}
          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-4 animate-fade-up">
              <div className="text-center mb-6">
                <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{T.newPasswordTitle}</h1>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.newPassword}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showPw ? "text" : "password"} placeholder={T.passwordPlaceholder} className="input-field pl-9 pr-10" required minLength={8} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {newPassword && (
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

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{T.confirmPassword}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} type={showConfirm ? "text" : "password"} placeholder={T.confirmPasswordPlaceholder} className="input-field pl-9 pr-10" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPw && newPassword !== confirmPw && (
                  <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{T.passwordMismatch}</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2" style={{ padding: "13px", fontSize: "0.95rem" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{T.resetPassword}</span><ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="text-center py-4 animate-fade-up">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--success-subtle)" }}>
                <CheckCircle size={32} color="var(--success)" />
              </div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>{T.resetSuccess}</h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{T.backToLogin}</p>
              <button
                onClick={() => { setRedirecting(true); setTimeout(() => { window.location.href = "/login"; }, 1500); }}
                className="btn-primary justify-center"
                style={{ padding: "13px 32px", fontSize: "0.95rem" }}
              >
                {T.signIn} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
