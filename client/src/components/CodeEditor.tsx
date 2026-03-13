/*
 * CodeEditor Component — Slate Studio Design
 * Monaco Editor integration with dark theme
 * Features: syntax highlighting, line numbers, bracket matching, error markers
 */

import { useRef, useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";


interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  height = "100%",
}: CodeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Define custom dark theme matching Slate Studio
    monaco.editor.defineTheme("slate-studio", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "C084FC" },
        { token: "string", foreground: "86EFAC" },
        { token: "number", foreground: "FCD34D" },
        { token: "type", foreground: "67E8F9" },
        { token: "function", foreground: "93C5FD" },
        { token: "variable", foreground: "E2E8F0" },
        { token: "operator", foreground: "F9A8D4" },
        { token: "delimiter", foreground: "94A3B8" },
        { token: "identifier", foreground: "E2E8F0" },
        { token: "constant", foreground: "FCD34D" },
        { token: "class", foreground: "67E8F9" },
        { token: "interface", foreground: "67E8F9" },
        { token: "namespace", foreground: "67E8F9" },
        { token: "decorator", foreground: "F59E0B" },
        { token: "tag", foreground: "F87171" },
        { token: "attribute.name", foreground: "FCD34D" },
        { token: "attribute.value", foreground: "86EFAC" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#E2E8F0",
        "editor.lineHighlightBackground": "#ffffff08",
        "editor.selectionBackground": "#f59e0b30",
        "editor.inactiveSelectionBackground": "#f59e0b18",
        "editorCursor.foreground": "#F59E0B",
        "editorLineNumber.foreground": "#4B5563",
        "editorLineNumber.activeForeground": "#9CA3AF",
        "editorIndentGuide.background1": "#1F2937",
        "editorIndentGuide.activeBackground1": "#374151",
        "editor.findMatchBackground": "#f59e0b40",
        "editor.findMatchHighlightBackground": "#f59e0b20",
        "editorBracketMatch.background": "#f59e0b20",
        "editorBracketMatch.border": "#F59E0B",
        "editorGutter.background": "#0d1117",
        "editorError.foreground": "#F87171",
        "editorWarning.foreground": "#FCD34D",
        "editorInfo.foreground": "#67E8F9",
        "scrollbarSlider.background": "#ffffff15",
        "scrollbarSlider.hoverBackground": "#ffffff25",
        "scrollbarSlider.activeBackground": "#ffffff35",
        "editorWidget.background": "#1a1d27",
        "editorWidget.border": "#ffffff15",
        "editorSuggestWidget.background": "#1a1d27",
        "editorSuggestWidget.border": "#ffffff15",
        "editorSuggestWidget.selectedBackground": "#f59e0b20",
        "list.hoverBackground": "#f59e0b10",
        "list.activeSelectionBackground": "#f59e0b20",
        "input.background": "#0d1117",
        "input.border": "#ffffff15",
        "focusBorder": "#F59E0B",
      },
    });

    monaco.editor.setTheme("slate-studio");

    // Editor options
    editor.updateOptions({
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
      fontLigatures: true,
      fontSize: 14,
      lineHeight: 22,
      letterSpacing: 0.3,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: "line",
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: "full",
      tabSize: 4,
      insertSpaces: true,
      readOnly,
      contextmenu: true,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: "mouseover",
      renderWhitespace: "none",
      occurrencesHighlight: "singleFile",
      selectionHighlight: true,
      codeLens: false,
      glyphMargin: true,
      lineNumbers: "on",
      lineDecorationsWidth: 8,
      lineNumbersMinChars: 3,
    });

    // Focus editor
    editor.focus();
  }, [readOnly]);

  const handleChange: OnChange = useCallback(
    (value) => {
      onChange(value || "");
    },
    [onChange]
  );

  const monacoLanguage = getMonacoLanguage(language);

  return (
    <Editor
      height={height}
      language={monacoLanguage}
      value={value}
      onMount={handleMount}
      onChange={handleChange}
      loading={
        <div className="flex items-center justify-center h-full bg-[#0d1117]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground font-code">Loading editor...</span>
          </div>
        </div>
      }
      options={{
        theme: "slate-studio",
      }}
    />
  );
}

function getMonacoLanguage(language: string): string {
  const map: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    swift: "swift",
    kotlin: "kotlin",
    html: "html",
    css: "css",
    sql: "sql",
    bash: "shell",
    shell: "shell",
  };
  return map[language] || "plaintext";
}
