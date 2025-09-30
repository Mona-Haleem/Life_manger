import { MOCK_DATA } from "@/util/mockData";
import type { HeatmapDay, ProgressSummary } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  summary: ProgressSummary;
  heatmap: HeatmapDay[];
}

const initialState: ProgressState = MOCK_DATA.progress;

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    updateSummary: (state, action: PayloadAction<ProgressSummary>) => {
      state.summary = action.payload;
    },
    updateHeatmapEntry: (
      state,
      action: PayloadAction<{ date: string; count: number }>
    ) => {
      const entry = state.heatmap.find((h) => h.date === action.payload.date);
      if (entry) {
        entry.count = action.payload.count;
      } else {
        state.heatmap.push(action.payload);
      }
    },
  },
});

export const { updateSummary, updateHeatmapEntry } = progressSlice.actions;
export default progressSlice.reducer;
