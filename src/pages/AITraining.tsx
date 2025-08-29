import { AppLayout } from "@/components/layout/AppLayout";
import { MessageTraining } from "@/components/ai-training/MessageTraining";
import { StyleGuideUpload } from "@/components/ai-training/StyleGuideUpload";

const AITraining = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Training</h1>
          <p className="text-muted-foreground">
            Train Arthur to write messages in your style and tone
          </p>
        </div>
        
        <MessageTraining />
        
        <StyleGuideUpload />
      </div>
    </AppLayout>
  );
};

export default AITraining;