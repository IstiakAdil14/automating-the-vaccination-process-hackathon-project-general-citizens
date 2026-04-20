"use client";
import { useState, useEffect, useCallback } from "react";
import en from "../../locales/en.json";
import bn from "../../locales/bn.json";

export type Lang = "en" | "bn";
type Locales = typeof en;

const locales: Record<Lang, Locales> = { en, bn };

export function useLang() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("vaxcare_lang") as Lang | null;
    if (stored === "en" || stored === "bn") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("vaxcare_lang", l);
  }, []);

  return { lang, setLang, t: locales[lang] };
}
