import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ShieldAlert,
  Hammer,
  Database,
  BarChart3,
} from 'lucide-react';
import { AnnaChatMessage } from '@huboverse/types';
import { INITIAL_ANNA_MESSAGES, DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';
import { runAnnaChatStep } from '@huboverse/ai-agent';

interface AnnaChatInterfaceProps {
  onSwitchToBuildMode: (suggestedPrompt?: string) => void;
  portalId?: string;
  portalName?: string;
}

/**
 * Helper to parse bold, inline code, and links cleanly
 */
function parseInlineStyles(text: string): React.ReactNode {
  // Regex to match **bold**, `code`, or [link](url)
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-[#131B2E] text-blue-300 font-mono text-[11px] border border-[#1E293B]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target="_blank"
            rel="noreferrer"
            className="text-[#2F6FED] hover:underline font-medium"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
}

/**
 * Neat and clean message renderer for Anna's responses
 */
const FormattedMessageContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs sm:text-sm text-gray-200 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return null;
        }

        // Ignore raw markdown table separators like |---|---|
        if (/^\|[-:\s|]+\|$/.test(trimmed)) {
          return null;
        }

        // Handle raw table lines if any: | col1 | col2 | col3 |
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          const cells = trimmed
            .split('|')
            .map((c) => c.trim())
            .filter(Boolean);
          if (cells.length > 0) {
            return (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0D1322] border border-[#1E293B] text-xs my-1"
              >
                <span className="font-medium text-gray-300">{parseInlineStyles(cells[0])}</span>
                <span className="font-mono text-blue-300 font-semibold">
                  {parseInlineStyles(cells.slice(1).join(' — '))}
                </span>
              </div>
            );
          }
          return null;
        }

        // Headings: ### Title or ## Title
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={idx}
              className="text-sm font-semibold text-white tracking-wide pt-1 pb-0.5 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-3.5 bg-[#2F6FED] rounded-sm shrink-0" />
              <span>{parseInlineStyles(title)}</span>
            </h4>
          );
        }

        // Section labels: **Key CRM Metrics:** or **Actionable Insights:**
        if (
          trimmed.startsWith('**Key CRM Metrics') ||
          trimmed.startsWith('**Actionable Insight') ||
          trimmed.startsWith('**Key Insights')
        ) {
          return (
            <div key={idx} className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider pt-2 pb-0.5">
              {parseInlineStyles(trimmed)}
            </div>
          );
        }

        // Bullet items: • or - or *
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5 pl-1 text-gray-300">
              <span className="text-[#2F6FED] font-bold text-sm shrink-0 leading-none mt-1">•</span>
              <div className="flex-1 leading-relaxed">{parseInlineStyles(itemText)}</div>
            </div>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*/, '');
          return (
            <div
              key={idx}
              className="border-l-2 border-[#2F6FED] pl-3 py-1 my-1.5 text-xs text-gray-300 bg-[#131B2E]/40 rounded-r"
            >
              {parseInlineStyles(quoteText)}
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const AnnaChatInterface: React.FC<AnnaChatInterfaceProps> = ({
  onSwitchToBuildMode,
  portalId,
  portalName,
}) => {
  const activePortalId = portalId || '46100478';
  const activePortalName = portalName || 'HubSpot Connected Account';
  const [messages, setMessages] = useState<AnnaChatMessage[]>(INITIAL_ANNA_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedQuickQuestions = [
    'Audit my complete HubSpot portal.',
    'How many contacts are in my HubSpot portal?',
    'How many companies are there?',
    'How many deals are open?',
    'What is the total deal pipeline value?',
    'Which contacts have no assigned owner?',
    'Show my sales pipelines and deal stages.',
    'What workflows are currently active?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMessage: AnnaChatMessage = {
      id: `usr_${Date.now()}`,
      conversationId: 'conv_demo_01',
      sender: 'USER',
      content: text,
      mode: 'CHAT',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Execute read-only CRM query through server route handler
      const res = await fetch('/api/anna/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          conversationId: 'conv_demo_01',
          portalId: activePortalId,
        }),
      });

      let result;
      if (res.ok) {
        result = await res.json();
      } else {
        // Fallback to client-side agent
        result = await runAnnaChatStep({
          conversationId: 'conv_demo_01',
          userQuery: text,
          organizationId: 'org_enterprise_01',
          portalContext: {
            portalId: activePortalId,
            hubs: DEMO_HUBSPOT_CONNECTION.hubs,
          },
          retrievedCitations: [],
          responseMarkdown: '',
          suggestedPrompts: [],
          tokensConsumed: 0,
        });
      }

      setIsTyping(false);

      const botReply: AnnaChatMessage = {
        id: `anna_${Date.now()}`,
        conversationId: 'conv_demo_01',
        sender: 'ANNA',
        content: result.responseMarkdown,
        mode: 'CHAT',
        citations: [
          {
            id: `cit_${Date.now()}`,
            sourceType: 'PORTAL_SCHEMA',
            title: `Live CRM Data: Portal #${activePortalId}`,
            snippet: result.dataResult?.summary || 'Authorised HubSpot CRM API response.',
            url: `https://app.hubspot.com/contacts/${activePortalId}`,
          },
        ],
        suggestedPrompts: result.suggestedPrompts,
        tokensUsed: result.tokensConsumed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      setIsTyping(false);
      const errorReply: AnnaChatMessage = {
        id: `err_${Date.now()}`,
        conversationId: 'conv_demo_01',
        sender: 'ANNA',
        content: `### Query Execution Error\n\nCould not retrieve data from HubSpot: ${err.message}. Please verify OAuth credentials and portal connectivity.`,
        mode: 'CHAT',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16]">
      {/* Top Banner with Read-Only Boundary Notice */}
      <div className="px-6 py-2.5 bg-[#080D1A] border-b border-[#1E293B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-white font-bold">Anna Chat Mode</span>
          <span className="text-gray-400 hidden sm:inline">• Live HubSpot Read-Only Intelligence (Portal #{DEMO_HUBSPOT_CONNECTION.portalId})</span>
        </div>

        <button
          onClick={() => onSwitchToBuildMode()}
          className="text-[#FF5C00] hover:text-[#FF7A00] font-bold flex items-center gap-1.5 transition-colors text-xs"
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Switch to Build Mode →</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${
              msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-tr from-[#2F6FED] to-blue-400 text-white shadow-md shadow-[#2F6FED]/25'
              }`}
            >
              {msg.sender === 'USER' ? 'YOU' : 'AI'}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed border ${
                msg.sender === 'USER'
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-50'
                  : 'bg-[#0B0F19] border-[#1E293B] text-gray-200 shadow-xl'
              }`}
            >
              {msg.sender === 'USER' ? (
                <div className="whitespace-pre-line text-xs sm:text-sm text-blue-50 leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <FormattedMessageContent content={msg.content} />
              )}

              {/* Citations / Source Badge */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1E293B]/70 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-gray-300 font-medium">Live CRM Source:</span>
                    <span className="truncate text-gray-400">HubSpot Portal #{activePortalId} ({activePortalName})</span>
                  </div>
                  {msg.citations[0]?.url && (
                    <a
                      href={msg.citations[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2F6FED] hover:text-blue-400 font-medium flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Open CRM</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Suggested Follow-ups */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1E293B]/70">
                  <div className="text-[11px] font-medium text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#2F6FED]" />
                    <span>Suggested Next Inquiries:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          if (prompt.toLowerCase().includes('build mode')) {
                            onSwitchToBuildMode(prompt);
                          } else {
                            handleSend(prompt);
                          }
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#1E293B] text-gray-300 hover:text-white border border-[#1E293B] hover:border-[#2F6FED]/50 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              {msg.sender === 'ANNA' && (
                <div className="mt-3 flex items-center justify-between text-gray-400 text-[11px] pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-white p-1 rounded hover:bg-[#131B2E] flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  {msg.tokensUsed && (
                    <span className="font-mono text-[10px] text-gray-500">
                      Tokens: {msg.tokensUsed} • Read-Only
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-[#2F6FED]/20 flex items-center justify-center text-xs text-[#2F6FED]">
              AI
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1E293B] flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce [animation-delay:0.4s]" />
              <span>Querying HubSpot CRM API...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Quick Bar */}
      <div className="px-6 py-2 bg-[#080D1A] border-t border-[#1E293B] overflow-x-auto">
        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-[11px] font-mono text-[#2F6FED] uppercase font-bold shrink-0">
            Quick Queries:
          </span>
          {suggestedQuickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#0B0F19] hover:bg-[#131B2E] text-gray-300 hover:text-white border border-[#1E293B] transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 sm:p-5 bg-[#080D1A] border-t border-[#1E293B]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-center gap-3 bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-2 px-4 shadow-xl focus-within:border-[#2F6FED]/60 transition-colors"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about contacts, deals, pipelines, or active automations..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#2F6FED]/20 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
