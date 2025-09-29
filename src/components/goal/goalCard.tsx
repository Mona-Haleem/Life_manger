import type { Task } from "@/util/type";

interface GoalCardProps {
  goal: Task;
  className?: string;
}
function GoalCard({goal, className}: GoalCardProps) {
  return (
    <div className={`bg-purple-500/10 mb-2 dark:bg-purple-500/20 p-4 rounded-lg ${className}`}>
      <h3 className="font-semibold text-purple-800 dark:text-purple-300">
        {goal.title}
      </h3>
      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
        {goal.description}
      </p>
    </div>
  );
}

export default GoalCard;
