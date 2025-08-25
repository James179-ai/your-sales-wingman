import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Plus, 
  Users, 
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Calendar,
  XCircle
} from "lucide-react";

const mockProspects = [
  {
    id: 1,
    firstName: "Sarah",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    status: "connected",
    profile: {
      title: "VP of Sales",
      company: "TechCorp Inc",
      summary: "Experienced sales leader in B2B SaaS"
    },
    aiSummary: "Strong sales background, recently posted about automation challenges",
    lastActionAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    firstName: "Michael",
    linkedinUrl: "https://linkedin.com/in/michaelr",
    status: "messaged",
    profile: {
      title: "Director of Marketing",
      company: "Growth Labs",
      summary: "Digital marketing expert focusing on lead generation"
    },
    aiSummary: "Active in marketing communities, interested in growth tools",
    lastActionAt: "2024-01-14T15:45:00Z"
  },
  {
    id: 3,
    firstName: "Jennifer",
    linkedinUrl: "https://linkedin.com/in/jenniferwang",
    status: "responded_positive",
    profile: {
      title: "CEO",
      company: "StartupXYZ",
      summary: "Serial entrepreneur in fintech space"
    },
    aiSummary: "Founder mindset, looking for scalable solutions",
    lastActionAt: "2024-01-13T09:15:00Z"
  }
];

const statusConfig = {
  new: { label: "New", color: "bg-blue-500", icon: Clock },
  connected: { label: "Connected", color: "bg-green-500", icon: CheckCircle },
  messaged: { label: "Messaged", color: "bg-yellow-500", icon: MessageSquare },
  followed_up: { label: "Followed Up", color: "bg-orange-500", icon: MessageSquare },
  responded_positive: { label: "Positive Response", color: "bg-emerald-500", icon: CheckCircle },
  responded_negative: { label: "Not Interested", color: "bg-red-500", icon: XCircle },
  error: { label: "Error", color: "bg-gray-500", icon: AlertCircle }
};

export function ProspectManager() {
  const [newProspect, setNewProspect] = useState({ firstName: "", linkedinUrl: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddProspect = () => {
    if (newProspect.firstName && newProspect.linkedinUrl) {
      // Add prospect logic here
      setNewProspect({ firstName: "", linkedinUrl: "" });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prospect Management</h1>
          <p className="text-muted-foreground mt-1">
            Add and manage your LinkedIn prospects
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            {mockProspects.length} Total Prospects
          </Badge>
        </div>
      </div>

      {/* Add Prospects Section */}
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual">Add Manually</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center space-x-2 mb-4">
              <Plus className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Add Individual Prospect</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName"
                  placeholder="John"
                  value={newProspect.firstName}
                  onChange={(e) => setNewProspect({...newProspect, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input 
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={newProspect.linkedinUrl}
                  onChange={(e) => setNewProspect({...newProspect, linkedinUrl: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleAddProspect}
                >
                  Add Prospect
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-6">
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center space-x-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Upload CSV File</h3>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-text-subtle mb-4">
                  Required columns: first_name, linkedin_url
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                  Choose File
                </Button>
                {selectedFile && (
                  <p className="text-sm text-foreground mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              {selectedFile && (
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary">
                    Import Prospects
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prospects Table */}
      <Card className="bg-gradient-glass border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-lg font-semibold text-foreground">Your Prospects</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockProspects.map((prospect) => {
              const StatusIcon = statusConfig[prospect.status as keyof typeof statusConfig].icon;
              return (
                <div key={prospect.id} className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-subtle">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">{prospect.firstName[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{prospect.firstName}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-white border-none ${statusConfig[prospect.status as keyof typeof statusConfig].color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[prospect.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prospect.profile.title} at {prospect.profile.company}
                      </p>
                      {prospect.aiSummary && (
                        <p className="text-sm text-text-subtle mt-1">
                          AI Summary: {prospect.aiSummary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      Messages
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}