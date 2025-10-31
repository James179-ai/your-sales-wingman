import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProspectDetailModal } from "./ProspectDetailModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  XCircle,
  Loader2
} from "lucide-react";

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
  const [newProspect, setNewProspect] = useState({ firstName: "", linkedinUrl: "", companyLinkedinUrl: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch prospects from database
  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add prospect mutation
  const addProspectMutation = useMutation({
    mutationFn: async (prospect: { firstName: string; linkedinUrl: string; companyLinkedinUrl?: string }) => {
      // First, insert the prospect
      const { data: prospectData, error: prospectError } = await supabase
        .from('prospects')
        .insert({
          first_name: prospect.firstName,
          linkedin_url: prospect.linkedinUrl,
        })
        .select()
        .single();

      if (prospectError) throw prospectError;

      // If company LinkedIn URL is provided, trigger company analysis
      if (prospect.companyLinkedinUrl && prospectData) {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-company', {
          body: {
            prospectId: prospectData.id,
            companyLinkedinUrl: prospect.companyLinkedinUrl,
          }
        });

        if (analysisError) {
          console.error('Company analysis error:', analysisError);
          toast({
            title: "Warning",
            description: "Prospect added but company analysis failed. Please try again later.",
            variant: "destructive",
          });
        }
      }

      return prospectData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast({
        title: "Success",
        description: "Prospect added successfully",
      });
      setNewProspect({ firstName: "", linkedinUrl: "", companyLinkedinUrl: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add prospect",
        variant: "destructive",
      });
    }
  });

  const handleAddProspect = () => {
    if (newProspect.firstName && newProspect.linkedinUrl) {
      addProspectMutation.mutate(newProspect);
    }
  };

  // CSV import mutation
  const importCSVMutation = useMutation({
    mutationFn: async (file: File) => {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const firstNameIndex = headers.findIndex(h => h.includes('first') && h.includes('name'));
      const linkedinIndex = headers.findIndex(h => h.includes('linkedin') && h.includes('url') && !h.includes('company'));
      const companyLinkedinIndex = headers.findIndex(h => h.includes('company') && h.includes('linkedin'));
      
      if (firstNameIndex === -1 || linkedinIndex === -1) {
        throw new Error('CSV must contain first_name and linkedin_url columns');
      }

      const prospects = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        return {
          first_name: values[firstNameIndex],
          linkedin_url: values[linkedinIndex],
          company_linkedin_url: companyLinkedinIndex !== -1 ? values[companyLinkedinIndex] : undefined,
        };
      }).filter(p => p.first_name && p.linkedin_url);

      // Insert all prospects
      const { data: insertedProspects, error: insertError } = await supabase
        .from('prospects')
        .insert(prospects.map(p => ({ first_name: p.first_name, linkedin_url: p.linkedin_url })))
        .select();

      if (insertError) throw insertError;

      // Trigger company analysis for prospects with company URLs (in background)
      insertedProspects?.forEach((prospect, index) => {
        if (prospects[index].company_linkedin_url) {
          supabase.functions.invoke('analyze-company', {
            body: {
              prospectId: prospect.id,
              companyLinkedinUrl: prospects[index].company_linkedin_url,
            }
          }).catch(err => console.error('Background analysis failed:', err));
        }
      });

      return insertedProspects;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast({
        title: "Success",
        description: `Imported ${data?.length || 0} prospects successfully`,
      });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to import CSV",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportCSV = () => {
    if (selectedFile) {
      importCSVMutation.mutate(selectedFile);
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
            {prospects?.length || 0} Total Prospects
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    placeholder="John"
                    value={newProspect.firstName}
                    onChange={(e) => setNewProspect({...newProspect, firstName: e.target.value})}
                    disabled={addProspectMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">Prospect LinkedIn URL</Label>
                  <Input 
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={newProspect.linkedinUrl}
                    onChange={(e) => setNewProspect({...newProspect, linkedinUrl: e.target.value})}
                    disabled={addProspectMutation.isPending}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyLinkedinUrl">Company LinkedIn URL (Optional)</Label>
                  <Input 
                    id="companyLinkedinUrl"
                    placeholder="https://linkedin.com/company/techcorp"
                    value={newProspect.companyLinkedinUrl}
                    onChange={(e) => setNewProspect({...newProspect, companyLinkedinUrl: e.target.value})}
                    disabled={addProspectMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide company URL to automatically analyze the company
                  </p>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleAddProspect}
                    disabled={addProspectMutation.isPending || !newProspect.firstName || !newProspect.linkedinUrl}
                  >
                    {addProspectMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Prospect'
                    )}
                  </Button>
                </div>
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
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedFile(null)}
                    disabled={importCSVMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleImportCSV}
                    disabled={importCSVMutation.isPending}
                  >
                    {importCSVMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import Prospects'
                    )}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : prospects && prospects.length > 0 ? (
            <div className="space-y-4">
              {prospects.map((prospect) => {
                const status = prospect.status || 'new';
                const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock;
                return (
                  <div key={prospect.id} className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-subtle">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary">{prospect.first_name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{prospect.first_name} {prospect.last_name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-white border-none ${statusConfig[status as keyof typeof statusConfig]?.color || 'bg-blue-500'}`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[status as keyof typeof statusConfig]?.label || 'New'}
                          </Badge>
                        </div>
                        {prospect.title && prospect.company && (
                          <p className="text-sm text-muted-foreground">
                            {prospect.title} at {prospect.company}
                          </p>
                        )}
                        {prospect.ai_summary && (
                          <p className="text-sm text-text-subtle mt-1">
                            AI Summary: {prospect.ai_summary}
                          </p>
                        )}
                        <a 
                          href={prospect.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProspectId(prospect.id)}
                      >
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
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No prospects yet. Add your first prospect above!</p>
            </div>
          )}
        </div>
      </Card>

      <ProspectDetailModal
        prospectId={selectedProspectId}
        open={!!selectedProspectId}
        onOpenChange={(open) => !open && setSelectedProspectId(null)}
      />
    </div>
  );
}