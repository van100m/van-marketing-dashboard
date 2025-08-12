import { agentApi } from './agents';
import { Agent, AgentHealth, SystemHealth, BusinessMetrics, EOSData, ActivityItem, Alert } from '@/types';

export type RealtimeEventType = 
  | 'system-health-update'
  | 'agent-health-update' 
  | 'business-metrics-update'
  | 'activity-update'
  | 'alert-update'
  | 'eos-update'
  | 'connection-status';

export interface RealtimeEvent {
  type: RealtimeEventType;
  data: any;
  timestamp: string;
  agentId?: string;
}

export type RealtimeEventHandler = (event: RealtimeEvent) => void;

export class RealtimeService {
  private eventHandlers = new Map<RealtimeEventType, Set<RealtimeEventHandler>>();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private intervals = new Map<string, NodeJS.Timeout>();
  
  // Real-time polling intervals (much faster than 30s)
  private readonly SYSTEM_HEALTH_INTERVAL = 5000;  // 5 seconds
  private readonly AGENT_HEALTH_INTERVAL = 10000; // 10 seconds  
  private readonly BUSINESS_METRICS_INTERVAL = 15000; // 15 seconds
  private readonly ACTIVITY_INTERVAL = 3000; // 3 seconds for activity feed
  
  // Data caching for change detection
  private cache = new Map<string, any>();
  private lastUpdate = new Map<string, string>();

  constructor() {
    this.setupEventTarget();
  }

