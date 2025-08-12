'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface ForecastPoint {
  date: string;
  actualLeads?: number;
  actualRevenue?: number;
  actualConversions?: number;
  forecastLeads?: number;
  forecastRevenue?: number;
  forecastConversions?: number;
  confidenceHigh?: number;
  confidenceLow?: number;
  isActual: boolean;
}

interface ForecastingChartProps {
  historicalData: ForecastPoint[];
  forecastData: ForecastPoint[];
  metric: 'leads' | 'revenue' | 'conversions';
  timeframe: '30d' | '90d' | '1y';
  onMetricChange: (metric: 'leads' | 'revenue' | 'conversions') => void;
  onTimeframeChange: (timeframe: '30d' | '90d' | '1y') => void;
}

export function ForecastingChart({
  historicalData,
  forecastData,
  metric,
  timeframe,
  onMetricChange,
  onTimeframeChange
}: ForecastingChartProps) {
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);

  const combinedData = [...historicalData, ...forecastData];
  const todayIndex = historicalData.length - 1;

  const getMetricConfig = () => {
    switch (metric) {
      case 'leads':
        return {
          actualKey: 'actualLeads',
          forecastKey: 'forecastLeads',
          color: '#8884d8',
          label: 'Leads',
          format: (value: number) => value.toLocaleString()
        };
      case 'revenue':
        return {
          actualKey: 'actualRevenue',
          forecastKey: 'forecastRevenue',
          color: '#82ca9d',
          label: 'Revenue',
          format: (value: number) => `$${value.toLocaleString()}`
        };
      case 'conversions':
        return {
          actualKey: 'actualConversions',
          forecastKey: 'forecastConversions',
          color: '#ffc658',
          label: 'Conversions',
          format: (value: number) => value.toLocaleString()
        };
    }
  };

  const config = getMetricConfig();

  const forecastSummary = {
    nextMonth: forecastData.slice(0, 30).reduce((sum, point) => 
      sum + (point[config.forecastKey as keyof ForecastPoint] as number || 0), 0
    ),
    growth: ((forecastData[29]?.[config.forecastKey as keyof ForecastPoint] as number || 0) - 
             (historicalData[todayIndex]?.[config.actualKey as keyof ForecastPoint] as number || 0)) /
            (historicalData[todayIndex]?.[config.actualKey as keyof ForecastPoint] as number || 1) * 100,
    confidence: 85, // Mock confidence score
  };

  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['--', name];
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    return [isNaN(numValue) ? '--' : config.format(numValue), name];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI-Powered Forecasting
            </CardTitle>
            <CardDescription>
              Predictive analytics with confidence intervals
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {(['leads', 'revenue', 'conversions'] as const).map((m) => (
              <Button
                key={m}
                variant={metric === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => onMetricChange(m)}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Forecast Chart</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            {/* Time Range Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['30d', '90d', '1y'] as const).map((tf) => (
                  <Badge
                    key={tf}
                    variant={timeframe === tf ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onTimeframeChange(tf)}
                  >
                    {tf}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
              >
                {showConfidenceInterval ? 'Hide' : 'Show'} Confidence
              </Button>
            </div>

            {/* Forecast Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {config.format(forecastSummary.nextMonth)}
                </div>
                <div className="text-sm text-gray-600">Next 30 Days</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  forecastSummary.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {forecastSummary.growth > 0 ? '+' : ''}{forecastSummary.growth.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Expected Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {forecastSummary.confidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={config.format} />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Legend />

                {/* Reference line for today */}
                <ReferenceLine 
                  x={historicalData[todayIndex]?.date} 
                  stroke="#666" 
                  strokeDasharray="2 2" 
                  label="Today"
                />

                {/* Confidence interval */}
                {showConfidenceInterval && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="confidenceHigh"
                      stroke="#ddd"
                      strokeDasharray="5 5"
                      dot={false}
                      name="95% Confidence High"
                    />
                    <Line
                      type="monotone"
                      dataKey="confidenceLow"
                      stroke="#ddd"
                      strokeDasharray="5 5"
                      dot={false}
                      name="95% Confidence Low"
                    />
                  </>
                )}

                {/* Actual data */}
                <Line
                  type="monotone"
                  dataKey={config.actualKey}
                  stroke={config.color}
                  strokeWidth={3}
                  dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                  name={`Actual ${config.label}`}
                />

                {/* Forecast data */}
                <Line
                  type="monotone"
                  dataKey={config.forecastKey}
                  stroke={config.color}
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                  name={`Forecast ${config.label}`}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Key Forecast Insights</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Seasonal uptick expected in weeks 2-3 based on historical patterns</li>
                      <li>• Current campaign performance suggests 12% growth trajectory</li>
                      <li>• AI model confidence is high (85%) for next 30-day period</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Optimization Opportunities</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• Increase budget allocation during predicted peak periods</li>
                      <li>• Focus on high-converting channels identified in the forecast</li>
                      <li>• Prepare content and resources for anticipated demand surge</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">Risk Factors</h4>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      <li>• Market volatility could impact conversion rates by ±5%</li>
                      <li>• Seasonal holidays may affect typical performance patterns</li>
                      <li>• Competitor activity changes could influence forecasted outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Model Assumptions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Historical Data</h5>
                    <p className="text-xs text-gray-600">
                      Based on 12 months of historical performance data with seasonal adjustments
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Market Conditions</h5>
                    <p className="text-xs text-gray-600">
                      Assumes stable market conditions and no major economic disruptions
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Campaign Continuity</h5>
                    <p className="text-xs text-gray-600">
                      Current campaign strategies and budget allocations remain consistent
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-2">External Factors</h5>
                    <p className="text-xs text-gray-600">
                      Accounts for seasonal trends but not unexpected market events
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Model Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Confidence Level:</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prediction Horizon:</span>
                    <span className="font-medium">90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Update Frequency:</span>
                    <span className="font-medium">Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <span className="font-medium">ARIMA with ML enhancement</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}