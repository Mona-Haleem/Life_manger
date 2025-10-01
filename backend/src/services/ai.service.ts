// import { Mistral } from "@mistralai/mistralai";
// import { IChatMessage } from "./interfaces.js";
// import { UserMessage } from "@mistralai/mistralai/models/components/usermessage.js";
// import { AssistantMessage } from "@mistralai/mistralai/models/components/assistantmessage.js";
// import { SystemMessage } from "@mistralai/mistralai/models/components/systemmessage.js";

// // export interface IAIService {
// //   //   parseFreeTextTasks(
// //   //     text: string,
// //   //     userId: string
// //   //   ): Promise<Array<{ title: string; dueDate?: string; estimateMinutes?: number }>>;
// //   generateAssistantReply(
// //     messages: IChatMessage[],
// //     userId: string
// //   ): Promise<IChatMessage>;
// //   //   summarizeTasks(tasks: any[]): Promise<string>;
// // }

// // export class AIService implements IAIService {
// //   private client: Mistral;

// //   constructor(apiKey: string) {
// //     this.client = new Mistral({ apiKey });
// //   }

// //   //   async parseFreeTextTasks(text: string) {
// //   //     const lines = text
// //   //       .split(/\n|;/)
// //   //       .map((l) => l.trim())
// //   //       .filter(Boolean);
// //   //     return lines.map((line) => ({ title: line }));
// //   //   }

// //   async generateAssistantReply(messages: IChatMessage[], userId: string) {
// //     try {
// //       console.log(messages)
// //       const mistralMessages = messages.map((m) => ({
// //         role: m.role,
// //         content: m.content,
// //       }));

// //       const chatResponse = await this.client.chat.complete({
// //         model: "mistral-large-latest",
// //         messages: mistralMessages,
// //       });

// //       let replyContent: string;

// //       const rawContent = chatResponse.choices[0].message.content;

// //       if (typeof rawContent === "string") {
// //         replyContent = rawContent;
// //       } else if (Array.isArray(rawContent)) {
// //         console.log("Raw content is an array:", rawContent);
// //         // Join content chunks if returned as array
// //         replyContent = ''//rawContent.map((c) => c.text ?? "").join("\n");
// //       } else {
// //         replyContent = "";
// //       }

// //       const reply: IChatMessage = {
// //         id: "ai-" + Date.now(),
// //         userId,
// //         role: "assistant",
// //         content: replyContent,
// //         created_at: new Date().toISOString(),
// //       };

// //       return reply;
// //     } catch (error) {
// //       console.error("Error during chat completion:", error);
// //       throw new Error("AI service failed to generate reply.");
// //     }
// //   }

// //   //   async summarizeTasks(tasks: any[]) {
// //   //     const count = tasks.length;
// //   //     return `You have ${count} tasks. Top: ${tasks
// //   //       .slice(0, 3)
// //   //       .map((t) => t.title)
// //   //       .join(', ')}`;
// //   //   }
// // }

// export type TaskStatus = "done" | "pending" | "missed" | "canceled";
// export type TaskPriority = "high" | "medium" | "low";

// export interface AssignedPeriod {
//   start: string; // ISO 8601 format (e.g., "2024-09-30T09:00:00Z")
//   end: string; // ISO 8601 format
// }

// export interface Task {
//   id: string;
//   title: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   duration: string; // e.g., "45 minutes", "2 hours"
//   description?: string;
//   assignedPeriod?: AssignedPeriod;
//   deadline?: string; // ISO 8601 format
//   parentId?: string;
//   notes?: string; // e.g., "Reason for being missed, difficulty assessment"
// }

// export interface UserContext {
//   userId: string;
//   context: string;
// }

// export interface AIResponse {
//   message: IChatMessage;
//   tasks?: Task[];
//   updatedContext?: string;
// }

// export interface IAIService {
//   processUserMessage(
//     messages: IChatMessage[],
//     userId: string,
//     userContext: string
//   ): Promise<AIResponse>;
// }

// export class AIService implements IAIService {
//   private client: Mistral;

//   constructor(apiKey: string) {
//     this.client = new Mistral({ apiKey });
//   }

