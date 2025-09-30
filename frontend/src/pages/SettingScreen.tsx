import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Card } from "../components/ui/card.js";
import { useEffect, type ReactNode } from "react";
import type { Locale } from "@/util/type";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { DefaultCard } from "@/components/Cards/defaultCard.js";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const locale = i18n.language as Locale;

  const setLocale = (lng: Locale) => {
    i18n.changeLanguage(lng);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  // 👇 set <html dir="rtl"> for Arabic
  useEffect(() => {
    if (locale === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [locale]);

  const SettingRow = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <div className="mt-2 sm:mt-0">{children}</div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("SETTINGS")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t("MANAGE_PREFS")}</p>
      </header>

      <DefaultCard>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t("PREFERENCES")}
        </h2>
        <SettingRow title={t("THEME")}>
          <Button onClick={toggleTheme} variant="secondary" size="icon">
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </Button>
        </SettingRow>
        <SettingRow title={t("LANGUAGE")}>
          <select
            value={locale}
            onChange={handleLanguageChange}
            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-gray-100"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </SettingRow>
      </DefaultCard>

      <DefaultCard>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t("NOTIFICATIONS")}
        </h2>
        <SettingRow title={t("REMINDER_TASK")}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            {/* Custom Toggle Switch (Shadcn switch simulation) */}
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500"></div>
          </label>
        </SettingRow>
        <SettingRow title={t("WEEKLY_REPORT")}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500"></div>
          </label>
        </SettingRow>
      </DefaultCard>
    </div>
  );
};

export default SettingsScreen;
