'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, Filter, Users, Zap, MessageCircle, BarChart3, Target, Settings } from 'lucide-react';
import { AgentCoordinationNetwork as NetworkType, AgentCategory } from '@/types';
import { formatNumber } from '@/lib/utils';

interface AgentCoordinationNetworkProps {
  data: NetworkType;
  title?: string;
  description?: string;
  className?: string;
}

export function AgentCoordinationNetwork({ 
  data, 
  title = "Agent Coordination Network", 
  description = "Real-time collaboration patterns and effectiveness scores",
  className 
}: AgentCoordinationNetworkProps) {
  
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'strategy' | 'execution' | 'data' | 'feedback'>('all');

  const networkData = useMemo(() => {
    const filteredCollaborations = filterType === 'all' 
      ? data.collaborations 
      : data.collaborations.filter(c => c.type === filterType);

    // Calculate positions in a circular layout
    const centerX = 300;
    const centerY = 200;
    const radius = 150;
    const agents = data.agents.map((agent, index) => {
      const angle = (index / data.agents.length) * 2 * Math.PI;
      return {
        ...agent,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        connections: filteredCollaborations.filter(c => 
          c.from === agent.id || c.to === agent.id
        ).length
      };
    });

    const maxConnections = Math.max(...agents.map(a => a.connections));
    const maxEffectiveness = Math.max(...agents.map(a => a.effectiveness));

    return {
      agents,
      collaborations: filteredCollaborations,
      maxConnections,
      maxEffectiveness
    };
  }, [data, filterType]);

  const getCategoryIcon = (category: AgentCategory) => {
    switch (category) {
      case 'lead-generation': return <Target className="h-3 w-3" />;
      case 'content-strategy': return <MessageCircle className="h-3 w-3" />;
      case 'intelligence': return <BarChart3 className="h-3 w-3" />;
      case 'technical': return <Settings className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: AgentCategory) => {
    switch (category) {
      case 'lead-generation': return '#3B82F6';
      case 'content-strategy': return '#10B981';
      case 'intelligence': return '#8B5CF6';
      case 'technical': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getCollaborationColor = (type: string) => {
    switch (type) {
      case 'strategy': return '#8B5CF6';
      case 'execution': return '#10B981';
      case 'data': return '#3B82F6';
      case 'feedback': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const selectedAgentData = selectedAgent 
    ? networkData.agents.find(a => a.id === selectedAgent)
    : null;

  const selectedAgentCollaborations = selectedAgent
    ? networkData.collaborations.filter(c => c.from === selectedAgent || c.to === selectedAgent)
    : [];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {['all', 'strategy', 'execution', 'data', 'feedback'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type as any)}
                  className="text-xs capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600">
                {networkData.agents.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Agents</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600">
                {networkData.collaborations.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collaborations</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(networkData.agents.reduce((sum, agent) => sum + agent.effectiveness, 0) / networkData.agents.length)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Effectiveness</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(networkData.collaborations.reduce((sum, collab) => sum + collab.strength, 0) / networkData.collaborations.length)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Strength</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Visualization */}
            <div className="lg:col-span-2">
              <div className="relative h-96 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-hidden">
                <svg 
                  className="absolute inset-0 w-full h-full" 
                  viewBox="0 0 600 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Collaboration Lines */}
                  {networkData.collaborations.map((collaboration, index) => {
                    const fromAgent = networkData.agents.find(a => a.id === collaboration.from);
                    const toAgent = networkData.agents.find(a => a.id === collaboration.to);
                    
                    if (!fromAgent || !toAgent) return null;

                    const opacity = Math.max(0.3, collaboration.strength / 100);
                    const strokeWidth = Math.max(1, (collaboration.strength / 100) * 6);
                    const isHighlighted = selectedAgent && 
                      (collaboration.from === selectedAgent || collaboration.to === selectedAgent);

                    return (
                      <line
                        key={`collaboration-${index}`}
                        x1={fromAgent.x}
                        y1={fromAgent.y}
                        x2={toAgent.x}
                        y2={toAgent.y}
                        stroke={getCollaborationColor(collaboration.type)}
                        strokeWidth={isHighlighted ? strokeWidth * 1.5 : strokeWidth}
                        opacity={isHighlighted ? opacity * 1.5 : opacity}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Agent Nodes */}
                  {networkData.agents.map((agent) => {
                    const nodeSize = Math.max(20, (agent.effectiveness / networkData.maxEffectiveness) * 40);
                    const isSelected = selectedAgent === agent.id;
                    const isConnected = selectedAgent && networkData.collaborations.some(c => 
                      (c.from === selectedAgent && c.to === agent.id) || 
                      (c.to === selectedAgent && c.from === agent.id)
                    );

                    return (
                      <g key={agent.id}>
                        {/* Node background */}
                        <circle
                          cx={agent.x}
                          cy={agent.y}
                          r={nodeSize}
                          fill={getCategoryColor(agent.category)}
                          opacity={isSelected ? 1 : isConnected ? 0.8 : selectedAgent ? 0.3 : 0.7}
                          className="cursor-pointer transition-all duration-300 hover:opacity-100"
                          onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                        />
                        
                        {/* Effectiveness ring */}
                        <circle
                          cx={agent.x}
                          cy={agent.y}
                          r={nodeSize + 4}
                          fill="none"
                          stroke={getCategoryColor(agent.category)}
                          strokeWidth={2}
                          opacity={isSelected ? 1 : 0}
                          className="transition-opacity duration-300"
                        />
                        
                        {/* Agent initials */}
                        <text
                          x={agent.x}
                          y={agent.y + 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                        >
                          {agent.name.slice(0, 2).toUpperCase()}
                        </text>
                        
                        {/* Effectiveness score */}
                        <text
                          x={agent.x}
                          y={agent.y + nodeSize + 16}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 dark:fill-gray-400 pointer-events-none"
                        >
                          {agent.effectiveness}%
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories</div>
                    {Object.entries({
                      'lead-generation': 'Campaign',
                      'content-strategy': 'Content',
                      'intelligence': 'Analytics',
                      'technical': 'Technical'
                    } as const).map(([category, label]) => (
                      <div key={category} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category as AgentCategory) }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaboration Types Legend */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Collaboration</div>
                    {Object.entries({
                      strategy: 'Strategy',
                      execution: 'Execution',
                      data: 'Data',
                      feedback: 'Feedback'
                    }).map(([type, label]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-1 rounded-full"
                          style={{ backgroundColor: getCollaborationColor(type) }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Details Panel */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedAgentData ? `${selectedAgentData.name} Details` : 'Agent Network Overview'}
              </h4>
              
              {selectedAgentData ? (
                <div className="space-y-4">
                  {/* Selected Agent Info */}
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback style={{ backgroundColor: getCategoryColor(selectedAgentData.category) }}>
                          {selectedAgentData.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {selectedAgentData.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getCategoryIcon(selectedAgentData.category)}
                          <span className="capitalize">{selectedAgentData.category.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Effectiveness</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedAgentData.effectiveness}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Connections</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedAgentData.connections}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collaborations */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Collaborations ({selectedAgentCollaborations.length})
                    </div>
                    {selectedAgentCollaborations.map((collab, index) => {
                      const partnerId = collab.from === selectedAgent ? collab.to : collab.from;
                      const partner = networkData.agents.find(a => a.id === partnerId);
                      
                      return (
                        <div 
                          key={`selected-collab-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getCollaborationColor(collab.type) }}
                            />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {partner?.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {collab.type}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Top Collaborators */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Most Connected Agents
                    </div>
                    {networkData.agents
                      .sort((a, b) => b.connections - a.connections)
                      .slice(0, 5)
                      .map((agent) => (
                        <div 
                          key={agent.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback style={{ backgroundColor: getCategoryColor(agent.category) }}>
                                {agent.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {agent.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {agent.connections}
                          </Badge>
                        </div>
                      ))}
                  </div>

                  {/* Network Stats */}
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Network Health
                    </div>
                    <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                      <div>• Average {Math.round(networkData.collaborations.reduce((sum, c) => sum + c.strength, 0) / networkData.collaborations.length)} collaboration strength</div>
                      <div>• {networkData.collaborations.filter(c => c.strength >= 80).length} high-strength connections</div>
                      <div>• {networkData.agents.filter(a => a.connections >= 3).length} highly connected agents</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}