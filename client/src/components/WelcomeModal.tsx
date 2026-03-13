/*
 * WelcomeModal — Slate Studio Design
 * First-time user onboarding with feature overview
 */

import { X, MessageSquare, Code2, Terminal, BookOpen, Zap } from "lucide-react";

interface WelcomeModalProps {
  onClose: () => void;
}

const FEATURES = [
  {
    icon: MessageSquare,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "AI Debug Chat",
    description: "Chat with Claude AI to understand and fix your code errors in plain language.",
  },
  {
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "Smart Code Editor",
    description: "Monaco-powered editor with syntax highlighting, bracket matching, and 15+ languages.",
  },
  {
    icon: Terminal,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Live Console",
    description: "Run JavaScript directly in the browser and see output, errors, and debug messages.",
  },
  {
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Error Library",
    description: "Browse common programming errors with broken/fixed code examples for Python, JS, Java, C++.",
  },
];

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[oklch(0.16_0.012_264)] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Hero banner */}
        <div
          className="relative h-40 overflow-hidden"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663431734583/N8UepZvgR2D2fMJhV8ypsw/hero-banner-jatQvgurttufgmofZVr84i.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[oklch(0.16_0.012_264)]" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663431734583/N8UepZvgR2D2fMJhV8ypsw/ai-avatar-RvFHVRrfpmHD9SjghsrG2w.webp"
                  alt="AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Code Debug Helper AI</h1>
                <p className="text-sm text-slate-300">Your AI-powered debugging assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/8"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-5">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              <strong className="text-amber-400">Quick start:</strong> A sample Python bug is already loaded in the editor. Click{" "}
              <strong className="text-white">"Analyze"</strong> to see the AI debug it in real-time!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all amber-glow"
          >
            Start Debugging →
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
