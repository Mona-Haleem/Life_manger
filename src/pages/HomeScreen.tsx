import {  useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store";
import TodaySchedual from "@/components/tasks/TodaySchedual";
import GoalsOverview from "@/components/goal/GoalsOverview";
import AllGoals from "@/components/goal/AllGoals";
import MiniCalender from "@/components/Calender/MiniCalender";
const HomeScreen = () => {
    const  user  = useSelector((state: RootState) => state.user);

  const { t } = useTranslation();


  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t('MORNING', { name: user.name })}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('TODAY_PLAN')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedual />

          <GoalsOverview /> 
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AllGoals/>
          <MiniCalender />
                    
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;