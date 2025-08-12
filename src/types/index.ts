// Core Agent System Types
export interface AgentEndpoint {
  url: string;
  apiType: 'GET' | 'POST';
  healthAction?: string;
  requiresDomain?: boolean;
  status?: 'missing' | 'active' | 'failed';
}

export interface AgentHealth {
  agent: string;
  status: 'healthy' | 'error' | 'missing' | 'unknown';
  healthy: boolean;
  timestamp: string;
  apiType: 'GET' | 'POST';
  error?: string;
  message?: string;
}

export interface SystemHealth {
  timestamp: string;
  totalAgents: number;
  healthyAgents: number;
  errorAgents: number;
  missingAgents: number;
  agents: AgentHealth[];
}

// Agent Categories for Organization
export type AgentCategory = 'lead-generation' | 'content-strategy' | 'intelligence' | 'technical';

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  capabilities: string[];
  endpoint: AgentEndpoint;
  health: AgentHealth;
  currentTasks?: Task[];
  performance: AgentPerformance;
  coordinationPoints: string[];
}

export interface Task {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
  output?: any;
}

export interface AgentPerformance {
  responseTime: number; // in milliseconds
  successRate: number; // percentage
  tasksCompleted: number;
  tasksFailed: number;
  utilizationRate: number; // percentage
  optimizationScore: number; // 0-100
  lastActivity: string;
  
  // Enhanced AI orchestration metrics
  resultsScore: number; // 0-100, weighted 60% - actual KPI performance
  alignmentScore: number; // 0-100, weighted 40% - prediction accuracy
  effectivenessScore: number; // Combined weighted score (results * 0.6 + alignment * 0.4)
  contributionMetrics: {
    leadsGenerated: number;
    conversionRate: number;
    roiContribution: number;
    goalAchievementRate: number;
  };
  learningMetrics: {
    predictionAccuracy: number; // How well agent predicts user decisions
    adaptationRate: number; // How quickly agent learns from feedback
    strategyEvolutionCount: number; // Number of strategy adjustments made
    improvementTrend: 'up' | 'down' | 'stable';
  };
}

// Business Metrics
export interface BusinessMetrics {
  leads: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: 'up' | 'down' | 'stable';
    quality: number; // 0-10 scale
  };
  conversion: {
    rate: number; // percentage
    trend: 'up' | 'down' | 'stable';
    attribution: Record<string, number>;
  };
  cost: {
    perLead: number;
    total: number;
    budget: number;
    efficiency: number; // percentage of budget used
  };
  revenue: {
    attributed: number;
    roi: number;
    trend: 'up' | 'down' | 'stable';
  };
}

// Enhanced Campaign & Orchestration Types
export interface CampaignGoal {
  id: string;
  type: 'leads_weekly' | 'leads_monthly' | 'revenue_target' | 'conversion_target';
  target: number;
  period: 'weekly' | 'monthly' | 'quarterly';
  currentProgress: number;
  achievement: number; // percentage of target achieved
}

export interface ChannelAllocation {
  channel: string;
  agentId: string;
  targetPercentage: number;
  actualPercentage: number;
  expectedContribution: number; // expected leads/conversions
  actualContribution: number;
  performance: number; // percentage of expected achieved
  lastOptimized: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'planned' | 'executing' | 'completed' | 'paused';
  
  // Enhanced orchestration features
  goals: CampaignGoal[];
  channelAllocations: ChannelAllocation[];
  orchestratingAgent: string; // Usually 'campaign'
  collaboratingAgents: string[];
  
  // Strategy and evolution tracking
  strategyEvolution: StrategyEvolution[];
  agentCoordination: AgentCoordination[];
  
  performance: CampaignPerformance;
  createdAt: string;
  duration: number; // in days
}

export interface StrategyEvolution {
  id: string;
  timestamp: string;
  type: 'allocation_change' | 'goal_adjustment' | 'agent_coordination' | 'optimization';
  description: string;
  initiatedBy: string; // agent ID
  changes: {
    before: any;
    after: any;
  };
  reasoning: string;
  expectedImpact: string;
  actualImpact?: {
    measured: boolean;
    performance: number;
    notes: string;
  };
}

