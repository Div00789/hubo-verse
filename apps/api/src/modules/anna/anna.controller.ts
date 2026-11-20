import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnnaService } from './anna.service';
import type { WorkflowBlueprint } from '@huboverse/types';

@ApiTags('Anna Central AI Operations (Chat & Build Mode)')
@Controller('anna')
export class AnnaController {
  constructor(private readonly annaService: AnnaService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Process conversational inquiry with real HubSpot CRM read tools' })
  async chat(@Body() body: { query: string; conversationId?: string }) {
    return this.annaService.processChat(body.query, body.conversationId || 'conv_01');
  }

  @Post('build/plan')
  @ApiOperation({ summary: 'Synthesize verified Workflow Blueprint from plain-English instructions' })
  async planWorkflow(
    @Body()
    body: {
      goal: string;
      portalId?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    }
  ) {
    return this.annaService.generateWorkflowBlueprint(
      body.goal,
      body.portalId,
      body.conversationHistory
    );
  }

  @Post('build/deploy')
  @ApiOperation({ summary: 'Approve and deploy inactive workflow draft with read-back verification' })
  async deployWorkflow(
    @Body()
    body: {
      blueprint: WorkflowBlueprint;
      userId?: string;
      idempotencyKey?: string;
    }
  ) {
    return this.annaService.deployApprovedWorkflow(
      body.blueprint,
      body.userId || 'usr_sarah_cto',
      body.idempotencyKey
    );
  }

  @Post('build/initialize')
  @ApiOperation({ summary: 'Validate action capability and generate dry-run structural JSON diff' })
  async initializeBuild(@Body() body: { goal: string; userId?: string }) {
    return this.annaService.initializeBuild(body.goal, body.userId || 'usr_sarah_cto');
  }

  @Post('build/execute')
  @ApiOperation({ summary: 'Approve and commit verified CRM mutation into HubSpot' })
  async executeBuild(@Body() body: { execution: any; userId?: string }) {
    return this.annaService.executeApprovedBuild(body.execution, body.userId || 'usr_sarah_cto');
  }
}
