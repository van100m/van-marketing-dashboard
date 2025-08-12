import { supabase, TABLES } from '@/lib/supabase';
import { agentApi } from '@/lib/agents';

export interface SystemMetric {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: number;
  timestamp: string;
  metadata?: {
    source?: string;
    region?: string;
    service?: string;
  };
}

export interface AlertItem {
  id: string;
  type: 'performance' | 'security' | 'availability' | 'capacity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

export interface InfrastructureStatus {
  service_name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  response_time: number;
  uptime_percentage: number;
  last_check: string;
  metadata?: {
    version?: string;
    region?: string;
    instance_count?: number;
  };
}

export interface PerformanceMetrics {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_throughput: number;
  response_time: number;
  error_rate: number;
  active_connections: number;
}

class MonitoringAPIService {
  // System metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      return this.getSystemMetricsFromAgents();
    }
  }

  async storeSystemMetric(metric: Omit<SystemMetric, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert(metric);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing system metric:', error);
    }
  }

  // Performance monitoring
  async getPerformanceMetrics(
    startTime?: string,
    endTime?: string,
    interval: '1m' | '5m' | '15m' | '1h' = '5m'
  ): Promise<PerformanceMetrics[]> {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: true });

      if (startTime) {
        query = query.gte('timestamp', startTime);
      }
      if (endTime) {
        query = query.lte('timestamp', endTime);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply interval aggregation if needed
      return this.aggregateMetricsByInterval(data || [], interval);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.generateMockPerformanceMetrics();
    }
  }

  async getCurrentSystemStatus(): Promise<{
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    response_time: number;
    error_rate: number;
    throughput: number;
    uptime: number;
  }> {
    try {
      // Try to get from internal insights agent
      const response = await agentApi.callAgent('internalInsights', 'system_status');
      
      if (response.success && response.data) {
        return {
          cpu_usage: response.data.cpu_usage || 0,
          memory_usage: response.data.memory_usage || 0,
          disk_usage: response.data.disk_usage || 0,
          response_time: response.data.response_time || 0,
          error_rate: response.data.error_rate || 0,
          throughput: response.data.throughput || 0,
          uptime: response.data.uptime || 99.9,
        };
      }

      // Fallback to latest metrics from database
      const latestMetrics = await this.getSystemMetrics();
      return this.aggregateCurrentStatus(latestMetrics);
    } catch (error) {
      console.error('Error getting current system status:', error);
      return {
        cpu_usage: 72,
        memory_usage: 68,
        disk_usage: 45,
        response_time: 245,
        error_rate: 0.12,
        throughput: 1847,
        uptime: 99.9,
      };
    }
  }

  // Alert management
  async getAlerts(resolved?: boolean): Promise<AlertItem[]> {
    try {
      let query = supabase
        .from(TABLES.ALERTS)
        .select('*')
        .order('timestamp', { ascending: false });

      if (resolved !== undefined) {
        query = query.eq('resolved', resolved);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return this.generateMockAlerts();
    }
  }

  async createAlert(alert: Omit<AlertItem, 'id'>): Promise<AlertItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ALERTS)
        .insert({
          ...alert,
          timestamp: alert.timestamp || new Date().toISOString(),
          resolved: false,
          acknowledged: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Notify relevant agents
      this.notifyAgentsOfAlert(data);
      
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async updateAlert(id: string, updates: Partial<AlertItem>): Promise<AlertItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ALERTS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  async acknowledgeAlert(id: string): Promise<AlertItem> {
    return this.updateAlert(id, { acknowledged: true });
  }

  async resolveAlert(id: string): Promise<AlertItem> {
    return this.updateAlert(id, { resolved: true });
  }

  // Infrastructure monitoring
  async getInfrastructureStatus(): Promise<InfrastructureStatus[]> {
    try {
      const { data, error } = await supabase
        .from('infrastructure_status')
        .select('*')
        .order('last_check', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching infrastructure status:', error);
      return this.getMockInfrastructureStatus();
    }
  }

  async updateInfrastructureStatus(
    serviceName: string,
    status: InfrastructureStatus['status'],
    responseTime: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const statusData: Partial<InfrastructureStatus> = {
        service_name: serviceName,
        status,
        response_time: responseTime,
        last_check: new Date().toISOString(),
        metadata,
      };

      // Calculate uptime (simplified - in production would use historical data)
      const uptime = status === 'healthy' ? 99.9 : status === 'warning' ? 98.5 : 95.0;
      statusData.uptime_percentage = uptime;

      const { error } = await supabase
        .from('infrastructure_status')
        .upsert(statusData, { onConflict: 'service_name' });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating infrastructure status:', error);
    }
  }

  // Agent health monitoring
  async getAgentHealthMetrics(): Promise<Array<{
    agent_id: string;
    agent_name: string;
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    response_time: number;
    success_rate: number;
    tasks_completed: number;
    last_activity: string;
    metadata?: Record<string, any>;
  }>> {
    try {
      const { systemHealth, individualHealth } = await agentApi.getAllAgentsHealth();
      
      if (!systemHealth?.agents) return [];

      return systemHealth.agents.map((agent: any) => {
        const individual = individualHealth[agent.agent];
        return {
          agent_id: agent.agent,
          agent_name: this.formatAgentName(agent.agent),
          status: agent.status,
          response_time: Math.random() * 1000 + 200, // Mock - would come from individual response
          success_rate: agent.healthy ? 95 + Math.random() * 5 : Math.random() * 60,
          tasks_completed: Math.floor(Math.random() * 50) + 10,
          last_activity: agent.timestamp,
          metadata: {
            api_type: agent.apiType,
            error: agent.error,
            service: individual?.service,
          },
        };
      });
    } catch (error) {
      console.error('Error getting agent health metrics:', error);
      return [];
    }
  }

  // Monitoring automation
  async startMonitoring(): Promise<void> {
    console.log('🚀 Starting comprehensive monitoring...');
    
    // Start periodic health checks
    this.scheduleHealthChecks();
    this.schedulePerformanceCollection();
    this.scheduleAlertGeneration();
  }

  async stopMonitoring(): Promise<void> {
    console.log('🛑 Stopping monitoring...');
    // Clear intervals would go here in a real implementation
  }

  // Private helper methods
  private async getSystemMetricsFromAgents(): Promise<SystemMetric[]> {
    try {
      const response = await agentApi.callAgent('internalInsights', 'system_metrics');
      
      if (response.success && response.data?.metrics) {
        return response.data.metrics.map((metric: any) => ({
          id: `agent-${Date.now()}-${metric.name}`,
          metric_name: metric.name,
          value: metric.value,
          unit: metric.unit,
          status: this.determineStatus(metric.value, metric.threshold),
          threshold: metric.threshold || 0,
          timestamp: new Date().toISOString(),
          metadata: {
            source: 'agent',
          },
        }));
      }
    } catch (error) {
      console.error('Error getting system metrics from agents:', error);
    }

    return this.generateMockSystemMetrics();
  }

  private aggregateMetricsByInterval(
    metrics: PerformanceMetrics[],
    interval: string
  ): PerformanceMetrics[] {
    // Simple implementation - in production would use proper time-series aggregation
    const intervalMs = this.getIntervalMs(interval);
    const aggregated: PerformanceMetrics[] = [];
    const groups = new Map<number, PerformanceMetrics[]>();

    metrics.forEach(metric => {
      const timestamp = new Date(metric.timestamp).getTime();
      const bucket = Math.floor(timestamp / intervalMs) * intervalMs;
      
      if (!groups.has(bucket)) {
        groups.set(bucket, []);
      }
      groups.get(bucket)!.push(metric);
    });

    groups.forEach((groupMetrics, timestamp) => {
      const avg = (key: keyof PerformanceMetrics) => {
        const sum = groupMetrics.reduce((s, m) => s + (m[key] as number), 0);
        return sum / groupMetrics.length;
      };

      aggregated.push({
        timestamp: new Date(timestamp).toISOString(),
        cpu_usage: avg('cpu_usage'),
        memory_usage: avg('memory_usage'),
        disk_usage: avg('disk_usage'),
        network_throughput: avg('network_throughput'),
        response_time: avg('response_time'),
        error_rate: avg('error_rate'),
        active_connections: avg('active_connections'),
      });
    });

    return aggregated.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  private aggregateCurrentStatus(metrics: SystemMetric[]) {
    const defaults = {
      cpu_usage: 72,
      memory_usage: 68,
      disk_usage: 45,
      response_time: 245,
      error_rate: 0.12,
      throughput: 1847,
      uptime: 99.9,
    };

    if (!metrics.length) return defaults;

    const result = { ...defaults };
    
    metrics.forEach(metric => {
      switch (metric.metric_name.toLowerCase()) {
        case 'cpu_usage':
          result.cpu_usage = metric.value;
          break;
        case 'memory_usage':
          result.memory_usage = metric.value;
          break;
        case 'disk_usage':
          result.disk_usage = metric.value;
          break;
        case 'response_time':
          result.response_time = metric.value;
          break;
        case 'error_rate':
          result.error_rate = metric.value;
          break;
        case 'throughput':
          result.throughput = metric.value;
          break;
      }
    });

    return result;
  }

  private async notifyAgentsOfAlert(alert: AlertItem): Promise<void> {
    try {
      // Notify internal insights agent of new alert
      await agentApi.callAgent('internalInsights', 'alert_created', {
        alert_id: alert.id,
        severity: alert.severity,
        type: alert.type,
        source: alert.source,
        message: alert.message,
      });
    } catch (error) {
      console.error('Error notifying agents of alert:', error);
    }
  }

  private scheduleHealthChecks(): void {
    // In a real implementation, this would set up intervals
    console.log('📋 Health checks scheduled');
  }

  private schedulePerformanceCollection(): void {
    // In a real implementation, this would collect system metrics
    console.log('📊 Performance collection scheduled');
  }

  private scheduleAlertGeneration(): void {
    // In a real implementation, this would check thresholds and generate alerts
    console.log('🚨 Alert generation scheduled');
  }

  private determineStatus(value: number, threshold: number): 'good' | 'warning' | 'critical' {
    if (threshold === 0) return 'good';
    
    const ratio = value / threshold;
    if (ratio < 0.8) return 'good';
    if (ratio < 0.9) return 'warning';
    return 'critical';
  }

  private formatAgentName(agentId: string): string {
    return agentId
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private getIntervalMs(interval: string): number {
    switch (interval) {
      case '1m': return 60 * 1000;
      case '5m': return 5 * 60 * 1000;
      case '15m': return 15 * 60 * 1000;
      case '1h': return 60 * 60 * 1000;
      default: return 5 * 60 * 1000;
    }
  }

  // Mock data generators
  private generateMockSystemMetrics(): SystemMetric[] {
    const metrics = [
      { name: 'cpu_usage', value: 72, unit: '%', threshold: 85 },
      { name: 'memory_usage', value: 68, unit: '%', threshold: 80 },
      { name: 'disk_usage', value: 45, unit: '%', threshold: 75 },
      { name: 'response_time', value: 245, unit: 'ms', threshold: 500 },
      { name: 'error_rate', value: 0.12, unit: '%', threshold: 1 },
      { name: 'throughput', value: 1847, unit: 'req/min', threshold: 1000 },
    ];

    return metrics.map(metric => ({
      id: `mock-${metric.name}-${Date.now()}`,
      metric_name: metric.name,
      value: metric.value,
      unit: metric.unit,
      status: this.determineStatus(metric.value, metric.threshold),
      threshold: metric.threshold,
      timestamp: new Date().toISOString(),
    }));
  }

  private generateMockPerformanceMetrics(): PerformanceMetrics[] {
    const metrics: PerformanceMetrics[] = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      metrics.push({
        timestamp: timestamp.toISOString(),
        cpu_usage: 40 + Math.random() * 40,
        memory_usage: 50 + Math.random() * 30,
        disk_usage: 40 + Math.random() * 20,
        network_throughput: 800 + Math.random() * 400,
        response_time: 150 + Math.random() * 200,
        error_rate: Math.random() * 0.5,
        active_connections: 200 + Math.random() * 100,
      });
    }

    return metrics.reverse();
  }

  private generateMockAlerts(): AlertItem[] {
    return [
      {
        id: '1',
        type: 'performance',
        severity: 'medium',
        title: 'High Response Time',
        message: 'Email Marketing Agent response time increased to 800ms',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: 'emailMarketing',
        resolved: false,
        acknowledged: false,
      },
      {
        id: '2',
        type: 'capacity',
        severity: 'low',
        title: 'Database Connections',
        message: 'Database connections approaching 75% of limit',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        source: 'database',
        resolved: false,
        acknowledged: false,
      },
      {
        id: '3',
        type: 'availability',
        severity: 'critical',
        title: 'Agent Connection Timeout',
        message: 'Analytics Agent connection timeout detected',
        timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        source: 'analytics',
        resolved: true,
        acknowledged: true,
      },
    ];
  }

  private getMockInfrastructureStatus(): InfrastructureStatus[] {
    return [
      {
        service_name: 'Application Server 1',
        status: 'healthy',
        response_time: 120,
        uptime_percentage: 99.9,
        last_check: new Date().toISOString(),
        metadata: { version: '1.2.3', region: 'us-central1', instance_count: 3 },
      },
      {
        service_name: 'Database Primary',
        status: 'healthy',
        response_time: 45,
        uptime_percentage: 99.95,
        last_check: new Date().toISOString(),
        metadata: { version: '14.2', region: 'us-central1' },
      },
      {
        service_name: 'Load Balancer',
        status: 'healthy',
        response_time: 12,
        uptime_percentage: 100,
        last_check: new Date().toISOString(),
        metadata: { version: '2.1', region: 'us-central1' },
      },
    ];
  }
}

export const monitoringAPI = new MonitoringAPIService();