import { NextRequest, NextResponse } from 'next/server';
import { HubSpotMcpClient } from '@huboverse/hubspot-sdk';
import { DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const portalId =
    request.cookies.get('active_hubspot_portal')?.value ||
    DEMO_HUBSPOT_CONNECTION.portalId;

  const mcpServerUrl =
    process.env.HUBSPOT_MCP_SERVER_URL || 'https://mcp.hubspot.com';

  const hasClientSecret = Boolean(
    process.env.HUBSPOT_MCP_CLIENT_SECRET || process.env.HUBSPOT_CLIENT_SECRET
  );

  const accessToken =
    process.env.HUBSPOT_ACCESS_TOKEN || 'demo_mcp_access_token';

  const mcpClient = new HubSpotMcpClient(accessToken, mcpServerUrl);
  const health = await mcpClient.checkHealth();
  const tools = await mcpClient.listTools();

  return NextResponse.json({
    status: 'ACTIVE',
    mcpServerUrl,
    appId: '62804454',
    appName: 'HuboVerse AI Connector',
    clientId:
      process.env.HUBSPOT_MCP_CLIENT_ID ||
      '9e468bc7-5fce-4556-b0bb-bbbeedf1b51e',
    isSecretConfigured: hasClientSecret,
    redirectUri:
      process.env.HUBSPOT_MCP_REDIRECT_URI ||
      'https://hubo-verse.vercel.app/api/integrations/hubspot/mcp/callback',
    activePortalId: portalId,
    activePortalName: portalId === '46100478' ? 'HubSpot Demo Account' : DEMO_HUBSPOT_CONNECTION.portalName,
    health,
    availableToolsCount: tools.length,
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
    })),
  });
}
