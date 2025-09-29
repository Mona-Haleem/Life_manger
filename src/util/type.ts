import type React from "react";

export type Locale = "en" | "ar";
export interface User {
  name: string;
}

export type TaskStatus = "done" | "pending" | "missed" | "canceled";
export type TaskPriority = "high" | "medium" | "low";
export interface assignedPeriod {
 start: string; 
  end: string;   
}

export interface Task {
  id: string | number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  duration: string;
  description?: string;
  assignedPeriod?: assignedPeriod;
  deadline?: string;
  parentId?: string;
  completed: boolean;
}

export interface Goal {
  id: number;
  title: string;
  progress?: number;
  description?: string;
}

export interface ChatMessage {
  from: "user" | "ai";
  text: string;
  type?: "typing";
}

export interface ProgressSummary {
  completed: number;
  mostProductive: string;
  missed: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface AppData {
  user: { name: string };
  todaySchedule: Task[];
  goals: Goal[];
  chatHistory: ChatMessage[];
  progress: {
    summary: ProgressSummary;
    heatmap: HeatmapDay[];
  };
}

export interface AppState {
  data: AppData;
  activePage: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.JSX.Element;
}
