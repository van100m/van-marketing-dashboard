'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { Download, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ConversionFunnel as ConversionFunnelType } from '@/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface ConversionFunnelProps {
  data: ConversionFunnelType;
  title?: string;
  description?: string;
  className?: string;
}

export function ConversionFunnel({ 
  data, 
  title = "Conversion Funnel", 
  description = "Lead journey and conversion rates by stage",
  className 
}: ConversionFunnelProps) {
  
  const funnelMetrics = useMemo(() => {
    const stages = data.stages;
    const totalLeads = stages[0]?.count || 0;
    const totalConversions = stages[stages.length - 1]?.count || 0;
    const overallConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    
    const biggestDropoff = stages.reduce((max, stage, index) => {
      if (index === 0) return max;
      return stage.dropoffRate > max.dropoffRate ? stage : max;
    }, stages[1] || stages[0]);
    
    return {
      totalLeads,
      totalConversions,
      overallConversionRate,
      biggestDropoff
    };
  }, [data]);

  const getStageWidth = (count: number, maxCount: number) => {
    const minWidth = 20;
    const maxWidth = 100;
    const percentage = count / maxCount;
    return minWidth + (percentage * (maxWidth - minWidth));
  };

  const maxCount = Math.max(...data.stages.map(s => s.count));

  const getConversionColor = (rate: number) => {
    if (rate >= 15) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 8) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rate >= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDropoffSeverity = (rate: number) => {
    if (rate >= 50) return 'high';
    if (rate >= 30) return 'medium';
    return 'low';
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
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Funnel Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(funnelMetrics.totalLeads)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(funnelMetrics.totalConversions)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversions</div>
            </div>
            <div className={`text-center p-4 rounded-lg border ${getConversionColor(funnelMetrics.overallConversionRate)}`}>
              <div className="text-2xl font-bold">
                {formatPercentage(funnelMetrics.overallConversionRate)}
              </div>
              <div className="text-sm">Overall Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
              <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                <TrendingDown className="h-5 w-5" />
                {formatPercentage(funnelMetrics.biggestDropoff.dropoffRate)}
              </div>
              <div className="text-sm text-red-600">Biggest Dropoff</div>
            </div>
          </div>

          {/* Visual Funnel */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Conversion Stages</h4>
            <div className="space-y-3">
              {data.stages.map((stage, index) => {
                const stageWidth = getStageWidth(stage.count, maxCount);
                const dropoffSeverity = getDropoffSeverity(stage.dropoffRate);
                const isLastStage = index === data.stages.length - 1;
                
                return (
                  <div key={stage.id} className="space-y-3">
                    {/* Stage Bar */}
                    <div className="relative">
                      <div className="flex items-center gap-4">
                        {/* Stage Indicator */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-van-primary text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        
                        {/* Stage Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {stage.name}
                              </h5>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{formatNumber(stage.count)} leads</span>
                                {stage.conversionRate && (
                                  <Badge variant={stage.conversionRate >= 15 ? 'success' : stage.conversionRate >= 8 ? 'warning' : 'danger'}>
                                    {formatPercentage(stage.conversionRate)} conversion
                                  </Badge>
                                )}
                                {!isLastStage && stage.dropoffRate > 0 && (
                                  <Badge 
                                    variant={dropoffSeverity === 'high' ? 'danger' : dropoffSeverity === 'medium' ? 'warning' : 'secondary'}
                                    className="flex items-center gap-1"
                                  >
                                    <TrendingDown className="h-3 w-3" />
                                    {formatPercentage(stage.dropoffRate)} dropoff
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatNumber(stage.count)}
                              </div>
                              {index > 0 && (
                                <div className="text-sm text-gray-500">
                                  {formatPercentage((stage.count / data.stages[0].count) * 100)} of total
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Visual Bar */}
                          <div className="relative h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-van-primary to-van-secondary rounded-lg transition-all duration-500 ease-out"
                              style={{ width: `${stageWidth}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatNumber(stage.count)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Contributions */}
                    {stage.agentContributions && stage.agentContributions.length > 0 && (
                      <div className="ml-12 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Agent Contributions
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stage.agentContributions
                            .sort((a, b) => b.contribution - a.contribution)
                            .slice(0, 6)
                            .map((agent, agentIndex) => (
                            <div 
                              key={`${stage.id}-${agent.agentId}-${agentIndex}`}
                              className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {agent.agentName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                  {agent.agentName}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-500">
                                    {formatPercentage(agent.contribution)}
                                  </div>
                                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                                    <div
                                      className="bg-van-primary h-1 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min(100, agent.contribution)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {agent.effectiveness >= 90 ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : agent.effectiveness >= 70 ? (
                                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optimization Insights */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Optimization Insights
            </h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>{funnelMetrics.biggestDropoff.name}</strong> has the highest dropoff rate at{' '}
                  <strong>{formatPercentage(funnelMetrics.biggestDropoff.dropoffRate)}</strong>. 
                  Consider optimizing this stage.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Overall conversion rate is{' '}
                  <strong>{formatPercentage(funnelMetrics.overallConversionRate)}</strong>. 
                  {funnelMetrics.overallConversionRate >= 5 ? 
                    " This is performing well." : 
                    " There's room for improvement."
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}