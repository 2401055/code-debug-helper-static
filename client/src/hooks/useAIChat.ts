import { useState, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SYSTEM_PROMPT = `You are Code Debug Helper AI, an expert programming assistant specializing in helping beginner programmers debug their code. You are patient, encouraging, and explain concepts clearly.

When analyzing code or errors:
1. **Identify the Problem**: Clearly state what the error or bug is
2. **Explain Why**: Explain in simple terms why this error occurs
3. **Show the Fix**: Provide corrected code with comments
4. **Best Practices**: Share tips to avoid this issue in the future

Format your responses with:
- Use markdown for formatting
- Use code blocks with language tags for all code examples (e.g., \`\`\`python)
- Use **bold** for important terms
- Use numbered lists for step-by-step explanations
- Keep explanations beginner-friendly but accurate

When you provide fixed code, always:
- Include the complete corrected code
- Add comments explaining the changes
- Show example output if applicable

Be encouraging and remind users that debugging is a normal part of programming!`;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `# Welcome to Code Debug Helper AI! 🚀

I'm your AI debugging assistant, here to help you **understand and fix** coding errors.

**Here's what I can do:**
- 🔍 **Analyze your code** and find bugs
- 💡 **Explain errors** in simple language
- 🛠️ **Provide fixed code** with explanations
- 📚 **Teach best practices** to prevent future bugs

**How to get started:**
1. Paste your code in the **editor** on the right
2. Type your question or error message below
3. Or click **"Analyze Code"** to have me review your editor code

What are you working on today?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string, code?: string, language?: string) => {
      if (!userMessage.trim() && !code) return;

      // Build the full message content
      let fullMessage = userMessage;
      if (code && code.trim()) {
        fullMessage = `${userMessage}\n\n**Code (${language || "unknown"}):**\n\`\`\`${language || ""}\n${code}\n\`\`\``;
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: fullMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Create assistant message placeholder
      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        abortControllerRef.current = new AbortController();

        // Build conversation history for API
        const conversationHistory = messages
          .filter((m) => !m.id.startsWith("welcome"))
          .slice(-10) // Keep last 10 messages for context
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        conversationHistory.push({
          role: "user",
          content: fullMessage,
        });

        const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL || 'https://api.openai.com/v1';
        const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

        if (!apiKey) {
          throw new Error("API Key is missing. Please set VITE_FRONTEND_FORGE_API_KEY in your environment.");
        }

        const response = await fetch(`${apiUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...conversationHistory,
            ],
            stream: true,
            max_tokens: 2000,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    accumulatedContent += delta;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, content: accumulatedContent, isStreaming: true }
                          : m
                      )
                    );
                  }
                } catch {
                  // Skip malformed JSON chunks
                }
              }
            }
          }
        }

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: m.content + "\n\n*Response stopped.*", isStreaming: false }
                : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content:
                      "I encountered an error while processing your request. Please check your API configuration and try again.\n\n**Error details:** " +
                      (error instanceof Error ? error.message : "Unknown error"),
                    isStreaming: false,
                  }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: `# Chat Cleared! 🔄

Ready to help you debug more code. Paste your code in the editor and ask me anything!`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, stopGeneration, clearChat };
}
