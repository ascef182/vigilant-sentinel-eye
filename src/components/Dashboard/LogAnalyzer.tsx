
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, AlertCircle, CheckCircle, File } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAnalyzeLogFile } from '@/hooks/useApi';
import { ScrollArea } from '@/components/ui/scroll-area';

const LogAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const analyzeMutation = useAnalyzeLogFile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Send for analysis
    analyzeMutation.mutate(selectedFile);
    
    // Clean up after some time
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <File size={18} className="text-muted-foreground" />
          <span>Log File Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              id="log-file"
              className="hidden"
              accept=".log,.txt,.csv"
              onChange={handleFileChange}
            />
            <label htmlFor="log-file" className="cursor-pointer block">
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : 'Drop network log file here or click to browse'}
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Selected: {selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(selectedFile.size / 1024)} KB</span>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} className="h-2" />
              )}
              
              {analyzeMutation.isPending && (
                <div className="flex items-center justify-center space-x-2 py-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse"></div>
                  <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                  <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                  <span className="text-xs text-muted-foreground ml-2">Analyzing log file...</span>
                </div>
              )}
              
              {analyzeMutation.isSuccess && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      {analyzeMutation.data.threatDetected ? (
                        <AlertCircle size={16} className="text-critical" />
                      ) : (
                        <CheckCircle size={16} className="text-success" />
                      )}
                      <span className="text-sm">
                        {analyzeMutation.data.threatDetected 
                          ? 'Threat detected in log file' 
                          : 'No threats detected'}
                      </span>
                    </div>
                    <span className="text-xs bg-background px-2 py-1 rounded">
                      Score: {analyzeMutation.data.anomalyScore}
                    </span>
                  </div>
                  
                  {analyzeMutation.data.suspiciousEntries && analyzeMutation.data.suspiciousEntries.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Suspicious Entries:</h4>
                      <ScrollArea className="h-[120px] rounded-md border p-2">
                        {analyzeMutation.data.suspiciousEntries.map((entry, index) => (
                          <div 
                            key={index} 
                            className="text-xs font-mono p-1 border-l-2 border-critical mb-1"
                          >
                            {entry}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || analyzeMutation.isPending}
                className="w-full"
              >
                Analyze Log File
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogAnalyzer;
