import { NextRequest, NextResponse } from 'next/server';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import { getPersistentActivePortalId, getPersistentConnectionByPortalId } from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const portalIdParam = request.nextUrl.searchParams.get('portalId');
    const cookiePortalId = request.cookies.get('active_hubspot_portal')?.value;
    const persistentActive = getPersistentActivePortalId();

    const portalId = (portalIdParam || cookiePortalId || persistentActive || '').trim();

    if (!portalId) {
      return NextResponse.json(
        { error: 'NO_PORTAL_SELECTED', message: 'No HubSpot portal is selected for audit.' },
        { status: 400 }
      );
    }

    const conn = getPersistentConnectionByPortalId(portalId);
    if (!conn) {
      return NextResponse.json(
        { error: 'PORTAL_NOT_FOUND', message: `Portal #${portalId} is not connected.` },
        { status: 404 }
      );
    }

    const liveDataService = new HubSpotLiveDataService(portalId);
    const auditReport = await liveDataService.runPortalAudit();

    return NextResponse.json({
      success: true,
      portalId,
      report: auditReport,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'AUDIT_EXECUTION_ERROR', message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
