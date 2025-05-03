
import React, { useState } from 'react';
import { Shield, Activity, AlertTriangle, BarChart3 } from 'lucide-react';

import Navbar from '@/components/Dashboard/Navbar';
import FilterControls from '@/components/Dashboard/FilterControls';
import StatsCard from '@/components/Dashboard/StatsCard';
import AnomalyChart from '@/components/Dashboard/AnomalyChart';
import AlertFeed from '@/components/Dashboard/AlertFeed';
import SystemHealth from '@/components/Dashboard/SystemHealth';
import ThreatMap from '@/components/Dashboard/ThreatMap';
import DataTable from '@/components/Dashboard/DataTable';
import LogAnalyzer from '@/components/Dashboard/LogAnalyzer';
import VirusTotalAnalyzer from '@/components/Dashboard/VirusTotalAnalyzer';

import { systemStats } from '@/lib/mock-data';
import { useSystemStatus } from '@/hooks/useApi';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: systemData, isLoading: isLoadingStats } = useSystemStatus();

  // Use os dados da API, se disponíveis; caso contrário, use os dados mockados
  const stats = systemData || systemStats;

  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">AI-Enhanced Cybersecurity Threat Detector</h1>
          
          <FilterControls />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Active Threats" 
              value={stats.activeThreats} 
              icon={<AlertTriangle size={18} className="text-critical" />}
              valueClassName="text-critical"
              isLoading={isLoadingStats}
            />
            <StatsCard 
              title="Systems Monitored" 
              value={stats.systemsMonitored} 
              icon={<Shield size={18} className="text-primary" />}
              isLoading={isLoadingStats}
            />
            <StatsCard 
              title="Alerts Today" 
              value={stats.alertsToday} 
              icon={<Activity size={18} className="text-warning" />}
              valueClassName="text-warning"
              isLoading={isLoadingStats}
            />
            <StatsCard 
              title="Critical Alerts" 
              value={stats.criticalAlerts} 
              icon={<BarChart3 size={18} className="text-critical" />}
              valueClassName="text-critical"
              isLoading={isLoadingStats}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnomalyChart />
            </div>
            <div>
              <AlertFeed />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ThreatMap />
            </div>
            <div>
              <SystemHealth />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VirusTotalAnalyzer />
            </div>
            <div>
              <LogAnalyzer />
            </div>
          </div>
          
          <div className="grid grid-cols-1">
            <DataTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
