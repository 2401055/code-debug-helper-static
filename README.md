# Code Debug Helper AI 🤖

> An AI-powered debugging assistant that helps beginner programmers detect, understand, and fix coding errors directly in the browser.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-orange?style=for-the-badge)](https://code-debug-helper.manus.space)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/2401055/code-debug-helper)

---

## ✨ Features

### 💬 AI Debug Chat
- Chat interface powered by **Claude AI** (claude-3-5-sonnet)
- Conversational debugging assistance in plain language
- Streaming responses with real-time output
- Quick prompt buttons for common debugging tasks
- Include/exclude editor code in messages

### 📝 Smart Code Editor
- **Monaco Editor** (same engine as VS Code)
- Syntax highlighting for 15+ languages
- Line numbers, bracket matching, auto-indentation
- Custom dark theme with amber cursor
- Code folding, bracket pair colorization
- Format on paste and type

### ▶️ Live Code Console
- Run **JavaScript** directly in the browser (sandboxed iframe)
- Run **Python** via Pyodide WebAssembly runtime
- Colored output: stdout, stderr, info, success messages
- Execution timeout protection (10 seconds)

### 🔍 Step-by-Step Debugging
Four-phase debugging walkthrough:
1. **Identify** — Find the exact bug
2. **Explain** — Understand why it occurs
3. **Fix** — Get corrected code with comments
4. **Prevent** — Learn best practices

### 📚 Error Library
10+ common programming errors with:
- Broken code examples
- Fixed code examples
- Root cause explanations
- Prevention tips

Covers: **Python, JavaScript, Java, C++**

### 🛠️ Productivity Tools
- Copy code button
- Clear editor button
- Load example snippets (Python, JS, Java, C++)
- Language selector (17 languages)
- Code analysis with one click

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/2401055/code-debug-helper.git
cd code-debug-helper

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your API key to .env

# Start development server
pnpm dev
```

### Environment Variables

```env
VITE_FRONTEND_FORGE_API_KEY=your_api_key_here
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
```

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Styling |
| Monaco Editor | Code Editor |
| Vite 7 | Build Tool |
| react-resizable-panels | Split Layout |
| Pyodide | Python Runtime |
| Claude API | AI Backend |
| Sonner | Toast Notifications |

---

## 📁 Project Structure

```
client/
  src/
    components/
      ChatMessage.tsx      # Message rendering with markdown
      ChatPanel.tsx        # Full chat interface
      CodeEditor.tsx       # Monaco Editor wrapper
      ConsolePanel.tsx     # Execution output console
      EditorPanel.tsx      # Editor with toolbar
      ErrorLibrary.tsx     # Browsable error library
      StepByStepDebug.tsx  # Debugging walkthrough
      WelcomeModal.tsx     # Onboarding modal
    hooks/
      useAIChat.ts         # AI chat state & API calls
      useCodeExecution.ts  # Code runner (JS + Python)
    lib/
      errorLibrary.ts      # Error library data
    pages/
      Home.tsx             # Main app layout
```

---

## 🎨 Design System

**Slate Studio** — A refined dark workspace aesthetic:
- **Background**: Deep slate `#0f1117`
- **Accent**: Warm amber `#f59e0b` → Orange `#f97316`
- **Font (UI)**: Space Grotesk
- **Font (Code)**: Fira Code with ligatures
- **Layout**: Resizable split-pane (Chat | Editor | Console)

---

## 📱 Responsive Design

- **Desktop**: Three-pane split layout with resizable panels
- **Mobile**: Tab-based navigation (Chat / Editor / Library)

---

## 🔒 Privacy & Security

- **No database** — zero user data stored
- **No authentication** required
- Code execution is sandboxed in an iframe
- All AI processing via secure API calls

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for beginner programmers learning to debug code.*
