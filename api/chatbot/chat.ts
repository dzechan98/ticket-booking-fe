import axiosInstance from "../instance";
import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  SuggestionsResponse,
  ResetResponse,
} from "./type";

/**
 * Send a message to the chatbot and get a response
 */
export const chatWithBot = async (
  message: string,
  conversationHistory?: ChatMessage[],
): Promise<ChatResponse> => {
  const requestData: ChatRequest = {
    message,
    conversationHistory,
  };

  const { data } = await axiosInstance.post<{
    success: boolean;
    data: ChatResponse;
    message: string;
  }>("/chatbot/chat", requestData);

  return data.data;
};

/**
 * Get suggested questions for the chatbot
 */
export const getChatSuggestions = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get<{
    success: boolean;
    data: SuggestionsResponse;
    message: string;
  }>("/chatbot/suggestions");

  return data.data.suggestions;
};

/**
 * Reset the conversation with the chatbot
 */
export const resetChatConversation = async (): Promise<string> => {
  const { data } = await axiosInstance.post<{
    success: boolean;
    data: ResetResponse;
    message: string;
  }>("/chatbot/reset");

  return data.data.message;
};
