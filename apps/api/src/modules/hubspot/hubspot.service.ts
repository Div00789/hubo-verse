import { Injectable } from '@nestjs/common';
import {
  checkCapability,
  HUBSPOT_CAPABILITY_REGISTRY,
  HubSpotOAuthManager,
  encryptToken,
  decryptToken,
} from '@huboverse/hubspot-sdk';
import {
  DEMO_HUBSPOT_CONNECTION,
  getPortalSchemaRegistry,
  savePortalSchemaRegistry,
} from '@huboverse/database';
import type { HubSpotPortalConnection, PortalSchemaRegistry } from '@huboverse/types';

@Injectable()
export class HubSpotService {
  private currentConnection: HubSpotPortalConnection = { ...DEMO_HUBSPOT_CONNECTION };
  private oauthManager: HubSpotOAuthManager;

  constructor() {
    this.oauthManager = new HubSpotOAuthManager(
      process.env.HUBSPOT_CLIENT_ID || 'demo_client_id',
      process.env.HUBSPOT_CLIENT_SECRET || 'demo_client_secret',
      process.env.HUBSPOT_REDIRECT_URI || 'http://localhost:3000/api/auth/hubspot/callback'
    );
  }

  async getCapabilities() {
    return Object.values(HUBSPOT_CAPABILITY_REGISTRY);
  }

  async checkPortalActionCapability(actionId: string) {
    return checkCapability(actionId, this.currentConnection.installedScopes, this.currentConnection.hubs);
  }

  async getAuthorizationUrl(state?: string) {
    const oauthState = state || `state_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const url = this.oauthManager.getAuthorizationUrl(oauthState);
    return { url, state: oauthState };
  }

  async handleOAuthCallback(code: string, state: string) {
    const tokens = await this.oauthManager.exchangeCodeForTokens(code);
    const tokenInfo = await this.oauthManager.verifyTokenInfo(tokens.access_token);

    // Encrypt tokens for secure multi-tenant storage
    const encryptionKey = process.env.HUBSPOT_TOKEN_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const encryptedAccess = encryptToken(tokens.access_token, encryptionKey);
    const encryptedRefresh = encryptToken(tokens.refresh_token, encryptionKey);

    this.currentConnection = {
      ...this.currentConnection,
      portalId: String(tokenInfo.hub_id || this.currentConnection.portalId),
      portalName: `HubSpot Portal #${tokenInfo.hub_id}`,
      hubspotDomain: tokenInfo.hub_domain || this.currentConnection.hubspotDomain,
      status: 'CONNECTED',
      installedScopes: tokenInfo.scopes || this.currentConnection.installedScopes,
      lastSyncedAt: new Date().toISOString(),
    };

    return {
      success: true,
      portalId: this.currentConnection.portalId,
      portalName: this.currentConnection.portalName,
      status: this.currentConnection.status,
    };
  }

  async getConnectionStatus() {
    return {
      ...this.currentConnection,
      isLiveConnected: this.currentConnection.status === 'CONNECTED',
    };
  }

  async disconnectPortal() {
    this.currentConnection = {
      ...this.currentConnection,
      status: 'DISCONNECTED',
      lastSyncedAt: new Date().toISOString(),
    };
    return { success: true, status: 'DISCONNECTED' };
  }

  async getPortalSchema(): Promise<PortalSchemaRegistry> {
    return getPortalSchemaRegistry(this.currentConnection.portalId);
  }

  async syncPortalSchema(): Promise<PortalSchemaRegistry> {
    const schema = getPortalSchemaRegistry(this.currentConnection.portalId);
    const refreshedSchema: PortalSchemaRegistry = {
      ...schema,
      refreshedAt: new Date().toISOString(),
    };
    savePortalSchemaRegistry(this.currentConnection.portalId, refreshedSchema);
    this.currentConnection.lastSyncedAt = new Date().toISOString();
    return refreshedSchema;
  }

  async handleWebhook(eventPayload: any) {
    console.log('[HubSpot Webhook Event Received]:', eventPayload);
    return { received: true, timestamp: new Date().toISOString() };
  }
}
