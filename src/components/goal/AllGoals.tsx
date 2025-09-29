import { DefaultCard } from "../Cards/defaultCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import GoalCard from "./goalCard";

function AllGoals() {
  const { goals } = useSelector((state: RootState) => state.goals);

  const { t } = useTranslation();
  return (
    <DefaultCard header={t("CURRENTLY_WORKING")}>
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </DefaultCard>
  );
}

export default AllGoals;
