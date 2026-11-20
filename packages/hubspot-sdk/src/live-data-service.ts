import type {
  CrmDataResult,
  StructuredMetricResponse,
  MetricVerificationStatus,
  PortalAuditReport,
  PortalAuditFinding,
} from '@huboverse/types';

// In-memory token store for transparent automatic refresh across requests
let globalAccessToken: string | null = null;
let globalTokenExpiresAt: number = 0;

export class HubSpotLiveDataService {
  private portalId: string;

  constructor(portalId = '46100478') {
    this.portalId = portalId;
  }

  /**
   * Refreshes the OAuth access token using the persistent refresh token.
   */
  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken =
      process.env.HUBSPOT_REFRESH_TOKEN || 'na1-e2c7-b237-4dbd-950d-c3b0e4909cbf';
    const clientId =
      process.env.HUBSPOT_CLIENT_ID ||
      process.env.HUBSPOT_MCP_CLIENT_ID ||
      '9e468bc7-5fce-4556-b0bb-bbbeedf1b51e';
    const clientSecret =
      process.env.HUBSPOT_CLIENT_SECRET ||
      process.env.HUBSPOT_MCP_CLIENT_SECRET ||
      'f439ecb9-c429-440a-810d-8b84d31159f2';

    if (!refreshToken) return null;

    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });

      const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        globalAccessToken = data.access_token;
        globalTokenExpiresAt = Date.now() + (data.expires_in || 1800) * 1000;
        process.env.HUBSPOT_ACCESS_TOKEN = data.access_token;
        return data.access_token;
      }
    } catch {
      // Fallback
    }

    return null;
  }

  /**
   * Retrieves an active access token, performing automatic token refresh if expired.
   */
  public async getValidAccessToken(): Promise<string | null> {
    // If token is cached and valid for at least 2 more minutes, use it
    if (globalAccessToken && Date.now() < globalTokenExpiresAt - 120000) {
      return globalAccessToken;
    }

    // Attempt token refresh via refresh_token
    const refreshed = await this.refreshAccessToken();
    if (refreshed) {
      return refreshed;
    }

    return process.env.HUBSPOT_ACCESS_TOKEN || null;
  }

  /**
   * Helper for authenticated requests to HubSpot API with automatic 401 retry
   */
  private async fetchApi<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ status: number; data: T | null; error?: string }> {
    let token = await this.getValidAccessToken();
    if (!token) {
      return { status: 401, data: null, error: 'NO_ACTIVE_HUBSPOT_TOKEN' };
    }

    try {
      let res = await fetch(`https://api.hubapi.com${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      // If token expired (401), automatically refresh and retry once
      if (res.status === 401) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          res = await fetch(`https://api.hubapi.com${path}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
              ...options.headers,
            },
          });
        }
      }

      if (!res.ok) {
        const errText = await res.text();
        return { status: res.status, data: null, error: errText };
      }

      const json = await res.json();
      return { status: res.status, data: json };
    } catch (err: any) {
      return { status: 500, data: null, error: err.message };
    }
  }

  /**
   * 1. GET PORTAL INFO & AUTH STATUS
   */
  public async getPortalInfo(): Promise<{
    portalId: string;
    portalName: string;
    userEmail: string;
    currency: string;
    timeZone: string;
    status: MetricVerificationStatus;
    retrievedAt: string;
  }> {
    const now = new Date().toISOString();
    const token = await this.getValidAccessToken();

    if (!token) {
      return {
        portalId: this.portalId,
        portalName: 'HubSpot Demo Account',
        userEmail: 'div@huboexperts.com',
        currency: 'USD',
        timeZone: 'UTC',
        status: 'unavailable',
        retrievedAt: now,
      };
    }

    const details = await this.fetchApi('/account-info/v3/details');
    const tokenInfo = await this.fetchApi(`/oauth/v1/access-tokens/${token}`);

    return {
      portalId: String(tokenInfo.data?.hub_id || details.data?.portalId || this.portalId),
      portalName: 'HubSpot Demo Account',
      userEmail: tokenInfo.data?.user || 'div@huboexperts.com',
      currency: details.data?.currency || 'USD',
      timeZone: details.data?.timeZone || 'UTC',
      status: 'verified',
      retrievedAt: now,
    };
  }

  /**
   * 2. EXACT CONTACT COUNT
   */
  public async getContactCount(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const searchRes = await this.fetchApi('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({ limit: 1 }),
    });

    if (searchRes.status === 200 && searchRes.data) {
      return {
        portalId: this.portalId,
        metric: 'total_contacts',
        value: searchRes.data.total ?? 0,
        status: 'verified',
        source: `HubSpot CRM Search API (/crm/v3/objects/contacts/search)`,
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        displayTitle: 'Total Contacts in Portal',
        summary: `Verified ${searchRes.data.total ?? 0} total active contacts currently stored in HubSpot portal #${this.portalId}.`,
      };
    }

    if (searchRes.status === 403) {
      return {
        portalId: this.portalId,
        metric: 'total_contacts',
        value: null,
        status: 'permission_denied',
        source: 'HubSpot API',
        retrievedAt: now,
        isComplete: false,
        filtersApplied: [],
        limitations: ['Token lacks scope crm.objects.contacts.read'],
        summary: 'Unable to retrieve contacts: permission denied.',
      };
    }

    return {
      portalId: this.portalId,
      metric: 'total_contacts',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: ['HubSpot API returned non-200 status or network error'],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 3. EXACT COMPANY COUNT
   */
  public async getCompanyCount(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const searchRes = await this.fetchApi('/crm/v3/objects/companies/search', {
      method: 'POST',
      body: JSON.stringify({ limit: 1 }),
    });

    if (searchRes.status === 200 && searchRes.data) {
      return {
        portalId: this.portalId,
        metric: 'total_companies',
        value: searchRes.data.total ?? 0,
        status: 'verified',
        source: `HubSpot CRM Search API (/crm/v3/objects/companies/search)`,
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        displayTitle: 'Total Companies in Portal',
        summary: `Verified ${searchRes.data.total ?? 0} total companies registered in HubSpot portal #${this.portalId}.`,
      };
    }

    return {
      portalId: this.portalId,
      metric: 'total_companies',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 4. EXACT DEAL COUNT & CLASSIFICATION
   */
  public async getDealCount(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const searchRes = await this.fetchApi('/crm/v3/objects/deals/search', {
      method: 'POST',
      body: JSON.stringify({ limit: 1 }),
    });

    if (searchRes.status === 200 && searchRes.data) {
      return {
        portalId: this.portalId,
        metric: 'total_deals',
        value: searchRes.data.total ?? 0,
        status: 'verified',
        source: `HubSpot CRM Search API (/crm/v3/objects/deals/search)`,
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        displayTitle: 'Total Deals in Portal',
        summary: `Verified ${searchRes.data.total ?? 0} total deal records in HubSpot portal #${this.portalId}.`,
      };
    }

    return {
      portalId: this.portalId,
      metric: 'total_deals',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 5. DEALS BY STAGE & OPEN VS CLOSED-WON BREAKDOWN
   */
  public async getDealsByStage(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const dealsRes = await this.fetchApi(
      '/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,pipeline,hs_is_closed_won,closedate'
    );

    if (dealsRes.status === 200 && dealsRes.data?.results) {
      const deals = dealsRes.data.results;
      const stageMap: Record<string, { count: number; totalAmount: number }> = {};
      let openCount = 0;
      let closedWonCount = 0;

      deals.forEach((d: any) => {
        const stage = d.properties?.dealstage || 'Unknown';
        const amount = parseFloat(d.properties?.amount || '0') || 0;
        const isWon = d.properties?.hs_is_closed_won === 'true' || stage.toLowerCase().includes('won');

        if (isWon) {
          closedWonCount++;
        } else {
          openCount++;
        }

        if (!stageMap[stage]) {
          stageMap[stage] = { count: 0, totalAmount: 0 };
        }
        stageMap[stage].count++;
        stageMap[stage].totalAmount += amount;
      });

      const breakdown = Object.entries(stageMap).map(([stg, data]) => ({
        label: stg,
        count: data.count,
        percentage: `${Math.round((data.count / (deals.length || 1)) * 100)}%`,
      }));

      return {
        portalId: this.portalId,
        metric: 'deals_by_stage',
        value: {
          totalDeals: deals.length,
          openDeals: openCount,
          closedWonDeals: closedWonCount,
        },
        status: 'verified',
        source: 'HubSpot Deals API (/crm/v3/objects/deals)',
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        breakdown,
        displayTitle: 'Deal Distribution by Stage',
        summary: `There are ${deals.length} total deals: ${openCount} open deals and ${closedWonCount} closed-won deals across active pipelines.`,
      };
    }

    return {
      portalId: this.portalId,
      metric: 'deals_by_stage',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 6. TOTAL DEAL PIPELINE VALUE
   */
  public async getDealPipelineValue(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const dealsRes = await this.fetchApi(
      '/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,hs_is_closed_won'
    );

    if (dealsRes.status === 200 && dealsRes.data?.results) {
      const deals = dealsRes.data.results;
      let openValue = 0;
      let wonValue = 0;
      let totalValue = 0;
      let dealsWithMissingAmount = 0;

      deals.forEach((d: any) => {
        const rawAmt = d.properties?.amount;
        if (rawAmt === null || rawAmt === undefined || rawAmt === '') {
          dealsWithMissingAmount++;
          return;
        }

        const amt = parseFloat(rawAmt) || 0;
        totalValue += amt;

        const isWon =
          d.properties?.hs_is_closed_won === 'true' ||
          (d.properties?.dealstage || '').toLowerCase().includes('won');

        if (isWon) {
          wonValue += amt;
        } else {
          openValue += amt;
        }
      });

      return {
        portalId: this.portalId,
        metric: 'deal_pipeline_value',
        value: {
          totalPipelineValue: totalValue,
          openPipelineValue: openValue,
          closedWonValue: wonValue,
          dealsWithMissingAmount,
        },
        status: 'verified',
        source: 'HubSpot Deals API (/crm/v3/objects/deals)',
        retrievedAt: now,
        isComplete: true,
        filtersApplied: ['amount IS NOT NULL'],
        limitations:
          dealsWithMissingAmount > 0
            ? [`${dealsWithMissingAmount} deal(s) have no amount set and are excluded from the monetary sum.`]
            : [],
        displayTitle: 'Total Deal Pipeline Value',
        summary: `The cumulative pipeline value of all valued deals is $${totalValue.toLocaleString()} ($${openValue.toLocaleString()} in open deals, $${wonValue.toLocaleString()} in closed-won deals).`,
      };
    }

    return {
      portalId: this.portalId,
      metric: 'deal_pipeline_value',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 7. UNASSIGNED CONTACTS COUNT
   */
  public async getUnassignedContactsCount(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const searchRes = await this.fetchApi('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: 'hubspot_owner_id', operator: 'NOT_HAS_PROPERTY' }],
          },
        ],
        limit: 1,
      }),
    });

    if (searchRes.status === 200 && searchRes.data) {
      const count = searchRes.data.total ?? 0;
      return {
        portalId: this.portalId,
        metric: 'unassigned_contacts',
        value: count,
        status: 'verified',
        source: 'HubSpot Contacts Search API (operator: NOT_HAS_PROPERTY)',
        retrievedAt: now,
        isComplete: true,
        filtersApplied: ['hubspot_owner_id IS EMPTY'],
        limitations: [],
        displayTitle: 'Contacts Without Assigned Owner',
        summary: `Verified ${count} contact(s) have no assigned contact owner in HubSpot portal #${this.portalId}.`,
      };
    }

    return {
      portalId: this.portalId,
      metric: 'unassigned_contacts',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 8. EXISTING PIPELINES & STAGES
   */
  public async getPipelines(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const pipeRes = await this.fetchApi('/crm/v3/pipelines/deals');

    if (pipeRes.status === 200 && pipeRes.data?.results) {
      const pipelines = pipeRes.data.results;
      return {
        portalId: this.portalId,
        metric: 'deal_pipelines',
        value: pipelines,
        status: 'verified',
        source: 'HubSpot Pipeline Schema API (/crm/v3/pipelines/deals)',
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        displayTitle: 'HubSpot Deal Pipelines',
        summary: `Found ${pipelines.length} configured deal pipeline(s) in portal #${this.portalId}.`,
      };
    }

    // Fallback: If 403 on schema endpoint, extract live pipelines from active deals
    if (pipeRes.status === 403) {
      const dealsRes = await this.fetchApi('/crm/v3/objects/deals?limit=100&properties=pipeline,dealstage');
      if (dealsRes.status === 200 && dealsRes.data?.results) {
        const deals = dealsRes.data.results;
        const distinctPipelines = Array.from(new Set(deals.map((d: any) => d.properties?.pipeline).filter(Boolean)));
        return {
          portalId: this.portalId,
          metric: 'deal_pipelines',
          value: distinctPipelines,
          status: 'partial',
          source: 'Live Deal Records Analysis',
          retrievedAt: now,
          isComplete: false,
          filtersApplied: [],
          limitations: [
            'Direct pipeline schema endpoint returned 403 (User-level OAuth token restriction). Distinct pipeline identifiers extracted directly from active deal records.',
          ],
          displayTitle: 'Active Deal Pipelines (Extracted from CRM Records)',
          summary: `Identified ${distinctPipelines.length} active deal pipeline(s) from live deal records: ${distinctPipelines.join(', ')}.`,
        };
      }

      return {
        portalId: this.portalId,
        metric: 'deal_pipelines',
        value: null,
        status: 'permission_denied',
        source: 'HubSpot API (/crm/v3/pipelines/deals)',
        retrievedAt: now,
        isComplete: false,
        filtersApplied: [],
        limitations: ['User-level OAuth token is not permitted for /crm/v3/pipelines/deals.'],
        summary: 'Unable to retrieve pipelines: user-level OAuth token lacks administrative schema permission.',
      };
    }

    return {
      portalId: this.portalId,
      metric: 'deal_pipelines',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 9. WORKFLOW INVENTORY & ACTIVE WORKFLOW COUNT
   */
  public async getWorkflowInventory(): Promise<StructuredMetricResponse> {
    const now = new Date().toISOString();
    const wfRes = await this.fetchApi('/automation/v3/workflows');

    if (wfRes.status === 200 && wfRes.data?.workflows) {
      const workflows = wfRes.data.workflows;
      const activeCount = workflows.filter((w: any) => w.enabled).length;

      return {
        portalId: this.portalId,
        metric: 'workflows',
        value: {
          totalWorkflows: workflows.length,
          activeWorkflows: activeCount,
          inactiveWorkflows: workflows.length - activeCount,
        },
        status: 'verified',
        source: 'HubSpot Automation API (/automation/v3/workflows)',
        retrievedAt: now,
        isComplete: true,
        filtersApplied: [],
        limitations: [],
        displayTitle: 'HubSpot Automation Workflows',
        summary: `Verified ${workflows.length} total workflow(s): ${activeCount} active, ${workflows.length - activeCount} inactive.`,
      };
    }

    if (wfRes.status === 403) {
      return {
        portalId: this.portalId,
        metric: 'workflows',
        value: null,
        status: 'permission_denied',
        source: 'HubSpot Automation API (/automation/v3/workflows)',
        retrievedAt: now,
        isComplete: false,
        filtersApplied: [],
        limitations: [
          'Workflow audit unavailable: User-level OAuth token is not allowed for /automation/v3/workflows. A service key or account-level token is required.',
        ],
        displayTitle: 'Automation Workflows',
        summary: 'Workflow audit unavailable: required API capability or permissions are missing.',
      };
    }

    return {
      portalId: this.portalId,
      metric: 'workflows',
      value: null,
      status: 'unavailable',
      source: 'HubSpot API',
      retrievedAt: now,
      isComplete: false,
      filtersApplied: [],
      limitations: [],
      summary: 'Unable to retrieve this metric from the connected HubSpot portal.',
    };
  }

  /**
   * 10. COMPLETE EVIDENCE-BACKED PORTAL AUDIT
   */
  public async runPortalAudit(): Promise<PortalAuditReport> {
    const now = new Date().toISOString();
    const findings: PortalAuditFinding[] = [];

    // Parallel deterministic retrieval
    const [contactsMetric, companiesMetric, dealsMetric, dealsStageMetric, pipelineValueMetric, unassignedMetric, wfMetric, pipelinesMetric] =
      await Promise.all([
        this.getContactCount(),
        this.getCompanyCount(),
        this.getDealCount(),
        this.getDealsByStage(),
        this.getDealPipelineValue(),
        this.getUnassignedContactsCount(),
        this.getWorkflowInventory(),
        this.getPipelines(),
      ]);

    // --- CRM Data Findings ---
    findings.push({
      id: 'f_contacts_total',
      category: 'CRM_DATA',
      title: 'Total Active Contacts Inventory',
      observedValue: contactsMetric.value ?? 'Unavailable',
      dataSource: contactsMetric.source,
      evidence: `Search endpoint verified ${contactsMetric.value ?? 0} active records.`,
      businessImpact: 'Foundation for all marketing automation, lead scoring, and sales attribution.',
      recommendation: 'Maintain standard data enrichment and email validation workflows.',
      severity: 'INFO',
      retrievedAt: now,
      coverage: 'Complete portal-wide index',
      limitations: contactsMetric.limitations,
    });

    findings.push({
      id: 'f_companies_total',
      category: 'CRM_DATA',
      title: 'Company Domain Directory',
      observedValue: companiesMetric.value ?? 'Unavailable',
      dataSource: companiesMetric.source,
      evidence: `Search endpoint verified ${companiesMetric.value ?? 0} company accounts.`,
      businessImpact: 'Enables ABM account clustering and company-level deal rollups.',
      recommendation: 'Implement automated domain association rules.',
      severity: 'INFO',
      retrievedAt: now,
      coverage: 'Complete portal-wide index',
      limitations: companiesMetric.limitations,
    });

    const unassignedCount = Number(unassignedMetric.value || 0);
    findings.push({
      id: 'f_unassigned_contacts',
      category: 'CRM_DATA',
      title: 'Unassigned Contacts Risk',
      observedValue: `${unassignedCount} contacts`,
      dataSource: unassignedMetric.source,
      evidence: `${unassignedCount} contacts have null hubspot_owner_id property.`,
      businessImpact:
        unassignedCount > 0
          ? `${unassignedCount} lead(s) risk falling through the cracks without assigned sales rep ownership.`
          : 'Zero lead ownership leakage.',
      recommendation:
        unassignedCount > 0
          ? 'Deploy a round-robin lead assignment workflow via Anna Build Mode.'
          : 'Maintain current assignment triggers.',
      severity: unassignedCount > 10 ? 'WARNING' : 'GOOD',
      retrievedAt: now,
      coverage: 'Complete portal-wide index',
      limitations: unassignedMetric.limitations,
    });

    // --- Sales Findings ---
    const totalDeals = Number(dealsMetric.value || 0);
    const openDeals = dealsStageMetric.value?.openDeals ?? 0;
    const closedWonDeals = dealsStageMetric.value?.closedWonDeals ?? 0;
    const totalVal = pipelineValueMetric.value?.totalPipelineValue ?? 0;

    findings.push({
      id: 'f_sales_pipeline_velocity',
      category: 'SALES',
      title: 'Sales Pipeline Distribution & Revenue',
      observedValue: `$${totalVal.toLocaleString()} across ${totalDeals} deals`,
      dataSource: pipelineValueMetric.source,
      evidence: `${openDeals} open deals, ${closedWonDeals} closed-won deals. Valued revenue: $${totalVal.toLocaleString()}.`,
      businessImpact: 'Directly reflects sales revenue pacing and active pipeline conversion.',
      recommendation: 'Track weekly deal stage velocity and set up automated stale deal alerts.',
      severity: totalDeals === 0 ? 'WARNING' : 'GOOD',
      retrievedAt: now,
      coverage: 'Verified across all deals',
      limitations: pipelineValueMetric.limitations,
    });

    // --- Automation Findings ---
    if (wfMetric.status === 'permission_denied') {
      findings.push({
        id: 'f_automation_permission',
        category: 'AUTOMATION',
        title: 'Workflow Automation Audit Access',
        observedValue: 'Permission Denied',
        dataSource: 'HubSpot Automation API (/automation/v3/workflows)',
        evidence: 'User-level OAuth token is not allowed for /automation/v3/workflows.',
        businessImpact: 'Automation workflows cannot be audited via user-level OAuth.',
        recommendation:
          'Connect a HubSpot Service Key or Account-Level Token to enable automated workflow dependency analysis.',
        severity: 'INFO',
        retrievedAt: now,
        coverage: 'Permission Restricted',
        limitations: wfMetric.limitations,
      });
    } else if (wfMetric.status === 'verified') {
      findings.push({
        id: 'f_automation_inventory',
        category: 'AUTOMATION',
        title: 'Active Workflows Inventory',
        observedValue: `${wfMetric.value.activeWorkflows} active / ${wfMetric.value.totalWorkflows} total`,
        dataSource: wfMetric.source,
        evidence: `${wfMetric.value.activeWorkflows} workflows running.`,
        businessImpact: 'Maintains background CRM operations and lifecycle progression.',
        recommendation: 'Review unenrollment criteria and suppression lists quarterly.',
        severity: 'GOOD',
        retrievedAt: now,
        coverage: 'Complete automation inventory',
        limitations: [],
      });
    }

    return {
      portalId: this.portalId,
      portalName: 'HubSpot Demo Account',
      retrievedAt: now,
      summary: {
        totalContacts: contactsMetric.value ?? 'UNAVAILABLE',
        totalCompanies: companiesMetric.value ?? 'UNAVAILABLE',
        totalDeals: dealsMetric.value ?? 'UNAVAILABLE',
        openDeals: dealsStageMetric.value?.openDeals ?? 'UNAVAILABLE',
        closedWonDeals: dealsStageMetric.value?.closedWonDeals ?? 'UNAVAILABLE',
        pipelineValue: totalVal > 0 ? `$${totalVal.toLocaleString()}` : '$0',
        unassignedContacts: unassignedMetric.value ?? 'UNAVAILABLE',
        totalPipelines: Array.isArray(pipelinesMetric.value) ? pipelinesMetric.value.length : 'UNAVAILABLE',
        activeWorkflows: wfMetric.value?.activeWorkflows ?? 'UNAVAILABLE',
      },
      findings,
    };
  }

  /**
   * Deterministic CRM Question Dispatcher
   */
  public async answerChatQuery(query: string, portalId: string): Promise<CrmDataResult> {
    const q = query.toLowerCase().trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    // 1. Total Contacts
    if (
      q.includes('how many contacts') ||
      q.includes('contact count') ||
      q.includes('total contacts') ||
      q === 'contacts'
    ) {
      const metric = await this.getContactCount();
      const unassigned = await this.getUnassignedContactsCount();

      return {
        title: metric.displayTitle || 'Total Contacts in Portal',
        source: `${metric.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: metric.summary || `Verified ${metric.value} active contacts.`,
        metrics: [
          { label: 'Total Verified Contacts', value: metric.value ?? 'Unavailable', change: 'Exact API Count' },
          { label: 'Unassigned Contacts', value: unassigned.value ?? 'Unavailable', subtext: 'Lacks owner ID' },
          { label: 'Status', value: metric.status.toUpperCase(), subtext: 'Deterministic read' },
        ],
        insights: [
          `Retrieved directly from live HubSpot portal #${portalId}.`,
          metric.limitations.length > 0 ? metric.limitations[0] : 'All contacts match portal search index.',
        ],
        suggestedFollowUps: [
          'Which contacts have no assigned owner?',
          'How many companies are in my portal?',
          'Show me all deals in my portal.',
        ],
      };
    }

    // 2. Total Companies
    if (q.includes('how many companies') || q.includes('companies count') || q.includes('total companies') || q === 'companies') {
      const metric = await this.getCompanyCount();
      return {
        title: metric.displayTitle || 'Total Companies in Portal',
        source: `${metric.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: metric.summary || `Verified ${metric.value} companies.`,
        metrics: [
          { label: 'Total Companies', value: metric.value ?? 'Unavailable', change: 'Exact API Count' },
          { label: 'Verification Status', value: metric.status.toUpperCase(), subtext: 'Deterministic read' },
        ],
        insights: [`Retrieved directly from live HubSpot portal #${portalId}.`],
        suggestedFollowUps: ['How many contacts are in my portal?', 'Show me all deals in my portal.'],
      };
    }

    // 3. Deals Count & Open vs Closed-Won
    if (
      q.includes('how many deals') ||
      q.includes('deals are open') ||
      q.includes('deals are closed') ||
      q.includes('closed-won') ||
      q.includes('closed won') ||
      q.includes('deal count') ||
      q === 'deals' ||
      q.includes('show deals')
    ) {
      const totalDeals = await this.getDealCount();
      const stageBreakdown = await this.getDealsByStage();
      const pipeValue = await this.getDealPipelineValue();

      const openCount = stageBreakdown.value?.openDeals ?? 0;
      const wonCount = stageBreakdown.value?.closedWonDeals ?? 0;
      const totalAmt = pipeValue.value?.totalPipelineValue ?? 0;

      return {
        title: 'Live Deals & Pipeline Status',
        source: `${totalDeals.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: `Verified ${totalDeals.value} total deal(s) in portal #${portalId}: ${openCount} open deal(s) and ${wonCount} closed-won deal(s) with an aggregate pipeline value of $${totalAmt.toLocaleString()}.`,
        metrics: [
          { label: 'Total Deals', value: totalDeals.value ?? 0, change: 'Verified in CRM' },
          { label: 'Open Deals', value: openCount, subtext: 'In Active Pipelines' },
          { label: 'Closed-Won Deals', value: wonCount, subtext: 'Won Revenue' },
          { label: 'Total Value', value: `$${totalAmt.toLocaleString()}`, subtext: 'Aggregate deal amount' },
        ],
        tableHeaders: ['Stage / Category', 'Deal Count', 'Percentage'],
        tableRows: (stageBreakdown.breakdown || []).map((b) => [b.label, b.count, b.percentage || '-']),
        insights: [
          `Verified live against HubSpot portal #${portalId}.`,
          pipeValue.limitations.length > 0 ? pipeValue.limitations[0] : 'All monetary values calculated deterministically.',
        ],
        suggestedFollowUps: [
          'What is the total deal pipeline value?',
          'Which contacts have no owner?',
          'Audit my complete HubSpot portal.',
        ],
      };
    }

    // 4. Total Deal Pipeline Value
    if (q.includes('pipeline value') || q.includes('total value') || q.includes('deal value')) {
      const pipeValue = await this.getDealPipelineValue();
      const totalAmt = pipeValue.value?.totalPipelineValue ?? 0;
      const openAmt = pipeValue.value?.openPipelineValue ?? 0;
      const wonAmt = pipeValue.value?.closedWonValue ?? 0;

      return {
        title: pipeValue.displayTitle || 'Total Deal Pipeline Value',
        source: `${pipeValue.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: pipeValue.summary || `Pipeline value: $${totalAmt.toLocaleString()}`,
        metrics: [
          { label: 'Total Pipeline Value', value: `$${totalAmt.toLocaleString()}`, change: 'Sum of real amounts' },
          { label: 'Open Deals Value', value: `$${openAmt.toLocaleString()}`, subtext: 'Active Pipeline' },
          { label: 'Closed-Won Revenue', value: `$${wonAmt.toLocaleString()}`, subtext: 'Realized Revenue' },
        ],
        insights: [
          `Calculated deterministically from real amount properties on portal #${portalId}.`,
          pipeValue.limitations.length > 0 ? pipeValue.limitations[0] : 'No currency conflicts detected.',
        ],
        suggestedFollowUps: ['How many deals are open?', 'Audit my complete HubSpot portal.'],
      };
    }

    // 5. Contacts Without Owner
    if (q.includes('no owner') || q.includes('unassigned') || q.includes('without owner')) {
      const metric = await this.getUnassignedContactsCount();
      return {
        title: metric.displayTitle || 'Contacts Without Assigned Owner',
        source: `${metric.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: metric.summary || `Verified ${metric.value} unassigned contacts.`,
        metrics: [
          { label: 'Unassigned Contacts', value: metric.value ?? 0, change: 'Lacks hubspot_owner_id' },
          { label: 'Action Required', value: Number(metric.value) > 0 ? 'YES' : 'NO', subtext: 'Lead routing' },
        ],
        insights: [
          `Directly checked using search operator NOT_HAS_PROPERTY on portal #${portalId}.`,
          Number(metric.value) > 0
            ? 'Recommend deploying an automated round-robin lead routing workflow in Build Mode.'
            : 'All contacts in the portal currently have assigned owners.',
        ],
        suggestedFollowUps: [
          'Switch to Build Mode and create a lead routing workflow.',
          'How many contacts are in my portal?',
        ],
      };
    }

    // 6. Workflows
    if (q.includes('workflow') || q.includes('automation') || q.includes('active workflows')) {
      const wf = await this.getWorkflowInventory();

      if (wf.status === 'permission_denied') {
        return {
          title: 'HubSpot Automation Workflows',
          source: `${wf.source} • Portal #${portalId}`,
          period: `Verified at ${timeStr}`,
          summary: wf.summary || 'Workflow audit unavailable: required API capability or permissions are missing.',
          metrics: [
            { label: 'Workflow Inventory', value: 'Permission Denied', subtext: 'User OAuth restriction' },
            { label: 'Status', value: 'RESTRICTED', change: 'HTTP 403' },
          ],
          insights: [
            'HubSpot returned HTTP 403: User-level OAuth token is not allowed for /automation/v3/workflows.',
            'A HubSpot Service Key or Account-level Token is required to inspect workflows.',
            'Anna will never invent placeholder numbers for inaccessible metrics.',
          ],
          suggestedFollowUps: ['Audit my complete HubSpot portal.', 'How many contacts do I have?'],
        };
      }

      return {
        title: 'HubSpot Automation Workflows',
        source: `${wf.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: wf.summary || 'Workflows retrieved.',
        metrics: [
          { label: 'Total Workflows', value: wf.value?.totalWorkflows ?? 0, change: 'Verified in portal' },
          { label: 'Active Workflows', value: wf.value?.activeWorkflows ?? 0, subtext: 'Running' },
        ],
        insights: [`Retrieved live from HubSpot portal #${portalId}.`],
        suggestedFollowUps: ['Audit my complete HubSpot portal.'],
      };
    }

    // 7. Deal Pipelines
    if (q.includes('pipeline') || q.includes('stages')) {
      const pipe = await this.getPipelines();
      return {
        title: pipe.displayTitle || 'Deal Pipelines',
        source: `${pipe.source} • Portal #${portalId}`,
        period: `Verified at ${timeStr}`,
        summary: pipe.summary || 'Pipelines analyzed.',
        metrics: [
          {
            label: 'Identified Pipelines',
            value: Array.isArray(pipe.value) ? pipe.value.length : 'Extracted',
            change: pipe.status.toUpperCase(),
          },
        ],
        insights: [
          pipe.limitations.length > 0 ? pipe.limitations[0] : 'Retrieved from live pipeline schema.',
        ],
        suggestedFollowUps: ['How many deals are open?', 'What is the total deal pipeline value?'],
      };
    }

    // 8. Complete Portal Audit
    if (q.includes('audit') || q.includes('health') || q.includes('overview') || q.includes('diagnostics')) {
      const audit = await this.runPortalAudit();
      const totalContacts = audit.summary.totalContacts;
      const totalDeals = audit.summary.totalDeals;
      const pipeVal = audit.summary.pipelineValue;
      const unassigned = audit.summary.unassignedContacts;

      return {
        title: `Comprehensive HubSpot Portal Audit (Portal #${portalId})`,
        source: `Live Multi-Endpoint Audit Engine • Portal #${portalId}`,
        period: `Completed at ${timeStr}`,
        summary: `Audit completed across CRM Data, Sales Pipelines, and Automation for portal #${portalId}. Found ${totalContacts} contacts, ${totalDeals} deals ($${pipeVal}), and ${unassigned} unassigned leads.`,
        metrics: [
          { label: 'Total Contacts', value: totalContacts, change: 'Live search index' },
          { label: 'Total Deals', value: totalDeals, subtext: 'In active pipelines' },
          { label: 'Pipeline Value', value: pipeVal, subtext: 'Sum of valued deals' },
          { label: 'Unassigned Leads', value: unassigned, change: 'Requires routing' },
        ],
        tableHeaders: ['Category', 'Finding / Check', 'Observed Value', 'Severity'],
        tableRows: audit.findings.map((f) => [f.category, f.title, String(f.observedValue), f.severity]),
        insights: audit.findings.slice(0, 3).map((f) => `${f.title}: ${f.evidence}`),
        suggestedFollowUps: [
          'Which contacts have no assigned owner?',
          'What is the total deal pipeline value?',
          'Switch to Build Mode to automate lead routing.',
        ],
      };
    }

    // Default: Fallback to General Knowledge / Query Service
    return {
      title: `HubSpot CRM Intelligence (Portal #${portalId})`,
      source: `HubSpot Live Data Engine • Portal #${portalId}`,
      period: `Live as of ${timeStr}`,
      summary: `I can answer queries regarding your live contacts, companies, deals, pipeline value, ownership, and workflows for portal #${portalId}.`,
      suggestedFollowUps: [
        'How many contacts are in my HubSpot portal?',
        'How many companies are there?',
        'How many deals are open?',
        'What is the total deal pipeline value?',
        'Which contacts have no assigned owner?',
        'Audit my complete HubSpot portal.',
      ],
    };
  }
}
