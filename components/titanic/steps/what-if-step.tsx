"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, ArrowRight, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { whatIfAnalysis } from "@/lib/api"
import type { WhatIfResponse } from "@/lib/api"
import type { PassengerProfile } from "../titanic-module"

interface WhatIfStepProps {
  profile: PassengerProfile | null
  onBack: () => void
}

export function WhatIfStep({ profile, onBack }: WhatIfStepProps) {
  const [isComputing, setIsComputing] = useState(false)
  const [modifiedField, setModifiedField] = useState<string>("")
  const [modifiedValue, setModifiedValue] = useState<string>("")
  const [result, setResult] = useState<WhatIfResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCompute = async () => {
    if (!profile || !modifiedField || !modifiedValue) return
    setIsComputing(true)
    setError(null)
    try {
      // travelingAlone must be sent as boolean, not string
      const value: string | boolean =
        modifiedField === "travelingAlone" ? modifiedValue === "true" : modifiedValue
      const data = await whatIfAnalysis(profile, modifiedField, value)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al calcular el escenario")
    } finally {
      setIsComputing(false)
    }
  }

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return "text-success"
    if (delta < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="h-5 w-5" />
    if (delta < 0) return <TrendingDown className="h-5 w-5" />
    return <Minus className="h-5 w-5" />
  }

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">What-If Analysis</CardTitle>
            <CardDescription>
              Explore alternative scenarios by changing one variable
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Current Profile */}
          {profile && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium mb-3">Base Profile</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{profile.sex}</Badge>
                <Badge variant="outline">{profile.age} years</Badge>
                <Badge variant="outline">{profile.passengerClass} Class</Badge>
                <Badge variant="outline">{profile.embarked}</Badge>
                <Badge variant="outline">{profile.travelingAlone ? "Alone" : "With companions"}</Badge>
              </div>
            </div>
          )}

          {/* Modification Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Field to Change</Label>
              <Select value={modifiedField} onValueChange={(v) => { setModifiedField(v); setModifiedValue(""); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sex">Sex</SelectItem>
                  <SelectItem value="passengerClass">Passenger Class</SelectItem>
                  <SelectItem value="embarked">Port of Embarkation</SelectItem>
                  <SelectItem value="travelingAlone">Traveling Alone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>New Value</Label>
              {modifiedField === "sex" && (
                <Select value={modifiedValue} onValueChange={setModifiedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {modifiedField === "passengerClass" && (
                <Select value={modifiedValue} onValueChange={setModifiedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST">First Class</SelectItem>
                    <SelectItem value="SECOND">Second Class</SelectItem>
                    <SelectItem value="THIRD">Third Class</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {modifiedField === "embarked" && (
                <Select value={modifiedValue} onValueChange={setModifiedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOUTHAMPTON">Southampton</SelectItem>
                    <SelectItem value="CHERBOURG">Cherbourg</SelectItem>
                    <SelectItem value="QUEENSTOWN">Queenstown</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {modifiedField === "travelingAlone" && (
                <Select value={modifiedValue} onValueChange={setModifiedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {!modifiedField && (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field first" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Compute Button */}
          <Button
            onClick={handleCompute} 
            disabled={isComputing || !modifiedField || !modifiedValue} 
            className="w-full"
          >
            {isComputing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Computing...
              </>
            ) : (
              'Compare Scenarios'
            )}
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Comparison Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Original */}
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Original</p>
                  <p className={`text-2xl font-bold ${result.original.survived ? 'text-success' : 'text-destructive'}`}>
                    {Math.round(result.original.probability * 100)}%
                  </p>
                  <Badge variant={result.original.survived ? "default" : "secondary"} className="mt-2">
                    {result.original.survived ? "Survived" : "Not Survived"}
                  </Badge>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* Modified */}
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Modified</p>
                  <p className={`text-2xl font-bold ${result.modified.survived ? 'text-success' : 'text-destructive'}`}>
                    {Math.round(result.modified.probability * 100)}%
                  </p>
                  <Badge variant={result.modified.survived ? "default" : "secondary"} className="mt-2">
                    {result.modified.survived ? "Survived" : "Not Survived"}
                  </Badge>
                </div>
              </div>

              {/* Delta */}
              <div className={`flex items-center justify-center gap-2 rounded-lg border p-4 ${getDeltaColor(result.probabilityDelta)}`}>
                {getDeltaIcon(result.probabilityDelta)}
                <span className="text-lg font-semibold">
                  {result.probabilityDelta >= 0 ? '+' : ''}{Math.round(result.probabilityDelta * 100)}% points
                </span>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button variant="outline" onClick={() => { setResult(null); setModifiedField(""); setModifiedValue(""); }}>
              Try Another Scenario
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
