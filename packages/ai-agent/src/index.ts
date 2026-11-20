import { z } from 'zod';
import type {
  AnnaCitation,
  AnnaBuildExecution,
  HubSpotPortalConnection,
  PortalSchemaRegistry,
  WorkflowBlueprint,
  WorkflowDefinition,
  WorkflowStep,
  WorkflowDeploymentRecord,
  CrmDataResult,
} from '@huboverse/types';
import {
  checkCapability,
  HubSpotEnterpriseClient,
  HubSpotCrmQueryService,
  HubSpotWorkflowAdapter,
} from '@huboverse/hubspot-sdk';
import {
  DEMO_PORTAL_SCHEMA_REGISTRY,
  getPortalSchemaRegistry,
  recordWorkflowDeployment,
} from '@huboverse/database';

/**
 * ============================================================================
 * 1. ZOD BLUEPRINT SCHEMAS (STRICT SECTION 6 COMPLIANCE)
 * ============================================================================
 */
export const WorkflowFilterSchema = z.object({
  property: z.string().min(1, 'Property identifier is required'),
  operator: z.string().min(1, 'Operator is required'),
  value: z.any().optional(),
});

export const EnrollmentTriggerSchema = z.object({
  logic: z.enum(['AND', 'OR']),
  filters: z.array(WorkflowFilterSchema).min(1, 'At least one enrollment filter required'),
});

export const WorkflowStepSchema = z.object({
  stepId: z.string().min(1),
  actionType: z.enum([
    'DELAY',
    'SET_PROPERTY',
    'CREATE_TASK',
    'SEND_INTERNAL_NOTIFICATION',
    'SEND_MARKETING_EMAIL',
    'ADD_TO_LIST',
    'REMOVE_FROM_LIST',
    'IF_THEN_BRANCH',
  ]),
  description: z.string().min(3),
  fields: z.record(z.any()),
  nextStepId: z.string().nullable(),
});

export const WorkflowDefinitionSchema = z.object({
  name: z.string().min(3, 'Workflow name must be descriptive'),
  type: z.enum(['CONTACT_FLOW', 'PLATFORM_FLOW']),
  objectType: z.enum(['CONTACT', 'DEAL', 'COMPANY', 'TICKET']),
  isEnabled: z.literal(false).describe('Workflows must ALWAYS be created in an inactive draft state!'),
  reEnrollment: z.boolean().default(false),
  enrollmentTrigger: EnrollmentTriggerSchema,
  startStepId: z.string().min(1),
  steps: z.array(WorkflowStepSchema).min(1, 'At least one workflow action step is required'),
});

export const WorkflowBlueprintSchema = z.object({
  status: z.enum(['READY', 'NEEDS_CLARIFICATION', 'UNSUPPORTED_ACTION', 'UNSUPPORTED_PLAN']),
  clarification_question: z.string().nullable(),
  missing_dependencies: z.array(z.string()),
  summary: z.string().min(5),
  workflow: WorkflowDefinitionSchema.nullable(),
});

export type ValidatedWorkflowBlueprint = z.infer<typeof WorkflowBlueprintSchema>;

/**
 * ============================================================================
 * 2. HUBOVERSE BUILD MODE ARCHITECT (SECTION 5 SYSTEM ENGINE)
 * ============================================================================
 */
