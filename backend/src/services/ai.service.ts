// import { Mistral } from "@mistralai/mistralai";
// import { IChatMessage } from "./interfaces.js";
// import { UserMessage } from "@mistralai/mistralai/models/components/usermessage.js";
// import { AssistantMessage } from "@mistralai/mistralai/models/components/assistantmessage.js";
// import { SystemMessage } from "@mistralai/mistralai/models/components/systemmessage.js";

// export type TaskStatus = "done" | "pending" | "missed" | "canceled";
// export type TaskPriority = "high" | "medium" | "low";

// export interface AssignedPeriod {
//   start: string; // ISO 8601 format
//   end: string; // ISO 8601 format
// }

// export interface Task {
//   id: string;
//   title: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   duration: string;
//   description?: string;
//   assignedPeriod?: AssignedPeriod;
//   deadline?: string;
//   parentId?: string;
//   notes?: string;
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
//     console.log("[AIService] Initializing Mistral client");
//     this.client = new Mistral({ apiKey });
//   }

//   async processUserMessage(messages: IChatMessage[]): Promise<AIResponse> {
//     console.log("[processUserMessage] Incoming messages:", messages);

//     const mistralMessages = messages.map((m) => ({
//       role: m.role,
//       content: m.content,
//     }));
//     const userContext = `
//     - the user schedual is school from monday till thrusday form 8.5am till 3pm
//     - the user spend his friday with his grandparentd and get home at 3pm
//     - the user get tired after going out especially in sunnydays and find it hard to do anything productive in the remaning time
//     - the user prefer working in the morning than night
//     - the user can lose track of time when focused
//     `;
//     console.log("[processUserMessage] Using userContext:", userContext);

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
//           } as AssistantMessage & {
//             role: "assistant";
//           };
//         }
//       }),
//     ];

//     console.log(
//       "[processUserMessage] Full messages sent to Mistral:",
//       fullMessages
//     );

//     try {
//       const chatResponse = await this.client.chat.complete({
//         model: "mistral-large-latest",
//         messages: fullMessages,
//         toolChoice: "auto",
//         tools: this.getAvailableTools(),
//       });

//       console.log("[processUserMessage] Chat response received:", chatResponse);

//       const choice = chatResponse.choices[0];
//       const toolCalls = choice.message.toolCalls;
//       console.log("[processUserMessage] Tool calls detected:", toolCalls);

//       let response: AIResponse = {
//         message: {
//           id: `ai-${Date.now()}`,
//           role: "assistant",
//           content: "An error occurred.",
//           created_at: new Date().toISOString(),
//         },
//       };

//       if (toolCalls && toolCalls.length > 0) {
//         const toolCall = toolCalls[0];
//         console.log("[processUserMessage] Handling tool call:", toolCall);

//         let args: any;

//         if (toolCall.function.name === "create_or_update_tasks") {
//           console.log("[processUserMessage] Agent 2: Task Creator triggered");

//           args =
//             typeof toolCall.function.arguments === "string"
//               ? JSON.parse(toolCall.function.arguments)
//               : toolCall.function.arguments;

//           console.log("[processUserMessage] Parsed task arguments:", args);

//           response.tasks = args.tasks as Task[];
//           response.message.content =
//             args.confirmation_message ||
//             "OK, I've updated your schedule. Take a look!";

//           console.log(
//             "[processUserMessage] Task creation response prepared:",
//             response
//           );
//         } else if (toolCall.function.name === "update_user_context") {
//           console.log(
//             "[processUserMessage] Agent 3: Context Extractor triggered"
//           );

//           args =
//             typeof toolCall.function.arguments === "string"
//               ? JSON.parse(toolCall.function.arguments)
//               : toolCall.function.arguments;

//           console.log(
//             "[processUserMessage] Parsed context update arguments:",
//             args
//           );

//           response.updatedContext = args.new_context_summary;
//           response.message.content =
//             "Thanks for sharing. I've updated my understanding of your habits and preferences to help me plan better in the future!";

//           console.log(
//             "[processUserMessage] Context update response prepared:",
//             response
//           );
//         }
//       } else {
//         console.log(
//           "[processUserMessage] Agent 1: Planner (Default Conversation) triggered"
//         );

