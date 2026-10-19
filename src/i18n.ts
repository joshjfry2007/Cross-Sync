import type { Lang } from "./settings";

export type TextKey = "title" | "darkMode" | "language" | "fontSize" | "preview";

const TEXT: Record<Lang, Record<TextKey, string>> = {
  English: {
    title: "Settings",
    darkMode: "Dark mode",
    language: "Language",
    fontSize: "Font size",
    preview: "Change a setting and watch it update here --> preview text",
  },
  Hindi: {
    title: "सेटिंग्स",
    darkMode: "डार्क मोड",
    language: "भाषा",
    fontSize: "फ़ॉन्ट आकार",
    preview: "कोई सेटिंग बदलें और यहाँ बदलाव देखें। --> पूर्वावलोकन पाठ",
  },
  German: {
    title: "Einstellungen",
    darkMode: "Dunkelmodus",
    language: "Sprache",
    fontSize: "Schriftgröße",
    preview: "Ändere eine Einstellung und sieh das Ergebnis hier --> Vorschautext",
  },
  French: {
    title: "Paramètres",
    darkMode: "Mode sombre",
    language: "Langue",
    fontSize: "Taille de la police",
    preview: "Modifiez un paramètre et voyez le résultat ici --> texte de prévisualisation",
  },
};

export function t(lang: Lang, key: TextKey): string {
  return TEXT[lang][key];
}