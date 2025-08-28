import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'analyzing' | 'processed' | 'error';
  messageCount?: number;
  insights?: string[];
}

export function StyleGuideUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          status: 'uploading'
        });
      }
    }

    if (newFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload .txt or .csv files containing your message history.",
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'analyzing' } : f
        ));
        
        setTimeout(() => {
          const messageCount = Math.floor(Math.random() * 100) + 20;
          const insights = [
            "Professional tone detected",
            "Uses direct questions to engage",
            "Mentions specific benefits",
            "Short, concise sentences",
            "Personal touch in greetings"
          ].slice(0, Math.floor(Math.random() * 3) + 2);

          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'processed',
              messageCount,
              insights
            } : f
          ));

          if (index === newFiles.length - 1) {
            toast({
              title: "Files processed successfully",
              description: `Arthur has analyzed your writing style from ${newFiles.length} file(s).`,
            });
          }
        }, 2000);
      }, 1000);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'analyzing': return 'Analyzing...';
      case 'processed': return 'Processed';
      case 'error': return 'Error';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Style Guide Upload</h2>
        <p className="text-muted-foreground">
          Upload your previous messages to help Arthur learn your writing style
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Message History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.csv"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drop your message files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .txt and .csv files (max 10MB each)
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Supported formats:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>LinkedIn message exports (.csv)</li>
              <li>Text files with your messages (.txt)</li>
              <li>Email conversation exports</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <FileText className="w-8 h-8 text-muted-foreground mt-1" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <span className="text-xs text-muted-foreground">
                          {getStatusText(file.status)}
                        </span>
                      </div>
                    </div>

                    {(file.status === 'uploading' || file.status === 'analyzing') && (
                      <Progress value={file.status === 'uploading' ? 30 : 70} className="w-full h-2" />
                    )}

                    {file.status === 'processed' && file.messageCount && (
                      <div className="space-y-2">
                        <p className="text-sm text-green-600">
                          ✓ Analyzed {file.messageCount} messages
                        </p>
                        {file.insights && (
                          <div className="flex flex-wrap gap-1">
                            {file.insights.map((insight, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {insight}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}