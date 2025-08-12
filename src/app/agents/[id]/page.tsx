'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Settings,
  RefreshCw,
  MessageCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { AgentDetailTemplate, PerformanceScore } from '@/components/agent';

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  
  const {
    agents,
    refreshAgent,
    getAgentInsights,
    isLoading,
  } = useDashboardStore();

  const [insights, setInsights] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const agent = agents.find(a => a.id === agentId);

  useEffect(() => {
    if (agentId) {
      loadAgentInsights();
    }
  }, [agentId]);

  const loadAgentInsights = async () => {
    try {
      const data = await getAgentInsights(agentId);
      setInsights(data);
    } catch (error) {
      console.error('Failed to load agent insights:', error);
    }
  };

  const handleRefreshAgent = async () => {
    setIsRefreshing(true);
    try {
      await refreshAgent(agentId);
      await loadAgentInsights();
    } catch (error) {
      console.error('Failed to refresh agent:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Agent Not Found</CardTitle>
            <CardDescription>The requested agent could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agents">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Agents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate mock performance data for demonstration
  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${23 - i}:00`,
    responseTime: Math.random() * 1000 + 200,
    successRate: 85 + Math.random() * 15,
    tasksCompleted: Math.floor(Math.random() * 10) + 1,
  }));

  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    leads: Math.floor(Math.random() * 50) + 20,
    conversions: Math.floor(Math.random() * 15) + 5,
    revenue: Math.floor(Math.random() * 5000) + 1000,
  }));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lead-generation':
        return <Target className="h-5 w-5" />;
      case 'content-strategy':
        return <MessageCircle className="h-5 w-5" />;
      case 'intelligence':
        return <BarChart3 className="h-5 w-5" />;
      case 'technical':
        return <Settings className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/agents">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Agents
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(agent.health.status)}`}>
                  {getCategoryIcon(agent.category)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agent.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="outline">{agent.category}</Badge>
                    <Badge variant={agent.health.healthy ? 'success' : 'destructive'}>
                      {agent.health.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PerformanceScore agent={agent} />
              <Button 
                onClick={handleRefreshAgent} 
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(agent.performance.responseTime)}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(agent.performance.successRate)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Task success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agent.performance.tasksCompleted}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(agent.performance.optimizationScore)}/100
              </div>
              <p className="text-xs text-muted-foreground">
                Overall optimization
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Health Status</span>
                    <Badge variant={agent.health.healthy ? 'success' : 'destructive'}>
                      {agent.health.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Type</span>
                    <span className="text-sm text-gray-600">{agent.health.apiType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Activity</span>
                    <span className="text-sm text-gray-600">
                      {new Date(agent.performance.lastActivity).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Utilization</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(agent.performance.utilizationRate)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Key metrics over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="leads" 
                        stackId="1"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversions" 
                        stackId="1"
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* 24-Hour Performance Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Performance Timeline</CardTitle>
                <CardDescription>Detailed performance metrics over the last 24 hours</CardDescription>
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
                      stroke="#8884d8" 
                      name="Response Time (ms)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="#82ca9d" 
                      name="Success Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Response Time</span>
                        <span>{Math.round(agent.performance.responseTime)}ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (2000 - agent.performance.responseTime) / 2000 * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Success Rate</span>
                        <span>{Math.round(agent.performance.successRate)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${agent.performance.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Optimization Score</span>
                        <span>{Math.round(agent.performance.optimizationScore)}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${agent.performance.optimizationScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tasksCompleted" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Tasks</CardTitle>
                <CardDescription>Active and recent task execution</CardDescription>
              </CardHeader>
              <CardContent>
                {agent.currentTasks && agent.currentTasks.length > 0 ? (
                  <div className="space-y-3">
                    {agent.currentTasks?.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <div className="font-medium">{task.description.split(' ')[0] || 'Task'}</div>
                            <div className="text-sm text-gray-600">{task.description}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No active tasks at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Insights</CardTitle>
                <CardDescription>AI-generated insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {insights ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Performance Analysis</h4>
                      <p className="text-blue-800 text-sm">
                        Agent is performing well with a {Math.round(agent.performance.successRate)}% success rate.
                        Response times are within acceptable ranges.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Optimization Opportunities</h4>
                      <p className="text-green-800 text-sm">
                        Consider optimizing task batching to improve efficiency by an estimated 15%.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Recommendations</h4>
                      <p className="text-yellow-800 text-sm">
                        Monitor peak usage times and consider load balancing during high-traffic periods.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading agent insights...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}