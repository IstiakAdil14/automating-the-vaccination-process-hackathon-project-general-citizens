"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Syringe, LayoutDashboard, Calendar, QrCode, Users,
  User, LogOut, ChevronRight, MoreHorizontal, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";
import BottomNav from "@/components/shared/BottomNav";
import { clearSession } from "@/lib/logout";

const navItems = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard"    },
  { href: "/appointments", icon: Calendar,         label: "Appointments" },
  { href: "/vaccine-card", icon: QrCode,           label: "Vaccine Card" },
  { href: "/family",       icon: Users,            label: "Family"       },
  { href: "/profile",      icon: User,             label: "Profile"      },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  // Guard: redirect to login if no session exists
  useEffect(() => {
    const raw =
      localStorage.getItem("vaxcare_user") ??
      sessionStorage.getItem("vaxcare_user");
    if (!raw) {
      // Still might have a valid httpOnly cookie — do a lightweight auth check
      fetch("/api/profile", { method: "HEAD" }).then((r) => {
        if (r.status === 401) router.replace("/login");
        else setAuthed(true);
      }).catch(() => router.replace("/login"));
      return;
    }
    try { setUser(JSON.parse(raw)); } catch {}
    setAuthed(true);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => { clearSession(); }, 1500);
  };

  const mobileNavItems = [
    { href: "/dashboard",    icon: LayoutDashboard, label: "Home"    },
    { href: "/appointments", icon: Calendar,        label: "Book"    },
    { href: "/family",       icon: Users,           label: "Family"  },
    {
      icon: Shield,
      label: "Records",
      children: [
        { href: "/vaccine-card", label: "Vaccine Card", icon: QrCode },
      ],
    },
    {
      icon: MoreHorizontal,
      label: "More",
      children: [
        { href: "/profile", label: "Profile", icon: User },
        { label: "Logout", icon: LogOut, onAction: handleLogout, danger: true as const },
      ],
    },
  ];

  return (
    <>
    {!authed ? null : (
    <>
    <AuthLoadingOverlay variant="logout" visible={loggingOut} />
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "var(--surface-raised)", borderRight: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link href="/" className="flex items-center gap-2.5 outline-none focus:outline-none focus-visible:outline-none" style={{ outline: "none" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)", boxShadow: "0 4px 12px var(--accent-glow)" }}>
              <Syringe size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg">Vax<span style={{ color: "var(--accent)" }}>Care</span></span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-lg font-medium transition-all duration-200 group"
                style={
                  active
                    ? { background: "var(--accent-subtle)", color: "var(--accent)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                {label}
                {active && <ChevronRight size={13} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1" style={{ background: "var(--accent-subtle)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold text-white" style={{ background: "var(--accent)" }}>
              {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user?.fullName ?? ""}</p>
              <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-base w-full transition-colors hover:bg-red-50" style={{ color: "var(--text-muted)" }}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile bottom nav */}
      <BottomNav items={mobileNavItems} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
<main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
    </>
    )}
    </>
  );
}
