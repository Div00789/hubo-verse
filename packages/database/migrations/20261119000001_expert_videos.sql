-- =========================================================================
-- HUBOVERSE RECORDED EXPERT VIDEOS SCHEMA & RLS
-- Target: Supabase PostgreSQL 16
-- =========================================================================

-- 1. RECORDED EXPERT VIDEOS TABLE
CREATE TABLE IF NOT EXISTS expert_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expert_videos_expert_id ON expert_videos(expert_id, is_published, display_order);

-- 2. ROW LEVEL SECURITY (RLS)
ALTER TABLE expert_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view published expert recordings
CREATE POLICY "Public read published expert videos"
  ON expert_videos
  FOR SELECT
  USING (is_published = true);

-- Authenticated admins can manage videos
CREATE POLICY "Admins full management on expert videos"
  ON expert_videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.user_id = auth.uid()
      AND organization_members.role IN ('PLATFORM_SUPER_ADMIN', 'HUBOEXPERTS_OPS_ADMIN')
    )
  );

-- 3. SEED DIVYANSHU TULI RECORDED HUBSPOT TRAINING SESSIONS
INSERT INTO expert_videos (
  id,
  expert_id,
  title,
  description,
  video_url,
  embed_url,
  category,
  display_order,
  is_published
) VALUES
(
  'v0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'HubSpot & Zapier Integration',
  'Learn how HubSpot and Zapier can work together to connect applications and streamline business automation processes.',
  'https://www.loom.com/share/ddbc2f4398074cad9374fc22b83a6b27',
  'https://www.loom.com/embed/ddbc2f4398074cad9374fc22b83a6b27',
  'HubSpot Integrations',
  1,
  true
),
(
  'v0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001',
  'Creating Shared Deals in HubSpot',
  'A practical HubSpot tutorial covering shared deal management and collaboration within the CRM.',
  'https://www.loom.com/share/08c71411a5b144eebfba7dda9ac558d6',
  'https://www.loom.com/embed/08c71411a5b144eebfba7dda9ac558d6',
  'HubSpot Sales CRM',
  2,
  true
),
(
  'v0000000-0000-0000-0000-000000000003',
  'e0000000-0000-0000-0000-000000000001',
  'Download & Integrate HubSpot Sales Extension',
  'Learn how to download and integrate the HubSpot Sales Extension to support sales activities and improve productivity.',
  'https://www.loom.com/share/43fa73c57f2345ff98aee86c56744584',
  'https://www.loom.com/embed/43fa73c57f2345ff98aee86c56744584',
  'HubSpot Sales Tools',
  3,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  video_url = EXCLUDED.video_url,
  embed_url = EXCLUDED.embed_url,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
