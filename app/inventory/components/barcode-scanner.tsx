"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, X, Search, Package } from "lucide-react"
import { inventoryAPI, type InventoryItem } from "@/lib/inventory-api"

interface BarcodeScannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemFound?: (item: InventoryItem) => void
}

export function BarcodeScanner({ open, onOpenChange, onItemFound }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{
    barcode: string
    item: InventoryItem | null
    timestamp: Date
  }>>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifique los permisos.')
      console.error('Camera access error:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }, [])

  const handleManualScan = async () => {
    if (!manualBarcode.trim()) return
    
    try {
      setError(null)
      const item = await inventoryAPI.scanBarcode(manualBarcode.trim())
      setScannedItem(item)
      
      // Add to scan history
      setScanHistory(prev => [{
        barcode: manualBarcode.trim(),
        item,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]) // Keep last 10 scans
      
      if (onItemFound) {
        onItemFound(item)
      }
    } catch (err) {
      setError('Código de barras no encontrado en el inventario')
      setScanHistory(prev => [{
        barcode: manualBarcode.trim(),
        item: null,
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
    }
    
    setManualBarcode("")
  }

  const handleClose = () => {
    stopCamera()
    setScannedItem(null)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Escáner de Códigos de Barras
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escáner de Cámara</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center">
                  <Button onClick={startCamera} className="mb-4">
                    <Camera className="w-4 h-4 mr-2" />
                    Activar Cámara
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Haga clic para activar la cámara y escanear códigos de barras
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg bg-gray-900"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                    <div className="w-48 h-24 border-2 border-white rounded-lg"></div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={stopCamera}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entrada Manual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="manual-barcode">Código de Barras</Label>
                  <Input
                    id="manual-barcode"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Ingrese el código de barras..."
                    onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleManualScan} disabled={!manualBarcode.trim()}>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scanned Item Result */}
          {scannedItem && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Artículo Encontrado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Nombre:</span>
                    <span>{scannedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">SKU:</span>
                    <span>{scannedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Stock Actual:</span>
                    <span>{scannedItem.current_stock} {scannedItem.unit_of_measure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ubicación:</span>
                    <span>{scannedItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      scannedItem.status === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : scannedItem.status === 'Stock Bajo'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scannedItem.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de Escaneos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex-1">
                        <span className="font-mono text-sm">{scan.barcode}</span>
                        {scan.item ? (
                          <p className="text-sm text-green-600">{scan.item.name}</p>
                        ) : (
                          <p className="text-sm text-red-600">No encontrado</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {scan.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
            {scannedItem && onItemFound && (
              <Button onClick={() => {
                onItemFound(scannedItem)
                handleClose()
              }}>
                Usar Artículo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
