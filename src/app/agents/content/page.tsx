'use client';

import React from 'react';
import { FileText, Edit3, Eye, Share, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentDetailTemplate } from '@/components/agent/AgentDetailTemplate';
import { formatNumber } from '@/lib/utils';

export default function ContentAgentPage() {
  // Content-specific functionality showcasing content creation and management
  const contentSpecificContent = (
    <>
      {/* Content Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-green-600" />
            Content Creation Pipeline
          </CardTitle>
          <CardDescription>
            Active content projects and publication schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">In Draft</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">In Review</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-green-700 dark:text-green-300">Scheduled</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-600">47</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Published</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-600" />
            Top Performing Content
          </CardTitle>
          <CardDescription>
            Highest engagement content pieces this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: 'Ultimate Guide to Buying Used Cars: 2024 Edition',
                type: 'Blog Post',
                views: 15600,
                engagement: 8.7,
                conversions: 89,
                status: 'published',
                publishDate: '2024-01-08'
              },
              {
                title: 'Top 10 Used Car Deals This Week',
                type: 'Email Newsletter',
                views: 8900,
                engagement: 12.3,
                conversions: 67,
                status: 'published',
                publishDate: '2024-01-06'
              },
              {
                title: 'Why Certified Pre-Owned is Worth It',
                type: 'Social Media Series',
                views: 12400,
                engagement: 9.8,
                conversions: 45,
                status: 'published',
                publishDate: '2024-01-05'
              },
              {
                title: 'New Year, New Car: Financing Options',
                type: 'Video Content',
                views: 7300,
                engagement: 15.2,
                conversions: 78,
                status: 'published',
                publishDate: '2024-01-03'
              }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {content.title}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Badge variant="outline">{content.type}</Badge>
                      <span>Published {content.publishDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{formatNumber(content.views)}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">{content.engagement}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">{content.conversions}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Upcoming Content Calendar
          </CardTitle>
          <CardDescription>
            Scheduled publications and content planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Tomorrow', title: 'Weekly Market Update Newsletter', type: 'Email', time: '9:00 AM', status: 'ready' },
              { date: 'Jan 15', title: 'How to Negotiate Used Car Prices', type: 'Blog', time: '2:00 PM', status: 'scheduled' },
              { date: 'Jan 16', title: 'Customer Success Story: Sarah\'s Journey', type: 'Video', time: '10:00 AM', status: 'in-review' },
              { date: 'Jan 17', title: 'Social Media Carousel: Car Maintenance Tips', type: 'Social', time: '3:00 PM', status: 'draft' },
              { date: 'Jan 18', title: 'Financing Friday: Loan Calculator Guide', type: 'Blog', time: '12:00 PM', status: 'scheduled' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[80px]">
                    {item.date}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.type} • {item.time}</div>
                  </div>
                </div>
                <Badge 
                  variant={
                    item.status === 'ready' ? 'success' :
                    item.status === 'scheduled' ? 'default' :
                    item.status === 'in-review' ? 'warning' : 'secondary'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="h-5 w-5 text-teal-600" />
            Content Performance Insights
          </CardTitle>
          <CardDescription>
            AI-driven insights on content effectiveness and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700">
              <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                High-Impact Topics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-teal-700 dark:text-teal-300">"Financing Options":</span>
                  <span className="font-medium text-teal-900 dark:text-teal-100">+23% conversions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700 dark:text-teal-300">"Car Maintenance":</span>
                  <span className="font-medium text-teal-900 dark:text-teal-100">+18% engagement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700 dark:text-teal-300">"Customer Stories":</span>
                  <span className="font-medium text-teal-900 dark:text-teal-100">+31% shares</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700">
              <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-3">
                Optimization Recommendations
              </h4>
              <div className="space-y-2 text-sm text-rose-800 dark:text-rose-200">
                <div>• Increase video content by 40% for better engagement</div>
                <div>• Post consistently on Tuesday/Thursday for max reach</div>
                <div>• Include more customer testimonials in blog posts</div>
                <div>• Create more "how-to" guides for technical topics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <AgentDetailTemplate
      agentId="content"
      customContent={contentSpecificContent}
      specialFeatures={{
        contentCreation: true
      }}
    />
  );
}