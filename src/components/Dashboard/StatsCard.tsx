
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  className?: string;
  valueClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
  valueClassName,
}) => {
  return (
    <Card className={cn("hover-scale", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className={cn("text-2xl font-bold mt-1", valueClassName)}>{value}</h3>
            
            {change && (
              <p className={`text-xs mt-1 ${change.isPositive ? 'text-success' : 'text-critical'}`}>
                {change.isPositive ? '↑' : '↓'} {change.value}% from previous period
              </p>
            )}
          </div>
          <div className="p-2 rounded-full bg-secondary/50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
