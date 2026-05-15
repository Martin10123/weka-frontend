"use client"

import { useState } from "react"
import { Upload, FileCheck, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { validateDataset, uploadDataset } from "@/lib/api"
import type { DatasetInfo } from "../titanic-module"

interface DatasetStepProps {
  onComplete: (info: DatasetInfo, file: File) => Promise<void> | void
}

export function DatasetStep({ onComplete }: DatasetStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    format: string
    message: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setValidationResult(null)
      setError(null)
    }
  }

  const handleValidate = async () => {
    if (!file) return

    setIsValidating(true)
    setError(null)

    try {
      const result = await validateDataset(file)
      setValidationResult(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al validar el archivo")
    } finally {
      setIsValidating(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !validationResult?.valid) return

    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadDataset(file)
      await onComplete(
        {
          fileName: result.sourceFileName,
          totalRows: result.totalRows,
          format: validationResult.format,
        },
        file,
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el archivo")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Subir conjunto de datos</CardTitle>
        <CardDescription>
          Selecciona un archivo CSV o ARFF con los datos de los pasajeros del Titanic
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input
              type="file"
              accept=".csv,.arff"
              onChange={handleFileChange}
              aria-label="Archivo del dataset Titanic"
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
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">Arrastra tu archivo aquí o haz clic para buscar</p>
                  <p className="text-xs text-muted-foreground">
                    Soporta formatos CSV y ARFF
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div
              className={`flex items-center gap-3 rounded-lg p-4 ${
                validationResult.valid
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {validationResult.valid ? (
                <FileCheck className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <div>
                <p className="text-sm font-medium">{validationResult.message}</p>
                {validationResult.valid && (
                  <p className="text-xs opacity-80">Format detected: {validationResult.format}</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleValidate}
              disabled={!file || isValidating}
              className="flex-1"
            >
                  {isValidating ? (
                <> 
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                'Validar'
              )}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!validationResult?.valid || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Subir y continuar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
