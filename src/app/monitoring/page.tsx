'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Monitor,
  Server,
  Database,
  Wifi,
  RefreshCw,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDashboardStore } from '@/store/dashboard';
import { useSystemMetrics } from '@/hooks/useChartData';
import { monitoringAPI } from '@/lib/api/monitoring';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface AlertItem {
  id: string;
  type: 'performance' | 'security' | 'availability' | 'capacity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
}

export default function MonitoringPage() {
  const { agents, systemHealth, isLoading, alerts, acknowledgeAlert, dismissAlert } = useDashboardStore();
  const { data: systemMetrics, currentStatus, loading: metricsLoading, error: metricsError, refresh } = useSystemMetrics(15000);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Transform real system metrics for display
  const displayMetrics: SystemMetric[] = currentStatus ? [
    {
      name: 'CPU Usage',
      value: currentStatus.cpu_usage,
      unit: '%',
      status: currentStatus.cpu_usage > 85 ? 'critical' : currentStatus.cpu_usage > 70 ? 'warning' : 'good',
      threshold: 85,
      trend: 'stable',
      change: Math.random() * 10 - 5 // Mock change for now
    },
    {
      name: 'Memory Usage',
      value: currentStatus.memory_usage,
      unit: '%',
      status: currentStatus.memory_usage > 80 ? 'critical' : currentStatus.memory_usage > 70 ? 'warning' : 'good',
      threshold: 80,
      trend: 'stable',
      change: Math.random() * 10 - 5
    },
    {
      name: 'Response Time',
      value: currentStatus.response_time,
      unit: 'ms',
      status: currentStatus.response_time > 500 ? 'critical' : currentStatus.response_time > 300 ? 'warning' : 'good',
      threshold: 500,
      trend: 'stable',
      change: Math.random() * 20 - 10
    },
    {
      name: 'Error Rate',
      value: currentStatus.error_rate,
      unit: '%',
      status: currentStatus.error_rate > 1 ? 'critical' : currentStatus.error_rate > 0.5 ? 'warning' : 'good',
      threshold: 1,
      trend: 'stable',
      change: Math.random() * 0.2 - 0.1
    },
    {
      name: 'Throughput',
      value: currentStatus.throughput,
      unit: 'req/min',
      status: currentStatus.throughput < 1000 ? 'warning' : 'good',
      threshold: 1000,
      trend: 'stable',
      change: Math.random() * 50 - 25
    },
    {
      name: 'Disk Usage',
      value: currentStatus.disk_usage,
      unit: '%',
      status: currentStatus.disk_usage > 75 ? 'critical' : currentStatus.disk_usage > 60 ? 'warning' : 'good',
      threshold: 75,
      trend: 'stable',
      change: Math.random() * 5 - 2.5
    }
  ] : [];

  // Performance data from real system metrics
  const performanceData = systemMetrics && systemMetrics.length > 0 ? 
    systemMetrics.slice(-24).map((metric, i) => ({
      time: new Date(metric.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpuUsage: displayMetrics.find(m => m.name === 'CPU Usage')?.value || 0,
      memoryUsage: displayMetrics.find(m => m.name === 'Memory Usage')?.value || 0,
      responseTime: displayMetrics.find(m => m.name === 'Response Time')?.value || 0,
      errorRate: displayMetrics.find(m => m.name === 'Error Rate')?.value || 0,
      throughput: displayMetrics.find(m => m.name === 'Throughput')?.value || 0,
    }))
    :
    // Fallback mock data
    Array.from({ length: 24 }, (_, i) => ({
      time: `${23 - i}:00`,
      cpuUsage: Math.random() * 30 + 40,
      memoryUsage: Math.random() * 25 + 50,
      responseTime: Math.random() * 200 + 150,
      errorRate: Math.random() * 0.5,
      throughput: Math.random() * 500 + 1200,
    }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUp className={`h-4 w-4 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />;
    } else if (trend === 'down') {
      return <TrendingDown className={`h-4 w-4 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />;
    }
    return <div className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'ms') {
      return `${Math.round(value)}ms`;
    } else if (unit === 'req/min') {
      return `${Math.round(value)} req/min`;
    }
    return `${value} ${unit}`;
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Refresh data every 30 seconds
        console.log('Auto-refreshing monitoring data...');
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Monitor className="h-6 w-6" />
                System Monitoring
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time performance monitoring and alerting
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={autoRefresh ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setAutoRefresh(!autoRefresh)}>
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({alerts.filter(a => !a.resolvedAt).length})
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Health</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        {formatValue(metric.value, metric.unit)}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend, metric.change)}
                        <span className={`text-xs ${
                          metric.change > 0 ? 'text-green-600' : 
                          metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Performance Timeline</CardTitle>
                    <CardDescription>Key metrics over the last 24 hours</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={selectedTimeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTimeRange(range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="cpuUsage" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="CPU Usage (%)"
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="memoryUsage" 
                      stackId="2"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                      name="Memory Usage (%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      name="Response Time (ms)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Infrastructure Status */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="h-5 w-5" />
                    Application Servers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server 1</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server 2</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Load Balancer</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Primary DB</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Replica DB</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connections</span>
                      <span className="text-sm text-gray-600">247/400</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wifi className="h-5 w-5" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Latency</span>
                      <span className="text-sm text-green-600">12ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bandwidth</span>
                      <span className="text-sm text-gray-600">850 Mbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Packet Loss</span>
                      <span className="text-sm text-green-600">0.01%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificates</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Scan</span>
                      <span className="text-sm text-gray-600">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            {/* Agent Health Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Health Status</CardTitle>
                <CardDescription>Real-time health monitoring for all marketing agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.health.healthy ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-sm">{agent.name}</span>
                        </div>
                        <Badge variant={agent.health.healthy ? 'success' : 'destructive'}>
                          {agent.health.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="font-medium">{Math.round(agent.performance.responseTime)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-medium">{agent.performance.successRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tasks Completed:</span>
                          <span className="font-medium">{agent.performance.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Activity:</span>
                          <span className="font-medium">
                            {new Date(agent.performance.lastActivity).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts ({alerts.filter(a => !a.resolvedAt && !a.acknowledged).length})
                </CardTitle>
                <CardDescription>Current system alerts and issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(a => !a.resolvedAt).map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${getSeverityColor(alert.type)}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className={getSeverityColor(alert.type)}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                          <span className="text-sm font-medium">{alert.agentId}</span>
                        </div>
                        <p className="text-sm mb-1">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resolved Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recently Resolved
                </CardTitle>
                <CardDescription>Alerts resolved in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.filter(a => a.resolvedAt).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{alert.agentId}</span>
                          <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Resolved at {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Resource Usage</CardTitle>
                  <CardDescription>CPU and Memory utilization over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cpuUsage" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="CPU Usage (%)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memoryUsage" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Memory Usage (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Performance</CardTitle>
                  <CardDescription>Response time and throughput metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                        name="Response Time (ms)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="throughput" 
                        stroke="#387908" 
                        strokeWidth={2}
                        name="Throughput (req/min)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
                <CardDescription>Key performance indicators and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    <div className="text-xs text-green-600 mt-1">Last 30 days</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">245ms</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                    <div className="text-xs text-blue-600 mt-1">12% faster than target</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-orange-600 mb-2">1,847</div>
                    <div className="text-sm text-gray-600">Throughput/min</div>
                    <div className="text-xs text-green-600 mt-1">+8.9% from yesterday</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">0.12%</div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                    <div className="text-xs text-green-600 mt-1">Well below 1% target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}