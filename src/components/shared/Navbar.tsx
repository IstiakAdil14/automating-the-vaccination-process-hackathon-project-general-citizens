"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, MapPin, LogIn, LogOut, LayoutDashboard, BookOpen, HeadphonesIcon, ChevronDown, AlertCircle, CheckSquare, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";
import BottomNav from "@/components/shared/BottomNav";
import { clearSession } from "@/lib/logout";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/centers", label: "Find Centers", icon: MapPin },
];

const dropdownMenus = [
  {
    label: "Health Guide",
    icon: BookOpen,
    items: [
      { href: "/health-guide/emergency-info", label: "Emergency Info" },
      { href: "/health-guide/vaccine-checker", label: "Vaccine Checker" },
    ],
  },
  {
    label: "Support",
    icon: HeadphonesIcon,
    items: [
      { href: "/support/about", label: "About" },
      { href: "/support/faq", label: "FAQ" },
    ],
  },
];

const headerLogos = [
  { src: "/header-img/logo_1.svg", alt: "Logo 1" },
  { src: "/header-img/logo_2.png", alt: "Logo 2" },
  { src: "/header-img/logo_3.png", alt: "Logo 3" },
];

const mobileNavItemsGuest = [
  { href: "/",       icon: Home,  label: "Home"    },
  { href: "/centers", icon: MapPin, label: "Centers" },
  {
    icon: BookOpen,
    label: "Health",
    children: [
      { href: "/health-guide/emergency-info",   label: "Emergency Info",  icon: AlertCircle   },
      { href: "/health-guide/vaccine-checker",  label: "Vaccine Checker", icon: CheckSquare   },
    ],
  },
  {
    icon: HeadphonesIcon,
    label: "Support",
    children: [
      { href: "/support/about", label: "About",  icon: Info        },
      { href: "/support/faq",   label: "FAQ",    icon: HelpCircle  },
    ],
  },
  { href: "/login", icon: LogIn, label: "Login" },
];

const mobileNavItemsUser = [
  { href: "/",       icon: Home,            label: "Home"      },
  { href: "/centers", icon: MapPin,         label: "Centers"   },
  {
    icon: BookOpen,
    label: "Health",
    children: [
      { href: "/health-guide/emergency-info",   label: "Emergency Info",  icon: AlertCircle   },
      { href: "/health-guide/vaccine-checker",  label: "Vaccine Checker", icon: CheckSquare   },
    ],
  },
  {
    icon: HeadphonesIcon,
    label: "Support",
    children: [
      { href: "/support/about", label: "About", icon: Info       },
      { href: "/support/faq",   label: "FAQ",   icon: HelpCircle },
    ],
  },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

const TOP_BAR_H = 56;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("vaxcare_user") ?? sessionStorage.getItem("vaxcare_user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [pathname]);

  const handleLogout = () => {
    setLoggingOut(true);
    setOpenMenu(null);
    setTimeout(() => { clearSession(); }, 2400);
  };

  const glass = {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  } as React.CSSProperties;

  return (
    <>
      <AuthLoadingOverlay variant="logout" visible={loggingOut} />
      <div style={{ height: TOP_BAR_H + 72 }} />

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top bar */}
        <div
          className="w-full transition-transform duration-500 ease-in-out"
          style={{ ...glass, height: TOP_BAR_H, transform: scrolled ? `translateY(-${TOP_BAR_H}px)` : "translateY(0px)" }}
        >
          <div className="grid grid-cols-3 items-center h-full px-6 max-w-6xl mx-auto">
            {headerLogos.map(({ src, alt }, i) => (
              <div key={alt} className={cn("flex", i === 0 && "justify-start", i === 1 && "justify-center", i === 2 && "justify-end")}>
                <div className="relative h-10 w-24">
                  <Image src={src} alt={alt} fill sizes="96px" className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main navbar */}
        <nav
          className="w-full px-6 py-5 transition-transform duration-500 ease-in-out"
          style={{
            ...glass,
            transform: scrolled ? `translateY(-${TOP_BAR_H}px)` : "translateY(0px)",
            boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">V</div>
              <span className="font-bold text-2xl text-gray-800">VaxEPI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-medium transition-colors duration-200",
                    pathname === href ? "text-blue-700 bg-blue-50/80" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}

              {dropdownMenus.map(({ label, icon: Icon, items }) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-medium transition-colors duration-200",
                      openMenu === label ? "text-blue-700 bg-blue-50/80" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                    <ChevronDown size={15} className={cn("transition-transform duration-200", openMenu === label && "rotate-180")} />
                  </button>
                  {openMenu === label && (
                    <div className="absolute top-full left-0 w-44 rounded-xl shadow-lg border border-gray-100 bg-white py-1 z-50">
                      {items.map(({ href, label: itemLabel }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-2.5 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {itemLabel}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {user ? (
                <div
                  className="relative ml-2"
                  onMouseEnter={() => setOpenMenu("profile")}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="text-base">{user.fullName || "Account"}</span>
                  </button>
                  {openMenu === "profile" && (
                    <div className="absolute right-0 top-full w-44 rounded-xl shadow-lg border border-gray-100 bg-white py-1 z-50">
                      <Link href="/dashboard" onClick={() => setOpenMenu(null)} className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        <LayoutDashboard size={17} /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-base text-red-500 hover:bg-red-50">
                        <LogOut size={17} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-medium transition-colors duration-200 ml-2",
                    pathname === "/login" ? "text-blue-700 bg-blue-50/80" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
                  )}
                >
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile bottom nav — replaces hamburger */}
      <BottomNav items={user ? mobileNavItemsUser : mobileNavItemsGuest} />
    </>
  );
}
