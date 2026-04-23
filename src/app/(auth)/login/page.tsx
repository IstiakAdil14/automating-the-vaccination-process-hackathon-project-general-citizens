"use client";
import { useState } from "react";
import Link from "next/link";
import { Syringe, Mail, Lock, Eye, EyeOff, ArrowRight, Globe, IdCard, CheckCircle, ShieldCheck, Zap, Users } from "lucide-react";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";
import { t, Lang } from "@/lib/i18n";

const STATS = [
  { value: "2.4M+", label: "Citizens Protected" },
  { value: "340+", label: "Vaccine Centers" },
  { value: "98.7%", label: "Satisfaction Rate" },
  { value: "< 2min", label: "Avg Booking Time" },
];

const FEATURES = [
  { icon: ShieldCheck, text: "Secure digital vaccine passport" },
  { icon: Zap, text: "Instant appointment booking" },
  { icon: Users, text: "Full family health management" },
];

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("en");
  const T = t[lang];

  const [useNid, setUseNid] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "account_locked") {
          setLockedUntil(new Date(data.lockedUntil));
          setError(T.accountLocked);
        } else if (data.error === "invalid_credentials") {
          setError(`${T.invalidCredentials} ${data.attemptsLeft}`);
        } else if (data.error === "not_verified") {
          setError(lang === "en" ? "Email not verified. Please complete registration." : "ইমেইল যাচাই হয়নি।");
        } else {
          setError(data.error);
        }
        return;
      }

      if (rememberMe) localStorage.setItem("vaxcare_user", JSON.stringify(data.user));
      else sessionStorage.setItem("vaxcare_user", JSON.stringify(data.user));

      setRedirecting(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockedUntil && new Date() < lockedUntil;

  return (
    <>
      <AuthLoadingOverlay variant="login" visible={redirecting} />
      <div className="min-h-screen flex mesh-bg overflow-hidden" style={{ height: "100vh" }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)" }}>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #a5b4fc, transparent)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Syringe size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">Vax<span className="text-indigo-300">Care</span></span>
          </Link>

          {/* Main content */}
          <div className="my-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-white/80 text-sm font-medium">Bangladesh National Vaccination Platform</span>
            </div>

            <h2 className="text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
              Your health,<br />
              <span className="text-indigo-300">protected</span> &<br />
              always with you.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-sm">
              Manage vaccinations, book appointments, and carry your digital health passport — all in one place.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-12">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Icon size={15} color="#a5b4fc" />
                  </div>
                  <span className="text-white/70 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                <p className="text-white font-bold text-xl leading-none mb-1">{value}</p>
                <p className="text-white/50 text-xs leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] animate-scale-in">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
                <Syringe size={16} color="white" />
              </div>
              <span className="font-bold text-lg">Vax<span style={{ color: "var(--accent)" }}>Care</span></span>
            </Link>
            <div className="lg:ml-auto mt-8">
              <button
                onClick={() => setLang((l) => l === "en" ? "bn" : "en")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{ border: "1.5px solid var(--border-strong)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
              >
                <Globe size={13} /> {lang === "en" ? "বাংলা" : "English"}
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="font-bold text-4xl mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>
              Welcome back
            </h1>
            <p className="text-base" style={{ color: "var(--text-muted)" }}>
              Sign in to your VaxCare account to continue
            </p>
          </div>

          {/* Login method toggle */}
          <div className="flex rounded-2xl p-1 gap-1 mt-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            {[
              { label: lang === "en" ? "Email Address" : "ইমেইল", icon: <Mail size={15} />, val: false },
              { label: lang === "en" ? "NID Number" : "NID", icon: <IdCard size={15} />, val: true },
            ].map(({ label, icon, val }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => { setUseNid(val); setIdentifier(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={useNid === val
                  ? { background: "var(--surface-raised)", color: "var(--accent)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-strong)" }
                  : { color: "var(--text-muted)" }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3.5 rounded-2xl text-sm font-medium flex items-start gap-2.5"
              style={{ background: "rgba(239,68,68,0.07)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <span className="mt-0.5 flex-shrink-0">⚠️</span>
              <span>
                {error}
                {isLocked && lockedUntil && (
                  <span className="block text-xs mt-1 opacity-80">{T.lockedUntil}: {lockedUntil.toLocaleTimeString()}</span>
                )}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                {useNid ? T.nidNumber : T.emailAddress}
              </label>
              <div className="relative">
                {useNid
                  ? <IdCard size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  : <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                }
                <input
                  type={useNid ? "text" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={useNid ? T.nidPlaceholder : T.emailPlaceholder}
                  className="input-field pl-11"
                  style={{ padding: "13px 16px 13px 44px", fontSize: "0.95rem", borderRadius: "14px" }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{T.password}</label>
                <Link href="/forgot-password" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
                  {T.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={T.passwordPlaceholder}
                  className="input-field pl-11 pr-12"
                  style={{ padding: "13px 48px 13px 44px", fontSize: "0.95rem", borderRadius: "14px" }}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0"
                style={{
                  background: rememberMe ? "var(--accent)" : "var(--surface-raised)",
                  border: `2px solid ${rememberMe ? "var(--accent)" : "var(--border-strong)"}`,
                  boxShadow: rememberMe ? "0 0 0 3px var(--accent-subtle)" : "none",
                }}
              >
                {rememberMe && <CheckCircle size={12} color="white" />}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{T.rememberMe}</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!isLocked}
              className="btn-primary w-full justify-center glow-pulse"
              style={{ padding: "10px", fontSize: "0.875rem", borderRadius: "12px", opacity: loading || isLocked ? 0.7 : 1, marginTop: "6px" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {T.signingIn}
                </span>
              ) : (
                <span className="flex items-center gap-2">{T.signIn} <ArrowRight size={17} /></span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
          </div>

          {/* Register CTA */}
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--accent-subtle)", border: "1px solid var(--border-strong)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
              {T.noAccount}
            </p>
            <Link
              href="/register"
              className="btn-ghost w-full justify-center"
              style={{ borderRadius: "10px", padding: "7px", fontSize: "0.82rem" }}
            >
              {T.createFree} <ArrowRight size={13} />
            </Link>
          </div>

          {/* Vaccination Center Login */}
          <div className="rounded-2xl p-5 text-center mt-1" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
              Are you a vaccination center staff?
            </p>
            <a
              href="http://localhost:3002/login"
              className="btn-ghost w-full justify-center"
              style={{ borderRadius: "12px", padding: "10px", fontSize: "0.9rem" }}
            >
              <Syringe size={15} /> Vaccination Center Login
            </a>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
