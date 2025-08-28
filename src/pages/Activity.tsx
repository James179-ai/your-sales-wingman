import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  UserPlus, 
  Calendar, 
  Mail, 
  Phone, 
  Eye, 
  Filter,
  Download,
  Activity as ActivityIcon,
  TrendingUp,
  Users,
  Target
} from "lucide-react";

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: "message_sent",
    description: "Sent LinkedIn message to John Smith",
    prospect: "John Smith",
    campaign: "Q1 Outreach",
    timestamp: "2024-01-15T10:30:00Z",
    status: "delivered",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    type: "connection_accepted",
    description: "Sarah Johnson accepted connection request",
    prospect: "Sarah Johnson",
    campaign: "Tech Leaders",
    timestamp: "2024-01-15T09:15:00Z",
    status: "success",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    type: "meeting_booked",
    description: "Meeting booked with Mike Davis",
    prospect: "Mike Davis",
    campaign: "Enterprise Sales",
    timestamp: "2024-01-15T08:45:00Z",
    status: "success",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    type: "profile_viewed",
    description: "Profile viewed by Emma Wilson",
    prospect: "Emma Wilson",
    campaign: "Startup Founders",
    timestamp: "2024-01-14T16:20:00Z",
    status: "info",
    avatar: "/placeholder.svg"
  },
  {
    id: 5,
    type: "message_replied",
    description: "Reply received from Alex Chen",
    prospect: "Alex Chen",
    campaign: "Q1 Outreach",
    timestamp: "2024-01-14T14:10:00Z",
    status: "success",
    avatar: "/placeholder.svg"
  },
  {
    id: 6,
    type: "connection_sent",
    description: "Connection request sent to Lisa Park",
    prospect: "Lisa Park",
    campaign: "Marketing Directors",
    timestamp: "2024-01-14T11:30:00Z",
    status: "pending",
    avatar: "/placeholder.svg"
  }
];

const activityTypeConfig = {
  message_sent: { icon: MessageCircle, label: "Message Sent", color: "blue" },
  connection_accepted: { icon: UserPlus, label: "Connection Accepted", color: "green" },
  meeting_booked: { icon: Calendar, label: "Meeting Booked", color: "purple" },
  profile_viewed: { icon: Eye, label: "Profile Viewed", color: "gray" },
  message_replied: { icon: Mail, label: "Message Reply", color: "green" },
  connection_sent: { icon: UserPlus, label: "Connection Sent", color: "blue" },
  call_scheduled: { icon: Phone, label: "Call Scheduled", color: "orange" }
};

const statusConfig = {
  delivered: { label: "Delivered", color: "blue" },
  success: { label: "Success", color: "green" },
  pending: { label: "Pending", color: "yellow" },
  failed: { label: "Failed", color: "red" },
  info: { label: "Info", color: "gray" }
};

const Activity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter activities
  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.prospect.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || activity.type === selectedType;
    const matchesStatus = selectedStatus === "all" || activity.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Arthur's Activity Report</h1>
            <p className="text-muted-foreground mt-2">
              Watch how Arthur's been working hard for you! Every action tracked in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arthur's Activity Today</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                Arthur's on fire today!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Arthur Sent</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Staying consistent!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connections Arthur Made</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Great networking day!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34%</div>
              <p className="text-xs text-muted-foreground">
                Arthur's messages are hitting the mark!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="message_sent">Messages</SelectItem>
                <SelectItem value="connection_accepted">Connections</SelectItem>
                <SelectItem value="meeting_booked">Meetings</SelectItem>
                <SelectItem value="profile_viewed">Profile Views</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Arthur's Recent Work</CardTitle>
            <CardDescription>
              Here's everything Arthur accomplished in your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const typeConfig = activityTypeConfig[activity.type as keyof typeof activityTypeConfig];
                const Icon = typeConfig?.icon || ActivityIcon;
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border border-border-subtle hover:bg-surface-elevated/50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>
                        {activity.prospect.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {typeConfig?.label || 'Activity'}
                        </span>
                        <Badge variant={statusConfig[activity.status as keyof typeof statusConfig]?.color === 'green' ? 'default' : 'secondary'}>
                          {statusConfig[activity.status as keyof typeof statusConfig]?.label || activity.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground space-x-4">
                        <span>Campaign: {activity.campaign}</span>
                        <span>{formatTime(activity.timestamp)}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">No activities to show yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Arthur's getting ready to start working! Check back soon to see his progress.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Activity;