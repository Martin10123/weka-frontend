"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, Trophy, Home, Users, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { FootballPredictionResult, MatchProfile } from "../football-module"
import { predictFootballMatch } from "@/lib/api"

interface FootballPredictStepProps {
  onBack: () => void
}

export function FootballPredictStep({ onBack }: FootballPredictStepProps) {
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<FootballPredictionResult | null>(null)
  const [profile, setProfile] = useState<MatchProfile>({
    division: "F1",
    homeElo: 1686.34,
    awayElo: 1586.57,
    form3Home: 0,
    form3Away: 0,
    form5Home: 0,
    form5Away: 0,
    homeOdds: 1.65,
    drawOdds: 3.3,
    awayOdds: 4.3
  })

  const handlePredict = async () => {
    setIsPredicting(true)
    try {
      const res = await predictFootballMatch(profile)
      setResult({
        predictedResult: res.predictedResult,
        homeWinProbability: res.homeWinProbability,
        drawProbability: res.drawProbability,
        awayWinProbability: res.awayWinProbability,
        confidence: res.confidence,
        insight: res.insight,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsPredicting(false)
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "Home Win": return "text-primary"
      case "Draw": return "text-warning"
      case "Away Win": return "text-destructive"
      default: return "text-foreground"
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "Home Win": return <Home className="h-8 w-8" />
      case "Draw": return <Scale className="h-8 w-8" />
      case "Away Win": return <Users className="h-8 w-8" />
      default: return <Trophy className="h-8 w-8" />
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
            <CardTitle className="text-xl">Predict Match Result</CardTitle>
            <CardDescription>
              Enter match details to predict the outcome
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Match Form */}
          <div className="space-y-4">
            {/* Division */}
            <div className="space-y-2">
              <Label>Division</Label>
              <Select 
                value={profile.division} 
                onValueChange={(v) => setProfile({...profile, division: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E0">Premier League</SelectItem>
                  <SelectItem value="SP1">La Liga</SelectItem>
                  <SelectItem value="D1">Bundesliga</SelectItem>
                  <SelectItem value="I1">Serie A</SelectItem>
                  <SelectItem value="F1">Ligue 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Elo Ratings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Home Elo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profile.homeElo}
                  onChange={(e) => setProfile({...profile, homeElo: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Away Elo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profile.awayElo}
                  onChange={(e) => setProfile({...profile, awayElo: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Form */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Form 3 (Home)</Label>
                <Input
                  type="number"
                  value={profile.form3Home}
                  onChange={(e) => setProfile({...profile, form3Home: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Form 3 (Away)</Label>
                <Input
                  type="number"
                  value={profile.form3Away}
                  onChange={(e) => setProfile({...profile, form3Away: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Odds */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Home Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profile.homeOdds}
                  onChange={(e) => setProfile({...profile, homeOdds: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Draw Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profile.drawOdds}
                  onChange={(e) => setProfile({...profile, drawOdds: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Away Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profile.awayOdds}
                  onChange={(e) => setProfile({...profile, awayOdds: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          {/* Predict Button */}
          {!result && (
            <Button onClick={handlePredict} disabled={isPredicting} className="w-full">
              {isPredicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  Predict Result
                </>
              )}
            </Button>
          )}

          {/* Prediction Result */}
          {result && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6 text-center">
                <div className={`flex flex-col items-center gap-2 ${getResultColor(result.predictedResult)}`}>
                  {getResultIcon(result.predictedResult)}
                  <p className="text-2xl font-bold">{result.predictedResult}</p>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* Probability Bars */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Home Win</span>
                    <span className="font-medium">{Math.round(result.homeWinProbability * 100)}%</span>
                  </div>
                  <Progress value={result.homeWinProbability * 100} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Draw</span>
                    <span className="font-medium">{Math.round(result.drawProbability * 100)}%</span>
                  </div>
                  <Progress value={result.drawProbability * 100} className="h-2 [&>div]:bg-warning" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Away Win</span>
                    <span className="font-medium">{Math.round(result.awayWinProbability * 100)}%</span>
                  </div>
                  <Progress value={result.awayWinProbability * 100} className="h-2 [&>div]:bg-destructive" />
                </div>
              </div>

              {/* Insight */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">{result.insight}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            {result && (
              <Button variant="outline" onClick={() => setResult(null)}>
                Predict Another Match
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  )
}
