"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface BottomNavChild {
  href?: string;
  label: string;
  icon?: LucideIcon;
  onAction?: () => void;
  danger?: boolean;
}

export interface BottomNavItem {
  href?: string;
  icon: LucideIcon;
  label: string;
  children?: BottomNavChild[];
}

interface Props {
  items: BottomNavItem[];
  onAction?: (key: string) => void;
}

export default function BottomNav({ items, onAction }: Props) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropup on outside click
  useEffect(() => {
    if (!openKey) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openKey]);

  // Close on route change
  useEffect(() => { setOpenKey(null); }, [pathname]);

  return (
    <>
      {/* Dropup backdrop */}
      {openKey && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpenKey(null)}
        />
      )}

      <nav
        ref={navRef}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid var(--border-strong)",
          boxShadow: "0 -4px 24px rgba(10,14,26,0.08)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-around px-2 h-16">
          {items.map((item) => {
            const key = item.label;
            const hasChildren = !!item.children?.length;
            const isOpen = openKey === key;

            // Active: direct href match OR any child href matches
            const active =
              (item.href && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))) ||
              item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href)) ||
              false;

            const iconEl = (
              <>
                {/* Active pill */}
                <span
                  className={cn(
                    "absolute top-2 w-8 h-1 rounded-full transition-all duration-300",
                    active || isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  )}
                  style={{ background: "var(--accent)" }}
                />
                <span
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200",
                    active || isOpen ? "bg-[var(--accent-subtle)] scale-110" : "hover:bg-[var(--accent-subtle)]"
                  )}
                >
                  <item.icon size={20} strokeWidth={active || isOpen ? 2.5 : 2} />
                </span>
                <span className="text-[10px] font-medium leading-none flex items-center gap-0.5">
                  {item.label}
                  {hasChildren && (
                    <ChevronUp
                      size={9}
                      className={cn("transition-transform duration-200", isOpen ? "rotate-0" : "rotate-180")}
                    />
                  )}
                </span>
              </>
            );

            const baseClass = cn(
              "relative flex flex-col items-center justify-center gap-0.5 min-w-[52px] h-full px-3 transition-all duration-200 active:scale-90",
              active || isOpen ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
            );

            return (
              <div key={key} className="relative h-full flex items-center">
                {/* Dropup panel */}
                {hasChildren && isOpen && (
                  <div
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 min-w-[160px] rounded-2xl overflow-hidden z-50"
                    style={{
                      background: "rgba(255,255,255,0.96)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                      border: "1px solid var(--border-strong)",
                      boxShadow: "0 -8px 32px rgba(10,14,26,0.12), var(--shadow-lg)",
                      animation: "dropup-in 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                  >
                    {/* Panel label */}
                    <div
                      className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}
                    >
                      {item.label}
                    </div>
                    {item.children!.map(({ href, label, icon: ChildIcon, onAction: childAction, danger }) => {
                      const childActive = !childAction && !!href && (pathname === href || pathname.startsWith(href));
                      const childStyle = danger
                        ? { color: "#ef4444" }
                        : childActive
                          ? { color: "var(--accent)", background: "var(--accent-subtle)" }
                          : { color: "var(--text-secondary)" };

                      const childContent = (
                        <>
                          {ChildIcon && <ChildIcon size={15} strokeWidth={childActive ? 2.5 : 2} />}
                          {label}
                          {childActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                          )}
                        </>
                      );

                      const childClass = "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 w-full";

                      return childAction ? (
                        <button
                          key={label}
                          onClick={() => { setOpenKey(null); childAction(); }}
                          className={childClass}
                          style={childStyle}
                        >
                          {childContent}
                        </button>
                      ) : (
                        <Link
                          key={href}
                          href={href!}
                          className={childClass}
                          style={childStyle}
                          onClick={() => setOpenKey(null)}
                        >
                          {childContent}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Nav button or link */}
                {hasChildren ? (
                  <button
                    aria-label={item.label}
                    aria-expanded={isOpen}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    className={baseClass}
                  >
                    {iconEl}
                  </button>
                ) : (
                  <Link href={item.href!} aria-label={item.label} className={baseClass}>
                    {iconEl}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </>
  );
}
