import { KPICard } from "./KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  BarChart3
} from "lucide-react";
import aiSalesmanAvatar from "@/assets/ai-salesman-avatar.jpg";

const mockKPIs = [
  {
    title: "Connections Sent Today",
    value: 18,
    change: "+15% vs yesterday",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Messages Sent",
    value: 42,
    change: "+8% vs last week",
    changeType: "positive" as const,
    icon: MessageSquare
  },
  {
    title: "Response Rate",
    value: "23%",
    change: "+2% vs last month",
    changeType: "positive" as const,
    icon: TrendingUp
  },
  {
    title: "Meetings Booked",
    value: 7,
    change: "3 this week",
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

export function Dashboard() {
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
              Your AI sales assistant is ready. Here's your LinkedIn outreach performance.
            </p>
          </div>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground bg-surface-elevated rounded-lg">
            <p>Chart will be implemented with Recharts</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Response Rate by Campaign</h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground bg-surface-elevated rounded-lg">
            <p>Response rate chart placeholder</p>
          </div>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="bg-gradient-glass border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
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
    </div>
  );
}