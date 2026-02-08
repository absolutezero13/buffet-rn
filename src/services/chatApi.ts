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
  ): Promise<string> {
    try {
      const response = await apiClient.post<ChatResponse>("/chat", {
        message,
        history,
      });
      return response.data.reply;
    } catch (error) {
      console.error("Chat API error:", error);
      throw new Error("Failed to get AI response");
    }
  }
}

export const chatApi = new ChatApi();
