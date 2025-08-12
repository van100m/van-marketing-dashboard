'use client';

import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Calendar,
  Zap,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentDetailTemplate } from '@/components/agent/AgentDetailTemplate';
import { formatNumber, formatCurrency, formatPercentage, getTimeAgo, getTrendIcon, getTrendColor } from '@/lib/utils';

export default function CampaignAgentPage() {
  // Mock campaign data that would be passed as customContent to the template
  const campaignSpecificContent = (
    <>
      {/* Goal Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-van-primary" />
            Current Goal: Weekly Leads
          </CardTitle>
          <CardDescription>
            Strategic objective with real-time progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-van-primary">12</div>
              <div className="text-sm text-gray-500">Weekly Target</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">9</div>
              <div className="text-sm text-gray-500">Current Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">75%</div>
              <div className="text-sm text-gray-500">Achievement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">3 days</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Allocation Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Channel Allocation Strategy
          </CardTitle>
          <CardDescription>
            Target vs actual performance by channel with agent coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Performance Table */}
            <div className="space-y-4">
              {[
                { channel: 'Email Marketing', agentId: 'emailMarketing', target: 20, actual: 22, actualLeads: 2.6, expectedLeads: 2.4, performance: 108, color: '#10B981' },
                { channel: 'Paid Social', agentId: 'paidSocial', target: 20, actual: 18, actualLeads: 2.0, expectedLeads: 2.4, performance: 90, color: '#3B82F6' },
                { channel: 'Direct Web Traffic', agentId: 'websiteSeo', target: 40, actual: 45, actualLeads: 5.1, expectedLeads: 4.8, performance: 113, color: '#8B5CF6' },
                { channel: 'Referrals', agentId: 'social', target: 20, actual: 15, actualLeads: 1.8, expectedLeads: 2.4, performance: 75, color: '#F59E0B' }
              ].map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{channel.channel}</div>
                      <div className="text-xs text-gray-500">Agent: {channel.agentId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{channel.actualLeads} / {channel.expectedLeads}</span>
                      <Badge variant={channel.performance >= 100 ? 'success' : channel.performance >= 85 ? 'warning' : 'danger'}>
                        {channel.performance}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{channel.actual}% allocation (target: {channel.target}%)</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategy Summary */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Strategy Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overall Achievement:</span>
                    <span className="font-medium text-green-600">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best Performing:</span>
                    <span className="font-medium">Direct Web Traffic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Needs Attention:</span>
                    <span className="font-medium text-orange-600">Referrals</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Adjust Strategy</div>
                  <div className="text-xs text-gray-500 mb-3">Modify channel allocations or set new goals</div>
                  <Button size="sm" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
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
      agentId="campaign"
      customContent={campaignSpecificContent}
      specialFeatures={{
        campaignGoals: true,
        channelAllocations: true
      }}
    />
  );
}