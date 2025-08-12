'use client';

import { useEffect } from 'react';
import { AgentNavigation } from '@/components/navigation/AgentNavigation';
import { useDashboardStore } from '@/store/dashboard';

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { 
    agents, 
    connectRealtime, 
    refreshAllData, 
    isRealtimeConnected 
  } = useDashboardStore();

  useEffect(() => {
    // Initialize agent data if not already connected
    const initializeAgents = async () => {
      if (!isRealtimeConnected()) {
        await refreshAllData();
        await connectRealtime();
      }
    };

    initializeAgents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Agent Navigation Sidebar */}
      <div className="w-80 flex-shrink-0">
        <AgentNavigation agents={agents} className="h-screen" />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1">
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}