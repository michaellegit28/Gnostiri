// i18n-ready UI shell — English first; ar/fr/pt/zh stubs (Phase 2).
// Usage: t('country', lang) — widget passes lang from region (ar for EG/AE, he fallback to rtl layout).
export type Lang = "en" | "ar" | "fr" | "pt" | "zh" | "he";

const STRINGS: Record<string, Record<Lang, string>> = {
  country: { en: "Country", ar: "البلد", fr: "Pays", pt: "País", zh: "国家", he: "מדינה" },
  board: { en: "Exam board", ar: "مجلس الامتحانات", fr: "Commission d'examen", pt: "Banca examinadora", zh: "考试委员会", he: "מועצת בחינות" },
  track: { en: "Track / stream", ar: "المسار", fr: "Filière", pt: "Trilha", zh: "方向", he: "מגמה" },
  core: { en: "CORE SYLLABUS", ar: "منهج أساسي", fr: "PROGRAMME DE BASE", pt: "CONTEÚDO CENTRAL", zh: "核心大纲", he: "ליבת תכנית" },
  elective: { en: "ELECTIVE / TRACK-DEPENDENT", ar: "اختياري / حسب المسار", fr: "OPTIONNEL / SELON FILIÈRE", pt: "ELETIVO / POR TRILHA", zh: "选修 / 依方向", he: "בחירה / לפי מגמה" },
  excluded: { en: "NOT IN SYLLABUS", ar: "ليس في المنهج", fr: "HORS PROGRAMME", pt: "FORA DO PROGRAMA", zh: "不在大纲内", he: "לא בתכנית" },
  save: { en: "Save my profile", ar: "احفظ ملفي", fr: "Enregistrer mon profil", pt: "Salvar meu perfil", zh: "保存我的资料", he: "שמור פרופיל" },
};

export function t(key: string, lang: Lang = "en"): string {
  return STRINGS[key]?.[lang] || STRINGS[key]?.en || key;
}

export function langForIso(iso?: string): Lang {
  if (iso === "EG" || iso === "AE") return "ar";
  if (iso === "IL") return "he";
  if (iso === "FR") return "fr";
  if (iso === "BR") return "pt";
  if (iso === "CN" || iso === "SG") return "zh";
  return "en";
}
