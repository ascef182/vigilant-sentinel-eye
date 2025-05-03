
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useOtx } from '@/hooks/useOtx';
import { OtxThreatMapRegion } from '@/types/otx';

const ThreatMap: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const { useGlobalThreatMap } = useOtx();
  const { data: threatMap, isLoading } = useGlobalThreatMap();
  
  // Calculate max count for normalization
  const maxCount = threatMap?.regions?.length
    ? Math.max(...threatMap.regions.map((r: OtxThreatMapRegion) => r.count))
    : 1;
  
  // Get intensity based on count
  const getIntensityClass = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'bg-critical';
    if (ratio > 0.4) return 'bg-warning';
    return 'bg-info';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Globe size={18} className="text-muted-foreground" />
            <span>Atividade Global de Ameaças</span>
            {isLoading && <Loader2 size={14} className="animate-spin ml-2" />}
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
                  Visualização em tempo real de fontes de ataque em todo o mundo com dados da LevelBlue OTX.
                  Regiões com maior intensidade indicam mais atividades maliciosas.
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
              {/* Visual representation */}
              <div className="relative w-full h-full opacity-60" style={{ background: '#1A1F2C' }}>
                {/* Dynamic glow effects based on OTX threat data */}
                {!isLoading && threatMap?.regions?.map((region: OtxThreatMapRegion) => {
                  // This is a simplified positioning - in a real implementation 
                  // we would use a proper map library with geographic coordinates
                  const positions: {[key: string]: {left: string, top: string}} = {
                    'US': { left: '20%', top: '35%' },
                    'RU': { left: '60%', top: '25%' },
                    'CN': { left: '75%', top: '35%' },
                    'BR': { left: '30%', top: '60%' },
                    'IN': { left: '65%', top: '45%' },
                    'UK': { left: '45%', top: '25%' },
                    'DE': { left: '48%', top: '28%' },
                    'IR': { left: '58%', top: '40%' },
                    'KP': { left: '80%', top: '35%' },
                  };
                  
                  const position = positions[region.id] || { left: '50%', top: '50%' };
                  const size = Math.min(3 + (region.count / maxCount) * 4, 7);
                  
                  return (
                    <div 
                      key={region.id}
                      className={`absolute rounded-full opacity-80 animate-pulse`}
                      style={{ 
                        left: position.left, 
                        top: position.top,
                        height: `${size}px`,
                        width: `${size}px`,
                        background: region.count > (maxCount * 0.7) ? '#EF4444' : 
                                  region.count > (maxCount * 0.4) ? '#EAB308' : '#0EA5E9'
                      }}
                      onMouseEnter={() => setActiveRegion(region.id)}
                      onMouseLeave={() => setActiveRegion(null)}
                    />
                  );
                })}
                
                {/* Show region name on hover */}
                {activeRegion && threatMap?.regions && (
                  <div 
                    className="absolute bg-background/80 text-xs px-2 py-1 rounded shadow-md"
                    style={{ 
                      left: '50%', 
                      top: '75%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {threatMap.regions.find(r => r.id === activeRegion)?.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-critical animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-warning animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Média</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-info animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Baixa</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="text-xs">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatMap;