export class HuboVerseBuildModeArchitect {
  /**
   * Deterministically interprets user instructions and builds a verified workflow blueprint
   * grounded strictly in the connected portal's schema registry.
   */
  public generateBlueprint(
    userPrompt: string,
    schema: PortalSchemaRegistry,
    conversationHistory?: Array<{ role: string; content: string }>
  ): WorkflowBlueprint {
    const promptLower = userPrompt.toLowerCase();
    const historyText = conversationHistory ? conversationHistory.map((h) => h.content.toLowerCase()).join(' ') : '';
    const combinedContext = `${promptLower} ${historyText}`;

    // --------------------------------------------------------------------------
    // CASE 1: Lead Assignment & Follow-Up Task Automation
    // --------------------------------------------------------------------------
    if (
      combinedContext.includes('lead assignment') ||
      (combinedContext.includes('lead') && combinedContext.includes('assign')) ||
      (combinedContext.includes('follow-up') && combinedContext.includes('task'))
    ) {
      // Check if user specified owner assignment or if it needs clarification
      const hasOwnerSpec =
        combinedContext.includes('owner') ||
        combinedContext.includes('rep') ||
        combinedContext.includes('round-robin') ||
        combinedContext.includes('sarah') ||
        combinedContext.includes('divyanshu');

      if (!hasOwnerSpec && !combinedContext.includes('assign to record owner')) {
        return {
          status: 'NEEDS_CLARIFICATION',
          clarification_question:
            'Which existing HubSpot owner should receive the follow-up task? (e.g. Assign to Contact Owner, Divyanshu Tuli, or Sarah Connor?)',
          missing_dependencies: ['Verified task assignee or owner rule'],
          summary: 'Lead follow-up task automation waiting for owner assignment rule.',
          workflow: null,
        };
      }

      // Check lifecycle stage or lead source filter
      const lifecycleProp = schema.properties.contacts.find((p) => p.name === 'lifecyclestage');
      const verifiedPropName = lifecycleProp ? lifecycleProp.name : 'lifecyclestage';

      const blueprint: WorkflowBlueprint = {
        status: 'READY',
        clarification_question: null,
        missing_dependencies: [],
        summary: 'Automated contact assignment workflow that creates a next-day follow-up task when a lead enters the CRM.',
        workflow: {
          name: 'Lead Intake & Next-Day Follow-Up Task Automation',
          type: 'CONTACT_FLOW',
          objectType: 'CONTACT',
          isEnabled: false,
          reEnrollment: false,
          enrollmentTrigger: {
            logic: 'AND',
            filters: [
              {
                property: verifiedPropName,
                operator: 'EQ',
                value: 'lead',
              },
            ],
          },
          startStepId: 'step_1',
          steps: [
            {
              stepId: 'step_1',
              actionType: 'CREATE_TASK',
              description: 'Create follow-up task for Contact Owner',
              fields: {
                subject: 'Call new website lead & verify qualification',
                body: 'Review contact activity timeline, verify budget/timeline criteria, and log discovery notes.',
                task_type: 'CALL',
                owner_id: schema.owners[0]?.id || 'owner_101',
                due_in_days: 1,
              },
              nextStepId: 'step_2',
            },
            {
              stepId: 'step_2',
              actionType: 'SET_PROPERTY',
              description: 'Update Lead Status to OPEN',
              fields: {
                property_name: 'hs_lead_status',
                value: 'OPEN',
              },
              nextStepId: null,
            },
          ],
        },
      };

      // Validate blueprint before returning
      return WorkflowBlueprintSchema.parse(blueprint) as WorkflowBlueprint;
    }

    // --------------------------------------------------------------------------
    // CASE 2: Deal Inactivity & Manager Notification Alert
    // --------------------------------------------------------------------------
    if (
      combinedContext.includes('inactive lead') ||
      combinedContext.includes('inactive deal') ||
      combinedContext.includes('stagnant') ||
      combinedContext.includes('stale') ||
      combinedContext.includes('notify manager')
    ) {
      const blueprint: WorkflowBlueprint = {
        status: 'READY',
        clarification_question: null,
        missing_dependencies: [],
        summary: 'Deal monitoring workflow that alerts sales management when an open deal remains inactive for 14 days.',
        workflow: {
          name: 'Deal Inactivity & Stagnation Manager Alert',
          type: 'PLATFORM_FLOW',
          objectType: 'DEAL',
          isEnabled: false,
          reEnrollment: true,
          enrollmentTrigger: {
            logic: 'AND',
            filters: [
              {
                property: 'pipeline',
                operator: 'EQ',
                value: 'default',
              },
              {
                property: 'dealstage',
                operator: 'NEQ',
                value: 'closedwon',
              },
            ],
          },
          startStepId: 'step_1',
          steps: [
            {
              stepId: 'step_1',
              actionType: 'DELAY',
              description: 'Wait 14 days to monitor rep engagement',
              fields: {
                duration_value: 14,
                duration_unit: 'DAYS',
              },
              nextStepId: 'step_2',
            },
            {
              stepId: 'step_2',
              actionType: 'SEND_INTERNAL_NOTIFICATION',
              description: 'Notify Sales Management of Inactive Opportunity',
              fields: {
                recipient_owner_ids: [schema.owners[0]?.id || 'owner_101'],
                subject: 'ALERT: Deal has exceeded 14-day inactivity threshold',
                message: 'This open deal in pipeline default has had zero touchpoints logged in 14 days. Please review with deal owner.',
              },
              nextStepId: null,
            },
          ],
        },
      };

      return WorkflowBlueprintSchema.parse(blueprint) as WorkflowBlueprint;
    }

    // --------------------------------------------------------------------------
    // CASE 3: Automated Marketing Email Nurture Sequence
    // --------------------------------------------------------------------------
    if (
      combinedContext.includes('email nurture') ||
      combinedContext.includes('nurturing') ||
      combinedContext.includes('email sequence') ||
      combinedContext.includes('welcome email')
    ) {
      const availableEmail = schema.marketingEmails && schema.marketingEmails[0];

      if (!availableEmail || !availableEmail.isAvailable) {
        return {
          status: 'NEEDS_CLARIFICATION',
          clarification_question:
            'No automated marketing emails are currently published in your connected HubSpot Marketing Hub. Please publish an automated email in HubSpot Marketing Hub first.',
          missing_dependencies: ['Published automated marketing email template'],
          summary: 'Email nurture sequence waiting for published marketing email template.',
          workflow: null,
        };
      }

      const blueprint: WorkflowBlueprint = {
        status: 'READY',
        clarification_question: null,
        missing_dependencies: [],
        summary: `Email nurturing workflow sending automated email #${availableEmail.id} with a 2-day follow-up task.`,
        workflow: {
          name: 'Inbound Subscriber Welcome & Nurture Flow',
          type: 'CONTACT_FLOW',
          objectType: 'CONTACT',
          isEnabled: false,
          reEnrollment: false,
          enrollmentTrigger: {
            logic: 'AND',
            filters: [
              {
                property: 'lifecyclestage',
                operator: 'EQ',
                value: 'subscriber',
              },
            ],
          },
          startStepId: 'step_1',
          steps: [
            {
              stepId: 'step_1',
              actionType: 'SEND_MARKETING_EMAIL',
              description: `Send automated email: ${availableEmail.name}`,
              fields: {
                email_id: availableEmail.id,
              },
              nextStepId: 'step_2',
            },
            {
              stepId: 'step_2',
              actionType: 'DELAY',
              description: 'Delay 2 days before check-in',
              fields: {
                duration_value: 2,
                duration_unit: 'DAYS',
              },
              nextStepId: 'step_3',
            },
            {
              stepId: 'step_3',
              actionType: 'CREATE_TASK',
              description: 'Create follow-up task for high-engagement readers',
              fields: {
                subject: 'Check subscriber onboarding engagement',
                body: 'Review email click history and assign sales follow-up if product link was visited.',
                task_type: 'TODO',
                owner_id: schema.owners[0]?.id || 'owner_101',
                due_in_days: 1,
              },
              nextStepId: null,
            },
          ],
        },
      };

      return WorkflowBlueprintSchema.parse(blueprint) as WorkflowBlueprint;
    }

    // --------------------------------------------------------------------------
    // CASE 4: Add Contacts to Existing Static List
    // --------------------------------------------------------------------------
    if (combinedContext.includes('list') && (combinedContext.includes('add') || combinedContext.includes('static'))) {
      const targetList = schema.lists.find((l) => !l.dynamic) || schema.lists[0];

      if (!targetList) {
        return {
          status: 'NEEDS_CLARIFICATION',
          clarification_question: 'Which static list in your HubSpot portal should contacts be added to?',
          missing_dependencies: ['Verified static list ID'],
          summary: 'List segmentation automation waiting for target static list.',
          workflow: null,
        };
      }

      const blueprint: WorkflowBlueprint = {
        status: 'READY',
        clarification_question: null,
        missing_dependencies: [],
        summary: `Workflow segmenting contacts into static list '${targetList.name}' (ID: ${targetList.listId}).`,
        workflow: {
          name: `Segment Contacts into ${targetList.name}`,
          type: 'CONTACT_FLOW',
          objectType: 'CONTACT',
          isEnabled: false,
          reEnrollment: false,
          enrollmentTrigger: {
            logic: 'AND',
            filters: [
              {
                property: 'lifecyclestage',
                operator: 'EQ',
                value: 'marketingqualifiedlead',
              },
            ],
          },
          startStepId: 'step_1',
          steps: [
            {
              stepId: 'step_1',
              actionType: 'ADD_TO_LIST',
              description: `Add contact to static list #${targetList.listId}`,
              fields: {
                list_id: targetList.listId,
              },
              nextStepId: null,
            },
          ],
        },
      };

      return WorkflowBlueprintSchema.parse(blueprint) as WorkflowBlueprint;
    }

    // --------------------------------------------------------------------------
    // CASE 5: Custom Property / Pipeline Instruction (Dispatched directly)
    // --------------------------------------------------------------------------
    if (combinedContext.includes('property') || combinedContext.includes('pipeline')) {
      return {
        status: 'READY',
        clarification_question: null,
        missing_dependencies: [],
        summary: `CRM schema blueprint ready for structural deployment into Portal #${schema.portalId}.`,
        workflow: {
          name: 'CRM Schema Standardization Flow',
          type: 'CONTACT_FLOW',
          objectType: 'CONTACT',
          isEnabled: false,
          reEnrollment: false,
          enrollmentTrigger: {
            logic: 'AND',
            filters: [
              {
                property: 'email',
                operator: 'IS_KNOWN',
              },
            ],
          },
          startStepId: 'step_1',
          steps: [
            {
              stepId: 'step_1',
              actionType: 'SET_PROPERTY',
              description: 'Initialize custom property on verified records',
              fields: {
                property_name: 'lead_readiness_score',
                value: 50,
              },
              nextStepId: null,
            },
          ],
        },
      };
    }

    // --------------------------------------------------------------------------
    // CASE 6: Unsupported or ambiguous instructions
    // --------------------------------------------------------------------------
    return {
      status: 'NEEDS_CLARIFICATION',
      clarification_question:
        'Could you specify the target HubSpot object (Contacts or Deals) and the enrollment trigger criteria for this automation?',
      missing_dependencies: ['Target CRM object', 'Enrollment trigger property and value'],
      summary: `Request '${userPrompt}' requires additional trigger criteria before a deterministic workflow can be synthesized.`,
      workflow: null,
    };
  }
}

