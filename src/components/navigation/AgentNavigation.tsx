'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronRight, 
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  Zap,
  Users,
  MessageCircle,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Agent, AgentCategory } from '@/types';
import { PerformanceScore } from '@/components/agent/PerformanceScore';
import { cn } from '@/lib/utils';

interface AgentNavigationProps {
  agents: Agent[];
  className?: string;
}

interface AgentLayer {
  id: AgentCategory;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  agents: Agent[];
}

export function AgentNavigation({ agents, className }: AgentNavigationProps) {
  const pathname = usePathname();
  const [expandedLayers, setExpandedLayers] = useState<Set<AgentCategory>>(
    new Set(['lead-generation' as AgentCategory]) // Expand lead generation by default
  );

  // Organize agents by operational layers
  const agentLayers: AgentLayer[] = [
    {
      id: 'lead-generation',
      name: 'Campaign Orchestration',
      description: 'Lead generation and conversion execution',
      icon: <Target className="h-4 w-4" />,
      color: 'text-blue-600',
      agents: agents.filter(a => a.category === 'lead-generation')
    },
    {
      id: 'content-strategy',
      name: 'Content & Strategy',
      description: 'Content creation and strategic planning',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-green-600',
      agents: agents.filter(a => a.category === 'content-strategy')
    },
    {
      id: 'intelligence',
      name: 'Intelligence & Analysis',
      description: 'Data analytics and market intelligence',
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'text-purple-600',
      agents: agents.filter(a => a.category === 'intelligence')
    },
    {
      id: 'technical',
      name: 'Technical Operations',
      description: 'SEO optimization and content editing',
      icon: <Settings className="h-4 w-4" />,
      color: 'text-orange-600',
      agents: agents.filter(a => a.category === 'technical')
    }
  ];

  const toggleLayer = (layerId: AgentCategory) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const getEffectivenessScore = (agent: Agent): number => {
    if (agent.performance.effectivenessScore) {
      return Math.round(agent.performance.effectivenessScore);
    }
    // Fallback calculation for backward compatibility
    const resultsScore = agent.performance.resultsScore || agent.performance.successRate;
    const alignmentScore = agent.performance.alignmentScore || 85; // Default alignment
    return Math.round(resultsScore * 0.6 + alignmentScore * 0.4);
  };

  const getStatusColor = (agent: Agent) => {
    const score = getEffectivenessScore(agent);
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLayerStats = (layer: AgentLayer) => {
    const healthyAgents = layer.agents.filter(a => a.health.healthy).length;
    const totalAgents = layer.agents.length;
    const avgEffectiveness = layer.agents.reduce((sum, agent) => 
      sum + getEffectivenessScore(agent), 0) / totalAgents;
    
    return {
      healthyAgents,
      totalAgents,
      avgEffectiveness: Math.round(avgEffectiveness),
      isHealthy: healthyAgents === totalAgents
    };
  };

  return (
    <nav className={cn('w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col', className)}>
      {/* Navigation Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-van-primary/10 rounded-lg">
            <Layers className="h-6 w-6 text-van-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agent Operations
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              15-Agent Marketing System
            </p>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">System Overview</h3>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {agents.filter(a => a.health.healthy).length}/{agents.length}
            </div>
            <div className="text-xs text-gray-500">Healthy Agents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {Math.round(agents.reduce((sum, agent) => sum + getEffectivenessScore(agent), 0) / agents.length)}%
            </div>
            <div className="text-xs text-gray-500">Avg Effectiveness</div>
          </div>
        </div>
      </div>

      {/* Agent Layers Navigation */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {agentLayers.map((layer) => {
          const isExpanded = expandedLayers.has(layer.id);
          const stats = getLayerStats(layer);
          
          return (
            <div key={layer.id} className="space-y-1">
              {/* Layer Header */}
              <button
                onClick={() => toggleLayer(layer.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-1.5 rounded-md bg-gray-100 dark:bg-gray-600', layer.color)}>
                    {layer.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {layer.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {stats.healthyAgents}/{stats.totalAgents} healthy • {stats.avgEffectiveness}% avg
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`status-indicator ${stats.isHealthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Agent List */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {layer.agents.map((agent) => {
                    const isActive = pathname === `/agents/${agent.id}`;
                    const effectivenessScore = getEffectivenessScore(agent);
                    
                    return (
                      <div
                        key={agent.id}
                        className={cn(
                          'p-3 rounded-lg border transition-all hover:shadow-sm',
                          isActive 
                            ? 'border-van-primary bg-van-primary/10 text-van-primary' 
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <Link href={`/agents/${agent.id}`} className="flex items-center gap-3 flex-1">
                            <div className={`status-indicator ${getStatusColor(agent)}`} />
                            <div>
                              <div className={cn(
                                'text-sm font-medium',
                                isActive ? 'text-van-primary' : 'text-gray-900 dark:text-white'
                              )}>
                                {agent.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                {agent.performance.contributionMetrics?.leadsGenerated && (
                                  <span>{agent.performance.contributionMetrics.leadsGenerated} leads</span>
                                )}
                                {agent.health.healthy ? (
                                  <Zap className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </div>
                          </Link>
                          <div className="flex items-center gap-1">
                            <PerformanceScore
                              agent={agent}
                              size="compact"
                              className="mr-1"
                            />
                            <Link href={`/agents/${agent.id}`}>
                              <ChevronRight className="h-3 w-3 text-gray-400" />
                            </Link>
                          </div>
                        </div>
                        
                        {/* Special indicators for key agents */}
                        {agent.id === 'campaign' && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2 text-xs">
                              <Target className="h-3 w-3 text-van-primary" />
                              <span className="text-van-primary font-medium">Lead Generation Focus</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <Link 
            href="/campaigns" 
            className="flex items-center gap-2 p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Target className="h-4 w-4" />
            <span>Campaigns</span>
          </Link>
          <Link 
            href="/analytics" 
            className="flex items-center gap-2 p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

