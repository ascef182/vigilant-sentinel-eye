
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis
} from 'recharts';
import { anomalyData } from '@/lib/mock-data';
import { useAnomalyData } from '@/hooks/useApi';

interface AnomalyChartProps {
  data?: typeof anomalyData;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  r?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  value?: number;
  index?: number;
  payload?: {
    score: number;
    time: string;
  };
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({ data }) => {
  const { toast } = useToast();
  const { data: apiData, isLoading, isError } = useAnomalyData();
  
  // Usar dados da API se disponíveis, senão usar dados fornecidos via props ou dados mockados
  const chartData = apiData || data || anomalyData;
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'hsl(var(--critical))';
    if (score >= 40) return 'hsl(var(--warning))';
    return 'hsl(var(--info))';
  };
  
  const handleDataPointClick = (score: number) => {
    const severity = score >= 70 ? 'Critical' : score >= 40 ? 'Warning' : 'Normal';
    toast({
      title: `Anomaly Score: ${score}`,
      description: `${severity} anomaly detected at this time point.`,
      variant: score >= 70 ? 'destructive' : score >= 40 ? 'default' : 'default',
    });
  };
  
  // Custom dot for the AreaChart that properly handles the click event
  const CustomizedDot = (props: CustomDotProps) => {
    const { cx, cy, fill, stroke, payload } = props;
    
    if (!cx || !cy || !payload) return null;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4}
        stroke="#fff"
        strokeWidth={2}
        fill={fill || "#2e86de"}
        className="glow"
        onClick={() => {
          if (payload.score) {
            handleDataPointClick(payload.score);
          }
        }}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">Network Anomaly Detection</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading anomaly data...</div>
          </div>
        ) : isError ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-critical">Error loading anomaly data</div>
          </div>
        ) : (
          <div className="h-[300px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const score = data.activePayload[0].payload.score;
                    handleDataPointClick(score);
                  }
                }}
              >
                <defs>
                  <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e86de" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2e86de" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickMargin={10}
                  minTickGap={15}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickMargin={10}
                  domain={[0, 100]}
                  label={{ value: 'Anomaly Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 12 } }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const score = payload[0].value as number;
                      return (
                        <div className="bg-popover p-2 border border-border rounded shadow-md">
                          <p className="text-sm">{`Time: ${payload[0].payload.time}`}</p>
                          <p className="text-sm font-medium" style={{ color: getScoreColor(score) }}>
                            {`Anomaly Score: ${score}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {score >= 70 ? 'Critical Threat' : score >= 40 ? 'Potential Threat' : 'Normal Activity'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2e86de" 
                  strokeWidth={2}
                  fill="url(#anomalyGradient)" 
                  dot={{ fill: "#2e86de", strokeWidth: 2, r: 4 }}
                  activeDot={<CustomizedDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="pl-6 pb-4 pt-2 flex gap-8">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-critical"></span>
            <span className="text-xs text-muted-foreground">Critical (70-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-warning"></span>
            <span className="text-xs text-muted-foreground">Warning (40-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-info"></span>
            <span className="text-xs text-muted-foreground">Normal (0-39)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyChart;
