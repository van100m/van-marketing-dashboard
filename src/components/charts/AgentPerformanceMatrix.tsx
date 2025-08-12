'use client';

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types';

interface AgentPerformancePoint {
  id: string;
  name: string;
  efficiency: number; // Response time vs success rate
  impact: number; // Business value generated
  health: number; // Overall health score
  category: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  tasksCompleted: number;
  successRate: number;
}

interface AgentPerformanceMatrixProps {
  agents: Agent[];
  onAgentClick: (agentId: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

const STATUS_COLORS = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
  unknown: '#6b7280'
};

export function AgentPerformanceMatrix({ 
  agents, 
  onAgentClick, 
  selectedCategory, 
  onCategoryChange 
}: AgentPerformanceMatrixProps) {
  // Transform agents into performance points
  const performanceData: AgentPerformancePoint[] = agents.map(agent => {
    const efficiency = agent.performance.successRate * (2000 - agent.performance.responseTime) / 2000;
    const impact = agent.performance.tasksCompleted * agent.performance.successRate / 100;
    const health = agent.performance.optimizationScore;

    return {
      id: agent.id,
      name: agent.name,
      efficiency: Math.max(0, Math.min(100, efficiency)),
      impact: Math.max(0, Math.min(100, impact)),
      health,
      category: agent.category,
      status: agent.health.status as any,
      tasksCompleted: agent.performance.tasksCompleted,
      successRate: agent.performance.successRate,
    };
  });

  // Filter by category if selected
  const filteredData = selectedCategory 
    ? performanceData.filter(agent => agent.category === selectedCategory)
    : performanceData;

  // Get unique categories
  const categories = Array.from(new Set(agents.map(agent => agent.category)));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AgentPerformancePoint;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Efficiency: {data.efficiency.toFixed(1)}/100</p>
            <p>Impact: {data.impact.toFixed(1)}/100</p>
            <p>Health: {data.health.toFixed(1)}/100</p>
            <p>Tasks: {data.tasksCompleted}</p>
            <p>Success Rate: {data.successRate.toFixed(1)}%</p>
          </div>
          <Badge variant="outline" className="mt-2">
            {data.category}
          </Badge>
        </div>
      );
    }
    return null;
  };

  const getQuadrantLabel = (x: number, y: number) => {
    if (x >= 50 && y >= 50) return "High Performers";
    if (x >= 50 && y < 50) return "Efficient but Low Impact";
    if (x < 50 && y >= 50) return "High Impact but Inefficient";
    return "Needs Attention";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Agent Performance Matrix</CardTitle>
            <CardDescription>
              Efficiency vs Impact analysis for all agents
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange?.(undefined)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange?.(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Unknown</span>
            </div>
          </div>

          {/* Performance Matrix */}
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 50,
                left: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="efficiency" 
                name="Efficiency"
                domain={[0, 100]}
                label={{ value: 'Efficiency Score', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="impact" 
                name="Impact"
                domain={[0, 100]}
                label={{ value: 'Impact Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Quadrant lines */}
              <line 
                x1="50%" 
                y1="0%" 
                x2="50%" 
                y2="100%" 
                stroke="#e5e7eb" 
                strokeDasharray="5,5"
              />
              <line 
                x1="0%" 
                y1="50%" 
                x2="100%" 
                y2="50%" 
                stroke="#e5e7eb" 
                strokeDasharray="5,5"
              />

              <Scatter data={filteredData} fill="#8884d8">
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status]}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onAgentClick(entry.id)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant Labels */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="text-right">
              <div className="font-medium">Needs Attention</div>
              <div>Low efficiency, low impact</div>
            </div>
            <div>
              <div className="font-medium">High Impact but Inefficient</div>
              <div>High impact, low efficiency</div>
            </div>
            <div className="text-right">
              <div className="font-medium">Efficient but Low Impact</div>
              <div>High efficiency, low impact</div>
            </div>
            <div>
              <div className="font-medium text-green-600">High Performers</div>
              <div>High efficiency, high impact</div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter(d => d.efficiency >= 50 && d.impact >= 50).length}
              </div>
              <div className="text-sm text-gray-600">High Performers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(d => d.efficiency < 50 || d.impact < 50).length}
              </div>
              <div className="text-sm text-gray-600">Need Optimization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(filteredData.reduce((sum, d) => sum + d.efficiency, 0) / filteredData.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(filteredData.reduce((sum, d) => sum + d.impact, 0) / filteredData.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Impact</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}