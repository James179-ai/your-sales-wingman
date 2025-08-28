import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";
import aiSalesmanAvatar from "@/assets/ai-salesman-avatar.jpg";

interface ArthurChatbotProps {
  open: boolean;
  onClose: () => void;
}

export const ArthurChatbot = ({ open, onClose }: ArthurChatbotProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm Arthur, your AI sales assistant. I'm here to help you set up your entire sales operation. Just tell me about your business, target audience, and goals - I'll handle the rest! What would you like to achieve with your outreach?",
      sender: "arthur",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate Arthur's response
    setTimeout(() => {
      const arthurResponse = {
        id: messages.length + 2,
        text: "Perfect! I understand what you're looking for. Let me start building your campaign strategy. I'll create targeted prospect lists, craft personalized messages, and set up automated follow-ups. This should only take a few moments...",
        sender: "arthur",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, arthurResponse]);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b bg-gradient-glass">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={aiSalesmanAvatar} alt="Arthur AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">Plan with Arthur</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Your AI sales assistant will set up everything for you
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Welcome Message */}
        <div className="p-4 bg-primary/5 border-b">
          <Card className="p-4 bg-gradient-glass border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Arthur Sets Up Everything</h4>
                <p className="text-sm text-muted-foreground">
                  Just chat with me about your business goals, ideal customers, and what you want to achieve. 
                  I'll automatically create campaigns, write personalized messages, build prospect lists, and 
                  set up your entire sales pipeline. No manual work required!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated border"
                }`}
              >
                {message.sender === "arthur" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={aiSalesmanAvatar} alt="Arthur" />
                      <AvatarFallback className="text-xs">AI</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-primary">Arthur</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-surface-elevated">
          <div className="flex gap-2">
            <Input
              placeholder="Tell Arthur about your business and goals..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};