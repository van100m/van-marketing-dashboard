'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Target, Zap, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types';
import { cn, formatPercentage, getTrendIcon, getTrendColor } from '@/lib/utils';

interface PerformanceScoreProps {
  agent: Agent;
  showBreakdown?: boolean;
  showTrends?: boolean;
  size?: 'compact' | 'default' | 'expanded';
  onClick?: () => void;
  className?: string;
}

interface PerformanceTrendData {
  date: string;
  resultsScore: number;
  alignmentScore: number;
  effectivenessScore: number;
}

export function PerformanceScore({ 
  agent, 
  showBreakdown = false, 
  showTrends = false,
  size = 'default',
  onClick,
  className 
}: PerformanceScoreProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);

  // Calculate scores with fallback
  const resultsScore = agent.performance.resultsScore || agent.performance.successRate || 0;
  const alignmentScore = agent.performance.alignmentScore || 85; // Default alignment
  const effectivenessScore = agent.performance.effectivenessScore || 
    Math.round(resultsScore * 0.6 + alignmentScore * 0.4);

  // Mock historical trend data - in real app this would come from API
  const trendData: PerformanceTrendData[] = [
    { date: '7 days ago', resultsScore: resultsScore - 5, alignmentScore: alignmentScore - 3, effectivenessScore: effectivenessScore - 4 },
    { date: '6 days ago', resultsScore: resultsScore - 3, alignmentScore: alignmentScore - 2, effectivenessScore: effectivenessScore - 3 },
    { date: '5 days ago', resultsScore: resultsScore - 1, alignmentScore: alignmentScore - 1, effectivenessScore: effectivenessScore - 1 },
    { date: '4 days ago', resultsScore: resultsScore + 1, alignmentScore: alignmentScore, effectivenessScore: effectivenessScore },
    { date: '3 days ago', resultsScore: resultsScore + 2, alignmentScore: alignmentScore + 1, effectivenessScore: effectivenessScore + 1 },
    { date: '2 days ago', resultsScore: resultsScore + 1, alignmentScore: alignmentScore + 2, effectivenessScore: effectivenessScore + 1 },
    { date: '1 day ago', resultsScore: resultsScore, alignmentScore: alignmentScore + 1, effectivenessScore: effectivenessScore },
    { date: 'Today', resultsScore, alignmentScore, effectivenessScore }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'success' as const;
    if (score >= 75) return 'warning' as const;
    if (score >= 60) return 'secondary' as const;
    return 'danger' as const;
  };

  const getTrend = () => {
    const recent = trendData.slice(-3).map(d => d.effectivenessScore);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prev = trendData.slice(-6, -3).map(d => d.effectivenessScore);
    const prevAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
    
    if (avg > prevAvg + 2) return 'up';
    if (avg < prevAvg - 2) return 'down';
    return 'stable';
  };

  const trend = getTrend();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setExpanded(!expanded);
    }
  };

  if (size === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          className
        )}
      >
        <div className={cn('text-lg font-bold', getScoreColor(effectivenessScore))}>
          {effectivenessScore}%
        </div>
        <span className={'h-4 w-4 ' + getTrendColor(trend)}>{getTrendIcon(trend)}</span>
      </button>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Score Display */}
      <div 
        className={cn(
          'flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700',
          onClick || !expanded ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : '',
          'transition-colors'
        )}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-600')}>
              <Target className="h-5 w-5 text-van-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Effectiveness Score
                </span>
                <Badge variant={getScoreBadgeVariant(effectivenessScore)}>
                  {effectivenessScore}%
                </Badge>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>Weighted: 60% results, 40% alignment</span>
                <span className={'h-3 w-3 ml-1 ' + getTrendColor(trend)}>{getTrendIcon(trend)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showTrends && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowTrendChart(!showTrendChart);
              }}
              className="p-1 h-8 w-8"
            >
              {showTrendChart ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <div className={cn('text-lg font-bold', getScoreColor(effectivenessScore))}>
            {effectivenessScore}%
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {(expanded || showBreakdown) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Results Score
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {resultsScore}%
              </div>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              60% weight • KPI performance
            </div>
            <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resultsScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Alignment Score
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {alignmentScore}%
              </div>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300 mt-1">
              40% weight • Prediction accuracy
            </div>
            <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${alignmentScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      {showTrendChart && showTrends && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Trend (7 days)
            </CardTitle>
            <CardDescription className="text-xs">
              Historical performance data showing results and alignment trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mini Chart Visualization */}
              <div className="h-20 flex items-end gap-1">
                {trendData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative h-16">
                      <div
                        className="absolute bottom-0 w-full bg-van-primary/20 rounded-t"
                        style={{ height: `${(data.effectivenessScore / 100) * 100}%` }}
                      />
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t opacity-70"
                        style={{ height: `${(data.resultsScore / 100) * 100}%` }}
                      />
                      <div
                        className="absolute bottom-0 w-full bg-green-500 rounded-t opacity-50"
                        style={{ height: `${(data.alignmentScore / 100) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {index === trendData.length - 1 ? 'Now' : `${trendData.length - 1 - index}d`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-van-primary/20 rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Effectiveness</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Results (60%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Alignment (40%)</span>
                </div>
              </div>

              {/* Current Values */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-lg font-bold text-van-primary">{effectivenessScore}%</div>
                  <div className="text-xs text-gray-500">Effectiveness</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{resultsScore}%</div>
                  <div className="text-xs text-gray-500">Results</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{alignmentScore}%</div>
                  <div className="text-xs text-gray-500">Alignment</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}