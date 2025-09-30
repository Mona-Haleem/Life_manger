import type { Task } from "./type"

export function filterTasksByDate(
  tasks: Task[],
  options:
    | { day: Date } 
    | { start: Date; end: Date }
): Task[] {
  return tasks.filter((task) => {
    const taskStart = task.assignedPeriod?.start
      ? new Date(task.assignedPeriod.start)
      : task.deadline
      ? new Date(task.deadline)
      : null;

    const taskEnd = task.assignedPeriod?.end
      ? new Date(task.assignedPeriod.end)
      : taskStart;

    if (!taskStart) return false;

    if ("day" in options) {
      const targetDay = options.day;

      return (
        taskStart.toDateString() === targetDay.toDateString() ||
        taskEnd?.toDateString() === targetDay.toDateString()
      );
    }

    if ("start" in options && "end" in options) {
      return (
        taskStart <= options.end &&
        (taskEnd ?? taskStart) >= options.start
      );
    }

    return false;
  });
}

export function formatISO(
  date: Date,
  options: { representation?: "date" | "time" | "complete" } = { representation: "date" }
): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth is 0-based
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  switch (options.representation) {
    case "time":
      return `${hours}:${minutes}:${seconds}`;
    case "complete":
      // full ISO (without ms, with timezone Z)
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    case "date":
    default:
      return `${year}-${month}-${day}`;
  }
}

// src/util/date.ts
export function parseISO(isoString: string): Date {
  return new Date(isoString);
}

// src/util/date.ts

const pad = (n: number) => String(n).padStart(2, "0");

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];

/**
 * Minimal replacement for date-fns format.
 * Supports tokens: yyyy, MM, dd, HH, mm, ss, EEEE, MMM, MMMM, d
 */
export function format(date: Date, pattern: string): string {
  return pattern
    .replace(/yyyy/g, String(date.getFullYear()))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/dd/g, pad(date.getDate()))
    .replace(/HH/g, pad(date.getHours()))
    .replace(/mm/g, pad(date.getMinutes()))
    .replace(/ss/g, pad(date.getSeconds()))
    .replace(/EEEE/g, WEEKDAYS[date.getDay()])
    .replace(/MMMM/g, MONTHS_LONG[date.getMonth()])
    .replace(/MMM/g, MONTHS_SHORT[date.getMonth()])
    .replace(/\bd\b/g, String(date.getDate())); // plain day without leading 0
}

