'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Users, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentDetailTemplate } from '@/components/agent/AgentDetailTemplate';
import { formatNumber, formatPercentage } from '@/lib/utils';

export default function AnalyticsAgentPage() {
  // Analytics-specific content showcasing data insights and reporting capabilities
  const analyticsSpecificContent = (
    <>
      {/* Key Insights Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Real-Time Analytics Insights
          </CardTitle>
          <CardDescription>
            Data-driven insights and performance metrics across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatNumber(8750)}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Weekly Visitors</div>
                  <div className="text-xs text-blue-600">+12.3% vs last week</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatPercentage(4.2)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Conversion Rate</div>
                  <div className="text-xs text-green-600">+0.8% improvement</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    2.8x
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">ROI Multiple</div>
                  <div className="text-xs text-purple-600">Across all channels</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribution Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
            Channel Attribution Analysis
          </CardTitle>
          <CardDescription>
            Multi-touch attribution showing channel contribution to conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { channel: 'Organic Search', agent: 'websiteSeo', contribution: 35, conversions: 49, trend: 'up' },
              { channel: 'Email Marketing', agent: 'emailMarketing', contribution: 28, conversions: 39, trend: 'up' },
              { channel: 'Paid Social', agent: 'paidSocial', contribution: 22, conversions: 31, trend: 'stable' },
              { channel: 'Direct Traffic', agent: 'content', contribution: 15, conversions: 21, trend: 'down' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-2 relative">
                    <div
                      className="bg-van-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.contribution}%` }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.channel}
                    </div>
                    <div className="text-sm text-gray-500">
                      Managed by: {item.agent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.conversions}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{formatPercentage(item.contribution)}</span>
                    <Badge 
                      variant={item.trend === 'up' ? 'success' : item.trend === 'down' ? 'danger' : 'secondary'}
                    >
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Predictive Analytics & Forecasting
          </CardTitle>
          <CardDescription>
            AI-driven predictions for next week's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
                Lead Generation Forecast
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">Expected Leads:</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">142-156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">Confidence:</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">Trend Direction:</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">↗ Increasing</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
                Risk Factors Identified
              </h4>
              <div className="space-y-2">
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  • Paid social CPM trending up (+15%)
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  • Email engagement slightly declining (-2.1%)
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  • Competitor activity increasing in organic search
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <AgentDetailTemplate
      agentId="analytics"
      customContent={analyticsSpecificContent}
      specialFeatures={{
        analyticsCharts: true
      }}
    />
  );
}