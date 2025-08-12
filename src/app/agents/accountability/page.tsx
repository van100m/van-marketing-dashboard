'use client';

import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceScore } from '@/components/agent/PerformanceScore';
import { useDashboardStore } from '@/lib/store';
import { formatPercentage, getTrendIcon, getTrendColor } from '@/lib/utils';

interface AccountabilityMetrics {
  agentId: string;
  name: string;
  category: string;
  resultsScore: number;
  alignmentScore: number;
  effectivenessScore: number;
  kpiContribution: number;
  goalAchievement: number;
  trend: 'up' | 'down' | 'stable';
  weeklyProgress: number[];
  responsibilities: string[];
  currentFocus: string;
}

export default function AccountabilityChartPage() {
  const { agents, isLoading } = useDashboardStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'trends' | 'goals'>('matrix');

  // Transform agents data into accountability metrics
  const accountabilityMetrics: AccountabilityMetrics[] = agents.map(agent => {
    const resultsScore = agent.performance.resultsScore || agent.performance.successRate || 0;
    const alignmentScore = agent.performance.alignmentScore || 85;
    const effectivenessScore = Math.round(resultsScore * 0.6 + alignmentScore * 0.4);
    
    return {
      agentId: agent.id,
      name: agent.name,
      category: agent.category,
      resultsScore,
      alignmentScore,
      effectivenessScore,
      kpiContribution: agent.performance.contributionMetrics?.roiContribution || 0,
      goalAchievement: agent.performance.contributionMetrics?.goalAchievementRate || 0,
      trend: resultsScore > 85 ? 'up' : resultsScore < 70 ? 'down' : 'stable',
      weeklyProgress: [
        effectivenessScore - 8,
        effectivenessScore - 5,
        effectivenessScore - 3,
        effectivenessScore - 1,
        effectivenessScore + 2,
        effectivenessScore + 1,
        effectivenessScore
      ],
      responsibilities: [
        `${agent.category.charAt(0).toUpperCase() + agent.category.slice(1)} operations`,
        'KPI achievement',
        'Cross-agent coordination'
      ],
      currentFocus: typeof agent.currentTasks?.[0] === 'string' ? agent.currentTasks[0] : agent.currentTasks?.[0]?.description || 'Performance optimization'
    };
  });

  // Performance categories
  const topPerformers = accountabilityMetrics.filter(m => m.effectivenessScore >= 90);
  const needsAttention = accountabilityMetrics.filter(m => m.effectivenessScore < 75);
  const systemAvgEffectiveness = Math.round(
    accountabilityMetrics.reduce((sum, m) => sum + m.effectivenessScore, 0) / accountabilityMetrics.length
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agent Accountability Chart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Results-weighted performance tracking with 60% results, 40% alignment scoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-van-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-van-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemAvgEffectiveness}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  System Average
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {topPerformers.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Top Performers (≥90%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {needsAttention.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Needs Attention (&lt;75%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {agents.filter(a => a.health.healthy).length}/{agents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Healthy Agents
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matrix">Accountability Matrix</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="goals">Goal Achievement</TabsTrigger>
        </TabsList>

        {/* Accountability Matrix */}
        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Agent Performance Matrix
              </CardTitle>
              <CardDescription>
                Click on any agent to view detailed trend analysis and accountability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountabilityMetrics.map((metric) => (
                  <div
                    key={metric.agentId}
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer ${
                      selectedAgent === metric.agentId ? 'ring-2 ring-van-primary' : ''
                    }`}
                    onClick={() => setSelectedAgent(selectedAgent === metric.agentId ? null : metric.agentId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-van-primary" />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {metric.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {metric.category} • {metric.currentFocus}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Results Score */}
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {metric.resultsScore}%
                          </div>
                          <div className="text-xs text-gray-500">Results (60%)</div>
                        </div>

                        {/* Alignment Score */}
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {metric.alignmentScore}%
                          </div>
                          <div className="text-xs text-gray-500">Alignment (40%)</div>
                        </div>

                        {/* Effectiveness Score */}
                        <div className="text-center">
                          <div className="text-xl font-bold text-van-primary">
                            {metric.effectivenessScore}%
                          </div>
                          <div className="text-xs text-gray-500">Effectiveness</div>
                        </div>

                        {/* Trend */}
                        <div className="flex items-center gap-2">
                          <span className={'h-5 w-5 ' + getTrendColor(metric.trend)}>{getTrendIcon(metric.trend)}</span>
                          <Badge variant={metric.effectivenessScore >= 90 ? 'success' : metric.effectivenessScore >= 75 ? 'warning' : 'danger'}>
                            {metric.trend}
                          </Badge>
                        </div>

                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {selectedAgent === metric.agentId && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Weekly Trend Chart */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              7-Day Performance Trend
                            </h4>
                            <div className="h-16 flex items-end gap-1">
                              {metric.weeklyProgress.map((score, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                  <div className="w-full relative h-12">
                                    <div
                                      className="absolute bottom-0 w-full bg-van-primary rounded-t"
                                      style={{ height: `${(Math.max(score, 0) / 100) * 100}%` }}
                                    />
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {index === metric.weeklyProgress.length - 1 ? 'Now' : `${metric.weeklyProgress.length - 1 - index}d`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Accountability Details */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Key Responsibilities
                            </h4>
                            <div className="space-y-2">
                              {metric.responsibilities.map((responsibility, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-van-primary/60 rounded-full" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {responsibility}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Current Focus
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {metric.currentFocus}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>
                  Agents achieving ≥90% effectiveness score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((agent) => (
                    <div key={agent.agentId} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.resultsScore}% results • {agent.alignmentScore}% alignment
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {agent.effectivenessScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <ArrowDownRight className="h-5 w-5" />
                  Needs Attention
                </CardTitle>
                <CardDescription>
                  Agents with effectiveness score &lt;75%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {needsAttention.length > 0 ? needsAttention.map((agent) => (
                    <div key={agent.agentId} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.resultsScore}% results • {agent.alignmentScore}% alignment
                        </div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {agent.effectivenessScore}%
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <div className="text-green-600 font-medium">
                        🎉 All agents performing above 75%!
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        System is operating at optimal performance
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goal Achievement */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Achievement Overview</CardTitle>
              <CardDescription>
                Individual agent progress toward weekly and monthly objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountabilityMetrics.map((metric) => (
                  <div key={metric.agentId} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {metric.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Goal Achievement Rate
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {metric.goalAchievement}%
                        </div>
                        <div className="text-sm text-gray-500">
                          of weekly targets
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-van-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(metric.goalAchievement, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}