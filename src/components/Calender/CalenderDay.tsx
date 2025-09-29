// src/components/Calender/CalenderDay.tsx (modified)
import { useMemo } from "react";
import GoalCard from "../goal/goalCard";
import type { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { filterTasksByDate, formatISO } from "@/util/helpers";
import { openTaskDetail, openDayList } from "@/store/slices/uiSlice";

interface CalenderDayProps {
  date: Date;
  currentDate: Date;
  CalenderDisplay: "Month" | "Week";
}
function CalenderDay({ date, currentDate, CalenderDisplay }: CalenderDayProps) {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const filteredTasks = filterTasksByDate(tasks, { day: date });

  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const today = useMemo(() => new Date(), []);

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const onDayClick = (d: Date) => {
    const dayISO = formatISO(new Date(d.getFullYear(), d.getMonth(), d.getDate()), { representation: "date" });
    dispatch(openDayList({ dateISO: dayISO }));
  };

  const onTaskClick = (taskId: string | number) => {
    dispatch(openTaskDetail({ taskId }));
  };

  return (
    <div
      className={`min-h-30 border-b border-r border-gray-200 dark:border-gray-700 relative 
              ${isToday(date) ? "bg-teal-200 dark:bg-teal-700" : ""}
              ${
                !isCurrentMonth && CalenderDisplay == "Month"
                  ? "opacity-50 bg-gray-50 dark:bg-gray-900"
                  : ""
              }`}
    >
      <span
        className={` block text-xs w-full py-1  shadow-2xl cursor-pointer select-none ${
          isToday(date)
            ? "font-bold bg-teal-500 text-white "
            : "bg-gray-200 dark:bg-gray-700"
        }`}
        onClick={() => onDayClick(date)}
        title="Open day view"
      >
        {date.getDate()}
      </span>

      <div className="p-1 space-y-1">
        {filteredTasks.map((task) => (
          // Wrap GoalCard so clicks open the detail
          <div
            key={task.id}
            className="cursor-pointer"
            onClick={() => onTaskClick(task.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") onTaskClick(task.id);
            }}
          >
            <GoalCard goal={task} className="m-0 text-xs !p-2 max-h-25 overflow-hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalenderDay;
