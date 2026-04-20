"use client";
import { Lang } from "@/hooks/useLang";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function LanguageToggle({ lang, setLang }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white/60 border border-indigo-100 rounded-full p-1 backdrop-blur-sm">
      {(["en", "bn"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 min-w-[44px] min-h-[32px] ${
            lang === l
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          aria-pressed={lang === l}
          aria-label={`Switch to ${l === "en" ? "English" : "Bangla"}`}
        >
          {l === "en" ? "EN" : "বাং"}
        </button>
      ))}
    </div>
  );
}
