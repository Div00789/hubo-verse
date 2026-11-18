import { z } from 'zod';
import type { AnnaCitation, AnnaBuildExecution, HubSpotPortalConnection } from '@huboverse/types';
import { checkCapability, HubSpotEnterpriseClient } from '@huboverse/hubspot-sdk';

/**
 * ============================================================================
 * 1. HUBSPOT TOOL SCHEMAS & TYPES
 * ============================================================================
 */
export const CreatePropertyToolSchema = z.object({
  objectType: z.enum(['contacts', 'companies', 'deals', 'tickets']).describe('Target HubSpot CRM object type'),
  name: z.string().regex(/^[a-z_][a-z0-9_]*$/).describe('Internal programmatic name (lowercase, underscores)'),
  label: z.string().min(2).max(100).describe('User-facing display label in HubSpot UI'),
  type: z.enum(['string', 'number', 'date', 'enumeration']).describe('HubSpot data type'),
  fieldType: z.enum(['text', 'number', 'select', 'date', 'textarea']).describe('UI form input type'),
  groupName: z.string().default('contactinformation').describe('HubSpot property group'),
  description: z.string().optional().describe('Documentation explanation of property purpose'),
});

export const CreatePipelineToolSchema = z.object({
  objectType: z.enum(['deals', 'tickets']).describe('Pipeline object type'),
  label: z.string().min(2).max(100).describe('Pipeline display name'),
  stages: z
    .array(
      z.object({
        label: z.string(),
        probability: z.number().min(0).max(1),
      })
    )
    .min(2)
    .describe('Ordered pipeline stages with win probabilities'),
});

export const SearchKnowledgeSchema = z.object({
  query: z.string().min(3).describe('Search term for HubSpot docs, HuboVerse academy transcripts, or best practices'),
  category: z.enum(['ALL', 'WORKFLOWS', 'PROPERTIES', 'REPORTING', 'ACADEMY']).default('ALL'),
});

export type CreatePropertyInput = z.infer<typeof CreatePropertyToolSchema>;
export type CreatePipelineInput = z.infer<typeof CreatePipelineToolSchema>;
export type SearchKnowledgeInput = z.infer<typeof SearchKnowledgeSchema>;

/**
 * ============================================================================
 * 2. ANNA CHAT MODE GRAPH STATE & RUNNER
 * ============================================================================
 */
export interface ChatGraphState {
  conversationId: string;
  userQuery: string;
  organizationId: string;
  portalContext?: {
    portalId: string;
    hubs: Record<string, string>;
  };
  retrievedCitations: AnnaCitation[];
  responseMarkdown: string;
  suggestedPrompts: string[];
  tokensConsumed: number;
}

export async function runAnnaChatStep(state: ChatGraphState): Promise<ChatGraphState> {
  const citations: AnnaCitation[] = [];

  if (state.userQuery.toLowerCase().includes('lead scoring') || state.userQuery.toLowerCase().includes('score')) {
    citations.push({
      id: 'cite_1',
      sourceType: 'HUBSPOT_DOC',
      title: 'HubSpot Predictive Lead Scoring & Custom Criteria',
      snippet: 'Lead scoring allows teams to assign numeric values to contacts based on behavioral events and profile attributes.',
      url: 'https://knowledge.hubspot.com/crm-setup/set-up-lead-scoring',
    });
    citations.push({
      id: 'cite_2',
      sourceType: 'ACADEMY_LESSON',
      title: 'HuboVerse Masterclass: Enterprise Scoring Workflows (Module 3)',
      snippet: 'Negative scoring attributes (unsubscribes, invalid domains, inactivity > 90d) are critical to prevent CRM bloat.',
    });
  } else if (state.userQuery.toLowerCase().includes('workflow') || state.userQuery.toLowerCase().includes('enroll')) {
    citations.push({
      id: 'cite_3',
      sourceType: 'HUBSPOT_DOC',
      title: 'Troubleshooting Workflow Enrollment Triggers',
      snippet: 'Common causes of un-enrolled contacts: re-enrollment criteria disabled, un-met filter triggers, or active suppression lists.',
      url: 'https://knowledge.hubspot.com/workflows/troubleshoot-workflow-enrollment',
    });
  }

  let response = '';
  let followUps: string[] = [];

  if (state.userQuery.toLowerCase().includes('lead scoring')) {
    response = `### How HubSpot Lead Scoring Works & Best Practices

HubSpot offers both **Traditional Manual Scoring** (rules-based points) and **Predictive Lead Scoring** (powered by machine learning for Marketing Pro & Enterprise tiers).

1. **Explicit Scoring (Demographic / Firmographic)**:
   - Assign positive points for target Job Titles (e.g., *VP, Director, Head of CRM* +15 pts).
   - Assign points for target Company Size and Revenue.
2. **Implicit Scoring (Behavioral / Engagement)**:
   - Form Submissions (High-intent demo request: +30 pts; eBook download: +5 pts).
   - High-value page visits (Pricing page visited $\\ge 2$ times: +20 pts).
   - Marketing Email interactions (3 consecutive opens: +10 pts).
3. **Negative Scoring (Decay & Qualification Filters)**:
   - Inactive for $>60$ days: -15 pts.
   - Non-business email domains (e.g., \`@gmail.com\`, \`@yahoo.com\`): -10 pts.

> **HuboVerse Recommendation:** Do not set workflow triggers immediately to Sales Qualified Lead (SQL) on score thresholds until you calibrate your model against historical close rates.`;

    followUps = [
      'Anna, switch to Build Mode and set up Lead Scoring properties for my portal.',
      'How do I create an automatic decay workflow after 45 days of inactivity?',
      'Show me the HuboVerse Academy module on Lead Lifecycle Mapping.',
    ];
  } else {
    response = `I analyzed your portal configuration for **Portal #${state.portalContext?.portalId || 'Primary'}**.

Regarding your inquiry: "${state.userQuery}"

Based on HuboVerse best-practice architecture:
- Ensure your custom properties adhere to naming conventions (\`snake_case\` internal identifiers).
- For automated workflow actions, verify that your portal holds the appropriate HubSpot Professional or Enterprise tier.
- You can activate **Anna Build Mode** at any time to preview and execute verified CRM changes with safety diffs.`;

    followUps = [
      'Anna, run a database hygiene audit on our portal.',
      'What are our current HubSpot API scope limits?',
      'Help me design a multi-touch attribution workflow.',
    ];
  }

  return {
    ...state,
    retrievedCitations: citations,
    responseMarkdown: response,
    suggestedPrompts: followUps,
    tokensConsumed: 480,
  };
}

/**
 * ============================================================================
 * 3. ANNA BUILD MODE ORCHESTRATION & SAFE EXECUTION PIPELINE
 * ============================================================================
 */
export interface BuildGraphInput {
  organizationId: string;
  hubspotConnection: HubSpotPortalConnection;
  userPrompt: string;
  initiatedByUserId: string;
}

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
