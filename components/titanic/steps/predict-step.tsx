"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, User, Heart, Skull, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { predictSurvival } from "@/lib/api"
import type { PredictionResult, PassengerProfile } from "../titanic-module"

interface PredictStepProps {
  onComplete: (result: PredictionResult, profile: PassengerProfile) => void
  onBack: () => void
}

export function PredictStep({ onComplete, onBack }: PredictStepProps) {
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<PassengerProfile>({
    sex: "FEMALE",
    age: 26,
    passengerClass: "FIRST",
    travelingAlone: false,
    embarked: "SOUTHAMPTON",
  })

  const handlePredict = async () => {
    setIsPredicting(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictSurvival(profile)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al predecir")
    } finally {
      setIsPredicting(false)
    }
  }

  const handleContinue = () => {
    if (result) {
      onComplete(result, profile)
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
            <CardTitle className="text-xl">Realizar predicción</CardTitle>
            <CardDescription>
              Introduce los datos del pasajero para predecir la supervivencia
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Passenger Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sex">Sexo</Label>
              <Select 
                value={profile.sex} 
                onValueChange={(v) => setProfile({...profile, sex: v as "MALE" | "FEMALE"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Masculino</SelectItem>
                  <SelectItem value="FEMALE">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Clase del pasajero</Label>
              <Select 
                value={profile.passengerClass} 
                onValueChange={(v) => setProfile({...profile, passengerClass: v as "FIRST" | "SECOND" | "THIRD"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST">Primera clase</SelectItem>
                  <SelectItem value="SECOND">Segunda clase</SelectItem>
                  <SelectItem value="THIRD">Tercera clase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="embarked">Puerto de embarque</Label>
              <Select 
                value={profile.embarked} 
                onValueChange={(v) => setProfile({...profile, embarked: v as "SOUTHAMPTON" | "CHERBOURG" | "QUEENSTOWN"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOUTHAMPTON">Southampton</SelectItem>
                  <SelectItem value="CHERBOURG">Cherbourg</SelectItem>
                  <SelectItem value="QUEENSTOWN">Queenstown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between sm:col-span-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Viajando solo</Label>
                <p className="text-xs text-muted-foreground">¿El pasajero viaja sin acompañantes?</p>
              </div>
              <Switch
                checked={profile.travelingAlone}
                onCheckedChange={(checked) => setProfile({...profile, travelingAlone: checked})}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Predict Button */}
          {!result && (
            <Button onClick={handlePredict} disabled={isPredicting} className="w-full">
                  {isPredicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Prediciendo...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Predecir supervivencia
                </>
              )}
            </Button>
          )}

          {/* Prediction Result */}
          {result && (
            <div className={`rounded-lg border-2 p-6 ${result.survived ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${result.survived ? 'bg-success/20' : 'bg-destructive/20'}`}>
                  {result.survived ? (
                    <Heart className="h-8 w-8 text-success" />
                  ) : (
                    <Skull className="h-8 w-8 text-destructive" />
                  )}
                </div>
                <div>
                  <p className={`text-2xl font-bold ${result.survived ? 'text-success' : 'text-destructive'}`}>
                    {result.survived ? 'SOBREVIVIÓ' : 'NO SOBREVIVIÓ'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Probabilidad: {Math.round(result.probability * 100)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Regla aplicada</p>
                <code className="text-xs">{result.rules[0]}</code>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{result.insight}</p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button variant="outline" onClick={onBack}>
                  Atrás
                </Button>
                <Button variant="outline" onClick={handlePredict} disabled={isPredicting}>
                  {isPredicting ? "Reintentando..." : "Reintentar predicción"}
                </Button>
                <Button onClick={handleContinue} disabled={!result}>
                  Obtener explicación
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!result && (
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
