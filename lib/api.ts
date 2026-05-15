const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

// ── Types ────────────────────────────────────────────────────────────────────

export interface ValidateResponse {
  valid: boolean
  format: string
  message: string
}

export interface UploadResponse {
  sourceFileName: string
  totalRows: number
}

export interface PreviewRow {
  age: number
  passengerClass: string
  sex: string
  travelingAlone: boolean
  embarked: string
  survived: number
}

export interface PreviewResponse {
  rows: PreviewRow[]
  totalRows: number
}

export interface NormalizeResponse {
  rows: PreviewRow[]
  usedRows: number
  discardedRows: number
}

export interface TrainResponse {
  sourceFileName: string
  modelFilePath: string
  totalRows: number
  usedRows: number
  discardedRows: number
  crossValidationAccuracy: number
  insight: string
  summary: string
}

export interface PassengerProfile {
  sex: "MALE" | "FEMALE"
  age: number
  passengerClass: "FIRST" | "SECOND" | "THIRD"
  travelingAlone: boolean
  embarked: "SOUTHAMPTON" | "CHERBOURG" | "QUEENSTOWN"
}

export interface PredictResponse {
  survived: boolean
  probability: number
  rules: string[]
  insight: string
  narrative: string
}

export interface ExplainResponse {
  survived: boolean
  probability: number
  rules: string[]
  narrative: string
  provider: string
}

export interface WhatIfResponse {
  original: PredictResponse
  modified: PredictResponse
  probabilityDelta: number
  summary: string
}

// ── Football types ─────────────────────────────────────────────────────────

export interface FootballTrainResponse {
  sourceFileName: string
  modelFilePath: string
  totalRows: number
  usedRows: number
  discardedRows: number
  crossValidationAccuracy: number
  insight: string
  summary: string
}

export interface FootballPredictionResponse {
  predictedResult: "Home Win" | "Draw" | "Away Win"
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  confidence: number
  insight: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Error ${res.status}`
    try {
      const body = await res.text()
      if (body) msg = body
    } catch {}
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}

// ── Titanic endpoints ─────────────────────────────────────────────────────────

export async function validateDataset(file: File): Promise<ValidateResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/datasets/validate`, { method: "POST", body: form })
  return handleResponse<ValidateResponse>(res)
}

export async function uploadDataset(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/datasets/upload`, { method: "POST", body: form })
  return handleResponse<UploadResponse>(res)
}

export async function previewDataset(file: File, limit = 5): Promise<PreviewResponse> {
  const form = new FormData()
  form.append("file", file)
  // Backend doc says GET /datasets/preview?limit=5 with form-data; some Java servers
  // accept body on GET, but we use POST-like approach via query string fallback.
  // If the backend stores state after upload, the file param may be ignored.
  const res = await fetch(`${API_BASE}/datasets/preview?limit=${limit}`, {
    method: "GET",
  })
  // If GET without body fails, retry with POST
  if (res.status === 405 || res.status === 400 || res.status === 415) {
    const res2 = await fetch(`${API_BASE}/datasets/preview?limit=${limit}`, {
      method: "POST",
      body: form,
    })
    return handleResponse<PreviewResponse>(res2)
  }
  return handleResponse<PreviewResponse>(res)
}

export async function normalizeDataset(file: File): Promise<NormalizeResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/datasets/normalize`, { method: "POST", body: form })
  return handleResponse<NormalizeResponse>(res)
}

export async function trainModel(file: File): Promise<TrainResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/models/train`, { method: "POST", body: form })
  return handleResponse<TrainResponse>(res)
}

// ── Football endpoints ─────────────────────────────────────────────────────

export async function validateFootballDataset(file: File): Promise<ValidateResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/football/datasets/validate`, { method: "POST", body: form })
  return handleResponse<ValidateResponse>(res)
}

export async function uploadFootballDataset(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/football/datasets/upload`, { method: "POST", body: form })
  return handleResponse<UploadResponse>(res)
}

export async function trainFootballModel(file: File): Promise<FootballTrainResponse> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/football/models/train`, { method: "POST", body: form })
  return handleResponse<FootballTrainResponse>(res)
}

export async function predictFootballMatch(profile: object): Promise<FootballPredictionResponse> {
  const res = await fetch(`${API_BASE}/football/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  })
  return handleResponse<FootballPredictionResponse>(res)
}

export async function predictSurvival(profile: PassengerProfile): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  })
  return handleResponse<PredictResponse>(res)
}

export async function explainPrediction(profile: PassengerProfile): Promise<ExplainResponse> {
  const res = await fetch(`${API_BASE}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  })
  return handleResponse<ExplainResponse>(res)
}

export async function whatIfAnalysis(
  baseProfile: PassengerProfile,
  field: string,
  value: string | boolean,
): Promise<WhatIfResponse> {
  const body = { baseProfile, [field]: value }
  const res = await fetch(`${API_BASE}/what-if`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return handleResponse<WhatIfResponse>(res)
}
