'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { AttributionFlow as AttributionFlowType } from '@/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface AttributionFlowProps {
  data: AttributionFlowType;
  title?: string;
  description?: string;
  className?: string;
}

export function AttributionFlow({ 
  data, 
  title = "Attribution Flow", 
  description = "Multi-touch attribution across channels and touchpoints",
  className 
}: AttributionFlowProps) {
  
  const { totalValue, maxValue, nodePositions } = useMemo(() => {
    const sources = data.nodes.filter(n => n.type === 'source');
    const touchpoints = data.nodes.filter(n => n.type === 'touchpoint');
    const conversions = data.nodes.filter(n => n.type === 'conversion');
    
    const totalValue = conversions.reduce((sum, node) => sum + node.value, 0);
    const maxValue = Math.max(...data.nodes.map(n => n.value));
    
    // Calculate positions for Sankey-style flow
    const nodePositions = new Map();
    
    // Position sources on the left
    sources.forEach((node, index) => {
      nodePositions.set(node.id, {
        x: 50,
        y: 100 + (index * 120),
        width: Math.max(40, (node.value / maxValue) * 80),
        height: Math.max(30, (node.value / maxValue) * 60)
      });
    });
    
    // Position touchpoints in the middle
    touchpoints.forEach((node, index) => {
      nodePositions.set(node.id, {
        x: 300,
        y: 80 + (index * 100),
        width: Math.max(40, (node.value / maxValue) * 80),
        height: Math.max(30, (node.value / maxValue) * 60)
      });
    });
    
    // Position conversions on the right
    conversions.forEach((node, index) => {
      nodePositions.set(node.id, {
        x: 550,
        y: 100 + (index * 120),
        width: Math.max(40, (node.value / maxValue) * 80),
        height: Math.max(30, (node.value / maxValue) * 60)
      });
    });
    
    return { totalValue, maxValue, nodePositions };
  }, [data]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'source': return 'bg-blue-500 border-blue-600 text-white';
      case 'touchpoint': return 'bg-green-500 border-green-600 text-white';
      case 'conversion': return 'bg-purple-500 border-purple-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getFlowPath = (link: any) => {
    const sourcePos = nodePositions.get(link.source);
    const targetPos = nodePositions.get(link.target);
    
    if (!sourcePos || !targetPos) return '';
    
    const startX = sourcePos.x + sourcePos.width;
    const startY = sourcePos.y + sourcePos.height / 2;
    const endX = targetPos.x;
    const endY = targetPos.y + targetPos.height / 2;
    
    const controlX1 = startX + (endX - startX) * 0.5;
    const controlX2 = startX + (endX - startX) * 0.5;
    
    return `M ${startX} ${startY} C ${controlX1} ${startY} ${controlX2} ${endY} ${endX} ${endY}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
            </CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Attribution Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600">
                {data.nodes.filter(n => n.type === 'source').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sources</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600">
                {data.nodes.filter(n => n.type === 'touchpoint').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Touchpoints</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(totalValue)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.links.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Paths</div>
            </div>
          </div>

          {/* Attribution Flow Visualization */}
          <div className="relative h-96 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-hidden">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 650 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Flow Lines */}
              {data.links.map((link, index) => {
                const opacity = Math.max(0.2, link.value / maxValue);
                const strokeWidth = Math.max(2, (link.value / maxValue) * 20);
                
                return (
                  <g key={`link-${index}`}>
                    <path
                      d={getFlowPath(link)}
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      fill="none"
                      opacity={opacity}
                      className="text-van-primary"
                    />
                    {/* Flow Labels */}
                    {link.label && (
                      <text
                        x={(nodePositions.get(link.source)?.x || 0) + 150}
                        y={(nodePositions.get(link.source)?.y || 0) + 20}
                        className="text-xs fill-gray-600 dark:fill-gray-400"
                        textAnchor="middle"
                      >
                        {formatNumber(link.value)}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* Nodes */}
              {data.nodes.map((node) => {
                const pos = nodePositions.get(node.id);
                if (!pos) return null;
                
                return (
                  <g key={node.id}>
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.width}
                      height={pos.height}
                      rx={8}
                      className={getNodeColor(node.type)}
                    />
                    <text
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2 - 8}
                      textAnchor="middle"
                      className="text-xs font-medium fill-current"
                    >
                      {node.name}
                    </text>
                    <text
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2 + 6}
                      textAnchor="middle"
                      className="text-xs fill-current opacity-90"
                    >
                      {formatNumber(node.value)}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Sources</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Touchpoints</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Conversions</span>
              </div>
            </div>
          </div>

          {/* Top Attribution Paths */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Top Attribution Paths</h4>
            <div className="space-y-2">
              {data.links
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((link, index) => {
                  const sourceNode = data.nodes.find(n => n.id === link.source);
                  const targetNode = data.nodes.find(n => n.id === link.target);
                  const contribution = (link.value / totalValue) * 100;
                  
                  return (
                    <div 
                      key={`path-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sourceNode?.name} → {targetNode?.name}
                        </div>
                        {sourceNode?.agentId && (
                          <Badge variant="outline" className="text-xs">
                            {sourceNode.agentId}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatNumber(link.value)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPercentage(contribution)}
                          </div>
                        </div>
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-van-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, contribution * 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}