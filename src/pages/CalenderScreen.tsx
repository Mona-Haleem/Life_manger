import type { RootState } from "@/util/type";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card } from "../components/ui/card";
import { CheckCircleIcon } from "lucide-react";

const CalendarScreen = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  
  const { t } = useTranslation();
  const days = [t('SUNDAY_SHORT'), t('MONDAY_SHORT'), t('TUESDAY_SHORT'), t('WEDNESDAY_SHORT'), t('THURSDAY_SHORT'), t('FRIDAY_SHORT'), t('SATURDAY_SHORT')];

  return (
    <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-grow overflow-auto">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('CALENDAR')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('WEEK_OF')}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
          {days.map(day => (
            <div key={day} className="p-2 border-b border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-sm">
              {day}
            </div>
          ))}
          {Array.from({ length: 7 * 1 }).map((_, i) => (
            <div key={i} className="h-48 border-b border-r border-gray-200 dark:border-gray-700 p-1 relative">
              <span className="text-xs">{28 + i}</span>
              {i === 1 && ( // Monday
                <div className="absolute top-10 inset-x-1 bg-teal-500/20 text-teal-800 dark:text-teal-200 p-1 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity">
                  <p className="font-bold">Team Sync</p>
                  <p>10:00 AM</p>
                </div>
              )}
              {i === 3 && ( // Wednesday
                <div className="absolute top-16 inset-x-1 bg-purple-500/20 text-purple-800 dark:text-purple-200 p-1 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity">
                  <p className="font-bold">1:1 with Alex</p>
                  <p>2:00 PM</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
        <Card className="h-full">
          <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('TASKS_FOR')}</h2>
          <div className="space-y-3">
            {tasks?.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <CheckCircleIcon className={`h-4 w-4 ${task.completed ? 'text-teal-500' : 'text-gray-400 dark:text-gray-600'}`} />
                <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'} text-sm`}>{task.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default CalendarScreen;