export interface AgentCoordination {
  id: string;
  timestamp: string;
  primaryAgent: string;
  collaboratingAgent: string;
  purpose: 'strategy_consultation' | 'task_delegation' | 'resource_sharing' | 'performance_review';
  conversation: AgentMessage[];
  outcome: string;
  actionItems: AgentTask[];
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  from: string; // agent ID
  to: string; // agent ID
  type: 'request' | 'response' | 'update' | 'question';
  content: string;
  attachments?: {
    type: 'data' | 'strategy' | 'asset' | 'report';
    content: any;
  }[];
}

export interface AgentTask {
  id: string;
  assignedTo: string; // agent ID
  assignedBy: string; // agent ID
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedDelivery: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deliverables?: any;
}

export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  roi: number;
  ctr: number;
  conversionRate: number;
}

export interface ContentItem {
  id: string;
  type: 'email' | 'social' | 'blog' | 'ad' | 'seo';
  title: string;
  content: string;
  agentId: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  performance?: ContentPerformance;
  createdAt: string;
  publishedAt?: string;
}

export interface ContentPerformance {
  views: number;
  engagement: number;
  clicks: number;
  conversions: number;
  score: number; // 0-100 performance score
}

// EOS Integration Types
export interface EOSScorecard {
  metrics: EOSMetric[];
  overallHealth: 'green' | 'yellow' | 'red';
  lastUpdated: string;
}

