import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnnaService } from './anna.service';

@ApiTags('Anna Central AI Operations')
@Controller('anna')
export class AnnaController {
  constructor(private readonly annaService: AnnaService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Process conversational inquiry with RAG citations and portal context' })
  async chat(@Body() body: { query: string; conversationId?: string }) {
    return this.annaService.processChat(body.query, body.conversationId || 'conv_01');
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
