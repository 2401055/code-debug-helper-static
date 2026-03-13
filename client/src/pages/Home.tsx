/*
 * Home Page — Slate Studio Design
 * Main application layout: Header + Split pane (Chat | Editor + Console)
 * Responsive: Desktop split-pane, Mobile tabbed interface
 */

import { useState, useCallback, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  BookOpen,
  X,
  ChevronRight,
  Cpu,
  Github,
  HelpCircle,
} from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { EditorPanel } from "@/components/EditorPanel";
import { ConsolePanel } from "@/components/ConsolePanel";
import { ErrorLibrary } from "@/components/ErrorLibrary";
import { useAIChat } from "@/hooks/useAIChat";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { EXAMPLE_SNIPPETS } from "@/lib/errorLibrary";
import { WelcomeModal } from "@/components/WelcomeModal";
import { toast } from "sonner";

type MobileTab = "chat" | "editor" | "library";

const DEFAULT_CODE = `# Welcome to Code Debug Helper AI!
# Paste your code here or load an example from the toolbar above.
# Then click "Analyze" to get AI debugging help, or "Run" to execute JavaScript.

def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)  # Bug: ZeroDivisionError if list is empty!
    return average

# Test with valid data
scores = [85, 92, 78, 95, 88]
print(f"Average score: {calculate_average(scores)}")

# This will crash - try clicking Analyze to find the bug!
empty_list = []
print(calculate_average(empty_list))  # ZeroDivisionError!
`;

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("python");
  const [showLibrary, setShowLibrary] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem('cdh-visited'); } catch { return true; }
  });

  const handleCloseWelcome = useCallback(() => {
    setShowWelcome(false);
    try { localStorage.setItem('cdh-visited', '1'); } catch {}
  }, []);

  const { messages, isLoading, sendMessage, stopGeneration, clearChat } = useAIChat();
  const { consoleEntries, isRunning, runCode, clearConsole } = useCodeExecution();

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleRunCode = useCallback(() => {
    runCode(code, language);
  }, [code, language, runCode]);

  const handleAnalyzeCode = useCallback(() => {
    if (!code.trim()) {
      toast.error("Please add some code to analyze.");
      return;
    }
    sendMessage("Please analyze my code and identify any bugs, errors, or improvements.", code, language);
    if (isMobile) setMobileTab("chat");
  }, [code, language, sendMessage, isMobile]);

  const handleLoadCode = useCallback(
    (newCode: string, newLanguage: string) => {
      setCode(newCode);
      setLanguage(newLanguage);
      setShowLibrary(false);
      if (isMobile) setMobileTab("editor");
      toast.success("Code loaded in editor!");
    },
    [isMobile]
  );

  return (
    <>
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* ─── Top Header ─── */}
      <header className="flex-shrink-0 h-12 border-b border-white/8 bg-[oklch(0.14_0.011_264)] flex items-center px-4 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663431734583/N8UepZvgR2D2fMJhV8ypsw/ai-avatar-RvFHVRrfpmHD9SjghsrG2w.webp"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-white tracking-tight">
              Code Debug Helper
            </span>
            <span className="text-xs font-semibold text-amber-gradient hidden sm:inline">
              AI
            </span>
          </div>
        </div>

        {/* Center: status */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">AI Ready</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Error Library toggle */}
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showLibrary
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-white/8"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Error Library</span>
          </button>

          <button
            onClick={() => setShowWelcome(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
            title="Help & Features"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/2401055/code-debug-helper"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* ─── Mobile Tab Bar ─── */}
      {isMobile && (
        <div className="flex-shrink-0 flex border-b border-white/8 bg-[oklch(0.14_0.011_264)]">
          {(["chat", "editor", "library"] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                mobileTab === tab
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab === "chat" ? "💬 Chat" : tab === "editor" ? "📝 Editor" : "📚 Library"}
            </button>
          ))}
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-hidden flex">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="flex-1 flex overflow-hidden">
            <PanelGroup direction="horizontal" className="flex-1">
              {/* Chat Panel */}
              <Panel defaultSize={35} minSize={25} maxSize={50}>
                <div className="h-full bg-[oklch(0.16_0.012_264)] border-r border-white/8">
                  <ChatPanel
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={sendMessage}
                    onStopGeneration={stopGeneration}
                    onClearChat={clearChat}
                    currentCode={code}
                    currentLanguage={language}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="w-1 bg-white/5 hover:bg-amber-500/40 transition-colors cursor-col-resize" />

              {/* Editor + Console */}
              <Panel defaultSize={65} minSize={40}>
                <PanelGroup direction="vertical" className="h-full">
                  {/* Editor */}
                  <Panel defaultSize={68} minSize={40}>
                    <div className="h-full bg-[oklch(0.13_0.01_264)]">
                      <EditorPanel
                        code={code}
                        language={language}
                        isRunning={isRunning}
                        onCodeChange={setCode}
                        onLanguageChange={setLanguage}
                        onRunCode={handleRunCode}
                        onAnalyzeCode={handleAnalyzeCode}
                      />
                    </div>
                  </Panel>

                  <PanelResizeHandle className="h-1 bg-white/5 hover:bg-amber-500/40 transition-colors cursor-row-resize" />

                  {/* Console */}
                  <Panel defaultSize={32} minSize={15}>
                    <div className="h-full bg-[oklch(0.10_0.008_264)]">
                      <ConsolePanel
                        entries={consoleEntries}
                        isRunning={isRunning}
                        onClear={clearConsole}
                      />
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>

            {/* Error Library Sidebar */}
            {showLibrary && (
              <div className="w-80 flex-shrink-0 border-l border-white/8 bg-[oklch(0.16_0.012_264)] flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/8">
                  <span className="text-xs font-semibold text-white">Error Library</span>
                  <button
                    onClick={() => setShowLibrary(false)}
                    className="p-1 rounded text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ErrorLibrary onLoadCode={handleLoadCode} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="flex-1 overflow-hidden">
            {mobileTab === "chat" && (
              <div className="h-full bg-[oklch(0.16_0.012_264)]">
                <ChatPanel
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={sendMessage}
                  onStopGeneration={stopGeneration}
                  onClearChat={clearChat}
                  currentCode={code}
                  currentLanguage={language}
                />
              </div>
            )}
            {mobileTab === "editor" && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden bg-[oklch(0.13_0.01_264)]">
                  <EditorPanel
                    code={code}
                    language={language}
                    isRunning={isRunning}
                    onCodeChange={setCode}
                    onLanguageChange={setLanguage}
                    onRunCode={handleRunCode}
                    onAnalyzeCode={handleAnalyzeCode}
                  />
                </div>
                <div className="h-40 flex-shrink-0 bg-[oklch(0.10_0.008_264)] border-t border-white/8">
                  <ConsolePanel
                    entries={consoleEntries}
                    isRunning={isRunning}
                    onClear={clearConsole}
                  />
                </div>
              </div>
            )}
            {mobileTab === "library" && (
              <div className="h-full bg-[oklch(0.16_0.012_264)]">
                <ErrorLibrary onLoadCode={handleLoadCode} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Bottom Status Bar ─── */}
      <div className="flex-shrink-0 h-6 bg-[oklch(0.11_0.009_264)] border-t border-white/5 flex items-center px-4 gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3" />
          <span>Code Debug Helper AI</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <ChevronRight className="w-3 h-3" />
          <span>No database required — all processing in browser</span>
        </div>
      </div>
    </div>
    {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
    </>
  );
}
