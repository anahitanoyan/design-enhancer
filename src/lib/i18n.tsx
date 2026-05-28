import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ru" | "hy" | "es";
export type Theme = "light" | "dark" | "system";

const dict: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", schedule: "Schedule", tasks: "Tasks", grocery: "Grocery",
    notifications: "Notifications", family: "Family", analytics: "Analytics",
    profile: "Profile", settings: "Settings", ai_assistant: "AI Assistant",
    billing: "Billing", help: "Help & Support", sign_out: "Sign Out",
    save: "Save", cancel: "Cancel", edit: "Edit", add: "Add", delete: "Delete",
    language: "Language", theme: "Theme", light: "Light", dark: "Dark", system: "System",
    free_plan: "Free", pro_plan: "Pro", upgrade: "Upgrade",
  },
  ru: {
    dashboard: "Главная", schedule: "Расписание", tasks: "Задачи", grocery: "Покупки",
    notifications: "Уведомления", family: "Семья", analytics: "Аналитика",
    profile: "Профиль", settings: "Настройки", ai_assistant: "ИИ Помощник",
    billing: "Оплата", help: "Помощь", sign_out: "Выйти",
    save: "Сохранить", cancel: "Отмена", edit: "Изменить", add: "Добавить", delete: "Удалить",
    language: "Язык", theme: "Тема", light: "Светлая", dark: "Тёмная", system: "Системная",
    free_plan: "Бесплатно", pro_plan: "Pro", upgrade: "Улучшить",
  },
  hy: {
    dashboard: "Գլխավոր", schedule: "Ժամանակացույց", tasks: "Առաջադրանքներ", grocery: "Մթերք",
    notifications: "Ծանուցումներ", family: "Ընտանիք", analytics: "Վերլուծություն",
    profile: "Պրոֆիլ", settings: "Կարգավորումներ", ai_assistant: "AI Օգնական",
    billing: "Վճարում", help: "Օգնություն", sign_out: "Դուրս գալ",
    save: "Պահպանել", cancel: "Չեղարկել", edit: "Խմբագրել", add: "Ավելացնել", delete: "Ջնջել",
    language: "Լեզու", theme: "Թեմա", light: "Լուսավոր", dark: "Մուգ", system: "Համակարգային",
    free_plan: "Անվճար", pro_plan: "Pro", upgrade: "Թարմացնել",
  },
  es: {
    dashboard: "Panel", schedule: "Agenda", tasks: "Tareas", grocery: "Compras",
    notifications: "Notificaciones", family: "Familia", analytics: "Analíticas",
    profile: "Perfil", settings: "Ajustes", ai_assistant: "Asistente IA",
    billing: "Facturación", help: "Ayuda", sign_out: "Cerrar sesión",
    save: "Guardar", cancel: "Cancelar", edit: "Editar", add: "Añadir", delete: "Eliminar",
    language: "Idioma", theme: "Tema", light: "Claro", dark: "Oscuro", system: "Sistema",
    free_plan: "Gratis", pro_plan: "Pro", upgrade: "Actualizar",
  },
};

interface PrefsCtx {
  lang: Lang; setLang: (l: Lang) => void;
  theme: Theme; setTheme: (t: Theme) => void;
  t: (key: string) => string;
}

const Ctx = createContext<PrefsCtx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (typeof localStorage !== "undefined" ? (localStorage.getItem("oikos:lang") as Lang) : null) || "en");
  const [theme, setThemeState] = useState<Theme>(() => (typeof localStorage !== "undefined" ? (localStorage.getItem("oikos:theme") as Theme) : null) || "light");

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);
  }, [theme]);

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("oikos:lang", l); };
  const setTheme = (t: Theme) => { setThemeState(t); localStorage.setItem("oikos:theme", t); };
  const t = (key: string) => dict[lang][key] ?? dict.en[key] ?? key;

  return <Ctx.Provider value={{ lang, setLang, theme, setTheme, t }}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}