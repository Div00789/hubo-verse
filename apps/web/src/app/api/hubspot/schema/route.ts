import { NextRequest, NextResponse } from 'next/server';
import {
  getPortalSchemaRegistry,
  savePortalSchemaRegistry,
  DEMO_HUBSPOT_CONNECTION,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const portalId =
    request.nextUrl.searchParams.get('portalId') ||
    request.cookies.get('active_hubspot_portal')?.value ||
    DEMO_HUBSPOT_CONNECTION.portalId;

  const schema = getPortalSchemaRegistry(portalId);
  return NextResponse.json(schema);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const portalId =
      body.portalId ||
      request.cookies.get('active_hubspot_portal')?.value ||
      DEMO_HUBSPOT_CONNECTION.portalId;

    const schema = getPortalSchemaRegistry(portalId);
    const refreshedSchema = {
      ...schema,
      refreshedAt: new Date().toISOString(),
    };

    savePortalSchemaRegistry(portalId, refreshedSchema);

    return NextResponse.json({
      success: true,
      portalId,
      refreshedAt: refreshedSchema.refreshedAt,
      schema: refreshedSchema,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
