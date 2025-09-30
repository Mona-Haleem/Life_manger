import { useTranslation } from "react-i18next";
import { Button } from "../ui/button.js";

interface CalenderHeaderProps {
  setDisplay: (display: "Week" | "Month") => void;
  CalenderDisplay: "Week" | "Month";
}
function CalenderHeader({ CalenderDisplay,setDisplay }: CalenderHeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl text-start font-bold  dark:text-white">
          {t("CALENDAR")}
        </h1>
        <p className="text-start  text-gray-500 dark:text-gray-400">
          {t("WEEK_OF")}
        </p>
      </div>
      <div className="flex ">
        <Button
          variant={"secondary"}
          size={"sm"}
          className={`mx-1 ${
            CalenderDisplay === "Week"
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-slate-100 dark:bg-slate-800"
          }`}
          onClick={() => setDisplay("Week")}
        >
          {t("WEEK")}
        </Button>
        <Button
          variant={"secondary"}
          size={"sm"}
          className={`mx-1 ${
            CalenderDisplay === "Month"
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-slate-100 dark:bg-slate-800"
          }`}
          onClick={() => setDisplay("Month")}
        >
          {t("MONTH")}
        </Button>
      </div>
    </header>
  );
}

export default CalenderHeader;
