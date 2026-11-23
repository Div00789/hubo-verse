import { NextRequest, NextResponse } from 'next/server';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import { getPersistentActivePortalId, DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const portalIdParam = request.nextUrl.searchParams.get('portalId');
    const cookiePortalId = request.cookies.get('active_hubspot_portal')?.value;
    const persistentActive = getPersistentActivePortalId();

    const portalId =
      portalIdParam ||
      cookiePortalId ||
      persistentActive ||
      DEMO_HUBSPOT_CONNECTION.portalId;

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
