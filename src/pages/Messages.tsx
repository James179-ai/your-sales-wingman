import { useState } from "react";
import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TypewriterText } from "@/components/ui/typewriter-text";
import aiSalesmanAvatar from "@/assets/ai-salesman-avatar.jpg";
import sarahJohnsonAvatar from "@/assets/prospects/sarah-johnson.jpg";
import michaelChenAvatar from "@/assets/prospects/michael-chen.jpg";
import emilyRodriguezAvatar from "@/assets/prospects/emily-rodriguez.jpg";

// Mock data
const mockProspects = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "VP of Sales",
    company: "TechCorp Inc",
    linkedinUrl: "https://linkedin.com/in/sarah-johnson",
    status: "responded_positive",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 2,
    campaign: "Q4 Enterprise Outreach",
    avatar: sarahJohnsonAvatar
  },
  {
    id: "2", 
    firstName: "Michael",
    lastName: "Chen",
    title: "CTO",
    company: "StartupXYZ",
    linkedinUrl: "https://linkedin.com/in/michael-chen",
    status: "messaged",
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 0,
    campaign: "Tech Leaders Q4",
    avatar: michaelChenAvatar
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Rodriguez", 
    title: "Marketing Director",
    company: "GrowthCo",
    linkedinUrl: "https://linkedin.com/in/emma-rodriguez",
    status: "followed_up",
    lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    unreadCount: 0,
    campaign: "Marketing Leaders",
    avatar: emilyRodriguezAvatar
  }
];

const mockMessages = {
  "1": [
    {
      id: "1",
      direction: "out" as const,
      content: "Hi Sarah, I noticed your work at TechCorp and thought you might be interested in our new sales automation platform.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: "initial"
    },
    {
      id: "2", 
      direction: "in" as const,
      content: "Thanks for reaching out! This does look interesting. Could you share more details about pricing and implementation?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: "response"
    },
    {
      id: "3",
      direction: "out" as const,
      content: "Absolutely! I'd love to schedule a quick 15-minute call to walk through our platform. Here's my calendar link: https://calendly.com/demo",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "booking"
    }
  ],
  "2": [
    {
      id: "4",
      direction: "out" as const,
      content: "Hi Michael, I came across your profile and was impressed by your work at StartupXYZ. I'd love to share how we're helping CTOs scale their teams more efficiently.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "initial"
    }
  ]
};

const statusConfig = {
  responded_positive: { label: "Responded", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  responded_negative: { label: "Not Interested", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
  messaged: { label: "Messaged", color: "bg-primary/10 text-primary border-primary/20", icon: MessageCircle },
  followed_up: { label: "Followed Up", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  connected: { label: "Connected", color: "bg-accent/10 text-accent-foreground border-accent/20", icon: ArrowRight }
};

const arthurMessages = [
  "I've been having some great conversations for you! Check out these promising leads - some are ready to chat.",
  "Your outreach is performing wonderfully! I've identified several hot prospects who want to connect with you.",
  "Fantastic news! I've been building relationships with quality leads and some are eager to discuss your solution."
];

export default function Messages() {
  const [selectedProspect, setSelectedProspect] = useState(mockProspects[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [aiEnabledByProspect, setAiEnabledByProspect] = useState<Record<string, boolean>>({});

  const isAiEnabledForProspect = (prospectId: string) => {
    return aiEnabledByProspect[prospectId] ?? true; // Default to enabled
  };

  const toggleAiForProspect = (prospectId: string) => {
    setAiEnabledByProspect(prev => ({
      ...prev,
      [prospectId]: !isAiEnabledForProspect(prospectId)
    }));
  };

  const filteredProspects = mockProspects.filter(prospect => {
    const matchesSearch = prospect.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prospect.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prospect.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || prospect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentMessages = mockMessages[selectedProspect.id] || [];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // TODO: Implement actual message sending
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={aiSalesmanAvatar} alt="Arthur AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Your Message Hub
            </h1>
            <p className="text-muted-foreground mt-1 min-h-[3rem] flex items-center">
              <TypewriterText 
                texts={arthurMessages}
                speed={30}
                delay={4000}
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Prospects List */}
          <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Conversations Arthur Started</CardTitle>
              
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/60 border-white/30"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/60 border-white/30">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="responded_positive">Responded</SelectItem>
                    <SelectItem value="messaged">Messaged</SelectItem>
                    <SelectItem value="followed_up">Followed Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4 pt-0">
                  {filteredProspects.map((prospect) => {
                    const config = statusConfig[prospect.status];
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={prospect.id}
                        onClick={() => setSelectedProspect(prospect)}
                        className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-white/60 ${
                          selectedProspect.id === prospect.id ? 'bg-white/80 shadow-sm ring-1 ring-primary/20' : 'bg-white/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={prospect.avatar} alt={`${prospect.firstName} ${prospect.lastName}`} />
                              <AvatarFallback className="bg-gradient-primary text-white">
                                {prospect.firstName[0]}{prospect.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-foreground truncate">
                                  {prospect.firstName} {prospect.lastName}
                                </h4>
                                {prospect.unreadCount > 0 && (
                                  <Badge variant="secondary" className="bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
                                    {prospect.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {prospect.title} at {prospect.company}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTime(prospect.lastMessageAt)}
                              </p>
                            </div>
                          </div>
                          
                          <Badge className={`${config.color} border`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prospect Header */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedProspect.avatar} alt={`${selectedProspect.firstName} ${selectedProspect.lastName}`} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {selectedProspect.firstName[0]}{selectedProspect.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedProspect.firstName} {selectedProspect.lastName}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedProspect.title} at {selectedProspect.company}
                      </p>
                      <p className="text-sm text-accent mt-1">
                        Campaign: {selectedProspect.campaign}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={`${statusConfig[selectedProspect.status].color} border`}>
                      {React.createElement(statusConfig[selectedProspect.status].icon, { className: "h-3 w-3 mr-1" })}
                      {statusConfig[selectedProspect.status].label}
                    </Badge>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 shadow-glass cursor-help">
                          <Label htmlFor={`ai-toggle-${selectedProspect.id}`} className="text-sm font-medium">
                            AI
                          </Label>
                          <Switch
                            id={`ai-toggle-${selectedProspect.id}`}
                            checked={isAiEnabledForProspect(selectedProspect.id)}
                            onCheckedChange={() => toggleAiForProspect(selectedProspect.id)}
                          />
                          <span className={`text-sm font-medium ${isAiEnabledForProspect(selectedProspect.id) ? 'text-success' : 'text-muted-foreground'}`}>
                            {isAiEnabledForProspect(selectedProspect.id) ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle AI responses for this conversation.<br />When ON, Arthur will automatically respond to messages.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Button variant="outline" size="sm" className="border-white/30 hover:bg-white/60">
                      <Calendar className="h-4 w-4 mr-2" />
                      Let Arthur Book Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass flex-1">
              <CardContent className="p-0 h-[400px] flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.direction === 'out' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-4 rounded-2xl ${
                            message.direction === 'out'
                              ? 'bg-gradient-primary text-white'
                              : 'bg-white/80 text-foreground border border-white/30'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.direction === 'out' ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="bg-white/30" />
                
                {/* Message Input */}
                <div className="p-6">
                  <div className="flex space-x-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] bg-white/60 border-white/30 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="self-end bg-gradient-primary hover:opacity-90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Arthur suggests: Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}