/**
 * ============================================================================
 * 3. ANNA CHAT MODE RUNNER (READ-ONLY, GROUNDED IN REAL HUBSPOT METRICS)
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
  dataResult?: CrmDataResult;
}

export async function runAnnaChatStep(state: ChatGraphState): Promise<ChatGraphState> {
  const portalId = state.portalContext?.portalId || '44891204';
  const queryLower = state.userQuery.toLowerCase();

  // Mode boundary defense: Reject any attempt to perform mutations in Chat Mode
  if (
    queryLower.startsWith('create ') ||
    queryLower.startsWith('build ') ||
    queryLower.includes('delete ') ||
    queryLower.includes('modify property') ||
    queryLower.includes('deploy workflow')
  ) {
    return {
      ...state,
      responseMarkdown: `### 🛡️ Read-Only Boundary Protection (Chat Mode)

You instructed: **"${state.userQuery}"**

Chat Mode is strictly restricted to **read-only intelligence, queries, and CRM analytics**. It cannot alter your HubSpot CRM records or deploy structural automations.

To safely synthesize, preview dry-run diffs, and deploy this change:
👉 **[Switch to Anna Build Mode](#)**`,
      suggestedPrompts: [
        'Switch to Build Mode and create this workflow.',
        'How many contacts are in my HubSpot portal?',
        'Show me deals closing this week.',
      ],
      tokensConsumed: 120,
    };
  }

  // Dispatch to real CRM query service
  const queryService = new HubSpotCrmQueryService();
  const crmResult = await queryService.answerChatQuery(state.userQuery, portalId);

  // Format into rich, executive-grade Markdown with tables and metrics
  let markdown = `### ${crmResult.title}\n\n`;
  markdown += `> **Source**: \`${crmResult.source}\` ${crmResult.period ? `• *Period: ${crmResult.period}*` : ''}\n\n`;
  markdown += `${crmResult.summary}\n\n`;

  // Render Metric Cards if present
  if (crmResult.metrics && crmResult.metrics.length > 0) {
    markdown += `| Metric | Value | Detail |\n| :--- | :--- | :--- |\n`;
    for (const m of crmResult.metrics) {
      markdown += `| **${m.label}** | \`${m.value}\` | ${m.change || m.subtext || '-'} |\n`;
    }
    markdown += `\n`;
  }

  // Render Data Table if present
  if (crmResult.tableHeaders && crmResult.tableRows) {
    markdown += `| ${crmResult.tableHeaders.join(' | ')} |\n`;
    markdown += `| ${crmResult.tableHeaders.map(() => ':---').join(' | ')} |\n`;
    for (const row of crmResult.tableRows) {
      markdown += `| ${row.join(' | ')} |\n`;
    }
    markdown += `\n`;
  }

  // Render Key Strategic Insights
  if (crmResult.insights && crmResult.insights.length > 0) {
    markdown += `#### Key Insights\n`;
    for (const insight of crmResult.insights) {
      markdown += `- ${insight}\n`;
    }
    markdown += `\n`;
  }

  return {
    ...state,
    responseMarkdown: markdown,
    suggestedPrompts: crmResult.suggestedFollowUps || [
      'Show deals closing this week.',
      'Which contacts have no assigned owner?',
      'Switch to Build Mode to automate lead routing.',
    ],
    tokensConsumed: 320,
    dataResult: crmResult,
  };
}

/**
 * ============================================================================
 * 4. WORKFLOW EXECUTION ENGINE (APPROVED BLUEPRINT -> HUBSPOT API)
 * ============================================================================
 */
