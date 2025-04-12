
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Info, ShieldAlert } from 'lucide-react';
import { alertFeedData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface Alert {
  id: number;
  timestamp: string;
  type: string;
  source: string;
  destination: string;
  severity: string;
  description: string;
}

interface AlertFeedProps {
  data?: Alert[];
}

const AlertFeed: React.FC<AlertFeedProps> = ({ data = alertFeedData }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) { // less than a day
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hr ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-critical text-white border-critical critical-glow';
      case 'warning':
        return 'bg-warning text-white border-warning warning-glow';
      default:
        return 'bg-info text-white border-info info-glow';
    }
  };

  const openAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-destructive" />
                <span>Threat Alerts</span>
              </div>
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-secondary/40">
                {data.filter(a => a.severity === 'critical').length} Critical
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6">
              <TabsList className="w-full bg-background/50 grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="warning">Warning</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <ul className="max-h-[300px] overflow-y-auto">
                {data.map((alert) => (
                  <li
                    key={alert.id}
                    className={cn(
                      "px-6 py-3 flex items-start justify-between border-t border-border cursor-pointer hover:bg-secondary/20",
                      alert.severity === 'critical' && "bg-destructive/5"
                    )}
                    onClick={() => openAlertDetails(alert)}
                  >
                    <div className="flex gap-3">
                      <Badge className={cn("rounded-sm", getSeverityColor(alert.severity))}>
                        {alert.severity.charAt(0).toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alert.source} → {alert.destination}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border p-4 flex justify-center">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Alerts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="critical" className="m-0">
              <ul className="max-h-[300px] overflow-y-auto">
                {data
                  .filter(alert => alert.severity === 'critical')
                  .map((alert) => (
                    <li
                      key={alert.id}
                      className="px-6 py-3 flex items-start justify-between border-t border-border cursor-pointer hover:bg-secondary/20 bg-destructive/5"
                      onClick={() => openAlertDetails(alert)}
                    >
                      <div className="flex gap-3">
                        <Badge className={cn("rounded-sm", getSeverityColor(alert.severity))}>
                          {alert.severity.charAt(0).toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{alert.type}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alert.source} → {alert.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="border-t border-border p-4 flex justify-center">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Alerts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="warning" className="m-0">
              <ul className="max-h-[300px] overflow-y-auto">
                {data
                  .filter(alert => alert.severity === 'warning')
                  .map((alert) => (
                    <li
                      key={alert.id}
                      className="px-6 py-3 flex items-start justify-between border-t border-border cursor-pointer hover:bg-secondary/20"
                      onClick={() => openAlertDetails(alert)}
                    >
                      <div className="flex gap-3">
                        <Badge className={cn("rounded-sm", getSeverityColor(alert.severity))}>
                          {alert.severity.charAt(0).toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{alert.type}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alert.source} → {alert.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="border-t border-border p-4 flex justify-center">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Alerts
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={selectedAlert !== null} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        {selectedAlert && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  selectedAlert.severity === 'critical' ? "bg-critical" : "bg-warning"
                )} />
                {selectedAlert.type}
              </DialogTitle>
              <DialogDescription>
                Alert ID: {selectedAlert.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-muted-foreground text-sm">Severity:</div>
                <div className="col-span-3">
                  <Badge className={cn("rounded-sm", getSeverityColor(selectedAlert.severity))}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-muted-foreground text-sm">Source:</div>
                <div className="col-span-3 text-sm">{selectedAlert.source}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-muted-foreground text-sm">Destination:</div>
                <div className="col-span-3 text-sm">{selectedAlert.destination}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-muted-foreground text-sm">Timestamp:</div>
                <div className="col-span-3 text-sm">
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-muted-foreground text-sm">Description:</div>
                <div className="col-span-3 text-sm">{selectedAlert.description}</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="gap-1">
                <Info size={14} />
                Full Details
              </Button>
              <Button size="sm" variant="default" className="gap-1">
                <ExternalLink size={14} />
                Investigate
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default AlertFeed;
