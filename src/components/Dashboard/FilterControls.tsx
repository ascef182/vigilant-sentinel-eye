
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart4, Filter, RefreshCw } from 'lucide-react';
import { filterOptions } from '@/lib/mock-data';

interface FilterControlsProps {
  onFilterChange?: (filterType: string, value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  const handleFilterChange = (filterType: string) => (value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border/50 flex flex-col sm:flex-row gap-3 items-center">
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        <Filter size={18} />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        <Select defaultValue={filterOptions.severity[0]} onValueChange={handleFilterChange('severity')}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.severity.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={filterOptions.timeRange[1]} onValueChange={handleFilterChange('timeRange')}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.timeRange.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={filterOptions.systemTypes[0]} onValueChange={handleFilterChange('systemType')}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="System Type" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.systemTypes.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <BarChart4 size={16} /> 
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button size="sm" variant="ghost" className="h-9">
          <RefreshCw size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
