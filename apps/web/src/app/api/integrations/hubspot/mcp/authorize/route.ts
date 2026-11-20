import { NextRequest, NextResponse } from 'next/server';
import { generatePkceChallenge } from '@huboverse/hubspot-sdk';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Read Client ID from server environment or use registered App ID / Client ID
  const clientId =
    process.env.HUBSPOT_MCP_CLIENT_ID ||
    process.env.HUBSPOT_CLIENT_ID ||
    '9e468bc7-5fce-4556-b0bb-bbbeedf1b51e';

  // Construct Redirect URI matching registered endpoint
  const redirectUri =
    process.env.HUBSPOT_MCP_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/integrations/hubspot/mcp/callback`;

  // Generate cryptographically secure CSRF state
  const state = `hvmcp_${crypto.randomBytes(16).toString('hex')}`;

  // Generate PKCE code verifier and challenge (S256)
  const pkce = generatePkceChallenge();

  const scopes = [
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.schemas.contacts.read',
    'crm.schemas.contacts.write',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.schemas.deals.read',
    'crm.objects.companies.read',
    'crm.objects.companies.write',
    'crm.objects.owners.read',
    'automation',
    'crm.lists.read',
    'crm.lists.write',
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: pkce.codeChallengeMethod,
  });

  const authUrl = `https://mcp.hubspot.com/oauth/authorize/user?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);

  // Store CSRF state and PKCE code_verifier in secure short-lived cookies
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('hubspot_mcp_state', state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 mins
    path: '/',
  });

  response.cookies.set('hubspot_mcp_verifier', pkce.codeVerifier, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  });

  return response;
}
