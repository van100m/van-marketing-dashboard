import { Agent, AgentHealth, AgentEndpoint, ApiResponse, AgentApiResponse } from '@/types';

// VAN Marketing Agent Suite - All 15 Agents Configuration
export const AGENT_ENDPOINTS: Record<string, AgentEndpoint> = {
  // GET-based agents (use query parameters)
  analytics: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/analyticsAgent',
    apiType: 'GET'
  },
  content: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/contentAgent',
    apiType: 'GET'
  },
  social: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/socialAgent',
    apiType: 'GET'
  },
  strategy: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/strategyAgent',
    apiType: 'GET'
  },
  marketIntelligence: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/marketIntelligenceAgent',
    apiType: 'GET'
  },
  internalInsights: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/internalInsightsAgent',
    apiType: 'GET'
  },
  campaign: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/campaignAgent',
    apiType: 'GET'
  },

  // POST-based agents (use JSON body)
  graphics: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/graphicsAgent',
    apiType: 'POST'
  },
  editor: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/editorAgent',
    apiType: 'POST'
  },
  retargeting: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/retargetingAgent',
    apiType: 'POST'
  },
  semrush: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/semrushAgent',
    apiType: 'POST',
    requiresDomain: true
  },
  dealerIntelligence: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/dealerIntelligenceAgent',
    apiType: 'POST'
  },
  emailMarketing: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/emailMarketingAgent',
    apiType: 'POST'
  },
  websiteSeo: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/websiteSeoAgent',
    apiType: 'POST',
    healthAction: 'check_health'
  },
  paidSocial: {
    url: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/paidSocialAgent',
    apiType: 'POST'
  }
};

// CMO Orchestrator endpoint
export const CMO_AGENT_URL = 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/cmoAgent';

