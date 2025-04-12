
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowUpDown, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trafficData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data?: typeof trafficData;
}

const DataTable: React.FC<DataTableProps> = ({ data = trafficData }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getAnomalyScoreBadge = (score: number) => {
    if (score >= 0.8) {
      return (
        <Badge variant="outline" className="bg-critical/20 text-critical border-critical">
          {score.toFixed(2)}
        </Badge>
      );
    } else if (score >= 0.4) {
      return (
        <Badge variant="outline" className="bg-warning/20 text-warning border-warning">
          {score.toFixed(2)}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          {score.toFixed(2)}
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Database size={18} className="text-muted-foreground" />
            <span>Network Traffic Analysis</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1 h-8">
            <ArrowUpDown size={14} />
            Sort
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Dest IP</TableHead>
                <TableHead className="text-center">Protocol</TableHead>
                <TableHead className="text-center">Port</TableHead>
                <TableHead className="text-right">Bytes</TableHead>
                <TableHead className="text-center">Anomaly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow 
                  key={row.id} 
                  className={cn(
                    row.anomalyScore >= 0.8 && "bg-critical/5",
                    "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(row.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.sourceIP}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.destIP}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={row.protocol === 'TCP' ? 'bg-secondary' : 'bg-secondary/50'}>
                      {row.protocol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {row.port}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {row.bytes.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.anomalyScore >= 0.8 && (
                      <AlertTriangle size={14} className="inline mr-1 text-critical" />
                    )}
                    {getAnomalyScoreBadge(row.anomalyScore)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
