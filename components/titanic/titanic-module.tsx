"use client"

import { useEffect, useState } from "react"
import { StepIndicator } from "@/components/step-indicator"
import { DatasetStep } from "./steps/dataset-step"
import { PreviewStep } from "./steps/preview-step"
import { TrainStep } from "./steps/train-step"
import { PredictStep } from "./steps/predict-step"
import { ExplainStep } from "./steps/explain-step"
import { WhatIfStep } from "./steps/what-if-step"
import { useTitanicStore } from "./titanic-store"

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
  const currentStep = useTitanicStore((state) => state.currentStep)
  const completedSteps = useTitanicStore((state) => state.completedSteps)
  const uploadedFile = useTitanicStore((state) => state.uploadedFile)
  const uploadedFileData = useTitanicStore((state) => state.uploadedFileData)
  const datasetInfo = useTitanicStore((state) => state.datasetInfo)
  const trainingResult = useTitanicStore((state) => state.trainingResult)
  const predictionResult = useTitanicStore((state) => state.predictionResult)
  const currentProfile = useTitanicStore((state) => state.currentProfile)
  const narrative = useTitanicStore((state) => state.narrative)
  const setDatasetInfo = useTitanicStore((state) => state.setDatasetInfo)
  const setTrainingResult = useTitanicStore((state) => state.setTrainingResult)
  const setPredictionResult = useTitanicStore((state) => state.setPredictionResult)
  const setCurrentProfile = useTitanicStore((state) => state.setCurrentProfile)
  const setNarrative = useTitanicStore((state) => state.setNarrative)
  const setUploadedFile = useTitanicStore((state) => state.setUploadedFile)
  const completeStep = useTitanicStore((state) => state.completeStep)
  const goToStep = useTitanicStore((state) => state.goToStep)
  const restoreUploadedFile = useTitanicStore((state) => state.restoreUploadedFile)
  const [hasHydrated, setHasHydrated] = useState(useTitanicStore.persist.hasHydrated())

  useEffect(() => {
    const unsubscribe = useTitanicStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })

    if (useTitanicStore.persist.hasHydrated()) {
      setHasHydrated(true)
    }

    return unsubscribe
  }, [])

  useEffect(() => {
    if (hasHydrated) {
      restoreUploadedFile()
    }
  }, [hasHydrated, uploadedFileData, restoreUploadedFile])

  if (!hasHydrated) {
    return null
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
            onComplete={async (info, file) => {
              await setUploadedFile(file)
              setDatasetInfo(info)
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
