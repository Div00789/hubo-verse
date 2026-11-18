import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HubSpotService } from './hubspot.service';

@ApiTags('HubSpot Integration & Capability Registry')
@Controller('hubspot')
export class HubSpotController {
  constructor(private readonly hubspotService: HubSpotService) {}

  @Get('capabilities')
  @ApiOperation({ summary: 'List all registered HubSpot actions, required tiers, and risk levels' })
  async getCapabilities() {
    return this.hubspotService.getCapabilities();
  }

  @Get('capabilities/:actionId/verify')
  @ApiOperation({ summary: 'Verify if connected portal supports a specific action' })
  async verifyAction(@Param('actionId') actionId: string) {
    return this.hubspotService.checkPortalActionCapability(actionId);
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Receive subscribed HubSpot CRM events (property changes, deals)' })
  async receiveWebhook(@Body() payload: any) {
    return this.hubspotService.handleWebhook(payload);
  }
}
