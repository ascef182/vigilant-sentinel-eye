
import React from 'react';
import { AlertCircle, AlertTriangle, Info, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThreatAlert } from '@/types/api';
import { format } from 'date-fns';
import { useRealtimeAlerts } from '@/hooks/useRealtimeData';
import { useAnalyzeAlert } from '@/hooks/useApi';

const AlertFeed: React.FC = () => {
  const alerts = useRealtimeAlerts();
  const analyzeMutation = useAnalyzeAlert();

  const getSeverityIcon = (severity: string, size = 16) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={size} className="text-critical" />;
      case 'warning':
        return <AlertTriangle size={size} className="text-warning" />;
      case 'info':
      default:
        return <Info size={size} className="text-info" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      const diffSecs = Math.floor(diffMs / 1000);
      if (diffSecs < 60) return `${diffSecs}s ago`;
      
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (error) {
      return 'unknown';
    }
  };

  const handleAnalyzeAlert = (alert: ThreatAlert) => {
    analyzeMutation.mutate(alert);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-critical/20 text-critical border-critical">Critical</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning">Warning</Badge>;
      case 'info':
      default:
        return <Badge variant="outline" className="bg-info/20 text-info border-info">Info</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Shield size={18} className="text-muted-foreground" />
          <span>Threat Alerts</span>
          {analyzeMutation.isPending && (
            <span className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="px-4">
            {alerts.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No active threats detected
              </div>
            ) : (
              alerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <div className="py-3">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <span className="font-medium">{alert.type}</span>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs">{alert.description}</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="text-xs bg-muted px-2 py-0.5 rounded">
                          From: <span className="font-mono">{alert.source_ip}</span>
                        </div>
                        {alert.destination && (
                          <div className="text-xs bg-muted px-2 py-0.5 rounded">
                            To: <span className="font-mono">{alert.destination}</span>
                          </div>
                        )}
                        <div className="text-xs bg-muted px-2 py-0.5 rounded">
                          Time: <span className="font-mono">{formatDate(alert.timestamp)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 text-xs mt-1 w-full"
                        onClick={() => handleAnalyzeAlert(alert)}
                        disabled={analyzeMutation.isPending}
                      >
                        Analyze Threat
                      </Button>
                    </div>
                  </div>
                  {index < alerts.length - 1 && <Separator />}
                </React.Fragment>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertFeed;
