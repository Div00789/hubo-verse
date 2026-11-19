import { createClient } from '@supabase/supabase-js';
import type {
  Organization,
  HubSpotPortalConnection,
  Course,
  LiveClass,
  ClientProject,
  AnnaChatMessage,
  AnnaBuildExecution,
  ExpertProfile,
  RecordedExpertVideo,
} from '@huboverse/types';

export function createSupabaseServerClient(supabaseUrl: string, serviceRoleKey: string) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseBrowserClient(supabaseUrl: string, anonKey: string) {
  return createClient(supabaseUrl, anonKey);
}

export const DEMO_ORGANIZATION: Organization = {
  id: 'org_enterprise_01',
  name: 'HuboVerse Demo Enterprise',
  slug: 'huboverse-demo',
  subscriptionTier: 'ENTERPRISE',
  subscriptionStatus: 'ACTIVE',
  maxSeats: 25,
  maxConnectedPortals: 3,
  monthlyAiTokenAllowance: 2000000,
  currentAiTokenUsage: 342150,
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-11-18T10:00:00Z',
};

export const DEMO_HUBSPOT_CONNECTION: HubSpotPortalConnection = {
  id: 'conn_hs_98124',
  organizationId: 'org_enterprise_01',
  portalId: '44891204',
  portalName: 'HubSpot Enterprise Sandbox CRM',
  hubspotDomain: 'sandbox-44891204.hubspot.com',
  installedScopes: [
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.schemas.contacts.write',
    'crm.schemas.custom.read',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'automation',
  ],
  hubs: {
    Marketing: 'Professional',
    Sales: 'Enterprise',
    Service: 'Professional',
    Operations: 'Starter',
    CMS: 'Starter',
  },
  status: 'CONNECTED',
  connectedByUserId: 'usr_sarah_cto',
  connectedAt: '2026-02-01T12:00:00Z',
  lastSyncedAt: '2026-11-18T11:00:00Z',
};

export const DEMO_EXPERTS: ExpertProfile[] = [
  {
    id: 'exp_divyanshu_tuli',
    slug: 'divyanshu-tuli',
    fullName: 'Divyanshu Tuli',
    professionalTitle: 'HubSpot & RevOps Certified Expert | AI Automation Specialist',
    yearsExperience: 10,
    experienceDisplay: '10+ Years of Experience',
    profileImagePath: '/experts/divyanshu-tuli-blue.png',
    shortBio:
      'HubSpot-certified and RevOps-certified professional with over 10 years of experience in CRM, digital marketing, revenue operations and business automation.',
    fullBio:
      'Divyanshu Tuli is a HubSpot-certified and RevOps-certified professional with over 10 years of experience in CRM, digital marketing, revenue operations and business automation.\n\nHe specialises in HubSpot implementation, advanced CRM automation, sales and marketing operations, and AI-powered business solutions.\n\nWith hands-on expertise in the latest HubSpot AI capabilities and modern automation tools, Divyanshu helps businesses streamline processes, improve operational efficiency and build scalable revenue systems.',
    skills: [
      'HubSpot CRM',
      'Revenue Operations (RevOps)',
      'HubSpot AI Automation',
      'Marketing Hub',
      'Sales Hub',
      'CRM Implementation',
      'Workflow Automation',
      'Business Process Automation',
      'AI Tools and Integrations',
      'CRM Strategy and Optimisation',
    ],
    certifications: ['HubSpot Certified', 'Revenue Operations Certified'],
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  },
  {
    id: 'exp_aadesh_dhall',
    slug: 'aadesh-dhall',
    fullName: 'Aadesh Dhall',
    professionalTitle: 'HubSpot Automation Expert | CRM & AI Tools Specialist',
    yearsExperience: 3,
    experienceDisplay: '3+ Years of Experience',
    profileImagePath: '/experts/aadesh-dhall.png',
    shortBio:
      'HubSpot Automation Expert with over 3 years of hands-on experience in CRM automation, workflow development and HubSpot implementation.',
    fullBio:
      'Aadesh Dhall is a HubSpot Automation Expert with over 3 years of hands-on experience in CRM automation, workflow development and HubSpot implementation.\n\nHe has practical experience working with international clients, helping businesses optimise HubSpot processes, automate repetitive tasks and improve sales and marketing operations.\n\nWith knowledge of the latest HubSpot capabilities and emerging AI tools, Aadesh focuses on building efficient, scalable automation solutions that simplify CRM management and support business growth.',
    skills: [
      'HubSpot Automation',
      'CRM Workflows',
      'Marketing Automation',
      'Sales Automation',
      'HubSpot CRM Management',
      'AI Tools',
      'Workflow Optimisation',
      'CRM Implementation',
      'International Client Projects',
      'Business Process Automation',
    ],
    certifications: [],
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  },
];

