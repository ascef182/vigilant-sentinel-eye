
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
              <div className="relative w-full h-full opacity-60" style={{ background: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTA4LjUgMjkuOGMtMi44IDAtMi44LTIuMi0yLjggMy44djIyLjljMCAuOS0uNCAxLjctMS4xIDIuMy0uNi42LTEuNSAxLTIuNCAxSDYwLjJjLS45IDAtMS42LS40LTIuMi0xYTMuNCAzLjQgMCAwIDEtMS4xLTIuM1YzMy41YzAtMi43LTIuMS0zLjctNS40LTMuNy0xLjkgMC0zLjkuNS01LjcgMS42LTIuMyAxLjQtMy40IDMuNS0zLjQgNS42djE3LjljMCAuOS0uNCAxLjctMS4xIDIuMy0uNi42LTEuNSAxLTIuNCAxSDk2LjhsMS4zLTMuN2MuNC0xLjMuMS0yLjctLjctMy42LS43LS45LTEuOS0xLjMtMy4xLTEuMS0uOC4xLTMzIDQuNi00OS4yIDEwLjItLjUuMi0xLjEuMy0xLjcuMS0uNy0uMi0xLjQtLjctMS44LTEuNGwtOS40LTE1Yy0uMy0uNS0uNi0uOS0xLjEtMS4yLTEuNi0xLTMuNS0uNi00LjYuOS0yLjcgMy41LTUuMiA3LjQtNi45IDExLjgtMi4zIDUuOS0yIDEyLjIgMSAxNy43bC4xLjFjMi44IDUuMyA3LjcgOS4xIDEzLjcgMTAuOCA2IDEuNiAxMi41Ljg0IDE4LjEtMi4zIDUuNy0zIDE1LjQtMTAgMTUuNC0xMGwxLjItMWMuNy0uNiAxLjMtMS40IDEuNS0yLjIuMi0uOSAwLTEuOC0uNS0yLjZsLTQuNC03Yy0uMy0uNS0uNS0xLjEtLjUtMS43IDAtLjYuMi0xLjEuNS0xLjZsMTQtMjMuNWMuNy0xLjEgMS40LTIuNSAyLjMtMy44IDIuNi0zLjcgNS43LTUuNiA5LjQtNS42LjggMCAxLjcuMSAyLjQuMy44LjIgMS42LjUgMi4zIDEgLjcuNSAxLjMgMS4xIDEuOCAxLjguNS43LjkgMS42IDEuMSAyLjUuMiAxIC4zIDIgLjMgMy4xVjgzYzAgMS40LS43IDIuNy0xLjggMy41LTEuMS43LTIuNSAxLTMuOC42bC0xMC4xLTMuMmMtLjktLjMtMS41LS45LTEuOS0xLjctLjQtLjgtLjUtMS43LS4yLTIuNmwuMy0uOWMuMi0uNi4zLTEuMi4zLTEuOCAwLS42LS4xLTEuMi0uMy0xLjctLjItLjYtLjUtMS4xLS45LTEuNS0uNC0uNC0uOS0uOC0xLjQtMS0uNS0uMy0xLjEtLjQtMS43LS40aC0uMWMtMi43IDAtNC45IDIuMi00LjkgNC45djg2LjJjMCAuOS0uNCAxLjgtMS4xIDIuNC0uNy42LTEuNiAxLTIuNiAxaC00Mi4xYy0uOSAwLTEuOC0uNC0yLjQtMS0uNy0uNi0xLjEtMS41LTEuMS0yLjRWNTUuOWMwLS45LS40LTEuOC0xLjEtMi40LS43LS42LTEuNi0xLTIuNi0xaC0yOGMtLjkgMC0xLjguNC0yLjQgMS0uNy42LTEuMSAxLjUtMS4xIDIuNHYxMDEuOGMwIC45LS40IDEuOC0xLjEgMi40LS43LjYtMS42IDEtMi42IDFIMjUuN2MtLjkgMC0xLjgtLjQtMi40LTEtLjctLjYtMS4xLTEuNS0xLjEtMi40Vjg0LjNjMC0uOS0uNC0xLjgtMS4xLTIuNC0uNy0uNi0xLjYtMS0yLjYtMUg1LjljLS45IDAtMS44LjQtMi40IDEtLjcuNi0xLjEgMS41LTEuMSAyLjR2NDIuMWMwIC45LS40IDEuOC0xLjEgMi40cy0xLjYgMS0yLjYgMUgxLjZsLjEtMjhjMC0uOS40LTEuNyAxLjEtMi4zLjYtLjYgMS41LTEgMi40LTFoMjMuOWMuOSAwIDEuOC0uNCwyLjQtMXMxLjEtMS41IDEuMS0yLjRWODAuMmMwLS45LjQtMS44IDEuMS0yLjQuNy0uNiAxLjYtMSAyLjYtMWgxOS43Yy45IDAgMS44LS40IDIuNC0xcy45LTEuNS45LTIuNFY1MS44YzAtNC4xIDEuNy04IDQuNi0xMC44IDIuOS0yLjggNi44LTQuNSAxMC45LTQuNWgxMy44Yy0uOCAwLTEuNS0uMy0yLjEtLjgtLjYtLjYtMS0xLjMtMS0yLjFWMjAuMmMwLS44LS4zLTEuNS0uOC0yLjEtLjUtLjYtMS4zLTEtMi4xLTFINjYuNmMtLjggMC0xLjUuMy0yLjEuOS0uNS42LS45IDEuMy0uOSAyLjF2NjUuNWMwIC44LS4zIDEuNS0uOCAyLjEtLjUuNi0xLjMgMS0yLjEgMWgtOC40Yy0uOCAwLTEuNS0uMy0yLjEtLjktLjUtLjYtLjktMS4zLS45LTIuMVY0OS42YzAtLjgtLjMtMS41LS44LTIuMS0uNS0uNi0xLjMtMS0yLjEtMUgzMi43Yy0uOCAwLTEuNS4zLTIuMS45LS41LjYtLjkgMS4zLS45IDIuMXYzMS4xYzAgLjgtLjMgMS41LS44IDIuMS0uNS42LTEuMyAxLTIuMSAxaC04LjNjLS44IDAtMS41LS4zLTIuMS0uOS0uNS0uNi0uOS0xLjMtLjktMi4xVjY1LjZjMC0uOC0uMy0xLjUtLjgtMi4xLS41LS42LTEuMy0xLTIuMS0xaC0xLjFjLS44IDAtMS41LjMtMi4xLjktLjUuNi0uOSAxLjMtLjkgMi4xdjkuM2MwIC44LS4zIDEuNS0uOCAyLjEtLjUuNi0xLjMgMS0yLjEgMUgwdjIuMmg3LjZjMS4xIDAgMi4xLS40IDIuOS0xLjIuOC0uOCAxLjItMS44IDEuMi0yLjlWNjUuNkgxM3YxNS4zYzAgMS4xLjQgMi4xIDEuMiAyLjkuOC44IDEuOCAxLjIgMi45IDEuMmgxMi44di0zLjFjMC0xLjEtLjQtMi4xLTEuMi0yLjktLjgtLjgtMS44LTEuMi0yLjktMS4yaC0xLjVjLTEuMSAwLTIuMS40LTIuOSAxLjItLjguOC0xLjIgMS44LTEuMiAyLjl2LjNoLTQuNmMtMS4xIDAtMi4xLjQtMi45IDEuMi0uOC44LTEuMiAxLjgtMS4yIDIuOXYzLjFoLTQuM2MtMS4xIDAtMi4xLjQtMi45IDEuMi0uOC44LTEuMiAxLjgtMS4yIDIuOXYxNi40YzAgMS4xLjQgMi4xIDEuMiAyLjkuOC44IDEuOCAxLjIgMi45IDEuMmgxLjJ2LS4zYzAtMS4xLS40LTIuMS0xLjItMi45LS44LS44LTEuOC0xLjItMi45LTEuMkg0Ljl2LTEzLjRoMi4ydjQ1LjVjMCAxLjEuNCAyLjEgMS4yIDIuOXMxLjggMS4yIDIuOSAxLjJoMjYuN2MxLjEgMCAyLjEtLjQgMi45LTEuMnMxLjItMS44IDEuMi0yLjl2LTI4LjNoMjguNXYyOC4zYzAgMS4xLjQgMi4xIDEuMiAyLjkuOC44IDEuOCAxLjIgMi45IDEuMmg0Mi4xYzIuMyAwIDQuMS0xLjggNC4xLTQuMVY2OS44aC4xYzYuMSAwIDExLTQuOSAxMS0xMC45Vjc5YzAgMi44IDEuNSA1LjUgNCBZczIwMCAsMTgwLDI0NCwxODRjMTE0LDU4LDE1MCw2ODQs" backgroundPosition="center center" backgroundSize: "cover" }}>
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
