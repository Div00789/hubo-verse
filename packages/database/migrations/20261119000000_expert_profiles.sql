-- =========================================================================
-- HUBOVERSE EXPERT PROFILES SCHEMA & SUPABASE STORAGE INTEGRATION
-- Target: Supabase PostgreSQL 16
-- =========================================================================

-- 1. EXPERT PROFILES TABLE
CREATE TABLE IF NOT EXISTS expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Optional foreign key to auth.users if assigned
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  professional_title TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  full_bio TEXT NOT NULL,
  years_experience INT NOT NULL DEFAULT 1,
  experience_display TEXT NOT NULL,
  profile_image_path TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for high-velocity slug lookup
CREATE INDEX IF NOT EXISTS idx_expert_profiles_slug ON expert_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_active ON expert_profiles(is_active, display_order);

-- 2. ROW LEVEL SECURITY (RLS)
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view active, published expert profiles
CREATE POLICY "Public read active expert profiles"
  ON expert_profiles
  FOR SELECT
  USING (is_active = true);

-- Authenticated admins can create, update, and manage all profiles
CREATE POLICY "Admins full management on expert profiles"
  ON expert_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.user_id = auth.uid()
      AND organization_members.role IN ('PLATFORM_SUPER_ADMIN', 'HUBOEXPERTS_OPS_ADMIN')
    )
  );

-- 3. SUPABASE STORAGE BUCKET CONFIGURATION (for headshots)
INSERT INTO storage.buckets (id, name, public)
VALUES ('expert-photos', 'expert-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read for headshots
CREATE POLICY "Public read expert photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'expert-photos');

-- Storage RLS: Admin upload / replace headshots
CREATE POLICY "Admins upload expert photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'expert-photos' AND
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.user_id = auth.uid()
      AND organization_members.role IN ('PLATFORM_SUPER_ADMIN', 'HUBOEXPERTS_OPS_ADMIN')
    )
  );

-- 4. SEED OFFICIAL EXPERTS (Divyanshu Tuli & Aadesh Dhall)
INSERT INTO expert_profiles (
  id,
  slug,
  full_name,
  professional_title,
  short_bio,
  full_bio,
  years_experience,
  experience_display,
  profile_image_path,
  skills,
  certifications,
  is_active,
  is_featured,
  display_order
) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'divyanshu-tuli',
  'Divyanshu Tuli',
  'HubSpot & RevOps Certified Expert | AI Automation Specialist',
  'HubSpot-certified and RevOps-certified professional with over 10 years of experience in CRM, digital marketing, revenue operations and business automation.',
  'Divyanshu Tuli is a HubSpot-certified and RevOps-certified professional with over 10 years of experience in CRM, digital marketing, revenue operations and business automation.\n\nHe specialises in HubSpot implementation, advanced CRM automation, sales and marketing operations, and AI-powered business solutions.\n\nWith hands-on expertise in the latest HubSpot AI capabilities and modern automation tools, Divyanshu helps businesses streamline processes, improve operational efficiency and build scalable revenue systems.',
  10,
  '10+ Years of Experience',
  '/experts/divyanshu-tuli-blue.png',
  '[
    "HubSpot CRM",
    "Revenue Operations (RevOps)",
    "HubSpot AI Automation",
    "Marketing Hub",
    "Sales Hub",
    "CRM Implementation",
    "Workflow Automation",
    "Business Process Automation",
    "AI Tools and Integrations",
    "CRM Strategy and Optimisation"
  ]'::jsonb,
  '[
    "HubSpot Certified",
    "Revenue Operations Certified"
  ]'::jsonb,
  true,
  true,
  1
),
(
  'e0000000-0000-0000-0000-000000000002',
  'aadesh-dhall',
  'Aadesh Dhall',
  'HubSpot Automation Expert | CRM & AI Tools Specialist',
  'HubSpot Automation Expert with over 3 years of hands-on experience in CRM automation, workflow development and HubSpot implementation.',
  'Aadesh Dhall is a HubSpot Automation Expert with over 3 years of hands-on experience in CRM automation, workflow development and HubSpot implementation.\n\nHe has practical experience working with international clients, helping businesses optimise HubSpot processes, automate repetitive tasks and improve sales and marketing operations.\n\nWith knowledge of the latest HubSpot capabilities and emerging AI tools, Aadesh focuses on building efficient, scalable automation solutions that simplify CRM management and support business growth.',
  3,
  '3+ Years of Experience',
  '/experts/aadesh-dhall.png',
  '[
    "HubSpot Automation",
    "CRM Workflows",
    "Marketing Automation",
    "Sales Automation",
    "HubSpot CRM Management",
    "AI Tools",
    "Workflow Optimisation",
    "CRM Implementation",
    "International Client Projects",
    "Business Process Automation"
  ]'::jsonb,
  '[]'::jsonb,
  true,
  true,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  professional_title = EXCLUDED.professional_title,
  short_bio = EXCLUDED.short_bio,
  full_bio = EXCLUDED.full_bio,
  years_experience = EXCLUDED.years_experience,
  experience_display = EXCLUDED.experience_display,
  profile_image_path = EXCLUDED.profile_image_path,
  skills = EXCLUDED.skills,
  certifications = EXCLUDED.certifications,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