export interface EOSMetric {
  name: string;
  target: number;
  actual: number;
  status: 'green' | 'yellow' | 'red';
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface EOSRock {
  id: string;
  title: string;
  owner: string; // agent or user
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  progress: number; // 0-100 percentage
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface EOSIssue {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  agentId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface EOSData {
  scorecard: EOSScorecard | null;
  rocks: EOSRock[];
  issues: EOSIssue[];
}

// Enhanced Real-time Activity & Intelligence Types  
export interface ActivityEvent {
  id: string;
  agentId: string;
  agentName: string;
  type: 'task_completed' | 'content_created' | 'metric_updated' | 'alert' | 'coordination' | 'strategy_evolution' | 'goal_progress' | 'channel_optimization';
  title: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  
  // Enhanced activity context
  campaignId?: string;
  channelId?: string;
  collaboratingAgents?: string[];
  impactScore: number; // 0-100, how significant this activity is
  category: 'execution' | 'strategy' | 'coordination' | 'optimization' | 'learning';
  
  data?: any;
}

export interface IntelligenceFeed {
  id: string;
  timestamp: string;
  type: 'insight' | 'recommendation' | 'alert' | 'learning' | 'strategy_update';
  source: 'agent' | 'system' | 'orchestrator';
  agentId?: string;
  content: {
    title: string;
    summary: string;
    details: string;
    confidence: number; // 0-100
    actionRequired: boolean;
    suggestedActions?: string[];
  };
  relatedData: {
    campaignId?: string;
    channelId?: string;
    metrics?: Record<string, number>;
    trends?: {
      direction: 'up' | 'down' | 'stable';
      magnitude: number;
      timeframe: string;
    };
  };
}

export interface AgentWorkspace {
  id: string;
  agentId: string;
  currentFocus: {
    primaryGoal: string;
    activeProjects: WorkspaceProject[];
    priorities: WorkspacePriority[];
  };
  workInProgress: {
    content: ContentItem[];
    campaigns: Campaign[];
    tasks: AgentTask[];
    collaborations: AgentCoordination[];
  };
  recentDecisions: {
    id: string;
    timestamp: string;
    decision: string;
    reasoning: string;
    expectedOutcome: string;
    actualOutcome?: string;
  }[];
  learningLog: {
    id: string;
    timestamp: string;
    type: 'success' | 'failure' | 'insight' | 'adaptation';
    description: string;
    metrics: Record<string, number>;
    applied: boolean;
  }[];
}

export interface WorkspaceProject {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  progress: number; // 0-100 percentage
  expectedCompletion: string;
  contributingGoal: string;
}

export interface WorkspacePriority {
  id: string;
  description: string;
  urgency: number; // 1-5 scale
  importance: number; // 1-5 scale
  deadline?: string;
  relatedCampaign?: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  agentId?: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

// Upload and Knowledge Management Types
export interface UploadedDocument {
  id: string;
  filename: string;
  type: 'brief' | 'guideline' | 'research' | 'persona' | 'strategy';
  uploadedBy: string;
  uploadedAt: string;
  distributedTo: string[]; // agent IDs
  status: 'processing' | 'distributed' | 'applied';
  extractedInfo?: any;
}

export interface LessonLearned {
  id: string;
  title: string;
  description: string;
  agentId: string;
  category: string;
  tags: string[];
  success: boolean;
  metrics: Record<string, number>;
  createdAt: string;
  applicable: boolean; // still relevant
}

// Dashboard State Types
export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  agents: string[];
  categories: AgentCategory[];
  metrics: string[];
}

export interface DashboardState {
  systemHealth: SystemHealth | null;
  businessMetrics: BusinessMetrics | null;
  agents: Agent[];
  campaigns: Campaign[];
  recentActivity: ActivityEvent[];
  alerts: Alert[];
  eosData: {
    scorecard: EOSScorecard | null;
    rocks: EOSRock[];
    issues: EOSIssue[];
  };
  filters: DashboardFilters;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface AgentApiResponse extends ApiResponse<any> {
  service?: string;
  status?: string;
  capabilities?: string[];
  insights?: any[];
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'executive' | 'manager' | 'analyst' | 'viewer';
  preferences: UserPreferences;
  createdAt: string;
  lastLogin: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: 'executive' | 'operational' | 'analytical';
  notifications: {
    email: boolean;
    browser: boolean;
    slack: boolean;
  };
  defaultFilters: Partial<DashboardFilters>;
}

// WebSocket Types for Real-time Updates
export interface WebSocketMessage {
  type: 'agent_update' | 'metric_update' | 'alert' | 'activity' | 'system_status';
  agentId?: string;
  data: any;
  timestamp: string;
}

export interface ConnectionStatus {
  connected: boolean;
  lastPing: string;
  reconnectAttempts: number;
  latency: number;
}

// Visual BI & Chart Component Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  category?: string;
  label?: string;
  metadata?: Record<string, any>;
}

export interface ChannelAllocationChart {
  channels: {
    id: string;
    name: string;
    agentId: string;
    target: number;
    actual: number;
    performance: number;
    color: string;
  }[];
  totalTarget: number;
  totalActual: number;
  overallPerformance: number;
}

export interface AttributionFlow {
  nodes: {
    id: string;
    name: string;
    type: 'source' | 'touchpoint' | 'conversion';
    value: number;
    agentId?: string;
  }[];
  links: {
    source: string;
    target: string;
    value: number;
    label?: string;
  }[];
}

export interface PerformanceTimeline {
  campaigns: {
    id: string;
    name: string;
    data: ChartDataPoint[];
    color: string;
  }[];
  goals: {
    type: 'target' | 'benchmark' | 'threshold';
    value: number;
    label: string;
    color: string;
  }[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface AgentCoordinationNetwork {
  agents: {
    id: string;
    name: string;
    category: AgentCategory;
    effectiveness: number;
    x?: number;
    y?: number;
    connections: number;
  }[];
  collaborations: {
    from: string;
    to: string;
    strength: number; // frequency and importance of collaboration
    type: 'strategy' | 'execution' | 'data' | 'feedback';
    recentActivity: number; // timestamp of last collaboration
  }[];
}

export interface ConversionFunnel {
  stages: {
    id: string;
    name: string;
    count: number;
    conversionRate: number;
    dropoffRate: number;
    agentContributions: {
      agentId: string;
      agentName: string;
      contribution: number; // percentage
      effectiveness: number;
    }[];
  }[];
  overallConversionRate: number;
  totalLeads: number;
  totalConversions: number;
}

export interface ROIWaterfallData {
  categories: {
    name: string;
    agentId?: string;
    channelId?: string;
    investment: number;
    revenue: number;
    roi: number;
    color: string;
  }[];
  totalInvestment: number;
  totalRevenue: number;
  overallROI: number;
}

// Enhanced Activity Item for real-time service compatibility
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  agentName: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  
  // Enhanced context
  category?: 'execution' | 'strategy' | 'coordination' | 'optimization' | 'learning';
  impactScore?: number;
  campaignId?: string;
  channelId?: string;
}