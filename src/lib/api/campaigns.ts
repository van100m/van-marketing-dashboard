import { supabase, TABLES } from '@/lib/supabase';
import { agentApi } from '@/lib/agents';

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'paid-social' | 'google-ads' | 'email' | 'content' | 'display';
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  leads: number;
  conversions: number;
  roi: number;
  ctr: number;
  cpc: number;
  agent_id: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    target_audience?: string;
    platforms?: string[];
    objectives?: string[];
    creative_assets?: string[];
  };
}

export interface CampaignMetrics {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  leads: number;
  ctr: number;
  cpc: number;
  roas: number;
}

export interface CampaignCreateInput {
  name: string;
  type: Campaign['type'];
  budget: number;
  start_date: string;
  end_date: string;
  agent_id: string;
  metadata?: Campaign['metadata'];
}

export interface CampaignMetricsUpdate {
  spent?: number;
  leads?: number;
  conversions?: number;
  roi?: number;
  ctr?: number;
  cpc?: number;
}

export interface CampaignUpdateInput extends Partial<CampaignCreateInput>, CampaignMetricsUpdate {
  status?: Campaign['status'];
}

class CampaignAPIService {
  // Campaign CRUD operations
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CAMPAIGNS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Fallback to agent-based campaign data
      return this.getCampaignsFromAgents();
    }
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CAMPAIGNS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  async createCampaign(input: CampaignCreateInput): Promise<Campaign> {
    try {
      const campaignData = {
        ...input,
        status: 'draft' as const,
        spent: 0,
        leads: 0,
        conversions: 0,
        roi: 0,
        ctr: 0,
        cpc: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.CAMPAIGNS)
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;

      // Notify relevant agent about new campaign
      await this.notifyAgentOfCampaign(input.agent_id, 'campaign_created', data);

      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, input: CampaignUpdateInput): Promise<Campaign> {
    try {
      const updateData = {
        ...input,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.CAMPAIGNS)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Notify relevant agent about campaign update
      if (input.agent_id) {
        await this.notifyAgentOfCampaign(input.agent_id, 'campaign_updated', data);
      }

      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.CAMPAIGNS)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  // Campaign status management
  async pauseCampaign(id: string): Promise<Campaign> {
    return this.updateCampaign(id, { status: 'paused' });
  }

  async activateCampaign(id: string): Promise<Campaign> {
    return this.updateCampaign(id, { status: 'active' });
  }

  async completeCampaign(id: string): Promise<Campaign> {
    return this.updateCampaign(id, { status: 'completed' });
  }

  // Campaign metrics and analytics
  async getCampaignMetrics(
    campaignId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CampaignMetrics[]> {
    try {
      let query = supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('date', { ascending: true });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching campaign metrics:', error);
      // Generate mock metrics for demonstration
      return this.generateMockMetrics(campaignId, startDate, endDate);
    }
  }

  async updateCampaignMetrics(campaignId: string): Promise<void> {
    try {
      // Get real-time metrics from relevant agent
      const campaign = await this.getCampaignById(campaignId);
      if (!campaign) return;

      const agentResponse = await agentApi.callAgent(campaign.agent_id, 'campaign_metrics', {
        campaign_id: campaignId
      });

      if (agentResponse.success && agentResponse.data) {
        // Update campaign with latest metrics
        await this.updateCampaign(campaignId, {
          spent: agentResponse.data.spent || campaign.spent,
          leads: agentResponse.data.leads || campaign.leads,
          conversions: agentResponse.data.conversions || campaign.conversions,
          roi: agentResponse.data.roi || campaign.roi,
          ctr: agentResponse.data.ctr || campaign.ctr,
          cpc: agentResponse.data.cpc || campaign.cpc,
        });

        // Store daily metrics
        const todayMetrics: CampaignMetrics = {
          campaign_id: campaignId,
          date: new Date().toISOString().split('T')[0],
          impressions: agentResponse.data.impressions || 0,
          clicks: agentResponse.data.clicks || 0,
          conversions: agentResponse.data.conversions || 0,
          spend: agentResponse.data.spent || 0,
          revenue: agentResponse.data.revenue || 0,
          leads: agentResponse.data.leads || 0,
          ctr: agentResponse.data.ctr || 0,
          cpc: agentResponse.data.cpc || 0,
          roas: agentResponse.data.roas || 0,
        };

        await supabase
          .from('campaign_metrics')
          .upsert(todayMetrics, { onConflict: 'campaign_id,date' });
      }
    } catch (error) {
      console.error('Error updating campaign metrics:', error);
    }
  }

  // Campaign performance aggregation
  async getCampaignPerformanceSummary(): Promise<{
    totalBudget: number;
    totalSpent: number;
    totalLeads: number;
    totalConversions: number;
    avgROI: number;
    campaignCount: number;
    activeCampaigns: number;
  }> {
    try {
      const campaigns = await this.getAllCampaigns();
      
      const summary = campaigns.reduce((acc, campaign) => ({
        totalBudget: acc.totalBudget + campaign.budget,
        totalSpent: acc.totalSpent + campaign.spent,
        totalLeads: acc.totalLeads + campaign.leads,
        totalConversions: acc.totalConversions + campaign.conversions,
        avgROI: acc.avgROI + campaign.roi,
        campaignCount: acc.campaignCount + 1,
        activeCampaigns: acc.activeCampaigns + (campaign.status === 'active' ? 1 : 0),
      }), {
        totalBudget: 0,
        totalSpent: 0,
        totalLeads: 0,
        totalConversions: 0,
        avgROI: 0,
        campaignCount: 0,
        activeCampaigns: 0,
      });

      summary.avgROI = summary.campaignCount > 0 ? summary.avgROI / summary.campaignCount : 0;

      return summary;
    } catch (error) {
      console.error('Error getting campaign performance summary:', error);
      throw error;
    }
  }

  // Real-time campaign updates via agent coordination
  private async notifyAgentOfCampaign(agentId: string, action: string, campaign: Campaign): Promise<void> {
    try {
      await agentApi.callAgent(agentId, action, {
        campaign_id: campaign.id,
        campaign_data: campaign,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error notifying agent ${agentId} of ${action}:`, error);
    }
  }

  // Fallback methods for when Supabase is unavailable
  private async getCampaignsFromAgents(): Promise<Campaign[]> {
    try {
      // Get campaign data from Campaign Agent
      const response = await agentApi.callAgent('campaign', 'campaigns');
      
      if (response.success && response.data?.campaigns) {
        return response.data.campaigns.map((campaign: any) => ({
          id: campaign.id || `agent-${Date.now()}`,
          name: campaign.name || 'Untitled Campaign',
          status: campaign.status || 'active',
          type: campaign.type || 'paid-social',
          budget: campaign.budget || 0,
          spent: campaign.spent || 0,
          start_date: campaign.startDate || new Date().toISOString(),
          end_date: campaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          leads: campaign.leads || 0,
          conversions: campaign.conversions || 0,
          roi: campaign.roi || 0,
          ctr: campaign.ctr || 0,
          cpc: campaign.cpc || 0,
          agent_id: 'campaign',
          created_at: campaign.createdAt || new Date().toISOString(),
          updated_at: campaign.updatedAt || new Date().toISOString(),
          metadata: campaign.metadata || {},
        }));
      }
    } catch (error) {
      console.error('Error getting campaigns from agents:', error);
    }

    // Return empty array if all fails
    return [];
  }

  private generateMockMetrics(campaignId: string, startDate?: string, endDate?: string): CampaignMetrics[] {
    const metrics: CampaignMetrics[] = [];
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      metrics.push({
        campaign_id: campaignId,
        date: d.toISOString().split('T')[0],
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 500) + 50,
        conversions: Math.floor(Math.random() * 50) + 5,
        spend: Math.floor(Math.random() * 1000) + 100,
        revenue: Math.floor(Math.random() * 5000) + 500,
        leads: Math.floor(Math.random() * 30) + 3,
        ctr: Math.random() * 5 + 1,
        cpc: Math.random() * 3 + 0.5,
        roas: Math.random() * 4 + 1,
      });
    }

    return metrics;
  }
}

export const campaignAPI = new CampaignAPIService();