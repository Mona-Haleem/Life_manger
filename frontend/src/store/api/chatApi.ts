// chatApi.ts
import api from "@/util/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { ChatMessage } from "@/util/type";
import type { RootState } from "../index";

interface ChatResponse {
  answer: string;
  [key: string]: unknown;
}

// now we send the full history
export const sendChatMessage = createAsyncThunk<
  ChatResponse, // return type
  string, // argument type (user's new message)
  { rejectValue: string; state: RootState }
>(
  "chat/sendChatMessage",
  async (userMessage, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const chatHistory: ChatMessage[] = state.chat.chatHistory;

      // include the new message in the history we send
      const updatedHistory =chatHistory.filter(msg => msg.type !=='typing');

      const res = await api.post("/chat", {
        history: updatedHistory,
      });

      console.log("Chat response:", res.data);
      return res.data.data.reply;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message ?? "Something went wrong"
      );
    }
  }
);
