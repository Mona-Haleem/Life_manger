import { Play } from "lucide-react";
import React from "react";

interface CalenderNavigatorProps {
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  currentDate: Date;
  calendarDisplay: "Month" | "Week";
}

function CalenderNavigator({
  setCurrentDate,
  currentDate,
  calendarDisplay,
}: CalenderNavigatorProps) {
  const goToPrevious = () => {
    setCurrentDate((prev) => {
      if (calendarDisplay === "Month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        return new Date(prev.setDate(prev.getDate() - 7));
      }
    });
  };

  const goToNext = () => {
    setCurrentDate((prev) => {
      if (calendarDisplay === "Month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        return new Date(prev.setDate(prev.getDate() + 7));
      }
    });
  };

  const getWeekHeader = () =>
    `${currentDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} - ${new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() + 6 - currentDate.getDay()
      )
    ).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;

  const getMonthHeader = () =>
    currentDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    
  return (
    <div className="flex justify-between m-0 items-center border-t border-l rounded-t-xl shadow-md transition-all duration-300 overflow-hidden bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
      <Play
        size={30}
        color="#6a7282"
        fill="#6a7282"
        className="rotate-180 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80"
        onClick={goToPrevious}
      />
      <h2 className="font-bold  bg-slate-100  dark:bg-slate-600 h-full p-1 flex-1 text-center">
        {calendarDisplay === "Month" ? getMonthHeader() : getWeekHeader()}
      </h2>
      <Play
        size={30}
        color="#6a7282"
        fill="#6a7282"
        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80"
        onClick={goToNext}
      />
    </div>
  );
}

export default CalenderNavigator;
