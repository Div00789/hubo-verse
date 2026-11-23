import { NextRequest, NextResponse } from 'next/server';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import {
  getPersistentActivePortalId,
  getPersistentConnectionByPortalId,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const portalIdParam = request.nextUrl.searchParams.get('portalId');
    const cookiePortalId = request.cookies.get('active_hubspot_portal')?.value;
    const persistentActive = getPersistentActivePortalId();

    const portalId = (portalIdParam || cookiePortalId || persistentActive || '').trim();

    if (!portalId) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_PORTAL_SELECTED',
          message: 'No HubSpot portal is currently selected.',
        },
        { status: 400 }
      );
    }

    const conn = getPersistentConnectionByPortalId(portalId);
    if (!conn) {
      return NextResponse.json(
        {
          success: false,
          error: 'PORTAL_NOT_FOUND',
          message: `HubSpot account #${portalId} is not connected.`,
        },
        { status: 404 }
      );
    }

    if (conn.status !== 'CONNECTED' || !conn.isLiveConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'NEEDS_REAUTH',
          message: `HubSpot account #${portalId} requires authentication.`,
          portalId,
        },
        { status: 401 }
      );
    }

    const liveService = new HubSpotLiveDataService(portalId);
    const metrics = await liveService.getPortalMetrics();

    return NextResponse.json({
      success: true,
      portalId,
      metrics,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
