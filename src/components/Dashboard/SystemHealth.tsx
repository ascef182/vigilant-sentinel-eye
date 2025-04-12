
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';
import { systemHealthData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SystemHealthProps {
  data?: typeof systemHealthData;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ data = systemHealthData }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'status-pulse success';
      case 'degraded':
        return 'status-pulse warning';
      case 'outage':
        return 'status-pulse critical';
      default:
        return '';
    }
  };

  const getLoadClass = (load: number) => {
    if (load >= 90) return 'bg-critical';
    if (load >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity size={18} className="text-muted-foreground" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {data.map((system, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={cn("text-sm", getStatusClass(system.status))}>
                    {system.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {system.load}% load
                </div>
              </div>
              <Progress value={system.load} className={cn("h-2", getLoadClass(system.load))} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
