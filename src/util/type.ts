import type React from "react";

export type Locale = 'en' | 'ar';
export interface User{
  name: string;
}
export interface Task {
  id: number | string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  parentId?: string;
}

export interface Goal {
  id: number;
  title: string;
  progress: number;
}

export interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
  type?: 'typing';
}

export interface ProgressSummary {
  completed: number;
  mostProductive: string;
  missed: number;
}

export  interface HeatmapDay {
  date: string;
  count: number;
}

export  interface AppData {
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
