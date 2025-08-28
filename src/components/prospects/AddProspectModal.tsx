import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { downloadCsvTemplate, parseCsvFile } from "@/utils/csvTemplate";
import { 
  User, 
  Upload, 
  Brain, 
  Linkedin, 
  FileText, 
  Sparkles,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";

interface AddProspectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProspectsAdded: (prospects: any[]) => void;
}

export const AddProspectModal = ({ open, onOpenChange, onProspectsAdded }: AddProspectModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  
  // Manual prospect state
  const [manualProspect, setManualProspect] = useState({
    linkedinUrl: "",
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    notes: ""
  });

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvResults, setCsvResults] = useState<any[]>([]);
  const [csvProcessing, setCsvProcessing] = useState(false);

  // AI discovery state
  const [aiCriteria, setAiCriteria] = useState({
    businessDescription: "",
    targetRole: "",
    targetCompanySize: "",
    targetIndustry: "",
    location: "",
    keywords: ""
  });
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const resetForm = () => {
    setManualProspect({
      linkedinUrl: "",
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      notes: ""
    });
    setCsvFile(null);
    setCsvResults([]);
    setAiCriteria({
      businessDescription: "",
      targetRole: "",
      targetCompanySize: "",
      targetIndustry: "",
      location: "",
      keywords: ""
    });
    setAiResults([]);
  };

  const handleManualSubmit = async () => {
    if (!manualProspect.linkedinUrl && (!manualProspect.firstName || !manualProspect.lastName)) {
      toast({
        title: "Missing Information",
        description: "Please provide either a LinkedIn URL or first/last name",
        variant: "destructive"
      });
      return;
    }

    // If LinkedIn URL is provided, simulate extraction
    if (manualProspect.linkedinUrl) {
      // Simulate LinkedIn data extraction
      setTimeout(() => {
        const extractedData = {
          ...manualProspect,
          firstName: manualProspect.firstName || "John",
          lastName: manualProspect.lastName || "Smith",
          company: manualProspect.company || "Tech Corp",
          position: manualProspect.position || "Software Engineer",
          avatar: "/placeholder.svg"
        };
        setManualProspect(extractedData);
        toast({
          title: "LinkedIn Profile Extracted",
          description: "Profile information has been extracted from LinkedIn"
        });
      }, 1500);
    } else {
      // Add the prospect directly
      const newProspect = {
        id: Date.now(),
        ...manualProspect,
        avatar: "/placeholder.svg",
        status: "new",
        addedDate: new Date().toISOString()
      };
      
      onProspectsAdded([newProspect]);
      toast({
        title: "Prospect Added",
        description: "New prospect has been added successfully"
      });
      resetForm();
      onOpenChange(false);
    }
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setCsvProcessing(true);

    try {
      const results = await parseCsvFile(file);
      setCsvResults(results);
      toast({
        title: "CSV Processed",
        description: `Processed ${results.length} prospects from CSV file`
      });
    } catch (error) {
      toast({
        title: "CSV Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive"
      });
    } finally {
      setCsvProcessing(false);
    }
  };

  const handleCsvImport = () => {
    const validProspects = csvResults.filter(p => p.status === "valid");
    onProspectsAdded(validProspects);
    toast({
      title: "Prospects Imported",
      description: `Successfully imported ${validProspects.length} prospects`
    });
    resetForm();
    onOpenChange(false);
  };

  const handleAiDiscovery = async () => {
    if (!aiCriteria.businessDescription || !aiCriteria.targetRole) {
      toast({
        title: "Missing Information",
        description: "Please provide business description and target role",
        variant: "destructive"
      });
      return;
    }

    setAiProcessing(true);
    setAiProgress(0);

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(progressInterval);
      setAiProgress(100);
      
      const mockAiResults = [
        {
          id: Date.now() + 1,
          firstName: "David",
          lastName: "Chen",
          company: "InnovateTech",
          position: "VP of Engineering",
          email: "david@innovatetech.com",
          linkedinUrl: "https://linkedin.com/in/davidchen",
          matchScore: 95,
          matchReasons: ["Perfect role match", "Company in target industry", "Located in target area"]
        },
        {
          id: Date.now() + 2,
          firstName: "Sarah",
          lastName: "Miller",
          company: "FutureSoft",
          position: "Senior Software Engineer",
          email: "sarah@futuresoft.com",
          linkedinUrl: "https://linkedin.com/in/sarahmiller",
          matchScore: 88,
          matchReasons: ["Strong technical background", "Company growth stage match"]
        },
        {
          id: Date.now() + 3,
          firstName: "Michael",
          lastName: "Brown",
          company: "ScaleUp Solutions",
          position: "Lead Developer",
          email: "michael@scaleup.com",
          linkedinUrl: "https://linkedin.com/in/michaelbrown",
          matchScore: 82,
          matchReasons: ["Relevant experience", "Active on LinkedIn"]
        }
      ];
      
      setAiResults(mockAiResults);
      setAiProcessing(false);
      toast({
        title: "AI Discovery Complete",
        description: `Found ${mockAiResults.length} high-quality prospects`
      });
    }, 3000);
  };

  const handleAiImport = (selectedProspects: any[]) => {
    onProspectsAdded(selectedProspects);
    toast({
      title: "AI Prospects Added",
      description: `Successfully added ${selectedProspects.length} AI-discovered prospects`
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Add New Prospects
          </DialogTitle>
          <DialogDescription>
            Choose from three methods to add prospects to your database
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              CSV Upload
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Discovery
            </TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  Add Prospect Manually
                </CardTitle>
                <CardDescription>
                  Enter LinkedIn URL for automatic extraction or fill in details manually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={manualProspect.linkedinUrl}
                    onChange={(e) => setManualProspect(prev => ({...prev, linkedinUrl: e.target.value}))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste LinkedIn URL to automatically extract profile information
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={manualProspect.firstName}
                      onChange={(e) => setManualProspect(prev => ({...prev, firstName: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={manualProspect.lastName}
                      onChange={(e) => setManualProspect(prev => ({...prev, lastName: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Tech Corp"
                      value={manualProspect.company}
                      onChange={(e) => setManualProspect(prev => ({...prev, company: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Software Engineer"
                      value={manualProspect.position}
                      onChange={(e) => setManualProspect(prev => ({...prev, position: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@techcorp.com"
                      value={manualProspect.email}
                      onChange={(e) => setManualProspect(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={manualProspect.phone}
                      onChange={(e) => setManualProspect(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this prospect..."
                    value={manualProspect.notes}
                    onChange={(e) => setManualProspect(prev => ({...prev, notes: e.target.value}))}
                  />
                </div>

                <Button onClick={handleManualSubmit} className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Add Prospect
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Upload a CSV file with multiple prospects. Download our template to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={downloadCsvTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Required columns: firstName, lastName, company, position
                  </span>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csvUpload"
                  />
                  <Label htmlFor="csvUpload" className="cursor-pointer">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload CSV file</p>
                    <p className="text-xs text-muted-foreground">CSV files up to 10MB</p>
                  </Label>
                </div>

                {csvProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing CSV file...</span>
                    </div>
                    <Progress value={66} className="w-full" />
                  </div>
                )}

                {csvResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Processing Results</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {csvResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {result.status === "valid" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm">
                              {result.firstName} {result.lastName} - {result.company}
                            </span>
                          </div>
                          {result.status === "error" && (
                            <Badge variant="destructive" className="text-xs">
                              {result.error}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {csvResults.filter(r => r.status === "valid").length} valid prospects found
                      </span>
                      <Button onClick={handleCsvImport}>
                        Import Valid Prospects
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Discovery Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Prospect Discovery
                </CardTitle>
                <CardDescription>
                  Let AI find high-quality prospects based on your business criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Your Business Description*</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Describe what your company does and what you're selling..."
                    value={aiCriteria.businessDescription}
                    onChange={(e) => setAiCriteria(prev => ({...prev, businessDescription: e.target.value}))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role/Position*</Label>
                    <Input
                      id="targetRole"
                      placeholder="e.g., CTO, VP Engineering, Software Engineer"
                      value={aiCriteria.targetRole}
                      onChange={(e) => setAiCriteria(prev => ({...prev, targetRole: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetIndustry">Target Industry</Label>
                    <Select value={aiCriteria.targetIndustry} onValueChange={(value) => setAiCriteria(prev => ({...prev, targetIndustry: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetCompanySize">Company Size</Label>
                    <Select value={aiCriteria.targetCompanySize} onValueChange={(value) => setAiCriteria(prev => ({...prev, targetCompanySize: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-50)</SelectItem>
                        <SelectItem value="small">Small (51-200)</SelectItem>
                        <SelectItem value="medium">Medium (201-1000)</SelectItem>
                        <SelectItem value="large">Large (1000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, Remote, United States"
                      value={aiCriteria.location}
                      onChange={(e) => setAiCriteria(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (Optional)</Label>
                  <Input
                    id="keywords"
                    placeholder="Additional keywords to help AI find better matches"
                    value={aiCriteria.keywords}
                    onChange={(e) => setAiCriteria(prev => ({...prev, keywords: e.target.value}))}
                  />
                </div>

                {aiProcessing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse text-purple-600" />
                      <span className="text-sm">AI is discovering prospects...</span>
                    </div>
                    <Progress value={aiProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      This may take a moment as we search across professional networks
                    </p>
                  </div>
                )}

                {aiResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">AI-Discovered Prospects</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {aiResults.map((prospect, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{prospect.firstName} {prospect.lastName}</h5>
                                <Badge variant="secondary">{prospect.matchScore}% match</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {prospect.position} at {prospect.company}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {prospect.matchReasons.map((reason: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Button onClick={() => handleAiImport(aiResults)} className="w-full">
                      <Brain className="w-4 h-4 mr-2" />
                      Add All AI Prospects ({aiResults.length})
                    </Button>
                  </div>
                )}

                {!aiProcessing && aiResults.length === 0 && (
                  <Button onClick={handleAiDiscovery} className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI Discovery
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};