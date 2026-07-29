import clsx from "clsx";
import { Check } from "lucide-react";

interface StepperIndicatorProps {
  steps: string[];
  currentStep: number; // 1-indexed
}

export default function StepperIndicator({
  steps,
  currentStep,
}: StepperIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-250",
                  isCompleted && "bg-primary-500 text-on-primary",
                  isActive &&
                    "bg-primary-500 text-on-primary animate-scale-pop",
                  !isCompleted && !isActive && "bg-(--bg-surface-alt) text-muted",
                )}
              >
                {isCompleted ? <Check size={15} /> : stepNumber}
              </div>
              <span
                className={clsx(
                  "hidden text-center text-[11px] font-medium sm:block",
                  isActive ? "text-primary" : "text-muted",
                )}
              >
                {label}
              </span>
            </div>
            {stepNumber < steps.length && (
              <div
                className={clsx(
                  "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-250",
                  isCompleted ? "bg-primary-500" : "bg-(--bg-surface-alt)",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
