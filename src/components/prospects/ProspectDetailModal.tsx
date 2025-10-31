import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Target, Users, Lightbulb, ExternalLink } from "lucide-react";

interface ProspectDetailModalProps {
  prospectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProspectDetailModal({ prospectId, open, onOpenChange }: ProspectDetailModalProps) {
  const { data: prospect, isLoading } = useQuery({
    queryKey: ['prospect', prospectId],
    queryFn: async () => {
      if (!prospectId) return null;
      
      const { data, error } = await supabase
        .from('prospects')
        .select(`
          *,
          companies (
            id,
            name,
            industry,
            company_size,
            description,
            linkedin_url
          ),
          company_analysis (
            sales_angles,
            pain_points,
            decision_makers,
            key_insights
          )
        `)
        .eq('id', prospectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!prospectId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {prospect ? `${prospect.first_name} ${prospect.last_name || ''}` : 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : prospect ? (
          <div className="space-y-6">
            {/* Prospect Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {prospect.title && (
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-medium">{prospect.title}</p>
                  </div>
                )}
                {prospect.company && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{prospect.company}</p>
                  </div>
                )}
                {prospect.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{prospect.email}</p>
                  </div>
                )}
                {prospect.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{prospect.phone}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <a 
                    href={prospect.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    LinkedIn Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {prospect.ai_summary && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">AI Summary</h3>
                  <p className="text-muted-foreground">{prospect.ai_summary}</p>
                </div>
              </>
            )}

            {/* Company Information */}
            {prospect.companies && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Company Information</h3>
                  </div>
                  <Card className="p-4 bg-surface-elevated">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium">{prospect.companies.name}</p>
                      </div>
                      {prospect.companies.industry && (
                        <div>
                          <p className="text-sm text-muted-foreground">Industry</p>
                          <p className="font-medium">{prospect.companies.industry}</p>
                        </div>
                      )}
                      {prospect.companies.company_size && (
                        <div>
                          <p className="text-sm text-muted-foreground">Company Size</p>
                          <p className="font-medium">{prospect.companies.company_size}</p>
                        </div>
                      )}
                      {prospect.companies.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="text-sm">{prospect.companies.description}</p>
                        </div>
                      )}
                      <a 
                        href={prospect.companies.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Company LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </Card>
                </div>
              </>
            )}

            {/* Company Analysis */}
            {prospect.company_analysis && Array.isArray(prospect.company_analysis) && prospect.company_analysis.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">AI Analysis</h3>
                  </div>
                  
                  {(() => {
                    const analysis = prospect.company_analysis[0] as any;
                    return (
                      <>
                        {analysis.key_insights && (
                          <Card className="p-4 bg-surface-elevated mb-4">
                            <h4 className="font-semibold mb-2">Key Insights</h4>
                            <p className="text-sm text-muted-foreground">{analysis.key_insights}</p>
                          </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {analysis.sales_angles && Array.isArray(analysis.sales_angles) && analysis.sales_angles.length > 0 && (
                            <Card className="p-4 bg-surface-elevated">
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold">Sales Angles</h4>
                              </div>
                              <div className="space-y-2">
                                {analysis.sales_angles.map((angle: string, i: number) => (
                                  <Badge key={i} variant="outline" className="mr-2 mb-2">
                                    {angle}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          )}

                          {analysis.pain_points && Array.isArray(analysis.pain_points) && analysis.pain_points.length > 0 && (
                            <Card className="p-4 bg-surface-elevated">
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold">Pain Points</h4>
                              </div>
                              <div className="space-y-2">
                                {analysis.pain_points.map((point: string, i: number) => (
                                  <Badge key={i} variant="outline" className="mr-2 mb-2">
                                    {point}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          )}

                          {analysis.decision_makers && Array.isArray(analysis.decision_makers) && analysis.decision_makers.length > 0 && (
                            <Card className="p-4 bg-surface-elevated">
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold">Decision Makers</h4>
                              </div>
                              <div className="space-y-2">
                                {analysis.decision_makers.map((dm: string, i: number) => (
                                  <Badge key={i} variant="outline" className="mr-2 mb-2">
                                    {dm}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Prospect not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
