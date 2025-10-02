import type React from "react";
export interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "file" | "audio";
  data: string; // base64 or text content
  mimeType: string;
  size?: number;
  thumbnail?: string; // For images
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | MultimodalContent[];
  created_at?: string;
  type?: "typing" | "normal";
  attachments?: AttachedFile[];
}

export interface MultimodalContent {
  type: "text" | "image_url";
  text?: string;
  imageUrl?: string;
}


export interface UserContext {
  userId: string;
  preferences: {
    workingHours?: { start: string; end: string };
    energyPeaks?: string[];
    maxFocusTime?: number; // in minutes
    breakPreferences?: string;
  };
  schedule: {
    fixedBlocks?: Array<{
      day: string;
      start: string;
      end: string;
      description: string;
    }>;
    habits?: string[];
  };
  learnings: string[]; // AI-learned habits and patterns
}

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
  notes?: string;
  source?: "text" | "image" | "file" | "voice"; // Track where task came from
}

export interface Goal {
  id: number;
  title: string;
  progress?: number;
  description?: string;
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
