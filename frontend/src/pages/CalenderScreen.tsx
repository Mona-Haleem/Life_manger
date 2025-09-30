import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useState } from "react";
import CalenderHeader from "@/components/Calender/CalenderHeader";
import Calender from "@/components/Calender/Calender";
import DetaileView from "@/components/tasks/DetaileView";

const CalendarScreen = () => {
  const [CalenderDisplay, setCalenderDisplay] = useState<"Week" | "Month">(
    "Week"
  );
  const { tasks } = useSelector((state: RootState) => state.tasks);

  return (
    <>
      <div className="p-4 sm:p-6 text-gray-700 dark:text-gray-100 flex flex-col md:flex-row gap-6 h-full overflow-none">
        <div className="flex-grow ">
          <CalenderHeader
            CalenderDisplay={CalenderDisplay}
            setDisplay={setCalenderDisplay}
          />
          <Calender calendarDisplay={CalenderDisplay} />
        </div>
        {/* <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
        <DefaultCard className="h-full">
        <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
        {t("TASKS_FOR")}
        </h2>
        <div className="space-y-3">
        {tasks?.map((task) => (
          <div
          key={task.id}
          className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
          <CheckCircleIcon
          className={`h-4 w-4 ${
            task.completed
            ? "text-teal-500"
            : "text-gray-400 dark:text-gray-600"
            }`}
            />
            <span
            className={`${
              task.completed
              ? "line-through text-gray-400"
              : "text-gray-700 dark:text-gray-300"
              } text-sm`}
              >
              {task.text}
              </span>
              </div>
              ))}
              </div>
              </DefaultCard>
              </aside> */}
      </div>
      <DetaileView />
    </>
  );
};

export default CalendarScreen;
