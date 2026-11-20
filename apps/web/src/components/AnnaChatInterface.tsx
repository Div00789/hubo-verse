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
}

export const AnnaChatInterface: React.FC<AnnaChatInterfaceProps> = ({ onSwitchToBuildMode }) => {
  const [messages, setMessages] = useState<AnnaChatMessage[]>(INITIAL_ANNA_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedQuickQuestions = [
    'How many contacts are in my HubSpot portal?',
    'How many new leads were created this month?',
    'Show me deals closing this week.',
    'Which deals have no recent activity?',
    'What workflows are currently active?',
    'Show my sales pipelines and deal stages.',
    'Which contacts have no assigned owner?',
    'Which sales representatives have the highest deal values?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

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
      // Execute read-only CRM query through HuboVerse AI Agent layer
      const result = await runAnnaChatStep({
        conversationId: 'conv_demo_01',
        userQuery: text,
        organizationId: 'org_enterprise_01',
        portalContext: {
          portalId: DEMO_HUBSPOT_CONNECTION.portalId,
          hubs: DEMO_HUBSPOT_CONNECTION.hubs,
        },
        retrievedCitations: [],
        responseMarkdown: '',
        suggestedPrompts: [],
        tokensConsumed: 0,
      });

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
            title: `Live CRM Data: Portal #${DEMO_HUBSPOT_CONNECTION.portalId}`,
            snippet: result.dataResult?.summary || 'Authorised HubSpot CRM API response.',
            url: `https://app.hubspot.com/contacts/${DEMO_HUBSPOT_CONNECTION.portalId}`,
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
              <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                {msg.content}
              </div>

              {/* Citations Drawer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-2">
                  <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#2F6FED]" />
                    <span>Verified HubSpot API Source:</span>
                  </div>
                  {msg.citations.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#080D1A] p-2.5 rounded-xl border border-[#1E293B] text-xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{c.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5 truncate">{c.snippet}</div>
                      </div>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2F6FED] hover:text-blue-400 shrink-0 flex items-center gap-1 text-[11px] font-bold"
                        >
                          <span>Open CRM</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Follow-ups */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-1.5">
                  <div className="text-[11px] font-semibold text-gray-400">Suggested Next Inquiries:</div>
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
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 hover:text-white border border-[#1E293B] transition-colors text-left"
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
