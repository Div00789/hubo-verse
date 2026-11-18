-- =========================================================================
-- HUBOVERSE MULTI-TENANT ENTERPRISE SCHEMA WITH ROW LEVEL SECURITY & PGVECTOR
-- Organization: HuboExperts
-- Target: Supabase PostgreSQL 16
-- =========================================================================

-- Enable core extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE platform_role AS ENUM (
  'PLATFORM_SUPER_ADMIN',
  'HUBOEXPERTS_OPS_ADMIN',
  'HUBSPOT_SPECIALIST',
  'INSTRUCTOR',
  'CLIENT_ORG_OWNER',
  'CLIENT_ORG_ADMIN',
  'CLIENT_TEAM_MEMBER',
  'STUDENT_LEARNER',
  'READ_ONLY_VIEWER'
);

CREATE TYPE subscription_tier AS ENUM ('STARTER', 'GROWTH', 'ENTERPRISE', 'AGENCY');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED');
CREATE TYPE connection_status AS ENUM ('CONNECTED', 'NEEDS_REAUTH', 'DISCONNECTED');
CREATE TYPE anna_mode AS ENUM ('CHAT', 'BUILD');
CREATE TYPE build_status AS ENUM (
  'ANALYZING',
  'CAPABILITY_VERIFIED',
  'AWAITING_APPROVAL',
  'APPROVED',
  'EXECUTING',
  'SUCCESS',
  'FAILED',
  'ROLLED_BACK'
);

-- 2. ORGANIZATIONS (Multi-Tenant Workspaces)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'STARTER',
  subscription_status subscription_status NOT NULL DEFAULT 'ACTIVE',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  max_seats INT NOT NULL DEFAULT 5,
  max_connected_portals INT NOT NULL DEFAULT 1,
  monthly_ai_token_allowance INT NOT NULL DEFAULT 500000,
  current_ai_token_usage INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ORGANIZATION MEMBERS (Role Matrix)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users(id)
  role platform_role NOT NULL DEFAULT 'CLIENT_TEAM_MEMBER',
  invited_by UUID,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 4. HUBSPOT PORTAL CONNECTIONS (AES-256 Encrypted Credential Vault)
CREATE TABLE hubspot_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  portal_name TEXT NOT NULL,
  hubspot_domain TEXT,
  installed_scopes TEXT[] NOT NULL DEFAULT '{}',
  hubs JSONB NOT NULL DEFAULT '{"Marketing":"Free","Sales":"Free","Service":"Free","Operations":"Free"}'::jsonb,
  status connection_status NOT NULL DEFAULT 'CONNECTED',
  -- Encrypted OAuth Tokens with AES-256-GCM
  encrypted_access_token TEXT NOT NULL,
  access_token_iv TEXT NOT NULL,
  access_token_auth_tag TEXT NOT NULL,
  encrypted_refresh_token TEXT NOT NULL,
  refresh_token_iv TEXT NOT NULL,
  refresh_token_auth_tag TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  connected_by_user_id UUID NOT NULL,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(organization_id, portal_id)
);

