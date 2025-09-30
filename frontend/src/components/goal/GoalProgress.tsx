import type { Goal } from "@/util/type";
import { Progress } from "@/components/ui/progress";
interface GoalProgressProps {
  goal: Goal;
}
export default function GoalProgress({ goal }: GoalProgressProps) {
  return (
    <div key={goal.id}>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          {goal.title}
        </span>
        <span className="text-sm font-medium text-teal-500">
          {goal.progress}%
        </span>
      </div>
      <Progress
        value={goal.progress}
        max={100}
        className="bg-slate-100 shadow-sm "
      />
    </div>
  );
}
