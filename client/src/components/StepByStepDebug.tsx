/*
 * StepByStepDebug Component — Slate Studio Design
 * Provides a structured step-by-step debugging walkthrough
 * Triggered from the chat panel
 */

import { Footprints, ChevronRight, CheckCircle2, AlertCircle, Lightbulb, Shield } from "lucide-react";

interface DebugStep {
  step: number;
  title: string;
  description: string;
  type: "identify" | "explain" | "fix" | "prevent";
}

interface StepByStepDebugProps {
  onStartDebugging: (prompt: string) => void;
  disabled?: boolean;
}

const STEP_PROMPTS = {
  full: `Please provide a complete step-by-step debugging walkthrough of my code:

**Step 1 - Identify the Problem:** What specific error or bug exists in the code?
**Step 2 - Explain Why:** Why does this error occur? Explain the root cause in simple terms.
**Step 3 - Show the Fix:** Provide the corrected code with comments explaining each change.
**Step 4 - Best Practices:** What best practices should I follow to prevent this type of error in the future?

Please be thorough and beginner-friendly in your explanation.`,
  
  explain: `Please explain this error in detail:
1. What does this error message mean?
2. What part of the code is causing it?
3. Why does this happen in programming?
Please use simple language suitable for a beginner.`,
  
  fix: `Please fix the bug in my code and provide:
1. The complete corrected code
2. A comment next to each changed line explaining what was fixed
3. A brief summary of all changes made`,
  
  prevent: `Based on my code, what best practices should I follow to:
1. Prevent this type of error in the future
2. Write more robust and error-free code
3. Improve the overall code quality
Please provide specific, actionable advice.`,
};

const STEPS: DebugStep[] = [
  {
    step: 1,
    title: "Identify",
    description: "Find the bug",
    type: "identify",
  },
  {
    step: 2,
    title: "Explain",
    description: "Understand why",
    type: "explain",
  },
  {
    step: 3,
    title: "Fix",
    description: "Get the solution",
    type: "fix",
  },
  {
    step: 4,
    title: "Prevent",
    description: "Learn best practices",
    type: "prevent",
  },
];

const STEP_ICONS = {
  identify: AlertCircle,
  explain: Lightbulb,
  fix: CheckCircle2,
  prevent: Shield,
};

const STEP_COLORS = {
  identify: "text-red-400 bg-red-400/10",
  explain: "text-amber-400 bg-amber-400/10",
  fix: "text-emerald-400 bg-emerald-400/10",
  prevent: "text-blue-400 bg-blue-400/10",
};

export function StepByStepDebugButton({ onStartDebugging, disabled }: StepByStepDebugProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Footprints className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-semibold text-white">Step-by-Step Debug</span>
      </div>

      {/* Steps visual */}
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((step, i) => {
          const Icon = STEP_ICONS[step.type];
          const colors = STEP_COLORS[step.type];
          return (
            <div key={step.step} className="flex items-center gap-1 flex-1">
              <div className={`flex flex-col items-center gap-1 flex-1`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {step.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 mb-3" />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onStartDebugging(STEP_PROMPTS.full)}
        disabled={disabled}
        className="w-full py-2 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Full Debug Walkthrough
      </button>
    </div>
  );
}
