import type { HubSpotActionCapability, HubSpotHub, HubSpotTier, HubSpotPortalConnection, SchemaDiffChange } from '@huboverse/types';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * ============================================================================
 * 1. HUBSPOT ACTION CAPABILITY REGISTRY
 * ============================================================================
 */
export const HUBSPOT_CAPABILITY_REGISTRY: Record<string, HubSpotActionCapability> = {
  // --- PROPERTIES & CRM SCHEMAS ---
  'hubspot.properties.create': {
    actionId: 'hubspot.properties.create',
    name: 'Create Custom Property',
    description: 'Creates a custom contact, company, or deal property with validation rules.',
    category: 'PROPERTIES',
    requiredScopes: ['crm.schemas.custom.read', 'crm.schemas.contacts.write'],
    minimumTier: {
      Marketing: 'Starter',
      Sales: 'Starter',
      Service: 'Starter',
      Operations: 'Starter',
      CMS: 'None',
    },
    riskLevel: 'LOW',
    requiresDualApproval: false,
    rollbackSupported: true,
  },
  'hubspot.properties.archive': {
    actionId: 'hubspot.properties.archive',
    name: 'Archive Custom Property',
    description: 'Safely archives a property from future form/API use while preserving historical data.',
    category: 'PROPERTIES',
    requiredScopes: ['crm.schemas.contacts.write'],
    minimumTier: {
      Marketing: 'Starter',
      Sales: 'Starter',
      Service: 'Starter',
      Operations: 'Starter',
      CMS: 'None',
    },
    riskLevel: 'MEDIUM',
    requiresDualApproval: false,
    rollbackSupported: true,
  },

  // --- PIPELINES & STAGES ---
  'hubspot.pipelines.create': {
    actionId: 'hubspot.pipelines.create',
    name: 'Create Deal / Ticket Pipeline',
    description: 'Creates a new multi-stage deal or ticket pipeline with defined probabilities.',
    category: 'PIPELINES',
    requiredScopes: ['crm.objects.deals.write'],
    minimumTier: {
      Marketing: 'None',
      Sales: 'Starter',
      Service: 'Starter',
      Operations: 'None',
      CMS: 'None',
    },
    riskLevel: 'LOW',
    requiresDualApproval: false,
    rollbackSupported: true,
  },
  'hubspot.pipelines.update_stages': {
    actionId: 'hubspot.pipelines.update_stages',
    name: 'Modify Pipeline Stages',
    description: 'Reorders or updates win-probabilities and stage names on an active pipeline.',
    category: 'PIPELINES',
    requiredScopes: ['crm.objects.deals.write'],
    minimumTier: {
      Marketing: 'None',
      Sales: 'Starter',
      Service: 'Starter',
      Operations: 'None',
      CMS: 'None',
    },
    riskLevel: 'MEDIUM',
    requiresDualApproval: false,
    rollbackSupported: true,
  },

  // --- WORKFLOWS & AUTOMATION ---
  'hubspot.workflows.inspect': {
    actionId: 'hubspot.workflows.inspect',
    name: 'Inspect Workflow Logic & Health',
    description: 'Analyzes enrollment triggers, branching conditions, and execution errors.',
    category: 'WORKFLOWS',
    requiredScopes: ['automation'],
    minimumTier: {
      Marketing: 'Professional',
      Sales: 'Professional',
      Service: 'Professional',
      Operations: 'Professional',
      CMS: 'None',
    },
    riskLevel: 'READ_ONLY',
    requiresDualApproval: false,
    rollbackSupported: false,
  },
  'hubspot.workflows.create_webhook_action': {
    actionId: 'hubspot.workflows.create_webhook_action',
    name: 'Add Webhook Action to Workflow',
    description: 'Injects an outbound webhook node into an existing workflow automation.',
    category: 'WORKFLOWS',
    requiredScopes: ['automation'],
    minimumTier: {
      Marketing: 'Professional',
      Sales: 'Professional',
      Service: 'Professional',
      Operations: 'Professional',
      CMS: 'None',
    },
    riskLevel: 'HIGH',
    requiresDualApproval: true,
    rollbackSupported: true,
  },

  // --- CRM AUDITS & ANALYTICS ---
  'hubspot.audit.database_hygiene': {
    actionId: 'hubspot.audit.database_hygiene',
    name: 'Run Full CRM Database Hygiene Audit',
    description: 'Detects duplicates, uncontacted leads, missing lifecycle stages, and bounce rates.',
    category: 'ANALYTICS',
    requiredScopes: ['crm.objects.contacts.read', 'crm.objects.companies.read', 'crm.objects.deals.read'],
    minimumTier: {
      Marketing: 'Free',
      Sales: 'Free',
      Service: 'Free',
      Operations: 'Free',
      CMS: 'None',
    },
    riskLevel: 'READ_ONLY',
    requiresDualApproval: false,
    rollbackSupported: false,
  },
};

const TIER_WEIGHTS: Record<HubSpotTier | 'None', number> = {
  None: 0,
  Free: 1,
  Starter: 2,
  Professional: 3,
  Enterprise: 4,
};

export interface CapabilityCheckResult {
  isSupported: boolean;
  action: HubSpotActionCapability;
  missingScopes: string[];
  insufficientTiers: Array<{ hub: HubSpotHub; required: HubSpotTier; current: HubSpotTier }>;
  reasons: string[];
}

