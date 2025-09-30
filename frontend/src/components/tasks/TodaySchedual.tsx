import { useSelector } from "react-redux";
import { DefaultCard } from "../Cards/defaultCard.js";
import type { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button.js";
import TodayTask from "./TodayTask";
import { filterTasksByDate } from "@/util/helpers";

function TodaySchedual() {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const  filteredTasks = filterTasksByDate(tasks, { day: new Date() });
  const { t } = useTranslation();

  return (
    <DefaultCard
      header={t("TODAY_SCHEDULE")}
      actions={
        <Button
          variant={"destructive"}
          className="text-teal-400 cursor-pointer shadow-none"
        >
          {t("ViewAll")}
        </Button>
      }
    >
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TodayTask key={task.id} task={task} />
        ))}
      </div>
    </DefaultCard>
  );
}

export default TodaySchedual;
