-- =========================================================================
-- HUBOVERSE HUBSPOT MCP SERVER INTEGRATION & PORTAL HEALTH ANALYSES
-- Migration: 20261120000001_hubspot_mcp_and_portal_analyses.sql
-- =========================================================================

-- 1. AI PORTAL ANALYSES (EVIDENCE-BACKED CRM, SALES, MARKETING & AUTOMATION HEALTH)
CREATE TABLE IF NOT EXISTS ai_portal_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES hubspot_connections(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  analysis_type TEXT NOT NULL DEFAULT 'COMPREHENSIVE' CHECK (analysis_type IN ('COMPREHENSIVE', 'SALES_HEALTH', 'MARKETING_HEALTH', 'DATA_QUALITY', 'AUTOMATION')),
  status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_portal_analyses_org ON ai_portal_analyses(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_portal_analyses_portal ON ai_portal_analyses(portal_id);

-- 2. AI EXECUTION LOGS (IMMUTABLE MCP TOOL CALL & BUILD AUDIT LOGS)
CREATE TABLE IF NOT EXISTS ai_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES hubspot_connections(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  plan_id UUID,
  action TEXT NOT NULL,
  tool_name TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REVERTED')),
  result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_execution_logs_org ON ai_execution_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_execution_logs_portal ON ai_execution_logs(portal_id);

-- Enable RLS
ALTER TABLE ai_portal_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation_ai_portal_analyses ON ai_portal_analyses
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY org_isolation_ai_execution_logs ON ai_execution_logs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );
