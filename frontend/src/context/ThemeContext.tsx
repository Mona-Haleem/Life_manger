import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: "light",
    toggleTheme: () => {},
});

const useTheme = (): ThemeContextProps => useContext(ThemeContext);


interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");

 useEffect(() => {
  const root = window.document.documentElement;

  if (theme === "dark") {
    root.className ="dark";
  } else {
    root.className ="light";
  }

  root.style.colorScheme = theme;
  console.log("Theme set to:", theme);
}, [theme]);


  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeProvider, useTheme };