export function getExpertBySlug(slug: string): ExpertProfile | undefined {
  return DEMO_EXPERTS.find((exp) => exp.slug === slug);
}

export function getCoursesByExpertId(expertId: string): Course[] {
  return DEMO_COURSES.filter((course) => course.instructorId === expertId);
}

export function getLiveClassesByExpertId(expertId: string): LiveClass[] {
  return DEMO_LIVE_CLASSES.filter((cls) => cls.instructorId === expertId);
}

export const DEMO_RECORDED_VIDEOS: RecordedExpertVideo[] = [
  {
    id: 'vid_zapier_01',
    expertId: 'exp_divyanshu_tuli',
    title: 'HubSpot & Zapier Integration',
    description:
      'Learn how HubSpot and Zapier can work together to connect applications and streamline business automation processes.',
    videoUrl: 'https://www.loom.com/share/ddbc2f4398074cad9374fc22b83a6b27',
    embedUrl: 'https://www.loom.com/embed/ddbc2f4398074cad9374fc22b83a6b27',
    category: 'HubSpot Integrations',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2026-11-19T00:00:00Z',
  },
  {
    id: 'vid_shared_deals_02',
    expertId: 'exp_divyanshu_tuli',
    title: 'Creating Shared Deals in HubSpot',
    description:
      'A practical HubSpot tutorial covering shared deal management and collaboration within the CRM.',
    videoUrl: 'https://www.loom.com/share/08c71411a5b144eebfba7dda9ac558d6',
    embedUrl: 'https://www.loom.com/embed/08c71411a5b144eebfba7dda9ac558d6',
    category: 'HubSpot Sales CRM',
    displayOrder: 2,
    isPublished: true,
    createdAt: '2026-11-19T00:00:00Z',
  },
  {
    id: 'vid_sales_ext_03',
    expertId: 'exp_divyanshu_tuli',
    title: 'Download & Integrate HubSpot Sales Extension',
    description:
      'Learn how to download and integrate the HubSpot Sales Extension to support sales activities and improve productivity.',
    videoUrl: 'https://www.loom.com/share/43fa73c57f2345ff98aee86c56744584',
    embedUrl: 'https://www.loom.com/embed/43fa73c57f2345ff98aee86c56744584',
    category: 'HubSpot Sales Tools',
    displayOrder: 3,
    isPublished: true,
    createdAt: '2026-11-19T00:00:00Z',
  },
];

export function getRecordedVideosByExpertId(expertId: string): RecordedExpertVideo[] {
  return DEMO_RECORDED_VIDEOS.filter((v) => v.expertId === expertId && v.isPublished).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}

export const DEMO_COURSES: Course[] = [
  {
    id: 'crs_arch_01',
    slug: 'hubspot-enterprise-data-architecture',
    title: 'Enterprise HubSpot Data Architecture & Custom Objects',
    description: 'Architecting scalable schemas, relationship modeling, and custom object associations for high-volume B2B operations.',
    instructorId: 'exp_divyanshu_tuli',
    instructorName: 'Divyanshu Tuli (HubSpot & RevOps Expert)',
    level: 'ADVANCED',
    hubCategory: 'Operations',
    estimatedHours: 4.5,
    published: true,
    totalEnrollments: 340,
    rating: 4.96,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'crs_revops_02',
    slug: 'revenue-attribution-and-lead-lifecycle',
    title: 'Advanced Revenue Operations: Multi-Touch Lead Lifecycle',
    description: 'Configure lifecycle stages, MQL-to-SQL automated velocity alerts, and multi-touch pipeline attribution in HubSpot.',
    instructorId: 'exp_divyanshu_tuli',
    instructorName: 'Divyanshu Tuli (RevOps Architect)',
    level: 'INTERMEDIATE',
    hubCategory: 'Marketing',
    estimatedHours: 3.5,
    published: true,
    totalEnrollments: 520,
    rating: 4.92,
    createdAt: '2026-04-12T00:00:00Z',
  },
  {
    id: 'crs_auto_03',
    slug: 'complex-workflow-logic-and-webhooks',
    title: 'Complex Workflow Automation, Custom Code Actions & Webhooks',
    description: 'Master webhook triggers, custom Node.js script actions in Operations Hub, and automated CRM error handling.',
    instructorId: 'exp_aadesh_dhall',
    instructorName: 'Aadesh Dhall (Automation Specialist)',
    level: 'ADVANCED',
    hubCategory: 'Operations',
    estimatedHours: 6.0,
    published: true,
    totalEnrollments: 285,
    rating: 4.98,
    createdAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'crs_auto_04',
    slug: 'hubspot-crm-process-automation',
    title: 'HubSpot Process Automation & Scalable CRM Systems',
    description: 'Hands-on workflow development, eliminating manual CRM bottlenecks, and building scalable automation pipelines.',
    instructorId: 'exp_aadesh_dhall',
    instructorName: 'Aadesh Dhall (HubSpot Automation Expert)',
    level: 'INTERMEDIATE',
    hubCategory: 'Sales',
    estimatedHours: 4.0,
    published: true,
    totalEnrollments: 198,
    rating: 4.94,
    createdAt: '2026-06-15T00:00:00Z',
  },
];

