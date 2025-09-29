import { Outlet } from "react-router-dom";
import { Calendar, Home, MessageCircle, BarChart2, Settings } from "lucide-react";
import BottomNav from "./BottomNav";
import Sidebar from "./SideBar";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { t } = useTranslation();
  const navItems = [
    { label: t('HOME'), href: '/', icon: <Home size={20} /> },
    { label: t('CALENDAR'), href: '/calendar', icon: <Calendar size={20} /> },
    { label: t('CHAT'), href: '/chat', icon: <MessageCircle size={20} /> },
    { label: t('PROGRESS'), href: '/progress', icon: <BarChart2 size={20} /> },
    { label: t('SETTINGS'), href: '/settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      {/* <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-xl">
        <div className="p-4 text-xl font-bold text-gray-900 dark:text-white">AI Manager</div>
      
      </aside> */}
      <Sidebar navItems={navItems} />
      {/* Mobile bottom nav */}
      <BottomNav navItems={navItems} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 w-full bg-">
        <Outlet />
      </main>
    </div>
  );
}
