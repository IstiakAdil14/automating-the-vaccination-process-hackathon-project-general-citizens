"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const partners = [
  { src: "/footerImg/mis_logo 1.png", alt: "MIS DGHS" },
  { src: "/footerImg/gavi.png",        alt: "Gavi" },
  { src: "/footerImg/unicef_logo.png", alt: "UNICEF" },
  { src: "/footerImg/WHO-11.svg",      alt: "WHO" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#0b1e34" }}
    >
      {/* subtle gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* ── Left: Support Info ── */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Support
            </p>
            <h3 className="text-sm font-medium text-gray-300 leading-relaxed">
              For any Assistance Regarding Registration:
            </h3>

            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">16263</p>
                <p className="text-gray-400 text-xs">Shastho Batayon</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Mail size={16} className="text-blue-400" />
              </div>
              <p className="text-gray-300 text-sm break-all">
                vaxepi@mis.dghs.gov.bd
              </p>
            </div>
          </motion.div>

          {/* ── Middle: Brand ── */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-900/40">
              V
            </div>
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">
                VaxEPI
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mt-2 max-w-xs">
                Official Government Immunization Portal of Bangladesh.
                Protecting families through safe and effective vaccination
                programs.
              </p>
            </div>
            <div className="w-12 h-px bg-blue-500/40 rounded-full" />
            <p className="text-blue-400/60 text-xs font-medium tracking-wider uppercase">
              Ministry of Health &amp; Family Welfare
            </p>
          </motion.div>

          {/* ── Right: Partners ── */}
          <motion.div {...fadeUp(0.2)} className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Partner Organizations
            </p>
            <div className="grid grid-cols-2 gap-3">
              {partners.map(({ src, alt }) => (
                <motion.div
                  key={alt}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-center h-16 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-full h-full">
                    <Image src={src} alt={alt} fill sizes="120px" className="object-contain" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2026 VaxEPI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map(
              (label, i, arr) => (
                <span key={label} className="flex items-center gap-4">
                  <Link
                    href="#"
                    className="text-gray-500 text-xs hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="text-gray-700 text-xs">|</span>
                  )}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
