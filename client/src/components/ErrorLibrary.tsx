/*
 * ErrorLibrary Component — Slate Studio Design
 * Browsable library of common programming errors
 * with broken/fixed code examples
 */

import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Copy, Check, BookOpen, AlertTriangle } from "lucide-react";
import { ERROR_LIBRARY, type ErrorEntry } from "@/lib/errorLibrary";
import { toast } from "sonner";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  JavaScript: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Java: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "C++": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Runtime Error": "text-red-400 bg-red-400/10",
  "Syntax Error": "text-amber-400 bg-amber-400/10",
  "Async Error": "text-cyan-400 bg-cyan-400/10",
};

interface ErrorCardProps {
  entry: ErrorEntry;
  onLoadCode?: (code: string, language: string) => void;
}

function ErrorCard({ entry, onLoadCode }: ErrorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showFixed, setShowFixed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const langColor = LANGUAGE_COLORS[entry.language] || "text-slate-400 bg-slate-400/10 border-slate-400/20";
  const catColor = CATEGORY_COLORS[entry.category] || "text-slate-400 bg-slate-400/10";

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 overflow-hidden transition-all duration-200 hover:border-white/15">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/3 transition-colors"
      >
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${langColor}`}>
              {entry.language}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${catColor}`}>
              {entry.category}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 leading-tight">{entry.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{entry.description}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-white/8 p-4 space-y-4">
          {/* Explanation */}
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              Why This Happens
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{entry.explanation}</p>
          </div>

          {/* Code toggle */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowFixed(false)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  !showFixed
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                ❌ Broken Code
              </button>
              <button
                onClick={() => setShowFixed(true)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  showFixed
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                ✅ Fixed Code
              </button>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-code text-muted-foreground">
                  {entry.language.toLowerCase()}
                </span>
                <div className="flex items-center gap-2">
                  {onLoadCode && (
                    <button
                      onClick={() =>
                        onLoadCode(
                          showFixed ? entry.fixedCode : entry.brokenCode,
                          entry.language.toLowerCase()
                        )
                      }
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Load in Editor
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(showFixed ? entry.fixedCode : entry.brokenCode)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              <pre className="p-3 overflow-x-auto bg-[#0d1117] text-xs font-code leading-relaxed text-slate-200 max-h-48">
                <code>{showFixed ? entry.fixedCode : entry.brokenCode}</code>
              </pre>
            </div>
          </div>

          {/* Prevention tip */}
          <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 p-3">
            <h4 className="text-xs font-semibold text-amber-400 mb-1">💡 Prevention Tip</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{entry.prevention}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ErrorLibraryProps {
  onLoadCode?: (code: string, language: string) => void;
}

export function ErrorLibrary({ onLoadCode }: ErrorLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const languages = ["all", ...Array.from(new Set(ERROR_LIBRARY.map((e) => e.language)))];

  const filtered = ERROR_LIBRARY.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.language.toLowerCase().includes(search.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "all" || entry.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-header px-4 py-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-semibold text-white">Error Library</span>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} errors</span>
      </div>

      {/* Search & Filter */}
      <div className="p-3 space-y-2 border-b border-white/8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search errors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-colors"
          />
        </div>

        {/* Language filter */}
        <div className="flex gap-1.5 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors capitalize ${
                selectedLanguage === lang
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Error list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No errors found</p>
          </div>
        ) : (
          filtered.map((entry) => (
            <ErrorCard key={entry.id} entry={entry} onLoadCode={onLoadCode} />
          ))
        )}
      </div>
    </div>
  );
}
