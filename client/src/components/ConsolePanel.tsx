/*
 * ConsolePanel Component — Slate Studio Design
 * Code execution output console
 * Features: colored output, error display, clear button
 */

import { useRef, useEffect } from "react";
import { Terminal, Trash2, Circle } from "lucide-react";
import type { ConsoleEntry } from "@/hooks/useCodeExecution";

interface ConsolePanelProps {
  entries: ConsoleEntry[];
  isRunning: boolean;
  onClear: () => void;
}

const ENTRY_STYLES: Record<ConsoleEntry["type"], string> = {
  output: "text-slate-200",
  error: "text-red-400",
  info: "text-slate-400 italic",
  success: "text-emerald-400",
  command: "text-amber-400 font-semibold",
};

const ENTRY_PREFIXES: Record<ConsoleEntry["type"], string> = {
  output: "",
  error: "✗ ",
  info: "",
  success: "✓ ",
  command: "",
};

export function ConsolePanel({ entries, isRunning, onClear }: ConsolePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-header px-4 py-2.5 flex items-center gap-2 flex-shrink-0">
        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-semibold text-white">Console</span>
        
        {isRunning && (
          <div className="flex items-center gap-1.5 ml-2">
            <Circle className="w-2 h-2 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400">Running...</span>
          </div>
        )}
        
        <button
          onClick={onClear}
          className="ml-auto p-1 rounded text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
          title="Clear console"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Console output */}
      <div className="flex-1 overflow-y-auto p-3 bg-[oklch(0.10_0.008_264)] font-code text-xs leading-relaxed">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`mb-0.5 ${ENTRY_STYLES[entry.type]}`}
          >
            {entry.type === "error" && (
              <div className="flex items-start gap-1.5 py-0.5 px-2 rounded bg-red-500/8 border-l-2 border-red-500 mb-1">
                <span className="text-red-400 leading-relaxed whitespace-pre-wrap break-all">
                  {ENTRY_PREFIXES[entry.type]}{entry.content}
                </span>
              </div>
            )}
            {entry.type === "success" && (
              <div className="flex items-start gap-1.5 py-0.5 px-2 rounded bg-emerald-500/8 border-l-2 border-emerald-500 mb-1">
                <span className="text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                  {ENTRY_PREFIXES[entry.type]}{entry.content}
                </span>
              </div>
            )}
            {entry.type !== "error" && entry.type !== "success" && (
              <span className="whitespace-pre-wrap break-all">
                {ENTRY_PREFIXES[entry.type]}{entry.content}
              </span>
            )}
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center gap-1.5 text-amber-400 mt-1">
            <span className="cursor-blink">▋</span>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
