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
import sarahJohnson from '@/assets/prospects/sarah-johnson.jpg';
import michaelChen from '@/assets/prospects/michael-chen.jpg';
import emilyRodriguez from '@/assets/prospects/emily-rodriguez.jpg';
import davidKim from '@/assets/prospects/david-kim.jpg';
import lisaThompson from '@/assets/prospects/lisa-thompson.jpg';
import jamesWilson from '@/assets/prospects/james-wilson.jpg';
import mariaGarcia from '@/assets/prospects/maria-garcia.jpg';
import robertBrown from '@/assets/prospects/robert-brown.jpg';
import jenniferLee from '@/assets/prospects/jennifer-lee.jpg';
import kevinMartinez from '@/assets/prospects/kevin-martinez.jpg';
import amandaFoster from '@/assets/prospects/amanda-foster.jpg';
import thomasAnderson from '@/assets/prospects/thomas-anderson.jpg';

interface ConversationMessage {
  id: string;
  sender: 'arthur' | 'prospect' | 'user';
  content: string;
  timestamp: string;
  needsTraining?: boolean;
  trained?: boolean;
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
      avatar: sarahJohnson,
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
      avatar: michaelChen,
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
  },
  {
    id: '3',
    prospect: {
      name: 'Emily Rodriguez',
      company: 'Healthcare Solutions Inc',
      avatar: emilyRodriguez,
    },
    status: 'needs_training',
    trainingPoints: ['Industry-specific messaging', 'Compliance questions'],
    messages: [
      {
        id: '3-1',
        sender: 'arthur',
        content: "Hi Emily, I help companies improve their sales processes. Would you be interested in learning more?",
        timestamp: 'Monday 11:00 AM',
        needsTraining: true,
        context: 'Generic message - needs healthcare industry personalization'
      },
      {
        id: '3-2',
        sender: 'prospect',
        content: "We work in healthcare, so compliance is critical. Are you HIPAA compliant?",
        timestamp: 'Monday 3:45 PM'
      },
      {
        id: '3-3',
        sender: 'arthur',
        content: "Yes, we take security seriously and follow best practices.",
        timestamp: 'Monday 4:00 PM',
        needsTraining: true,
        context: 'Compliance question - needs specific HIPAA details'
      }
    ]
  },
  {
    id: '4',
    prospect: {
      name: 'David Kim',
      company: 'E-commerce Plus',
      avatar: davidKim,
    },
    status: 'needs_training',
    trainingPoints: ['Objection handling', 'Value proposition'],
    messages: [
      {
        id: '4-1',
        sender: 'arthur',
        content: "Hi David, I noticed E-commerce Plus has been growing rapidly. Our platform could help optimize your sales funnel.",
        timestamp: 'Tuesday 2:00 PM'
      },
      {
        id: '4-2',
        sender: 'prospect',
        content: "We already have a sales system that works fine. Why would we need to change?",
        timestamp: 'Tuesday 4:30 PM'
      },
      {
        id: '4-3',
        sender: 'arthur',
        content: "I understand you have a system in place. Our platform offers additional features that might complement what you're already doing.",
        timestamp: 'Tuesday 4:45 PM',
        needsTraining: true,
        context: 'Weak objection handling - needs stronger value proposition'
      }
    ]
  },
  {
    id: '5',
    prospect: {
      name: 'Lisa Thompson',
      company: 'Manufacturing Corp',
      avatar: lisaThompson,
    },
    status: 'needs_training',
    trainingPoints: ['Follow-up strategy', 'Meeting scheduling'],
    messages: [
      {
        id: '5-1',
        sender: 'arthur',
        content: "Hi Lisa, I help manufacturing companies streamline their sales operations. Would love to show you how we've helped similar companies increase efficiency by 35%.",
        timestamp: 'Last week'
      },
      {
        id: '5-2',
        sender: 'prospect',
        content: "Sounds interesting. Can we set up a call next week?",
        timestamp: '3 days ago'
      },
      {
        id: '5-3',
        sender: 'arthur',
        content: "Absolutely! When works best for you?",
        timestamp: '3 days ago',
        needsTraining: true,
        context: 'Should provide specific time slots and calendar link'
      }
    ]
  },
  {
    id: '6',
    prospect: {
      name: 'James Wilson',
      company: 'Financial Services Ltd',
      avatar: jamesWilson,
    },
    status: 'needs_training',
    trainingPoints: ['Security concerns', 'ROI questions'],
    messages: [
      {
        id: '6-1',
        sender: 'arthur',
        content: "Hi James, I help financial services companies automate their sales processes while maintaining security standards.",
        timestamp: 'Yesterday 10:00 AM'
      },
      {
        id: '6-2',
        sender: 'prospect',
        content: "Security is our top priority. What certifications do you have?",
        timestamp: 'Yesterday 2:15 PM'
      },
      {
        id: '6-3',
        sender: 'arthur',
        content: "We have enterprise-grade security measures in place.",
        timestamp: 'Yesterday 2:30 PM',
        needsTraining: true,
        context: 'Needs specific security certifications (SOC 2, ISO 27001, etc.)'
      },
      {
        id: '6-4',
        sender: 'prospect',
        content: "What kind of ROI can we expect in the first year?",
        timestamp: 'Today 9:00 AM'
      },
      {
        id: '6-5',
        sender: 'arthur',
        content: "Our clients typically see good returns on their investment.",
        timestamp: 'Today 9:15 AM',
        needsTraining: true,
        context: 'Vague ROI response - needs specific metrics and case studies'
      }
    ]
  },
  {
    id: '7',
    prospect: {
      name: 'Maria Garcia',
      company: 'Retail Chain Co',
      avatar: mariaGarcia,
    },
    status: 'needs_training',
    trainingPoints: ['Feature explanation', 'Competitive advantage'],
    messages: [
      {
        id: '7-1',
        sender: 'arthur',
        content: "Hi Maria, I noticed Retail Chain Co has multiple locations. Our platform helps multi-location businesses coordinate their sales efforts.",
        timestamp: 'Monday 3:00 PM'
      },
      {
        id: '7-2',
        sender: 'prospect',
        content: "How is this different from Salesforce or HubSpot?",
        timestamp: 'Tuesday 11:00 AM'
      },
      {
        id: '7-3',
        sender: 'arthur',
        content: "We offer similar features but with better pricing and support.",
        timestamp: 'Tuesday 11:30 AM',
        needsTraining: true,
        context: 'Weak competitive differentiation - needs specific unique value props'
      }
    ]
  },
  {
    id: '8',
    prospect: {
      name: 'Robert Brown',
      company: 'Tech Innovations',
      avatar: robertBrown,
    },
    status: 'active',
    trainingPoints: ['Demo scheduling', 'Technical requirements'],
    messages: [
      {
        id: '8-1',
        sender: 'arthur',
        content: "Hi Robert, I help tech companies like yours scale their sales operations efficiently. Our AI-powered platform has helped similar companies increase conversion rates by 40%.",
        timestamp: '2 days ago'
      },
      {
        id: '8-2',
        sender: 'prospect',
        content: "That sounds impressive. Can you show me a demo?",
        timestamp: 'Yesterday 4:00 PM'
      },
      {
        id: '8-3',
        sender: 'arthur',
        content: "Of course! I can walk you through the platform.",
        timestamp: 'Yesterday 4:15 PM',
        needsTraining: true,
        context: 'Should offer specific demo time slots and preparation requirements'
      }
    ]
  },
  {
    id: '9',
    prospect: {
      name: 'Jennifer Lee',
      company: 'Education Partners',
      avatar: jenniferLee,
    },
    status: 'needs_training',
    trainingPoints: ['Budget questions', 'Implementation timeline'],
    messages: [
      {
        id: '9-1',
        sender: 'arthur',
        content: "Hi Jennifer, I help educational organizations streamline their enrollment and outreach processes.",
        timestamp: 'Last Friday 2:00 PM'
      },
      {
        id: '9-2',
        sender: 'prospect',
        content: "This could be useful. What's the typical budget range for organizations our size?",
        timestamp: 'Monday 10:00 AM'
      },
      {
        id: '9-3',
        sender: 'arthur',
        content: "Our pricing is very competitive and depends on your specific needs.",
        timestamp: 'Monday 10:30 AM',
        needsTraining: true,
        context: 'Needs specific pricing ranges and package options'
      },
      {
        id: '9-4',
        sender: 'prospect',
        content: "How long does implementation typically take?",
        timestamp: 'Monday 2:00 PM'
      },
      {
        id: '9-5',
        sender: 'arthur',
        content: "It varies based on complexity, but we work to get you up and running quickly.",
        timestamp: 'Monday 2:15 PM',
        needsTraining: true,
        context: 'Vague timeline - needs specific implementation phases and duration'
      }
    ]
  },
  {
    id: '10',
    prospect: {
      name: 'Kevin Martinez',
      company: 'Construction Management',
      avatar: kevinMartinez,
    },
    status: 'needs_training',
    trainingPoints: ['Industry understanding', 'Mobile requirements'],
    messages: [
      {
        id: '10-1',
        sender: 'arthur',
        content: "Hi Kevin, I help businesses improve their sales processes through automation.",
        timestamp: 'Wednesday 9:00 AM',
        needsTraining: true,
        context: 'Generic message - needs construction industry personalization'
      },
      {
        id: '10-2',
        sender: 'prospect',
        content: "Our team is mostly in the field. Does your platform work well on mobile devices?",
        timestamp: 'Wednesday 1:00 PM'
      },
      {
        id: '10-3',
        sender: 'arthur',
        content: "Yes, we have a mobile app available.",
        timestamp: 'Wednesday 1:15 PM',
        needsTraining: true,
        context: 'Needs details about mobile features and field-specific functionality'
      }
    ]
  },
  {
    id: '11',
    prospect: {
      name: 'Amanda Foster',
      company: 'Digital Marketing Agency',
      avatar: amandaFoster,
    },
    status: 'needs_training',
    trainingPoints: ['Agency-specific features', 'Client management'],
    messages: [
      {
        id: '11-1',
        sender: 'arthur',
        content: "Hi Amanda, I help marketing agencies manage their client relationships and sales processes more effectively.",
        timestamp: 'Thursday 11:00 AM'
      },
      {
        id: '11-2',
        sender: 'prospect',
        content: "We manage multiple clients. Can your system handle separate pipelines for each client?",
        timestamp: 'Thursday 3:00 PM'
      },
      {
        id: '11-3',
        sender: 'arthur',
        content: "Yes, our platform supports multiple pipelines.",
        timestamp: 'Thursday 3:30 PM',
        needsTraining: true,
        context: 'Needs details about multi-client management and agency-specific features'
      },
      {
        id: '11-4',
        sender: 'prospect',
        content: "Can we white-label it for our clients?",
        timestamp: 'Friday 10:00 AM'
      },
      {
        id: '11-5',
        sender: 'arthur',
        content: "That's something we might be able to accommodate.",
        timestamp: 'Friday 10:15 AM',
        needsTraining: true,
        context: 'Uncertain response - needs clear white-label policy and pricing'
      }
    ]
  },
  {
    id: '12',
    prospect: {
      name: 'Thomas Anderson',
      company: 'Logistics Solutions',
      avatar: thomasAnderson,
    },
    status: 'active',
    trainingPoints: ['Integration questions', 'Scalability'],
    messages: [
      {
        id: '12-1',
        sender: 'arthur',
        content: "Hi Thomas, I help logistics companies optimize their sales operations and improve customer acquisition rates.",
        timestamp: '2 weeks ago'
      },
      {
        id: '12-2',
        sender: 'prospect',
        content: "We use SAP for our operations. Can your platform integrate with our existing systems?",
        timestamp: '10 days ago'
      },
      {
        id: '12-3',
        sender: 'arthur',
        content: "We offer integrations with many popular business systems including SAP.",
        timestamp: '10 days ago'
      },
      {
        id: '12-4',
        sender: 'prospect',
        content: "We're growing rapidly. How well does your platform scale?",
        timestamp: '5 days ago'
      },
      {
        id: '12-5',
        sender: 'arthur',
        content: "Our platform is built to handle growth, but I'd need to understand your specific scaling needs better.",
        timestamp: '5 days ago',
        needsTraining: true,
        context: 'Should provide specific scalability metrics and enterprise features'
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
        const updatedMessages = conv.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, needsTraining: false, trained: true }
            : msg
        );
        
        // Check if all training is complete for this conversation
        const hasUntrainedMessages = updatedMessages.some(msg => msg.needsTraining);
        const newStatus = hasUntrainedMessages ? 'needs_training' : 'active';
        
        return {
          ...conv,
          messages: updatedMessages,
          status: newStatus
        };
      }
      return conv;
    }));

    toast({
      title: "AI Trained Successfully! ✨",
      description: "Arthur has learned from your edit and will apply this style to future messages.",
    });

    setEditingMessage(null);
    setMessageContent("");
  };

  const getStatusColor = (status: Conversation['status']) => {
    switch (status) {
      case 'needs_training': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusText = (status: Conversation['status']) => {
    switch (status) {
      case 'needs_training': return 'Needs Training';
      case 'active': return 'Fully Trained';
      case 'completed': return 'Completed';
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
            <h2 className="text-lg font-semibold sticky top-0 bg-background pb-2">Active Conversations</h2>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
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
                        {getStatusText(conversation.status)}
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
                      {getStatusText(selectedConv.status)}
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
                                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
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
                                  {message.trained && (
                                    <div className="mt-2 pt-2 border-t border-green-200">
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                          ✨ AI Trained
                                        </Badge>
                                        <div className="flex items-center text-green-600">
                                          <Brain className="h-3 w-3 mr-1" />
                                          <span className="text-xs">Improved</span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-green-600 mt-1">Arthur learned your preferred style from this edit</p>
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