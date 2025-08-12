'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RealtimeDataPoint {
  timestamp: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface RealtimeMetricProps {
  title: string;
  description: string;
  data: RealtimeDataPoint[];
  currentValue: number;
  unit: string;
  target?: number;
  format?: 'number' | 'currency' | 'percentage';
  color?: string;
}

interface RealtimeMetricsProps {
  metrics: RealtimeMetricProps[];
  updateInterval?: number;
}

export function RealtimeMetrics({ metrics, updateInterval = 5000 }: RealtimeMetricsProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const formatValue = (value: number, format: string = 'number', unit: string = '') => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return `${value.toLocaleString()}${unit}`;
    }
  };

  const getTrendIcon = (trend: string, size = 16) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={size} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={size} className="text-red-600" />;
      default:
        return <Minus size={size} className="text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Real-time Metrics</h3>
          <Badge variant="outline" className="text-xs">
            LIVE
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const latestDataPoint = metric.data[metric.data.length - 1];
          const trend = latestDataPoint?.trend || 'stable';
          const change = latestDataPoint?.change || 0;

          return (
            <Card key={index} className="relative overflow-hidden">
              {/* Live indicator */}
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <CardDescription className="text-xs">{metric.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Current Value */}
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatValue(metric.currentValue, metric.format, metric.unit)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {getTrendIcon(trend, 14)}
                    <span className={getTrendColor(trend)}>
                      {change > 0 ? '+' : ''}{change}
                      {metric.format === 'percentage' ? 'pp' : metric.unit} vs last period
                    </span>
                  </div>

                  {metric.target && (
                    <div className="text-xs text-gray-500">
                      Target: {formatValue(metric.target, metric.format, metric.unit)}
                    </div>
                  )}
                </div>

                {/* Mini Chart */}
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.data.slice(-20)}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={metric.color || '#8884d8'}
                        fill={metric.color || '#8884d8'}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatValue(Number(value), metric.format, metric.unit),
                          metric.title
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Combined Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Combined Performance Timeline</CardTitle>
          <CardDescription>All metrics over the last hour</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp"
                type="category"
                allowDuplicatedCategory={false}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              {metrics.map((metric, index) => (
                <Line
                  key={index}
                  data={metric.data}
                  type="monotone"
                  dataKey="value"
                  stroke={metric.color || COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  name={metric.title}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];