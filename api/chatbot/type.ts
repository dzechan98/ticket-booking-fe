export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversationHistory: ChatMessage[];
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface ResetResponse {
  message: string;
}
