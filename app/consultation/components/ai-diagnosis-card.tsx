"use client"

import { Brain, Lightbulb, AlertTriangle, RefreshCw, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type AIDiagnosis, type SuggestedDiagnosis } from "../types"
import { Label } from "@/components/ui/label"

interface AIDiagnosisCardProps {
  aiDiagnosis?: AIDiagnosis
  isLoading: boolean
  onGenerateAIDiagnosis: () => void
}

export function AIDiagnosisCard({ aiDiagnosis, isLoading, onGenerateAIDiagnosis }: AIDiagnosisCardProps) {
  if (!aiDiagnosis && !isLoading) {
    return (
      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
            <Brain className="w-5 h-5" />
            Asistente de Diagnóstico IA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Obtenga sugerencias de diagnóstico basadas en IA según los datos de la consulta
          </p>
          <Button
            onClick={onGenerateAIDiagnosis}
            className="bg-primary hover:bg-main-800 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generar Diagnóstico IA
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
            <Brain className="w-5 h-5" />
            Asistente de Diagnóstico IA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-2">Analizando datos de la consulta...</p>
          <p className="text-sm text-muted-foreground">Esto puede tomar unos momentos</p>
        </CardContent>
      </Card>
    )
  }

  if (!aiDiagnosis) {
    return null
  }

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <Brain className="w-5 h-5" />
          Sugerencias de Diagnóstico IA
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Generado el {new Date(aiDiagnosis.generatedAt).toLocaleString('es-ES')}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Confianza de la IA</Label>
            <span className="text-sm font-medium">{Math.round(aiDiagnosis.confidence * 100)}%</span>
          </div>
          <Progress value={aiDiagnosis.confidence * 100} className="h-2" />
        </div>

        {/* Suggested Diagnoses */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Diagnósticos Sugeridos</h4>
          <div className="space-y-3">
            {aiDiagnosis.suggestedDiagnoses.map((diagnosis, index) => (
              <div key={index} className="border rounded-lg p-4 border-main-200 dark:border-main-800">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm">{diagnosis.condition}</h5>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(diagnosis.probability * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{diagnosis.reasoning}</p>
                {diagnosis.icd10Code && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {diagnosis.icd10Code}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Pasos Recomendados</h4>
          <div className="space-y-2">
            {aiDiagnosis.recommendedSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Razonamiento de la IA</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {aiDiagnosis.reasoning}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Descargo de Responsabilidad Importante</p>
              <p>{aiDiagnosis.disclaimer}</p>
            </div>
          </div>
        </div>

        {/* Regenerate Button */}
        <div className="pt-2">
          <Button
            onClick={onGenerateAIDiagnosis}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerar Diagnóstico IA
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
