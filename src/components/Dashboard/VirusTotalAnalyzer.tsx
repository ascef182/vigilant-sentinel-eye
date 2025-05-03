
import React, { useState } from 'react';
import { useVirusTotal } from '@/hooks/useVirusTotal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, FileText, Search, Link, Code, Hash } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const VirusTotalAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('ip');
  const [ipAddress, setIpAddress] = useState('');
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState('');

  const { 
    apiKeySet, 
    setApiKey: saveApiKey,
    analyzeIp, 
    analyzeDomain, 
    analyzeUrl, 
    analyzeFileHash,
    analyzeFile
  } = useVirusTotal();

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const renderResults = (data: any, isLoading: boolean, error: any) => {
    if (isLoading) return <LoadingSpinner />;
    
    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to analyze. Please try again.'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!data) return null;

    const { result, threatScore } = data;
    
    let threatLevel = 'Safe';
    let badgeVariant = 'outline';
    
    if (threatScore > 0.7) {
      threatLevel = 'Critical';
      badgeVariant = 'destructive';
    } else if (threatScore > 0.5) {
      threatLevel = 'Warning';
      badgeVariant = 'warning';
    } else if (threatScore > 0.3) {
      threatLevel = 'Suspicious';
      badgeVariant = 'secondary';
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Threat Level:</span>
            <Badge variant={badgeVariant as any}>{threatLevel}</Badge>
          </div>
          <span className="text-sm font-medium">Score: {(threatScore * 100).toFixed(1)}%</span>
        </div>
        
        <Progress value={threatScore * 100} className="h-2" />
        
        <Separator className="my-4" />
        
        {result?.attributes?.last_analysis_stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="flex flex-col items-center p-2 bg-primary/5 rounded">
              <span className="text-xs text-muted-foreground">Malicious</span>
              <span className="text-lg font-bold text-destructive">{result.attributes.last_analysis_stats.malicious}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-primary/5 rounded">
              <span className="text-xs text-muted-foreground">Suspicious</span>
              <span className="text-lg font-bold text-warning">{result.attributes.last_analysis_stats.suspicious}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-primary/5 rounded">
              <span className="text-xs text-muted-foreground">Harmless</span>
              <span className="text-lg font-bold text-primary">{result.attributes.last_analysis_stats.harmless}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-primary/5 rounded">
              <span className="text-xs text-muted-foreground">Undetected</span>
              <span className="text-lg font-bold">{result.attributes.last_analysis_stats.undetected}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-primary/5 rounded">
              <span className="text-xs text-muted-foreground">Timeout</span>
              <span className="text-lg font-bold">{result.attributes.last_analysis_stats.timeout}</span>
            </div>
          </div>
        )}
        
        {/* Additional result details */}
        <div className="mt-4">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">View Details</summary>
            <div className="mt-2 p-4 bg-muted rounded-md overflow-auto max-h-64">
              <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>
    );
  };

  if (!apiKeySet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} />
            VirusTotal Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                Please provide your VirusTotal API key to continue. You can get a free API key by signing up at 
                <a href="https://www.virustotal.com/gui/join-us" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                  virustotal.com
                </a>
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your VirusTotal API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSetApiKey}>Set Key</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={18} />
          VirusTotal Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="ip" className="flex gap-1 items-center">
              <Database size={14} /> IP
            </TabsTrigger>
            <TabsTrigger value="domain" className="flex gap-1 items-center">
              <Link size={14} /> Domain
            </TabsTrigger>
            <TabsTrigger value="url" className="flex gap-1 items-center">
              <Search size={14} /> URL
            </TabsTrigger>
            <TabsTrigger value="hash" className="flex gap-1 items-center">
              <Hash size={14} /> Hash
            </TabsTrigger>
            <TabsTrigger value="file" className="flex gap-1 items-center">
              <FileText size={14} /> File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ip" className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter IP address (e.g. 8.8.8.8)" 
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <Button 
                onClick={() => analyzeIp.mutate(ipAddress)}
                disabled={analyzeIp.isPending || !ipAddress}
              >
                {analyzeIp.isPending ? <LoadingSpinner size="sm" /> : 'Analyze'}
              </Button>
            </div>
            {renderResults(analyzeIp.data, analyzeIp.isPending, analyzeIp.error)}
          </TabsContent>

          <TabsContent value="domain" className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter domain (e.g. example.com)" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <Button 
                onClick={() => analyzeDomain.mutate(domain)}
                disabled={analyzeDomain.isPending || !domain}
              >
                {analyzeDomain.isPending ? <LoadingSpinner size="sm" /> : 'Analyze'}
              </Button>
            </div>
            {renderResults(analyzeDomain.data, analyzeDomain.isPending, analyzeDomain.error)}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter URL (e.g. https://example.com/page)" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button 
                onClick={() => analyzeUrl.mutate(url)}
                disabled={analyzeUrl.isPending || !url}
              >
                {analyzeUrl.isPending ? <LoadingSpinner size="sm" /> : 'Analyze'}
              </Button>
            </div>
            {renderResults(analyzeUrl.data, analyzeUrl.isPending, analyzeUrl.error)}
          </TabsContent>

          <TabsContent value="hash" className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter file hash (MD5, SHA-1, SHA-256)" 
                value={fileHash}
                onChange={(e) => setFileHash(e.target.value)}
              />
              <Button 
                onClick={() => analyzeFileHash.mutate(fileHash)}
                disabled={analyzeFileHash.isPending || !fileHash}
              >
                {analyzeFileHash.isPending ? <LoadingSpinner size="sm" /> : 'Analyze'}
              </Button>
            </div>
            {renderResults(analyzeFileHash.data, analyzeFileHash.isPending, analyzeFileHash.error)}
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="flex flex-col gap-4">
              <Input 
                type="file" 
                onChange={handleFileChange}
              />
              <Button 
                onClick={() => selectedFile && analyzeFile.mutate(selectedFile)}
                disabled={analyzeFile.isPending || !selectedFile}
                className="w-full"
              >
                {analyzeFile.isPending ? <LoadingSpinner size="sm" /> : 'Upload & Analyze File'}
              </Button>
            </div>
            {renderResults(analyzeFile.data, analyzeFile.isPending, analyzeFile.error)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VirusTotalAnalyzer;
