import {
  Organization,
  HubSpotPortalConnection,
  Course,
  LiveClass,
  ClientProject,
  AnnaChatMessage,
  AnnaBuildExecution,
} from '@huboverse/types';

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
  id: 'conn_hs_46100478',
  organizationId: 'org_enterprise_01',
  portalId: '46100478',
  portalName: 'HubSpot Demo Account',
  hubspotDomain: 'app.hubspot.com/reports-dashboard/46100478',
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

export const DEMO_COURSES: Course[] = [
  {
    id: 'crs_arch_01',
    slug: 'hubspot-enterprise-data-architecture',
    title: 'Enterprise HubSpot Data Architecture & Custom Objects',
    description: 'Architecting scalable schemas, relationship modeling, and custom object associations for high-volume B2B operations.',
    instructorId: 'inst_alex',
    instructorName: 'Alex Thorne (HuboExperts Principal)',
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
    instructorId: 'inst_elena',
    instructorName: 'Elena Rostova (RevOps Architect)',
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
    instructorId: 'inst_marcus',
    instructorName: 'Marcus Vance (Automation Lead)',
    level: 'ADVANCED',
    hubCategory: 'Operations',
    estimatedHours: 6.0,
    published: true,
    totalEnrollments: 285,
    rating: 4.98,
    createdAt: '2026-05-01T00:00:00Z',
  },
];

export const DEMO_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live_cls_101',
    title: 'Live Workshop: Designing Clean HubSpot Deal Pipelines with AI',
    description: 'Join HuboExperts lead consultants live as we tear down and reconstruct lead scoring rules and deal stages.',
    instructorId: 'inst_alex',
    instructorName: 'Alex Thorne & Anna AI',
    roomName: 'huboverse-live-pipeline-masterclass',
    scheduledStartTime: '2026-11-20T17:00:00Z',
    durationMinutes: 90,
    maxAttendees: 100,
    status: 'SCHEDULED',
    livekitRoomId: 'lk_room_9832',
  },
  {
    id: 'live_cls_102',
    title: 'Weekly Office Hours: HubSpot Admin Q&A with LiveKit Studio',
    description: 'Ask any question regarding workflow failures, property normalization, or Anna Build execution safely.',
    instructorId: 'inst_elena',
    instructorName: 'Elena Rostova',
    roomName: 'huboverse-office-hours',
    scheduledStartTime: '2026-11-22T15:00:00Z',
    durationMinutes: 60,
    maxAttendees: 200,
    status: 'SCHEDULED',
    livekitRoomId: 'lk_room_9833',
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

I am connected to your portal **HubSpot Demo Account (ID: #46100478)**.

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
        title: 'Portal Connection Verified: HubSpot Demo Account (ID #46100478)',
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
