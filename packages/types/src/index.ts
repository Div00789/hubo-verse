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