// Agent metadata and categorization
export const AGENT_METADATA: Record<string, Omit<Agent, 'health' | 'performance' | 'currentTasks'>> = {
  // Lead Generation Core
  campaign: {
    id: 'campaign',
    name: 'Campaign Agent',
    category: 'lead-generation',
    description: 'Multi-channel campaign coordination and strategy execution',
    capabilities: [
      'campaign_strategy_creation',
      'multi_agent_coordination',
      'timeline_management',
      'performance_attribution',
      'cross_channel_optimization'
    ],
    endpoint: AGENT_ENDPOINTS.campaign,
    coordinationPoints: ['paidSocial', 'emailMarketing', 'content', 'social']
  },
  paidSocial: {
    id: 'paidSocial',
    name: 'Paid Social Agent',
    category: 'lead-generation',
    description: 'Cold audience acquisition and conversion campaigns',
    capabilities: [
      'cold_audience_targeting',
      'creative_generation',
      'budget_optimization',
      'platform_coordination',
      'performance_tracking',
      'lead_qualification'
    ],
    endpoint: AGENT_ENDPOINTS.paidSocial,
    coordinationPoints: ['graphics', 'campaign', 'retargeting']
  },
  emailMarketing: {
    id: 'emailMarketing',
    name: 'Email Marketing Agent',
    category: 'lead-generation',
    description: 'Automated email workflows and lead nurturing',
    capabilities: [
      'personalized_email_creation',
      'ab_testing_framework',
      'hubspot_workflow_integration',
      'dealer_segmentation',
      'performance_optimization'
    ],
    endpoint: AGENT_ENDPOINTS.emailMarketing,
    coordinationPoints: ['campaign', 'dealerIntelligence', 'content']
  },
  retargeting: {
    id: 'retargeting',
    name: 'Retargeting Agent',
    category: 'lead-generation',
    description: 'Re-engagement and conversion optimization',
    capabilities: [
      'audience_segmentation',
      'behavioral_targeting',
      'conversion_optimization',
      'cross_platform_retargeting'
    ],
    endpoint: AGENT_ENDPOINTS.retargeting,
    coordinationPoints: ['paidSocial', 'analytics', 'dealerIntelligence']
  },

  // Content & Strategy
  content: {
    id: 'content',
    name: 'Content Agent',
    category: 'content-strategy',
    description: 'Marketing content creation and optimization',
    capabilities: [
      'content_creation',
      'seo_optimization',
      'brand_alignment',
      'performance_tracking'
    ],
    endpoint: AGENT_ENDPOINTS.content,
    coordinationPoints: ['strategy', 'graphics', 'websiteSeo']
  },
  social: {
    id: 'social',
    name: 'Social Agent',
    category: 'content-strategy',
    description: 'Social media management and engagement',
    capabilities: [
      'social_media_posting',
      'engagement_tracking',
      'community_management',
      'brand_monitoring'
    ],
    endpoint: AGENT_ENDPOINTS.social,
    coordinationPoints: ['graphics', 'content', 'campaign']
  },
  strategy: {
    id: 'strategy',
    name: 'Strategy Agent',
    category: 'content-strategy',
    description: 'Marketing strategy and planning',
    capabilities: [
      'strategic_planning',
      'market_analysis',
      'competitive_intelligence',
      'opportunity_identification'
    ],
    endpoint: AGENT_ENDPOINTS.strategy,
    coordinationPoints: ['marketIntelligence', 'campaign', 'content']
  },
  graphics: {
    id: 'graphics',
    name: 'Graphics Agent',
    category: 'content-strategy',
    description: 'Visual content and design creation',
    capabilities: [
      'visual_content_creation',
      'brand_consistency',
      'multi_platform_optimization',
      'creative_testing'
    ],
    endpoint: AGENT_ENDPOINTS.graphics,
    coordinationPoints: ['paidSocial', 'social', 'content']
  },

  // Intelligence & Analytics
  analytics: {
    id: 'analytics',
    name: 'Analytics Agent',
    category: 'intelligence',
    description: 'Performance tracking and business intelligence',
    capabilities: [
      'performance_tracking',
      'conversion_analysis',
      'attribution_modeling',
      'predictive_analytics'
    ],
    endpoint: AGENT_ENDPOINTS.analytics,
    coordinationPoints: ['campaign', 'retargeting', 'internalInsights']
  },
  dealerIntelligence: {
    id: 'dealerIntelligence',
    name: 'Dealer Intelligence Agent',
    category: 'intelligence',
    description: 'Dealer behavior analysis and lead qualification',
    capabilities: [
      'content_validation',
      'dealer_behavior_analysis',
      'prediction_tracking',
      'graduated_autonomy'
    ],
    endpoint: AGENT_ENDPOINTS.dealerIntelligence,
    coordinationPoints: ['emailMarketing', 'retargeting', 'analytics']
  },
  marketIntelligence: {
    id: 'marketIntelligence',
    name: 'Market Intelligence Agent',
    category: 'intelligence',
    description: 'Market trends and competitive analysis',
    capabilities: [
      'market_trend_analysis',
      'competitive_intelligence',
      'opportunity_identification',
      'industry_insights'
    ],
    endpoint: AGENT_ENDPOINTS.marketIntelligence,
    coordinationPoints: ['strategy', 'semrush', 'analytics']
  },
  internalInsights: {
    id: 'internalInsights',
    name: 'Internal Insights Agent',
    category: 'intelligence',
    description: 'Internal performance metrics and optimization',
    capabilities: [
      'system_performance_monitoring',
      'lead_quality_analysis',
      'agent_utilization_tracking',
      'cost_optimization_insights',
      'internal_metrics_aggregation'
    ],
    endpoint: AGENT_ENDPOINTS.internalInsights,
    coordinationPoints: ['analytics', 'campaign', 'dealerIntelligence']
  },

  // Technical & Operations
  editor: {
    id: 'editor',
    name: 'Editor Agent',
    category: 'technical',
    description: 'Content editing and quality assurance',
    capabilities: [
      'content_editing',
      'quality_assurance',
      'brand_compliance',
      'publishing_workflow'
    ],
    endpoint: AGENT_ENDPOINTS.editor,
    coordinationPoints: ['content', 'emailMarketing', 'social']
  },
  websiteSeo: {
    id: 'websiteSeo',
    name: 'Website SEO Agent',
    category: 'technical',
    description: 'SEO monitoring and website optimization',
    capabilities: [
      'seo_monitoring',
      'technical_optimization',
      'keyword_tracking',
      'site_health_analysis'
    ],
    endpoint: AGENT_ENDPOINTS.websiteSeo,
    coordinationPoints: ['content', 'semrush', 'analytics']
  },
  semrush: {
    id: 'semrush',
    name: 'SEMRush Agent',
    category: 'technical',
    description: 'SEO insights and competitive analysis',
    capabilities: [
      'keyword_research',
      'competitive_analysis',
      'ranking_tracking',
      'seo_optimization'
    ],
    endpoint: AGENT_ENDPOINTS.semrush,
    coordinationPoints: ['websiteSeo', 'content', 'marketIntelligence']
  }
};

export class AgentApiClient {
  private baseDelay = 1000; // 1 second
  private maxRetries = 3;

  async callAgent(
    agentId: string,
    action: string = 'health',
    params: Record<string, any> = {}
  ): Promise<AgentApiResponse> {
    const endpoint = AGENT_ENDPOINTS[agentId];
    if (!endpoint) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    try {
      let response: Response;
      const timeoutController = new AbortController();
      const timeout = setTimeout(() => timeoutController.abort(), 30000); // 30 second timeout

      try {
        if (endpoint.apiType === 'GET') {
          const queryParams = new URLSearchParams({ action, ...params });
          response = await fetch(`${endpoint.url}?${queryParams}`, {
            method: 'GET',
            signal: timeoutController.signal,
            headers: {
              'User-Agent': 'VAN-Dashboard/1.0',
            },
          });
        } else {
          const payload: Record<string, any> = { action, ...params };
          
          // Special handling for specific agents
          if (endpoint.requiresDomain) {
            payload.domain = 'buywithvan.com';
            if (action === 'health') {
              payload.action = 'insights'; // SEMRush doesn't have health endpoint
            }
          }
          
          if (endpoint.healthAction && action === 'health') {
            payload.action = endpoint.healthAction;
          }

          response = await fetch(endpoint.url, {
            method: 'POST',
            signal: timeoutController.signal,
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'VAN-Dashboard/1.0',
            },
            body: JSON.stringify(payload),
          });
        }
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
        service: data.service || `${agentId} Agent`,
        status: data.status || (data.success ? 'healthy' : 'unknown'),
        capabilities: data.capabilities || [],
        insights: data.insights || data.data || []
      };

    } catch (error) {
      console.error(`Agent API call failed for ${agentId}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAllAgentsHealth(): Promise<{ 
    systemHealth: any;
    individualHealth: Record<string, AgentApiResponse>;
  }> {
    try {
      // Get system health from CMO orchestrator
      const cmoResponse = await fetch(`${CMO_AGENT_URL}?action=agents`, {
        method: 'GET',
        headers: {
          'User-Agent': 'VAN-Dashboard/1.0',
        },
      });

      if (!cmoResponse.ok) {
        throw new Error(`CMO health check failed: ${cmoResponse.statusText}`);
      }

      const systemHealth = await cmoResponse.json();

      // Also get individual agent responses for detailed data
      const individualHealthPromises = Object.keys(AGENT_ENDPOINTS).map(async (agentId) => {
        const result = await this.callAgent(agentId, 'health');
        return [agentId, result] as [string, AgentApiResponse];
      });

      const individualHealthResults = await Promise.allSettled(individualHealthPromises);
      const individualHealth: Record<string, AgentApiResponse> = {};

      individualHealthResults.forEach((result, index) => {
        const agentId = Object.keys(AGENT_ENDPOINTS)[index];
        if (result.status === 'fulfilled') {
          individualHealth[result.value[0]] = result.value[1];
        } else {
          individualHealth[agentId] = {
            success: false,
            error: result.reason?.message || 'Failed to fetch',
            timestamp: new Date().toISOString(),
          };
        }
      });

      return {
        systemHealth,
        individualHealth,
      };

    } catch (error) {
      console.error('Failed to get system health:', error);
      
      // Fallback to individual agent calls if CMO is down
      const individualHealthPromises = Object.keys(AGENT_ENDPOINTS).map(async (agentId) => {
        const result = await this.callAgent(agentId, 'health');
        return [agentId, result] as [string, AgentApiResponse];
      });

      const individualHealthResults = await Promise.allSettled(individualHealthPromises);
      const individualHealth: Record<string, AgentApiResponse> = {};
      let healthyCount = 0;

      individualHealthResults.forEach((result, index) => {
        const agentId = Object.keys(AGENT_ENDPOINTS)[index];
        if (result.status === 'fulfilled') {
          individualHealth[result.value[0]] = result.value[1];
          if (result.value[1].success) healthyCount++;
        } else {
          individualHealth[agentId] = {
            success: false,
            error: result.reason?.message || 'Failed to fetch',
            timestamp: new Date().toISOString(),
          };
        }
      });

      // Create synthetic system health
      const systemHealth = {
        timestamp: new Date().toISOString(),
        totalAgents: Object.keys(AGENT_ENDPOINTS).length,
        healthyAgents: healthyCount,
        errorAgents: Object.keys(AGENT_ENDPOINTS).length - healthyCount,
        missingAgents: 0,
        agents: Object.entries(individualHealth).map(([agentId, health]) => ({
          agent: agentId,
          status: health.success ? 'healthy' : 'error',
          healthy: health.success,
          timestamp: health.timestamp,
          error: health.error,
          apiType: AGENT_ENDPOINTS[agentId].apiType,
        })),
      };

      return {
        systemHealth,
        individualHealth,
      };
    }
  }

  async getAgentInsights(agentId: string): Promise<AgentApiResponse> {
    return this.callAgent(agentId, 'insights');
  }

  async requestDailyStandup(): Promise<AgentApiResponse> {
    try {
      const response = await fetch(CMO_AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'VAN-Dashboard/1.0',
        },
        body: JSON.stringify({ action: 'standup' }),
      });

      if (!response.ok) {
        throw new Error(`Standup request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Standup generation failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
export const agentApi = new AgentApiClient();