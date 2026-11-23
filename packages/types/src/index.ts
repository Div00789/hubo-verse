/**
 * HuboVerse Enterprise Type Definitions
 * Covers Multi-Tenancy, RBAC, Anna AI (Chat & Build), HubSpot Capability Engine,
 * Learning Academy, and Operations.
 */

// ==========================================
// 1. ROLES & PERMISSIONS
// ==========================================
export type PlatformRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'HUBOEXPERTS_OPS_ADMIN'
  | 'HUBSPOT_SPECIALIST'
  | 'INSTRUCTOR'
  | 'CLIENT_ORG_OWNER'
  | 'CLIENT_ORG_ADMIN'
  | 'CLIENT_TEAM_MEMBER'
  | 'STUDENT_LEARNER'
  | 'READ_ONLY_VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  hubspotPortalId?: string;
  subscriptionTier: 'STARTER' | 'GROWTH' | 'ENTERPRISE' | 'AGENCY';
  subscriptionStatus: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  maxSeats: number;
  maxConnectedPortals: number;
  monthlyAiTokenAllowance: number;
  currentAiTokenUsage: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: PlatformRole;
  invitedBy?: string;
  joinedAt: string;
  user?: UserProfile;
}

// ==========================================
// 2. HUBSPOT CONNECTION & CAPABILITY REGISTRY
// ==========================================
export type HubSpotHub = 'Marketing' | 'Sales' | 'Service' | 'Operations' | 'CMS';
export type HubSpotTier = 'Free' | 'Starter' | 'Professional' | 'Enterprise';

export interface HubSpotPortalConnection {
  id: string;
  organizationId: string;
  portalId: string;
  portalName: string;
  hubspotDomain?: string;
  installedScopes: string[];
  hubs: Record<HubSpotHub, HubSpotTier>;
  status: 'CONNECTED' | 'NEEDS_REAUTH' | 'DISCONNECTED';
  connectedByUserId: string;
  connectedAt: string;
  lastSyncedAt?: string;
  authMethod?: 'OAUTH' | 'MCP' | 'PAT';
  encryptedAccessToken?: string;
  encryptedRefreshToken?: string | null;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiresAt?: number | null;
  connectedUser?: string;
  lastSuccessfulCheck?: string;
  isLiveConnected?: boolean;
  verifiedPropertiesCount?: number;
  verifiedPipelinesCount?: number;
  verifiedOwnersCount?: number;
  verifiedWorkflowsCount?: number;
}

export type ActionRiskLevel = 'READ_ONLY' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface HubSpotActionCapability {
  actionId: string;
  name: string;
  description: string;
  category: 'PROPERTIES' | 'WORKFLOWS' | 'PIPELINES' | 'CONTACTS' | 'DEALS' | 'ANALYTICS';
  requiredScopes: string[];
  minimumTier: Record<HubSpotHub, HubSpotTier | 'None'>;
  riskLevel: ActionRiskLevel;
  requiresDualApproval: boolean;
  rollbackSupported: boolean;
}

// ==========================================
// 3. ANNA AI SYSTEM (CHAT & BUILD)
// ==========================================
export type AnnaMode = 'CHAT' | 'BUILD';

export interface AnnaConversation {
  id: string;
  organizationId: string;
  userId: string;
  hubspotConnectionId?: string;
  title: string;
  mode: AnnaMode;
  createdAt: string;
  updatedAt: string;
}

export interface AnnaCitation {
  id: string;
  sourceType: 'HUBSPOT_DOC' | 'ACADEMY_LESSON' | 'PORTAL_SCHEMA' | 'CRM_BEST_PRACTICE';
  title: string;
  url?: string;
  snippet: string;
}

export interface AnnaChatMessage {
  id: string;
  conversationId: string;
  sender: 'USER' | 'ANNA' | 'SYSTEM';
  content: string;
  mode: AnnaMode;
  suggestedPrompts?: string[];
  citations?: AnnaCitation[];
  tokensUsed?: number;
  feedbackRating?: 'THUMBS_UP' | 'THUMBS_DOWN';
  createdAt: string;
}

// --- Anna Build Mode Structures ---
export type BuildExecutionStatus =
  | 'ANALYZING'
  | 'CAPABILITY_VERIFIED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'FAILED'
  | 'ROLLED_BACK';

export interface SchemaDiffChange {
  path: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  previousValue?: unknown;
  newValue?: unknown;
  description: string;
}