export const DEMO_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live_cls_101',
    title: 'Live Workshop: Designing Clean HubSpot Deal Pipelines with AI',
    description: 'Join HuboExperts lead consultants live as we tear down and reconstruct lead scoring rules and deal stages.',
    instructorId: 'exp_divyanshu_tuli',
    instructorName: 'Divyanshu Tuli & Anna AI',
    roomName: 'huboverse-live-pipeline-masterclass',
    scheduledStartTime: '2026-11-20T17:00:00Z',
    durationMinutes: 90,
    maxAttendees: 100,
    status: 'SCHEDULED',
    livekitRoomId: 'lk_room_9832',
  },
  {
    id: 'live_cls_102',
    title: 'Live Studio: Real-Time HubSpot Workflow & Trigger Architecture',
    description: 'Hands-on live debugging of enterprise automation triggers, webhooks, and sales routing rules.',
    instructorId: 'exp_aadesh_dhall',
    instructorName: 'Aadesh Dhall',
    roomName: 'huboverse-workflow-studio',
    scheduledStartTime: '2026-11-24T16:00:00Z',
    durationMinutes: 60,
    maxAttendees: 150,
    status: 'SCHEDULED',
    livekitRoomId: 'lk_room_9834',
  },
];

export const DEMO_PROJECTS: ClientProject[] = [
  {
    id: 'proj_rev_01',
    organizationId: 'org_enterprise_01',
    title: 'HubSpot Enterprise CRM Migration & Architecture Overhaul',
    description: 'Migrating legacy Salesforce objects, restructuring contact lifecycle stages, and standardizing HubSpot deal pipelines.',
    status: 'IN_PROGRESS',
    targetCompletionDate: '2026-12-15',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-11-18T09:30:00Z',
  },
];

export const INITIAL_ANNA_MESSAGES: AnnaChatMessage[] = [
  {
    id: 'msg_01',
    conversationId: 'conv_demo_01',
    sender: 'ANNA',
    content: `Hello! I am **Anna**, your enterprise HubSpot intelligence partner at **HuboVerse**.

I am connected to your portal **HubSpot Enterprise Sandbox CRM (ID: #44891204)**.

I can assist you in two distinct modes:
- **Chat Mode**: Explore best practices, troubleshoot workflow enrollment failures, or receive step-by-step guidance.
- **Build Mode**: Safely preview structural CRM changes (e.g., custom properties, pipelines, webhook actions) with dry-run diffs and one-click execution.

How can I help accelerate your HubSpot operations today?`,
    mode: 'CHAT',
    suggestedPrompts: [
      'Anna, explain how HubSpot lead scoring works and suggest rules for B2B SaaS.',
      'Switch to Build Mode and create a "Lead Readiness Score" property on Contacts.',
      'Audit our active deal pipelines for conversion bottlenecks.',
      'Show me upcoming LiveKit live training workshops.',
    ],
    citations: [
      {
        id: 'c_init',
        sourceType: 'PORTAL_SCHEMA',
        title: 'Portal Connection Verified: HuboVerse Sandbox (ID #44891204)',
        snippet: 'Hubs detected: Sales Enterprise, Marketing Pro, Service Pro, Operations Starter.',
      },
    ],
    tokensUsed: 120,
    createdAt: '2026-11-18T10:00:00Z',
  },
];

export const DEMO_BUILD_EXECUTION: AnnaBuildExecution = {
  id: 'bld_782914',
  conversationId: 'conv_demo_01',
  organizationId: 'org_enterprise_01',
  hubspotConnectionId: 'conn_hs_98124',
  initiatedByUserId: 'usr_sarah_cto',
  status: 'AWAITING_APPROVAL',
  goal: 'Create custom contact property "Lead Readiness Score" with numeric range validation (0 - 100).',
  actionId: 'hubspot.properties.create',
  targetHubSpotObject: 'contacts',
  riskLevel: 'LOW',
  diffPreview: [
    {
      path: 'contacts.properties.lead_readiness_score',
      operation: 'CREATE',
      previousValue: null,
      newValue: {
        name: 'lead_readiness_score',
        label: 'Lead Readiness Score',
        type: 'number',
        fieldType: 'number',
        groupName: 'contactinformation',
        min: 0,
        max: 100,
        description: 'Calculated readiness score synthesized by Anna AI based on multi-touch engagement.',
      },
      description: 'Creates new Contact schema property "Lead Readiness Score" in HubSpot.',
    },
  ],
  createdAt: '2026-11-18T10:15:00Z',
};
