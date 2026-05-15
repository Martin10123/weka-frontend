"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, Brain, TrendingUp, FileText, Lightbulb, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { trainModel } from "@/lib/api"
import type { DatasetInfo, TrainingResult } from "../titanic-module"

interface TrainStepProps {
  datasetInfo: DatasetInfo | null
  file: File | null
  onComplete: (result: TrainingResult) => void
  onBack: () => void
}

export function TrainStep({ datasetInfo, file, onComplete, onBack }: TrainStepProps) {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrain = async () => {
    if (!file) return
    setIsTraining(true)
    setProgress(0)
    setError(null)
    setTrainingResult(null)

    // Fake progress bar while the request is in flight
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10))
    }, 400)

    try {
      const data = await trainModel(file)
      clearInterval(interval)
      setProgress(100)
      setTrainingResult({
        accuracy: data.crossValidationAccuracy,
        summary: data.summary,
        insight: data.insight,
        modelPath: data.modelFilePath,
        usedRows: data.usedRows,
        discardedRows: data.discardedRows,
      })
    } catch (e) {
      clearInterval(interval)
      setError(e instanceof Error ? e.message : "Error al entrenar el modelo")
    } finally {
      setIsTraining(false)
    }
  }

  const handleContinue = () => {
    if (trainingResult) {
      onComplete(trainingResult)
    }
  }

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Entrenar modelo</CardTitle>
            <CardDescription>
              Entrena el modelo J48 (árbol de decisión) con tu dataset
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Training Status */}
          {!trainingResult && (
            <div className="rounded-lg border bg-muted/30 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Árbol de decisión J48</p>
                  <p className="text-sm text-muted-foreground">
                    Usando validación cruzada en {datasetInfo?.totalRows || 891} muestras
                  </p>
                </div>
              </div>

              {isTraining && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                    Entrenando... {progress}%
                    </p>
                </div>
              )}

              {!isTraining && !trainingResult && (
                <Button onClick={handleTrain} className="mt-4 w-full">
                  Iniciar entrenamiento
                </Button>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Training Results */}
          {trainingResult && (
            <div className="space-y-4">
              {/* Accuracy Card */}
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Precisión (validación cruzada)</p>
                    <p className="text-2xl font-bold text-primary">{trainingResult.accuracy.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Filas usadas</p>
                  <p className="text-lg font-semibold">{trainingResult.usedRows}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Filas descartadas</p>
                  <p className="text-lg font-semibold">{trainingResult.discardedRows}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Resumen del modelo</p>
                </div>
                <pre className="text-xs text-muted-foreground bg-muted/50 p-3 rounded overflow-x-auto">
                  {trainingResult.summary}
                </pre>
              </div>

              {/* AI Insight */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary">Observación IA</p>
                </div>
                <p className="text-sm text-foreground">{trainingResult.insight}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button variant="outline" onClick={onBack}>
                  Atrás
                </Button>
                <Button variant="outline" onClick={handleTrain} disabled={!file || isTraining}>
                  {isTraining ? "Reintentando..." : "Reintentar entrenamiento"}
                </Button>
                <Button onClick={handleContinue} disabled={!trainingResult}>
                  Continuar a predicción
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!trainingResult && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onBack}>
                Atrás
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
}
