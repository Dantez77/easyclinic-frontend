export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "normal":
      return "default"
    case "elevado":
    case "alto":
      return "destructive"
    case "bajo":
      return "secondary"
    case "límite":
      return "outline"
    case "completado":
    case "completada":
      return "default"
    case "activo":
    case "activa":
      return "default"
    case "controlada":
      return "default"
    case "severa":
      return "destructive"
    case "moderada":
      return "secondary"
    default:
      return "outline"
  }
}

export const formatVitalSignLabel = (key: string): string => {
  const labels: Record<string, string> = {
    temperature: "Temperatura",
    bloodPressure: "Presión Arterial",
    heartRate: "Frecuencia Cardíaca",
    respiratoryRate: "Frecuencia Respiratoria", 
    oxygenSaturation: "Saturación O₂",
    weight: "Peso",
    height: "Altura",
    bmi: "IMC",
  }
  
  return labels[key] || key.replace(/([A-Z])/g, " $1").trim()
}

export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "severa":
      return "destructive"
    case "moderada":
      return "secondary"
    case "leve":
      return "outline"
    default:
      return "outline"
  }
}
