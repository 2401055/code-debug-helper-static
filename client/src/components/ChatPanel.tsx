/*
 * ChatPanel Component — Slate Studio Design
 * Full chat interface with AI debugging assistant
 * Features: message history, streaming responses, code context
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Square, Trash2, Sparkles, Code2, MessageSquare } from "lucide-react";
import { StepByStepDebugButton } from "./StepByStepDebug";
import { ChatMessage, ThinkingIndicator } from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/hooks/useAIChat";

interface ChatPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (message: string, code?: string, language?: string) => void;
  onStopGeneration: () => void;
  onClearChat: () => void;
  currentCode?: string;
  currentLanguage?: string;
}

const QUICK_PROMPTS = [
  { label: "Analyze my code", icon: "🔍", prompt: "Please analyze my code and identify any bugs or issues." },
  { label: "Explain the error", icon: "❓", prompt: "Can you explain what this error means and how to fix it?" },
  { label: "Fix the bug", icon: "🛠️", prompt: "Please fix the bug in my code and explain what was wrong." },
  { label: "Best practices", icon: "📚", prompt: "What best practices should I follow to improve this code?" },
  { label: "Optimize code", icon: "⚡", prompt: "How can I optimize this code for better performance?" },
  { label: "Add error handling", icon: "🛡️", prompt: "Please add proper error handling to my code." },
];

export function ChatPanel({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  onClearChat,
  currentCode,
  currentLanguage,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [includeCode, setIncludeCode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSend = useCallback(() => {
    if (!input.trim() && !currentCode) return;
    if (isLoading) return;

    const code = includeCode && currentCode?.trim() ? currentCode : undefined;
    const lang = includeCode && currentCode?.trim() ? currentLanguage : undefined;

    onSendMessage(input.trim() || "Please analyze my code.", code, lang);
    setInput("");
  }, [input, isLoading, includeCode, currentCode, currentLanguage, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    const code = includeCode && currentCode?.trim() ? currentCode : undefined;
    const lang = includeCode && currentCode?.trim() ? currentLanguage : undefined;
    onSendMessage(prompt, code, lang);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="panel-header px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-white">AI Debug Chat</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onClearChat}
            className="p-1.5 rounded-md text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.isStreaming === undefined && (
          <ThinkingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Step-by-Step Debug */}
      {currentCode && (
        <div className="px-3 pb-2 border-t border-white/5 pt-2">
          <StepByStepDebugButton
            onStartDebugging={(prompt) => {
              const code = includeCode && currentCode?.trim() ? currentCode : undefined;
              const lang = includeCode && currentCode?.trim() ? currentLanguage : undefined;
              onSendMessage(prompt, code, lang);
            }}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Quick Prompts */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap border-t border-white/5 pt-2">
        {QUICK_PROMPTS.slice(0, 3).map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleQuickPrompt(qp.prompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{qp.icon}</span>
            <span>{qp.label}</span>
          </button>
        ))}
        {QUICK_PROMPTS.slice(3).map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleQuickPrompt(qp.prompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{qp.icon}</span>
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-3 pb-3 flex-shrink-0">
        {/* Code context toggle */}
        {currentCode && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <button
              onClick={() => setIncludeCode(!includeCode)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                includeCode ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                  includeCode
                    ? "bg-amber-500 border-amber-500"
                    : "border-white/20"
                }`}
              >
                {includeCode && (
                  <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <Code2 className="w-3 h-3" />
              Include editor code
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your code, paste an error, or describe the problem..."
              rows={1}
              className="w-full resize-none px-4 py-3 pr-12 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all leading-relaxed"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <div className="absolute right-3 bottom-2.5 text-xs text-muted-foreground/50">
              ↵
            </div>
          </div>

          {isLoading ? (
            <button
              onClick={onStopGeneration}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Stop generation"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() && !currentCode}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed amber-glow"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5 px-1">
          <span className="text-xs text-muted-foreground/50">
            Shift+Enter for new line
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Claude</span>
          </div>
        </div>
      </div>
    </div>
  );
}
