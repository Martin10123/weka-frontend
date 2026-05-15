import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { DatasetInfo, PassengerProfile, PredictionResult, TrainingResult } from "./titanic-module"

export interface UploadedFileData {
  name: string
  type: string
  content: string
}

interface TitanicStoreState {
  currentStep: number
  completedSteps: number[]
  uploadedFile: File | null
  uploadedFileData: UploadedFileData | null
  datasetInfo: DatasetInfo | null
  trainingResult: TrainingResult | null
  predictionResult: PredictionResult | null
  currentProfile: PassengerProfile | null
  narrative: string
  setCurrentStep: (step: number) => void
  completeStep: (stepId: number) => void
  goToStep: (stepId: number) => void
  setUploadedFile: (file: File | null) => Promise<void>
  restoreUploadedFile: () => void
  setDatasetInfo: (datasetInfo: DatasetInfo | null) => void
  setTrainingResult: (trainingResult: TrainingResult | null) => void
  setPredictionResult: (predictionResult: PredictionResult | null) => void
  setCurrentProfile: (currentProfile: PassengerProfile | null) => void
  setNarrative: (narrative: string) => void
}

const STORAGE_KEY = "weka-frontend:titanic-module-state"
const TOTAL_STEPS = 6

const defaultState = {
  currentStep: 1,
  completedSteps: [] as number[],
  uploadedFile: null as File | null,
  uploadedFileData: null as UploadedFileData | null,
  datasetInfo: null as DatasetInfo | null,
  trainingResult: null as TrainingResult | null,
  predictionResult: null as PredictionResult | null,
  currentProfile: null as PassengerProfile | null,
  narrative: "",
}

export const useTitanicStore = create<TitanicStoreState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setCurrentStep: (step) => set({ currentStep: step }),
      completeStep: (stepId) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepId)
            ? state.completedSteps
            : [...state.completedSteps, stepId],
          currentStep: stepId < TOTAL_STEPS ? stepId + 1 : stepId,
        })),
      goToStep: (stepId) =>
        set((state) =>
          state.completedSteps.includes(stepId - 1) || stepId === 1
            ? { currentStep: stepId }
            : state,
        ),
      setUploadedFile: async (file) => {
        if (!file) {
          set({ uploadedFile: null, uploadedFileData: null })
          return
        }

        const content = await file.text()
        set({
          uploadedFile: file,
          uploadedFileData: {
            name: file.name,
            type: file.type,
            content,
          },
        })
      },
      restoreUploadedFile: () => {
        const { uploadedFile, uploadedFileData } = get()
        if (uploadedFile || !uploadedFileData) return

        set({
          uploadedFile: new File([uploadedFileData.content], uploadedFileData.name, {
            type: uploadedFileData.type,
          }),
        })
      },
      setDatasetInfo: (datasetInfo) => set({ datasetInfo }),
      setTrainingResult: (trainingResult) => set({ trainingResult }),
      setPredictionResult: (predictionResult) => set({ predictionResult }),
      setCurrentProfile: (currentProfile) => set({ currentProfile }),
      setNarrative: (narrative) => set({ narrative }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        uploadedFileData: state.uploadedFileData,
        datasetInfo: state.datasetInfo,
        trainingResult: state.trainingResult,
        predictionResult: state.predictionResult,
        currentProfile: state.currentProfile,
        narrative: state.narrative,
      }),
    },
  ),
)