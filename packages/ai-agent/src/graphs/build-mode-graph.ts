import { AnnaBuildExecution, HubSpotPortalConnection } from '@huboverse/types';
import { checkCapability, HubSpotEnterpriseClient } from '@huboverse/hubspot-sdk';

export interface BuildGraphInput {
  organizationId: string;
  hubspotConnection: HubSpotPortalConnection;
  userPrompt: string;
  initiatedByUserId: string;
}

/**
 * Anna Build Mode State Machine
 * Executes the 4-Stage Safe Execution Pipeline.
 */
export async function initializeBuildExecution(input: BuildGraphInput): Promise<AnnaBuildExecution> {
  const promptLower = input.userPrompt.toLowerCase();
  let actionId = 'hubspot.properties.create';
  let targetObject = 'contacts';
  let goal = input.userPrompt;
  const executionId = `bld_${Date.now()}`;

  const params: Record<string, unknown> = {
    objectType: 'contacts',
    name: 'lead_readiness_score',
    label: 'Lead Readiness Score',
    type: 'number',
    fieldType: 'number',
  };

  if (promptLower.includes('pipeline') || promptLower.includes('deal')) {
    actionId = 'hubspot.pipelines.create';
    targetObject = 'deals';
    goal = 'Create Enterprise Retainer Deal Pipeline';
    params.label = 'Enterprise Retainers';
    params.stages = [
      { label: 'Discovery Call Scheduled', probability: 0.1 },
      { label: 'Technical Scope & Audit', probability: 0.3 },
      { label: 'Proposal & SOW Sent', probability: 0.6 },
      { label: 'Contract Under Legal Review', probability: 0.8 },
      { label: 'Closed Won / Active Client', probability: 1.0 },
    ];
  } else if (promptLower.includes('score') || promptLower.includes('property')) {
    actionId = 'hubspot.properties.create';
    targetObject = 'contacts';
    goal = 'Create Lead Readiness Score Contact Property';
  }

  // 1. Stage 1: Capability Registry Check
  const capabilityCheck = checkCapability(
    actionId,
    input.hubspotConnection.installedScopes,
    input.hubspotConnection.hubs
  );

  if (!capabilityCheck.isSupported) {
    return {
      id: executionId,
      conversationId: `conv_${Date.now()}`,
      organizationId: input.organizationId,
      hubspotConnectionId: input.hubspotConnection.id,
      initiatedByUserId: input.initiatedByUserId,
      status: 'FAILED',
      goal,
      actionId,
      targetHubSpotObject: targetObject,
      riskLevel: capabilityCheck.action.riskLevel,
      diffPreview: [],
      errorMessage: `Blocked by Capability Registry: ${capabilityCheck.reasons.join(' | ')}`,
      createdAt: new Date().toISOString(),
    };
  }

  // 2. Stage 2: Dry-run and Diff Preview
  const client = new HubSpotEnterpriseClient(input.hubspotConnection, 'mock_token');
  const dryRun = await client.dryRun(actionId, params);

  return {
    id: executionId,
    conversationId: `conv_${Date.now()}`,
    organizationId: input.organizationId,
    hubspotConnectionId: input.hubspotConnection.id,
    initiatedByUserId: input.initiatedByUserId,
    status: 'AWAITING_APPROVAL',
    goal,
    actionId,
    targetHubSpotObject: targetObject,
    riskLevel: capabilityCheck.action.riskLevel,
    diffPreview: dryRun.diffPreview,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Commits approved change to HubSpot.
 */
export async function commitBuildExecution(
  execution: AnnaBuildExecution,
  hubspotConnection: HubSpotPortalConnection,
  approvingUserId: string
): Promise<AnnaBuildExecution> {
  const client = new HubSpotEnterpriseClient(hubspotConnection, 'mock_token');
  const result = await client.executeAction(execution.actionId, { target: execution.targetHubSpotObject });

  return {
    ...execution,
    status: 'SUCCESS',
    approvedByUserId: approvingUserId,
    executionResult: {
      hubspotObjectId: result.hubspotObjectId,
      details: `Successfully deployed change into HubSpot Portal #${hubspotConnection.portalId}.`,
      deepLink: result.deepLink,
    },
    rollbackSnapshot: result.rollbackData,
    completedAt: new Date().toISOString(),
  };
}
