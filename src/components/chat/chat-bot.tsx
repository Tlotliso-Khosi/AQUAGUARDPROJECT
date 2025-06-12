"use client";

import * as React from "react";
import { MessageCircle, Send, X, Image, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachment?: {
    type: "image" | "file";
    url: string;
    name: string;
  };
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

interface StoredMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  attachment?: {
    type: "image" | "file";
    url: string;
    name: string;
  };
}

const quickReplies: QuickReply[] = [
  { id: "weather", text: "Check weather forecast", action: "weather" },
  { id: "irrigation", text: "Irrigation schedule", action: "irrigation" },
  { id: "soil", text: "Soil moisture levels", action: "soil" },
  { id: "market", text: "Market prices", action: "market" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  React.useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages) as StoredMessage[];
        const messages: Message[] = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messages);
      } else {
        setMessages([
          {
            id: "1",
            content: "Hello! I'm AquaGuard AI, your farming assistant. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([
        {
          id: "1",
          content: "Hello! I'm AquaGuard AI, your farming assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage when they change
  React.useEffect(() => {
    try {
      const storedMessages: StoredMessage[] = messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      }));
      localStorage.setItem("chatMessages", JSON.stringify(storedMessages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  }, [messages]);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string = message) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm processing your request about "${text}". This is a placeholder response. In the real implementation, this would be connected to your AI backend.`,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    const handleFileRead = async (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: "Sent an attachment",
        role: "user",
        timestamp: new Date(),
        attachment: {
          type: file.type.startsWith("image/") ? "image" : "file",
          url: e.target.result as string,
          name: file.name,
        },
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(true);

      try {
        // Simulate AI response to file
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I've received your ${file.type.startsWith("image/") ? "image" : "file"}. Let me analyze it.`,
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error handling file upload:", error);
      } finally {
        setIsTyping(false);
      }
    };

    reader.onload = handleFileRead;
    reader.onerror = () => {
      console.error("Error reading file");
      setIsTyping(false);
    };

    void reader.readAsDataURL(file);
  };

  return (
    <>
      <Button
        size="default"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full shadow-lg bg-secondary hover:bg-secondary/80 text-white px-6"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Ask AquaGuard</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 flex h-[600px] w-[400px] flex-col rounded-xl shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary">
                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-primary-foreground">
                  AI
                </span>
              </div>
              <div>
                <h3 className="font-semibold">AquaGuard AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="scrollbar-custom flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[80%] flex-col gap-1 rounded-lg p-3",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.type === "image" ? (
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="max-h-48 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-background/10 p-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{msg.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex max-w-[80%] items-center gap-2 rounded-lg bg-muted p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AquaGuard is typing...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="border-t p-3">
              <p className="mb-2 text-xs text-muted-foreground">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <Button
                    key={reply.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSendMessage(reply.text)}
                  >
                    {reply.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
              </Button>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="icon" disabled={isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
} 