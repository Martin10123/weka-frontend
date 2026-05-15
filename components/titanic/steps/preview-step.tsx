"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, Table, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { previewDataset, normalizeDataset } from "@/lib/api"
import type { PreviewRow } from "@/lib/api"
import type { DatasetInfo } from "../titanic-module"

interface PreviewStepProps {
  datasetInfo: DatasetInfo | null
  file: File | null
  onComplete: () => void
  onBack: () => void
}

export function PreviewStep({ datasetInfo, file, onComplete, onBack }: PreviewStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewRow[] | null>(null)
  const [isNormalizing, setIsNormalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatPassengerClass = (row: PreviewRow) => {
    if (row.passengerClass) {
      return row.passengerClass
    }

    if (typeof row.pclass === "number") {
      return `Clase ${row.pclass}`
    }

    return "-"
  }

  const handlePreview = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await previewDataset(file, 5)
      setPreviewData(result.rows)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al obtener la previsualización")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNormalize = async () => {
    if (!file) return
    setIsNormalizing(true)
    setError(null)
    try {
      await normalizeDataset(file)
      onComplete()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al normalizar el dataset")
    } finally {
      setIsNormalizing(false)
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
            <CardTitle className="text-xl">Vista previa del dataset</CardTitle>
            <CardDescription>
              Revisa los datos parseados antes de entrenar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          {/* Dataset Info */}
          {datasetInfo && (
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
              <Table className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{datasetInfo.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {datasetInfo.totalRows} filas • formato {datasetInfo.format}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handlePreview} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Cargar previsualización'
                )}
              </Button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Data Table */}
          {previewData && (
            <div className="rounded-lg border">
              <UITable>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Edad</TableHead>
                    <TableHead className="font-semibold">Clase</TableHead>
                    <TableHead className="font-semibold">Sexo</TableHead>
                    <TableHead className="font-semibold">Solo</TableHead>
                    <TableHead className="font-semibold">Embarcado</TableHead>
                    <TableHead className="font-semibold">Sobrevivió</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {formatPassengerClass(row)}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.sex}</TableCell>
                      <TableCell>{row.travelingAlone ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{row.embarked}</TableCell>
                      <TableCell>
                        <Badge variant={row.survived === 1 ? "default" : "secondary"}>
                          {row.survived === 1 ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button 
              onClick={handleNormalize} 
              disabled={!previewData || isNormalizing}
            >
              {isNormalizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Normalizando...
                </>
              ) : (
                'Normalizar y continuar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
