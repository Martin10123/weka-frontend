"use client"

import { useState } from "react"
import { StepIndicator } from "@/components/step-indicator"
import { DatasetStep } from "./steps/dataset-step"
import { PreviewStep } from "./steps/preview-step"
import { TrainStep } from "./steps/train-step"
import { PredictStep } from "./steps/predict-step"
import { ExplainStep } from "./steps/explain-step"
import { WhatIfStep } from "./steps/what-if-step"

const TITANIC_STEPS = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Preview" },
  { id: 3, name: "Train" },
  { id: 4, name: "Predict" },
  { id: 5, name: "Explain" },
  { id: 6, name: "What-If" },
]

export interface DatasetInfo {
  fileName: string
  totalRows: number
  format: string
}

export interface TrainingResult {
  accuracy: number
  summary: string
  insight: string
  modelPath: string
  usedRows: number
  discardedRows: number
}

export interface PredictionResult {
  survived: boolean
  probability: number
  rules: string[]
  insight: string
  narrative: string
}

export interface PassengerProfile {
  sex: "MALE" | "FEMALE"
  age: number
  passengerClass: "FIRST" | "SECOND" | "THIRD"
  travelingAlone: boolean
  embarked: "SOUTHAMPTON" | "CHERBOURG" | "QUEENSTOWN"
}

export function TitanicModule() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null)
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [currentProfile, setCurrentProfile] = useState<PassengerProfile | null>(null)
  const [narrative, setNarrative] = useState<string>("")

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    if (stepId < TITANIC_STEPS.length) {
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
          steps={TITANIC_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="rounded-lg border bg-card">
        {currentStep === 1 && (
          <DatasetStep
            onComplete={(info, file) => {
              setDatasetInfo(info)
              setUploadedFile(file)
              completeStep(1)
            }}
          />
        )}
        {currentStep === 2 && (
          <PreviewStep
            datasetInfo={datasetInfo}
            file={uploadedFile}
            onComplete={() => {
              completeStep(2)
            }}
            onBack={() => goToStep(1)}
          />
        )}
        {currentStep === 3 && (
          <TrainStep
            datasetInfo={datasetInfo}
            file={uploadedFile}
            onComplete={(result) => {
              setTrainingResult(result)
              completeStep(3)
            }}
            onBack={() => goToStep(2)}
          />
        )}
        {currentStep === 4 && (
          <PredictStep
            onComplete={(result, profile) => {
              setPredictionResult(result)
              setCurrentProfile(profile)
              completeStep(4)
            }}
            onBack={() => goToStep(3)}
          />
        )}
        {currentStep === 5 && (
          <ExplainStep
            predictionResult={predictionResult}
            profile={currentProfile}
            onComplete={(narr) => {
              setNarrative(narr)
              completeStep(5)
            }}
            onBack={() => goToStep(4)}
          />
        )}
        {currentStep === 6 && (
          <WhatIfStep
            profile={currentProfile}
            onBack={() => goToStep(5)}
          />
        )}
      </div>
    </div>
  )
}
