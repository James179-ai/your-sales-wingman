import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, RefreshCw, Check, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import prospect images
import sarahJohnsonImg from "@/assets/prospects/sarah-johnson.jpg";
import michaelChenImg from "@/assets/prospects/michael-chen.jpg";

interface MessageSuggestion {
  id: string;
  prospect: {
    name: string;
    company: string;
    avatar: string;
  };
  originalMessage: string;
  editedMessage: string;
  context: string;
  status: 'draft' | 'training' | 'approved';
}

const mockMessages: MessageSuggestion[] = [
  {
    id: '1',
    prospect: {
      name: 'Sarah Johnson',
      company: 'TechCorp',
      avatar: sarahJohnsonImg,
    },
    originalMessage: "Hi Sarah, I noticed you're working at TechCorp and thought you might be interested in our sales automation platform. Would love to connect and share how we've helped similar companies increase their conversion rates by 40%.",
    editedMessage: "Hi Sarah, I noticed you're working at TechCorp and thought you might be interested in our sales automation platform. Would love to connect and share how we've helped similar companies increase their conversion rates by 40%.",
    context: "Initial outreach - SaaS prospect",
    status: 'draft'
  },
  {
    id: '2',
    prospect: {
      name: 'Michael Chen',
      company: 'StartupXYZ',
      avatar: michaelChenImg,
    },
    originalMessage: "Hey Michael, saw your recent post about scaling challenges. Our platform has helped startups like yours streamline their sales process. Interested in a quick chat?",
    editedMessage: "Hey Michael, saw your recent post about scaling challenges. Our platform has helped startups like yours streamline their sales process. Interested in a quick chat?",
    context: "Follow-up after LinkedIn activity",
    status: 'draft'
  }
];

export function MessageTraining() {
  const [messages, setMessages] = useState<MessageSuggestion[]>(mockMessages);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessageEdit = (id: string, newMessage: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, editedMessage: newMessage } : msg
    ));
  };

  const handleUpdateAI = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status: 'training' } : msg
    ));
    
    toast({
      title: "AI Updated",
      description: "Arthur has learned from your edits and will apply this style to future messages.",
    });

    // Simulate AI processing
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, status: 'approved' } : msg
      ));
    }, 2000);
  };

  const handleSendMessage = (id: string) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the prospect.",
    });
    
    // Remove sent message from the list
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const getStatusColor = (status: MessageSuggestion['status']) => {
    switch (status) {
      case 'draft': return 'bg-secondary';
      case 'training': return 'bg-primary';
      case 'approved': return 'bg-accent';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: MessageSuggestion['status']) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'training': return 'Training AI...';
      case 'approved': return 'Ready to Send';
      default: return 'Draft';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Message Training</h2>
          <p className="text-muted-foreground">
            Edit Arthur's suggestions to train the AI on your preferred writing style
          </p>
        </div>
        <Button 
          onClick={() => navigate('/ai-training/conversations')}
          className="flex items-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>View All Conversations</span>
        </Button>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="w-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.prospect.avatar} />
                    <AvatarFallback>
                      {message.prospect.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{message.prospect.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{message.prospect.company}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(message.status)}>
                  {getStatusText(message.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{message.context}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Arthur's Suggestion:
                </label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {message.originalMessage}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Your Edit:
                </label>
                <Textarea
                  value={message.editedMessage}
                  onChange={(e) => handleMessageEdit(message.id, e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Edit the message to match your style..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateAI(message.id)}
                  disabled={message.status === 'training'}
                  className="flex items-center space-x-2"
                >
                  {message.status === 'training' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>Update AI</span>
                </Button>
                
                <Button
                  onClick={() => handleSendMessage(message.id)}
                  disabled={message.status !== 'approved'}
                  className="flex items-center space-x-2"
                >
                  {message.status === 'approved' ? (
                    <Send className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>Send Message</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {messages.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No messages to review
              </h3>
              <p className="text-sm text-muted-foreground">
                Arthur will suggest new messages as you create campaigns and engage with prospects.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}