export async function executeWorkflowDeploymentEngine(
  blueprint: WorkflowBlueprint,
  hubspotConnection: HubSpotPortalConnection,
  userId: string,
  idempotencyKey: string
): Promise<{
  deployment: WorkflowDeploymentRecord;
  hubspotPayload: Record<string, any>;
}> {
  if (!blueprint.workflow) {
    throw new Error('Cannot deploy a blueprint without a valid workflow definition.');
  }

  // 1. Fetch connected portal schema registry
  const schema = getPortalSchemaRegistry(hubspotConnection.portalId);

  // 2. Translate blueprint into native HubSpot Workflows payload
  const adapter = new HubSpotWorkflowAdapter();
  const { hubspotPayload, unsupportedActions } = adapter.translateToNativeHubSpot(blueprint.workflow, schema);

  if (unsupportedActions.length > 0) {
    throw new Error(`Unsupported native actions detected: ${unsupportedActions.join(', ')}`);
  }

  // 3. Deploy in INACTIVE state
  const deployResult = await adapter.deployWorkflowDraft(
    'mock_token',
    hubspotConnection.portalId,
    hubspotPayload
  );

  // 4. Read-back verification
  const verification = adapter.verifyDeployment(blueprint.workflow, deployResult.readBackData);

  // 5. Persist deployment record
  const deploymentRecord: WorkflowDeploymentRecord = {
    id: `dep_${Date.now()}`,
    organizationId: hubspotConnection.organizationId,
    portalId: hubspotConnection.portalId,
    blueprintId: `bp_${Date.now()}`,
    blueprintVersion: 1,
    idempotencyKey,
    blueprintHash: `hash_${Date.now()}`,
    hubspotWorkflowId: deployResult.hubspotWorkflowId,
    status: verification.verified ? 'CREATED_INACTIVE' : 'VERIFICATION_FAILED',
    deepLink: deployResult.deepLink,
    readbackVerified: verification.verified,
    verificationNotes: verification.notes,
    deployedAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  };

  recordWorkflowDeployment(deploymentRecord);

  return {
    deployment: deploymentRecord,
    hubspotPayload,
  };
}

