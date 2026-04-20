"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthLoadingOverlay from "@/components/ui/AuthLoadingOverlay";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }

    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 1500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  return <AuthLoadingOverlay variant="page" visible={visible} />;
}