//         response.message.content = choice.message.content as string;
//         console.log(
//           "[processUserMessage] Planner response prepared:",
//           response
//         );
//       }

//       console.log("[processUserMessage] Final AI response:", response);
//       return response;
//     } catch (error) {
//       console.error(
//         "[processUserMessage] Error during chat completion:",
//         error
//       );
//       throw new Error("AI service failed to generate reply.");
//     }
//   }

//  private getOrchestratorSystemPrompt(userContext: string): string {
//     console.log("[getOrchestratorSystemPrompt] Generating system prompt");
//     return `You are **"Manager,"** a concise, empathetic, and proactive AI productivity assistant.
// Your core function is to generate accurate, actionable, and conflict-free schedules, communicating like a capable human manager: brief, clear, and always matching the **user's language and tone**.

// ---

// ### CRITICAL SCHEDULING MANDATES (MANDATORY CHECKS)

// You **MUST** strictly adhere to these rules before assigning any time slot, ensuring the schedule is realistic and adheres to the user's life constraints.

// **USER CONTEXT:**
// ${userContext || "No context available yet. This is a new user."}

// 1.  **NEVER OVERRIDE FIXED BLOCKS:**
//     * **Sleep:** Never schedule tasks between 11 PM - 8 AM.
//     * **Appointments/Work:** Never schedule over fixed user-provided blocks (school, work, appointments).
//     * **Habits:** Schedule *around* existing daily routines; do not disrupt them.

// 2.  **SMART TIME DISTRIBUTION (REQUIRED):**
//     * **Energy Match:** Place difficult/creative tasks during the user's peak energy times (check context).
//     * **Focus Limits:** Break tasks longer than the user's specified limit (e.g., max 90 min) into smaller, spaced sessions.
//     * **Pacing:** Spread tasks across available days (do not cram them). Leave short buffers (15-30 min) between tasks.

// ---

// ### INTERACTION PHASES

// #### Phase 1: Structuring & Confirmation (First Response)
// You **MUST** remain in this phase until the user explicitly confirms the plan.

// 1.  **Tone Match:** Start with a brief, friendly, human acknowledgment (1-2 sentences).
// 2.  **Reframed Task List:** Present the user's input as a clear, easy-to-read list showing only **title and rough duration estimate**. Break large items into ~30–60 min subtasks.
// 3.  **Clarification:** Ask only 2–3 essential, naturally phrased questions needed for scheduling.
// 4.  **Confirmation Check:** End by asking: "Does this task list look right?"

// #### Phase 2: EXECUTION & PERIOD ASSIGNMENT (MANDATORY AFTER CONFIRMATION)
// You **ONLY** proceed to this phase after the user gives explicit confirmation ("yes," "looks good," "let's schedule," etc.).

// **STEP A: ACCURATE PERIOD ASSIGNMENT (ABSOLUTELY NON-NEGOTIABLE)**
// * You **MUST** immediately generate the complete schedule.
// * For **EVERY SINGLE TASK**, you **MUST** populate all four \`assignedPeriod\` fields with accurate data. **FAIL IF ANY FIELD IS MISSING OR EMPTY.**
//     * \`startDate\`: (ISO date, e.g., "2025-10-02")
//     * \`startTime\`: (HH:MM format, e.g., "09:00")
//     * \`endDate\`: (ISO date)
//     * \`endTime\`: (HH:MM format)
// * **CALCULATION RULE:** \`endTime\` **MUST** be \`startTime\` + duration. **NEVER** set \`startTime\` = \`endTime\`.
//     * Example: 1.5 hr task at 16:00 → ends at 17:30.

// **STEP B: REPORTING**
// * Give a 1-2 sentence natural summary first.
// * Show each task with its time: "Task Name: Mon Oct 2, 9:00-10:30 AM".
// * Briefly explain key decisions based on context (e.g., "Placed this in the morning since you focus best then").

// ---

// ### GLOBAL DOs & DON'Ts

// * **DO** match the user's tone and language.
// * **DO NOT** leave the \`assignedPeriod\` structure empty or incomplete in Phase 2.
// * **DO NOT** propose schedules before explicit confirmation.
// * **DO NOT** use long, robotic intros or conclusions.
// * **DO NOT** put all tasks on the same day when multiple days are available.
// `;
// }

