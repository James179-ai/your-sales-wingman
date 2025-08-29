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
    title: "Connections Arthur Sent Today",
    value: 18,
    change: "Crushing yesterday by +15%!",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Messages Arthur Crafted",
    value: 42,
    change: "Up +8% from last week",
    changeType: "positive" as const,
    icon: MessageSquare
  },
  {
    title: "Response Rate We're Getting",
    value: "23%",
    change: "Improved +2% this month!",
    changeType: "positive" as const,
    icon: TrendingUp
  },
  {
    title: "Meetings Arthur Booked",
    value: 7,
    change: "3 more this week - nice!",
    changeType: "neutral" as const,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={aiSalesmanAvatar} alt="AI Sales Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Good Evening, Karl-Martin
            </h1>
            <p className="text-muted-foreground mt-1 min-h-[3rem] flex items-center">
              <TypewriterText 
                texts={arthurMessages}
                speed={30}
                triggerKey={typewriterKey}
              />
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Let Arthur Start a New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Simple Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Weekly Connections</h3>
            <p className="text-sm text-muted-foreground">Connections sent this week</p>
          </div>
          <ChartContainer config={chartConfig} className="h-48">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis hide />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4">
            <button 
              className="text-sm text-chart-1 hover:underline cursor-pointer"
              onClick={() => navigate('/connections-report')}
            >
              View full report →
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Response Rate</h3>
            <p className="text-sm text-muted-foreground">Current quarter goal</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <Pie
                    data={responseRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    {responseRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">73%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Current quarter performance</p>
            <button 
              className="text-sm text-chart-1 hover:underline cursor-pointer"
              onClick={() => navigate('/goals')}
            >
              All goals →
            </button>
          </div>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="bg-gradient-glass border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Campaigns Arthur is Managing</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/campaigns')}>View All</Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-subtle">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    campaign.status === "Active" ? "bg-success" : "bg-warning"
                  }`} />
                  <div>
                    <h4 className="font-medium text-foreground">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-foreground">{campaign.connections}</p>
                    <p className="text-muted-foreground">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{campaign.responses}</p>
                    <p className="text-muted-foreground">Responses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{campaign.meetings}</p>
                    <p className="text-muted-foreground">Meetings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-success">{campaign.responseRate}</p>
                    <p className="text-muted-foreground">Response Rate</p>
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