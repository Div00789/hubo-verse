import { Injectable } from '@nestjs/common';
import { checkCapability, HUBSPOT_CAPABILITY_REGISTRY } from '@huboverse/hubspot-sdk';
import { DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

@Injectable()
export class HubSpotService {
  async getCapabilities() {
    return Object.values(HUBSPOT_CAPABILITY_REGISTRY);
  }

  async checkPortalActionCapability(actionId: string) {
    const conn = DEMO_HUBSPOT_CONNECTION;
    return checkCapability(actionId, conn.installedScopes, conn.hubs);
  }

  async handleWebhook(eventPayload: any) {
    console.log('[HubSpot Webhook Event Received]:', eventPayload);
    return { received: true, timestamp: new Date().toISOString() };
  }
}
