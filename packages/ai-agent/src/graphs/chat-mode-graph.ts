import { AnnaCitation } from '@huboverse/types';

export interface ChatGraphState {
  conversationId: string;
  userQuery: string;
  organizationId: string;
  portalContext?: {
    portalId: string;
    hubs: Record<string, string>;
  };
  retrievedCitations: AnnaCitation[];
  responseMarkdown: string;
  suggestedPrompts: string[];
  tokensConsumed: number;
}

/**
 * Anna Chat Mode Orchestrator
 * Executes RAG retrieval over HuboVerse Academy & HubSpot Knowledge,
 * enriches with portal context, and produces an enterprise-grade explanation.
 */
export async function runAnnaChatStep(state: ChatGraphState): Promise<ChatGraphState> {
  const citations: AnnaCitation[] = [];

  // Simulated pgvector hybrid similarity search over knowledge base
  if (state.userQuery.toLowerCase().includes('lead scoring') || state.userQuery.toLowerCase().includes('score')) {
    citations.push({
      id: 'cite_1',
      sourceType: 'HUBSPOT_DOC',
      title: 'HubSpot Predictive Lead Scoring & Custom Criteria',
      snippet: 'Lead scoring allows teams to assign numeric values to contacts based on behavioral events and profile attributes.',
      url: 'https://knowledge.hubspot.com/crm-setup/set-up-lead-scoring',
    });
    citations.push({
      id: 'cite_2',
      sourceType: 'ACADEMY_LESSON',
      title: 'HuboVerse Masterclass: Enterprise Scoring Workflows (Module 3)',
      snippet: 'Negative scoring attributes (unsubscribes, invalid domains, inactivity > 90d) are critical to prevent CRM bloat.',
    });
  } else if (state.userQuery.toLowerCase().includes('workflow') || state.userQuery.toLowerCase().includes('enroll')) {
    citations.push({
      id: 'cite_3',
      sourceType: 'HUBSPOT_DOC',
      title: 'Troubleshooting Workflow Enrollment Triggers',
      snippet: 'Common causes of un-enrolled contacts: re-enrollment criteria disabled, un-met filter triggers, or active suppression lists.',
      url: 'https://knowledge.hubspot.com/workflows/troubleshoot-workflow-enrollment',
    });
  }

  // Synthesize intelligent response
  let response = '';
  let followUps: string[] = [];

  if (state.userQuery.toLowerCase().includes('lead scoring')) {
    response = `### How HubSpot Lead Scoring Works & Best Practices

HubSpot offers both **Traditional Manual Scoring** (rules-based points) and **Predictive Lead Scoring** (powered by machine learning for Marketing Pro & Enterprise tiers).

1. **Explicit Scoring (Demographic / Firmographic)**:
   - Assign positive points for target Job Titles (e.g., *VP, Director, Head of CRM* +15 pts).
   - Assign points for target Company Size and Revenue.
2. **Implicit Scoring (Behavioral / Engagement)**:
   - Form Submissions (High-intent demo request: +30 pts; eBook download: +5 pts).
   - High-value page visits (Pricing page visited $\\ge 2$ times: +20 pts).
   - Marketing Email interactions (3 consecutive opens: +10 pts).
3. **Negative Scoring (Decay & Qualification Filters)**:
   - Inactive for $>60$ days: -15 pts.
   - Non-business email domains (e.g., \`@gmail.com\`, \`@yahoo.com\`): -10 pts.

> **HuboVerse Recommendation:** Do not set workflow triggers immediately to Sales Qualified Lead (SQL) on score thresholds until you calibrate your model against historical close rates.`;

    followUps = [
      'Anna, switch to Build Mode and set up Lead Scoring properties for my portal.',
      'How do I create an automatic decay workflow after 45 days of inactivity?',
      'Show me the HuboVerse Academy module on Lead Lifecycle Mapping.',
    ];
  } else {
    response = `I analyzed your portal configuration for **Portal #${state.portalContext?.portalId || 'Primary'}**.

Regarding your inquiry: "${state.userQuery}"

Based on HuboVerse best-practice architecture:
- Ensure your custom properties adhere to naming conventions (\`snake_case\` internal identifiers).
- For automated workflow actions, verify that your portal holds the appropriate HubSpot Professional or Enterprise tier.
- You can activate **Anna Build Mode** at any time to preview and execute verified CRM changes with safety diffs.`;

    followUps = [
      'Anna, run a database hygiene audit on our portal.',
      'What are our current HubSpot API scope limits?',
      'Help me design a multi-touch attribution workflow.',
    ];
  }

  return {
    ...state,
    retrievedCitations: citations,
    responseMarkdown: response,
    suggestedPrompts: followUps,
    tokensConsumed: 480,
  };
}
