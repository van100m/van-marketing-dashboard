'use client';

import React, { useState, useEffect } from 'react';
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
  Activity,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PerformanceScore } from './PerformanceScore';
import { Agent, ActivityEvent, AgentTask, ContentItem, LessonLearned } from '@/types';
import { useDashboardStore } from '@/store/dashboard';
import { formatNumber, formatCurrency, formatPercentage, getTimeAgo, getTrendIcon, getTrendColor } from '@/lib/utils';

interface AgentDetailTemplateProps {
  agentId: string;
  customContent?: React.ReactNode;
  specialFeatures?: {
    channelAllocations?: boolean;
    campaignGoals?: boolean;
    contentCreation?: boolean;
    analyticsCharts?: boolean;
  };
}

export function AgentDetailTemplate({ 
  agentId, 
  customContent,
  specialFeatures = {} 
}: AgentDetailTemplateProps) {
  const { 
    agents, 
    businessMetrics,
    refreshAgent,
    getAgentInsights
  } = useDashboardStore();

  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const agent = agents.find(a => a.id === agentId);

  useEffect(() => {
    loadAgentInsights();
  }, [agentId]);

  const loadAgentInsights = async () => {
    setIsLoading(true);
    try {
      const data = await getAgentInsights(agentId);
      setInsights(data);
    } catch (error) {
      console.error(`Failed to load ${agentId} insights:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAgentData = async () => {
    await refreshAgent(agentId);
    await loadAgentInsights();
  };

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Agent not found</div>
          <Button onClick={refreshAgentData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  const effectivenessScore = agent.performance.effectivenessScore || 
    Math.round((agent.performance.resultsScore || agent.performance.successRate) * 0.6 + 
               (agent.performance.alignmentScore || 85) * 0.4);

  // Mock data that would come from API
  const currentTasks: AgentTask[] = [
    {
      id: '1',
      assignedTo: agentId,
      assignedBy: 'cmo',
      description: 'Optimize conversion rates for mobile traffic',
      priority: 'high',
      expectedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress'
    },
    {
      id: '2',
      assignedTo: agentId,
      assignedBy: 'strategy',
      description: 'Implement A/B test for new campaign messaging',
      priority: 'medium',
      expectedDelivery: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      id: '3',
      assignedTo: agentId,
      assignedBy: 'analytics',
      description: 'Generate weekly performance report',
      priority: 'low',
      expectedDelivery: new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    }
  ];

  const recentActivities: ActivityEvent[] = [
    {
      id: '1',
      agentId,
      agentName: agent.name,
      type: 'task_completed',
      title: 'Completed optimization directive',
      description: 'Successfully implemented conversion rate improvements based on analytics data',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      impactScore: 85,
      category: 'execution',
      collaboratingAgents: ['analytics', 'strategy']
    },
    {
      id: '2',
      agentId,
      agentName: agent.name,
      type: 'strategy_evolution',
      title: 'Strategy adjustment implemented',
      description: 'Modified approach based on performance feedback and market conditions',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      impactScore: 92,
      category: 'strategy',
      collaboratingAgents: ['cmo']
    },
    {
      id: '3',
      agentId,
      agentName: agent.name,
      type: 'coordination',
      title: 'Cross-agent collaboration initiated',
      description: 'Coordinated with content and email agents for unified campaign approach',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      impactScore: 78,
      category: 'coordination',
      collaboratingAgents: ['content', 'emailMarketing']
    }
  ];

  const contentItems: ContentItem[] = [
    {
      id: '1',
      type: 'email',
      title: 'Weekly Lead Nurture Campaign',
      content: 'Email series focused on used car dealership lead conversion...',
      agentId,
      status: 'published',
      performance: { views: 2500, engagement: 18.5, clicks: 465, conversions: 23, score: 87 },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'ad',
      title: 'Facebook Lead Generation Ad',
      content: 'Targeted ad copy for used car inventory showcase...',
      agentId,
      status: 'review',
      performance: { views: 15600, engagement: 12.3, clicks: 1920, conversions: 84, score: 92 },
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    }
  ];

  const lessonsLearned: LessonLearned[] = [
    {
      id: '1',
      title: 'Mobile-first approach increases conversions',
      description: 'Optimizing for mobile users resulted in 34% higher conversion rates',
      agentId,
      category: 'optimization',
      tags: ['mobile', 'conversion', 'ux'],
      success: true,
      metrics: { conversion_increase: 34, revenue_impact: 12500 },
      createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      applicable: true
    },
    {
      id: '2', 
      title: 'Time-sensitive offers drive urgency',
      description: 'Limited-time promotions generated 2.3x more immediate responses',
      agentId,
      category: 'messaging',
      tags: ['urgency', 'offers', 'timing'],
      success: true,
      metrics: { response_rate_increase: 230, engagement_boost: 156 },
      createdAt: new Date(Date.now() - 336 * 60 * 60 * 1000).toISOString(),
      applicable: true
    }
  ];

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-van-primary text-white text-lg font-semibold">
                {agent.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {agent.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {agent.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PerformanceScore
              agent={agent}
              showBreakdown={false}
              showTrends={true}
              size="default"
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`status-indicator ${agent.health.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{agent.health.status}</span>
              <Activity className="h-3 w-3 ml-1" />
            </div>
            <Button onClick={refreshAgentData} disabled={isLoading} size="sm">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {agent.performance.contributionMetrics?.leadsGenerated || 127}
                      </div>
                      <div className="text-sm text-gray-500">Leads Generated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPercentage(agent.performance.contributionMetrics?.conversionRate || 4.2)}
                      </div>
                      <div className="text-sm text-gray-500">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPercentage(agent.performance.contributionMetrics?.goalAchievementRate || 89)}
                      </div>
                      <div className="text-sm text-gray-500">Goal Achievement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {agent.performance.tasksCompleted || 47}
                      </div>
                      <div className="text-sm text-gray-500">Tasks Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Custom Content Area */}
            {customContent && (
              <div className="space-y-6">
                {customContent}
              </div>
            )}

            {/* Agent Capabilities & Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Agent Capabilities & Focus Areas
                </CardTitle>
                <CardDescription>
                  Current specializations and coordination points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Core Capabilities</h4>
                    <div className="space-y-2">
                      {agent.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Coordination Points</h4>
                    <div className="space-y-2">
                      {agent.coordinationPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Tasks</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Assign Task
              </Button>
            </div>
            
            <div className="space-y-3">
              {currentTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`status-indicator ${getTaskStatusColor(task.status)}`} />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {task.description}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Assigned by: {task.assignedBy}</span>
                            <span>Due: {getTimeAgo(task.expectedDelivery)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content & Assets</h2>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Create Content
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                        <Badge 
                          variant={item.status === 'published' ? 'success' : 
                                 item.status === 'review' ? 'warning' : 'secondary'}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>
                      {item.performance && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Views:</span>
                            <span className="ml-1 font-medium">{formatNumber(item.performance.views)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversions:</span>
                            <span className="ml-1 font-medium">{item.performance.conversions}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Engagement:</span>
                            <span className="ml-1 font-medium">{item.performance.engagement}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Score:</span>
                            <span className="ml-1 font-medium text-green-600">{item.performance.score}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`status-indicator ${
                          activity.category === 'execution' ? 'bg-green-500' :
                          activity.category === 'strategy' ? 'bg-purple-500' :
                          activity.category === 'coordination' ? 'bg-blue-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.description}
                            </div>
                            {activity.collaboratingAgents && activity.collaboratingAgents.length > 0 && (
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-gray-500">Collaborated with:</span>
                                {activity.collaboratingAgents.map((agentId) => (
                                  <Badge key={agentId} variant="outline" className="text-xs">
                                    {agentId}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {getTimeAgo(activity.timestamp)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge 
                            variant={activity.priority === 'high' ? 'danger' : 
                                   activity.priority === 'medium' ? 'warning' : 'secondary'}
                          >
                            {activity.priority}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {activity.category}
                          </Badge>
                          <div className="text-xs text-green-600">
                            Impact: {activity.impactScore}/100
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lessons Learned & Insights</h2>
            
            <div className="space-y-4">
              {lessonsLearned.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${lesson.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                            {lesson.success ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(lesson.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-11">
                        <Badge variant="outline" className="capitalize">
                          {lesson.category}
                        </Badge>
                        {lesson.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {lesson.applicable && (
                          <Badge variant="success" className="text-xs">
                            Currently Applied
                          </Badge>
                        )}
                      </div>
                      
                      {Object.keys(lesson.metrics).length > 0 && (
                        <div className="ml-11 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Measured Impact:
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {Object.entries(lesson.metrics).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                                <span className="ml-1 font-medium text-green-600">
                                  {typeof value === 'number' && key.includes('increase') ? '+' : ''}
                                  {typeof value === 'number' ? formatNumber(value) : value}
                                  {key.includes('rate') || key.includes('increase') || key.includes('boost') ? '%' : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agent Coordination</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaboration Network
                </CardTitle>
                <CardDescription>
                  Active collaborations and coordination patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Advanced Coordination View
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    Interactive coordination network coming soon
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">Strategy Coordination</Badge>
                    <Badge variant="outline">Task Delegation</Badge>
                    <Badge variant="outline">Knowledge Sharing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}