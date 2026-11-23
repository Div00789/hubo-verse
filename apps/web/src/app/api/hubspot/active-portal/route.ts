import { NextRequest, NextResponse } from 'next/server';
import {
  getHubSpotConnectionByPortalId,
  getAllHubSpotConnections,
  getActiveRuntimePortalId,
  getPortalSchemaRegistry,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const activePortalCookie = request.cookies.get('active_hubspot_portal')?.value;
  const allConnections = getAllHubSpotConnections();

  let activePortalId = activePortalCookie;
  if (!activePortalId || !allConnections.some((c) => c.portalId === activePortalId)) {
    activePortalId = allConnections.length > 0 ? allConnections[0].portalId : getActiveRuntimePortalId();
  }

  const connection = getHubSpotConnectionByPortalId(activePortalId);
  const schema = getPortalSchemaRegistry(activePortalId);

  return NextResponse.json({
    success: true,
    activePortalId,
    connection: connection
      ? {
          id: connection.id,
          portalId: connection.portalId,
          portalName: connection.portalName,
          status: connection.status,
          hubspotDomain: connection.hubspotDomain,
          installedScopes: connection.installedScopes,
          connectedUser: connection.connectedUser || connection.connectedByUserId,
          connectedAt: connection.connectedAt,
          lastSyncedAt: connection.lastSyncedAt,
          lastSuccessfulCheck: connection.lastSuccessfulCheck,
          isLiveConnected: connection.status === 'CONNECTED',
        }
      : null,
    schemaSummary: {
      totalProperties:
        (schema.properties.contacts?.length || 0) + (schema.properties.deals?.length || 0),
      totalPipelines: schema.pipelines.deals?.length || 0,
      totalOwners: schema.owners?.length || 0,
      totalWorkflows: schema.existingWorkflows?.length || 0,
    },
  });
}
