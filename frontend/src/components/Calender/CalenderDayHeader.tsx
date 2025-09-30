import React from "react";
import { useTranslation } from "react-i18next";

function CalenderDayHeader() {
  const { t } = useTranslation();

  const days = [
    t("SUNDAY_SHORT"),
    t("MONDAY_SHORT"),
    t("TUESDAY_SHORT"),
    t("WEDNESDAY_SHORT"),
    t("THURSDAY_SHORT"),
    t("FRIDAY_SHORT"),
    t("SATURDAY_SHORT"),
  ];
  return (
    <div className="grid md:grid-cols-7">
      {days.map((day) => (
        <div
          key={day}
          className="hidden md:block p-2 border-b border-r border-gray-200 dark:border-gray-600 text-center font-semibold text-sm dark:bg-gray-700 bg-gray-100"
        >
          {day}
        </div>
      ))}
    </div>
  );
}

export default CalenderDayHeader;
