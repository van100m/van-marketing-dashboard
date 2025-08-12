'use client';

import { useState, useEffect, useRef } from 'react';
import { analyticsAPI } from '@/lib/api/analytics';
import { campaignAPI } from '@/lib/api/campaigns';
import { monitoringAPI } from '@/lib/api/monitoring';

// Types for chart data
export interface TimelineDataPoint {
  timestamp: string;
  leads: number;
  conversions: number;
  spend: number;
  revenue: number;
  roi: number;
}

export interface ChannelPerformanceData {
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

export interface RealtimeMetricData {
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

export interface AgentPerformanceData {
  id: string;
  name: string;
  efficiency: number;
  impact: number;
  health: number;
  category: string;
  status: string;
  tasksCompleted: number;
  successRate: number;
}

// Custom hook for performance timeline data
export function usePerformanceTimeline(timeRange: '24h' | '7d' | '30d' | '90d', refreshInterval = 30000) {
  const [data, setData] = useState<TimelineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const performanceData = await analyticsAPI.getPerformanceTimeline(timeRange);
      setData(performanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance timeline');
      console.error('Error fetching performance timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRange, refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

// Custom hook for channel performance data
export function useChannelPerformance(refreshInterval = 60000) {
  const [data, setData] = useState<ChannelPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const channelData = await analyticsAPI.getChannelPerformance();
      setData(channelData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch channel performance');
      console.error('Error fetching channel performance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

// Custom hook for real-time metrics
export function useRealtimeMetrics(refreshInterval = 10000) {
  const [data, setData] = useState<RealtimeMetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const metricsData = await analyticsAPI.getRealtimeMetrics();
      setData(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch realtime metrics');
      console.error('Error fetching realtime metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

// Custom hook for agent performance matrix
export function useAgentPerformanceMatrix(refreshInterval = 45000) {
  const [data, setData] = useState<AgentPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentData = await analyticsAPI.getAgentPerformanceMatrix();
      setData(agentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agent performance matrix');
      console.error('Error fetching agent performance matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

// Custom hook for forecast data
export function useForecastData(
  metric: 'leads' | 'revenue' | 'conversions',
  timeframe: '30d' | '90d' | '1y' = '90d',
  refreshInterval = 300000 // 5 minutes
) {
  const [data, setData] = useState<{ historical: any[]; forecast: any[] }>({ historical: [], forecast: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const forecastData = await analyticsAPI.getForecastData(metric, timeframe);
      setData(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast data');
      console.error('Error fetching forecast data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [metric, timeframe, refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

// Custom hook for system metrics (monitoring)
export function useSystemMetrics(refreshInterval = 15000) {
  const [data, setData] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metrics, status] = await Promise.all([
        monitoringAPI.getSystemMetrics(),
        monitoringAPI.getCurrentSystemStatus()
      ]);
      
      setData(metrics);
      setCurrentStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system metrics');
      console.error('Error fetching system metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return { data, currentStatus, loading, error, refresh: fetchData };
}

// Custom hook for campaign data
export function useCampaignData(refreshInterval = 120000) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [campaignData, summaryData] = await Promise.all([
        campaignAPI.getAllCampaigns(),
        campaignAPI.getCampaignPerformanceSummary()
      ]);
      
      setCampaigns(campaignData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaign data');
      console.error('Error fetching campaign data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return { campaigns, summary, loading, error, refresh: fetchData };
}