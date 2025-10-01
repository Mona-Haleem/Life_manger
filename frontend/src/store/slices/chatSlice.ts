//import { MOCK_DATA } from "@/util/mockData";
import type { ChatMessage } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { sendChatMessage } from "../api/chatApi";
import { formatDate, formatTime } from "@/util/helpers";

interface ChatState {
  chatHistory: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
   chatHistory: [

//     {
//       role: "user",
//       content:
//         "hello manger, today is the first weekend in this new school year and i have a lot to do already from preparing a presentation about the asigned topic with the group , solving the math assignments , and finiding a 3 concept for the design lesson about hospital with macket for each and all that reserch about site and theories.  the teachers realy don't know how to take it easy and i barely have time or energy to work after school finish and getting at usually between 2 and 4 . i become so tired and once it reaches 6 i feal like the day ended and can't do any task and grouping them in my 3 days weekend is hard .one day of them is evenc ut in half cause i spent it with my grandparents . i also hoped that i could stay in track to finish everything at time insted of being stuck at last minute like every year and if i can streatch i wished i can start improving my language skills for example english pronunciation .",
//     },
//     {
//       role: "assistant",
//       content: `Got it—you’ve got a packed weekend, and balancing schoolwork, energy levels, and personal time is tough. Let’s break this down so it feels manageable and avoids last-minute stress.

// Here’s how I’d structure your tasks:

// Presentation (Group Work)
// Research the assigned topic (1 hour)
// Outline key points and divide sections among group members (1 hour)
// Draft your assigned slides (1.5 hours)
// Review/merge group slides and rehearse (1 hour)
// Math Assignments
// Review problem sets and identify tricky areas (30 min)
// Solve first half of assignments (1.5 hours)
// Solve second half of assignments (1.5 hours)
// Double-check solutions and format submission (30 min)
// Design Lesson (Hospital Concepts)
// Research hospital design theories/site analysis (1.5 hours)
// Sketch 3 initial concepts (1 hour per concept)
// Create simple mockups for each concept (1 hour per mockup)
// Refine and finalize mockups (1 hour)
// Language Skills (Stretch Goal)
// Practice English pronunciation (20 min daily)
// To create a schedule for this, I just need to know:

// Do you want to prioritize finishing everything before the weekend ends, or is there a later deadline for some tasks?
// Should I block time for breaks or adjust tasks around your energy peaks (e.g., lighter tasks after 4 PM)?
// Is the day with your grandparents this weekend, or next? And how much time will that take?
// Does this task list look correct? Anything missing or overestimated?
// `,
//     },
//     {
//       role: "user",
//       content:
//         "yes , let's go with energy peak , it's every week on friday i nearly get home by 3pm , yes the math assignment won't take an hour no need to break however thedesign i may need more time for the theories",
//     },
//     {
//       role: "assistant",
//       content: `Understood. I’ll adjust the math assignment to a single block and expand the design theory time. I’ll also schedule demanding tasks during your energy peaks (before 4 PM) and lighter ones after.

// Before I draft the schedule, two quick clarifications:

// How many hours total do you think you’ll need for the design theories/research? 2 hours? 3?
// For the group presentation, is there a deadline earlier than Monday, or is it flexible?
// Once you confirm, I’ll map this out across your weekend, accounting for your Friday 3 PM start and the half-day with grandparents`,
//     },
 ], //MOCK_DATA.chatHistory,
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
        console.log(action.payload);
        let answerText = action.payload?.message?.content;
        if (action.payload?.tasks) {
          let markdownOutput = `\n\n### Tasks\n\n`;
          markdownOutput += `| Title | Priority | Duration | Assigned Period | Deadline |\n`;
          markdownOutput += `|-------|----------|----------|-----------------|----------|\n`;

          answerText = action.payload.tasks
            ?.sort((a, b) => {
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
            .reduce(
              (content, task) =>
                (content += `| ${task.title} | ${task.priority} | ${task.duration} | ${
                  task.assignedPeriod
                    ? formatDate(task.assignedPeriod.start)
                    : "Not assigned"
                } | ${
                  task.assignedPeriod
                    ? `${formatTime(task.assignedPeriod.start)} → ${formatTime(
                        task.assignedPeriod.end
                      )}`
                    : "-"
                } | ${task.deadline || "N/A"} |\n`),
              answerText + markdownOutput
            );
        }

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