-- 5. ANNA CONVERSATIONS & MESSAGES
CREATE TABLE anna_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  hubspot_connection_id UUID REFERENCES hubspot_connections(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  mode anna_mode NOT NULL DEFAULT 'CHAT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE anna_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES anna_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('USER', 'ANNA', 'SYSTEM')),
  content TEXT NOT NULL,
  mode anna_mode NOT NULL DEFAULT 'CHAT',
  suggested_prompts TEXT[] DEFAULT '{}',
  citations JSONB DEFAULT '[]'::jsonb,
  tokens_used INT DEFAULT 0,
  feedback_rating TEXT CHECK (feedback_rating IN ('THUMBS_UP', 'THUMBS_DOWN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ANNA BUILD EXECUTIONS (Safe Execution Records & Audit)
CREATE TABLE anna_build_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES anna_conversations(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  hubspot_connection_id UUID NOT NULL REFERENCES hubspot_connections(id) ON DELETE CASCADE,
  initiated_by_user_id UUID NOT NULL,
  approved_by_user_id UUID,
  status build_status NOT NULL DEFAULT 'ANALYZING',
  goal TEXT NOT NULL,
  action_id TEXT NOT NULL,
  target_hubspot_object TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  diff_preview JSONB NOT NULL DEFAULT '[]'::jsonb,
  execution_result JSONB,
  rollback_snapshot JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. LEARNING ACADEMY (Courses, Modules, Live Classes)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor_id UUID,
  instructor_name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'INTERMEDIATE',
  hub_category TEXT NOT NULL,
  estimated_hours NUMERIC(4,1) NOT NULL DEFAULT 2.0,
  published BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.9,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  room_name TEXT NOT NULL,
  scheduled_start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  max_attendees INT NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  livekit_room_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. KNOWLEDGE BASE & PGVECTOR EMBEDDINGS (Hybrid RAG)
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for global academy docs
  source_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast Index for vector cosine similarity
CREATE INDEX ON knowledge_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Vector Similarity Search Function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_org_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  source_type text,
  content text,
  url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.title,
    k.source_type,
    k.content,
    k.url,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings k
  WHERE (k.organization_id IS NULL OR k.organization_id = filter_org_id)
    AND 1 - (k.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 9. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation per Tenant & Role
-- =========================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubspot_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE anna_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE anna_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE anna_build_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if authenticated user belongs to organization
CREATE OR REPLACE FUNCTION user_in_organization(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
$$;

-- RLS: Organizations
CREATE POLICY org_member_select ON organizations
  FOR SELECT USING (user_in_organization(id));

-- RLS: Organization Members
CREATE POLICY member_select ON organization_members
  FOR SELECT USING (user_in_organization(organization_id));

-- RLS: HubSpot Connections
CREATE POLICY hubspot_connections_isolation ON hubspot_connections
  FOR ALL USING (user_in_organization(organization_id));

-- RLS: Anna Conversations
CREATE POLICY anna_conversations_isolation ON anna_conversations
  FOR ALL USING (user_in_organization(organization_id));

-- RLS: Anna Messages
CREATE POLICY anna_messages_isolation ON anna_messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM anna_conversations WHERE user_in_organization(organization_id)
    )
  );

-- RLS: Anna Build Executions
CREATE POLICY anna_build_executions_isolation ON anna_build_executions
  FOR ALL USING (user_in_organization(organization_id));

-- RLS: Audit Logs
CREATE POLICY audit_logs_isolation ON audit_logs
  FOR SELECT USING (user_in_organization(organization_id));

-- RLS: Courses & Live Classes (Read open to authenticated users)
CREATE POLICY courses_read_all ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY live_classes_read_all ON live_classes FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- SEED DATA (INITIAL ENTERPRISE TENANT & ACADEMY COURSES)
-- =========================================================================
INSERT INTO organizations (id, name, slug, subscription_tier, subscription_status, max_seats, max_connected_portals, monthly_ai_token_allowance)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Acme Global Ventures',
  'acme-global',
  'ENTERPRISE',
  'ACTIVE',
  25,
  3,
  2000000
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (id, slug, title, description, instructor_name, level, hub_category, estimated_hours, published, rating)
VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'hubspot-enterprise-data-architecture',
  'Enterprise HubSpot Data Architecture & Custom Objects',
  'Architecting scalable schemas, relationship modeling, and custom object associations for high-volume B2B operations.',
  'Alex Thorne (HuboExperts Principal)',
  'ADVANCED',
  'Operations',
  4.5,
  true,
  4.96
),
(
  'c0000000-0000-0000-0000-000000000002',
  'revenue-attribution-and-lead-lifecycle',
  'Advanced Revenue Operations: Multi-Touch Lead Lifecycle',
  'Configure lifecycle stages, MQL-to-SQL automated velocity alerts, and multi-touch pipeline attribution in HubSpot.',
  'Elena Rostova (RevOps Architect)',
  'INTERMEDIATE',
  'Marketing',
  3.5,
  true,
  4.92
),
(
  'c0000000-0000-0000-0000-000000000003',
  'complex-workflow-logic-and-webhooks',
  'Complex Workflow Automation, Custom Code Actions & Webhooks',
  'Master webhook triggers, custom Node.js script actions in Operations Hub, and automated CRM error handling.',
  'Marcus Vance (Automation Lead)',
  'ADVANCED',
  'Operations',
  6.0,
  true,
  4.98
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO live_classes (id, title, description, instructor_name, room_name, scheduled_start_time, duration_minutes, max_attendees, status)
VALUES
(
  'l0000000-0000-0000-0000-000000000001',
  'Live Workshop: Designing Clean HubSpot Deal Pipelines with AI',
  'Join HuboExperts lead consultants live as we tear down and reconstruct lead scoring rules and deal stages.',
  'Alex Thorne & Anna AI',
  'huboverse-live-pipeline-masterclass',
  NOW() + INTERVAL '2 days',
  90,
  100,
  'SCHEDULED'
),
(
  'l0000000-0000-0000-0000-000000000002',
  'Weekly Office Hours: HubSpot Admin Q&A with LiveKit Studio',
  'Ask any question regarding workflow failures, property normalization, or Anna Build execution safely.',
  'Elena Rostova',
  'huboverse-office-hours',
  NOW() + INTERVAL '4 days',
  60,
  200,
  'SCHEDULED'
) ON CONFLICT (id) DO NOTHING;
