import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Info, 
  Settings, 
  Send, 
  Edit3,
  MessageSquare,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import arthurAvatar from '@/assets/ai-salesman-avatar.jpg';

interface ConversationMessage {
  id: string;
  sender: 'arthur' | 'prospect' | 'user';
  content: string;
  timestamp: string;
  needsTraining?: boolean;
  context?: string;
}

interface Conversation {
  id: string;
  prospect: {
    name: string;
    company: string;
    avatar?: string;
  };
  messages: ConversationMessage[];
  status: 'active' | 'needs_training' | 'completed';
  trainingPoints: string[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    prospect: {
      name: 'Sarah Johnson',
      company: 'TechCorp',
    },
    status: 'needs_training',
    trainingPoints: ['First message approach', 'Pricing questions'],
    messages: [
      {
        id: '1-1',
        sender: 'arthur',
        content: "Hi Sarah, I noticed you're working at TechCorp and thought you might be interested in our sales automation platform.",
        timestamp: '10:30 AM',
        needsTraining: true,
        context: 'Initial outreach - needs more personalization'
      },
      {
        id: '1-2',
        sender: 'prospect',
        content: "Thanks for reaching out! Can you tell me more about your pricing?",
        timestamp: '2:15 PM'
      },
      {
        id: '1-3',
        sender: 'arthur',
        content: "I'd be happy to discuss pricing! Our plans start at $99/month.",
        timestamp: '2:20 PM',
        needsTraining: true,
        context: 'Pricing question - not in knowledge base, needs user input'
      }
    ]
  },
  {
    id: '2',
    prospect: {
      name: 'Michael Chen',
      company: 'StartupXYZ',
    },
    status: 'active',
    trainingPoints: ['Follow-up timing', 'Technical questions'],
    messages: [
      {
        id: '2-1',
        sender: 'arthur',
        content: "Hey Michael, saw your recent post about scaling challenges. Our platform has helped startups like yours streamline their sales process.",
        timestamp: 'Yesterday 4:30 PM'
      },
      {
        id: '2-2',
        sender: 'prospect',
        content: "Interesting! How does your API integration work?",
        timestamp: 'Today 9:15 AM'
      },
      {
        id: '2-3',
        sender: 'arthur',
        content: "Great question! Our API is RESTful and supports webhooks for real-time data sync.",
        timestamp: 'Today 9:20 AM',
        needsTraining: true,
        context: 'Technical question - needs more detailed response'
      }
    ]
  }
];

const ConversationTraining = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTrainMessage = (conversationId: string, messageId: string, newContent: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: newContent, needsTraining: false }
              : msg
          )
        };
      }
      return conv;
    }));

    toast({
      title: "Message Updated",
      description: "Arthur has learned from your edit and will apply this style to future messages.",
    });

    setEditingMessage(null);
    setMessageContent("");
  };

  const getStatusColor = (status: Conversation['status']) => {
    switch (status) {
      case 'needs_training': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/ai-training')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to AI Training</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Conversation Training</h1>
              <p className="text-muted-foreground">
                Train Arthur with full conversation context and automation settings
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>It's recommended to train Arthur for 1-2 weeks before enabling 100% automation. This ensures better response quality and reduces errors.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Automation Mode</span>
                <Switch
                  checked={isAutomationEnabled}
                  onCheckedChange={setIsAutomationEnabled}
                />
                <Badge variant={isAutomationEnabled ? "default" : "secondary"}>
                  {isAutomationEnabled ? "100% Auto" : "Draft Mode"}
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Active Conversations</h2>
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className={`cursor-pointer transition-colors ${
                  selectedConversation === conversation.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.prospect.avatar} />
                        <AvatarFallback>
                          {conversation.prospect.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-sm">{conversation.prospect.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{conversation.prospect.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(conversation.status)}>
                      {conversation.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {conversation.messages.length} messages
                    </p>
                    {conversation.trainingPoints.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {conversation.trainingPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conversation Detail */}
          <div className="lg:col-span-2">
            {selectedConv ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedConv.prospect.avatar} />
                        <AvatarFallback>
                          {selectedConv.prospect.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedConv.prospect.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedConv.prospect.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(selectedConv.status)}>
                      {selectedConv.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedConv.messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className={`flex items-start space-x-3 ${
                          message.sender === 'arthur' ? 'flex-row' : 
                          message.sender === 'user' ? 'flex-row' : 'flex-row-reverse'
                        }`}>
                          <Avatar className="h-8 w-8">
                            {message.sender === 'arthur' ? (
                              <AvatarImage src={arthurAvatar} />
                            ) : message.sender === 'user' ? (
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            ) : (
                              <AvatarFallback>
                                {selectedConv.prospect.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className={`flex-1 ${
                            message.sender === 'prospect' ? 'text-right' : 'text-left'
                          }`}>
                            <div className={`inline-block p-3 rounded-lg max-w-xs ${
                              message.sender === 'arthur' ? 'bg-primary/10 text-primary-foreground' :
                              message.sender === 'user' ? 'bg-secondary' :
                              'bg-muted'
                            }`}>
                              {editingMessage === message.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingMessage(null);
                                        setMessageContent("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleTrainMessage(selectedConv.id, message.id, messageContent)}
                                    >
                                      <Brain className="h-3 w-3 mr-1" />
                                      Train AI
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm">{message.content}</p>
                                  {message.needsTraining && (
                                    <div className="mt-2 pt-2 border-t border-orange-200">
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                                          Needs Training
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setEditingMessage(message.id);
                                            setMessageContent(message.content);
                                          }}
                                        >
                                          <Edit3 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      {message.context && (
                                        <p className="text-xs text-orange-600 mt-1">{message.context}</p>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Automation Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      {isAutomationEnabled ? (
                        <>
                          <Bot className="h-4 w-4 text-green-600" />
                          <span>Arthur will automatically respond to new messages</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 text-orange-600" />
                          <span>Arthur will create drafts for your review before sending</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Choose a conversation from the list to view the full context and train Arthur
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ConversationTraining;