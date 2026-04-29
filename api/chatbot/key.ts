export const chatbotKeys = {
  all: ["chatbot"] as const,
  chat: () => [...chatbotKeys.all, "chat"] as const,
  suggestions: () => [...chatbotKeys.all, "suggestions"] as const,
};