export interface AnnaBuildExecution {
  id: string;
  conversationId: string;
  organizationId: string;
  hubspotConnectionId: string;
  initiatedByUserId: string;
  approvedByUserId?: string;
  status: BuildExecutionStatus;
  goal: string;
  actionId: string;
  targetHubSpotObject: string;
  riskLevel: ActionRiskLevel;
  diffPreview: SchemaDiffChange[];
  executionResult?: {
    hubspotObjectId?: string;
    details: string;
    deepLink?: string;
  };
  rollbackSnapshot?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

// ==========================================
// 3B. HUBOVERSE WORKFLOW BLUEPRINT & EXECUTION (BUILD MODE)
// ==========================================
export type WorkflowBlueprintStatus =
  | 'READY'
  | 'NEEDS_CLARIFICATION'
  | 'UNSUPPORTED_ACTION'
  | 'UNSUPPORTED_PLAN';

export type InternalWorkflowActionType =
  | 'DELAY'
  | 'SET_PROPERTY'
  | 'CREATE_TASK'
  | 'SEND_INTERNAL_NOTIFICATION'
  | 'SEND_MARKETING_EMAIL'
  | 'ADD_TO_LIST'
  | 'REMOVE_FROM_LIST'
  | 'IF_THEN_BRANCH';

export type InternalWorkflowType = 'CONTACT_FLOW' | 'PLATFORM_FLOW';
export type InternalObjectType = 'CONTACT' | 'DEAL' | 'COMPANY' | 'TICKET';

export interface WorkflowFilter {
  property: string;
  operator: 'EQ' | 'NEQ' | 'CONTAINS' | 'IS_KNOWN' | 'IS_UNKNOWN' | 'GT' | 'LT' | 'BETWEEN' | string;
  value?: any;
}

export interface EnrollmentTrigger {
  logic: 'AND' | 'OR';
  filters: WorkflowFilter[];
}

export interface WorkflowStep {
  stepId: string;
  actionType: InternalWorkflowActionType;
  description: string;
  fields: {
    // DELAY
    duration_value?: number;
    duration_unit?: 'MINUTES' | 'HOURS' | 'DAYS';
    // SET_PROPERTY
    property_name?: string;
    value?: any;
    // CREATE_TASK
    subject?: string;
    body?: string;
    task_type?: 'CALL' | 'EMAIL' | 'TODO';
    owner_id?: string | null;
    due_in_days?: number;
    // SEND_INTERNAL_NOTIFICATION
    recipient_owner_ids?: string[];
    message?: string;
    // SEND_MARKETING_EMAIL
    email_id?: string;
    // ADD_TO_LIST / REMOVE_FROM_LIST
    list_id?: string;
    // IF_THEN_BRANCH
    branch_name?: string;
    conditions?: WorkflowFilter[];
    true_next_step_id?: string | null;
    false_next_step_id?: string | null;
    [key: string]: any;
  };
  nextStepId: string | null;
}

export interface WorkflowDefinition {
  name: string;
  type: InternalWorkflowType;
  objectType: InternalObjectType;
  isEnabled: false; // Must ALWAYS be false initially!
  reEnrollment: boolean;
  enrollmentTrigger: EnrollmentTrigger;
  startStepId: string;
  steps: WorkflowStep[];
}

export interface WorkflowBlueprint {
  status: WorkflowBlueprintStatus;
  clarification_question: string | null;
  missing_dependencies: string[];
  summary: string;
  workflow: WorkflowDefinition | null;
}

// --- Portal Schema Registry Types ---
export interface HubSpotPropertyMetadata {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  description?: string;
  options?: Array<{ label: string; value: string }>;
  readOnly: boolean;
  calculated: boolean;
}

export interface HubSpotPipelineMetadata {
  id: string;
  label: string;
  stages: Array<{
    id: string;
    label: string;
    probability: number;
    displayOrder: number;
  }>;
}

export interface HubSpotOwnerMetadata {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId?: number;
  teams?: Array<{ id: string; name: string }>;
}

export interface HubSpotListMetadata {
  listId: string;
  name: string;
  dynamic: boolean;
  size: number;
}

export interface HubSpotWorkflowSummary {
  id: string;
  name: string;
  type: string;
  isEnabled: boolean;
  insertedAt?: string;
  updatedAt?: string;
}

export interface PortalSchemaRegistry {
  portalId: string;
  portalName: string;
  refreshedAt: string;
  properties: Record<string, HubSpotPropertyMetadata[]>; // keyed by objectType: contacts, companies, deals, tickets
  pipelines: Record<string, HubSpotPipelineMetadata[]>; // deals, tickets
  owners: HubSpotOwnerMetadata[];
  lists: HubSpotListMetadata[];
  marketingEmails?: Array<{ id: string; name: string; isAvailable: boolean }>;
  existingWorkflows: HubSpotWorkflowSummary[];
}

// --- Workflow Deployment & Verification Types ---
export type WorkflowDeploymentStatus =
  | 'PLANNING'
  | 'NEEDS_CLARIFICATION'
  | 'VALIDATING'
  | 'READY_FOR_APPROVAL'
  | 'APPROVED'
  | 'DEPLOYING'
  | 'CREATED_INACTIVE'
  | 'VERIFICATION_FAILED'
  | 'DEPLOYMENT_FAILED'
  | 'ACTIVATION_PENDING'
  | 'ACTIVE';

export interface WorkflowDeploymentRecord {
  id: string;
  organizationId: string;
  portalId: string;
  blueprintId: string;
  blueprintVersion: number;
  idempotencyKey: string;
  blueprintHash: string;
  hubspotWorkflowId?: string;
  status: WorkflowDeploymentStatus;
  deepLink?: string;
  readbackVerified: boolean;
  verificationNotes?: string;
  errorMessage?: string;
  deployedAt?: string;
  verifiedAt?: string;
}

// --- CRM Data Query & Response Types (Chat Mode) ---
export interface CrmMetricCard {
  label: string;
  value: string | number;
  change?: string;
  subtext?: string;
}

export interface CrmDataResult {
  title: string;
  summary: string;
  source: string;
  period?: string;
  metrics?: CrmMetricCard[];
  tableHeaders?: string[];
  tableRows?: Array<Array<string | number>>;
  insights?: string[];
  suggestedFollowUps?: string[];
}

// ==========================================
// 4. LEARNING ACADEMY & LIVE TRAINING
// ==========================================
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'CERTIFICATION';
  hubCategory: HubSpotHub;
  estimatedHours: number;
  published: boolean;
  totalEnrollments: number;
  rating: number;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  muxPlaybackId?: string;
  orderIndex: number;
  isFreePreview: boolean;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  roomName: string;
  scheduledStartTime: string;
  durationMinutes: number;
  maxAttendees: number;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'RECORDING_AVAILABLE';
  livekitRoomId?: string;
  recordingMuxPlaybackId?: string;
}

