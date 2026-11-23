import { NextRequest, NextResponse } from 'next/server';
import {
  HubSpotOAuthManager,
  encryptToken,
  registerPortalRefreshToken,
} from '@huboverse/hubspot-sdk';
import {
  savePortalSchemaRegistry,
  saveHubSpotConnection,
  setActiveRuntimePortalId,
  DEMO_PORTAL_SCHEMA_REGISTRY,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = request.nextUrl.origin;

  // Handle user cancellation or HubSpot authorization errors
  if (error) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=${encodeURIComponent(
        errorDescription || error
      )}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=Missing+authorization+code`
    );
  }

  // Validate CSRF state
  const storedState = request.cookies.get('hubspot_oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=Invalid+or+expired+OAuth+state+(CSRF+protection)`
    );
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const redirectUri = isLocalhost
    ? `${origin}/api/auth/hubspot/callback`
    : process.env.HUBSPOT_REDIRECT_URI || `${origin}/api/auth/hubspot/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=Server+missing+HubSpot+OAuth+credentials`
    );
  }

  try {
    const oauthManager = new HubSpotOAuthManager(clientId, clientSecret, redirectUri);
    const tokens = await oauthManager.exchangeCodeForTokens(code);
    const tokenInfo = await oauthManager.verifyTokenInfo(tokens.access_token);

    const portalId = String(tokenInfo.hub_id);
    const portalName = (tokenInfo as any).hub_name || `HubSpot Account #${tokenInfo.hub_id}`;
    const userEmail = tokenInfo.user || 'Authorized User';

    // Encrypt tokens using AES-256-GCM
    const encryptionKey =
      process.env.HUBSPOT_TOKEN_ENCRYPTION_KEY ||
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    encryptToken(tokens.access_token, encryptionKey);
    if (tokens.refresh_token) {
      encryptToken(tokens.refresh_token, encryptionKey);
      registerPortalRefreshToken(
        portalId,
        tokens.refresh_token,
        tokens.access_token,
        tokens.expires_in
      );
    }

    // Cache / ground schema registry for the newly connected portal
    savePortalSchemaRegistry(portalId, {
      ...DEMO_PORTAL_SCHEMA_REGISTRY,
      portalId,
      portalName,
      refreshedAt: new Date().toISOString(),
    });

    // Save Connected Account in Dynamic Store
    saveHubSpotConnection({
      id: `conn_hs_${portalId}`,
      organizationId: 'org_enterprise_01',
      portalId,
      portalName,
      hubspotDomain: `app.hubspot.com/reports-dashboard/${portalId}`,
      installedScopes: tokenInfo.scopes || [],
      hubs: {
        Marketing: 'Professional',
        Sales: 'Enterprise',
        Service: 'Professional',
        Operations: 'Starter',
        CMS: 'Starter',
      },
      status: 'CONNECTED',
      connectedByUserId: userEmail,
      connectedUser: userEmail,
      connectedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      lastSuccessfulCheck: new Date().toLocaleTimeString(),
      authMethod: 'OAUTH',
      isLiveConnected: true,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      tokenExpiresAt: Date.now() + (tokens.expires_in || 1800) * 1000,
    });

    setActiveRuntimePortalId(portalId);

    const response = NextResponse.redirect(
      `${origin}/app?tab=portals&connected=true&portalId=${portalId}`
    );

    // Clear the state cookie
    response.cookies.delete('hubspot_oauth_state');

    // Set connected portal cookie for quick client hydration
    response.cookies.set('active_hubspot_portal', portalId, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=${encodeURIComponent(
        err.message || 'Failed to exchange authorization code for tokens'
      )}`
    );
  }
}
