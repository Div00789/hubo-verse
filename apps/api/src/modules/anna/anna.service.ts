import { Injectable } from '@nestjs/common';
import { runAnnaChatStep, initializeBuildExecution, commitBuildExecution } from '@huboverse/ai-agent';
import { DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

@Injectable()
export class AnnaService {
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
