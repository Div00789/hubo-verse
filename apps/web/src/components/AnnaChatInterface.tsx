import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { AnnaChatMessage } from '@huboverse/types';
import { INITIAL_ANNA_MESSAGES } from '@huboverse/database';

interface AnnaChatInterfaceProps {
  onSwitchToBuildMode: (suggestedPrompt?: string) => void;
}

export const AnnaChatInterface: React.FC<AnnaChatInterfaceProps> = ({ onSwitchToBuildMode }) => {
  const [messages, setMessages] = useState<AnnaChatMessage[]>(INITIAL_ANNA_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
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

    // Check if the user intends to switch to build mode
    if (text.toLowerCase().includes('build mode') || text.toLowerCase().includes('create') || text.toLowerCase().includes('property')) {
      setTimeout(() => {
        setIsTyping(false);
        const botReply: AnnaChatMessage = {
          id: `anna_${Date.now()}`,
          conversationId: 'conv_demo_01',
          sender: 'ANNA',
          content: `I detect that you wish to execute a structural CRM change: "${text}".\n\nI am handing this task off to **Anna Build Mode** where you can inspect the Action Capability verification, review the dry-run JSON schema diff, and approve execution safely.`,
          mode: 'CHAT',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botReply]);
        setTimeout(() => {
          onSwitchToBuildMode(text);
        }, 1200);
      }, 900);
      return;
    }

    // Default intelligent RAG advisor simulation
    setTimeout(() => {
      setIsTyping(false);
      const botReply: AnnaChatMessage = {
        id: `anna_${Date.now()}`,
        conversationId: 'conv_demo_01',
        sender: 'ANNA',
        content: `### Analysis for Portal #44891204 (Acme Global)

Regarding: **"${text}"**

1. **Lead Scoring Calibration**:
   - In your Sales Enterprise hub, define predictive criteria based on closed-won velocity.
   - For Marketing Pro, set up negative scoring rules (-15 pts for inactive domain or bounces).
2. **Workflow Enrollment Safeguard**:
   - Verify un-enrollment triggers to prevent contacts from re-entering lead nurturing cycles multiple times unless explicitly configured.
3. **HuboVerse Recommendation**:
   - Test this scenario in a sandbox environment or preview via **Anna Build Mode** before applying to your primary contact list.`,
        mode: 'CHAT',
        citations: [
          {
            id: 'cit_1',
            sourceType: 'HUBSPOT_DOC',
            title: 'HubSpot Knowledge Base: Lead Scoring Criteria',
            snippet: 'Rules and attributes configuration for custom scoring properties.',
            url: 'https://knowledge.hubspot.com',
          },
          {
            id: 'cit_2',
            sourceType: 'ACADEMY_LESSON',
            title: 'HuboVerse Academy: Enterprise Lifecycle Engineering (Module 2)',
            snippet: 'Step-by-step framework for setting SQL thresholds.',
          },
        ],
        suggestedPrompts: [
          'Switch to Build Mode and create the Lead Scoring properties.',
          'Show me workflow enrollment troubleshooting steps.',
          'Analyze our deal stage conversion percentages.',
        ],
        tokensUsed: 420,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16]">
      {/* Top Banner */}
      <div className="px-6 py-2.5 bg-[#0F172A]/80 border-b border-[#1E293B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">Anna Chat Mode Active</span>
          <span className="text-gray-400">• RAG Knowledge Base + Portal Schema Grounded</span>
        </div>
        <button
          onClick={() => onSwitchToBuildMode()}
          className="text-[#FF5C00] hover:text-[#FF7A00] font-medium flex items-center gap-1 transition-colors"
        >
          <span>Switch to Build Mode</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-tr from-[#FF5C00] to-amber-500 text-white shadow-md shadow-[#FF5C00]/30'
              }`}
            >
              {msg.sender === 'USER' ? 'YOU' : 'AI'}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 text-sm leading-relaxed border ${
                msg.sender === 'USER'
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-50'
                  : 'bg-[#0F172A] border-[#1E293B] text-gray-200'
              }`}
            >
              <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm">
                {msg.content}
              </div>

              {/* Citations Drawer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-1.5">
                  <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#FF5C00]" />
                    <span>Verified Knowledge Citations:</span>
                  </div>
                  {msg.citations.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#131B2E] p-2 rounded border border-[#1E293B] text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="font-medium text-gray-300">{c.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{c.snippet}</div>
                      </div>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF5C00] hover:text-[#FF7A00] shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Actions */}
              {msg.sender === 'ANNA' && (
                <div className="mt-3 flex items-center justify-between text-gray-400 text-[11px] pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <button className="hover:text-white p-1 rounded hover:bg-[#131B2E]">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="hover:text-white p-1 rounded hover:bg-[#131B2E]">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-white p-1 rounded hover:bg-[#131B2E] flex items-center gap-1 ml-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  {msg.tokensUsed && <span>{msg.tokensUsed} tokens</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5C00] to-amber-500 text-white flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5C00] animate-spin" />
              <span>Anna is analyzing portal schemas & knowledge base...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Follow-Ups */}
      {messages[messages.length - 1]?.suggestedPrompts && (
        <div className="px-6 py-2 flex flex-wrap gap-2 border-t border-[#1E293B]/60 bg-[#0B101D]">
          {messages[messages.length - 1].suggestedPrompts!.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="text-xs px-2.5 py-1 rounded-full bg-[#131B2E] border border-[#1E293B] text-gray-300 hover:text-white hover:border-[#FF5C00]/50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0B101D]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Anna about workflows, lead scoring, custom objects, or troubleshooting..."
            className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FF5C00] shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white font-medium text-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#FF5C00]/25 flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
