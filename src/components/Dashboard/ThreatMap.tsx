
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ThreatMapProps {
  data?: { id: string; value: number }[];
}

const ThreatMap: React.FC<ThreatMapProps> = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  // This is a simple visual representation - a real implementation would use a proper map visualization library
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Globe size={18} className="text-muted-foreground" />
            <span>Global Threat Activity</span>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Live visualization of attack sources worldwide. Regions with higher intensity indicate more attack attempts.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-center p-0">
          <div className="w-full relative pb-[60%] bg-card overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Simple visual representation */}
              <div className="relative w-full h-full opacity-60" style={{ background: '#1A1F2C' }}>
                {/* Animated glow effects for key attack regions */}
                <div className="absolute h-5 w-5 bg-critical rounded-full opacity-80 animate-pulse" style={{ left: '75%', top: '25%' }} />
                <div className="absolute h-4 w-4 bg-critical rounded-full opacity-70 animate-pulse" style={{ left: '30%', top: '35%' }} />
                <div className="absolute h-6 w-6 bg-warning rounded-full opacity-80 animate-pulse" style={{ left: '45%', top: '55%' }} />
                <div className="absolute h-3 w-3 bg-info rounded-full opacity-60 animate-pulse" style={{ left: '60%', top: '45%' }} />
                <div className="absolute h-4 w-4 bg-warning rounded-full opacity-60 animate-pulse" style={{ left: '20%', top: '30%' }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-critical animate-pulse"></span>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-warning animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-info animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="text-xs">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatMap;
