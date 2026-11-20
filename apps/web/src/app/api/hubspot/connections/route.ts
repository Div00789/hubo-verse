import { NextRequest, NextResponse } from 'next/server';
import {
  DEMO_HUBSPOT_CONNECTION,
  getPortalSchemaRegistry,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const isOAuthConfigured = Boolean(
    clientId && clientId !== 'demo_client_id' && process.env.HUBSPOT_CLIENT_SECRET
  );

  const activePortalCookie = request.cookies.get('active_hubspot_portal')?.value;
  const activePortalId = activePortalCookie || DEMO_HUBSPOT_CONNECTION.portalId;
  const schema = getPortalSchemaRegistry(activePortalId);

  return NextResponse.json({
    isOAuthConfigured,
    activePortalId,
    connections: [
      {
        ...DEMO_HUBSPOT_CONNECTION,
        portalId: activePortalId,
        portalName: activePortalId === '46100478' ? 'HubSpot Demo Account' : DEMO_HUBSPOT_CONNECTION.portalName,
        isLiveConnected: isOAuthConfigured || Boolean(process.env.HUBSPOT_ACCESS_TOKEN),
        lastSuccessfulCheck: new Date().toISOString(),
        verifiedPropertiesCount:
          schema.properties.contacts.length + schema.properties.deals.length,
        verifiedPipelinesCount: schema.pipelines.deals.length,
        verifiedOwnersCount: schema.owners.length,
        verifiedWorkflowsCount: schema.existingWorkflows.length,
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, portalId } = body;

    if (action === 'disconnect') {
      const response = NextResponse.json({
        success: true,
        action: 'disconnect',
        portalId: portalId || DEMO_HUBSPOT_CONNECTION.portalId,
        status: 'DISCONNECTED',
        disconnectedAt: new Date().toISOString(),
      });
      response.cookies.delete('active_hubspot_portal');
      return response;
    }

    if (action === 'select_portal') {
      const targetPortalId = String(portalId || '46100478');
      const response = NextResponse.json({
        success: true,
        action: 'select_portal',
        activePortalId: targetPortalId,
      });
      response.cookies.set('active_hubspot_portal', targetPortalId, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return NextResponse.json(
      { error: 'INVALID_ACTION', message: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
