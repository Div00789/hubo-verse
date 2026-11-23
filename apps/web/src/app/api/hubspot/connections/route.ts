import { NextRequest, NextResponse } from 'next/server';
import {
  getAllHubSpotConnections,
  getHubSpotConnectionByPortalId,
  saveHubSpotConnection,
  deleteHubSpotConnection,
  getActiveRuntimePortalId,
  setActiveRuntimePortalId,
  getPortalSchemaRegistry,
  DEMO_HUBSPOT_CONNECTION,
  DEMO_PORTAL_SCHEMA_REGISTRY,
} from '@huboverse/database';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.HUBSPOT_CLIENT_ID || process.env.HUBSPOT_MCP_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET || process.env.HUBSPOT_MCP_CLIENT_SECRET;
  const isOAuthConfigured = Boolean(
    clientId && clientId !== 'demo_client_id' && clientSecret
  );

  const activePortalCookie = request.cookies.get('active_hubspot_portal')?.value;
  const allConnections = getAllHubSpotConnections();

  // Determine active portal ID
  let activePortalId = activePortalCookie;
  if (!activePortalId || !allConnections.some((c) => c.portalId === activePortalId)) {
    activePortalId = allConnections.length > 0 ? allConnections[0].portalId : getActiveRuntimePortalId();
  }

  // Format connections safely (never expose raw secrets to client)
  const formattedConnections = allConnections.map((conn) => {
    const schema = getPortalSchemaRegistry(conn.portalId);
    return {
      id: conn.id,
      portalId: conn.portalId,
      portalName: conn.portalName,
      hubspotDomain: conn.hubspotDomain || `app.hubspot.com/reports-dashboard/${conn.portalId}`,
      status: conn.status,
      installedScopes: conn.installedScopes || [],
      hubs: conn.hubs || DEMO_HUBSPOT_CONNECTION.hubs,
      isLiveConnected: conn.status === 'CONNECTED',
      lastSuccessfulCheck: conn.lastSuccessfulCheck || new Date().toLocaleTimeString(),
      connectedUser: conn.connectedUser || conn.connectedByUserId || 'Authorized User',
      connectedAt: conn.connectedAt,
      lastSyncedAt: conn.lastSyncedAt,
      authMethod: conn.authMethod || 'OAUTH',
      verifiedPropertiesCount:
        (schema.properties.contacts?.length || 0) + (schema.properties.deals?.length || 0),
      verifiedPipelinesCount: schema.pipelines.deals?.length || 0,
      verifiedOwnersCount: schema.owners?.length || 0,
      verifiedWorkflowsCount: schema.existingWorkflows?.length || 0,
    };
  });

  const response = NextResponse.json({
    isOAuthConfigured,
    activePortalId,
    connections: formattedConnections,
    totalConnections: formattedConnections.length,
  });

  if (activePortalId && (!activePortalCookie || activePortalCookie !== activePortalId)) {
    response.cookies.set('active_hubspot_portal', activePortalId, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, portalId } = body;

    const allConnections = getAllHubSpotConnections();

    if (action === 'add_portal') {
      const { targetPortalId, portalName, accessToken, refreshToken, connectedUser } = body;
      const cleanId = String(targetPortalId || portalId || '').trim();
      if (!cleanId) {
        return NextResponse.json(
          { error: 'MISSING_PORTAL_ID', message: 'Valid HubSpot Portal ID is required.' },
          { status: 400 }
        );
      }

      const cleanName = portalName?.trim() || `HubSpot Account #${cleanId}`;
      const newConnection = {
        id: `conn_hs_${cleanId}`,
        organizationId: 'org_enterprise_01',
        workspaceId: 'org_enterprise_01',
        portalId: cleanId,
        portalName: cleanName,
        accountName: cleanName,
        hubspotDomain: `app.hubspot.com/reports-dashboard/${cleanId}`,
        installedScopes: [
          'crm.objects.contacts.read',
          'crm.objects.contacts.write',
          'crm.schemas.contacts.read',
          'crm.schemas.contacts.write',
          'crm.objects.deals.read',
          'crm.objects.deals.write',
          'crm.schemas.deals.read',
          'crm.objects.companies.read',
          'crm.objects.owners.read',
          'automation',
          'crm.lists.read',
          'crm.lists.write',
        ],
        hubs: {
          Marketing: 'Professional' as const,
          Sales: 'Enterprise' as const,
          Service: 'Professional' as const,
          Operations: 'Starter' as const,
          CMS: 'Starter' as const,
        },
        status: 'CONNECTED' as const,
        connectionStatus: 'CONNECTED' as const,
        connectedByUserId: connectedUser || 'Authorized User',
        connectedUser: connectedUser || 'Authorized User',
        connectedAt: new Date().toISOString(),
        lastSyncedAt: new Date().toISOString(),
        lastSuccessfulCheck: new Date().toLocaleTimeString(),
        lastVerifiedAt: new Date().toISOString(),
        authMethod: (accessToken || refreshToken ? 'OAUTH' : 'PAT') as any,
        isLiveConnected: true,
        refreshToken: refreshToken || undefined,
        accessToken: accessToken || undefined,
      };

      saveHubSpotConnection(newConnection);
      setActiveRuntimePortalId(cleanId);

      const response = NextResponse.json({
        success: true,
        action: 'add_portal',
        portalId: cleanId,
        connection: newConnection,
      });

      response.cookies.set('active_hubspot_portal', cleanId, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    if (action === 'select_portal') {
      const targetPortalId = String(portalId || '');
      if (!targetPortalId) {
        return NextResponse.json({ error: 'MISSING_PORTAL_ID' }, { status: 400 });
      }

      setActiveRuntimePortalId(targetPortalId);

      const response = NextResponse.json({
        success: true,
        action: 'select_portal',
        activePortalId: targetPortalId,
      });

      response.cookies.set('active_hubspot_portal', targetPortalId, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    if (action === 'disconnect') {
      const targetPortalId = String(portalId || '');
      const existing = getHubSpotConnectionByPortalId(targetPortalId);

      if (existing) {
        // Mark as disconnected
        saveHubSpotConnection({
          ...existing,
          status: 'DISCONNECTED',
          lastSuccessfulCheck: new Date().toLocaleTimeString(),
        });
      }

      // Determine new active portal if disconnected portal was active
      const remainingConnected = getAllHubSpotConnections().filter(
        (c) => c.status === 'CONNECTED' && c.portalId !== targetPortalId
      );
      const nextActiveId = remainingConnected.length > 0 ? remainingConnected[0].portalId : '';

      const response = NextResponse.json({
        success: true,
        action: 'disconnect',
        portalId: targetPortalId,
        status: 'DISCONNECTED',
        nextActivePortalId: nextActiveId,
        disconnectedAt: new Date().toISOString(),
      });

      if (nextActiveId) {
        setActiveRuntimePortalId(nextActiveId);
        response.cookies.set('active_hubspot_portal', nextActiveId, {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        });
      } else {
        response.cookies.delete('active_hubspot_portal');
      }

      return response;
    }

    if (action === 'reconnect' || action === 'refresh') {
      const targetPortalId = String(portalId || '');
      const existing = getHubSpotConnectionByPortalId(targetPortalId);

      if (existing) {
        saveHubSpotConnection({
          ...existing,
          status: 'CONNECTED',
          lastSuccessfulCheck: new Date().toLocaleTimeString(),
          lastSyncedAt: new Date().toISOString(),
        });
      }

      // Test live token
      const liveService = new HubSpotLiveDataService(targetPortalId);
      const info = await liveService.getPortalInfo();

      return NextResponse.json({
        success: true,
        action: 'refresh',
        portalId: targetPortalId,
        portalInfo: info,
      });
    }

    if (action === 'sync_schema') {
      const targetPortalId = String(portalId || '');
      const liveService = new HubSpotLiveDataService(targetPortalId);
      const [contacts, companies, deals, owners] = await Promise.all([
        liveService.getContactCount().catch(() => null),
        liveService.getCompanyCount().catch(() => null),
        liveService.getDealCount().catch(() => null),
        liveService.getOwnerCount().catch(() => null),
      ]);

      return NextResponse.json({
        success: true,
        action: 'sync_schema',
        portalId: targetPortalId,
        counts: {
          contacts: contacts?.value,
          companies: companies?.value,
          deals: deals?.value,
          owners: owners?.value,
        },
      });
    }

    return NextResponse.json(
      { error: 'INVALID_ACTION', message: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
