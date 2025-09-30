import { DefaultCard } from "../Cards/defaultCard.js";
import { useTranslation } from "react-i18next";
import { ArrowLeftSquare, ArrowRightSquare } from "lucide-react";
import { useState } from "react";

function MiniCalendar() {
  const { t } = useTranslation();
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    t("JANUARY"),
    t("FEBRUARY"),
    t("MARCH"),
    t("APRIL"),
    t("MAY"),
    t("JUNE"),
    t("JULY"),
    t("AUGUST"),
    t("SEPTEMBER"),
    t("OCTOBER"),
    t("NOVEMBER"),
    t("DECEMBER"),
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const generateCalendar = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    const calendar = [];
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }

    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const calendarDays = generateCalendar();

  return (
    <DefaultCard header={t("MINI_CALENDAR")}>
      <div className="text-center">
        <div className="flex justify-between items-center mb-5 ">
          <ArrowLeftSquare
            className="text-slate-700 cursor-pointer"
            onClick={handlePrevMonth}
          />
          <span className="font-semibold text-slate-700">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <ArrowRightSquare
            className="text-slate-700 cursor-pointer"
            onClick={handleNextMonth}
          />
        </div>

        <div className="grid grid-cols-7 text-xs text-gray-500 dark:text-gray-400">
          <span>{t("SUNDAY_SHORT")}</span>
          <span>{t("MONDAY_SHORT")}</span>
          <span>{t("TUESDAY_SHORT")}</span>
          <span>{t("WEDNESDAY_SHORT")}</span>
          <span>{t("THURSDAY_SHORT")}</span>
          <span>{t("FRIDAY_SHORT")}</span>
          <span>{t("SATURDAY_SHORT")}</span>
        </div>

        <div className="grid grid-cols-7 mt-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`p-1.5 rounded-full text-sm w-9 h-9 mx-auto  ${
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
                  ? "bg-teal-500 text-white font-bold"
                  : ""
              }`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </DefaultCard>
  );
}

export default MiniCalendar;
