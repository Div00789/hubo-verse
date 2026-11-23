import { NextRequest, NextResponse } from 'next/server';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import { getPersistentConnectionByPortalId, getPersistentActivePortalId } from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const portalIdParam = searchParams.get('portalId');
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

    // Verify connection exists and has valid credentials
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
          message: `HubSpot account #${portalId} requires authentication. Please connect with HubSpot OAuth.`,
          portalId,
        },
        { status: 401 }
      );
    }

    const objectType = (searchParams.get('objectType') || 'contacts') as
      | 'contacts'
      | 'companies'
      | 'deals'
      | 'pipelines';

    if (!['contacts', 'companies', 'deals', 'pipelines'].includes(objectType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_OBJECT_TYPE',
          message: `Object type "${objectType}" is not supported. Use contacts, companies, deals, or pipelines.`,
        },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
    const after = searchParams.get('after') || undefined;

    const liveService = new HubSpotLiveDataService(portalId);
    const records = await liveService.getLiveRecords(objectType, limit, after);

    return NextResponse.json({
      success: true,
      portalId,
      objectType,
      results: records.results,
      paging: records.paging,
      owners: records.owners,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.name || 'API_ERROR',
        message: err.message || 'An error occurred while fetching live CRM records.',
      },
      { status: 500 }
    );
  }
}
