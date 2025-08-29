import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddProspectModal } from "@/components/prospects/AddProspectModal";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  MapPin,
  Star,
  Trash2,
  Edit
} from "lucide-react";

// Import prospect images
import sarahJohnsonImg from "@/assets/prospects/sarah-johnson.jpg";
import michaelChenImg from "@/assets/prospects/michael-chen.jpg";
import emilyRodriguezImg from "@/assets/prospects/emily-rodriguez.jpg";
import davidKimImg from "@/assets/prospects/david-kim.jpg";

const prospects = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Inc",
    position: "VP Marketing",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "active",
    priority: "high",
    lastContact: "2024-01-15",
    tags: ["Enterprise", "Marketing"],
    avatar: sarahJohnsonImg
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@startup.io",
    company: "StartupIO",
    position: "Founder & CEO",
    phone: "+1 (555) 987-6543",
    location: "Austin, TX",
    status: "contacted",
    priority: "high",
    lastContact: "2024-01-12",
    tags: ["Startup", "SaaS"],
    avatar: michaelChenImg
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@bigcorp.com",
    company: "BigCorp Solutions",
    position: "Director of Sales",
    phone: "+1 (555) 456-7890",
    location: "New York, NY",
    status: "replied",
    priority: "medium",
    lastContact: "2024-01-10",
    tags: ["Enterprise", "Sales"],
    avatar: emilyRodriguezImg
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@midsize.com",
    company: "MidSize Co",
    position: "Marketing Manager",
    phone: "+1 (555) 321-0987",
    location: "Chicago, IL",
    status: "bounced",
    priority: "low",
    lastContact: "2024-01-08",
    tags: ["SMB", "Marketing"],
    avatar: davidKimImg
  }
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  contacted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  replied: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  bounced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const priorityColors = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  low: "text-green-600 dark:text-green-400"
};

export default function Prospects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prospect.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || prospect.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || prospect.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddProspects = (newProspects: any[]) => {
    // In a real app, this would update the prospects list
    console.log("New prospects added:", newProspects);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Arthur's Prospect Database</h1>
            <p className="text-muted-foreground">Arthur is managing your prospect pipeline. Here's who's in the queue!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Help Arthur Add Prospects
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-surface border-border-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Arthur's Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">823</div>
              <p className="text-xs text-muted-foreground">Ready for outreach</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">298</div>
              <p className="text-xs text-muted-foreground">Arthur reached out</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Replied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">126</div>
              <p className="text-xs text-muted-foreground">Great success rate!</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Arthur's Prospect Intel</CardTitle>
            <CardDescription>Search and filter through your carefully curated prospect list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search prospects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background border-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px] bg-background border-input">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Prospects Table */}
            <div className="border border-border-subtle rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground font-medium">Prospect</TableHead>
                    <TableHead className="text-foreground font-medium">Company</TableHead>
                    <TableHead className="text-foreground font-medium">Status</TableHead>
                    <TableHead className="text-foreground font-medium">Priority</TableHead>
                    <TableHead className="text-foreground font-medium">Last Contact</TableHead>
                    <TableHead className="text-foreground font-medium">Tags</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProspects.map((prospect) => (
                    <TableRow key={prospect.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={prospect.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {prospect.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{prospect.name}</div>
                            <div className="text-sm text-muted-foreground">{prospect.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{prospect.company}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {prospect.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[prospect.status as keyof typeof statusColors]}>
                          {prospect.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 mr-1 ${priorityColors[prospect.priority as keyof typeof priorityColors]}`} />
                          <span className="capitalize text-foreground">{prospect.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{prospect.lastContact}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {prospect.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddProspectModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onProspectsAdded={handleAddProspects}
      />
    </AppLayout>
  );
}