import { NextRequest, NextResponse } from 'next/server';
import { HubSpotOAuthManager } from '@huboverse/hubspot-sdk';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const origin = request.nextUrl.origin;
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const redirectUri = isLocalhost
    ? `${origin}/api/auth/hubspot/callback`
    : process.env.HUBSPOT_REDIRECT_URI || `${origin}/api/auth/hubspot/callback`;

  // Detect missing credentials
  if (!clientId || !clientSecret || clientId === 'demo_client_id') {
    return NextResponse.json(
      {
        status: 'SETUP_REQUIRED',
        error: 'MISSING_HUBSPOT_OAUTH_CREDENTIALS',
        message:
          'HubSpot OAuth application credentials are not yet configured in environment variables.',
        requiredVariables: [
          'HUBSPOT_CLIENT_ID',
          'HUBSPOT_CLIENT_SECRET',
          'HUBSPOT_REDIRECT_URI',
        ],
        documentationUrl: 'https://developers.hubspot.com/docs/api/creating-an-app',
      },
      { status: 400 }
    );
  }

  // Generate cryptographically secure CSRF state
  const state = `hvoauth_${crypto.randomBytes(16).toString('hex')}`;

  const oauthManager = new HubSpotOAuthManager(clientId, clientSecret, redirectUri);
  const authUrl = oauthManager.getAuthorizationUrl(state, [
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.schemas.contacts.read',
    'crm.schemas.contacts.write',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.schemas.deals.read',
    'crm.objects.companies.read',
    'crm.objects.owners.read',
    'automation',
    'crm.lists.read',
    'crm.lists.write',
  ]);

  // Set CSRF state cookie and redirect
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('hubspot_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  });

  return response;
}