//   /**
//    * This is the main orchestrator function. It decides which agent/tool to use.
//    */
//   async processUserMessage(
//     messages: IChatMessage[]
//     // userId: string,
//     //  userContext: string
//   ): Promise<AIResponse> {
//     const mistralMessages = messages.map((m) => ({
//       role: m.role,
//       content: m.content,
//     }));
//     const userContext = "";
//     // We inject the system prompt and user context at the beginning of the conversation.
//     const fullMessages = [
//       {
//         role: "system",
//         content: this.getOrchestratorSystemPrompt(userContext),
//       } as SystemMessage & { role: "system" },
//       ...messages.map((m) => {
//         if (m.role === "user") {
//           return { role: "user", content: m.content } as UserMessage & {
//             role: "user";
//           };
//         } else {
//           return {
//             role: "assistant",
//             content: m.content,
//           } as AssistantMessage & { role: "assistant" };
//         }
//       }),
//     ];

//     try {
//       const chatResponse = await this.client.chat.complete({
//         model: "mistral-large-latest",
//         messages: fullMessages,
//         toolChoice: "auto",
//         tools: this.getAvailableTools(),
//       });

//       const choice = chatResponse.choices[0];
//       const toolCalls = choice.message.toolCalls;

//       let response: AIResponse = {
//         message: {
//           id: `ai-${Date.now()}`,
//           //  userId,
//           role: "assistant",
//           content: "An error occurred.",
//           created_at: new Date().toISOString(),
//         },
//       };

//       if (toolCalls && toolCalls.length > 0) {
//         // --- AGENT 2: The Task Creator ---
//         // The model decided to call a tool.
//         const toolCall = toolCalls[0]; // Assuming one tool call for now
//         let args: any;
//         if (toolCall.function.name === "create_or_update_tasks") {
//           if (typeof toolCall.function.arguments === "string")
//             args = JSON.parse(toolCall.function.arguments);
//           else args = toolCall.function.arguments;

//           response.tasks = args.tasks as Task[];
//           response.message.content =
//             args.confirmation_message ||
//             "OK, I've updated your schedule. Take a look!";
//         }
//         // --- AGENT 3: The Context Extractor ---
//         else if (toolCall.function.name === "update_user_context") {
//           if (typeof toolCall.function.arguments === "string")
//             args = JSON.parse(toolCall.function.arguments);
//           else args = toolCall.function.arguments;
//           response.updatedContext = args.new_context_summary;
//           response.message.content =
//             "Thanks for sharing. I've updated my understanding of your habits and preferences to help me plan better in the future!";
//         }
//       } else {
//         // --- AGENT 1: The Planner (Default Conversational) ---
//         // The model decided to just chat.
//         response.message.content = choice.message.content as string;
//       }

//       return response;
//     } catch (error) {
//       console.error("Error during chat completion:", error);
//       throw new Error("AI service failed to generate reply.");
//     }
//   }

//   /**
//    * Defines the main system prompt that tells the AI how to act as an orchestrator.
//    */
//   private getOrchestratorSystemPrompt(userContext: string): string {
//     return `
//       You are "Manager," an empathetic and highly organized AI productivity assistant. Your goal is to help the user organize their life.

//       CURRENT USER CONTEXT:
//       ---
//       ${userContext || "No context available yet. This is a new user."}
//       ---

//       YOUR CORE BEHAVIORS:
//       1.  **Default to Conversation:** Engage in a friendly, planning-oriented chat. Help the user break down their thoughts. This is your primary mode.
//       2.  **Use Tools for Actions:** When the user's intent is clearly to create, schedule, or organize a list of tasks, you MUST use the 'create_or_update_tasks' tool to output the structured data.
//       3.  **Update Context:** After a significant conversation where you learn new, important details about the user's habits, preferences, or constraints, you MUST use the 'update_user_context' tool to summarize these new learnings.
//       4.  **Ask for Clarity:** Never create a task list with incomplete information. Always ask clarifying questions about deadlines, duration, and priorities before calling the 'create_or_update_tasks' tool.
//     `;
//   }

