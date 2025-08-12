'use client';

import React from 'react';
import { Target, BarChart3, MessageCircle, Settings, ArrowRight, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceScore } from '@/components/agent/PerformanceScore';
import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboard';

export default function AgentsIndexPage() {
  const { agents, businessMetrics } = useDashboardStore();

  const agentLayers = [
    {
      id: 'lead-generation',
      name: 'Campaign Orchestration',
      description: 'Lead generation and conversion execution',
      icon: <Target className="h-6 w-6" />,
      color: 'text-blue-600 bg-blue-50',
      agents: agents.filter(a => a.category === 'lead-generation')
    },
    {
      id: 'content-strategy',
      name: 'Content & Strategy',
      description: 'Content creation and strategic planning',
      icon: <MessageCircle className="h-6 w-6" />,
      color: 'text-green-600 bg-green-50',
      agents: agents.filter(a => a.category === 'content-strategy')
    },
    {
      id: 'intelligence',
      name: 'Intelligence & Analysis',
      description: 'Data analytics and market intelligence',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-purple-600 bg-purple-50',
      agents: agents.filter(a => a.category === 'intelligence')
    },
    {
      id: 'technical',
      name: 'Technical Operations',
      description: 'SEO optimization and content editing',
      icon: <Settings className="h-6 w-6" />,
      color: 'text-orange-600 bg-orange-50',
      agents: agents.filter(a => a.category === 'technical')
    }
  ];

  const getEffectivenessScore = (agent: any): number => {
    if (agent.performance.effectivenessScore) {
      return Math.round(agent.performance.effectivenessScore);
    }
    const resultsScore = agent.performance.resultsScore || agent.performance.successRate;
    const alignmentScore = agent.performance.alignmentScore || 85;
    return Math.round(resultsScore * 0.6 + alignmentScore * 0.4);
  };

  const getLayerStats = (layer: any) => {
    const healthyAgents = layer.agents.filter((a: any) => a.health.healthy).length;
    const totalAgents = layer.agents.length;
    const avgEffectiveness = layer.agents.length > 0 ? 
      layer.agents.reduce((sum: number, agent: any) => sum + getEffectivenessScore(agent), 0) / totalAgents : 0;
    
    return {
      healthyAgents,
      totalAgents,
      avgEffectiveness: Math.round(avgEffectiveness),
      isHealthy: healthyAgents === totalAgents
    };
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              VAN Marketing Agent Operations
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              AI-Powered Marketing Orchestration • 15-Agent System
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {agents.filter(a => a.health.healthy).length}/{agents.length} Agents Healthy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Real-time Intelligence Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  System Effectiveness: 
                  <span className="font-semibold text-green-600 ml-1">
                    {Math.round(agents.reduce((sum, agent) => sum + getEffectivenessScore(agent), 0) / agents.length)}%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* CMO Orchestrator Spotlight */}
        <Card className="border-van-primary/20 bg-gradient-to-r from-van-primary/5 to-van-secondary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-van-primary/10 rounded-xl">
                  <Target className="h-8 w-8 text-van-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-van-primary">
                    CMO Agent - System Orchestrator
                  </CardTitle>
                  <CardDescription className="text-base">
                    15-Agent coordination and strategic intelligence across all marketing channels
                  </CardDescription>
                </div>
              </div>
              <Link href="/orchestrator">
                <Button variant="van" className="group">
                  View Command Center
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-van-primary">{agents.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Agents Managed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter(a => a.health.healthy).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Agents Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((agents.filter(a => a.health.healthy).length / agents.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(agents.reduce((sum, agent) => sum + getEffectivenessScore(agent), 0) / agents.length)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Effectiveness</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Layers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agent Operational Layers
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agentLayers.map((layer) => {
              const stats = getLayerStats(layer);
              
              return (
                <Card key={layer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${layer.color}`}>
                          {layer.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {layer.name}
                          </CardTitle>
                          <CardDescription>
                            {layer.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stats.avgEffectiveness}% avg
                        </div>
                        <div className="text-xs text-gray-500">
                          {stats.healthyAgents}/{stats.totalAgents} healthy
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {layer.agents.map((agent: any) => (
                        <div 
                          key={agent.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <Link 
                            href={`/agents/${agent.id}`}
                            className="flex items-center gap-3 flex-1 group"
                          >
                            <div className={`status-indicator ${agent.health.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white group-hover:text-van-primary">
                                {agent.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {agent.performance.contributionMetrics?.leadsGenerated && (
                                  <span>{agent.performance.contributionMetrics.leadsGenerated} leads</span>
                                )}
                              </div>
                            </div>
                          </Link>
                          <div className="flex items-center gap-2">
                            <PerformanceScore
                              agent={agent}
                              size="compact"
                            />
                            <Link href={`/agents/${agent.id}`}>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Intelligence Summary
            </CardTitle>
            <CardDescription>
              Real-time insights across all agent operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {businessMetrics ? businessMetrics.leads.today : '---'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Leads Today</div>
                <div className="text-xs text-green-600 mt-1">
                  Multi-agent coordination
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {businessMetrics ? `${businessMetrics.conversion.rate.toFixed(1)}%` : '---'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                <div className="text-xs text-blue-600 mt-1">
                  AI-optimized funnel
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {businessMetrics ? `${businessMetrics.revenue.roi.toFixed(1)}x` : '---'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ROI Multiple</div>
                <div className="text-xs text-purple-600 mt-1">
                  Cross-channel attribution
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}