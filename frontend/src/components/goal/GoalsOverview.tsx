import { DefaultCard } from "../Cards/defaultCard.js";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import GoalProgress from "./GoalProgress";

function GoalsOverview() {
  const { goals } = useSelector((state: RootState) => state.goals);

  const { t } = useTranslation();
  return (
    <DefaultCard header={t("GOALS_OVERVIEW")}>
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalProgress key={goal.id} goal={goal} />
        ))}
      </div>
    </DefaultCard>
  );
}

export default GoalsOverview;