//   /**
//    * Defines the JSON schema for the tools the AI can call.
//    * This is how we get structured JSON output.
//    */
//   private getAvailableTools(): any[] {
//     return [
//       {
//         type: "function",
//         function: {
//           name: "create_or_update_tasks",
//           description:
//             "Creates new tasks or updates existing ones in a structured format based on the user conversation.",
//           parameters: {
//             type: "object",
//             required: ["tasks", "confirmation_message"],
//             properties: {
//               tasks: {
//                 type: "array",
//                 description: "An array of task objects.",
//                 items: {
//                   type: "object",
//                   required: ["id", "title", "status", "priority", "duration"],
//                   properties: {
//                     id: {
//                       type: "string",
//                       description:
//                         "A unique identifier for the task, can be a temporary string like 'task-1'.",
//                     },
//                     title: {
//                       type: "string",
//                       description: "The name of the task.",
//                     },
//                     status: {
//                       type: "string",
//                       enum: ["pending", "done", "missed", "canceled"],
//                     },
//                     priority: {
//                       type: "string",
//                       enum: ["high", "medium", "low"],
//                     },
//                     duration: {
//                       type: "string",
//                       description:
//                         'Estimated time to complete, e.g., "1 hour".',
//                     },
//                     description: {
//                       type: "string",
//                       description: "A more detailed description of the task.",
//                     },
//                     assignedPeriod: {
//                       type: "object",
//                       properties: {
//                         start: {
//                           type: "string",
//                           description: "The start time in ISO 8601 format.",
//                         },
//                         end: {
//                           type: "string",
//                           description: "The end time in ISO 8601 format.",
//                         },
//                       },
//                     },
//                     deadline: {
//                       type: "string",
//                       description: "The final deadline in ISO 8601 format.",
//                     },
//                     parentId: {
//                       type: "string",
//                       description:
//                         "The ID of the parent task if this is a sub-task.",
//                     },
//                     notes: {
//                       type: "string",
//                       description: "Any relevant notes about the task.",
//                     },
//                   },
//                 },
//               },
//               confirmation_message: {
//                 type: "string",
//                 description:
//                   "A friendly, conversational message to send to the user confirming that the tasks have been created or updated.",
//               },
//             },
//           },
//         },
//       },
//       {
//         type: "function",
//         function: {
//           name: "update_user_context",
//           description:
//             "Extracts and summarizes new user habits, preferences, or constraints from the conversation.",
//           parameters: {
//             type: "object",
//             required: ["new_context_summary"],
//             properties: {
//               new_context_summary: {
//                 type: "string",
//                 description:
//                   'A concise summary of new, important user information learned during the conversation (e.g., "User prefers to work in the morning and finds it hard to concentrate after 6 PM. Has a new long-term goal of learning English.")',
//               },
//             },
//           },
//         },
//       },
//     ];
//   }
// }
import { Mistral } from "@mistralai/mistralai";
import { IChatMessage } from "./interfaces.js";
import { UserMessage } from "@mistralai/mistralai/models/components/usermessage.js";
import { AssistantMessage } from "@mistralai/mistralai/models/components/assistantmessage.js";
import { SystemMessage } from "@mistralai/mistralai/models/components/systemmessage.js";

export type TaskStatus = "done" | "pending" | "missed" | "canceled";
export type TaskPriority = "high" | "medium" | "low";

export interface AssignedPeriod {
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  duration: string;
  description?: string;
  assignedPeriod?: AssignedPeriod;
  deadline?: string;
  parentId?: string;
  notes?: string;
}

export interface UserContext {
  userId: string;
  context: string;
}

export interface AIResponse {
  message: IChatMessage;
  tasks?: Task[];
  updatedContext?: string;
}

export interface IAIService {
  processUserMessage(
    messages: IChatMessage[],
    userId: string,
    userContext: string
  ): Promise<AIResponse>;
}

export class AIService implements IAIService {
  private client: Mistral;

  constructor(apiKey: string) {
    console.log("[AIService] Initializing Mistral client");
    this.client = new Mistral({ apiKey });
  }

