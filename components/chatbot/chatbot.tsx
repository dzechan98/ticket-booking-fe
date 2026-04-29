"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageCircle,
  Minimize2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  chatWithBot,
  getChatSuggestions,
  resetChatConversation,
} from "@/api/chatbot/chat";
import type { ChatMessage } from "@/api/chatbot/type";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  role: "user" | "model";
  timestamp: Date;
}

export function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là trợ lý ảo của hệ thống đặt vé xem phim CineHub. Tôi có thể giúp gì cho bạn về việc đặt vé xem phim? 🎬",
      role: "model",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ["chatbot-suggestions"],
    queryFn: getChatSuggestions,
    staleTime: Infinity,
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: ({
      message,
      history,
    }: {
      message: string;
      history: ChatMessage[];
    }) => chatWithBot(message, history),
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "model",
        timestamp: new Date(),
      };
      // Remove typing indicator and add bot message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        botMessage,
      ]);
      setConversationHistory(data.conversationHistory);
      setShowSuggestions(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi gửi tin nhắn",
      );
      // Remove the loading message if error occurs
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
    },
  });

  // Reset mutation
  const resetMutation = useMutation({
    mutationFn: resetChatConversation,
    onSuccess: (message) => {
      setMessages([
        {
          id: "1",
          content: message,
          role: "model",
          timestamp: new Date(),
        },
      ]);
      setConversationHistory([]);
      setShowSuggestions(true);
      toast.success("Đã reset cuộc trò chuyện");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi reset cuộc trò chuyện");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: new Date().toISOString(),
      content: textToSend,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Show typing indicator
    const typingMessage: Message = {
      id: "typing",
      content: "",
      role: "model",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    chatMutation.mutate({
      message: textToSend,
      history: conversationHistory,
    });
  };

  const handleReset = () => {
    resetMutation.mutate();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === "model") {
      return (
        <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-ul:pl-5 prose-li:my-1 prose-strong:font-semibold prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          1
        </span>
      </button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl border-none transition-all duration-300 p-0 ",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarFallback className="bg-white text-blue-600 font-bold">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Trợ lý CineHub AI</h3>
            <p className="text-xs opacity-90">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="text-white hover:bg-white/20 h-8 w-8"
            title="Reset cuộc trò chuyện"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "model" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-lg p-3 shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-gray-800 border",
                  )}
                >
                  {message.id === "typing" ? (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  ) : (
                    <>
                      {renderMessageContent(message)}
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    {user?.avatar && (
                      <AvatarImage
                        src={user.avatar}
                        alt={user.full_name || "User"}
                      />
                    )}
                    <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                      {user?.full_name
                        ? user.full_name.charAt(0).toUpperCase()
                        : "BẠN"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  Gợi ý câu hỏi:
                </p>
                <div className="grid gap-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={chatMutation.isPending}
                      className="text-left text-sm p-2 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Nhấn Enter để gửi tin nhắn
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
