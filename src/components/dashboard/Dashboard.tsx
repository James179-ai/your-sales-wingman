import { useState } from "react";
import { KPICard } from "./KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArthurChatbot } from "@/components/arthur/ArthurChatbot";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  BarChart3,
  Bot,
  MessageCircle
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, Legend, ReferenceLine, CartesianGrid } from "recharts";
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

// Advanced chart data for high-tech visualizations
const performanceData = [
  { name: "Mon", connections: 12, responses: 3, meetings: 1, efficiency: 85 },
  { name: "Tue", connections: 19, responses: 5, meetings: 2, efficiency: 92 },
  { name: "Wed", connections: 15, responses: 4, meetings: 1, efficiency: 78 },
  { name: "Thu", connections: 22, responses: 8, meetings: 3, efficiency: 96 },
  { name: "Fri", connections: 18, responses: 6, meetings: 2, efficiency: 88 },
  { name: "Sat", connections: 8, responses: 2, meetings: 0, efficiency: 65 },
  { name: "Sun", connections: 5, responses: 1, meetings: 0, efficiency: 45 }
];

const radialData = [
  { name: "Tech Startups", value: 85, fill: "hsl(var(--chart-1))" },
  { name: "SaaS Companies", value: 68, fill: "hsl(var(--chart-2))" },
  { name: "Marketing Directors", value: 72, fill: "hsl(var(--chart-3))" },
  { name: "Healthcare", value: 91, fill: "hsl(var(--chart-4))" },
  { name: "Finance", value: 79, fill: "hsl(var(--chart-5))" }
];

const chartConfig = {
  connections: {
    label: "Connections",
    color: "hsl(var(--chart-1))"
  },
  responses: {
    label: "Responses", 
    color: "hsl(var(--chart-2))"
  },
  meetings: {
    label: "Meetings",
    color: "hsl(var(--chart-3))"
  },
  efficiency: {
    label: "AI Efficiency",
    color: "hsl(var(--chart-4))"
  }
};

export function Dashboard() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
            <h1 className="text-3xl font-bold text-foreground">Good Evening, Karl-Martin</h1>
            <p className="text-muted-foreground mt-1">
              Arthur here! I've been working hard on your pipeline. Here's what we accomplished today.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="primary" 
            className="gap-2"
            onClick={() => setIsChatbotOpen(true)}
          >
            <Bot className="w-4 h-4" />
            Plan with Arthur
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="border-green-500 text-green-600 hover:bg-green-50">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">Connect Arthur to WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with everything Arthur does and chat with him directly through WhatsApp. 
                    Get instant notifications about new connections, responses, and meetings!
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="secondary" className="gap-2">
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

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-glass border-border-subtle backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Neural Performance Analytics</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-mono">LIVE</span>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="connectionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="responsesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}
                width={35}
              />
              <CartesianGrid 
                strokeDasharray="1 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
                horizontal={true}
                vertical={false}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
                        <p className="font-mono text-xs text-muted-foreground mb-2">{label}</p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-sm font-medium">{entry.dataKey}: {entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="hsl(var(--chart-4))"
                strokeWidth={3}
                fill="url(#efficiencyGradient)"
                filter="url(#glow)"
              />
              <Area
                type="monotone"
                dataKey="connections"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#connectionsGradient)"
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#responsesGradient)"
              />
              <ReferenceLine y={80} stroke="hsl(var(--chart-6))" strokeDasharray="2 2" strokeOpacity={0.6} />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-6 bg-gradient-glass border-border-subtle backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Industry Penetration Matrix</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-mono">ACTIVE</span>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-80">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="30%" 
              outerRadius="90%" 
              data={radialData}
              startAngle={90}
              endAngle={450}
            >
              <defs>
                <filter id="radialGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                stroke="hsl(var(--background))"
                strokeWidth={3}
                filter="url(#radialGlow)"
              />
              <Legend 
                content={({ payload }) => (
                  <div className="flex flex-col gap-2 mt-4">
                    {payload?.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full shadow-lg"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {(entry as any).payload?.name || entry.value}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {(entry as any).payload?.value || entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
                        <p className="font-mono text-xs text-muted-foreground mb-1">SECTOR</p>
                        <p className="text-sm font-bold text-foreground mb-2">{payload[0].payload.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }}></div>
                          <span className="text-sm font-medium">Success Rate: {payload[0].value}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadialBarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="bg-gradient-glass border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Campaigns Arthur is Managing</h3>
            <Button variant="outline" size="sm">View All</Button>
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