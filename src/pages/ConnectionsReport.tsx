import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Download, Filter, Calendar, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const weeklyDetailedData = [
  { name: "Mon", connections: 12, responses: 3, meetings: 1, campaign: "Tech Startup" },
  { name: "Tue", connections: 19, responses: 5, meetings: 2, campaign: "SaaS Decision" },
  { name: "Wed", connections: 15, responses: 4, meetings: 1, campaign: "Tech Startup" },
  { name: "Thu", connections: 22, responses: 7, meetings: 3, campaign: "Marketing Directors" },
  { name: "Fri", connections: 18, responses: 4, meetings: 1, campaign: "SaaS Decision" },
  { name: "Sat", connections: 8, responses: 1, meetings: 0, campaign: "Tech Startup" },
  { name: "Sun", connections: 5, responses: 1, meetings: 0, campaign: "Marketing Directors" }
];

const monthlyData = [
  { name: "Week 1", connections: 89, responses: 21, meetings: 8, campaign: "All" },
  { name: "Week 2", connections: 96, responses: 24, meetings: 9, campaign: "All" },
  { name: "Week 3", connections: 102, responses: 28, meetings: 12, campaign: "All" },
  { name: "Week 4", connections: 99, responses: 25, meetings: 10, campaign: "All" }
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
  }
};

const ConnectionsReport = () => {
  const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState({
    campaigns: {
      "Tech Startup": true,
      "SaaS Decision": true,
      "Marketing Directors": true
    },
    dateRange: "all",
    showWeekends: true
  });

  // Calculate filtered data
  const filteredWeeklyData = useMemo(() => {
    let data = weeklyDetailedData;
    
    // Filter by campaigns
    const activeCampaigns = Object.keys(filters.campaigns).filter(
      campaign => filters.campaigns[campaign]
    );
    data = data.filter(item => activeCampaigns.includes(item.campaign));
    
    // Filter weekends if needed
    if (!filters.showWeekends) {
      data = data.filter(item => !["Sat", "Sun"].includes(item.name));
    }
    
    return data;
  }, [filters]);

  // Calculate totals from filtered data
  const totals = useMemo(() => {
    const connections = filteredWeeklyData.reduce((sum, item) => sum + item.connections, 0);
    const responses = filteredWeeklyData.reduce((sum, item) => sum + item.responses, 0);
    const meetings = filteredWeeklyData.reduce((sum, item) => sum + item.meetings, 0);
    const responseRate = connections > 0 ? Math.round((responses / connections) * 100) : 0;
    
    return { connections, responses, meetings, responseRate };
  }, [filteredWeeklyData]);

  const handleFilterChange = (filterType: string, filterKey: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [filterKey]: value
      }
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Connections Report</h1>
              <p className="text-muted-foreground">
                Detailed analysis of Arthur's connection activity
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Campaign</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(filters.campaigns).map((campaign) => (
                  <DropdownMenuCheckboxItem
                    key={campaign}
                    checked={filters.campaigns[campaign]}
                    onCheckedChange={(checked) => 
                      handleFilterChange("campaigns", campaign, checked)
                    }
                  >
                    {campaign}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Date Options</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.showWeekends}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, showWeekends: checked }))
                  }
                >
                  Include Weekends
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="primary" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totals.connections}</p>
              <p className="text-sm text-muted-foreground">Total Connections</p>
              <p className="text-xs text-success mt-1">+15% vs last week</p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totals.responses}</p>
              <p className="text-sm text-muted-foreground">Total Responses</p>
              <p className="text-xs text-success mt-1">+8% vs last week</p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totals.meetings}</p>
              <p className="text-sm text-muted-foreground">Total Meetings</p>
              <p className="text-xs text-success mt-1">+12% vs last week</p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totals.responseRate}%</p>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-xs text-success mt-1">+2% vs last week</p>
            </div>
          </Card>
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Daily Connections</h3>
              <p className="text-sm text-muted-foreground">Connections, responses, and meetings by day</p>
            </div>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={filteredWeeklyData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Bar dataKey="connections" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="responses" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Weekly Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly performance trends</p>
            </div>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="connections" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-elevated rounded-lg border border-border-subtle">
              <h4 className="font-medium text-foreground mb-2">Best Performing Day</h4>
              <p className="text-sm text-muted-foreground">Thursday with 22 connections and 3 meetings</p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg border border-border-subtle">
              <h4 className="font-medium text-foreground mb-2">Improvement Opportunity</h4>
              <p className="text-sm text-muted-foreground">Weekend activity could be increased by 40%</p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg border border-border-subtle">
              <h4 className="font-medium text-foreground mb-2">Response Rate Trend</h4>
              <p className="text-sm text-muted-foreground">Consistent improvement over the past month</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConnectionsReport;