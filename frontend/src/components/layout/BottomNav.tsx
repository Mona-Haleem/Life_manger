import type { NavItem } from "@/util/type";
import { NavLink } from "react-router";

const BottomNav = ({navItems}:{navItems:NavItem[]}) => {
  console.log(navItems);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around p-1 z-50">
      {navItems.map(item => 
      <NavLink key={item.label} to={item.href} className="text-gray-600 dark:text-gray-300">{item.icon}</NavLink>
        )}
    </nav>
  );
};

export default BottomNav;
