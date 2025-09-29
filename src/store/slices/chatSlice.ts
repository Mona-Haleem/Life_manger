import { MOCK_DATA } from "@/util/mockData";
import type { ChatMessage } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface ChatState {
  chatHistory: ChatMessage[];
}

const initialState: ChatState = {
  chatHistory: MOCK_DATA.chatHistory,
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
        if (history.length > 0 && history[history.length - 1].type === "typing") {
          history.pop();
        }
      }
    },
  },
});

export const { addChatMessage, setChatTyping } = chatSlice.actions;
export default chatSlice.reducer;
