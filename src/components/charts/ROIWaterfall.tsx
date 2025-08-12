'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { ROIWaterfallData } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface ROIWaterfallProps {
  data: ROIWaterfallData;
  title?: string;
  description?: string;
  className?: string;
}

export function ROIWaterfall({ 
  data, 
  title = "ROI Waterfall Analysis", 
  description = "Investment and revenue breakdown by channel and agent",
  className 
}: ROIWaterfallProps) {
  
  const chartData = useMemo(() => {
    const categories = [...data.categories];
    const maxValue = Math.max(
      data.totalInvestment,
      data.totalRevenue,
      ...categories.map(c => Math.max(c.investment, c.revenue))
    );

    // Calculate cumulative values for waterfall effect
    let runningTotal = 0;
    const waterfallData = categories.map((category, index) => {
      const netValue = category.revenue - category.investment;
      const prevTotal = runningTotal;
      runningTotal += netValue;
      
      return {
        ...category,
        netValue,
        cumulativeValue: runningTotal,
        prevCumulativeValue: prevTotal,
        isPositive: netValue >= 0,
        barHeight: Math.abs(netValue) / maxValue * 100,
        barY: netValue >= 0 ? 100 - (prevTotal / maxValue * 100) - (Math.abs(netValue) / maxValue * 100) : 100 - (prevTotal / maxValue * 100)
      };
    });

    return {
      categories: waterfallData,
      maxValue,
      finalROI: data.overallROI
    };
  }, [data]);

  const getROIColor = (roi: number) => {
    if (roi >= 300) return 'text-green-600 bg-green-50 border-green-200';
    if (roi >= 200) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (roi >= 100) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatROI = (roi: number) => {
    return roi >= 100 ? `${(roi / 100).toFixed(1)}x` : `${roi.toFixed(0)}%`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ROI Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.totalInvestment)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Investment</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            </div>
            <div className={`text-center p-4 rounded-lg border ${getROIColor(data.overallROI)}`}>
              <div className="text-2xl font-bold">
                {formatROI(data.overallROI)}
              </div>
              <div className="text-sm">Overall ROI</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.totalRevenue - data.totalInvestment)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Net Profit</div>
            </div>
          </div>

          {/* Waterfall Chart */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-4 w-4" />
              ROI Waterfall Breakdown
            </h4>
            
            <div className="relative h-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-end justify-between h-full gap-2">
                {/* Starting point */}
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-gray-400 text-white text-xs p-2 rounded mb-2 min-h-[2rem] flex items-center justify-center text-center">
                    Start
                  </div>
                  <div 
                    className="w-full bg-gray-400 rounded-t"
                    style={{ height: '20%' }}
                  />
                  <div className="text-xs text-center mt-2 font-medium text-gray-600 dark:text-gray-400">
                    Baseline
                  </div>
                </div>

                {/* Category bars */}
                {chartData.categories.map((category, index) => (
                  <div key={`${category.name}-${index}`} className="flex flex-col items-center flex-1 relative">
                    <div 
                      className={`text-white text-xs p-2 rounded mb-2 min-h-[2rem] flex items-center justify-center text-center ${
                        category.isPositive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: '100%' }}
                    >
                      {category.isPositive ? '+' : ''}{formatCurrency(category.netValue)}
                    </div>
                    <div className="relative w-full h-full">
                      {/* Connection line from previous */}
                      <div 
                        className="absolute border-t-2 border-dashed border-gray-300"
                        style={{ 
                          top: `${category.isPositive ? category.barY + category.barHeight : category.barY}px`,
                          left: '-10px',
                          width: '10px'
                        }}
                      />
                      <div 
                        className={`w-full rounded transition-all duration-500 ${
                          category.isPositive 
                            ? 'bg-gradient-to-t from-green-500 to-green-400' 
                            : 'bg-gradient-to-t from-red-500 to-red-400'
                        }`}
                        style={{ 
                          height: `${category.barHeight}%`,
                          transform: `translateY(${category.barY}%)`
                        }}
                      />
                      {/* Connection line to next */}
                      {index < chartData.categories.length - 1 && (
                        <div 
                          className="absolute border-t-2 border-dashed border-gray-300"
                          style={{ 
                            top: `${category.cumulativeValue >= 0 ? category.barY : category.barY + category.barHeight}px`,
                            right: '-10px',
                            width: '10px'
                          }}
                        />
                      )}
                    </div>
                    <div className="text-xs text-center mt-2 font-medium text-gray-600 dark:text-gray-400 max-w-full truncate">
                      {category.name}
                    </div>
                  </div>
                ))}

                {/* Final total */}
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`text-white text-xs p-2 rounded mb-2 min-h-[2rem] flex items-center justify-center text-center ${
                      chartData.finalROI >= 100 ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {formatROI(chartData.finalROI)}
                  </div>
                  <div 
                    className={`w-full rounded-t ${
                      chartData.finalROI >= 100 ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ height: `${Math.abs(chartData.categories[chartData.categories.length - 1]?.cumulativeValue || 0) / chartData.maxValue * 100}%` }}
                  />
                  <div className="text-xs text-center mt-2 font-medium text-gray-600 dark:text-gray-400">
                    Final ROI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Category Breakdown</h4>
            <div className="space-y-2">
              {data.categories
                .sort((a, b) => b.roi - a.roi)
                .map((category, index) => {
                  const netValue = category.revenue - category.investment;
                  const isPositive = netValue >= 0;
                  
                  return (
                    <div 
                      key={`breakdown-${category.name}-${index}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Investment: {formatCurrency(category.investment)}</span>
                            <span>Revenue: {formatCurrency(category.revenue)}</span>
                            {category.agentId && (
                              <Badge variant="outline" className="text-xs">
                                {category.agentId}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold flex items-center gap-1 ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {formatROI(category.roi)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isPositive ? '+' : ''}{formatCurrency(netValue)} net
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Top Performers
              </h5>
              {data.categories
                .filter(c => c.roi >= 200)
                .sort((a, b) => b.roi - a.roi)
                .slice(0, 3)
                .map((category, index) => (
                <div key={`top-${index}`} className="flex justify-between text-sm text-green-800 dark:text-green-200">
                  <span>{category.name}</span>
                  <span className="font-medium">{formatROI(category.roi)}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
              <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Needs Attention
              </h5>
              {data.categories
                .filter(c => c.roi < 100)
                .sort((a, b) => a.roi - b.roi)
                .slice(0, 3)
                .map((category, index) => (
                <div key={`attention-${index}`} className="flex justify-between text-sm text-red-800 dark:text-red-200">
                  <span>{category.name}</span>
                  <span className="font-medium">{formatROI(category.roi)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}