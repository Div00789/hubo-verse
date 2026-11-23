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
  PortalSchemaRegistry,
  WorkflowBlueprint,
  WorkflowDeploymentRecord,
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
  id: 'conn_hs_46100478',
  organizationId: 'org_enterprise_01',
  portalId: '46100478',
  portalName: 'HubSpot Demo Account',
  hubspotDomain: 'app.hubspot.com/reports-dashboard/46100478',
  installedScopes: [
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.schemas.contacts.read',
    'crm.schemas.contacts.write',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.schemas.deals.read',
    'crm.objects.companies.read',
    'crm.objects.owners.read',
    'automation',
    'crm.lists.read',
    'crm.lists.write',
  ],
  hubs: {
    Marketing: 'Professional',
    Sales: 'Enterprise',
    Service: 'Professional',
    Operations: 'Starter',
    CMS: 'Starter',
  },
  status: 'CONNECTED',
  connectedByUserId: 'div@huboexperts.com',
  connectedAt: '2026-02-01T12:00:00Z',
  lastSyncedAt: new Date().toISOString(),
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

// ============================================================================
// 8. VERIFIED PORTAL SCHEMA REGISTRY (Portal #46100478 - HubSpot Demo Account)
// ============================================================================
export const DEMO_PORTAL_SCHEMA_REGISTRY: PortalSchemaRegistry = {
  portalId: '46100478',
  portalName: 'HubSpot Demo Account',
  refreshedAt: new Date().toISOString(),
  properties: {
    contacts: [
      { name: 'email', label: 'Email', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'firstname', label: 'First Name', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'lastname', label: 'Last Name', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      {
        name: 'lifecyclestage',
        label: 'Lifecycle Stage',
        type: 'enumeration',
        fieldType: 'select',
        options: [
          { label: 'Subscriber', value: 'subscriber' },
          { label: 'Lead', value: 'lead' },
          { label: 'Marketing Qualified Lead', value: 'marketingqualifiedlead' },
          { label: 'Sales Qualified Lead', value: 'salesqualifiedlead' },
          { label: 'Opportunity', value: 'opportunity' },
          { label: 'Customer', value: 'customer' },
          { label: 'Evangelist', value: 'evangelist' },
          { label: 'Other', value: 'other' },
        ],
        readOnly: false,
        calculated: false,
      },
      {
        name: 'hs_lead_status',
        label: 'Lead Status',
        type: 'enumeration',
        fieldType: 'select',
        options: [
          { label: 'New', value: 'NEW' },
          { label: 'Open', value: 'OPEN' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Open Deal', value: 'OPEN_DEAL' },
          { label: 'Unqualified', value: 'UNQUALIFIED' },
          { label: 'Attempted Contact', value: 'ATTEMPTED_CONTACT' },
          { label: 'Connected', value: 'CONNECTED' },
        ],
        readOnly: false,
        calculated: false,
      },
      { name: 'hubspot_owner_id', label: 'Contact Owner', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'phone', label: 'Phone Number', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'company', label: 'Company Name', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'lead_readiness_score', label: 'Lead Readiness Score', type: 'number', fieldType: 'number', readOnly: false, calculated: false },
    ],
    deals: [
      { name: 'dealname', label: 'Deal Name', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'amount', label: 'Amount', type: 'number', fieldType: 'number', readOnly: false, calculated: false },
      { name: 'pipeline', label: 'Pipeline', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'dealstage', label: 'Deal Stage', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'closedate', label: 'Close Date', type: 'date', fieldType: 'date', readOnly: false, calculated: false },
      { name: 'hubspot_owner_id', label: 'Deal Owner', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'dealtype', label: 'Deal Type', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
    ],
    companies: [
      { name: 'name', label: 'Company Name', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'domain', label: 'Company Domain', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'industry', label: 'Industry', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'numberofemployees', label: 'Number of Employees', type: 'number', fieldType: 'number', readOnly: false, calculated: false },
      { name: 'annualrevenue', label: 'Annual Revenue', type: 'number', fieldType: 'number', readOnly: false, calculated: false },
    ],
    tickets: [
      { name: 'subject', label: 'Ticket Subject', type: 'string', fieldType: 'text', readOnly: false, calculated: false },
      { name: 'hs_pipeline', label: 'Ticket Pipeline', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'hs_pipeline_stage', label: 'Ticket Status', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
      { name: 'hs_ticket_priority', label: 'Priority', type: 'enumeration', fieldType: 'select', readOnly: false, calculated: false },
    ],
  },
  pipelines: {
    deals: [
      {
        id: 'default',
        label: 'Sales Pipeline (Direct B2B)',
        stages: [
          { id: 'appointmentscheduled', label: 'Discovery Scheduled', probability: 0.2, displayOrder: 0 },
          { id: 'qualifiedtobuy', label: 'Technical Qualified', probability: 0.4, displayOrder: 1 },
          { id: 'presentationscheduled', label: 'Architecture Presentation', probability: 0.6, displayOrder: 2 },
          { id: 'decisionmakerboughtin', label: 'Security & Legal Review', probability: 0.8, displayOrder: 3 },
          { id: 'contractsent', label: 'Contract Sent', probability: 0.9, displayOrder: 4 },
          { id: 'closedwon', label: 'Closed Won', probability: 1.0, displayOrder: 5 },
          { id: 'closedlost', label: 'Closed Lost', probability: 0.0, displayOrder: 6 },
        ],
      },
      {
        id: 'pipeline_enterprise_expansion',
        label: 'Enterprise Expansion & Upsell',
        stages: [
          { id: 'expansion_opportunity', label: 'Account Audit', probability: 0.3, displayOrder: 0 },
          { id: 'proposal_review', label: 'Upsell Proposal', probability: 0.7, displayOrder: 1 },
          { id: 'expansion_closed_won', label: 'Expansion Won', probability: 1.0, displayOrder: 2 },
        ],
      },
    ],
  },
  owners: [
    { id: 'owner_101', email: 'sarah.connor@acmeglobal.com', firstName: 'Sarah', lastName: 'Connor', userId: 91823 },
    { id: 'owner_102', email: 'div@huboexperts.com', firstName: 'Divyanshu', lastName: 'Tuli', userId: 91824 },
    { id: 'owner_103', email: 'aadesh@huboexperts.com', firstName: 'Aadesh', lastName: 'Dhall', userId: 91825 },
  ],
  lists: [
    { listId: 'list_8901', name: 'Q4 High-Intent Website Leads', dynamic: false, size: 248 },
    { listId: 'list_8902', name: 'VIP Enterprise Target Accounts', dynamic: false, size: 54 },
    { listId: 'list_8903', name: 'Product Marketing Qualified (Live)', dynamic: true, size: 1420 },
  ],
  marketingEmails: [
    { id: 'email_template_101', name: 'Welcome & Onboarding Sequence (Email 1)', isAvailable: true },
    { id: 'email_template_102', name: 'Lead Nurture — Free Trial Evaluation Check-in', isAvailable: true },
  ],
  existingWorkflows: [
    { id: 'wf_501', name: 'Deal Inactivity Alert (14 Days No Update)', type: 'PLATFORM_FLOW', isEnabled: false },
    { id: 'wf_502', name: 'Round-Robin Lead Assignment & Owner Notification', type: 'CONTACT_FLOW', isEnabled: true },
    { id: 'wf_503', name: 'Lifecycle Stage Synchronizer (Opportunity -> Deal)', type: 'CONTACT_FLOW', isEnabled: true },
  ],
};

// In-memory runtime stores for portal schema and deployments (synced with Supabase tables)
let runtimeSchemaRegistry: Record<string, PortalSchemaRegistry> = {
  '46100478': DEMO_PORTAL_SCHEMA_REGISTRY,
};

let runtimeDeployments: WorkflowDeploymentRecord[] = [
  {
    id: 'dep_init_01',
    organizationId: 'org_enterprise_01',
    portalId: '46100478',
    blueprintId: 'bp_demo_lead_assign',
    blueprintVersion: 1,
    idempotencyKey: 'idem_46100478_lead_assign_v1',
    blueprintHash: 'h_f9823ad761c9e',
    hubspotWorkflowId: 'wf_502',
    status: 'ACTIVE',
    deepLink: 'https://app.hubspot.com/workflows/46100478/flow/wf_502',
    readbackVerified: true,
    verificationNotes: 'Verified: 1 trigger, 2 sequential actions, verified contact owner assignment.',
    deployedAt: '2026-11-18T12:00:00Z',
    verifiedAt: '2026-11-18T12:00:05Z',
  },
];

export function getPortalSchemaRegistry(portalId: string): PortalSchemaRegistry {
  return runtimeSchemaRegistry[portalId] || {
    ...DEMO_PORTAL_SCHEMA_REGISTRY,
    portalId,
  };
}

export function savePortalSchemaRegistry(portalId: string, schema: PortalSchemaRegistry): void {
  runtimeSchemaRegistry[portalId] = schema;
}

export function getWorkflowDeployments(portalId: string): WorkflowDeploymentRecord[] {
  return runtimeDeployments.filter((d) => d.portalId === portalId);
}

export function recordWorkflowDeployment(record: WorkflowDeploymentRecord): void {
  runtimeDeployments.unshift(record);
}

// =========================================================================
// 9. DYNAMIC MULTI-PORTAL CONNECTION REGISTRY (PERSISTENT MULTI-TENANT STORE)
// =========================================================================

export interface PersistentConnectionRecord extends HubSpotPortalConnection {
  workspaceId?: string;
  accountName?: string;
  encryptedAccessToken?: string;
  encryptedRefreshToken?: string | null;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiresAt?: number | null;
  connectionStatus?: 'CONNECTED' | 'NEEDS_REAUTH' | 'DISCONNECTED';
  lastVerifiedAt?: string;
  authMethod?: 'OAUTH' | 'MCP' | 'PAT';
}

interface StoreData {
  activePortalId: string | null;
  connections: Record<string, PersistentConnectionRecord>;
}

function getFs(): any {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('fs');
  } catch {
    return null;
  }
}

function getPath(): any {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('path');
  } catch {
    return null;
  }
}

function getStorageFilePath(): string {
  const nodePath = getPath();
  const rootPath = typeof process !== 'undefined' && process.cwd ? process.cwd() : '.';
  return nodePath ? nodePath.join(rootPath, '.huboverse_connections.json') : '.huboverse_connections.json';
}

let memoryStore: StoreData | null = null;

function loadStoreFromDisk(): StoreData {
  const nodeFs = getFs();
  const filePath = getStorageFilePath();
  try {
    if (nodeFs && nodeFs.existsSync(filePath)) {
      const content = nodeFs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.connections === 'object') {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback if read fails
  }

  const defaultPortalId = process.env.HUBSPOT_DEFAULT_PORTAL_ID || '46100478';
  const hasRefreshToken = Boolean(process.env.HUBSPOT_REFRESH_TOKEN);

  const initialConnections: Record<string, PersistentConnectionRecord> = {};

  if (hasRefreshToken || process.env.HUBSPOT_ACCESS_TOKEN) {
    initialConnections[defaultPortalId] = {
      id: `conn_hs_${defaultPortalId}`,
      organizationId: 'org_enterprise_01',
      workspaceId: 'org_enterprise_01',
      portalId: defaultPortalId,
      portalName: process.env.HUBSPOT_PORTAL_NAME || 'HubSpot Demo Account',
      accountName: process.env.HUBSPOT_PORTAL_NAME || 'HubSpot Demo Account',
      hubspotDomain: `app.hubspot.com/reports-dashboard/${defaultPortalId}`,
      installedScopes: [
        'crm.objects.contacts.read',
        'crm.objects.contacts.write',
        'crm.schemas.contacts.read',
        'crm.schemas.contacts.write',
        'crm.objects.deals.read',
        'crm.objects.deals.write',
        'crm.schemas.deals.read',
        'crm.objects.companies.read',
        'crm.objects.owners.read',
        'automation',
        'crm.lists.read',
        'crm.lists.write',
      ],
      hubs: {
        Marketing: 'Professional',
        Sales: 'Enterprise',
        Service: 'Professional',
        Operations: 'Starter',
        CMS: 'Starter',
      },
      status: 'CONNECTED',
      connectionStatus: 'CONNECTED',
      connectedByUserId: process.env.HUBSPOT_AUTHORIZED_USER || 'div@huboexperts.com',
      connectedUser: process.env.HUBSPOT_AUTHORIZED_USER || 'div@huboexperts.com',
      connectedAt: '2026-02-01T12:00:00Z',
      lastSyncedAt: new Date().toISOString(),
      lastSuccessfulCheck: new Date().toLocaleTimeString(),
      lastVerifiedAt: new Date().toISOString(),
      authMethod: 'OAUTH',
      isLiveConnected: true,
      refreshToken: process.env.HUBSPOT_REFRESH_TOKEN || 'na1-e2c7-b237-4dbd-950d-c3b0e4909cbf',
      accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    };
  }

  const initialData: StoreData = {
    activePortalId: Object.keys(initialConnections)[0] || null,
    connections: initialConnections,
  };

  memoryStore = initialData;
  saveStoreToDisk(initialData);
  return initialData;
}

function saveStoreToDisk(data: StoreData): void {
  const nodeFs = getFs();
  if (!nodeFs) return;
  const filePath = getStorageFilePath();
  try {
    nodeFs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // If write fails, memoryStore remains active
  }
}

function getStore(): StoreData {
  if (!memoryStore) {
    return loadStoreFromDisk();
  }
  return memoryStore;
}

export function getAllPersistentConnections(): PersistentConnectionRecord[] {
  const store = getStore();
  return Object.values(store.connections);
}

export function getPersistentConnectionByPortalId(portalId: string): PersistentConnectionRecord | null {
  const store = getStore();
  const cleanId = String(portalId).trim();
  return store.connections[cleanId] || null;
}

export function getPersistentConnectionById(connectionId: string): PersistentConnectionRecord | null {
  const store = getStore();
  const found = Object.values(store.connections).find((c) => c.id === connectionId);
  return found || null;
}

export function savePersistentConnection(conn: PersistentConnectionRecord): PersistentConnectionRecord {
  const store = getStore();
  const portalId = String(conn.portalId).trim();

  const record: PersistentConnectionRecord = {
    ...conn,
    portalId,
    workspaceId: conn.workspaceId || conn.organizationId || 'org_enterprise_01',
    accountName: conn.accountName || conn.portalName || `Portal #${portalId}`,
    portalName: conn.portalName || conn.accountName || `Portal #${portalId}`,
    connectionStatus: conn.connectionStatus || conn.status || 'CONNECTED',
    status: conn.status || conn.connectionStatus || 'CONNECTED',
    lastSyncedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    lastSuccessfulCheck: new Date().toLocaleTimeString(),
  };

  store.connections[portalId] = record;

  if (!store.activePortalId) {
    store.activePortalId = portalId;
  }

  saveStoreToDisk(store);
  return record;
}

export function deletePersistentConnection(portalId: string): boolean {
  const store = getStore();
  const cleanId = String(portalId).trim();

  if (store.connections[cleanId]) {
    delete store.connections[cleanId];

    if (store.activePortalId === cleanId) {
      const remaining = Object.keys(store.connections);
      store.activePortalId = remaining.length > 0 ? remaining[0] : null;
    }

    saveStoreToDisk(store);
    return true;
  }

  return false;
}

export function setConnectionStatus(
  portalId: string,
  status: 'CONNECTED' | 'NEEDS_REAUTH' | 'DISCONNECTED'
): boolean {
  const store = getStore();
  const cleanId = String(portalId).trim();
  const conn = store.connections[cleanId];

  if (conn) {
    conn.status = status;
    conn.connectionStatus = status;
    conn.lastSuccessfulCheck = new Date().toLocaleTimeString();
    saveStoreToDisk(store);
    return true;
  }

  return false;
}

export function getPersistentActivePortalId(): string | null {
  const store = getStore();
  return store.activePortalId;
}

export function setPersistentActivePortalId(portalId: string | null): void {
  const store = getStore();
  if (portalId && !store.connections[portalId]) {
    throw new Error(`Cannot select Portal #${portalId}: Connection does not exist in persistent storage.`);
  }
  store.activePortalId = portalId;
  saveStoreToDisk(store);
}

export type StoredHubSpotConnection = PersistentConnectionRecord;

export function getAllHubSpotConnections(): StoredHubSpotConnection[] {
  return getAllPersistentConnections();
}

export function getHubSpotConnectionByPortalId(portalId: string): StoredHubSpotConnection | undefined {
  const conn = getPersistentConnectionByPortalId(portalId);
  return conn || undefined;
}

export function saveHubSpotConnection(conn: StoredHubSpotConnection): void {
  savePersistentConnection(conn);

  if (!runtimeSchemaRegistry[conn.portalId]) {
    runtimeSchemaRegistry[conn.portalId] = {
      ...DEMO_PORTAL_SCHEMA_REGISTRY,
      portalId: conn.portalId,
      portalName: conn.portalName,
      refreshedAt: new Date().toISOString(),
    };
  }
}

export function deleteHubSpotConnection(portalId: string): boolean {
  return deletePersistentConnection(portalId);
}

export function getActiveRuntimePortalId(): string {
  return getPersistentActivePortalId() || '';
}

export function setActiveRuntimePortalId(portalId: string): void {
  setPersistentActivePortalId(portalId || null);
}
