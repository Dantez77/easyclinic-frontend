import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">Cargando expediente médico...</p>
        </div>
      </div>
    </div>
  )
}
