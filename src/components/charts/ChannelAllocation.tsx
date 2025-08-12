'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChannelData {
  name: string;
  budget: number;
  spend: number;
  leads: number;
  conversions: number;
  revenue: number;
  roi: number;
  cpl: number;
  color: string;
}

interface ChannelAllocationProps {
  data: ChannelData[];
  totalBudget: number;
  totalSpend: number;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

export function ChannelAllocation({ data, totalBudget, totalSpend }: ChannelAllocationProps) {
  const pieData = data.map((channel, index) => ({
    ...channel,
    color: COLORS[index % COLORS.length]
  }));

  const performanceData = data.map(channel => ({
    name: channel.name,
    roi: channel.roi,
    cpl: channel.cpl,
    conversionRate: ((channel.conversions / channel.leads) * 100) || 0,
    spend: channel.spend,
    revenue: channel.revenue
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Allocation & Performance</CardTitle>
        <CardDescription>
          Budget allocation and performance by channel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="allocation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Budget Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">Channel Summary</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {data.map((channel, index) => (
                    <div key={channel.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-sm">{channel.name}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{formatCurrency(channel.spend)}</div>
                        <div className="text-gray-500">
                          {((channel.spend / totalSpend) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'spend' || name === 'revenue') return formatCurrency(Number(value));
                    if (name === 'conversionRate') return formatPercentage(Number(value));
                    if (name === 'roi') return `${Number(value).toFixed(2)}x`;
                    return value;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="spend" fill="#8884d8" name="Spend" />
                <Bar yAxisId="left" dataKey="revenue" fill="#82ca9d" name="Revenue" />
                <Bar yAxisId="right" dataKey="roi" fill="#ff7300" name="ROI" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Cost Per Lead</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="cpl" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">Conversion Rate</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                    <Bar dataKey="conversionRate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}