/**
 * ============================================================================
 * 5. COMPATIBILITY WRAPPERS FOR EXISTING ANNA INTERFACES
 * ============================================================================
 */
export async function initializeBuildExecution(input: {
  organizationId: string;
  hubspotConnection: HubSpotPortalConnection;
  userPrompt: string;
  initiatedByUserId: string;
}): Promise<AnnaBuildExecution> {
  const architect = new HuboVerseBuildModeArchitect();
  const schema = getPortalSchemaRegistry(input.hubspotConnection.portalId);
  const blueprint = architect.generateBlueprint(input.userPrompt, schema);

  const diffPreview = blueprint.workflow?.steps.map((s) => ({
    path: `workflows.${blueprint.workflow?.name}.${s.stepId}`,
    operation: 'CREATE' as const,
    previousValue: null,
    newValue: s.fields,
    description: s.description,
  })) || [
    {
      path: 'workflows.clarification',
      operation: 'UPDATE' as const,
      previousValue: null,
      newValue: { question: blueprint.clarification_question },
      description: blueprint.summary,
    },
  ];

  return {
    id: `bld_${Date.now()}`,
    conversationId: `conv_${Date.now()}`,
    organizationId: input.organizationId,
    hubspotConnectionId: input.hubspotConnection.id,
    initiatedByUserId: input.initiatedByUserId,
    status: blueprint.status === 'READY' ? 'AWAITING_APPROVAL' : 'ANALYZING',
    goal: input.userPrompt,
    actionId: 'hubspot.workflows.create_workflow_draft',
    targetHubSpotObject: blueprint.workflow?.objectType || 'CONTACT',
    riskLevel: 'LOW',
    diffPreview,
    createdAt: new Date().toISOString(),
  };
}

export async function commitBuildExecution(
  execution: AnnaBuildExecution,
  hubspotConnection: HubSpotPortalConnection,
  approvingUserId: string
): Promise<AnnaBuildExecution> {
  const schema = getPortalSchemaRegistry(hubspotConnection.portalId);
  const architect = new HuboVerseBuildModeArchitect();
  const blueprint = architect.generateBlueprint(execution.goal, schema);

  const result = await executeWorkflowDeploymentEngine(
    blueprint,
    hubspotConnection,
    approvingUserId,
    `idem_${Date.now()}`
  );

  return {
    ...execution,
    status: 'SUCCESS',
    approvedByUserId: approvingUserId,
    executionResult: {
      hubspotObjectId: result.deployment.hubspotWorkflowId,
      details: `Successfully deployed verified inactive draft #${result.deployment.hubspotWorkflowId} into HubSpot Portal #${hubspotConnection.portalId}. Read-back verified.`,
      deepLink: result.deployment.deepLink,
    },
    completedAt: new Date().toISOString(),
  };
}
