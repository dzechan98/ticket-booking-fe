"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Xin chào! Tôi có thể giúp gì cho bạn về việc đặt vé xem phim?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: new Date().toUTCString().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("giá") || lowerMessage.includes("vé")) {
      return "Giá vé phim từ 45.000đ - 120.000đ tùy theo suất chiếu và loại ghế. Bạn có thể xem chi tiết giá khi chọn phim và suất chiếu nhé!";
    } else if (lowerMessage.includes("đặt") || lowerMessage.includes("book")) {
      return "Để đặt vé, bạn chọn phim muốn xem, sau đó chọn suất chiếu và ghế. Bạn cần đăng nhập để hoàn tất đặt vé nhé!";
    } else if (lowerMessage.includes("thanh toán")) {
      return "Chúng tôi chấp nhận thanh toán qua thẻ ATM, thẻ tín dụng, ví điện tử (MoMo, ZaloPay). Bạn có thể chọn phương thức thanh toán phù hợp khi đặt vé.";
    } else if (lowerMessage.includes("hủy")) {
      return "Bạn có thể hủy vé trước 2 giờ trước suất chiếu. Vui lòng vào mục 'Vé của tôi' để quản lý đặt vé.";
    } else if (
      lowerMessage.includes("phim") ||
      lowerMessage.includes("movie")
    ) {
      return "Hiện tại chúng tôi có nhiều phim đang chiếu và sắp chiếu. Bạn có thể xem danh sách phim tại trang chủ hoặc mục 'Phim' nhé!";
    } else if (
      lowerMessage.includes("rạp") ||
      lowerMessage.includes("cinema")
    ) {
      return "Hệ thống rạp của chúng tôi có nhiều phòng chiếu với công nghệ hiện đại. Vui lòng chọn phim để xem các phòng chiếu có sẵn.";
    } else if (
      lowerMessage.includes("xin chào") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi")
    ) {
      return "Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp đỡ điều gì về việc đặt vé xem phim?";
    } else if (
      lowerMessage.includes("cảm ơn") ||
      lowerMessage.includes("thanks")
    ) {
      return "Rất vui được giúp đỡ bạn! Nếu có thắc mắc gì khác, đừng ngần ngại hỏi nhé! 😊";
    } else {
      return "Tôi có thể giúp bạn về: giá vé, cách đặt vé, thanh toán, hủy vé, thông tin phim và rạp chiếu. Bạn muốn biết thông tin gì?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        "fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl transition-all duration-300",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarFallback className="bg-white text-blue-600 font-bold">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Trợ lý ảo</h3>
            <p className="text-xs opacity-90">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
                  message.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3 shadow-sm",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-gray-800 border",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                      BẠN
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-lg p-3 shadow-sm border">
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
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
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
