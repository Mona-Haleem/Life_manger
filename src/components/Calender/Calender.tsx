import { useEffect, useState } from "react";
import CalenderNavigator from "./CalenderNavigator";
import CalenderDayHeader from "./CalenderDayHeader";
import CalenderDay from "./CalenderDay";

interface CalendarProps {
  calendarDisplay: "Month" | "Week";
}

function Calendar({ calendarDisplay = "Week" }: CalendarProps) {
  const [daysInView, setDaysInView] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const dates: Date[] = [];

    if (calendarDisplay === "Month") {
      const startDay = firstDayOfMonth.getDay();
      const daysInMonth = lastDayOfMonth.getDate();

      // Previous month's tail days
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        dates.push(
          new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
        );
      }

      // Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        dates.push(new Date(currentYear, currentMonth, d));
      }

      // Next month's leading days to complete grid (42 cells = 6 weeks * 7 days)
      const totalCells = Math.ceil(dates.length / 7) * 7;
      const nextMonthDays = totalCells - dates.length;
      for (let d = 1; d <= nextMonthDays; d++) {
        dates.push(new Date(currentYear, currentMonth + 1, d));
      }
    } else if (calendarDisplay === "Week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    }

    setDaysInView(dates);
  }, [calendarDisplay, currentDate]);

  return (
    <div className="space-y-2">
      <CalenderNavigator
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        calendarDisplay={calendarDisplay}
      />

      <div className="border-t border-l rounded-b-xl shadow-md transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
        <CalenderDayHeader />
        <div>
          <div className="grid md:grid-cols-7 rounded-b-xl shadow-md transition-all duration-300 overflow-y-auto max-h-[75vh] ">
            {daysInView.map((date) => (
              <CalenderDay
                key={date.toLocaleString()}
                date={date}
                currentDate={currentDate}
                CalenderDisplay={calendarDisplay}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
