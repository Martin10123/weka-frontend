"use client"

import { useState } from "react"
import { StepIndicator } from "@/components/step-indicator"
import { FootballTrainStep } from "./steps/football-train-step"
import { FootballPredictStep } from "./steps/football-predict-step"

const FOOTBALL_STEPS = [
  { id: 1, name: "Train Model" },
  { id: 2, name: "Predict Match" },
]

export interface FootballTrainingResult {
  accuracy: number
  summary: string
  insight: string
  modelPath: string
  usedRows: number
  discardedRows: number
}

export interface FootballPredictionResult {
  predictedResult: "Home Win" | "Draw" | "Away Win"
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  confidence: number
  insight: string
}

export interface MatchProfile {
  division: string
  homeElo: number
  awayElo: number
  form3Home: number
  form3Away: number
  form5Home: number
  form5Away: number
  homeOdds: number
  drawOdds: number
  awayOdds: number
}

export function FootballModule() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [trainingResult, setTrainingResult] = useState<FootballTrainingResult | null>(null)

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    if (stepId < FOOTBALL_STEPS.length) {
      setCurrentStep(stepId + 1)
    }
  }

  const goToStep = (stepId: number) => {
    if (completedSteps.includes(stepId - 1) || stepId === 1) {
      setCurrentStep(stepId)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border bg-card p-6">
        <StepIndicator
          steps={FOOTBALL_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="rounded-lg border bg-card">
        {currentStep === 1 && (
          <FootballTrainStep
            onComplete={(result) => {
              setTrainingResult(result)
              completeStep(1)
            }}
          />
        )}
        {currentStep === 2 && (
          <FootballPredictStep
            onBack={() => goToStep(1)}
          />
        )}
      </div>
    </div>
  )
}
