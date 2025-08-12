'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineDataPoint {
  timestamp: string;
  leads: number;
  conversions: number;
  spend: number;
  revenue: number;
  roi: number;
}

interface PerformanceTimelineProps {
  data: TimelineDataPoint[];
  timeRange: '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '24h' | '7d' | '30d' | '90d') => void;
}

export function PerformanceTimeline({ data, timeRange, onTimeRangeChange }: PerformanceTimelineProps) {
  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'spend':
      case 'revenue':
        return [`$${value.toLocaleString()}`, name];
      case 'roi':
        return [`${value.toFixed(2)}x`, 'ROI'];
      case 'leads':
        return [`${value.toLocaleString()}`, 'Leads'];
      case 'conversions':
        return [`${value.toLocaleString()}`, 'Conversions'];
      default:
        return [value, name];
    }
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    switch (timeRange) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '30d':
      case '90d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return tickItem;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance Timeline</CardTitle>
            <CardDescription>Key metrics over time</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <Badge
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onTimeRangeChange(range)}
              >
                {range}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(label) => `Time: ${formatXAxisLabel(label)}`}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="leads" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
              name="Leads"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="conversions" 
              stroke="#82ca9d" 
              strokeWidth={2}
              dot={false}
              name="Conversions"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="roi" 
              stroke="#ff7300" 
              strokeWidth={2}
              dot={false}
              name="ROI"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}