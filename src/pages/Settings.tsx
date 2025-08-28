import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Linkedin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Key,
  Globe,
  Users,
  Zap,
  Save,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Integration status - mock data
  const [integrations, setIntegrations] = useState({
    unipile: {
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "active"
    },
    openai: {
      connected: true,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "active"
    },
    calendly: {
      connected: false,
      lastSync: null,
      status: "disconnected"
    }
  });

  // Settings state
  const [settings, setSettings] = useState({
    // Company Info
    companyName: "Tiim AI",
    companyWebsite: "https://tiim.ai",
    defaultCalendlyLink: "",
    
    // LinkedIn Settings
    linkedinUrl: "",
    unipileToken: "",
    
    // Message Settings
    messageStyle: "friendly",
    aiPersonality: "professional",
    includeCalendlyInFollowup: true,
    autoFollowupDelay: 5,
    
    // Time & Limits
    timeZone: "Europe/London",
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    dailyConnectionLimit: 20,
    weeklyConnectionLimit: 100,
    monthlyConnectionLimit: 400,
    
    // Advanced
    enableSmartRetry: true,
    enableResponseTracking: true,
    enableAnalytics: true,
    webhookUrl: ""
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual save logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (integration: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          connected: true,
          status: "active",
          lastSync: new Date()
        }
      }));
      
      toast({
        title: "Connection successful",
        description: `${integration} integration is working properly.`,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Unable to connect to ${integration}. Please check your credentials.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your account, integrations, and preferences
          </p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="bg-white/60 border-white/30">
            <TabsTrigger value="integrations" className="data-[state=active]:bg-white/80">
              <Zap className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="messaging" className="data-[state=active]:bg-white/80">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messaging
            </TabsTrigger>
            <TabsTrigger value="limits" className="data-[state=active]:bg-white/80">
              <Shield className="h-4 w-4 mr-2" />
              Limits & Time
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-white/80">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {/* Integration Status Overview */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Integration Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'unipile', name: 'LinkedIn (Unipile)', icon: Linkedin, description: 'LinkedIn automation and messaging' },
                  { key: 'openai', name: 'OpenAI', icon: Key, description: 'AI message generation and analysis' },
                  { key: 'calendly', name: 'Calendly', icon: Calendar, description: 'Meeting scheduling integration' }
                ].map(({ key, name, icon: Icon, description }) => {
                  const integration = integrations[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{name}</h4>
                          <p className="text-sm text-muted-foreground">{description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last sync: {formatLastSync(integration.lastSync)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={
                          integration.connected 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }>
                          {integration.connected ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Connected</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 mr-1" />Disconnected</>
                          )}
                        </Badge>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestConnection(key)}
                          disabled={isLoading}
                          className="border-white/30 hover:bg-white/60"
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* LinkedIn/Unipile Settings */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">Your LinkedIn Profile URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={settings.linkedinUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unipileToken">Unipile API Token</Label>
                    <Input
                      id="unipileToken"
                      type="password"
                      value={settings.unipileToken}
                      onChange={(e) => setSettings(prev => ({ ...prev, unipileToken: e.target.value }))}
                      placeholder="Enter your Unipile token"
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSave("LinkedIn")}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save LinkedIn Settings
                </Button>
              </CardContent>
            </Card>

            {/* Calendly Settings */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Calendly Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calendlyLink">Default Calendly Link</Label>
                  <Input
                    id="calendlyLink"
                    value={settings.defaultCalendlyLink}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultCalendlyLink: e.target.value }))}
                    placeholder="https://calendly.com/your-link"
                    className="bg-white/60 border-white/30"
                  />
                  <p className="text-sm text-muted-foreground">
                    This link will be automatically included in booking messages
                  </p>
                </div>
                
                <Button 
                  onClick={() => handleSave("Calendly")}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Calendly Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging" className="space-y-6">
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Message Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="messageStyle">Message Style</Label>
                    <Select value={settings.messageStyle} onValueChange={(value) => setSettings(prev => ({ ...prev, messageStyle: value }))}>
                      <SelectTrigger className="bg-white/60 border-white/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="friendly">Friendly & Casual</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="direct">Direct & Concise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiPersonality">AI Personality</Label>
                    <Select value={settings.aiPersonality} onValueChange={(value) => setSettings(prev => ({ ...prev, aiPersonality: value }))}>
                      <SelectTrigger className="bg-white/60 border-white/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="consultative">Consultative</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="includeCalendly">Include Calendly in Follow-ups</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically include booking link in follow-up messages
                      </p>
                    </div>
                    <Switch
                      id="includeCalendly"
                      checked={settings.includeCalendlyInFollowup}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeCalendlyInFollowup: checked }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="followupDelay">Follow-up Delay (days)</Label>
                    <Select 
                      value={settings.autoFollowupDelay.toString()} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, autoFollowupDelay: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-white/60 border-white/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="10">10 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave("Messaging")}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Message Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Limits & Time Tab */}
          <TabsContent value="limits" className="space-y-6">
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Working Hours & Time Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select value={settings.timeZone} onValueChange={(value) => setSettings(prev => ({ ...prev, timeZone: value }))}>
                      <SelectTrigger className="bg-white/60 border-white/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="America/New_York">New York (EST)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={settings.workingHoursStart}
                      onChange={(e) => setSettings(prev => ({ ...prev, workingHoursStart: e.target.value }))}
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={settings.workingHoursEnd}
                      onChange={(e) => setSettings(prev => ({ ...prev, workingHoursEnd: e.target.value }))}
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Connection Limits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyLimit">Daily Limit</Label>
                    <Input
                      id="dailyLimit"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.dailyConnectionLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, dailyConnectionLimit: parseInt(e.target.value) }))}
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weeklyLimit">Weekly Limit</Label>
                    <Input
                      id="weeklyLimit"
                      type="number"
                      min="1"
                      max="300"
                      value={settings.weeklyConnectionLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, weeklyConnectionLimit: parseInt(e.target.value) }))}
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                    <Input
                      id="monthlyLimit"
                      type="number"
                      min="1"
                      max="1000"
                      value={settings.monthlyConnectionLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, monthlyConnectionLimit: parseInt(e.target.value) }))}
                      className="bg-white/60 border-white/30"
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Recommended limits help prevent LinkedIn account restrictions. 
                    Higher limits may increase the risk of account suspension.
                  </p>
                </div>

                <Button 
                  onClick={() => handleSave("Limits")}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Limit Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      key: 'enableSmartRetry',
                      title: 'Smart Retry Logic',
                      description: 'Automatically retry failed connections with intelligent backoff'
                    },
                    {
                      key: 'enableResponseTracking',
                      title: 'Response Tracking',
                      description: 'Track and analyze prospect responses for better insights'
                    },
                    {
                      key: 'enableAnalytics',
                      title: 'Advanced Analytics',
                      description: 'Enable detailed analytics and performance tracking'
                    }
                  ].map(({ key, title, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key}>{title}</Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        id={key}
                        checked={settings[key]}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/30" />

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://your-app.com/webhook"
                    className="bg-white/60 border-white/30"
                  />
                  <p className="text-sm text-muted-foreground">
                    Receive real-time notifications about campaign events
                  </p>
                </div>

                <Button 
                  onClick={() => handleSave("Advanced")}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}