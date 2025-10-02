// chatSlice.ts
import type { ChatMessage } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { sendChatMessage } from "../api/chatApi";
import { formatDate, formatTime } from "@/util/helpers";

interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "file";
  data: string;
  mimeType: string;
}

interface ChatState {
  chatHistory: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatHistory: [],
  loading: false,
  error: null,
};

type UserMessageContent = { type: "text"; text: string };


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
          history.push({ role: "assistant", content: "", type: "typing" });
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
    clearChatHistory: (state) => {
      state.chatHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        // Create user message content
        const userMessageContent: UserMessageContent[] = [];
        
        // Add text
        if (action.meta.arg.text.trim()) {
          userMessageContent.push({
            type: "text",
            text: action.meta.arg.text,
          });
        }

        // Add attachments preview
        if (action.meta.arg.attachments && action.meta.arg.attachments.length > 0) {
          const attachmentNames = action.meta.arg.attachments
            .map((a) => a.name)
            .join(", ");
          
          userMessageContent.push({
            type: "text",
            text: `\n[Attached: ${attachmentNames}]`,
          });
        }

        // Format user message
        const userMessageText = userMessageContent
          .map((c) => c.text)
          .join("");

        state.chatHistory.push(
          {
            role: "user",
            content: userMessageText,
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

        // Remove typing indicator
        if (
          state.chatHistory.length > 0 &&
          state.chatHistory[state.chatHistory.length - 1].type === "typing"
        ) {
          state.chatHistory.pop();
        }

        console.log("[chatSlice] Received payload:", action.payload);

        let answerText = action.payload?.message?.content || "";

        // Format tasks if present
        if (action.payload?.tasks && action.payload.tasks.length > 0) {
          let markdownOutput = `\n\n### 📋 Tasks Schedule\n\n`;
          markdownOutput += `| Title | Priority | Duration | Date | Time | Deadline |\n`;
          markdownOutput += `|-------|----------|----------|------|------|----------|\n`;

          answerText = action.payload.tasks
            .sort((a, b) => {
              const startA = a.assignedPeriod?.start
                ? new Date(a.assignedPeriod.start).getTime()
                : Infinity;
              const startB = b.assignedPeriod?.start
                ? new Date(b.assignedPeriod.start).getTime()
                : Infinity;

              if (startA !== startB) return startA - startB;

              const priorityOrder: Record<string, number> = {
                high: 1,
                medium: 2,
                low: 3,
              };
              return (
                (priorityOrder[a.priority] || 99) -
                (priorityOrder[b.priority] || 99)
              );
            })
            .reduce((content, task) => {
              const priorityEmoji =
                task.priority === "high"
                  ? "🔴"
                  : task.priority === "medium"
                  ? "🟡"
                  : "🟢";

              return (
                content +
                `| ${task.title} | ${priorityEmoji} ${task.priority} | ${
                  task.duration
                } | ${
                  task.assignedPeriod
                    ? formatDate(task.assignedPeriod.start)
                    : "Not assigned"
                } | ${
                  task.assignedPeriod
                    ? `${formatTime(task.assignedPeriod.start)} → ${formatTime(
                        task.assignedPeriod.end
                      )}`
                    : "-"
                } | ${task.deadline || "N/A"} |\n`
              );
            }, answerText + markdownOutput);
        }

        // Add context update notification if present
        if (action.payload?.updatedContext) {
          answerText += `\n\n*✓ Updated my understanding of your preferences*`;
        }

        state.chatHistory.push({
          role: "assistant",
          content: answerText,
        });
      })

      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;

        // Remove typing indicator
        if (
          state.chatHistory.length > 0 &&
          state.chatHistory[state.chatHistory.length - 1].type === "typing"
        ) {
          state.chatHistory.pop();
        }

        state.error = action.payload ?? "Unknown error";
        
        state.chatHistory.push({
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again.",
        });
      });
  },
});

export const { addChatMessage, setChatTyping, clearChatHistory } =
  chatSlice.actions;
export default chatSlice.reducer;