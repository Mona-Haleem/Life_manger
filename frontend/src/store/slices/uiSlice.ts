// src/store/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DetailMode = "task" | "day" | null;

interface UIState {
  isDetailOpen: boolean;
  mode: DetailMode;
  selectedTaskId?: string | number | null;
  selectedDate?: Date | null| string; 
}

const initialState: UIState = {
  isDetailOpen: false,
  mode: null,
  selectedTaskId: null,
  selectedDate: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openTaskDetail: (state, action: PayloadAction<{ taskId: string | number }>) => {
      state.isDetailOpen = true;
      state.mode = "task";
      state.selectedTaskId = action.payload.taskId;
      state.selectedDate = null;
    },
    openDayList: (state, action: PayloadAction<{ dateISO: string }>) => {
      state.isDetailOpen = true;
      state.mode = "day";
      state.selectedDate = action.payload.dateISO;
      state.selectedTaskId = null;
    },
    closeDetail: (state) => {
      state.isDetailOpen = false;
      state.mode = null;
      state.selectedTaskId = null;
      state.selectedDate = null;
    },
  },
});

export const { openTaskDetail, openDayList, closeDetail } = uiSlice.actions;
export default uiSlice.reducer;