//   private getAvailableTools(): any[] {
//     console.log("[getAvailableTools] Returning available tools");
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
//                   required: ["assignedPeriod", "title", "status","description", "priority", "duration"],
//                   properties: {
//                     id: { type: "string" },
//                     title: { type: "string" },
//                     status: {
//                       type: "string",
//                       enum: ["pending", "done", "missed", "canceled"],
//                     },
//                     priority: {
//                       type: "string",
//                       enum: ["high", "medium", "low"],
//                     },
//                     duration: { type: "string" },
//                     description: { type: "string" },
//                     assignedPeriod: {
//                       type: "object",
//                       properties: {
//                         start: { type: "string" },
//                         end: { type: "string" },
//                       },
//                     },
//                     deadline: { type: "string" },
//                     parentId: { type: "string" },
//                     notes: { type: "string" },
//                   },
//                 },
//               },
//               confirmation_message: { type: "string" },
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
//               new_context_summary: { type: "string" },
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
import { TextChunk } from "@mistralai/mistralai/models/components/textchunk.js";
import { ImageURLChunk } from "@mistralai/mistralai/models/components/imageurlchunk.js";

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
    newMessage?: any,
    attachments?: AttachedFile[]
  ): Promise<AIResponse>;
}

interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "file" | "audio";
  data: string;
  mimeType: string;
}
type MessageContent =
  | string
  | Array<{
      type: "text" | "image_url";
      text?: string;
      image_url?: string;
      input_audio?: string;
    }>;

export class AIService implements IAIService {
  private client: Mistral;

  constructor(apiKey: string) {
    console.log("[AIService] Initializing Mistral client");
    this.client = new Mistral({ apiKey });
  }

