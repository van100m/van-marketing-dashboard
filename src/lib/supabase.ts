import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database table names
export const TABLES = {
  DASHBOARD_METRICS: 'dashboard_metrics',
  AGENT_HEALTH: 'agent_health',
  BUSINESS_METRICS: 'business_metrics',
  CAMPAIGNS: 'campaigns',
  CONTENT_ITEMS: 'content_items',
  ACTIVITY_EVENTS: 'activity_events',
  ALERTS: 'alerts',
  EOS_SCORECARD: 'eos_scorecard',
  EOS_ROCKS: 'eos_rocks',
  EOS_ISSUES: 'eos_issues',
  LESSONS_LEARNED: 'lessons_learned',
  UPLOADED_DOCUMENTS: 'uploaded_documents',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Real-time subscription channels
export const CHANNELS = {
  AGENT_UPDATES: 'agent_updates',
  BUSINESS_METRICS: 'business_metrics',
  ALERTS: 'alerts',
  ACTIVITY_FEED: 'activity_feed',
} as const;