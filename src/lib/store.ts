// Re-export the dashboard store for backward compatibility
export { useDashboardStore } from '@/store/dashboard';

// Additional store utilities if needed
export const storeHelpers = {
  formatAgentData: (agentData: any) => ({
    ...agentData,
    performance: {
      ...agentData.performance,
      resultsScore: agentData.performance.resultsScore || 85,
      alignmentScore: agentData.performance.alignmentScore || 78,
      effectivenessScore: agentData.performance.effectivenessScore || 82,
      contributionMetrics: agentData.performance.contributionMetrics || {
        leadsGenerated: 0,
        conversionRate: 0,
        roiContribution: 0,
        goalAchievementRate: 0,
      },
      learningMetrics: agentData.performance.learningMetrics || {
        predictionAccuracy: 0,
        adaptationRate: 0,
        strategyEvolutionCount: 0,
        improvementTrend: 'stable' as const,
      },
    },
  }),
};