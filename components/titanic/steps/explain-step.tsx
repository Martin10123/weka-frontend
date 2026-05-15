"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, BookOpen, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { explainPrediction } from "@/lib/api"
import type { PredictionResult, PassengerProfile } from "../titanic-module"

interface ExplainStepProps {
  predictionResult: PredictionResult | null
  profile: PassengerProfile | null
  onComplete: (narrative: string) => void
  onBack: () => void
}

export function ExplainStep({ predictionResult, profile, onComplete, onBack }: ExplainStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [narrative, setNarrative] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateExplanation = async () => {
    if (!profile) return
    setIsGenerating(true)
    setError(null)
    try {
      const data = await explainPrediction(profile)
      setNarrative(data.narrative)
      setProvider(data.provider)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar la explicación")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = () => {
    if (narrative) {
      onComplete(narrative)
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
            <CardTitle className="text-xl">Explicación IA</CardTitle>
            <CardDescription>
              Genera una explicación narrativa de la predicción
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Prediction Summary */}
          {predictionResult && profile && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium mb-3">Resumen de la predicción</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{profile.sex === 'MALE' ? 'Masculino' : 'Femenino'}</Badge>
                <Badge variant="outline">{profile.age} años</Badge>
                <Badge variant="outline">{profile.passengerClass === 'FIRST' ? 'Primera clase' : profile.passengerClass === 'SECOND' ? 'Segunda clase' : 'Tercera clase'}</Badge>
                <Badge variant="outline">{profile.embarked}</Badge>
                <Badge variant={predictionResult.survived ? "default" : "secondary"}>
                  {predictionResult.survived ? "Sobrevivió" : "No sobrevivió"}
                </Badge>
                <Badge variant="outline">{Math.round(predictionResult.probability * 100)}% confianza</Badge>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          {!narrative && (
            <Button onClick={handleGenerateExplanation} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando narrativa con IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar explicación con IA
                </>
              )}
            </Button>
          )}

          {/* Narrative */}
          {narrative && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-primary">Narrativa generada</p>
                <Badge variant="outline" className="ml-auto text-xs">{provider ?? "AI"}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {narrative}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button onClick={handleContinue} disabled={!narrative}>
              Probar escenarios hipotéticos
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
