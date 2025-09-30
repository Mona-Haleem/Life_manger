import { MOCK_DATA } from "@/util/mockData";
import type { ChatMessage } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { sendChatMessage } from "../api/chatApi";

interface ChatState {
  chatHistory: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatHistory: [], //MOCK_DATA.chatHistory,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    setChatTyping: (state, action: PayloadAction<boolean>) => {
      const history = state.chatHistory;
      const isTyping = action.payload;

      if (isTyping) {
        if (
          history.length === 0 ||
          history[history.length - 1].type !== "typing"
        ) {
          history.push({ from: "ai", text: "", type: "typing" });
        }
      } else {
        if (
          history.length > 0 &&
          history[history.length - 1].type === "typing"
        ) {
          history.pop();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        state.chatHistory.push(
          {
            role: "user",
            content: action.meta.arg,
          },
          {
            role: "assistant",
            content: "",
            type: "typing",
          }
        );
      })
      
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;

        if (
          state.chatHistory.length > 0 &&
          state.chatHistory[state.chatHistory.length - 1].type === "typing"
        ) {
          state.chatHistory.pop();
        }
        console.log(action.payload)
        const answerText =
          typeof action.payload?.content === "string"
            ? action.payload?.content
            : JSON.stringify(action.payload);

        state.chatHistory.push({
          role: "assistant",
          content: answerText,
        });
      })

      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        if (
          state.chatHistory.length > 0 &&
          state.chatHistory[state.chatHistory.length - 1].type === "typing"
        ) {
          state.chatHistory.pop();
        }
        state.error = action.payload ?? "Unknown error";
        state.chatHistory.push({
          role: "assistant",
          content: "Sorry, I couldn't process that request.",
        });
      });
  },
});

export const { addChatMessage, setChatTyping } = chatSlice.actions;
export default chatSlice.reducer;
