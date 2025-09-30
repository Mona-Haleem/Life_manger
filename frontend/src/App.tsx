import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import CalendarScreen from "./pages/CalenderScreen";
import ChatScreen from "./pages/ChatScreen";
import SettingsScreen from "./pages/SettingScreen";
import ProgressScreen from "./pages/ProgressScreen";
import "./i18n";
import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import Layout from "./components/layout/layout";
import { store } from "./store";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_supabase_url;
console.log("API URL:", apiUrl);
 function App() {
//   const { i18n } = useTranslation();

//   useEffect(() => {
//     document.documentElement.lang = i18n.language;
//   }, [i18n.language]);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeScreen />} />
              <Route path="calendar" element={<CalendarScreen />} />
              <Route path="chat" element={<ChatScreen />} />
              <Route path="progress" element={<ProgressScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
