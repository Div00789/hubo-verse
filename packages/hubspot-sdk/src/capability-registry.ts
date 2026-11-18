import { HubSpotActionCapability, HubSpotHub, HubSpotTier } from '@huboverse/types';

/**
 * HuboVerse HubSpot Action Capability Registry
 * Explicitly cataloging all operations Anna Build Mode and integrations can execute.
 * Ensures we NEVER assume all UI actions exist via API or that the client's portal
 * tier allows an operation.
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

/**
 * Verifies if an action is supported by the client portal's installed scopes and tier subscription.
 */
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

  // Check tier requirements
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
