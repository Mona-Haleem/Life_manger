// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/taskSlice";
import chatReducer from "./slices/chatSlice";
import userReducer from "./slices/userSlice";
import goalsReducer from "./slices/goalSlice";
import progressReducer from "./slices/progressSlice";
import uiReducer from "./slices/uiSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    goals: goalsReducer,
    chat: chatReducer,
    progress: progressReducer,
    ui: uiReducer,


  },
});

// Types for Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
