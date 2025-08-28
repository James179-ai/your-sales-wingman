import { AppLayout } from "@/components/layout/AppLayout";

const AITraining = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Training</h1>
          <p className="text-muted-foreground">
            Train Arthur to write messages in your style and tone
          </p>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Message Training</h2>
            <p className="text-muted-foreground">
              Review and edit Arthur's suggested messages to train the AI on your preferred style.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Style Guide Upload</h2>
            <p className="text-muted-foreground">
              Upload your previous messages to help Arthur learn your writing style.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Neural Brain Visualization</h2>
            <p className="text-muted-foreground">
              Watch Arthur's AI brain learn and adapt to your preferences.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AITraining;