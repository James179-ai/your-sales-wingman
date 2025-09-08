import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { saveCampaign } from "@/utils/campaignStorage";
import { 
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  MessageSquare,
  Calendar as CalendarIcon,
  Settings,
  Eye,
  Send,
  Save,
  Sparkles,
  Clock,
  Globe,
  Building,
  MapPin,
  Briefcase,
  Mail,
  Linkedin,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface CampaignData {
  // Company Analysis
  websiteUrl: string;
  companySummary: string;
  
  // Basic Info
  name: string;
  description: string;
  objective: string;
  
  // Target Audience
  targetIndustries: string[];
  targetRoles: string[];
  companySize: string[];
  locations: string[];
  keywords: string;
  excludeKeywords: string;
  
  // Messages
  messages: {
    id: string;
    type: 'connection' | 'follow_up_1' | 'follow_up_2' | 'follow_up_3';
    subject?: string;
    content: string;
    delay: number; // days
  }[];
  
  // Schedule & Limits
  startDate: Date | undefined;
  endDate: Date | undefined;
  dailyLimit: number;
  weeklyLimit: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  
  // Advanced Settings
  useAiPersonalization: boolean;
  autoConnect: boolean;
  autoFollow: boolean;
  trackOpens: boolean;
  trackClicks: boolean;
}

const steps = [
  { id: 1, name: "Company Analysis", icon: Globe },
  { id: 2, name: "Campaign Info", icon: Target },
  { id: 3, name: "Target Audience", icon: Users },
  { id: 4, name: "Messages", icon: MessageSquare },
  { id: 5, name: "Schedule", icon: CalendarIcon },
  { id: 6, name: "Review & Launch", icon: Send }
];

const industries = [
  "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", 
  "Consulting", "Education", "Real Estate", "Media", "Non-profit", "Other"
];

const roles = [
  "CEO", "CTO", "VP Engineering", "VP Sales", "VP Marketing", 
  "Director", "Manager", "Senior Engineer", "Software Engineer", "Designer", "Other"
];

const companySizes = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
];

const messageTemplates = {
  connection: [
    {
      title: "Professional Introduction",
      content: "Hi {{firstName}}, I came across your profile and was impressed by your experience at {{company}}. I'd love to connect and learn more about your work in {{industry}}."
    },
    {
      title: "Mutual Connection",
      content: "Hi {{firstName}}, I noticed we have several mutual connections in the {{industry}} space. Would love to connect and expand our network."
    },
    {
      title: "Industry Interest",
      content: "Hi {{firstName}}, I'm reaching out to professionals in {{industry}} to discuss trends and opportunities. Your background at {{company}} caught my attention."
    }
  ],
  follow_up_1: [
    {
      title: "Value Proposition",
      content: "Hi {{firstName}}, thanks for connecting! I help {{targetRole}} at companies like {{company}} improve their {{value}}. Would you be interested in a brief chat?"
    },
    {
      title: "Resource Sharing",
      content: "Hi {{firstName}}, I thought you might find this resource valuable for your work at {{company}}. Happy to discuss how it could apply to your specific challenges."
    }
  ]
};

const NewCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    websiteUrl: "",
    companySummary: "",
    name: "",
    description: "",
    objective: "",
    targetIndustries: [],
    targetRoles: [],
    companySize: [],
    locations: [],
    keywords: "",
    excludeKeywords: "",
    messages: [
      {
        id: "connection",
        type: "connection",
        content: "",
        delay: 0
      }
    ],
    startDate: undefined,
    endDate: undefined,
    dailyLimit: 20,
    weeklyLimit: 100,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workingHours: { start: "09:00", end: "17:00" },
    timezone: "America/New_York",
    useAiPersonalization: true,
    autoConnect: true,
    autoFollow: false,
    trackOpens: true,
    trackClicks: true
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [customRole, setCustomRole] = useState("");

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const addMessage = (type: 'follow_up_1' | 'follow_up_2' | 'follow_up_3') => {
    const newMessage = {
      id: type,
      type,
      content: "",
      delay: type === 'follow_up_1' ? 3 : type === 'follow_up_2' ? 7 : 14
    };
    
    setCampaignData(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const updateMessage = (messageId: string, updates: Partial<CampaignData['messages'][0]>) => {
    setCampaignData(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    }));
  };

  const removeMessage = (messageId: string) => {
    setCampaignData(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
  };

  const useTemplate = (messageId: string, template: any) => {
    updateMessage(messageId, { content: template.content });
  };

  const analyzeWebsite = async () => {
    if (!campaignData.websiteUrl) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a sample summary based on the example provided
      const summary = "Bellus is one of Northern Europe's leading upholstered furniture manufacturers, producing over 100,000 sofas and beds every year since 1997. We combine Scandinavian design with Nordic comfort, creating high-quality furniture that adds warmth and elegance to modern homes. What makes Bellus unique is our ability to deliver mass-customization at scale: retailers can showcase just a few models in-store while offering customers hundreds of variations in fabrics, leathers, sizes, and finishes. This eliminates the need for large inventories while giving end customers a sense of tailor-made exclusivity. Our lean production and advanced order-tracking systems ensure fast turnaround times, even for small orders, with direct delivery across Europe. With no freight costs and no minimum order requirements, resellers gain flexibility, reduced risk, and higher margins. In short, Bellus gives retailers a powerful competitive edge: more choice, more satisfied customers, and faster growth with less operational burden.";
      
      updateCampaignData({ companySummary: summary });
      
      toast({
        title: "Analysis Complete",
        description: "Company summary generated successfully"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(campaignData.websiteUrl && campaignData.companySummary);
      case 2:
        return !!(campaignData.name && campaignData.objective);
      case 3:
        return campaignData.targetIndustries.length > 0 || campaignData.targetRoles.length > 0;
      case 4:
        return campaignData.messages.every(msg => msg.content.trim().length > 0);
      case 5:
        return !!(campaignData.startDate && campaignData.dailyLimit > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } else {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveDraft = () => {
    try {
      saveCampaign(campaignData, 'draft');
      toast({
        title: "Draft Saved",
        description: "Your campaign has been saved as a draft"
      });
      navigate("/campaigns");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const launchCampaign = () => {
    if (validateStep(currentStep)) {
      try {
        saveCampaign(campaignData, 'active');
        toast({
          title: "Campaign Launched!",
          description: `"${campaignData.name}" has been launched successfully`
        });
        navigate("/campaigns");
      } catch (error) {
        toast({
          title: "Error", 
          description: "Failed to launch campaign. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Let's analyze your business</h2>
              <p className="text-muted-foreground">
                Arthur will analyze your website to understand your products/services and create a personalized outreach strategy.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Company Website URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="websiteUrl"
                    placeholder="https://yourcompany.com"
                    value={campaignData.websiteUrl}
                    onChange={(e) => updateCampaignData({ websiteUrl: e.target.value })}
                    disabled={isAnalyzing}
                  />
                  <Button 
                    onClick={analyzeWebsite}
                    disabled={!campaignData.websiteUrl || isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {campaignData.companySummary && (
                <div className="space-y-2">
                  <Label htmlFor="companySummary">Company Summary</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Arthur generated this summary based on your website. You can edit it to better reflect your business.
                  </p>
                  <Textarea
                    id="companySummary"
                    value={campaignData.companySummary}
                    onChange={(e) => updateCampaignData({ companySummary: e.target.value })}
                    rows={6}
                    className="min-h-[120px]"
                  />
                </div>
              )}

              {!campaignData.companySummary && campaignData.websiteUrl && !isAnalyzing && (
                <Card className="p-6 text-center border-dashed">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click "Analyze" to let Arthur understand your business
                  </p>
                </Card>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                placeholder="e.g., Q1 Enterprise Outreach"
                value={campaignData.name}
                onChange={(e) => updateCampaignData({ name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose and goals of this campaign..."
                value={campaignData.description}
                onChange={(e) => updateCampaignData({ description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objective">Campaign Objective *</Label>
              <Select value={campaignData.objective} onValueChange={(value) => updateCampaignData({ objective: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_generation">Lead Generation</SelectItem>
                  <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                  <SelectItem value="partnership">Partnership Building</SelectItem>
                  <SelectItem value="recruitment">Talent Recruitment</SelectItem>
                  <SelectItem value="market_research">Market Research</SelectItem>
                  <SelectItem value="customer_acquisition">Customer Acquisition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Target Industries</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                     <Checkbox
                       id={industry}
                       checked={campaignData.targetIndustries.includes(industry) || (industry === "Other" && campaignData.targetIndustries.includes("Other"))}
                       onCheckedChange={(checked) => {
                         if (industry === "Other") {
                           if (checked) {
                             updateCampaignData({
                               targetIndustries: [...campaignData.targetIndustries.filter(i => i !== "Other"), "Other"]
                             });
                           } else {
                             updateCampaignData({
                               targetIndustries: campaignData.targetIndustries.filter(i => i !== "Other" && !customIndustry.includes(i))
                             });
                             setCustomIndustry("");
                           }
                         } else {
                           if (checked) {
                             updateCampaignData({
                               targetIndustries: [...campaignData.targetIndustries, industry]
                             });
                           } else {
                             updateCampaignData({
                               targetIndustries: campaignData.targetIndustries.filter(i => i !== industry)
                             });
                           }
                         }
                       }}
                    />
                    <Label htmlFor={industry} className="text-sm">{industry}</Label>
                  </div>
                ))}
              </div>
              
               {campaignData.targetIndustries.includes("Other") ? (
                 <div className="space-y-2">
                   <Label htmlFor="customIndustry">Custom Industry</Label>
                   <Input
                     id="customIndustry"
                     placeholder="Enter custom industry..."
                     value={customIndustry}
                     onChange={(e) => {
                       setCustomIndustry(e.target.value);
                       if (e.target.value) {
                         updateCampaignData({
                           targetIndustries: [...campaignData.targetIndustries.filter(i => i !== "Other" && i !== customIndustry), "Other", e.target.value]
                         });
                       } else {
                         updateCampaignData({
                           targetIndustries: [...campaignData.targetIndustries.filter(i => i !== customIndustry), "Other"]
                         });
                       }
                     }}
                   />
                 </div>
               ) : null}
            </div>

            <div className="space-y-3">
              <Label>Target Roles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {roles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                     <Checkbox
                       id={role}
                       checked={campaignData.targetRoles.includes(role) || (role === "Other" && campaignData.targetRoles.includes("Other"))}
                       onCheckedChange={(checked) => {
                         if (role === "Other") {
                           if (checked) {
                             updateCampaignData({
                               targetRoles: [...campaignData.targetRoles.filter(r => r !== "Other"), "Other"]
                             });
                           } else {
                             updateCampaignData({
                               targetRoles: campaignData.targetRoles.filter(r => r !== "Other" && !customRole.includes(r))
                             });
                             setCustomRole("");
                           }
                         } else {
                           if (checked) {
                             updateCampaignData({
                               targetRoles: [...campaignData.targetRoles, role]
                             });
                           } else {
                             updateCampaignData({
                               targetRoles: campaignData.targetRoles.filter(r => r !== role)
                             });
                           }
                         }
                       }}
                    />
                    <Label htmlFor={role} className="text-sm">{role}</Label>
                  </div>
                ))}
              </div>
              
               {campaignData.targetRoles.includes("Other") ? (
                 <div className="space-y-2">
                   <Label htmlFor="customRole">Custom Role</Label>
                   <Input
                     id="customRole"
                     placeholder="Enter custom role..."
                     value={customRole}
                     onChange={(e) => {
                       setCustomRole(e.target.value);
                       if (e.target.value) {
                         updateCampaignData({
                           targetRoles: [...campaignData.targetRoles.filter(r => r !== "Other" && r !== customRole), "Other", e.target.value]
                         });
                       } else {
                         updateCampaignData({
                           targetRoles: [...campaignData.targetRoles.filter(r => r !== customRole), "Other"]
                         });
                       }
                     }}
                   />
                 </div>
               ) : null}
             </div>

            <div className="space-y-3">
              <Label>Company Size</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {companySizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={campaignData.companySize.includes(size)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateCampaignData({
                            companySize: [...campaignData.companySize, size]
                          });
                        } else {
                          updateCampaignData({
                            companySize: campaignData.companySize.filter(s => s !== size)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={size} className="text-sm">{size}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Include Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., AI, machine learning, SaaS"
                  value={campaignData.keywords}
                  onChange={(e) => updateCampaignData({ keywords: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excludeKeywords">Exclude Keywords</Label>
                <Input
                  id="excludeKeywords"
                  placeholder="e.g., competitor names"
                  value={campaignData.excludeKeywords}
                  onChange={(e) => updateCampaignData({ excludeKeywords: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {campaignData.messages.map((message, index) => (
              <Card key={message.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {message.type === 'connection' ? <Linkedin className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      {message.type === 'connection' ? 'Connection Request' : `Follow-up ${message.type.split('_')[2]}`}
                      {index > 0 && (
                        <Badge variant="secondary">
                          +{message.delay} days
                        </Badge>
                      )}
                    </CardTitle>
                    {message.type !== 'connection' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMessage(message.id)}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {message.type !== 'connection' && (
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        placeholder="Email subject..."
                        value={message.subject || ''}
                        onChange={(e) => updateMessage(message.id, { subject: e.target.value })}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Message Content</Label>
                    <Textarea
                      placeholder="Write your message here... Use {{firstName}}, {{company}}, {{industry}} for personalization"
                      value={message.content}
                      onChange={(e) => updateMessage(message.id, { content: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {message.type !== 'connection' && (
                    <div className="space-y-2">
                      <Label>Send Delay (days)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={message.delay}
                        onChange={(e) => updateMessage(message.id, { delay: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  )}

                  {/* Template Suggestions */}
                  <div className="space-y-2">
                    <Label>Quick Templates</Label>
                    <div className="flex flex-wrap gap-2">
                      {messageTemplates[message.type as keyof typeof messageTemplates]?.map((template, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(message.id, template)}
                        >
                          {template.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {campaignData.messages.length < 4 && (
              <div className="flex gap-2">
                {!campaignData.messages.find(m => m.type === 'follow_up_1') && (
                  <Button
                    variant="outline"
                    onClick={() => addMessage('follow_up_1')}
                  >
                    Add Follow-up 1
                  </Button>
                )}
                {campaignData.messages.find(m => m.type === 'follow_up_1') && 
                 !campaignData.messages.find(m => m.type === 'follow_up_2') && (
                  <Button
                    variant="outline"
                    onClick={() => addMessage('follow_up_2')}
                  >
                    Add Follow-up 2
                  </Button>
                )}
                {campaignData.messages.find(m => m.type === 'follow_up_2') && 
                 !campaignData.messages.find(m => m.type === 'follow_up_3') && (
                  <Button
                    variant="outline"
                    onClick={() => addMessage('follow_up_3')}
                  >
                    Add Follow-up 3
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaignData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.startDate ? format(campaignData.startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaignData.startDate}
                      onSelect={(date) => updateCampaignData({ startDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaignData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.endDate ? format(campaignData.endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaignData.endDate}
                      onSelect={(date) => updateCampaignData({ endDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Daily Sending Limit</Label>
                <div className="relative">
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={campaignData.dailyLimit}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Badge variant="secondary" className="text-xs">
                      Basic Plan
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upgrade your subscription to increase limits
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyLimit">Weekly Sending Limit</Label>
                <div className="relative">
                  <Input
                    id="weeklyLimit"
                    type="number"
                    value={campaignData.weeklyLimit}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Badge variant="secondary" className="text-xs">
                      Basic Plan
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upgrade your subscription to increase limits
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Working Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                  const dayKey = day.toLowerCase();
                  return (
                    <div key={day} className="flex flex-col items-center space-y-1">
                      <Checkbox
                        id={dayKey}
                        checked={campaignData.workingDays.includes(dayKey)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateCampaignData({
                              workingDays: [...campaignData.workingDays, dayKey]
                            });
                          } else {
                            updateCampaignData({
                              workingDays: campaignData.workingDays.filter(d => d !== dayKey)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={dayKey} className="text-xs">{day.slice(0, 3)}</Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Working Hours Start</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={campaignData.workingHours.start}
                  onChange={(e) => updateCampaignData({
                    workingHours: { ...campaignData.workingHours, start: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Working Hours End</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={campaignData.workingHours.end}
                  onChange={(e) => updateCampaignData({
                    workingHours: { ...campaignData.workingHours, end: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Campaign Review
                </CardTitle>
                <CardDescription>
                  Review your campaign settings before launching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Campaign Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {campaignData.name}</p>
                      <p><strong>Objective:</strong> {campaignData.objective}</p>
                      <p><strong>Start Date:</strong> {campaignData.startDate ? format(campaignData.startDate, "PPP") : 'Not set'}</p>
                      <p><strong>Daily Limit:</strong> {campaignData.dailyLimit} messages</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Target Audience</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Industries:</strong> {campaignData.targetIndustries.length || 'All'}</p>
                      <p><strong>Roles:</strong> {campaignData.targetRoles.length || 'All'}</p>
                      <p><strong>Company Sizes:</strong> {campaignData.companySize.length || 'All'}</p>
                      <p><strong>Messages:</strong> {campaignData.messages.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="aiPersonalization">AI Personalization</Label>
                      <Switch
                        id="aiPersonalization"
                        checked={campaignData.useAiPersonalization}
                        onCheckedChange={(checked) => updateCampaignData({ useAiPersonalization: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoConnect">Auto Connect</Label>
                      <Switch
                        id="autoConnect"
                        checked={campaignData.autoConnect}
                        onCheckedChange={(checked) => updateCampaignData({ autoConnect: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackOpens">Track Opens</Label>
                      <Switch
                        id="trackOpens"
                        checked={campaignData.trackOpens}
                        onCheckedChange={(checked) => updateCampaignData({ trackOpens: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackClicks">Track Clicks</Label>
                      <Switch
                        id="trackClicks"
                        checked={campaignData.trackClicks}
                        onCheckedChange={(checked) => updateCampaignData({ trackClicks: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={saveDraft} variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={launchCampaign} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Let Arthur Build Your Campaign</h1>
              <p className="text-muted-foreground">Arthur will guide you through creating a high-performing LinkedIn outreach campaign</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}% Complete</span>
              </div>
              <Progress value={progressPercent} className="w-full" />
              
              {/* Step Navigation */}
              <div className="flex items-center justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center space-y-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isActive ? "border-primary bg-primary text-primary-foreground" :
                        isCompleted ? "border-green-500 bg-green-500 text-white" :
                        "border-muted-foreground text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : createElement(Icon, { className: "w-5 h-5" })}
                      </div>
                      <span className={cn(
                        "text-xs font-medium text-center",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              {steps[currentStep - 1].name}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Arthur needs some basic info to get started. Let's set up your campaign foundation!"}
              {currentStep === 2 && "Now Arthur will help you target the perfect prospects for maximum success"}
              {currentStep === 3 && "Time to craft messages that convert! Arthur has templates to get you started"}
              {currentStep === 4 && "Arthur will optimize your sending schedule for the best response rates"}
              {currentStep === 5 && "Everything looks great! Arthur is ready to launch your campaign"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={saveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={launchCampaign}>
                <Send className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCampaign;