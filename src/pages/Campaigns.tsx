import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBuilder } from "@/components/campaigns/CampaignBuilder";
import { 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  MoreHorizontal,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  BarChart3
} from "lucide-react";

const mockCampaigns = [
  {
    id: 1,
    name: "Tech Startup Outreach",
    status: "active",
    language: "EN",
    userType: "company",
    createdAt: "2024-01-10",
    prospects: 156,
    connections: 89,
    messages: 42,
    responses: 12,
    meetings: 3,
    responseRate: "13.5%",
    dailyCap: 20,
    weeklyCap: 100,
    monthlyCap: 400
  },
  {
    id: 2,
    name: "SaaS Decision Makers",
    status: "active", 
    language: "EN",
    userType: "company",
    createdAt: "2024-01-08",
    prospects: 234,
    connections: 156,
    messages: 89,
    responses: 23,
    meetings: 7,
    responseRate: "25.8%",
    dailyCap: 15,
    weeklyCap: 75,
    monthlyCap: 300
  },
  {
    id: 3,
    name: "Marketing Directors EU",
    status: "paused",
    language: "EN",
    userType: "freelancer",
    createdAt: "2024-01-05",
    prospects: 89,
    connections: 67,
    messages: 34,
    responses: 8,
    meetings: 2,
    responseRate: "23.5%",
    dailyCap: 10,
    weeklyCap: 50,
    monthlyCap: 200
  },
  {
    id: 4,
    name: "Fintech Founders",
    status: "draft",
    language: "EN",
    userType: "company",
    createdAt: "2024-01-15",
    prospects: 45,
    connections: 0,
    messages: 0,
    responses: 0,
    meetings: 0,
    responseRate: "0%",
    dailyCap: 20,
    weeklyCap: 100,
    monthlyCap: 400
  }
];

const statusConfig = {
  active: { label: "Active", color: "bg-success", textColor: "text-success" },
  paused: { label: "Paused", color: "bg-warning", textColor: "text-warning" },
  draft: { label: "Draft", color: "bg-muted-foreground", textColor: "text-muted-foreground" },
  completed: { label: "Completed", color: "bg-primary", textColor: "text-primary" }
};

export default function Campaigns() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || campaign.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (showBuilder) {
    return (
      <AppLayout>
        <CampaignBuilder onBack={() => setShowBuilder(false)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Manage your LinkedIn outreach campaigns
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold text-foreground">{mockCampaigns.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-success" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Prospects</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockCampaigns.reduce((sum, c) => sum + c.prospects, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Rate</p>
                <p className="text-2xl font-bold text-foreground">19.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-gradient-glass border-border-subtle hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{campaign.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-white border-none ${statusConfig[campaign.status as keyof typeof statusConfig].color}`}
                      >
                        {statusConfig[campaign.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <p className="text-lg font-bold text-foreground">{campaign.prospects}</p>
                    <p className="text-xs text-muted-foreground">Prospects</p>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <p className="text-lg font-bold text-foreground">{campaign.connections}</p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <p className="text-lg font-bold text-foreground">{campaign.messages}</p>
                    <p className="text-xs text-muted-foreground">Messages</p>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <p className="text-lg font-bold text-success">{campaign.responseRate}</p>
                    <p className="text-xs text-muted-foreground">Response Rate</p>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{campaign.responses} responses</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{campaign.meetings} meetings</span>
                  </div>
                </div>

                {/* Daily Limits */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Daily Limit</span>
                    <span className="text-muted-foreground">{campaign.dailyCap}/day</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min((campaign.connections / campaign.dailyCap) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {campaign.status === 'active' && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  {campaign.status === 'draft' && (
                    <Button variant="primary" size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <Card className="p-12 text-center bg-gradient-glass border-border-subtle">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 
                "No campaigns match your search criteria." : 
                "Get started by creating your first LinkedIn outreach campaign."
              }
            </p>
            <Button variant="primary" onClick={() => setShowBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}