  async processUserMessage(
    messages: IChatMessage[],
    newMessage?: any,
    attachments?: AttachedFile[]
  ): Promise<AIResponse> {
    console.log("[processUserMessage] Incoming messages:", messages);
    console.log("[processUserMessage] New message:", newMessage);
    console.log("[processUserMessage] Attachments:", attachments);

    const userContext = `
    - the user schedule is school from monday till thursday from 8:30am till 3pm
    - the user spends his friday with his grandparents and gets home at 3pm
    - the user gets tired after going out especially on sunny days and finds it hard to do anything productive in the remaining time
    - the user prefers working in the morning than at night 
    - the user can lose track of time when focused
    `;
    console.log("[processUserMessage] Using userContext:", userContext);

    // Determine which model to use based on attachments
    const hasImages = attachments?.some((a) => a.type === "image");
    const model = hasImages ? "pixtral-12b-latest" : "mistral-large-latest";
    console.log("[processUserMessage] Selected model:", model);

    // Build messages array
    const fullMessages: any[] = [
      {
        role: "system",
        content: this.getOrchestratorSystemPrompt(userContext, hasImages),
      } as SystemMessage & { role: "system" },
    ];
    console.log("recieved messages", messages);
    // Add conversation history
    for (const m of messages) {
      if (m.role === "user") {
        fullMessages.push({
          role: "user",
          content: m.content,
        } as UserMessage & { role: "user" });
      } else {
        fullMessages.push({
          role: "assistant",
          content: m.content,
        } as AssistantMessage & { role: "assistant" });
      }
    }

    // Add new message with multimodal content
    if (newMessage) {
      const content: any[] = [];

      if (Array.isArray(newMessage.content)) {
        for (const item of newMessage.content) {
          if (item.type === "text") {
            content.push({
              type: "text",
              text: item.text,
            });
          } else if (item.type === "image_url") {
            content.push({
              type: "image_url",
              image_url: item.image_url,
            });
          } else if (item.type === "input_audio") {
            content.push({
              type: "text",
              text: await this.transcribeWithSdk(item.input_audio),
            });
            console.log(content);
          }
        }
      } else if (typeof newMessage.content === "string") {
        content.push({
          type: "text",
          text: newMessage.content,
        });
      }

      fullMessages.push({
        role: "user",
        content: content,
      });
    }

    console.log(
      "[processUserMessage] Full messages sent to Mistral:",
      JSON.stringify(fullMessages, null, 2)
    );

    try {
      const chatResponse = await this.client.chat.complete({
        model,
        messages: fullMessages,
        toolChoice: "auto",
        tools: this.getAvailableTools(),
      });

      // console.log("[processUserMessage] Chat response received:", chatResponse);

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
        } else if (toolCall.function.name === "extract_tasks_from_media") {
          console.log(
            "[processUserMessage] Agent 4: Media Task Extractor triggered"
          );

          args =
            typeof toolCall.function.arguments === "string"
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

          console.log(
            "[processUserMessage] Parsed media extraction arguments:",
            args
          );

          response.message.content =
            args.extracted_text ||
            "I've extracted the information from your media. Let me help you organize it.";

          console.log(
            "[processUserMessage] Media extraction response prepared:",
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

  private getOrchestratorSystemPrompt(
    userContext: string,
    hasImages: boolean = false
  ): string {
    console.log("[getOrchestratorSystemPrompt] Generating system prompt");

    const imageInstructions = hasImages
      ? `

### IMAGE ANALYSIS CAPABILITIES
You have access to image analysis. When users send images:
- **Screenshots/Photos of Tasks**: Extract task lists, to-do items, schedules, handwritten notes
- **Whiteboards/Sticky Notes**: Identify planning sessions, brainstorming items
- **Documents**: Extract text from receipts, bills, assignments, schedules
- **Charts/Calendars**: Understand existing schedules and deadlines

Always acknowledge what you see in images and extract actionable items automatically.`
      : "";

    return `You are **"Manager,"** a concise, empathetic, and proactive AI productivity assistant.
Your core function is to generate accurate, actionable, and conflict-free schedules, communicating like a capable human manager: brief, clear, and always matching the **user's language and tone**.

You can now process information from multiple sources:
- Text input (conversations)
- Images (screenshots, photos, documents)
- Voice recordings (transcribed to text)
- Files (PDFs, text documents)
${imageInstructions}


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

3.  **MULTIMODAL INPUT HANDLING:**
    * When processing images/files, first acknowledge what you received
    * Extract all actionable items, deadlines, and tasks
    * Ask clarifying questions about priorities or unclear items
    * Integrate extracted tasks with user's existing schedule

---

### INTERACTION PHASES

#### Phase 1: Structuring & Confirmation (First Response)
You **MUST** remain in this phase until the user explicitly confirms the plan.

1.  **Tone Match:** Start with a brief, friendly, human acknowledgment (1-2 sentences).
    * If media was received: "I see you've shared [type of content]. Let me extract the tasks from this."
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
* **DO** acknowledge and process all forms of input (text, images, files, voice)
* **DO** extract tasks from images intelligently (handwriting, typed text, tables)
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
            "Creates new tasks or updates existing ones in a structured format based on the user conversation or extracted from media/files.",
          parameters: {
            type: "object",
            required: ["tasks", "confirmation_message"],
            properties: {
              tasks: {
                type: "array",
                description: "An array of task objects.",
                items: {
                  type: "object",
                  required: [
                    "assignedPeriod",
                    "title",
                    "status",
                    "description",
                    "priority",
                    "duration",
                  ],
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
                      required: ["start", "end"],
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
      {
        type: "function",
        function: {
          name: "extract_tasks_from_media",
          description:
            "Extracts tasks, deadlines, and actionable items from images, PDFs, or other media. Use this when the user shares screenshots, photos of notes, documents, or files containing task information.",
          parameters: {
            type: "object",
            required: ["extracted_text", "identified_tasks"],
            properties: {
              extracted_text: {
                type: "string",
                description: "The full text extracted from the media",
              },
              identified_tasks: {
                type: "array",
                description: "List of tasks identified in the media",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    deadline: { type: "string" },
                    priority: { type: "string" },
                    notes: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    ];
  }

 private async transcribeWithSdk(base64: string, fileName = "audio.wav") {
  // Convert base64 to raw binary buffer
  const audioBuffer = Buffer.from(base64, "base64");

  // Call Mistral transcription API via SDK
  const response = await this.client.audio.transcriptions.complete({
    model: "voxtral-mini-latest",
    file: {
      fileName,
      content: audioBuffer,
    },
  });

  // Depending on SDK version, the response may include more than just text
  return response.text; // transcription string
}

}
