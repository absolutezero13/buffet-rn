import axios from "axios";
import { apiClient } from "./api";

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

class ChatApi {
  async sendMessage(
    message: string,
    history: ChatMessage[] = [],
  ): Promise<string | Error> {
    try {
      const response = await apiClient.post<ChatResponse>("/chat", {
        message,
        history,
      });
      return response.data.reply;
    } catch (error) {
      console.error("Chat API error:", error);
      return new Error("Failed to send message");
    }
  }
}

export const chatApi = new ChatApi();
