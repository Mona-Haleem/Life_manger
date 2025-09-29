import { cancelTask, toggleTask } from "@/store/slices/taskSlice";
import theme from "@/util/theme";
import type { Task } from "@/util/type";
import { Check, Clock3, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

interface TodayTaskProps {
  task: Task;
}
function TodayTask({ task }: TodayTaskProps) {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const colorTheme = theme(i18n.dir() === "rtl");
  const direction = i18n.dir() as "ltr" | "rtl";
  const handleToggleTask = (taskId: number | string) => {
    dispatch(toggleTask(taskId));
  };
  const handleCancelTask = (taskId: number | string) => {
    dispatch(cancelTask(taskId));
  };
  return (
    <>
      {/* /  <div
    //     key={task.id}
    //     className={`flex items-center gap-3 ${
    //       direction === "rtl" ? "flex-row-reverse" : "flex-row"
    //     }`}
    //   >
    //     <input
    //       type="checkbox"
    //       checked={task.completed}
    //       onChange={() => handleToggleTask(task.id)}
    //       className="h-5 w-5 rounded text-teal-500 focus:ring-teal-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-pointer"
    //     />
    //     <span
    //       className={`${
    //         task.completed
    //           ? "line-through text-gray-400"
    //           : "text-gray-700 dark:text-gray-300"
    //       } text-base`}
    //     >
    //       {task.title}
    //     </span>
    //   </div> */}
      <div
        className={`flex items-start gap-3 p-3 rounded-xl ${
          colorTheme.hover
        } transition-colors ${
          direction === "rtl" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleToggleTask(task.id)}
          className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            task.status === "done"
              ? "bg-teal-500 border-teal-500"
              : task.status === "pending"
              ? "bg-purple-500 border-purple-500"
              : task.status === "missed"
              ? "bg-red-500 border-red-500"
              : "border-gray-300"
          }`}
        >
          {task.status === "done" && <Check className="w-3 h-3 text-white" />}
        </Button>

        <div className="flex-1 min-w-0 text-start">
          <p
            className={`font-medium ${colorTheme.text} ${
              task.status === "done" || task.status === "canceled"
                ? "line-through  text-gray-400 dark:text-gray-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`text-xs ${colorTheme.textMuted} flex items-center gap-1`}
            >
              <Clock3 className="w-3 h-3" />
              {task.deadline}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  : task.priority === "medium"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
        <span className={`text-xs ${colorTheme.textMuted}`}>
          {task.duration}
        </span>
        <X
          size={20}
          className="p-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-red-200 cursor-pointer"
          onClick={() => handleCancelTask(task.id)}
        />
      </div>
    </>
  );
}

export default TodayTask;
