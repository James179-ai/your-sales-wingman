import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Settings, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Crown,
  Shield,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@closerly.com",
    role: "Admin",
    status: "active",
    avatar: "/placeholder.svg",
    joinDate: "2024-01-01",
    lastActive: "2024-01-15T10:30:00Z",
    campaigns: 12,
    prospects: 1250,
    responseRate: 34,
    permissions: ["manage_campaigns", "manage_team", "manage_billing"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@closerly.com",
    role: "Sales Manager",
    status: "active",
    avatar: "/placeholder.svg",
    joinDate: "2024-01-05",
    lastActive: "2024-01-15T09:45:00Z",
    campaigns: 8,
    prospects: 890,
    responseRate: 42,
    permissions: ["manage_campaigns", "view_analytics"]
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@closerly.com",
    role: "Sales Rep",
    status: "active",
    avatar: "/placeholder.svg",
    joinDate: "2024-01-10",
    lastActive: "2024-01-15T08:20:00Z",
    campaigns: 5,
    prospects: 450,
    responseRate: 28,
    permissions: ["manage_campaigns"]
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@closerly.com",
    role: "Sales Rep",
    status: "inactive",
    avatar: "/placeholder.svg",
    joinDate: "2024-01-12",
    lastActive: "2024-01-14T16:00:00Z",
    campaigns: 3,
    prospects: 200,
    responseRate: 25,
    permissions: ["manage_campaigns"]
  }
];

const roleConfig = {
  "Admin": { icon: Crown, color: "purple", description: "Full access to all features" },
  "Sales Manager": { icon: Shield, color: "blue", description: "Manage campaigns and view analytics" },
  "Sales Rep": { icon: User, color: "green", description: "Create and manage campaigns" }
};

const statusConfig = {
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "gray" },
  pending: { label: "Pending", color: "yellow" }
};

const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Sales Rep");
  const [inviteName, setInviteName] = useState("");
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const formatLastActive = (timestamp: string) => {
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

  const handleInviteMember = () => {
    if (inviteEmail && inviteName && inviteRole) {
      // Here you would typically send an invitation email
      console.log("Inviting member:", { name: inviteName, email: inviteEmail, role: inviteRole });
      
      // Reset form and close modal
      setInviteName("");
      setInviteEmail("");
      setInviteRole("Sales Rep");
      setShowInviteModal(false);
      
      // Show success message (you can integrate with toast later)
      alert(`Invitation sent to ${inviteName} (${inviteEmail})`);
    }
  };

  const handleSendMessage = (member: any) => {
    // Navigate to messages or open compose modal
    console.log("Sending message to:", member.name);
    alert(`Opening message composer for ${member.name}`);
  };

  const handleEditPermissions = (member: any) => {
    setSelectedMember(member);
    setShowPermissionsModal(true);
  };

  const handleRemoveMember = (member: any) => {
    setMemberToRemove(member);
    setShowRemoveDialog(true);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      // Remove the member from the team members array
      setTeamMembers(prevMembers => 
        prevMembers.filter(member => member.id !== memberToRemove.id)
      );
      
      console.log("Removing member:", memberToRemove.name);
      alert(`${memberToRemove.name} has been removed from the team`);
      setShowRemoveDialog(false);
      setMemberToRemove(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team members, roles, and permissions
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                75% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.reduce((sum, member) => sum + member.campaigns, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.length > 0 ? Math.round(teamMembers.reduce((sum, member) => sum + member.responseRate, 0) / teamMembers.length) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Team average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const roleData = roleConfig[member.role as keyof typeof roleConfig];
            const RoleIcon = roleData?.icon || User;
            
            return (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-background border">
                         <DropdownMenuItem onClick={() => handleSendMessage(member)}>
                           <Mail className="w-4 h-4 mr-2" />
                           Send Message
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleEditPermissions(member)}>
                           <Settings className="w-4 h-4 mr-2" />
                           Edit Permissions
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                           className="text-destructive focus:text-destructive"
                           onClick={() => handleRemoveMember(member)}
                         >
                           Remove Member
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RoleIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{member.role}</span>
                    </div>
                    <Badge 
                      variant={statusConfig[member.status as keyof typeof statusConfig]?.color === 'green' ? 'default' : 'secondary'}
                    >
                      {statusConfig[member.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{member.campaigns}</p>
                      <p className="text-xs text-muted-foreground">Campaigns</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{member.prospects}</p>
                      <p className="text-xs text-muted-foreground">Prospects</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{member.responseRate}%</p>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                    <p>Last active: {formatLastActive(member.lastActive)}</p>
                  </div>
                  
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex-1"
                       onClick={() => handleSendMessage(member)}
                     >
                       <Mail className="w-4 h-4 mr-1" />
                       Message
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex-1"
                       onClick={() => handleEditPermissions(member)}
                     >
                       <Settings className="w-4 h-4 mr-1" />
                       Settings
                     </Button>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No team members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search criteria or invite new members.
              </p>
              <Button className="mt-4" onClick={() => setShowInviteModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Member Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member. They'll receive an email with instructions to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="John Doe"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="john@company.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleInviteMember} disabled={!inviteEmail || !inviteName}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Modal */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              Modify permissions for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="member-role" className="text-right">
                Role
              </Label>
              <Select defaultValue={selectedMember?.role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {selectedMember?.permissions.map((permission: string) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input type="checkbox" id={permission} defaultChecked />
                    <label htmlFor={permission} className="text-sm">
                      {permission.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPermissionsModal(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from the team? 
              This action cannot be undone and they will lose access to all team resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Team;