  async processUserMessage(messages: IChatMessage[]): Promise<AIResponse> {
    console.log("[processUserMessage] Incoming messages:", messages);

    const mistralMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const userContext = `
    - the user schedual is school from monday till thrusday form 8.5am till 3pm
    - the user spend his friday with his grandparentd and get home at 3pm
    - the user get tired after going out especially in sunnydays and find it hard to do anything productive in the remaning time
    - the user prefer working in the morning than night 
    - the user can lose track of time when focused
    `;
    console.log("[processUserMessage] Using userContext:", userContext);

    const fullMessages = [
      {
        role: "system",
        content: this.getOrchestratorSystemPrompt(userContext),
      } as SystemMessage & { role: "system" },
      ...messages.map((m) => {
        if (m.role === "user") {
          return { role: "user", content: m.content } as UserMessage & {
            role: "user";
          };
        } else {
          return {
            role: "assistant",
            content: m.content,
          } as AssistantMessage & {
            role: "assistant";
          };
        }
      }),
    ];

    console.log(
      "[processUserMessage] Full messages sent to Mistral:",
      fullMessages
    );

    try {
      const chatResponse = await this.client.chat.complete({
        model: "mistral-large-latest",
        messages: fullMessages,
        toolChoice: "auto",
        tools: this.getAvailableTools(),
      });

      console.log("[processUserMessage] Chat response received:", chatResponse);

      const choice = chatResponse.choices[0];
      const toolCalls = choice.message.toolCalls;
      console.log("[processUserMessage] Tool calls detected:", toolCalls);

      let response: AIResponse = {
        message: {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: "An error occurred.",
          created_at: new Date().toISOString(),
        },
      };

      if (toolCalls && toolCalls.length > 0) {
        const toolCall = toolCalls[0];
        console.log("[processUserMessage] Handling tool call:", toolCall);

        let args: any;

        if (toolCall.function.name === "create_or_update_tasks") {
          console.log("[processUserMessage] Agent 2: Task Creator triggered");

          args =
            typeof toolCall.function.arguments === "string"
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

          console.log("[processUserMessage] Parsed task arguments:", args);

          response.tasks = args.tasks as Task[];
          response.message.content =
            args.confirmation_message ||
            "OK, I've updated your schedule. Take a look!";

          console.log(
            "[processUserMessage] Task creation response prepared:",
            response
          );
        } else if (toolCall.function.name === "update_user_context") {
          console.log(
            "[processUserMessage] Agent 3: Context Extractor triggered"
          );

          args =
            typeof toolCall.function.arguments === "string"
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

          console.log(
            "[processUserMessage] Parsed context update arguments:",
            args
          );

          response.updatedContext = args.new_context_summary;
          response.message.content =
            "Thanks for sharing. I've updated my understanding of your habits and preferences to help me plan better in the future!";

          console.log(
            "[processUserMessage] Context update response prepared:",
            response
          );
        }
      } else {
        console.log(
          "[processUserMessage] Agent 1: Planner (Default Conversation) triggered"
        );

        response.message.content = choice.message.content as string;
        console.log(
          "[processUserMessage] Planner response prepared:",
          response
        );
      }

      console.log("[processUserMessage] Final AI response:", response);
      return response;
    } catch (error) {
      console.error(
        "[processUserMessage] Error during chat completion:",
        error
      );
      throw new Error("AI service failed to generate reply.");
    }
  }

