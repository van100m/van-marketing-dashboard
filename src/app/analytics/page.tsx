'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AttributionFlow, 
  ConversionFunnel, 
  ROIWaterfall, 
  AgentCoordinationNetwork,
  PerformanceTimeline,
  ChannelAllocation,
  RealtimeMetrics,
  AgentPerformanceMatrix
} from '@/components/charts';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Activity, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard';
import { 
  usePerformanceTimeline, 
  useChannelPerformance, 
  useRealtimeMetrics, 
  useAgentPerformanceMatrix 
} from '@/hooks/useChartData';

export default function AnalyticsPage() {
  const { agents, businessMetrics } = useDashboardStore();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  // Use real-time data hooks
  const performanceTimeline = usePerformanceTimeline(timeRange, 30000); // 30s refresh
  const channelPerformance = useChannelPerformance(60000); // 1min refresh  
  const realtimeMetrics = useRealtimeMetrics(10000); // 10s refresh
  const agentPerformance = useAgentPerformanceMatrix(45000); // 45s refresh

  const handleRefreshAll = () => {
    performanceTimeline.refresh();
    channelPerformance.refresh();
    realtimeMetrics.refresh();
    agentPerformance.refresh();
  };

  // Mock data for demonstration - in real app this would come from API
  const attributionFlowData = {
    nodes: [
      { id: 'organic', name: 'Organic Search', type: 'source' as const, value: 450, agentId: 'websiteSeo' },
      { id: 'paid-social', name: 'Paid Social', type: 'source' as const, value: 320, agentId: 'paidSocial' },
      { id: 'email', name: 'Email Marketing', type: 'source' as const, value: 280, agentId: 'emailMarketing' },
      { id: 'referral', name: 'Referrals', type: 'source' as const, value: 150, agentId: 'social' },
      
      { id: 'website-visit', name: 'Website Visit', type: 'touchpoint' as const, value: 800 },
      { id: 'form-fill', name: 'Form Fill', type: 'touchpoint' as const, value: 400 },
      { id: 'consultation', name: 'Consultation', type: 'touchpoint' as const, value: 200 },
      
      { id: 'lead', name: 'Lead', type: 'conversion' as const, value: 120 },
      { id: 'customer', name: 'Customer', type: 'conversion' as const, value: 45 }
    ],
    links: [
      { source: 'organic', target: 'website-visit', value: 450, label: '450 visits' },
      { source: 'paid-social', target: 'website-visit', value: 320, label: '320 visits' },
      { source: 'email', target: 'form-fill', value: 280, label: '280 forms' },
      { source: 'website-visit', target: 'form-fill', value: 400, label: '400 forms' },
      { source: 'form-fill', target: 'consultation', value: 200, label: '200 consults' },
      { source: 'consultation', target: 'lead', value: 120, label: '120 leads' },
      { source: 'lead', target: 'customer', value: 45, label: '45 customers' }
    ]
  };

  const conversionFunnelData = {
    stages: [
      {
        id: 'traffic',
        name: 'Website Traffic',
        count: 12500,
        conversionRate: 100,
        dropoffRate: 0,
        agentContributions: [
          { agentId: 'websiteSeo', agentName: 'Website SEO', contribution: 45, effectiveness: 92 },
          { agentId: 'paidSocial', agentName: 'Paid Social', contribution: 30, effectiveness: 85 },
          { agentId: 'emailMarketing', agentName: 'Email Marketing', contribution: 25, effectiveness: 88 }
        ]
      },
      {
        id: 'engagement',
        name: 'Page Engagement',
        count: 8750,
        conversionRate: 70,
        dropoffRate: 30,
        agentContributions: [
          { agentId: 'content', agentName: 'Content Agent', contribution: 60, effectiveness: 89 },
          { agentId: 'websiteSeo', agentName: 'Website SEO', contribution: 40, effectiveness: 92 }
        ]
      },
      {
        id: 'interest',
        name: 'Lead Magnet',
        count: 3500,
        conversionRate: 28,
        dropoffRate: 60,
        agentContributions: [
          { agentId: 'emailMarketing', agentName: 'Email Marketing', contribution: 70, effectiveness: 88 },
          { agentId: 'content', agentName: 'Content Agent', contribution: 30, effectiveness: 89 }
        ]
      },
      {
        id: 'consideration',
        name: 'Consultation Booking',
        count: 875,
        conversionRate: 7,
        dropoffRate: 75,
        agentContributions: [
          { agentId: 'campaign', agentName: 'Campaign Agent', contribution: 50, effectiveness: 87 },
          { agentId: 'social', agentName: 'Social Media', contribution: 30, effectiveness: 82 },
          { agentId: 'emailMarketing', agentName: 'Email Marketing', contribution: 20, effectiveness: 88 }
        ]
      },
      {
        id: 'conversion',
        name: 'Sale Conversion',
        count: 140,
        conversionRate: 1.12,
        dropoffRate: 84,
        agentContributions: [
          { agentId: 'campaign', agentName: 'Campaign Agent', contribution: 80, effectiveness: 87 },
          { agentId: 'analytics', agentName: 'Analytics Agent', contribution: 20, effectiveness: 91 }
        ]
      }
    ],
    overallConversionRate: 1.12,
    totalLeads: 12500,
    totalConversions: 140
  };

  const roiWaterfallData = {
    categories: [
      { name: 'Paid Social Ads', agentId: 'paidSocial', investment: 8500, revenue: 15600, roi: 183, color: '#3B82F6' },
      { name: 'Email Marketing', agentId: 'emailMarketing', investment: 2800, revenue: 12400, roi: 343, color: '#10B981' },
      { name: 'Content Creation', agentId: 'content', investment: 5200, revenue: 8900, roi: 171, color: '#8B5CF6' },
      { name: 'SEO Optimization', agentId: 'websiteSeo', investment: 3600, revenue: 18200, roi: 406, color: '#F59E0B' },
      { name: 'Social Media Organic', agentId: 'social', investment: 2100, revenue: 3800, roi: 181, color: '#EF4444' },
      { name: 'Referral Program', channelId: 'referral', investment: 1200, revenue: 2100, roi: 175, color: '#6B7280' }
    ],
    totalInvestment: 23400,
    totalRevenue: 60000,
    overallROI: 256
  };

  const agentNetworkData = {
    agents: agents.slice(0, 10).map((agent, index) => ({
      id: agent.id,
      name: agent.name,
      category: agent.category,
      effectiveness: agent.performance.effectivenessScore || 
        Math.round((agent.performance.resultsScore || agent.performance.successRate) * 0.6 + 
                   (agent.performance.alignmentScore || 85) * 0.4),
      connections: Math.floor(Math.random() * 8) + 2 // Mock connections
    })),
    collaborations: [
      { from: 'campaign', to: 'emailMarketing', strength: 95, type: 'strategy' as const, recentActivity: Date.now() - 1000 * 60 * 30 },
      { from: 'campaign', to: 'paidSocial', strength: 88, type: 'execution' as const, recentActivity: Date.now() - 1000 * 60 * 15 },
      { from: 'analytics', to: 'campaign', strength: 92, type: 'data' as const, recentActivity: Date.now() - 1000 * 60 * 45 },
      { from: 'content', to: 'emailMarketing', strength: 85, type: 'execution' as const, recentActivity: Date.now() - 1000 * 60 * 60 },
      { from: 'strategy', to: 'campaign', strength: 90, type: 'strategy' as const, recentActivity: Date.now() - 1000 * 60 * 20 },
      { from: 'websiteSeo', to: 'content', strength: 78, type: 'execution' as const, recentActivity: Date.now() - 1000 * 60 * 90 },
      { from: 'social', to: 'content', strength: 82, type: 'feedback' as const, recentActivity: Date.now() - 1000 * 60 * 60 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Visual BI components inspired by HubSpot, Google Analytics, and Mixpanel
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Real-time Data
              </Badge>
              <Button variant="van">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {businessMetrics ? businessMetrics.leads.thisMonth : '3,247'}
                  </div>
                  <div className="text-sm text-gray-500">Total Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {businessMetrics ? `${businessMetrics.conversion.rate.toFixed(1)}%` : '4.3%'}
                  </div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {businessMetrics ? `${businessMetrics.revenue.roi.toFixed(1)}x` : '2.6x'}
                  </div>
                  <div className="text-sm text-gray-500">ROI Multiple</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agents.filter(a => a.health.healthy).length}/{agents.length}
                  </div>
                  <div className="text-sm text-gray-500">Agents Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Performance Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Performance Timeline</CardTitle>
              <CardDescription>Real-time campaign performance metrics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {performanceTimeline.loading && (
                <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={performanceTimeline.refresh}
                disabled={performanceTimeline.loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceTimeline 
              data={performanceTimeline.data}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            {performanceTimeline.error && (
              <p className="text-sm text-red-500 mt-2">Error: {performanceTimeline.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Agent Performance Matrix */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agent Performance Matrix</CardTitle>
              <CardDescription>Real-time agent efficiency and impact analysis</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {agentPerformance.loading && (
                <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={agentPerformance.refresh}
                disabled={agentPerformance.loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AgentPerformanceMatrix
              agents={agentPerformance.data.map(agent => ({
                ...agent,
                category: (agent.category as any) || 'technical',
                description: `${agent.category} agent`,
                capabilities: [],
                endpoint: {
                  url: `agents/${agent.id}`,
                  apiType: 'GET' as const,
                  status: 'active' as const,
                },
                performance: {
                  responseTime: Math.random() * 500 + 100,
                  successRate: agent.successRate,
                  tasksCompleted: agent.tasksCompleted,
                  tasksFailed: 0,
                  utilizationRate: agent.efficiency,
                  optimizationScore: agent.impact,
                  lastActivity: new Date().toISOString(),
                  resultsScore: agent.impact,
                  alignmentScore: agent.efficiency,
                  effectivenessScore: agent.health,
                  contributionMetrics: {
                    leadsGenerated: 0,
                    conversionRate: 0,
                    roiContribution: 0,
                    goalAchievementRate: 0,
                  },
                  learningMetrics: {
                    predictionAccuracy: 0,
                    adaptationRate: 0,
                    strategyEvolutionCount: 0,
                    improvementTrend: 'stable' as const,
                  }
                },
                health: {
                  agent: agent.id,
                  status: agent.health > 80 ? 'healthy' : 'error',
                  healthy: agent.health > 80,
                  timestamp: new Date().toISOString(),
                  apiType: 'GET' as const,
                },
                coordinationPoints: []
              }))}
              onAgentClick={(agentId) => window.location.href = `/agents/${agentId}`}
            />
            {agentPerformance.error && (
              <p className="text-sm text-red-500 mt-2">Error: {agentPerformance.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Channel Allocation Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Real-time budget allocation and channel efficiency</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {channelPerformance.loading && (
                <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={channelPerformance.refresh}
                disabled={channelPerformance.loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChannelAllocation 
              data={channelPerformance.data}
              totalBudget={channelPerformance.data.reduce((sum, channel) => sum + channel.budget, 0)}
              totalSpend={channelPerformance.data.reduce((sum, channel) => sum + channel.spend, 0)}
            />
            {channelPerformance.error && (
              <p className="text-sm text-red-500 mt-2">Error: {channelPerformance.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Real-time Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Real-time Metrics</CardTitle>
              <CardDescription>Live performance indicators updated every 10 seconds</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {realtimeMetrics.loading && (
                <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={realtimeMetrics.refresh}
                disabled={realtimeMetrics.loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAll}
                className="text-blue-600"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RealtimeMetrics metrics={realtimeMetrics.data} />
            {realtimeMetrics.error && (
              <p className="text-sm text-red-500 mt-2">Error: {realtimeMetrics.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Advanced BI Visualizations */}
        <div className="space-y-8">
          {/* Attribution Flow Analysis */}
          <AttributionFlow
            data={attributionFlowData}
            title="Multi-Touch Attribution Flow"
            description="Customer journey mapping with agent attribution analysis"
          />

          {/* Conversion Funnel with Agent Contributions */}
          <ConversionFunnel
            data={conversionFunnelData}
            title="Conversion Funnel Analysis"
            description="Stage-by-stage conversion with agent performance breakdown"
          />

          {/* ROI Waterfall Analysis */}
          <ROIWaterfall
            data={roiWaterfallData}
            title="ROI Waterfall by Channel & Agent"
            description="Investment vs revenue analysis showing profit contribution by channel"
          />

          {/* Agent Coordination Network */}
          <AgentCoordinationNetwork
            data={agentNetworkData}
            title="AI Agent Collaboration Network"
            description="Real-time visualization of agent coordination and collaboration patterns"
          />
        </div>

        {/* Insights Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Performance Insights
            </CardTitle>
            <CardDescription>
              AI-generated insights from advanced analytics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Top Performer
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      SEO Optimization delivering 4.06x ROI - highest in portfolio
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Collaboration Health
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Strong coordination network with 88% avg collaboration strength
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      Optimization Opportunity
                    </h4>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Consultation booking has 75% dropoff - optimize agent coordination
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}