"use client";
import { useEffect, useState } from "react";
import CTASection from "@/components/home/CTASection";
import type { TrustBadge } from "@/types/home";

export default function CTAGuard({ trustBadges }: { trustBadges: TrustBadge[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const user =
      localStorage.getItem("vaxcare_user") ||
      sessionStorage.getItem("vaxcare_user");
    setIsLoggedIn(!!user);
  }, []);

  // null = hydrating, avoid flash
  if (isLoggedIn === null || isLoggedIn) return null;

  return <CTASection trustBadges={trustBadges} />;
}
