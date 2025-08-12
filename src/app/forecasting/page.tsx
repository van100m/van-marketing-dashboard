'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ForecastingChart } from '@/components/charts';
import { useForecastData } from '@/hooks/useChartData';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  AlertTriangle,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

export default function ForecastingPage() {
  const [selectedMetric, setSelectedMetric] = useState<'leads' | 'revenue' | 'conversions'>('leads');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('90d');
  
  // Use real forecast data
  const forecastData = useForecastData(selectedMetric, selectedTimeframe, 300000); // 5min refresh

  // Real forecast data is loaded via the hook

  const handleRefresh = async () => {
    forecastData.refresh();
  };

  const handleExport = () => {
    // Export real forecast data
    const data = [...forecastData.data.historical, ...forecastData.data.forecast];
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-${selectedMetric}-${selectedTimeframe}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="h-6 w-6" />
                AI-Powered Forecasting
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Predictive analytics and business intelligence for strategic planning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={handleRefresh} 
                disabled={forecastData.loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${forecastData.loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Key Forecast Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next 30 Days</p>
                  <p className="text-2xl font-bold">1,654</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.3% projected
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Forecast</p>
                  <p className="text-2xl font-bold">$486K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.7% projected
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <p className="text-xs text-blue-600">Last 30 days</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confidence Level</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-yellow-600">Next 30 days</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Forecasting Chart */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Forecasting</CardTitle>
            <CardDescription>
              {forecastData.loading ? 'Loading forecast data...' : `${selectedMetric} forecast with ${selectedTimeframe} timeframe`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForecastingChart
              historicalData={forecastData.data.historical}
              forecastData={forecastData.data.forecast}
              metric={selectedMetric}
              timeframe={selectedTimeframe}
              onMetricChange={setSelectedMetric}
              onTimeframeChange={setSelectedTimeframe}
            />
            {forecastData.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">Error: {forecastData.error}</p>
              </div>
            )}
            {forecastData.loading && (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading forecast data...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Performance & Accuracy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Performance</CardTitle>
              <CardDescription>Historical accuracy metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>7-day accuracy</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.8%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>30-day accuracy</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>90-day accuracy</span>
                    <span className="font-medium">87.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '87.1%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Drivers</CardTitle>
              <CardDescription>Factors influencing forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Seasonal trends</span>
                  <Badge variant="outline">High impact</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">Campaign performance</span>
                  <Badge variant="outline">High impact</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">Market conditions</span>
                  <Badge variant="outline">Medium impact</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Competition</span>
                  <Badge variant="outline">Low impact</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
              <CardDescription>AI-generated suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-900">Increase Budget</p>
                  <p className="text-xs text-green-700 mt-1">
                    Forecast shows 15% growth opportunity in paid social
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-900">Optimize Timing</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Peak performance expected in weeks 3-4
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-yellow-900">Monitor Closely</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Market volatility may impact conversions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Forecasting Analytics</CardTitle>
            <CardDescription>
              Deep insights into prediction patterns and model behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {selectedMetric === 'leads' ? '1,854' : selectedMetric === 'revenue' ? '$542K' : '456'}
                </div>
                <div className="text-sm text-gray-600">Peak Forecast</div>
                <div className="text-xs text-blue-600 mt-1">Week 3</div>
              </div>
              
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 mb-2">22%</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
                <div className="text-xs text-green-600 mt-1">Next quarter</div>
              </div>
              
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600 mb-2">±12%</div>
                <div className="text-sm text-gray-600">Variance Range</div>
                <div className="text-xs text-orange-600 mt-1">95% confidence</div>
              </div>
              
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">3.8</div>
                <div className="text-sm text-gray-600">Trend Strength</div>
                <div className="text-xs text-purple-600 mt-1">Strong upward</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}