/* 
 * ChatMessage Component — Slate Studio Design
 * Renders AI and user messages with markdown support
 * AI messages: amber left border, dark surface
 * User messages: right-aligned, accent background
 */

import { useState } from "react";
import { Copy, Check, Bot, User } from "lucide-react";
import { toast } from "sonner";
import type { ChatMessage as ChatMessageType } from "@/hooks/useAIChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Simple markdown renderer for code blocks and basic formatting
function renderMarkdown(content: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = content;
  let key = 0;

  while (remaining.length > 0) {
    // Code block
    const codeBlockMatch = remaining.match(/^([\s\S]*?)```(\w*)\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const [fullMatch, before, lang, code] = codeBlockMatch;
      if (before) {
        parts.push(
          <span key={key++} className="whitespace-pre-wrap">
            {renderInlineMarkdown(before)}
          </span>
        );
      }
      parts.push(
        <CodeBlock key={key++} language={lang} code={code.trimEnd()} />
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // Inline code
    const inlineCodeMatch = remaining.match(/^([\s\S]*?)`([^`]+)`/);
    if (inlineCodeMatch) {
      const [fullMatch, before, code] = inlineCodeMatch;
      if (before) {
        parts.push(
          <span key={key++} className="whitespace-pre-wrap">
            {renderInlineMarkdown(before)}
          </span>
        );
      }
      parts.push(
        <code
          key={key++}
          className="font-code text-[13px] px-1.5 py-0.5 rounded bg-white/10 text-amber-300"
        >
          {code}
        </code>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // No more patterns found
    parts.push(
      <span key={key++} className="whitespace-pre-wrap">
        {renderInlineMarkdown(remaining)}
      </span>
    );
    break;
  }

  return <>{parts}</>;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Process headers, bold, italic line by line
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const isLast = i === lines.length - 1;
    
    // H1
    if (line.startsWith("# ")) {
      return (
        <span key={i}>
          <span className="block text-xl font-bold text-white mt-3 mb-1">
            {processBold(line.slice(2))}
          </span>
          {!isLast && ""}
        </span>
      );
    }
    // H2
    if (line.startsWith("## ")) {
      return (
        <span key={i}>
          <span className="block text-lg font-semibold text-white/90 mt-2 mb-1">
            {processBold(line.slice(3))}
          </span>
          {!isLast && ""}
        </span>
      );
    }
    // H3
    if (line.startsWith("### ")) {
      return (
        <span key={i}>
          <span className="block text-base font-semibold text-amber-300 mt-2 mb-0.5">
            {processBold(line.slice(4))}
          </span>
          {!isLast && ""}
        </span>
      );
    }
    // Numbered list
    if (/^\d+\. /.test(line)) {
      return (
        <span key={i}>
          <span className="block ml-4">{processBold(line)}</span>
          {!isLast && ""}
        </span>
      );
    }
    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <span key={i}>
          <span className="block ml-4">• {processBold(line.slice(2))}</span>
          {!isLast && ""}
        </span>
      );
    }
    
    return (
      <span key={i}>
        {processBold(line)}
        {!isLast && "\n"}
      </span>
    );
  });
}

function processBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-code text-muted-foreground uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-[oklch(0.13_0.01_264)]">
        <code className="font-code text-[13px] leading-relaxed text-slate-200">
          {code}
        </code>
      </pre>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return (
      <div className="animate-fade-up flex gap-3 mb-4">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663431734583/N8UepZvgR2D2fMJhV8ypsw/ai-avatar-RvFHVRrfpmHD9SjghsrG2w.webp"
            alt="AI"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
            }}
          />
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-400">Debug AI</span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div
            className="text-sm leading-relaxed text-slate-200 ai-message-bar pl-3"
            style={{ borderLeft: "2px solid oklch(0.72 0.18 55)" }}
          >
            {renderMarkdown(message.content)}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-amber-400 cursor-blink align-middle" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="animate-fade-up flex gap-3 mb-4 flex-row-reverse">
      {/* User Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <User className="w-4 h-4 text-slate-300" />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-xs font-semibold text-slate-300">You</span>
        </div>
        <div className="max-w-[85%] rounded-xl rounded-tr-sm px-4 py-3 bg-white/8 border border-white/10 text-sm text-slate-200 leading-relaxed">
          {renderMarkdown(message.content)}
        </div>
      </div>
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="animate-fade-up flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-amber-400">Debug AI</span>
        </div>
        <div className="flex items-center gap-1.5 py-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-400"
              style={{
                animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">Analyzing...</span>
        </div>
      </div>
    </div>
  );
}
