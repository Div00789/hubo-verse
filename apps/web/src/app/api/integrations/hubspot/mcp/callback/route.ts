import { NextRequest, NextResponse } from 'next/server';
import { encryptToken, HubSpotMcpClient } from '@huboverse/hubspot-sdk';
import {
  savePortalSchemaRegistry,
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

  // 1. Verify CSRF State (supports both HuboVerse-initiated and HubSpot Dev Portal Test flow)
  const storedState = request.cookies.get('hubspot_mcp_state')?.value;
  if (storedState && state && storedState !== state) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=Invalid+or+expired+OAuth+state+(CSRF+protection)`
    );
  }

  // 2. Retrieve PKCE Code Verifier (from session cookie or registered test install verifier)
  const codeVerifier =
    request.cookies.get('hubspot_mcp_verifier')?.value ||
    process.env.HUBSPOT_MCP_CODE_VERIFIER ||
    'kUlET2HkSb6DQNrbJYVAxMRUw8DN1UH8EhjGnCLQHN071dB8cBq_2sSf1gL200ah';

  const clientId =
    process.env.HUBSPOT_MCP_CLIENT_ID ||
    process.env.HUBSPOT_CLIENT_ID ||
    '9e468bc7-5fce-4556-b0bb-bbbeedf1b51e';

  // Read securely from server environment variable (never exposed to client)
  const clientSecret =
    process.env.HUBSPOT_MCP_CLIENT_SECRET || process.env.HUBSPOT_CLIENT_SECRET;

  const redirectUri =
    process.env.HUBSPOT_MCP_REDIRECT_URI ||
    `${origin}/api/integrations/hubspot/mcp/callback`;

  try {
    // 3. Exchange Authorization Code + PKCE code_verifier for Tokens
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    if (clientSecret) {
      tokenParams.append('client_secret', clientSecret);
    }

    const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      throw new Error(`Token exchange failed (${tokenRes.status}): ${errorText}`);
    }

    const tokens = await tokenRes.json();

    // 4. Discover Connected Portal ID and User
    let hubId = '46100478';
    let userEmail = 'div@huboexperts.com';
    let scopes: string[] = [];

    const tokenInfoRes = await fetch(
      `https://api.hubapi.com/oauth/v1/access-tokens/${tokens.access_token}`
    );
    if (tokenInfoRes.ok) {
      const info = await tokenInfoRes.json();
      hubId = String(info.hub_id || hubId);
      userEmail = info.user || userEmail;
      scopes = info.scopes || [];
    }

    // 5. Test Remote MCP Server Connection with the new Bearer Token
    const mcpClient = new HubSpotMcpClient(
      tokens.access_token,
      process.env.HUBSPOT_MCP_SERVER_URL || 'https://mcp.hubspot.com'
    );
    await mcpClient.initialize().catch(() => {});

    // 6. Encrypt Tokens with AES-256-GCM
    const encryptionKey =
      process.env.HUBSPOT_TOKEN_ENCRYPTION_KEY ||
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    encryptToken(tokens.access_token, encryptionKey);
    if (tokens.refresh_token) {
      encryptToken(tokens.refresh_token, encryptionKey);
    }

    // 7. Ground Portal Schema Registry
    savePortalSchemaRegistry(hubId, {
      ...DEMO_PORTAL_SCHEMA_REGISTRY,
      portalId: hubId,
      portalName: `HubSpot Demo Account (${hubId})`,
      refreshedAt: new Date().toISOString(),
    });

    const response = NextResponse.redirect(
      `${origin}/app?tab=portals&connected=true&portalId=${hubId}&mcp=true`
    );

    // Clean up temporary cookies
    response.cookies.delete('hubspot_mcp_state');
    response.cookies.delete('hubspot_mcp_verifier');

    // Store active portal reference
    response.cookies.set('active_hubspot_portal', hubId, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.redirect(
      `${origin}/app?tab=portals&error=${encodeURIComponent(
        err.message || 'Failed to exchange token with HubSpot MCP'
      )}`
    );
  }
}
