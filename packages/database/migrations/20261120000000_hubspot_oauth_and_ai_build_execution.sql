-- =========================================================================
-- HUBOVERSE MULTI-TENANT HUBSPOT OAUTH & AI BUILD EXECUTION ENGINE
-- Migration: 20261120000000_hubspot_oauth_and_ai_build_execution.sql
-- =========================================================================

-- 1. EXTEND OR VERIFY HUBSPOT CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS hubspot_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  portal_name TEXT NOT NULL,
  hubspot_domain TEXT,
  installed_scopes TEXT[] NOT NULL DEFAULT '{}',
  hubs JSONB NOT NULL DEFAULT '{"Marketing":"Free","Sales":"Free","Service":"Free","Operations":"Free"}'::jsonb,
  status TEXT NOT NULL DEFAULT 'CONNECTED' CHECK (status IN ('CONNECTED', 'NEEDS_REAUTH', 'DISCONNECTED', 'REVOKED')),
  -- Encrypted OAuth Tokens (AES-256-GCM)
  encrypted_access_token TEXT NOT NULL,
  access_token_iv TEXT NOT NULL,
  access_token_auth_tag TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  refresh_token_iv TEXT,
  refresh_token_auth_tag TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_by_user_id TEXT NOT NULL,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, portal_id)
);

CREATE INDEX IF NOT EXISTS idx_hubspot_connections_org ON hubspot_connections(organization_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_connections_portal ON hubspot_connections(portal_id);

-- 2. HUBSPOT CONNECTION EVENTS (AUDIT TRAIL FOR TOKEN REFRESH, REVOCATIONS & RECONNECTS)
CREATE TABLE IF NOT EXISTS hubspot_connection_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES hubspot_connections(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('CONNECTED', 'TOKEN_REFRESHED', 'RECONNECTED', 'DISCONNECTED', 'REVOKED', 'SCOPES_UPDATED', 'SYNC_COMPLETED', 'SYNC_FAILED')),
  triggered_by_user_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conn_events_conn ON hubspot_connection_events(connection_id);
CREATE INDEX IF NOT EXISTS idx_conn_events_portal ON hubspot_connection_events(portal_id);

-- 3. AI BUILD REQUESTS (NATURAL LANGUAGE INTENTS)
CREATE TABLE IF NOT EXISTS ai_build_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'ANALYZING', 'PLAN_GENERATED', 'NEEDS_CLARIFICATION', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_build_requests_org ON ai_build_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_build_requests_portal ON ai_build_requests(portal_id);

-- 4. AI BUILD PLANS (DETERMINISTIC BLUEPRINTS GROUNDED IN SCHEMA)
CREATE TABLE IF NOT EXISTS ai_build_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES ai_build_requests(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  plan_version INT NOT NULL DEFAULT 1,
  blueprint_status TEXT NOT NULL CHECK (blueprint_status IN ('READY', 'NEEDS_CLARIFICATION', 'UNSUPPORTED_ACTION', 'UNSUPPORTED_PLAN')),
  blueprint_json JSONB NOT NULL,
  idempotency_hash TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  missing_dependencies TEXT[] NOT NULL DEFAULT '{}',
  risk_level TEXT NOT NULL DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_build_plans_org ON ai_build_plans(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_build_plans_portal ON ai_build_plans(portal_id);
CREATE INDEX IF NOT EXISTS idx_ai_build_plans_hash ON ai_build_plans(idempotency_hash);

-- 5. AI BUILD APPROVALS (EXPLICIT HUMAN APPROVAL TIED TO PLAN VERSION)
CREATE TABLE IF NOT EXISTS ai_build_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES ai_build_plans(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  approved_by_user_id TEXT NOT NULL,
  approved_plan_version INT NOT NULL,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  UNIQUE(plan_id, approved_plan_version)
);

CREATE INDEX IF NOT EXISTS idx_ai_build_approvals_plan ON ai_build_approvals(plan_id);

-- 6. AI EXECUTION JOBS (ATOMIC WORKFLOW & PROPERTY DEPLOYMENTS)
CREATE TABLE IF NOT EXISTS ai_execution_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES ai_build_plans(id) ON DELETE CASCADE,
  approval_id UUID NOT NULL REFERENCES ai_build_approvals(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATING', 'EXECUTING', 'SUCCESS', 'FAILED', 'ROLLED_BACK')),
  hubspot_workflow_id TEXT,
  deep_link TEXT,
  readback_verified BOOLEAN NOT NULL DEFAULT false,
  verification_notes TEXT,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_execution_jobs_portal ON ai_execution_jobs(portal_id);
CREATE INDEX IF NOT EXISTS idx_ai_execution_jobs_idem ON ai_execution_jobs(idempotency_key);

-- 7. AI EXECUTION STEPS (DETAILED STEP AUDIT & ROLLBACK DATA)
CREATE TABLE IF NOT EXISTS ai_execution_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES ai_execution_jobs(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  step_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_method TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_status INT,
  response_body JSONB,
  rollback_payload JSONB,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'SKIPPED')),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_execution_steps_job ON ai_execution_steps(job_id);

-- 8. AI AUDIT LOGS (IMMUTABLE ENTERPRISE COMPLIANCE TRAIL)
CREATE TABLE IF NOT EXISTS ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action_category TEXT NOT NULL CHECK (action_category IN ('OAUTH', 'SCHEMA_READ', 'CHAT_QUERY', 'PLAN_GENERATED', 'PLAN_APPROVED', 'PLAN_REJECTED', 'WORKFLOW_DEPLOYED', 'RECORD_CREATED', 'ROLLBACK_TRIGGERED')),
  action_details TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_org ON ai_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_portal ON ai_audit_logs(portal_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_created ON ai_audit_logs(created_at);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR MULTI-TENANT ISOLATION
-- =========================================================================
ALTER TABLE hubspot_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubspot_connection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_build_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_build_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_build_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_execution_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_logs ENABLE ROW LEVEL SECURITY;

-- Organization Isolation Helper (Allows service role or authenticated tenant members)
CREATE POLICY org_isolation_hubspot_connections ON hubspot_connections
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY org_isolation_ai_build_plans ON ai_build_plans
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY org_isolation_ai_execution_jobs ON ai_execution_jobs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY org_isolation_ai_audit_logs ON ai_audit_logs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );
