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
      if(task && task.completed){
        task.status = 'done';
      } 
      else if(task && !task.completed){
        if(Date.now() > new Date(task?.deadline || '').getTime()) task.status = 'missed';
        else task.status = 'pending';
      } 
    },
    cancelTask: (state, action: PayloadAction<string|number>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.status = 'canceled';
        task.completed = false;
      }
    },
    updateTask: (state, action: PayloadAction<{ id: string | number; changes: Partial<Task> }>) => {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.tasks[idx] = { ...state.tasks[idx], ...action.payload.changes };
      }
    },

    removeTask: (state, action: PayloadAction<string|number>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, toggleTask, removeTask, cancelTask,updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
