import { MOCK_DATA } from "@/util/mockData";
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "@/util/type";
interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: MOCK_DATA.todaySchedule,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action: PayloadAction<string|number>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    removeTask: (state, action: PayloadAction<string|number>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, toggleTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
