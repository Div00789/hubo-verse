import { NextRequest, NextResponse } from 'next/server';
import { getPortalSchemaRegistry, getHubSpotConnectionByPortalId } from '@huboverse/database';
import { HubSpotLiveDataService } from '@huboverse/hubspot-sdk';
import type { PortalHealthAnalysis, PortalHealthRecommendation } from '@huboverse/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const portalId =
    request.nextUrl.searchParams.get('portalId') ||
    request.cookies.get('active_hubspot_portal')?.value ||
    process.env.HUBSPOT_PORTAL_ID ||
    process.env.HUBSPOT_DEFAULT_PORTAL_ID;

  if (!portalId) {
    return NextResponse.json(
      { error: 'NO_PORTAL_SELECTED', message: 'No HubSpot portal is selected for analysis.' },
      { status: 400 }
    );
  }

  const schema = getPortalSchemaRegistry(portalId);
  const liveDataService = new HubSpotLiveDataService(portalId);
  const conn = getHubSpotConnectionByPortalId(portalId);

  // Retrieve deterministic live audit from connected HubSpot portal
  const auditReport = await liveDataService.runPortalAudit();
  const s = auditReport.summary;

  const totalContacts = typeof s.totalContacts === 'number' ? s.totalContacts : 0;
  const totalCompanies = typeof s.totalCompanies === 'number' ? s.totalCompanies : 0;
  const totalDeals = typeof s.totalDeals === 'number' ? s.totalDeals : 0;
  const unassignedContacts = typeof s.unassignedContacts === 'number' ? s.unassignedContacts : 0;
  const openDeals = typeof s.openDeals === 'number' ? s.openDeals : 0;
  const closedWonDeals = typeof s.closedWonDeals === 'number' ? s.closedWonDeals : 0;
  const totalPipelines = typeof s.totalPipelines === 'number' ? s.totalPipelines : 1;
  const totalWorkflows = typeof s.activeWorkflows === 'number' ? s.activeWorkflows : 0;

  const recommendations: PortalHealthRecommendation[] = auditReport.actionPlan.map((action, i) => ({
    id: `rec_${action.id || i}`,
    category:
      action.id.includes('lead')
        ? 'DATA_QUALITY'
        : action.id.includes('deal')
        ? 'SALES_HEALTH'
        : action.id.includes('service')
        ? 'AUTOMATION_OPPORTUNITIES'
        : 'CRM_OVERVIEW',
    finding: action.action,
    evidence: `Live portal #${portalId} audit verified: ${action.expectedBenefit}`,
    businessImpact: action.expectedBenefit,
    recommendedAction: action.implementationApproach,
    riskLevel: action.estimatedComplexity === 'HIGH' ? 'HIGH' : action.estimatedComplexity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
    canAnnaExecute: action.canAnnaImplement,
    requiresHumanAssistance: !action.canAnnaImplement,
    status: 'PENDING',
  }));

  const analysis: PortalHealthAnalysis = {
    id: `pha_${portalId}_${Date.now()}`,
    organizationId: conn?.organizationId || 'org_enterprise_01',
    connectionId: conn?.id || `conn_hs_${portalId}`,
    portalId,
    analyzedAt: auditReport.retrievedAt,
    crmOverview: {
      totalContacts,
      totalCompanies,
      totalDeals,
      totalPipelines,
      totalWorkflows,
    },
    salesHealth: {
      activeDealsCount: openDeals,
      staleDealsCount: typeof s.dealsMissingCloseDate === 'number' ? s.dealsMissingCloseDate : 0,
      unassignedDealsCount: typeof s.unassignedDeals === 'number' ? s.unassignedDeals : 0,
      pipelineStageDistribution: {
        'Open Deals': openDeals,
        'Closed-Won Deals': closedWonDeals,
      },
    },
    marketingHealth: {
      leadsThisMonth: totalContacts,
      lifecycleStageDistribution: {
        lead: totalContacts,
      },
      segmentationListsCount: schema.lists.length,
    },
    dataQuality: {
      missingImportantFieldsPercentage:
        totalContacts > 0 ? Math.round((unassignedContacts / totalContacts) * 100) : 0,
      unassignedContactsCount: unassignedContacts,
      duplicateSuspectsCount: 0,
    },
    automationOpportunities: {
      workflowsActive: totalWorkflows,
      conflictingEnrollmentRulesCount: 0,
      recommendedAutomations: auditReport.actionPlan.map((a) => a.action),
    },
    recommendations,
  };

  return NextResponse.json({
    ...analysis,
    auditReport,
  });
}
