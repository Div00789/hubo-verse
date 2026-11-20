import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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

  @Get('oauth/authorize-url')
  @ApiOperation({ summary: 'Generate official HubSpot OAuth 2.0 authorization URL' })
  async getOAuthAuthorizeUrl(@Query('state') state?: string) {
    return this.hubspotService.getAuthorizationUrl(state);
  }

  @Get('oauth/callback')
  @ApiOperation({ summary: 'Handle OAuth redirect callback and exchange authorization code' })
  async handleOAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string
  ) {
    return this.hubspotService.handleOAuthCallback(code, state);
  }

  @Get('connection')
  @ApiOperation({ summary: 'Get current connected HubSpot portal status and granted scopes' })
  async getConnection() {
    return this.hubspotService.getConnectionStatus();
  }

  @Post('connection/disconnect')
  @ApiOperation({ summary: 'Disconnect the active HubSpot portal' })
  async disconnect() {
    return this.hubspotService.disconnectPortal();
  }

  @Get('schema')
  @ApiOperation({ summary: 'Retrieve verified portal schema registry (properties, pipelines, owners)' })
  async getSchema() {
    return this.hubspotService.getPortalSchema();
  }

  @Post('schema/sync')
  @ApiOperation({ summary: 'Trigger live schema discovery and refresh portal metadata' })
  async syncSchema() {
    return this.hubspotService.syncPortalSchema();
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Receive subscribed HubSpot CRM events (property changes, deals)' })
  async receiveWebhook(@Body() payload: any) {
    return this.hubspotService.handleWebhook(payload);
  }
}
