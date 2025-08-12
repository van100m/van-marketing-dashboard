'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  RefreshCw,
  Zap,
  BarChart3,
  Clock
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage, getTimeAgo, getStatusIndicatorColor, getTrendColor, getTrendIcon } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const {
    systemHealth,
    businessMetrics,
    agents,
    recentActivity,
    alerts,
    eosData,
    isLoading,
    error,
    lastUpdated,
    fetchSystemHealth,
    fetchBusinessMetrics,
    fetchRecentActivity,
    fetchAlerts,
    fetchEOSData,
    refreshAllData,
    connectRealtime,
    disconnectRealtime,
    isRealtimeConnected,
    dismissAlert,
  } = useDashboardStore();

  useEffect(() => {
    // Initial data fetch and real-time connection setup
    const initializeDashboard = async () => {
      console.log('🚀 Initializing VAN Marketing Intelligence Dashboard...');
      
      try {
        // First, do an initial data fetch for immediate display
        await refreshAllData();
        
        // Then connect to real-time service for live updates
        await connectRealtime();
        
        console.log('✅ Dashboard initialized with real-time connection');
      } catch (error) {
        console.error('❌ Failed to initialize dashboard:', error);
      }
    };

    initializeDashboard();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up dashboard connections...');
      disconnectRealtime();
    };
  }, []); // Empty dependency array for mount/unmount only

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Dashboard Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshAllData} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                VAN Marketing Intelligence
              </h1>
              <p className="text-sm text-gray-600">
                Executive Command Center • 15-Agent Marketing System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <div 
                    className={`status-indicator ${
                      isRealtimeConnected() ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={isRealtimeConnected() ? 'Real-time connected' : 'Offline'}
                  />
                  System Health: {systemHealth ? `${systemHealth.healthyAgents}/${systemHealth.totalAgents}` : '---'}
                </div>
                <div className="text-xs text-gray-500">
                  {lastUpdated ? `Updated ${getTimeAgo(lastUpdated)}` : 'Loading...'}
                  {isRealtimeConnected() && <span className="ml-2 text-green-600">● LIVE</span>}
                </div>
              </div>
              <Button 
                onClick={refreshAllData} 
                disabled={isLoading}
                variant="outline"
                size="sm"
                title="Force refresh all data"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isRealtimeConnected() ? 'Force Refresh' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 overflow-y-auto">
        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Alerts</h2>
            </div>
            <div className="grid gap-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.type === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}>
                        {alert.type}
                      </Badge>
                      <span className="font-medium text-gray-900">{alert.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{getTimeAgo(alert.timestamp)}</p>
                  </div>
                  <Button
                    onClick={() => dismissAlert(alert.id)}
                    variant="ghost"
                    size="sm"
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics ? formatNumber(businessMetrics.leads.today) : '---'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={getTrendColor(businessMetrics?.leads.trend || 'stable')}>
                  {getTrendIcon(businessMetrics?.leads.trend || 'stable')}
                </span>
                <span className="ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics ? formatCurrency(businessMetrics.cost.perLead) : '---'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={getTrendColor(businessMetrics?.conversion.trend || 'stable', false)}>
                  {getTrendIcon(businessMetrics?.conversion.trend || 'stable')}
                </span>
                <span className="ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics ? formatPercentage(businessMetrics.conversion.rate) : '---'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={getTrendColor(businessMetrics?.conversion.trend || 'stable')}>
                  {getTrendIcon(businessMetrics?.conversion.trend || 'stable')}
                </span>
                <span className="ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics ? `${businessMetrics.revenue.roi.toFixed(1)}x` : '---'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={getTrendColor(businessMetrics?.revenue.trend || 'stable')}>
                  {getTrendIcon(businessMetrics?.revenue.trend || 'stable')}
                </span>
                <span className="ml-1">revenue multiple</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Health Matrix */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Agent Health Matrix
                </CardTitle>
                <CardDescription>
                  Real-time status of all 15 marketing agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {agents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="agent-card group cursor-pointer hover:shadow-md transition-all"
                        onClick={() => router.push(`/agents/${agent.id}`)}
                      >
                        <div className="agent-status">
                          <div className="flex items-center gap-2">
                            <div 
                              className={`status-indicator ${getStatusIndicatorColor(agent.health.status)}`}
                            />
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                          <Badge
                            variant={
                              agent.health.healthy ? 'success' :
                              agent.health.status === 'error' ? 'danger' : 'warning'
                            }
                          >
                            {agent.health.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span>{Math.round(agent.performance.responseTime)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Success Rate:</span>
                            <span>{formatPercentage(agent.performance.successRate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Optimization:</span>
                            <span>{Math.round(agent.performance.optimizationScore)}/100</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {getTimeAgo(agent.performance.lastActivity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Loading agent data...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Live Activity
                </CardTitle>
                <CardDescription>
                  Real-time agent actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div 
                          className={`status-indicator mt-1.5 ${
                            activity.priority === 'high' ? 'bg-red-500' :
                            activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{activity.title}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {getTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                          <Badge variant="outline" className="text-xs mt-2">
                            {activity.agentName}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Loading activity feed...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}