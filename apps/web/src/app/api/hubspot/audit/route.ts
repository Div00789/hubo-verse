import { NextRequest, NextResponse } from 'next/server';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import { DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const portalId =
      request.nextUrl.searchParams.get('portalId') ||
      request.cookies.get('active_hubspot_portal')?.value ||
      DEMO_HUBSPOT_CONNECTION.portalId;

    const liveDataService = new HubSpotLiveDataService(portalId);
    const auditReport = await liveDataService.runPortalAudit();

    return NextResponse.json({
      success: true,
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
