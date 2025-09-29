import type { AppData } from "./type";

export const MOCK_DATA: AppData = {
  user: {
    name: "Mona",
  },
  todaySchedule: [
    { id: 1, title: "Review Q3 projection slides", completed: true },
    {
      id: 2,
      title: "Draft follow-up email to the design team",
      completed: true,
    },
    { id: 3, title: "Prep for 1:1 with Alex", completed: false },
    { id: 4, title: "English practice: 15min on Duolingo", completed: false },
  ],
  goals: [
    { id: 1, title: "Launch New Feature", progress: 75 },
    { id: 2, title: "Complete Q3 OKRs", progress: 40 },
    { id: 3, title: "Onboard new hire", progress: 90 },
  ],
  chatHistory: [
    {
      from: "user",
      text: "Hey, can you help me organize my tasks for tomorrow?",
    },
    {
      from: "ai",
      text: "Of course, Mona! Just list them out and I'll create a prioritized schedule for you.",
    },
    {
      from: "user",
      text: "Okay: finish report, call mom, gym, buy groceries, team sync",
    },
    { from: "ai", type: "typing" },
  ],
  progress: {
    summary: { completed: 80, mostProductive: "10am", missed: 2 },
    heatmap: [
      { date: "2025-09-01", count: 2 },
      { date: "2025-09-02", count: 4 },
      { date: "2025-09-03", count: 1 },
      { date: "2025-09-04", count: 5 },
      { date: "2025-09-05", count: 0 },
      { date: "2025-09-06", count: 3 },
      { date: "2025-09-07", count: 5 },
      { date: "2025-09-08", count: 4 },
      { date: "2025-09-09", count: 1 },
      { date: "2025-09-10", count: 2 },
      { date: "2025-09-11", count: 5 },
      { date: "2025-09-12", count: 4 },
      { date: "2025-09-13", count: 3 },
      { date: "2025-09-14", count: 0 },
      { date: "2025-09-15", count: 5 },
    ],
  },
};
