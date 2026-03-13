import { useState, useCallback } from "react";

export interface ConsoleEntry {
  id: string;
  type: "output" | "error" | "info" | "success" | "command";
  content: string;
  timestamp: Date;
}

export function useCodeExecution() {
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    {
      id: "welcome",
      type: "info",
      content: "Console ready. Run your code to see output here.",
      timestamp: new Date(),
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const addEntry = useCallback((type: ConsoleEntry["type"], content: string) => {
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}-${Math.random()}`,
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const runCode = useCallback(
    async (code: string, language: string) => {
      if (!code.trim()) {
        addEntry("error", "No code to execute.");
        return;
      }

      setIsRunning(true);
      addEntry("command", `$ Running ${language} code...`);

      try {
        if (language === "javascript" || language === "typescript") {
          // Execute JavaScript in a sandboxed iframe
          await executeJavaScript(code, addEntry);
        } else if (language === "python") {
          // Use Pyodide or show a message
          await executePython(code, addEntry);
        } else {
          addEntry(
            "info",
            `⚠️ Direct execution is supported for JavaScript only in the browser.\n\nFor ${language}, the AI assistant can analyze your code and simulate the output. Click "Analyze Code" to get AI feedback.`
          );
        }
      } catch (error) {
        addEntry("error", `Execution error: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setIsRunning(false);
        addEntry("info", "─── Execution complete ───");
      }
    },
    [addEntry]
  );

  const clearConsole = useCallback(() => {
    setConsoleEntries([
      {
        id: "cleared-" + Date.now(),
        type: "info",
        content: "Console cleared.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { consoleEntries, isRunning, runCode, clearConsole };
}

async function executeJavaScript(
  code: string,
  addEntry: (type: ConsoleEntry["type"], content: string) => void
): Promise<void> {
  return new Promise((resolve) => {
    const logs: string[] = [];
    const errors: string[] = [];

    // Create a sandboxed iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow as Window & {
      __logs: string[];
      __errors: string[];
    };

    // Listen for messages from iframe
    const messageHandler = (event: MessageEvent) => {
      if (event.source !== iframeWindow) return;
      
      if (event.data.type === "log") {
        logs.push(event.data.content);
        addEntry("output", event.data.content);
      } else if (event.data.type === "error") {
        errors.push(event.data.content);
        addEntry("error", event.data.content);
      } else if (event.data.type === "done") {
        window.removeEventListener("message", messageHandler);
        document.body.removeChild(iframe);
        if (logs.length === 0 && errors.length === 0) {
          addEntry("info", "(No output)");
        }
        resolve();
      }
    };

    window.addEventListener("message", messageHandler);

    // Inject code into iframe
    const wrappedCode = `
      <script>
        const __parent = window.parent;
        const __log = (...args) => {
          const content = args.map(a => {
            if (typeof a === 'object') {
              try { return JSON.stringify(a, null, 2); } catch { return String(a); }
            }
            return String(a);
          }).join(' ');
          __parent.postMessage({ type: 'log', content }, '*');
        };
        
        console.log = __log;
        console.info = __log;
        console.warn = (...args) => {
          __parent.postMessage({ type: 'log', content: '⚠️ ' + args.join(' ') }, '*');
        };
        console.error = (...args) => {
          __parent.postMessage({ type: 'error', content: args.join(' ') }, '*');
        };
        
        window.onerror = (msg, src, line, col, err) => {
          __parent.postMessage({ 
            type: 'error', 
            content: err ? err.toString() : msg + ' (line ' + line + ')'
          }, '*');
          __parent.postMessage({ type: 'done' }, '*');
          return true;
        };
        
        try {
          ${code}
          __parent.postMessage({ type: 'done' }, '*');
        } catch(e) {
          __parent.postMessage({ type: 'error', content: e.toString() }, '*');
          __parent.postMessage({ type: 'done' }, '*');
        }
      <\/script>
    `;

    iframe.srcdoc = wrappedCode;

    // Timeout after 10 seconds
    setTimeout(() => {
      window.removeEventListener("message", messageHandler);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        addEntry("error", "Execution timed out (10 seconds limit)");
        resolve();
      }
    }, 10000);
  });
}

async function executePython(
  code: string,
  addEntry: (type: ConsoleEntry["type"], content: string) => void
): Promise<void> {
  // Check if Pyodide is available (loaded via CDN)
  const win = window as Window & { pyodide?: { runPythonAsync: (code: string) => Promise<unknown> } };
  
  if (!win.pyodide) {
    addEntry("info", "🐍 Loading Python runtime (Pyodide)...");
    
    try {
      // Dynamically load Pyodide
      await loadPyodide();
      addEntry("success", "✅ Python runtime loaded!");
    } catch {
      addEntry("error", "Failed to load Python runtime. Please check your internet connection.");
      addEntry("info", "💡 Tip: You can still use the AI assistant to analyze and debug your Python code!");
      return;
    }
  }
  
  try {
    // Capture stdout
    const captureCode = `
import sys
import io

_stdout_capture = io.StringIO()
_stderr_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    print(traceback.format_exc(), file=sys.stderr)
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__

_out = _stdout_capture.getvalue()
_err = _stderr_capture.getvalue()
(_out, _err)
`;
    
    const result = await win.pyodide!.runPythonAsync(captureCode);
    const [stdout, stderr] = result as [string, string];
    
    if (stdout) {
      stdout.trim().split('\n').forEach(line => {
        if (line) addEntry("output", line);
      });
    }
    if (stderr) {
      stderr.trim().split('\n').forEach(line => {
        if (line) addEntry("error", line);
      });
    }
    if (!stdout && !stderr) {
      addEntry("info", "(No output)");
    }
  } catch (error) {
    addEntry("error", error instanceof Error ? error.message : String(error));
  }
}

async function loadPyodide(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.onload = async () => {
      const win = window as Window & { 
        loadPyodide?: (config: { indexURL: string }) => Promise<unknown>;
        pyodide?: unknown;
      };
      if (win.loadPyodide) {
        win.pyodide = await win.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        resolve();
      } else {
        reject(new Error("Pyodide not available"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });
}