  private setupEventTarget() {
    // Create a custom event target for WebSocket-like events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.disconnect();
      });
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🚀 Connecting to VAN Real-time Intelligence Network...');
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Start all polling intervals
      this.startSystemHealthPolling();
      this.startAgentHealthPolling();
      this.startBusinessMetricsPolling();
      this.startActivityPolling();
      
      // Emit connection status
      this.emit({
        type: 'connection-status',
        data: { connected: true, timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString()
      });

      console.log('✅ Connected to real-time intelligence network');
      resolve();
    });
  }

  disconnect() {
    console.log('🔌 Disconnecting from real-time network...');
    
    this.isConnected = false;
    
    // Clear all intervals
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    
    // Clear cache
    this.cache.clear();
    this.lastUpdate.clear();
    
    // Emit disconnection status
    this.emit({
      type: 'connection-status',
      data: { connected: false, timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    });
    
    console.log('❌ Disconnected from real-time network');
  }

  private startSystemHealthPolling() {
    const pollSystemHealth = async () => {
      if (!this.isConnected) return;
      
      try {
        const { systemHealth } = await agentApi.getAllAgentsHealth();
        
        // Check if data has changed
        const cacheKey = 'system-health';
        const cached = this.cache.get(cacheKey);
        const currentHash = this.hashObject(systemHealth);
        const cachedHash = cached ? this.hashObject(cached) : null;
        
        if (currentHash !== cachedHash) {
          this.cache.set(cacheKey, systemHealth);
          this.lastUpdate.set(cacheKey, new Date().toISOString());
          
          this.emit({
            type: 'system-health-update',
            data: systemHealth,
            timestamp: new Date().toISOString()
          });
          
          console.log('📊 System health updated:', {
            healthy: systemHealth.healthyAgents,
            total: systemHealth.totalAgents
          });
        }
      } catch (error) {
        console.error('❌ System health polling error:', error);
        this.handleConnectionError();
      }
    };

    // Initial call
    pollSystemHealth();
    
    // Set up interval
    const interval = setInterval(pollSystemHealth, this.SYSTEM_HEALTH_INTERVAL);
    this.intervals.set('system-health', interval);
  }

  private startAgentHealthPolling() {
    const pollAgentHealth = async () => {
      if (!this.isConnected) return;
      
      try {
        const { individualHealth } = await agentApi.getAllAgentsHealth();
        
        // Check each agent individually for changes
        Object.entries(individualHealth).forEach(([agentId, health]) => {
          const cacheKey = `agent-${agentId}`;
          const cached = this.cache.get(cacheKey);
          const currentHash = this.hashObject(health);
          const cachedHash = cached ? this.hashObject(cached) : null;
          
          if (currentHash !== cachedHash) {
            this.cache.set(cacheKey, health);
            this.lastUpdate.set(cacheKey, new Date().toISOString());
            
            this.emit({
              type: 'agent-health-update',
              data: health,
              timestamp: new Date().toISOString(),
              agentId
            });
            
            console.log(`🔧 Agent ${agentId} health updated:`, health.success ? '✅' : '❌');
          }
        });
      } catch (error) {
        console.error('❌ Agent health polling error:', error);
        this.handleConnectionError();
      }
    };

    // Initial call
    pollAgentHealth();
    
    // Set up interval
    const interval = setInterval(pollAgentHealth, this.AGENT_HEALTH_INTERVAL);
    this.intervals.set('agent-health', interval);
  }

  private startBusinessMetricsPolling() {
    const pollBusinessMetrics = async () => {
      if (!this.isConnected) return;
      
      try {
        // Generate mock business metrics with realistic fluctuations
        const metrics: BusinessMetrics = await this.generateBusinessMetrics();
        
        const cacheKey = 'business-metrics';
        const cached = this.cache.get(cacheKey);
        const currentHash = this.hashObject(metrics);
        const cachedHash = cached ? this.hashObject(cached) : null;
        
        if (currentHash !== cachedHash) {
          this.cache.set(cacheKey, metrics);
          this.lastUpdate.set(cacheKey, new Date().toISOString());
          
          this.emit({
            type: 'business-metrics-update',
            data: metrics,
            timestamp: new Date().toISOString()
          });
          
          console.log('📈 Business metrics updated:', {
            leads: metrics.leads.today,
            costPerLead: metrics.cost.perLead,
            roi: metrics.revenue.roi
          });
        }
      } catch (error) {
        console.error('❌ Business metrics polling error:', error);
      }
    };

    // Initial call
    pollBusinessMetrics();
    
    // Set up interval
    const interval = setInterval(pollBusinessMetrics, this.BUSINESS_METRICS_INTERVAL);
    this.intervals.set('business-metrics', interval);
  }

  private startActivityPolling() {
    const pollActivity = async () => {
      if (!this.isConnected) return;
      
      try {
        // Generate realistic activity feed
        const activities = await this.generateActivityFeed();
        
        const cacheKey = 'activity-feed';
        const cached = this.cache.get(cacheKey) || [];
        
        // Check for new activities
        const newActivities = activities.filter(activity => 
          !cached.some((cached: ActivityItem) => cached.id === activity.id)
        );
        
        if (newActivities.length > 0) {
          this.cache.set(cacheKey, activities);
          this.lastUpdate.set(cacheKey, new Date().toISOString());
          
          this.emit({
            type: 'activity-update',
            data: activities,
            timestamp: new Date().toISOString()
          });
          
          console.log(`📢 ${newActivities.length} new activities detected`);
          
          // Generate alerts for high-priority activities
          const alerts = newActivities
            .filter(activity => activity.priority === 'high')
            .map(activity => this.createAlertFromActivity(activity));
            
          if (alerts.length > 0) {
            this.emit({
              type: 'alert-update',
              data: alerts,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('❌ Activity polling error:', error);
      }
    };

    // Initial call
    pollActivity();
    
    // Set up interval
    const interval = setInterval(pollActivity, this.ACTIVITY_INTERVAL);
    this.intervals.set('activity', interval);
  }

  private async generateBusinessMetrics(): Promise<BusinessMetrics> {
    // Generate realistic fluctuating metrics
    const now = Date.now();
    const seed = Math.floor(now / (1000 * 60 * 5)); // Changes every 5 minutes
    const random = this.seededRandom(seed);
    
    const baseLeads = 450;
    const leadVariation = Math.floor(random() * 100) - 50;
    const leadsToday = Math.max(0, baseLeads + leadVariation);
    
    const baseCostPerLead = 85;
    const costVariation = (random() - 0.5) * 20;
    const costPerLead = Math.max(10, baseCostPerLead + costVariation);
    
    const baseConversionRate = 12.5;
    const conversionVariation = (random() - 0.5) * 3;
    const conversionRate = Math.max(5, Math.min(25, baseConversionRate + conversionVariation));
    
    return {
      leads: {
        today: leadsToday,
        thisWeek: leadsToday * 6 + Math.floor(random() * 200),
        thisMonth: leadsToday * 25 + Math.floor(random() * 800),
        trend: random() > 0.6 ? 'up' : random() > 0.3 ? 'stable' : 'down',
        quality: Math.floor(random() * 3 + 7) // 7-10 scale
      },
      cost: {
        perLead: costPerLead,
        total: costPerLead * leadsToday,
        budget: 50000,
        efficiency: Math.floor(random() * 20 + 70) // 70-90% efficiency
      },
      conversion: {
        rate: conversionRate,
        trend: random() > 0.5 ? 'up' : 'stable',
        attribution: {
          'paid_search': 40,
          'social_media': 25,
          'content_marketing': 20,
          'email_campaigns': 15
        }
      },
      revenue: {
        attributed: Math.floor(leadsToday * (conversionRate / 100) * 45000), // Avg car sale
        roi: Math.max(1, (45000 * conversionRate / 100) / costPerLead),
        trend: random() > 0.6 ? 'up' : 'stable'
      }
    };
  }

  private async generateActivityFeed(): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];
    const now = new Date();
    
    // Generate recent activities with realistic agent actions
    const agentActions = [
      { agent: 'Campaign Agent', action: 'New lead generation campaign deployed', priority: 'high' as const },
      { agent: 'Analytics Agent', action: 'Performance report generated', priority: 'medium' as const },
      { agent: 'Email Marketing Agent', action: 'Nurture sequence optimized', priority: 'medium' as const },
      { agent: 'Paid Social Agent', action: 'Cold audience campaign launched', priority: 'high' as const },
      { agent: 'SEO Agent', action: 'Keyword rankings updated', priority: 'low' as const },
      { agent: 'Content Agent', action: 'New blog post published', priority: 'medium' as const },
      { agent: 'Retargeting Agent', action: 'Audience segment created', priority: 'medium' as const },
      { agent: 'Graphics Agent', action: 'Creative assets generated', priority: 'low' as const }
    ];

    const seed = Math.floor(now.getTime() / (1000 * 60)); // New activities every minute
    const random = this.seededRandom(seed);
    
    // Generate 3-8 activities
    const numActivities = 3 + Math.floor(random() * 6);
    
    for (let i = 0; i < numActivities; i++) {
      const actionIndex = Math.floor(random() * agentActions.length);
      const action = agentActions[actionIndex];
      
      const timestamp = new Date(now.getTime() - (i * 2 * 60 * 1000)); // 2 minutes apart
      
      activities.push({
        id: `activity-${seed}-${i}`,
        title: action.action,
        description: `${action.agent} completed: ${action.action.toLowerCase()}`,
        agentName: action.agent,
        priority: action.priority,
        timestamp: timestamp.toISOString()
      });
    }
    
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private createAlertFromActivity(activity: ActivityItem): Alert {
    return {
      id: `alert-${activity.id}`,
      type: activity.priority === 'high' ? 'warning' : 'info',
      title: `${activity.agentName} Alert`,
      message: activity.description,
      timestamp: activity.timestamp,
      acknowledged: false
    };
  }

  private handleConnectionError() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached, giving up');
      this.disconnect();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Connection error, attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  private hashObject(obj: any): string {
    return JSON.stringify(obj);
  }

  private seededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % (2 ** 32);
      return state / (2 ** 32);
    };
  }

  private emit(event: RealtimeEvent) {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      });
    }
  }

  // Public API methods
  on(eventType: RealtimeEventType, handler: RealtimeEventHandler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
    
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  off(eventType: RealtimeEventType, handler: RealtimeEventHandler) {
    this.eventHandlers.get(eventType)?.delete(handler);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getLastUpdate(dataType: string): string | undefined {
    return this.lastUpdate.get(dataType);
  }

  // Force refresh specific data types
  async forceRefresh(dataType?: string) {
    if (dataType) {
      switch (dataType) {
        case 'system-health':
          await this.startSystemHealthPolling();
          break;
        case 'business-metrics':
          await this.startBusinessMetricsPolling();
          break;
        case 'activity':
          await this.startActivityPolling();
          break;
      }
    } else {
      // Refresh all
      this.startSystemHealthPolling();
      this.startAgentHealthPolling(); 
      this.startBusinessMetricsPolling();
      this.startActivityPolling();
    }
  }
}

// Create singleton instance
export const realtimeService = new RealtimeService();