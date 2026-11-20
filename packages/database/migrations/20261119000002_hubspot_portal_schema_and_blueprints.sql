-- =========================================================================
-- HUBOVERSE PORTAL SCHEMA REGISTRY, WORKFLOW BLUEPRINTS & DEPLOYMENT AUDIT
-- Migration: 20261119000002_hubspot_portal_schema_and_blueprints.sql
-- =========================================================================

-- 1. Portal Schema Registry
CREATE TABLE IF NOT EXISTS hubspot_portal_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id TEXT NOT NULL UNIQUE,
  portal_name TEXT NOT NULL,
  schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata_version INT NOT NULL DEFAULT 1,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup by portal ID
CREATE INDEX IF NOT EXISTS idx_portal_schema_portal_id ON hubspot_portal_schema(portal_id);

-- 2. Workflow Blueprints (Multi-Turn Blueprint Store with Hash Integrity)
CREATE TABLE IF NOT EXISTS workflow_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('READY', 'NEEDS_CLARIFICATION', 'UNSUPPORTED_ACTION', 'UNSUPPORTED_PLAN')),
  blueprint_json JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  idempotency_hash TEXT NOT NULL,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_blueprints_portal ON workflow_blueprints(portal_id);
CREATE INDEX IF NOT EXISTS idx_workflow_blueprints_hash ON workflow_blueprints(idempotency_hash);

-- 3. Workflow Human Approvals Audit Trail
CREATE TABLE IF NOT EXISTS workflow_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES workflow_blueprints(id) ON DELETE CASCADE,
  approved_by_user_id UUID NOT NULL,
  approved_version INT NOT NULL,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- 4. Workflow Deployments & Read-Back Verification
CREATE TABLE IF NOT EXISTS workflow_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES workflow_blueprints(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  hubspot_workflow_id TEXT,
  status TEXT NOT NULL DEFAULT 'DEPLOYING',
  deep_link TEXT,
  readback_verified BOOLEAN NOT NULL DEFAULT false,
  verification_notes TEXT,
  error_message TEXT,
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_workflow_deployments_portal ON workflow_deployments(portal_id);
CREATE INDEX IF NOT EXISTS idx_workflow_deployments_idem ON workflow_deployments(idempotency_key);

-- 5. AI Token Usage & Cost Accounting
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  portal_id TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('CHAT', 'BUILD')),
  model_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  input_tokens INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  approx_cost_usd NUMERIC(8,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_org ON ai_usage(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage(created_at);
