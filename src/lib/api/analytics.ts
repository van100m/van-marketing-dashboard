import { supabase, TABLES } from '@/lib/supabase';
import { agentApi } from '@/lib/agents';

export interface AnalyticsMetrics {
  id: string;
  date: string;
  metric_type: 'leads' | 'conversions' | 'revenue' | 'traffic' | 'engagement';
  value: number;
  metadata: {
    source?: string;
    channel?: string;
    campaign_id?: string;
    agent_id?: string;
    breakdown?: Record<string, number>;
  };
  created_at: string;
}

export interface PerformanceData {
  timestamp: string;
  leads: number;
  conversions: number;
  spend: number;
  revenue: number;
  roi: number;
}

export interface ChannelPerformance {
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

export interface RealtimeMetric {
  title: string;
  description: string;
  data: Array<{
    timestamp: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  currentValue: number;
  unit: string;
  format: 'number' | 'currency' | 'percentage';
  color: string;
}

export interface ForecastDataPoint {
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

class AnalyticsAPIService {
  // Core metrics fetching
  async getAnalyticsMetrics(
    metricType?: string,
    startDate?: string,
    endDate?: string,
    channel?: string
  ): Promise<AnalyticsMetrics[]> {
    try {
      let query = supabase
        .from('analytics_metrics')
        .select('*')
        .order('date', { ascending: true });

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }
      if (channel) {
        query = query.eq('metadata->channel', channel);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      // Fallback to agent data
      return this.getMetricsFromAgents(metricType, startDate, endDate, channel);
    }
  }

  // Performance timeline data
  async getPerformanceTimeline(
    timeRange: '24h' | '7d' | '30d' | '90d' = '7d'
  ): Promise<PerformanceData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // Fetch from multiple metric types
      const [leads, conversions, revenue, spend] = await Promise.all([
        this.getAnalyticsMetrics('leads', startDate.toISOString(), endDate.toISOString()),
        this.getAnalyticsMetrics('conversions', startDate.toISOString(), endDate.toISOString()),
        this.getAnalyticsMetrics('revenue', startDate.toISOString(), endDate.toISOString()),
        this.getAnalyticsMetrics('spend', startDate.toISOString(), endDate.toISOString()),
      ]);

      // Combine and aggregate by date
      const dataMap = new Map<string, PerformanceData>();

      const processMetrics = (metrics: AnalyticsMetrics[], key: keyof PerformanceData) => {
        metrics.forEach(metric => {
          const date = metric.date.split('T')[0];
          if (!dataMap.has(date)) {
            dataMap.set(date, {
              timestamp: metric.date,
              leads: 0,
              conversions: 0,
              spend: 0,
              revenue: 0,
              roi: 0,
            });
          }
          const data = dataMap.get(date)!;
          (data as any)[key] += metric.value;
        });
      };

      processMetrics(leads, 'leads');
      processMetrics(conversions, 'conversions');
      processMetrics(revenue, 'revenue');
      processMetrics(spend, 'spend');

      // Calculate ROI
      const result = Array.from(dataMap.values()).map(data => ({
        ...data,
        roi: data.spend > 0 ? data.revenue / data.spend : 0,
      }));

      return result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    } catch (error) {
      console.error('Error getting performance timeline:', error);
      return this.generateMockPerformanceData(timeRange);
    }
  }

