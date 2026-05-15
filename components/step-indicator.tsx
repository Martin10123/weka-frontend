"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: number
  name: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isClickable = isCompleted || step.id <= Math.max(...completedSteps, 0) + 1

          return (
            <li key={step.id} className="flex-1">
              <div
                className={cn(
                  "group flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
              >
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        isCompleted || isCurrent ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium transition-all",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isCurrent && !isCompleted && "border-primary bg-background text-primary",
                      !isCompleted && !isCurrent && "border-muted-foreground/30 bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        completedSteps.includes(steps[index + 1]?.id) || currentStep > step.id
                          ? "bg-primary"
                          : "bg-border"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
