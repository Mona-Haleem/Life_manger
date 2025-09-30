// import type { RootState } from "@/store";
// import { useSelector } from "react-redux";

import { useSelector } from "react-redux";
import { Button } from "../components/ui/button.js";
import { Card } from "../components/ui/card.js";
import type { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import type { HeatmapDay } from "@/util/type";
import { DefaultCard } from "@/components/Cards/defaultCard.js";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from "recharts";

// export default function ProgressScreen() {
//   const tasks = useSelector((state: RootState) => state.tasks.tasks);
//   const completedCount = tasks.filter((t) => t.completed).length;
//   const pendingCount = tasks.length - completedCount;

//   const data = [
//     { name: "Completed", value: completedCount },
//     { name: "Pending", value: pendingCount },
//   ];

//   const productivityData = [
//     { day: "Mon", tasks: 2 },
//     { day: "Tue", tasks: 4 },
//     { day: "Wed", tasks: 1 },
//     { day: "Thu", tasks: 3 },
//     { day: "Fri", tasks: 5 },
//     { day: "Sat", tasks: 2 },
//     { day: "Sun", tasks: 0 },
//   ];

//   return (
//     <div className="space-y-6">
//       <section>
//         <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
//           Task Overview
//         </h2>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data}>
//               <XAxis dataKey="name" stroke="#888" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       <section>
//         <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
//           Weekly Productivity
//         </h2>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={productivityData}>
//               <XAxis dataKey="day" stroke="#888" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="tasks"
//                 stroke="#10b981"
//                 strokeWidth={2}
//                 dot={{ r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </section>
//     </div>
//   );
// }
const ProgressScreen = () => {
  const { summary,heatmap } = useSelector((state: RootState) => state.progress);
  const { t } = useTranslation();

  const Heatmap = ({ heatmapData }: { heatmapData: HeatmapDay[] }) => (
    <div className="grid grid-cols-7 gap-1.5">
      {heatmap.map((day, i) => {
        let colorClass = 'bg-gray-200 dark:bg-gray-700';
        if (day.count > 3) colorClass = 'bg-teal-600';
        else if (day.count > 1) colorClass = 'bg-teal-400';
        else if (day.count > 0) colorClass = 'bg-teal-200';
        return <div key={i} className={`w-full aspect-square rounded ${colorClass}`} title={`${day.count} tasks on ${day.date}`}></div>
      })}
    </div>
  );

  const BarChart = () => {
    const barData = [60, 85, 40, 95, 20, 70, 55]; // Mock data for bar heights
    const days = [t('MONDAY_SHORT'), t('TUESDAY_SHORT'), t('WEDNESDAY_SHORT'), t('THURSDAY_SHORT'), t('FRIDAY_SHORT'), t('SATURDAY_SHORT'), t('SUNDAY_SHORT')];
    return (
      <div className="flex gap-2 items-end h-48">
        {days.map((day, i) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <div style={{ height: `${barData[i]}%` }} className={`w-full rounded-t-md transition-all duration-500 ${barData[i] > 50 ? 'bg-teal-500' : 'bg-orange-400'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('PROGRESS')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('INSIGHTS')}</p>
      </header>

      <DefaultCard className="bg-teal-500 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-around items-center text-center">
          <div className="p-2">
            <p className="text-3xl font-bold">
              <span className="mr-2">✅</span> {summary.completed}%
            </p>
            <p className="opacity-90 font-medium">{t('COMPLETED')}</p>
          </div>
          <div className="p-2">
            <p className="text-3xl font-bold">
              <span className="mr-2">⏰</span> {summary.mostProductive}
            </p>
            <p className="opacity-90 font-medium">{t('PEAK_TIME')}</p>
          </div>
          <div className="p-2">
            <p className="text-3xl font-bold">
              <span className="mr-2">⚠️</span> {summary.missed}
            </p>
            <p className="opacity-90 font-medium">{t('MISSED_DEADLINES')}</p>
          </div>
        </div>
      </DefaultCard>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <DefaultCard>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('DONE_VS_SKIPPED')}</h2>
            <BarChart />
          </DefaultCard>
        </div>
        <div className="lg:col-span-2">
          <DefaultCard>
            <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{t('ACTIVITY_HEATMAP')}</h2>
            <Heatmap heatmapData={heatmap} />
          </DefaultCard>
        </div>
      </div>

      <DefaultCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0 mt-1 text-lg">🤓</div>
          <div>
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">{t('MANAGER_NOTE_TITLE')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{t('MANAGER_NOTE_BODY')}</p>
            <div className="mt-4 flex gap-2">
              <Button>{t('YES_ADJUST')}</Button>
              <Button variant="secondary">{t('NO_KEEP')}</Button>
            </div>
          </div>
        </div>
      </DefaultCard>
    </div>
  );
};

export default ProgressScreen;