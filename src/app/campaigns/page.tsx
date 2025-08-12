'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useCampaignData } from '@/hooks/useChartData';
import { campaignAPI } from '@/lib/api/campaigns';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Edit,
  Trash2,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'paid-social' | 'google-ads' | 'email' | 'content' | 'display';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  leads: number;
  conversions: number;
  roi: number;
  ctr: number;
  cpc: number;
  agentId: string;
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Use real campaign data
  const { campaigns, summary, loading, error, refresh } = useCampaignData(120000); // 2min refresh

  // Handle campaign actions
  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'activate' | 'complete') => {
    try {
      switch (action) {
        case 'pause':
          await campaignAPI.pauseCampaign(campaignId);
          break;
        case 'activate':
          await campaignAPI.activateCampaign(campaignId);
          break;
        case 'complete':
          await campaignAPI.completeCampaign(campaignId);
          break;
      }
      // Refresh data after action
      refresh();
    } catch (err) {
      console.error(`Failed to ${action} campaign:`, err);
    }
  };

  // Mock campaign data for fallback
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      status: 'active',
      type: 'paid-social',
      budget: 5000,
      spent: 3200,
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      leads: 156,
      conversions: 47,
      roi: 3.2,
      ctr: 2.4,
      cpc: 1.85,
      agentId: 'paidSocial'
    },
    {
      id: '2',
      name: 'Q1 Brand Awareness',
      status: 'active',
      type: 'google-ads',
      budget: 8000,
      spent: 6400,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      leads: 203,
      conversions: 61,
      roi: 2.8,
      ctr: 3.1,
      cpc: 2.12,
      agentId: 'campaign'
    },
    {
      id: '3',
      name: 'Newsletter Nurture Series',
      status: 'active',
      type: 'email',
      budget: 1500,
      spent: 890,
      startDate: '2024-12-15',
      endDate: '2025-02-15',
      leads: 89,
      conversions: 34,
      roi: 5.6,
      ctr: 4.2,
      cpc: 0.85,
      agentId: 'emailMarketing'
    },
    {
      id: '4',
      name: 'Content Hub Launch',
      status: 'paused',
      type: 'content',
      budget: 3000,
      spent: 1200,
      startDate: '2024-11-01',
      endDate: '2025-01-31',
      leads: 45,
      conversions: 12,
      roi: 1.8,
      ctr: 1.9,
      cpc: 2.67,
      agentId: 'content'
    },
    {
      id: '5',
      name: 'Retargeting Campaign',
      status: 'completed',
      type: 'display',
      budget: 2500,
      spent: 2500,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      leads: 78,
      conversions: 23,
      roi: 3.9,
      ctr: 2.8,
      cpc: 1.95,
      agentId: 'retargeting'
    }
  ];

  const activeCampaigns = campaigns || mockCampaigns;
  
  const filteredCampaigns = activeCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    const matchesType = selectedType === 'all' || campaign.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'paid-social':
        return 'bg-blue-100 text-blue-800';
      case 'google-ads':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-purple-100 text-purple-800';
      case 'content':
        return 'bg-orange-100 text-orange-800';
      case 'display':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Performance overview data
  const performanceData = activeCampaigns.map(campaign => ({
    name: campaign.name,
    spent: campaign.spent,
    leads: campaign.leads,
    conversions: campaign.conversions,
    roi: campaign.roi
  }));

  const budgetDistribution = activeCampaigns.map(campaign => ({
    name: campaign.name,
    value: campaign.spent,
    color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][activeCampaigns.indexOf(campaign)]
  }));

  const totalStats = summary || {
    totalBudget: activeCampaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: activeCampaigns.reduce((sum, c) => sum + c.spent, 0),
    totalLeads: activeCampaigns.reduce((sum, c) => sum + c.leads, 0),
    totalConversions: activeCampaigns.reduce((sum, c) => sum + c.conversions, 0),
    avgROI: activeCampaigns.length > 0 ? activeCampaigns.reduce((sum, c) => sum + c.roi, 0) / activeCampaigns.length : 0,
    activeCampaigns: activeCampaigns.filter(c => c.status === 'active').length,
    campaignCount: activeCampaigns.length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Campaign Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage and optimize your marketing campaigns
              </p>
            </div>
            <div className="flex items-center gap-3">
              {loading && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2" />
                  Loading campaigns...
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={refresh}
                disabled={loading}
              >
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalBudget)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalSpent)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold">{totalStats.totalLeads.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold">{totalStats.totalConversions}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg ROI</p>
                  <p className="text-2xl font-bold">{totalStats.avgROI.toFixed(1)}x</p>
                </div>
                <BarChart3 className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="paid-social">Paid Social</option>
                    <option value="google-ads">Google Ads</option>
                    <option value="email">Email</option>
                    <option value="content">Content</option>
                    <option value="display">Display</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns ({filteredCampaigns.length})</CardTitle>
                <CardDescription>
                  Manage your marketing campaigns across all channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          {campaign.status === 'active' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {campaign.status === 'paused' && <Pause className="h-5 w-5 text-yellow-500" />}
                          {campaign.status === 'completed' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          {campaign.status === 'draft' && <AlertCircle className="h-5 w-5 text-gray-500" />}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className={getTypeColor(campaign.type)}>
                              {campaign.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{campaign.startDate} - {campaign.endDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{campaign.leads} leads</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              <span>{campaign.conversions} conversions</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {campaign.roi.toFixed(1)}x ROI
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPercentage(campaign.ctr)} CTR
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {campaign.status === 'active' && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>ROI and conversion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#8884d8" name="Leads" />
                      <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversions" />
                      <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#ffc658" name="ROI" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Distribution</CardTitle>
                  <CardDescription>Spending allocation across campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {budgetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Analytics</CardTitle>
                <CardDescription>Detailed performance insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Top Performer</h4>
                    <p className="text-sm text-green-800">
                      Newsletter Nurture Series achieving 5.6x ROI with strong email engagement
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Optimization Opportunity</h4>
                    <p className="text-sm text-blue-800">
                      Content Hub campaign paused - consider reactivating with refined targeting
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Budget Utilization</h4>
                    <p className="text-sm text-yellow-800">
                      {((totalStats.totalSpent / totalStats.totalBudget) * 100).toFixed(1)}% of total budget utilized
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}