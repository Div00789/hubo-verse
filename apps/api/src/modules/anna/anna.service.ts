import { Injectable } from '@nestjs/common';
import {
  runAnnaChatStep,
  HuboVerseBuildModeArchitect,
  executeWorkflowDeploymentEngine,
  initializeBuildExecution,
  commitBuildExecution,
} from '@huboverse/ai-agent';
import {
  DEMO_HUBSPOT_CONNECTION,
  getPortalSchemaRegistry,
} from '@huboverse/database';
import type { WorkflowBlueprint } from '@huboverse/types';

@Injectable()
export class AnnaService {
  private architect = new HuboVerseBuildModeArchitect();

  async processChat(query: string, conversationId: string) {
    return runAnnaChatStep({
      conversationId: conversationId || 'conv_01',
      userQuery: query,
      organizationId: 'org_enterprise_01',
      portalContext: {
        portalId: DEMO_HUBSPOT_CONNECTION.portalId,
        hubs: DEMO_HUBSPOT_CONNECTION.hubs,
      },
      retrievedCitations: [],
      responseMarkdown: '',
      suggestedPrompts: [],
      tokensConsumed: 0,
    });
  }

  async generateWorkflowBlueprint(
    goal: string,
    portalId?: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<WorkflowBlueprint> {
    const targetPortalId = portalId || DEMO_HUBSPOT_CONNECTION.portalId;
    const schema = getPortalSchemaRegistry(targetPortalId);
    return this.architect.generateBlueprint(goal, schema, conversationHistory);
  }

  async deployApprovedWorkflow(
    blueprint: WorkflowBlueprint,
    userId: string,
    idempotencyKey?: string
  ) {
    const idemKey = idempotencyKey || `idem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return executeWorkflowDeploymentEngine(
      blueprint,
      DEMO_HUBSPOT_CONNECTION,
      userId || 'usr_sarah_cto',
      idemKey
    );
  }

  async initializeBuild(goal: string, userId: string) {
    return initializeBuildExecution({
      organizationId: 'org_enterprise_01',
      hubspotConnection: DEMO_HUBSPOT_CONNECTION,
      userPrompt: goal,
      initiatedByUserId: userId || 'usr_sarah_cto',
    });
  }

  async executeApprovedBuild(executionPayload: any, userId: string) {
    return commitBuildExecution(
      executionPayload,
      DEMO_HUBSPOT_CONNECTION,
      userId || 'usr_sarah_cto'
    );
  }
}