 private getOrchestratorSystemPrompt(userContext: string): string {
    console.log("[getOrchestratorSystemPrompt] Generating system prompt");
    return `You are **"Manager,"** a concise, empathetic, and proactive AI productivity assistant.
Your core function is to generate accurate, actionable, and conflict-free schedules, communicating like a capable human manager: brief, clear, and always matching the **user's language and tone**.

---

### CRITICAL SCHEDULING MANDATES (MANDATORY CHECKS)

You **MUST** strictly adhere to these rules before assigning any time slot, ensuring the schedule is realistic and adheres to the user's life constraints.

**USER CONTEXT:**
${userContext || "No context available yet. This is a new user."}

1.  **NEVER OVERRIDE FIXED BLOCKS:**
    * **Sleep:** Never schedule tasks between 11 PM - 8 AM.
    * **Appointments/Work:** Never schedule over fixed user-provided blocks (school, work, appointments).
    * **Habits:** Schedule *around* existing daily routines; do not disrupt them.

2.  **SMART TIME DISTRIBUTION (REQUIRED):**
    * **Energy Match:** Place difficult/creative tasks during the user's peak energy times (check context).
    * **Focus Limits:** Break tasks longer than the user's specified limit (e.g., max 90 min) into smaller, spaced sessions.
    * **Pacing:** Spread tasks across available days (do not cram them). Leave short buffers (15-30 min) between tasks.

---

### INTERACTION PHASES

#### Phase 1: Structuring & Confirmation (First Response)
You **MUST** remain in this phase until the user explicitly confirms the plan.

1.  **Tone Match:** Start with a brief, friendly, human acknowledgment (1-2 sentences).
2.  **Reframed Task List:** Present the user's input as a clear, easy-to-read list showing only **title and rough duration estimate**. Break large items into ~30–60 min subtasks.
3.  **Clarification:** Ask only 2–3 essential, naturally phrased questions needed for scheduling.
4.  **Confirmation Check:** End by asking: "Does this task list look right?"

#### Phase 2: EXECUTION & PERIOD ASSIGNMENT (MANDATORY AFTER CONFIRMATION)
You **ONLY** proceed to this phase after the user gives explicit confirmation ("yes," "looks good," "let's schedule," etc.).

**STEP A: ACCURATE PERIOD ASSIGNMENT (ABSOLUTELY NON-NEGOTIABLE)**
* You **MUST** immediately generate the complete schedule.
* For **EVERY SINGLE TASK**, you **MUST** populate all four \`assignedPeriod\` fields with accurate data. **FAIL IF ANY FIELD IS MISSING OR EMPTY.**
    * \`startDate\`: (ISO date, e.g., "2025-10-02")
    * \`startTime\`: (HH:MM format, e.g., "09:00")
    * \`endDate\`: (ISO date)
    * \`endTime\`: (HH:MM format)
* **CALCULATION RULE:** \`endTime\` **MUST** be \`startTime\` + duration. **NEVER** set \`startTime\` = \`endTime\`.
    * Example: 1.5 hr task at 16:00 → ends at 17:30.

**STEP B: REPORTING**
* Give a 1-2 sentence natural summary first.
* Show each task with its time: "Task Name: Mon Oct 2, 9:00-10:30 AM".
* Briefly explain key decisions based on context (e.g., "Placed this in the morning since you focus best then").

---

### GLOBAL DOs & DON'Ts

* **DO** match the user's tone and language.
* **DO NOT** leave the \`assignedPeriod\` structure empty or incomplete in Phase 2.
* **DO NOT** propose schedules before explicit confirmation.
* **DO NOT** use long, robotic intros or conclusions.
* **DO NOT** put all tasks on the same day when multiple days are available.
`;
}



  private getAvailableTools(): any[] {
    console.log("[getAvailableTools] Returning available tools");
    return [
      {
        type: "function",
        function: {
          name: "create_or_update_tasks",
          description:
            "Creates new tasks or updates existing ones in a structured format based on the user conversation.",
          parameters: {
            type: "object",
            required: ["tasks", "confirmation_message"],
            properties: {
              tasks: {
                type: "array",
                description: "An array of task objects.",
                items: {
                  type: "object",
                  required: ["assignedPeriod", "title", "status","description", "priority", "duration"],
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    status: {
                      type: "string",
                      enum: ["pending", "done", "missed", "canceled"],
                    },
                    priority: {
                      type: "string",
                      enum: ["high", "medium", "low"],
                    },
                    duration: { type: "string" },
                    description: { type: "string" },
                    assignedPeriod: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" },
                      },
                    },
                    deadline: { type: "string" },
                    parentId: { type: "string" },
                    notes: { type: "string" },
                  },
                },
              },
              confirmation_message: { type: "string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "update_user_context",
          description:
            "Extracts and summarizes new user habits, preferences, or constraints from the conversation.",
          parameters: {
            type: "object",
            required: ["new_context_summary"],
            properties: {
              new_context_summary: { type: "string" },
            },
          },
        },
      },
    ];
  }
}
