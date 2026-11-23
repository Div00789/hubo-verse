import { NextRequest, NextResponse } from 'next/server';
import { runAnnaChatStep } from '@huboverse/ai-agent';
import {
  getPersistentActivePortalId,
  getPersistentConnectionByPortalId,
} from '@huboverse/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, conversationId, portalId } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'MISSING_QUERY', message: 'User query is required.' },
        { status: 400 }
      );
    }

    const activePortalId = (
      portalId ||
      request.cookies.get('active_hubspot_portal')?.value ||
      getPersistentActivePortalId() ||
      ''
    ).trim();

    const conn = activePortalId ? getPersistentConnectionByPortalId(activePortalId) : null;

    const result = await runAnnaChatStep({
      conversationId: conversationId || `conv_${Date.now()}`,
      userQuery: query,
      organizationId: 'org_enterprise_01',
      portalContext: activePortalId
        ? {
            portalId: activePortalId,
            hubs: (conn?.hubs as any) || {},
          }
        : undefined,
      retrievedCitations: [],
      responseMarkdown: '',
      suggestedPrompts: [],
      tokensConsumed: 0,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'CHAT_EXECUTION_ERROR', message: err.message },
      { status: 500 }
    );
  }
}
