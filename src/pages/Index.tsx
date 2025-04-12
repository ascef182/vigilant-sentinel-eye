
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

import { systemStats } from '@/lib/mock-data';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              value={systemStats.activeThreats} 
              icon={<AlertTriangle size={18} className="text-critical" />}
              valueClassName="text-critical"
            />
            <StatsCard 
              title="Systems Monitored" 
              value={systemStats.systemsMonitored} 
              icon={<Shield size={18} className="text-primary" />}
            />
            <StatsCard 
              title="Alerts Today" 
              value={systemStats.alertsToday} 
              icon={<Activity size={18} className="text-warning" />}
              valueClassName="text-warning"
            />
            <StatsCard 
              title="Critical Alerts" 
              value={systemStats.criticalAlerts} 
              icon={<BarChart3 size={18} className="text-critical" />}
              valueClassName="text-critical"
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
          
          <div>
            <DataTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
