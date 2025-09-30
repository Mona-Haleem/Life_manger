import { Mistral } from "@mistralai/mistralai";
import { IChatMessage } from "./interfaces.js";

export interface IAIService {
  //   parseFreeTextTasks(
  //     text: string,
  //     userId: string
  //   ): Promise<Array<{ title: string; dueDate?: string; estimateMinutes?: number }>>;
  generateAssistantReply(
    messages: IChatMessage[],
    userId: string
  ): Promise<IChatMessage>;
  //   summarizeTasks(tasks: any[]): Promise<string>;
}

export class AIService implements IAIService {
  private client: Mistral;

  constructor(apiKey: string) {
    this.client = new Mistral({ apiKey });
  }

  //   async parseFreeTextTasks(text: string) {
  //     const lines = text
  //       .split(/\n|;/)
  //       .map((l) => l.trim())
  //       .filter(Boolean);
  //     return lines.map((line) => ({ title: line }));
  //   }

  async generateAssistantReply(messages: IChatMessage[], userId: string) {
    try {
      console.log(messages)
      const mistralMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const chatResponse = await this.client.chat.complete({
        model: "mistral-large-latest",
        messages: mistralMessages,
      });

      let replyContent: string;

      const rawContent = chatResponse.choices[0].message.content;

      if (typeof rawContent === "string") {
        replyContent = rawContent;
      } else if (Array.isArray(rawContent)) {
        console.log("Raw content is an array:", rawContent);
        // Join content chunks if returned as array
        replyContent = ''//rawContent.map((c) => c.text ?? "").join("\n");
      } else {
        replyContent = "";
      }

      const reply: IChatMessage = {
        id: "ai-" + Date.now(),
        userId,
        role: "assistant",
        content: replyContent,
        created_at: new Date().toISOString(),
      };

      return reply;
    } catch (error) {
      console.error("Error during chat completion:", error);
      throw new Error("AI service failed to generate reply.");
    }
  }

  //   async summarizeTasks(tasks: any[]) {
  //     const count = tasks.length;
  //     return `You have ${count} tasks. Top: ${tasks
  //       .slice(0, 3)
  //       .map((t) => t.title)
  //       .join(', ')}`;
  //   }
}