export function checkCapability(
  actionId: string,
  installedScopes: string[],
  portalHubs: Record<HubSpotHub, HubSpotTier>
): CapabilityCheckResult {
  const capability = HUBSPOT_CAPABILITY_REGISTRY[actionId];
  if (!capability) {
    throw new Error(`Capability action '${actionId}' is not registered in HuboVerse capability registry.`);
  }

  const missingScopes = capability.requiredScopes.filter((scope) => !installedScopes.includes(scope));
  const insufficientTiers: Array<{ hub: HubSpotHub; required: HubSpotTier; current: HubSpotTier }> = [];
  const reasons: string[] = [];

  if (missingScopes.length > 0) {
    reasons.push(`Missing required OAuth scopes: ${missingScopes.join(', ')}`);
  }

  for (const [hub, requiredTier] of Object.entries(capability.minimumTier) as [HubSpotHub, HubSpotTier | 'None'][]) {
    if (requiredTier === 'None') continue;

    const currentTier = portalHubs[hub] || 'Free';
    if (TIER_WEIGHTS[currentTier] < TIER_WEIGHTS[requiredTier]) {
      insufficientTiers.push({ hub, required: requiredTier, current: currentTier });
      reasons.push(
        `Operation requires ${hub} Hub tier '${requiredTier}' or higher, but portal has '${currentTier}'.`
      );
    }
  }

  return {
    isSupported: missingScopes.length === 0 && insufficientTiers.length === 0,
    action: capability,
    missingScopes,
    insufficientTiers,
    reasons,
  };
}

/**
 * ============================================================================
 * 2. ENTERPRISE CREDENTIAL ENCRYPTION (AES-256-GCM)
 * ============================================================================
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export interface EncryptedPayload {
  iv: string;
  authTag: string;
  encryptedData: string;
}

export function encryptSecret(plainText: string, encryptionKeyHex: string): EncryptedPayload {
  const key = Buffer.from(encryptionKeyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('Encryption key must be exactly 32 bytes (64 hex characters).');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    authTag,
    encryptedData: encrypted,
  };
}

export function decryptSecret(payload: EncryptedPayload, encryptionKeyHex: string): string {
  const key = Buffer.from(encryptionKeyHex, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * ============================================================================
 * 3. HUBSPOT ENTERPRISE CLIENT (SCOPED EXECUTION & DRY-RUN DIFFS)
 * ============================================================================
 */
export interface DryRunResult {
  canExecute: boolean;
  actionId: string;
  diffPreview: SchemaDiffChange[];
  warningNotice?: string;
}

export class HubSpotEnterpriseClient {
  private connection: HubSpotPortalConnection;
  private decryptedAccessToken: string;

  constructor(connection: HubSpotPortalConnection, decryptedAccessToken: string) {
    this.connection = connection;
    this.decryptedAccessToken = decryptedAccessToken;
  }

  public async dryRun(actionId: string, params: Record<string, unknown>): Promise<DryRunResult> {
    const check = checkCapability(actionId, this.connection.installedScopes, this.connection.hubs);
    if (!check.isSupported) {
      return {
        canExecute: false,
        actionId,
        diffPreview: [],
        warningNotice: `Capability check failed: ${check.reasons.join(' | ')}`,
      };
    }

    const diffPreview: SchemaDiffChange[] = [];

    switch (actionId) {
      case 'hubspot.properties.create': {
        const objectType = String(params.objectType || 'contacts');
        const propertyName = String(params.name || 'custom_prop');
        const label = String(params.label || propertyName);
        const type = String(params.type || 'string');

        diffPreview.push({
          path: `${objectType}.properties.${propertyName}`,
          operation: 'CREATE',
          previousValue: null,
          newValue: { label, type, fieldType: params.fieldType || 'text' },
          description: `Add property '${label}' (${propertyName}) to object '${objectType}'.`,
        });
        break;
      }

      case 'hubspot.pipelines.create': {
        const pipelineLabel = String(params.label || 'New Pipeline');
        const stages = Array.isArray(params.stages) ? params.stages : ['Discovery', 'Qualified', 'Closed Won'];

        diffPreview.push({
          path: `deals.pipelines.${pipelineLabel.toLowerCase().replace(/\s+/g, '_')}`,
          operation: 'CREATE',
          previousValue: null,
          newValue: { label: pipelineLabel, stageCount: stages.length, stages },
          description: `Create deal pipeline '${pipelineLabel}' with ${stages.length} stages.`,
        });
        break;
      }

      default:
        diffPreview.push({
          path: `hubspot.action.${actionId}`,
          operation: 'UPDATE',
          previousValue: null,
          newValue: params,
          description: `Execute action ${actionId}`,
        });
    }

    return {
      canExecute: true,
      actionId,
      diffPreview,
    };
  }

  public async executeAction(
    actionId: string,
    params: Record<string, unknown>
  ): Promise<{ success: boolean; hubspotObjectId?: string; deepLink?: string; rollbackData?: Record<string, unknown> }> {
    const capability = HUBSPOT_CAPABILITY_REGISTRY[actionId];
    if (!capability) {
      throw new Error(`Unknown capability: ${actionId}`);
    }

    const simulatedObjectId = `hs_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const deepLink = `https://app.hubspot.com/settings/${this.connection.portalId}/properties`;

    return {
      success: true,
      hubspotObjectId: simulatedObjectId,
      deepLink,
      rollbackData: {
        actionId,
        createdObjectId: simulatedObjectId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Re-export client abstractions and utilities
export * from './client';
export * from './capability-registry';
export * from './encryption';

