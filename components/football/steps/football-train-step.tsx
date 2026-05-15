"use client"

import { useState } from "react"
import { Upload, Loader2, Brain, TrendingUp, FileText, Lightbulb, FileCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FootballTrainingResult } from "../football-module"
import { validateFootballDataset, uploadFootballDataset, trainFootballModel } from "@/lib/api"

interface FootballTrainStepProps {
  onComplete: (result: FootballTrainingResult) => void
}

export function FootballTrainStep({ onComplete }: FootballTrainStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validated, setValidated] = useState(false)
  const [trainingResult, setTrainingResult] = useState<FootballTrainingResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setValidated(false)
      setTrainingResult(null)
    }
  }

  const handleValidateAndUpload = async () => {
    if (!file) return
    try {
      setIsValidating(true)
      const validation = await validateFootballDataset(file)
      if (!validation.valid) {
        // keep validated false; could show message
        setIsValidating(false)
        return
      }
      await uploadFootballDataset(file)
      setValidated(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleTrain = async () => {
    setIsTraining(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // Call backend to train
      const res = await trainFootballModel(file as File)
      clearInterval(interval)
      setProgress(100)

      const result: FootballTrainingResult = {
        accuracy: res.crossValidationAccuracy,
        summary: res.summary,
        insight: res.insight,
        modelPath: res.modelFilePath,
        usedRows: res.usedRows,
        discardedRows: res.discardedRows,
      }

      setTrainingResult(result)
    } catch (err) {
      console.error(err)
    } finally {
      clearInterval(interval)
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
        <CardTitle className="text-xl">Train Football Model</CardTitle>
        <CardDescription>
          Upload your matches dataset and train the RandomForest classifier
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* File Upload */}
          {!validated && (
            <>
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input
                  type="file"
                  accept=".csv,.arff"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  {file ? (
                    <>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Upload Matches.csv</p>
                      <p className="text-xs text-muted-foreground">
                        Contains Division, Elo, Form, and Odds data
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={handleValidateAndUpload}
                disabled={!file || isValidating}
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate & Upload'
                )}
              </Button>
            </>
          )}

          {/* Validated State */}
          {validated && !trainingResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4 text-success">
                <FileCheck className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Dataset uploaded successfully</p>
                  <p className="text-xs opacity-80">{file?.name} • 200,000 rows</p>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">RandomForest Classifier</p>
                    <p className="text-sm text-muted-foreground">
                      Predicts Home Win, Draw, or Away Win
                    </p>
                  </div>
                </div>

                {isTraining && (
                  <div className="mt-4 space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Training in progress... {progress}%
                    </p>
                  </div>
                )}

                {!isTraining && (
                  <Button onClick={handleTrain} className="mt-4 w-full">
                    Start Training
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Training Results */}
          {trainingResult && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cross-Validation Accuracy</p>
                    <p className="text-2xl font-bold text-primary">{trainingResult.accuracy.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Used Rows</p>
                  <p className="text-lg font-semibold">{trainingResult.usedRows.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Discarded Rows</p>
                  <p className="text-lg font-semibold">{trainingResult.discardedRows.toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Model Summary</p>
                </div>
                <pre className="text-xs text-muted-foreground bg-muted/50 p-3 rounded overflow-x-auto">
                  {trainingResult.summary}
                </pre>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary">AI Insight</p>
                </div>
                <p className="text-sm text-foreground">{trainingResult.insight}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {trainingResult && (
            <div className="flex justify-end">
              <Button onClick={handleContinue}>
                Continue to Prediction
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
}
