import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { getCampaigns } from "@/utils/campaignStorage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBuilder } from "@/components/campaigns/CampaignBuilder";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TypewriterText } from "@/components/ui/typewriter-text";
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
import aiSalesmanAvatar from "@/assets/ai-salesman-avatar.jpg";

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

const arthurMessages = [
  "Hey there! Here's how all your campaigns are performing. I'm pretty proud of these numbers - we make a great team!",
  "Welcome to your campaign war room! I've been fine-tuning everything to maximize your results.",
  "Check out these beautiful campaigns I've built for you! Each one is crafted for maximum impact."
];

export default function Campaigns() {
  const navigate = useNavigate();
  const [showBuilder, setShowBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  // Load campaigns from storage and trigger typewriter on component mount
  useEffect(() => {
    setTypewriterKey(Date.now());
    const savedCampaigns = getCampaigns();
    // Combine saved campaigns with mock campaigns, with saved campaigns first
    setCampaigns([...savedCampaigns, ...mockCampaigns]);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
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
        {/* Header with enhanced styling */}
        <div className="flex items-center justify-between p-6 bg-gradient-glass rounded-2xl border border-border-subtle/50 shadow-lg">
          <div className="flex items-center gap-5">
            <div className="relative animate-float">
              <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-glow ring-2 ring-primary/10">
                <AvatarImage src={aiSalesmanAvatar} alt="Arthur AI" />
                <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">AI</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                Your Campaign War Room
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
          <Button variant="primary" size="lg" className="gap-2 text-base px-6" onClick={() => navigate('/campaigns/new')}>
            <Plus className="w-5 h-5" />
            Build New Campaign
          </Button>
        </div>

        {/* Stats Overview with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden glassmorphism rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-subtle/50">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Campaigns</p>
                <p className="text-3xl font-bold text-foreground mt-2">{campaigns.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
          <Card className="group relative overflow-hidden glassmorphism rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-subtle/50">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Active Now</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
          <Card className="group relative overflow-hidden glassmorphism rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-subtle/50">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Prospects</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {campaigns.reduce((sum, c) => sum + c.prospects, 0)}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
          <Card className="group relative overflow-hidden glassmorphism rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-subtle/50">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avg Response</p>
                <p className="text-3xl font-bold text-foreground mt-2">19.2%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
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

        {/* Campaigns Grid with enhanced cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="group relative overflow-hidden glassmorphism rounded-2xl border-border-subtle/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors">{campaign.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-white border-none shadow-sm ${statusConfig[campaign.status as keyof typeof statusConfig].color}`}
                      >
                        {statusConfig[campaign.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-surface-elevated/70 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats with gradient backgrounds */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-4 bg-surface-elevated/50 rounded-xl border border-border-subtle/30 hover:border-primary/30 transition-colors">
                    <p className="text-2xl font-bold text-foreground">{campaign.prospects}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Prospects</p>
                  </div>
                  <div className="text-center p-4 bg-surface-elevated/50 rounded-xl border border-border-subtle/30 hover:border-primary/30 transition-colors">
                    <p className="text-2xl font-bold text-foreground">{campaign.connections}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Connected</p>
                  </div>
                  <div className="text-center p-4 bg-surface-elevated/50 rounded-xl border border-border-subtle/30 hover:border-primary/30 transition-colors">
                    <p className="text-2xl font-bold text-foreground">{campaign.messages}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Messages</p>
                  </div>
                  <div className="text-center p-4 bg-surface-elevated/50 rounded-xl border border-border-subtle/30 hover:border-accent/30 transition-colors">
                    <p className="text-2xl font-bold text-success">{campaign.responseRate}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Response</p>
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

                {/* Actions with gradient buttons */}
                <div className="flex space-x-2">
                  {campaign.status === 'active' && (
                    <Button variant="outline" size="sm" className="flex-1 font-semibold">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button variant="primary" size="sm" className="flex-1 font-semibold">
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  {campaign.status === 'draft' && (
                    <Button variant="primary" size="sm" className="flex-1 font-semibold">
                      <Play className="w-4 h-4 mr-1" />
                      Launch
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="hover:bg-surface-elevated/70">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State with enhanced styling */}
        {filteredCampaigns.length === 0 && (
          <Card className="p-16 text-center glassmorphism border-border-subtle/50 shadow-lg rounded-2xl">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No campaigns found</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto font-medium">
              {searchTerm ? 
                "Arthur couldn't find any campaigns matching your search." : 
                "Ready to get started? Let Arthur build your first campaign and start filling your pipeline!"
              }
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/campaigns/new')}>
              <Plus className="w-5 h-5 mr-2" />
              Start Your First Campaign
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}