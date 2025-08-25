import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Globe, 
  Sparkles, 
  Save, 
  Play,
  Users,
  MessageSquare
} from "lucide-react";

interface CampaignBuilderProps {
  onBack?: () => void;
}

export function CampaignBuilder({ onBack }: CampaignBuilderProps) {
  const [campaignData, setCampaignData] = useState({
    name: "",
    language: "EN",
    userType: "company",
    linkedinUrl: "",
    companyWebsite: "",
    goal: "",
    calendlyUrl: ""
  });

  const [aiFields, setAiFields] = useState({
    companyName: "",
    description: "",
    product: "",
    problems: "",
    benefits: "",
    industry: ""
  });

  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleAutoFill = async () => {
    if (!campaignData.companyWebsite) return;
    
    setIsAutoFilling(true);
    // Simulate AI autofill - in real app this would call backend
    setTimeout(() => {
      setAiFields({
        companyName: "TechCorp Solutions",
        description: "A leading B2B SaaS platform for sales automation",
        product: "AI-powered sales outreach platform",
        problems: "Manual prospecting, low response rates, time-consuming follow-ups",
        benefits: "3x faster prospecting, 40% higher response rates, automated workflows",
        industry: "Technology / SaaS"
      });
      setIsAutoFilling(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaign Builder</h1>
            <p className="text-muted-foreground mt-1">
              Create a new LinkedIn outreach campaign
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="primary">
            <Play className="w-4 h-4 mr-2" />
            Activate Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g., Tech Startup Outreach"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={campaignData.language} onValueChange={(value) => setCampaignData({...campaignData, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="ES">Spanish</SelectItem>
                    <SelectItem value="FR">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select value={campaignData.userType} onValueChange={(value) => setCampaignData({...campaignData, userType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">Your LinkedIn URL</Label>
                <Input 
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={campaignData.linkedinUrl}
                  onChange={(e) => setCampaignData({...campaignData, linkedinUrl: e.target.value})}
                />
              </div>
            </div>
          </Card>

          {/* Company Information */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAutoFill}
                disabled={!campaignData.companyWebsite || isAutoFilling}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isAutoFilling ? "Auto-filling..." : "Auto-fill from Website"}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="website"
                    className="pl-10"
                    placeholder="https://yourcompany.com"
                    value={campaignData.companyWebsite}
                    onChange={(e) => setCampaignData({...campaignData, companyWebsite: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    placeholder="Your Company Name"
                    value={aiFields.companyName}
                    onChange={(e) => setAiFields({...aiFields, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry"
                    placeholder="e.g., Technology / SaaS"
                    value={aiFields.industry}
                    onChange={(e) => setAiFields({...aiFields, industry: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Brief description of your company..."
                  value={aiFields.description}
                  onChange={(e) => setAiFields({...aiFields, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product/Service</Label>
                <Textarea 
                  id="product"
                  placeholder="What product or service do you offer?"
                  value={aiFields.product}
                  onChange={(e) => setAiFields({...aiFields, product: e.target.value})}
                />
              </div>
            </div>
          </Card>

          {/* Messaging Strategy */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4">Messaging Strategy</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="problems">Problems You Solve</Label>
                <Textarea 
                  id="problems"
                  placeholder="What problems does your solution address?"
                  value={aiFields.problems}
                  onChange={(e) => setAiFields({...aiFields, problems: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Key Benefits</Label>
                <Textarea 
                  id="benefits"
                  placeholder="What are the main benefits of your solution?"
                  value={aiFields.benefits}
                  onChange={(e) => setAiFields({...aiFields, benefits: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Campaign Goal</Label>
                <Textarea 
                  id="goal"
                  placeholder="What do you want to achieve with this campaign?"
                  value={campaignData.goal}
                  onChange={(e) => setCampaignData({...campaignData, goal: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calendly">Calendly Link</Label>
                <Input 
                  id="calendly"
                  placeholder="https://calendly.com/yourlink"
                  value={campaignData.calendlyUrl}
                  onChange={(e) => setCampaignData({...campaignData, calendlyUrl: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Limits */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Limits</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Daily Connections</span>
                <Badge variant="outline">20</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Weekly Connections</span>
                <Badge variant="outline">100</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Monthly Connections</span>
                <Badge variant="outline">400</Badge>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add Prospects</p>
                  <p className="text-xs text-muted-foreground">Upload CSV or add manually</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Message Generation</p>
                  <p className="text-xs text-muted-foreground">Automatic after activation</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Preview Message */}
          <Card className="p-6 bg-gradient-glass border-border-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4">Message Preview</h3>
            <div className="bg-surface-elevated rounded-lg p-4 text-sm">
              <p className="text-muted-foreground mb-2">Hi [First Name],</p>
              <p className="text-muted-foreground mb-2">
                I noticed you work in [Industry] and thought you might be interested in how [Company Name] helps companies like yours solve [Problem].
              </p>
              <p className="text-muted-foreground mb-2">
                Would you be open to a brief 15-minute chat to see if there's a fit?
              </p>
              <p className="text-muted-foreground">Best regards,<br />[Your Name]</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}