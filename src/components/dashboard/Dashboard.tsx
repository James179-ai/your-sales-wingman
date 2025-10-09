import { useState, useEffect } from "react";
import { KPICard } from "./KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArthurChatbot } from "@/components/arthur/ArthurChatbot";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import aiSalesmanAvatar from "@/assets/ai-salesman-avatar.jpg";

const mockKPIs = [
  {
    title: "Connections Sent",
    value: 18,
    change: "+15% from yesterday",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Messages Crafted",
    value: 42,
    change: "+8% from last week",
    changeType: "positive" as const,
    icon: MessageSquare
  },
  {
    title: "Response Rate",
    value: "23%",
    change: "+2% this month",
    changeType: "positive" as const,
    icon: TrendingUp
  },
  {
    title: "Meetings Booked",
    value: 7,
    change: "3 more this week",
    changeType: "positive" as const,
    icon: Calendar
  }
];

const mockCampaigns = [
  {
    name: "Tech Startup Outreach",
    status: "Active",
    connections: 156,
    responses: 36,
    meetings: 8,
    responseRate: "23%"
  },
  {
    name: "SaaS Decision Makers",
    status: "Active", 
    connections: 89,
    responses: 12,
    meetings: 3,
    responseRate: "13%"
  },
  {
    name: "Marketing Directors",
    status: "Paused",
    connections: 234,
    responses: 45,
    meetings: 12,
    responseRate: "19%"
  }
];

// Simple chart data
const weeklyData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 }
];

const responseRateData = [
  { name: "Success", value: 73, fill: "hsl(var(--chart-1))" },
  { name: "Pending", value: 27, fill: "hsl(var(--muted))" }
];

const chartConfig = {
  value: {
    label: "Connections",
    color: "hsl(var(--chart-1))"
  }
};

const arthurMessages = [
  "Good evening! I've been crushing your goals today - check out these amazing numbers!",
  "Hey there! Your pipeline is looking fantastic. I've been busy building your success story.",
  "What a productive day! I've been working hard on your campaigns and the results speak for themselves."
];

export function Dashboard() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const navigate = useNavigate();

  // Trigger typewriter on component mount
  useEffect(() => {
    setTypewriterKey(Date.now());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with enhanced styling */}
      <div className="flex items-center justify-between p-6 bg-gradient-glass rounded-2xl border border-border-subtle/50 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="relative animate-float">
            <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-glow ring-2 ring-primary/10">
              <AvatarImage src={aiSalesmanAvatar} alt="Arthur - Your AI Sales Assistant" />
              <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">AI</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
              Good Evening, Karl-Martin
            </h1>
            <p className="text-text-secondary text-base min-h-[3rem] flex items-center font-medium">
              <TypewriterText 
                texts={arthurMessages}
                speed={30}
                triggerKey={typewriterKey}
              />
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" size="lg" className="gap-2 text-base px-6" onClick={() => navigate('/campaigns/new')}>
            <Plus className="w-5 h-5" />
            Start New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, index) => (
          <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-7 glassmorphism border-border-subtle/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Weekly Connections</h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Connections sent this week</p>
            </div>
            <ChartContainer config={chartConfig} className="h-56">
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <div className="mt-5">
              <button 
                className="text-sm font-semibold text-primary hover:text-primary-glow transition-colors flex items-center gap-1 group/link"
                onClick={() => navigate('/connections-report')}
              >
                View full report 
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-7 glassmorphism border-border-subtle/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Response Rate</h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Current quarter goal</p>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <PieChart>
                    <defs>
                      <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                        <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={responseRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      stroke="none"
                    >
                      {responseRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "url(#pieGradient)" : entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">73%</span>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p className="text-sm text-muted-foreground mb-3 font-medium">Current quarter performance</p>
              <button 
                className="text-sm font-semibold text-primary hover:text-primary-glow transition-colors inline-flex items-center gap-1 group/link"
                onClick={() => navigate('/goals')}
              >
                All goals 
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Campaigns with enhanced styling */}
      <Card className="glassmorphism border-border-subtle/50 shadow-lg overflow-hidden">
        <div className="p-7 border-b border-border-subtle/50 bg-gradient-glow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Campaigns Arthur is Managing</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/campaigns')}>View All</Button>
          </div>
        </div>
        <div className="p-7">
          <div className="space-y-4">
            {mockCampaigns.map((campaign, index) => (
              <div 
                key={index} 
                className="group flex items-center justify-between p-5 bg-surface-elevated/50 rounded-xl border border-border-subtle/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`relative w-4 h-4 rounded-full ${
                    campaign.status === "Active" ? "bg-success" : "bg-warning"
                  } shadow-glow`}>
                    <div className={`absolute inset-0 rounded-full ${
                      campaign.status === "Active" ? "bg-success" : "bg-warning"
                    } animate-ping opacity-75`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{campaign.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-foreground text-lg">{campaign.connections}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground text-lg">{campaign.responses}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Responses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground text-lg">{campaign.meetings}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Meetings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-success text-lg">{campaign.responseRate}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Response Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <ArthurChatbot 
        open={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
}