// ==========================================
// 5. PROJECTS & CLIENT OPERATIONS
// ==========================================
export interface ClientProject {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  hubspotConnectionId?: string;
  assignedSpecialistId?: string;
  status: 'DISCOVERY' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
  targetCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  tasksCount: number;
  completedTasksCount: number;
}

// ==========================================
// 7. HUBSPOT EXPERTS DIRECTORY
// ==========================================
export interface ExpertProfile {
  id: string;
  userId?: string | null;
  slug: string;
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  fullBio: string;
  yearsExperience: number;
  experienceDisplay: string;
  profileImagePath: string;
  skills: string[];
  certifications: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecordedExpertVideo {
  id: string;
  expertId: string;
  title: string;
  description: string;
  videoUrl: string;
  embedUrl: string;
  category: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  category: 'AUTH' | 'ANNA_BUILD' | 'HUBSPOT_MUTATION' | 'BILLING' | 'MEMBER_MANAGEMENT';
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// ==========================================
// 8. HUBSPOT MCP & PORTAL HEALTH TYPES
// ==========================================
export type MetricVerificationStatus =
  | 'verified'
  | 'partial'
  | 'unavailable'
  | 'permission_denied'
  | 'unsupported'
  | 'stale'
  | 'error';

export interface StructuredMetricResponse {
  portalId: string;
  metric: string;
  value: any;
  status: MetricVerificationStatus;
  source: string;
  retrievedAt: string;
  isComplete: boolean;
  filtersApplied: string[];
  limitations: string[];
  displayTitle?: string;
  summary?: string;
  breakdown?: Array<{ label: string; count: number | string; percentage?: string }>;
  rawCount?: number;
}

export interface PortalAuditFinding {
  id: string;
  category: 'CRM_DATA' | 'SALES' | 'AUTOMATION' | 'MARKETING' | 'SERVICE';
  title: string;
  observedValue: string | number;
  dataSource: string;
  evidence: string;
  affectedRecords?: number;
  businessImpact: string;
  recommendation: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'WARNING' | 'INFO' | 'GOOD';
  retrievedAt: string;
  coverage: string;
  limitations: string[];
  buildModePrompt?: string;
}

export interface VerifiedStatisticItem {
  metric: string;
  actualValue: string | number;
  dataSource: string;
  retrievedAt: string;
  status: MetricVerificationStatus;
  notes?: string;
}

export interface PortalAuditActionItem {
  id: string;
  action: string;
  expectedBenefit: string;
  implementationApproach: string;
  estimatedComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  requiredPermissions: string;
  apiSupportStatus: 'SUPPORTED' | 'RESTRICTED' | 'MANUAL_ONLY';
  canAnnaImplement: boolean;
  requiresHumanApproval: boolean;
  buildModePrompt?: string;
}

export interface PortalAuditReport {
  portalId: string;
  portalName: string;
  retrievedAt: string;
  portalInfo: {
    accountName: string;
    portalId: string;
    auditDate: string;
    connectionStatus: 'VERIFIED' | 'CONNECTED' | 'ERROR';
    availablePermissions: string[];
    auditCoverage: string;
  };
  verifiedStatistics: VerifiedStatisticItem[];
  summary: {
    totalContacts: number | 'UNAVAILABLE';
    totalCompanies: number | 'UNAVAILABLE';
    totalDeals: number | 'UNAVAILABLE';
    totalTickets: number | 'UNAVAILABLE';
    totalOwners: number | 'UNAVAILABLE';
    openDeals: number | 'UNAVAILABLE';
    closedWonDeals: number | 'UNAVAILABLE';
    pipelineValue: string | 'UNAVAILABLE';
    unassignedContacts: number | 'UNAVAILABLE';
    unassignedCompanies: number | 'UNAVAILABLE';
    unassignedDeals: number | 'UNAVAILABLE';
    contactsMissingEmail: number | 'UNAVAILABLE';
    dealsMissingAmount: number | 'UNAVAILABLE';
    dealsMissingCloseDate: number | 'UNAVAILABLE';
    totalPipelines: number | 'UNAVAILABLE';
    totalDealStages: number | 'UNAVAILABLE';
    totalWorkflows: number | 'UNAVAILABLE';
    activeWorkflows: number | 'UNAVAILABLE';
    inactiveWorkflows: number | 'UNAVAILABLE';
  };
  findings: PortalAuditFinding[];
  prioritizedRecommendations: {
    critical: PortalAuditFinding[];
    high: PortalAuditFinding[];
    medium: PortalAuditFinding[];
    low: PortalAuditFinding[];
  };
  actionPlan: PortalAuditActionItem[];
}

export interface PortalHealthRecommendation {
  id: string;
  category: 'CRM_OVERVIEW' | 'SALES_HEALTH' | 'MARKETING_HEALTH' | 'DATA_QUALITY' | 'AUTOMATION_OPPORTUNITIES';
  finding: string;
  evidence: string;
  businessImpact: string;
  recommendedAction: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  canAnnaExecute: boolean;
  requiresHumanAssistance: boolean;
  status: 'PENDING' | 'APPROVED' | 'RESOLVED' | 'DISMISSED';
}

export interface PortalHealthAnalysis {
  id: string;
  organizationId: string;
  connectionId: string;
  portalId: string;
  analyzedAt: string;
  crmOverview: {
    totalContacts: number;
    totalCompanies: number;
    totalDeals: number;
    totalPipelines: number;
    totalWorkflows: number;
  };
  salesHealth: {
    activeDealsCount: number;
    staleDealsCount: number;
    unassignedDealsCount: number;
    pipelineStageDistribution: Record<string, number>;
  };
  marketingHealth: {
    leadsThisMonth: number;
    lifecycleStageDistribution: Record<string, number>;
    segmentationListsCount: number;
  };
  dataQuality: {
    missingImportantFieldsPercentage: number;
    unassignedContactsCount: number;
    duplicateSuspectsCount: number;
  };
  automationOpportunities: {
    workflowsActive: number;
    conflictingEnrollmentRulesCount: number;
    recommendedAutomations: string[];
  };
  recommendations: PortalHealthRecommendation[];
}

export interface UnifiedPortalMetrics {
  portalId: string;
  portalName: string;
  userEmail?: string;
  contacts: {
    total: number | null;
    unassigned: number | null;
    status: MetricVerificationStatus;
    notes?: string;
  };
  companies: {
    total: number | null;
    status: MetricVerificationStatus;
  };
  deals: {
    total: number | null;
    openCount: number | null;
    totalPipelineValue: number | null;
    formattedPipelineValue: string;
    status: MetricVerificationStatus;
  };
  dealPipelines?: {
    total: number | null;
    totalStages?: number | null;
    status: MetricVerificationStatus;
  };
  owners: {
    total: number | null;
    status: MetricVerificationStatus;
    list?: Array<{ id: string; name: string; email: string }>;
  };
  workflows: {
    total: number | null;
    active: number | null;
    inactive: number | null;
    status: MetricVerificationStatus;
    reason?: string;
  };
  tickets: {
    total: number | null;
    status: MetricVerificationStatus;
  };
  lastSyncedAt: string;
}


