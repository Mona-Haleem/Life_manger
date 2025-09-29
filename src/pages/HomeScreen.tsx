import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { toggleTask } from "@/store/slices/taskSlice";
import type { RootState } from "@/store";
const HomeScreen = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
    const  user  = useSelector((state: RootState) => state.user);
    const { goals } = useSelector((state: RootState) => state.goals);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

 const direction = i18n.dir() as 'ltr' | 'rtl';
   const handleToggleTask = (taskId: number|string) => {
     dispatch(toggleTask(taskId) );
  };

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
          <Card>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('TODAY_SCHEDULE')}</h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                     onChange={() => handleToggleTask(task.id)}
                    className="h-5 w-5 rounded text-teal-500 focus:ring-teal-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-pointer"
                  />
                  <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'} text-base`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('GOALS_OVERVIEW')}</h2>
            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300">{goal.title}</span>
                    <span className="text-sm font-medium text-teal-500">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('CURRENTLY_WORKING')}</h2>
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">{goals[0].title}</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Finalizing UI components and integrating API endpoints.</p>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('MINI_CALENDAR')}</h2>
            <div className="text-center">
              <div className="flex justify-between items-center mb-2">
                <Button size="icon" variant="outline" className='h-8 w-8 text-sm'>&lt;</Button>
                <span className="font-semibold">{t('SEPTEMBER')}</span>
                <Button size="icon" variant="outline" className='h-8 w-8 text-sm'>&gt;</Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{t('SUNDAY_SHORT')}</span>
                <span>{t('MONDAY_SHORT')}</span>
                <span>{t('TUESDAY_SHORT')}</span>
                <span>{t('WEDNESDAY_SHORT')}</span>
                <span>{t('THURSDAY_SHORT')}</span>
                <span>{t('FRIDAY_SHORT')}</span>
                <span>{t('SATURDAY_SHORT')}</span>
              </div>
              <div className="grid grid-cols-7 gap-1 mt-1">
                {[...Array(30).keys()].map(i => (
                  <div key={i} className={`p-1.5 rounded-full text-sm ${i + 1 === 29 ? 'bg-teal-500 text-white font-bold' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;