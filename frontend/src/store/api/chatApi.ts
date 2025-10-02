// chatApi.ts
import api from "@/util/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { ChatMessage } from "@/util/type";
import type { RootState } from "../index";
import { attachedFileToFile, base64ToBlob } from "@/util/helpers";

interface ChatMessagePayload {
  text: string;
  attachments?: File[]; // Use File objects directly
}

interface ChatResponse {
  answer: string;
  [key: string]: unknown;
}

type ChatContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: string }
  | { type: "input_audio"; input_audio: string };

interface ChatNewMessage {
  role: "user" | "assistant" | "system";
  content: ChatContent[];
}

// Send message with multimodal support
export const sendChatMessage = createAsyncThunk<
  ChatResponse,
  ChatMessagePayload,
  { rejectValue: string; state: RootState }
>("chat/sendChatMessage", async (payload, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const chatHistory: ChatMessage[] = state.chat.chatHistory;

    const updatedHistory = chatHistory.filter((msg) => msg.type !== "typing");

    const newMessage: ChatNewMessage = {
      role: "user",
      content: [],
    };

    if (payload.text.trim()) {
      newMessage.content.push({ type: "text", text: payload.text });
    }

    // Upload attachments to backend -> Cloudinary
    // let uploadedFiles: {
    //   url: string;
    //   type: "image" | "file" | "audio";
    //   name: string;
    // }[] = [];

    if (payload.attachments && payload.attachments.length > 0) {
      // Separate audio files from others
      const audioFiles: File[] = [];
      const otherFiles: File[] = [];

      for (const file of payload.attachments) {
        if (file.type.startsWith("audio")) {
          audioFiles.push(file);
        } else {
          otherFiles.push(file);
        }
      }

      // Handle audio files - send as base64 directly
      for (const audioFile of audioFiles) {
        //  const base64Audio = await fileToBase64(audioFile);
        newMessage.content.push({
          type: "input_audio",
          input_audio: audioFile.data,
        });
      }
      console.log(newMessage)

      // Handle other files (images, documents) - upload to Cloudinary
      if (otherFiles.length > 0) {
        const formData = new FormData();
        otherFiles.forEach((file) =>
          formData.append("files", attachedFileToFile(file))
        );

        const uploadRes = await api.post("/chat/upload", formData);
        const uploadedFiles = uploadRes.data.data.files;

        for (const file of uploadedFiles) {
          if (file.type === "image") {
            newMessage.content.push({
              type: "image_url",
              image_url: file.url,
            });
          } else {
            // For documents/PDFs
            newMessage.content.push({
              type: "text",
              text: `[Attached File: ${file.name}]\nFile URL: ${file.url}`,
            });
          }
        }
      }
    }

    const res = await api.post("/chat", {
      history: updatedHistory,
      newMessage,
    });

    return res.data.data.reply;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message ?? "Something went wrong"
    );
  }
});
