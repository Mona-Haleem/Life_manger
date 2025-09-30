import { MOCK_DATA } from "@/util/mockData";
import type { Goal } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: MOCK_DATA.goals,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    updateGoalProgress: (
      state,
      action: PayloadAction<{ id: number; progress: number }>
    ) => {
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (goal) {
        goal.progress = action.payload.progress;
      }
    },
  },
});

export const { updateGoalProgress } = goalsSlice.actions;
export default goalsSlice.reducer;
