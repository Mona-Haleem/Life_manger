import type { NavItem } from "@/util/type";
import { MessageCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

const Sidebar = ({navItems}:{navItems:NavItem[]}) => {
  const { t } = useTranslation();

  return (
    <aside className="hidden md:block md:w-40 lg:w-64 bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-purple-500 rounded-lg">
          <MessageCircleIcon className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden lg:block">{t('APP_TITLE')}</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => 
             <NavLink key={item.label} to={item.href} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            {item.icon}{" "} {item.label}
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
export default Sidebar;