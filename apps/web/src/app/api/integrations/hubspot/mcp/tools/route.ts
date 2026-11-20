import { NextRequest, NextResponse } from 'next/server';
import { HubSpotMcpClient } from '@huboverse/hubspot-sdk';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mcpServerUrl =
    process.env.HUBSPOT_MCP_SERVER_URL || 'https://mcp.hubspot.com';
  const accessToken =
    process.env.HUBSPOT_ACCESS_TOKEN || 'demo_mcp_access_token';

  const client = new HubSpotMcpClient(accessToken, mcpServerUrl);
  const tools = await client.listTools();

  return NextResponse.json({
    tools,
    total: tools.length,
    serverUrl: mcpServerUrl,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolName, arguments: toolArgs } = body;

    if (!toolName) {
      return NextResponse.json(
        { error: 'MISSING_TOOL_NAME', message: 'toolName is required.' },
        { status: 400 }
      );
    }

    const mcpServerUrl =
      process.env.HUBSPOT_MCP_SERVER_URL || 'https://mcp.hubspot.com';
    const accessToken =
      process.env.HUBSPOT_ACCESS_TOKEN || 'demo_mcp_access_token';

    const client = new HubSpotMcpClient(accessToken, mcpServerUrl);
    const result = await client.callTool(toolName, toolArgs || {});

    return NextResponse.json({
      success: true,
      toolName,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'TOOL_EXECUTION_FAILED', message: err.message },
      { status: 500 }
    );
  }
}
