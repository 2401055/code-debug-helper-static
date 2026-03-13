/*
 * EditorPanel Component — Slate Studio Design
 * Code editor with toolbar: language selector, run, format, copy, clear
 * Integrates Monaco Editor with full feature set
 */

import { useState, useCallback } from "react";
import {
  Play,
  Copy,
  Trash2,
  Code2,
  ChevronDown,
  Wand2,
  FileCode,
  Check,
} from "lucide-react";
import { CodeEditor } from "./CodeEditor";
import { LANGUAGES, EXAMPLE_SNIPPETS } from "@/lib/errorLibrary";
import { toast } from "sonner";

interface EditorPanelProps {
  code: string;
  language: string;
  isRunning: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  onAnalyzeCode: () => void;
}

export function EditorPanel({
  code,
  language,
  isRunning,
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onAnalyzeCode,
}: EditorPanelProps) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  const handleCopy = useCallback(async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleClear = useCallback(() => {
    onCodeChange("");
    toast.info("Editor cleared");
  }, [onCodeChange]);

  const handleLoadExample = useCallback(
    (lang: string) => {
      const example = EXAMPLE_SNIPPETS[lang];
      if (example) {
        onLanguageChange(lang);
        onCodeChange(example.code);
        setShowExamples(false);
        toast.success(`Loaded ${lang} example: ${example.description}`);
      }
    },
    [onCodeChange, onLanguageChange]
  );

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="panel-header px-3 py-2 flex items-center gap-2 flex-shrink-0">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowExamples(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Code2 className="w-3 h-3 text-amber-400" />
            <span className="font-medium">{currentLang.label}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showLangDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[oklch(0.19_0.013_264)] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-1 max-h-64 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      onLanguageChange(lang.value);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                      lang.value === language
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Run */}
          <button
            onClick={onRunCode}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Run code (JavaScript only)"
          >
            <Play className="w-3 h-3 fill-current" />
            Run
          </button>

          {/* Analyze */}
          <button
            onClick={onAnalyzeCode}
            disabled={!code.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Analyze code with AI"
          >
            <Wand2 className="w-3 h-3" />
            Analyze
          </button>
        </div>

        {/* Right side tools */}
        <div className="ml-auto flex items-center gap-1">
          {/* Examples */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExamples(!showExamples);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors text-xs"
              title="Load example code"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>

            {showExamples && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-[oklch(0.19_0.013_264)] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-white">Example Snippets</span>
                </div>
                <div className="p-1">
                  {Object.entries(EXAMPLE_SNIPPETS).map(([lang, snippet]) => (
                    <button
                      key={lang}
                      onClick={() => handleLoadExample(lang)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors"
                    >
                      <div className="text-xs font-medium text-white capitalize">{lang}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {snippet.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={!code.trim()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            disabled={!code.trim()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40"
            title="Clear editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={code}
          language={language}
          onChange={onCodeChange}
          height="100%"
        />
      </div>

      {/* Status bar */}
      <div className="px-4 py-1.5 bg-[oklch(0.11_0.009_264)] border-t border-white/5 flex items-center gap-4 text-[11px] text-muted-foreground flex-shrink-0">
        <span className="font-code">{currentLang.label}</span>
        <span>{lineCount} lines</span>
        <span>{charCount} chars</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Ready</span>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showLangDropdown || showExamples) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLangDropdown(false);
            setShowExamples(false);
          }}
        />
      )}
    </div>
  );
}
