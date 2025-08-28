import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";

// Arthur's encouraging messages for different scenarios
export const ArthurMessages = {
  // Campaign success messages
  campaignLaunched: (campaignName: string) => ({
    title: "Arthur: Campaign is Live!",
    description: `${campaignName} is now running. I'm connecting with prospects as we speak!`,
    icon: <CheckCircle className="w-4 h-4" />
  }),
  
  connectionMade: (prospectName: string) => ({
    title: "Arthur: New Connection! 🎉",
    description: `${prospectName} accepted your connection request. I'll follow up for you.`,
    icon: <Users className="w-4 h-4" />
  }),
  
  responseReceived: (prospectName: string) => ({
    title: "Arthur: We got a response!",
    description: `${prospectName} replied to your message. Check it out - looks promising!`,
    icon: <MessageSquare className="w-4 h-4" />
  }),
  
  meetingBooked: (prospectName: string) => ({
    title: "Arthur: Meeting booked! 📅",
    description: `${prospectName} just booked a meeting. I've added it to your calendar. Well done!`,
    icon: <Calendar className="w-4 h-4" />
  }),
  
  weeklyReport: (connections: number, responses: number) => ({
    title: "Arthur: Weekly Report Ready",
    description: `Great week! ${connections} new connections, ${responses} responses. You're building momentum!`,
    icon: <TrendingUp className="w-4 h-4" />
  }),
  
  // Encouragement messages
  dailyGoalReached: () => ({
    title: "Arthur: Daily goal smashed!",
    description: "You've hit your daily connection target. I'm proud to be working with you!",
    icon: <CheckCircle className="w-4 h-4" />
  }),
  
  needsAttention: (action: string) => ({
    title: "Arthur needs your input",
    description: `I've got a ${action} that needs your expertise. Mind taking a quick look?`,
    icon: <MessageSquare className="w-4 h-4" />
  }),
  
  // Proactive suggestions
  optimizationTip: (tip: string) => ({
    title: "Arthur's suggestion 💡",
    description: `Based on your results, try ${tip}. I think it'll boost our performance!`,
    icon: <TrendingUp className="w-4 h-4" />
  }),
  
  // Error handling with Arthur's supportive tone
  integrationIssue: (service: string) => ({
    title: "Arthur: Connection issue",
    description: `I'm having trouble with ${service}. Let's fix this together - check your settings.`,
    icon: <CheckCircle className="w-4 h-4" />
  })
};

// Hook to use Arthur's messaging system
export const useArthurNotifications = () => {
  const { toast } = useToast();
  
  const arthurNotify = (messageType: string, ...args: string[]) => {
    const messageFunc = ArthurMessages[messageType as keyof typeof ArthurMessages] as (...args: string[]) => any;
    if (messageFunc) {
      const message = messageFunc(...args);
      toast({
        title: message.title,
        description: message.description,
      });
    }
  };
  
  return { arthurNotify };
};

// Component for Arthur's proactive status updates
export const ArthurStatusBanner = ({ 
  activity, 
  isActive = true 
}: { 
  activity: string; 
  isActive?: boolean;
}) => {
  if (!isActive) return null;
  
  return (
    <div className="bg-gradient-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <span className="text-sm font-medium text-primary">
          Arthur is working: {activity}
        </span>
      </div>
    </div>
  );
};

// Example usage component showing Arthur's personality in action
export const ArthurDemo = () => {
  const { arthurNotify } = useArthurNotifications();
  
  useEffect(() => {
    // Simulate Arthur's proactive notifications
    const demoInterval = setInterval(() => {
      const notifications = [
        () => arthurNotify('connectionMade', 'Sarah Johnson'),
        () => arthurNotify('responseReceived', 'Michael Chen'),
        () => arthurNotify('meetingBooked', 'Emma Rodriguez'),
        () => arthurNotify('dailyGoalReached'),
        () => arthurNotify('optimizationTip', 'messaging prospects in the morning - response rates are 23% higher!')
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      randomNotification();
    }, 10000); // Show a demo notification every 10 seconds
    
    return () => clearInterval(demoInterval);
  }, [arthurNotify]);
  
  return (
    <div className="space-y-4">
      <ArthurStatusBanner activity="Finding perfect prospects for your Tech Startup campaign" />
      <div className="text-sm text-muted-foreground">
        Arthur is actively working on your campaigns. Notifications will appear as he makes progress!
      </div>
    </div>
  );
};