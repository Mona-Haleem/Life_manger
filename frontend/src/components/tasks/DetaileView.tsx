// src/components/tasks/DetaileView.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { closeDetail, openTaskDetail } from "@/store/slices/uiSlice";

import { addTask, updateTask, removeTask } from "@/store/slices/taskSlice";

import { type TaskPriority, type TaskStatus, type Task } from "@/util/type";
import { filterTasksByDate, format, parseISO } from "@/util/helpers";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/util/Constants";

const slideVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

export default function DetaileView() {
  const dispatch = useDispatch<AppDispatch>();
  const ui = useSelector((s: RootState) => s.ui);
  const tasks = useSelector((s: RootState) => s.tasks.tasks);

  // Find selected task (if any)
  const selectedTask = useMemo(
    () => tasks.find((t) => String(t.id) === String(ui.selectedTaskId)),
    [tasks, ui.selectedTaskId]
  );

  // For editing: local state copy if in task mode
  const [local, setLocal] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    if (ui.mode === "task" && selectedTask) {
      setLocal({ ...selectedTask });
    } else {
      setLocal(null);
    }
  }, [ui.mode, selectedTask]);

  // Day list tasks for ui.selectedDate
 const dayTasks = useMemo(() => {
  if (!ui.selectedDate) return [];
  const date = new Date(ui.selectedDate);
  if (isNaN(date.getTime())) return [];
  return filterTasksByDate(tasks, { day: date });
}, [tasks, ui.selectedDate]);


  const close = () => dispatch(closeDetail());

  // Save edits to the task
  const onSave = () => {
    if (!local || !local.id) return;
    dispatch(updateTask({ id: local.id, changes: local as Task }));
    // re-open to ensure UI stays consistent
    dispatch(closeDetail());
  };

  const onremove = (id: string | number) => {
    dispatch(removeTask(id));
    close();
  };

  // Add new task for day
 const onAddForDay = (dateISO: string) => {
  const start = new Date(dateISO);
  // Default start time at 09:00
  start.setHours(9, 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30); // default duration 30m

  const newTask: Task = {
    id: Date.now().toString(), // safer unique id
    title: "New Task",
    status: "pending",            // use your TaskStatus union type
    priority: "medium",
    duration: "00:30",
    description: "",
    deadline: dateISO,
    completed: false,
    assignedPeriod: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  };

  dispatch(addTask(newTask));
  dispatch(openTaskDetail({ taskId: newTask.id }));
};

  return (
    <AnimatePresence>
      {ui.isDetailOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[420px] bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.25 }}
            onClick={(e) => e.stopPropagation()} // prevent overlay click
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {ui.mode === "task" ? "Task details" : "Tasks for day"}
                </h3>
                <button
                  onClick={close}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-300"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {ui.mode === "task" && local && (
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Title
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      value={local.title ?? ""}
                      onChange={(e) =>
                        setLocal({ ...local, title: e.target.value })
                      }
                    />
                  </div>

                  {/* Status / Priority */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium">
                        Status
                      </label>
                      <select
                        value={local.status}
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            status: e.target.value as TaskStatus,
                          })
                        }
                        className="mt-1 block w-full rounded-md border px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium">
                        Priority
                      </label>
                      <select
                        value={local.priority}
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            priority: e.target.value as TaskPriority,
                          })
                        }
                        className="mt-1 block w-full rounded-md border px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      >
                        {TASK_PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duration + deadline */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium">
                        Duration
                      </label>
                      <input
                        className="mt-1 block w-full rounded-md border px-3 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        value={local.duration ?? ""}
                        onChange={(e) =>
                          setLocal({ ...local, duration: e.target.value })
                        }
                        placeholder="00:30"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium">
                        Deadline
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border px-3 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        value={
                          local.deadline
                            ? format(parseISO(local.deadline), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            deadline: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Assigned Period (Start / End) */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium">Start</label>
                      <input
                        type="datetime-local"
                        className="mt-1 block w-full rounded-md border px-3 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        value={
                          local.assignedPeriod?.start
                            ? format(
                                parseISO(local.assignedPeriod.start),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            assignedPeriod: {
                              ...local.assignedPeriod,
                              start: e.target.value
                                ? new Date(e.target.value).toISOString()
                                : "",
                              end: local.assignedPeriod?.end ?? "",
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium">End</label>
                      <input
                        type="datetime-local"
                        className="mt-1 block w-full rounded-md border px-3 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        value={
                          local.assignedPeriod?.end
                            ? format(
                                parseISO(local.assignedPeriod.end),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            assignedPeriod: {
                              ...local.assignedPeriod,
                              start: local.assignedPeriod?.start ?? "",
                              end: e.target.value
                                ? new Date(e.target.value).toISOString()
                                : "",
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      value={local.description ?? ""}
                      onChange={(e) =>
                        setLocal({ ...local, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="completed"
                        type="checkbox"
                        checked={!!local.completed}
                        onChange={(e) =>
                          setLocal({ ...local, completed: e.target.checked })
                        }
                      />
                      <label htmlFor="completed" className="text-sm">
                        Completed
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onremove(local.id!)}
                        className="px-3 py-1 rounded-md bg-red-500 text-white text-sm"
                      >
                        remove
                      </button>
                      <button
                        onClick={onSave}
                        className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {ui.mode === "day" && ui.selectedDate && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {format(parseISO(ui.selectedDate), "EEEE, MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-gray-400">
                        Tasks: {dayTasks.length}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onAddForDay(ui.selectedDate!)}
                        className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.length === 0 && (
                      <div className="text-sm text-gray-500">
                        No tasks for this day.
                      </div>
                    )}

                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2 rounded-md border border-gray-200 dark:border-gray-700 flex items-start gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <button
                              className="text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                              onClick={() =>
                                dispatch(openTaskDetail({ taskId: t.id }))
                              }
                            >
                              {t.title || "Untitled"}
                            </button>
                            <div className="text-xs text-gray-500">
                              {t.duration}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {t.description ?? ""}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              dispatch(openTaskDetail({ taskId: t.id }))
                            }
                            className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onremove(t.id)}
                            className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-600"
                          >
                            remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