  // Channel allocation data
  async getChannelPerformance(): Promise<ChannelPerformance[]> {
    try {
      const response = await agentApi.callAgent('analytics', 'channel_performance');
      
      if (response.success && response.data?.channels) {
        return response.data.channels;
      }

      // Fallback to database query
      const { data, error } = await supabase
        .from('channel_performance')
        .select('*')
        .order('spend', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching channel performance:', error);
      return this.generateMockChannelData();
    }
  }

  // Real-time metrics
  async getRealtimeMetrics(): Promise<RealtimeMetric[]> {
    try {
      const response = await agentApi.callAgent('analytics', 'realtime_metrics');
      
      if (response.success && response.data?.metrics) {
        return response.data.metrics;
      }

      // Fallback: generate from recent data
      const recentMetrics = await this.getAnalyticsMetrics(
        undefined,
        new Date(Date.now() - 60 * 60 * 1000).toISOString() // Last hour
      );

      return this.processRealtimeMetrics(recentMetrics);
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      return this.generateMockRealtimeMetrics();
    }
  }

  // Forecasting data
  async getForecastData(
    metric: 'leads' | 'revenue' | 'conversions',
    timeframe: '30d' | '90d' | '1y' = '90d'
  ): Promise<{ historical: ForecastDataPoint[]; forecast: ForecastDataPoint[] }> {
    try {
      // Get historical data
      const daysBack = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const historicalMetrics = await this.getAnalyticsMetrics(
        metric,
        startDate.toISOString(),
        new Date().toISOString()
      );

      const historical = historicalMetrics.map(m => ({
        date: m.date.split('T')[0],
        [`actual${metric.charAt(0).toUpperCase() + metric.slice(1)}`]: m.value,
        isActual: true,
      })) as ForecastDataPoint[];

      // Get forecast from analytics agent
      const forecastResponse = await agentApi.callAgent('analytics', 'forecast', {
        metric,
        timeframe,
        historical_data: historical,
      });

      let forecast: ForecastDataPoint[] = [];
      
      if (forecastResponse.success && forecastResponse.data?.forecast) {
        forecast = forecastResponse.data.forecast;
      } else {
        // Generate mock forecast
        forecast = this.generateMockForecast(metric, daysBack);
      }

      return { historical, forecast };
    } catch (error) {
      console.error('Error getting forecast data:', error);
      return {
        historical: this.generateMockHistoricalData(metric),
        forecast: this.generateMockForecast(metric, 90),
      };
    }
  }

  // Agent performance matrix data
  async getAgentPerformanceMatrix(): Promise<Array<{
    id: string;
    name: string;
    efficiency: number;
    impact: number;
    health: number;
    category: string;
    status: string;
    tasksCompleted: number;
    successRate: number;
  }>> {
    try {
      const response = await agentApi.callAgent('analytics', 'agent_performance');
      
      if (response.success && response.data?.agents) {
        return response.data.agents;
      }

      // Fallback: get from agent health data
      const { systemHealth } = await agentApi.getAllAgentsHealth();
      return this.processAgentPerformanceData(systemHealth);
    } catch (error) {
      console.error('Error getting agent performance matrix:', error);
      return [];
    }
  }

  // Store analytics metrics
  async storeMetric(metric: Omit<AnalyticsMetrics, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('analytics_metrics')
        .insert({
          ...metric,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing analytics metric:', error);
      throw error;
    }
  }

  // Batch store metrics from agents
  async syncAgentMetrics(): Promise<void> {
    try {
      const agentIds = ['analytics', 'campaign', 'paidSocial', 'emailMarketing', 'content'];
      
      const promises = agentIds.map(async (agentId) => {
        try {
          const response = await agentApi.callAgent(agentId, 'metrics');
          
          if (response.success && response.data?.metrics) {
            const metrics = response.data.metrics.map((m: any) => ({
              date: m.date || new Date().toISOString(),
              metric_type: m.type,
              value: m.value,
              metadata: {
                ...m.metadata,
                agent_id: agentId,
                source: 'agent_sync',
              },
            }));

            await Promise.all(metrics.map((metric: any) => this.storeMetric(metric)));
          }
        } catch (error) {
          console.error(`Error syncing metrics for ${agentId}:`, error);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error syncing agent metrics:', error);
    }
  }

  // Private helper methods
  private async getMetricsFromAgents(
    metricType?: string,
    startDate?: string,
    endDate?: string,
    channel?: string
  ): Promise<AnalyticsMetrics[]> {
    try {
      const response = await agentApi.callAgent('analytics', 'metrics', {
        type: metricType,
        start_date: startDate,
        end_date: endDate,
        channel,
      });

      if (response.success && response.data?.metrics) {
        return response.data.metrics.map((m: any) => ({
          id: `agent-${m.date}-${m.type}`,
          date: m.date,
          metric_type: m.type,
          value: m.value,
          metadata: m.metadata || {},
          created_at: m.created_at || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error('Error getting metrics from agents:', error);
    }

    return [];
  }

  private processRealtimeMetrics(metrics: AnalyticsMetrics[]): RealtimeMetric[] {
    // Group metrics by type and generate real-time format
    const groupedMetrics = new Map<string, AnalyticsMetrics[]>();
    
    metrics.forEach(metric => {
      const key = metric.metric_type;
      if (!groupedMetrics.has(key)) {
        groupedMetrics.set(key, []);
      }
      groupedMetrics.get(key)!.push(metric);
    });

    return Array.from(groupedMetrics.entries()).map(([type, data]) => ({
      title: this.getMetricTitle(type),
      description: this.getMetricDescription(type),
      data: data.map(d => ({
        timestamp: d.date,
        value: d.value,
        change: Math.random() * 10 - 5, // Mock change
        trend: Math.random() > 0.5 ? 'up' : 'down' as const,
      })),
      currentValue: data[data.length - 1]?.value || 0,
      unit: this.getMetricUnit(type),
      format: this.getMetricFormat(type),
      color: this.getMetricColor(type),
    }));
  }

  private processAgentPerformanceData(systemHealth: any): Array<{
    id: string;
    name: string;
    efficiency: number;
    impact: number;
    health: number;
    category: string;
    status: string;
    tasksCompleted: number;
    successRate: number;
  }> {
    if (!systemHealth?.agents) return [];

    return systemHealth.agents.map((agent: any) => ({
      id: agent.agent,
      name: agent.agent.replace(/([A-Z])/g, ' $1').trim(),
      efficiency: agent.healthy ? 80 + Math.random() * 20 : Math.random() * 50,
      impact: agent.healthy ? 70 + Math.random() * 30 : Math.random() * 40,
      health: agent.healthy ? 85 + Math.random() * 15 : Math.random() * 50,
      category: 'unknown',
      status: agent.status,
      tasksCompleted: Math.floor(Math.random() * 50) + 10,
      successRate: agent.healthy ? 85 + Math.random() * 15 : Math.random() * 60,
    }));
  }

  // Mock data generators for fallbacks
  private generateMockPerformanceData(timeRange: string): PerformanceData[] {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data: PerformanceData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const leads = Math.floor(Math.random() * 50) + 20;
      const conversions = Math.floor(leads * (0.1 + Math.random() * 0.2));
      const spend = Math.floor(Math.random() * 2000) + 500;
      const revenue = conversions * (3000 + Math.random() * 2000);
      
      data.push({
        timestamp: date.toISOString(),
        leads,
        conversions,
        spend,
        revenue,
        roi: revenue / spend,
      });
    }

    return data;
  }

  private generateMockChannelData(): ChannelPerformance[] {
    return [
      { name: 'Paid Social', budget: 5000, spend: 4800, leads: 120, conversions: 36, revenue: 18000, roi: 3.75, cpl: 40, color: '#0088FE' },
      { name: 'Google Ads', budget: 8000, spend: 7600, leads: 180, conversions: 45, revenue: 22500, roi: 2.96, cpl: 42.2, color: '#00C49F' },
      { name: 'Email Marketing', budget: 2000, spend: 1800, leads: 90, conversions: 32, revenue: 16000, roi: 8.89, cpl: 20, color: '#FFBB28' },
      { name: 'Content Marketing', budget: 3000, spend: 2900, leads: 75, conversions: 18, revenue: 9000, roi: 3.10, cpl: 38.7, color: '#FF8042' },
      { name: 'Retargeting', budget: 1500, spend: 1400, leads: 45, conversions: 15, revenue: 7500, roi: 5.36, cpl: 31.1, color: '#8884D8' },
    ];
  }

  private generateMockRealtimeMetrics(): RealtimeMetric[] {
    return [
      {
        title: 'Active Visitors',
        description: 'Current visitors on site',
        data: this.generateRealtimeData(150, 50),
        currentValue: 187,
        unit: '',
        format: 'number',
        color: '#8884d8',
      },
      {
        title: 'Conversion Rate',
        description: 'Real-time conversion rate',
        data: this.generateRealtimeData(3.2, 0.5),
        currentValue: 3.4,
        unit: '',
        format: 'percentage',
        color: '#82ca9d',
      },
      {
        title: 'Revenue/Hour',
        description: 'Hourly revenue generation',
        data: this.generateRealtimeData(2500, 500),
        currentValue: 2840,
        unit: '',
        format: 'currency',
        color: '#ffc658',
      },
    ];
  }

  private generateRealtimeData(base: number, variance: number) {
    const data = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000);
      const value = base + (Math.random() - 0.5) * variance * 2;
      const change = (Math.random() - 0.5) * variance;
      const trend: 'up' | 'down' | 'stable' = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
      
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.max(0, value),
        change,
        trend,
      });
    }
    
    return data;
  }

  private generateMockHistoricalData(metric: string): ForecastDataPoint[] {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const seasonalFactor = 1 + 0.2 * Math.sin((i / 365) * 2 * Math.PI);
      const trendFactor = 1 + (i / 365) * 0.1;
      const noise = 0.9 + Math.random() * 0.2;
      
      const baseValue = metric === 'leads' ? 50 : metric === 'revenue' ? 15000 : 12;
      const value = Math.round(baseValue * seasonalFactor * trendFactor * noise);

      data.push({
        date: date.toISOString().split('T')[0],
        [`actual${metric.charAt(0).toUpperCase() + metric.slice(1)}`]: value,
        isActual: true,
      } as ForecastDataPoint);
    }

    return data;
  }

  private generateMockForecast(metric: string, days: number): ForecastDataPoint[] {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const growthFactor = 1 + (i / 365) * 0.15;
      const seasonalFactor = 1 + 0.2 * Math.sin(((i + 90) / 365) * 2 * Math.PI);
      
      const baseValue = metric === 'leads' ? 55 : metric === 'revenue' ? 16500 : 13;
      const forecastValue = Math.round(baseValue * seasonalFactor * growthFactor);
      const confidenceRange = 0.2;

      data.push({
        date: date.toISOString().split('T')[0],
        [`forecast${metric.charAt(0).toUpperCase() + metric.slice(1)}`]: forecastValue,
        confidenceHigh: Math.round(forecastValue * (1 + confidenceRange)),
        confidenceLow: Math.round(forecastValue * (1 - confidenceRange)),
        isActual: false,
      } as ForecastDataPoint);
    }

    return data;
  }

  // Utility methods
  private getMetricTitle(type: string): string {
    const titles: Record<string, string> = {
      leads: 'Leads',
      conversions: 'Conversions',
      revenue: 'Revenue',
      traffic: 'Traffic',
      engagement: 'Engagement',
    };
    return titles[type] || type;
  }

  private getMetricDescription(type: string): string {
    const descriptions: Record<string, string> = {
      leads: 'New leads generated',
      conversions: 'Conversions completed',
      revenue: 'Revenue generated',
      traffic: 'Website traffic',
      engagement: 'User engagement',
    };
    return descriptions[type] || `${type} metrics`;
  }

  private getMetricUnit(type: string): string {
    const units: Record<string, string> = {
      leads: '',
      conversions: '',
      revenue: '',
      traffic: '',
      engagement: '%',
    };
    return units[type] || '';
  }

  private getMetricFormat(type: string): 'number' | 'currency' | 'percentage' {
    const formats: Record<string, 'number' | 'currency' | 'percentage'> = {
      leads: 'number',
      conversions: 'number',
      revenue: 'currency',
      traffic: 'number',
      engagement: 'percentage',
    };
    return formats[type] || 'number';
  }

  private getMetricColor(type: string): string {
    const colors: Record<string, string> = {
      leads: '#8884d8',
      conversions: '#82ca9d',
      revenue: '#ffc658',
      traffic: '#ff7c7c',
      engagement: '#8dd1e1',
    };
    return colors[type] || '#8884d8';
  }
}

export const analyticsAPI = new AnalyticsAPIService();