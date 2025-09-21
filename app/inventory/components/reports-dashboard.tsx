"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar,
  DollarSign,
  Package,
  AlertTriangle
} from "lucide-react"
import { inventoryAPI } from "@/lib/inventory-api"
import { useInventoryStore } from "@/lib/inventory-store"

// Chart components (you might want to use recharts or similar)
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'

interface ReportsDashboardProps {
  className?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function ReportsDashboard({ className }: ReportsDashboardProps) {
  const { categories, departments } = useInventoryStore()
  
  // Report filters
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  
  // Report data
  const [valuationData, setValuationData] = useState<any>(null)
  const [usageData, setUsageData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch reports data
  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [valuation, usage] = await Promise.all([
        inventoryAPI.getValuationReport({
          category: selectedCategory === "all" ? undefined : selectedCategory,
          department: selectedDepartment === "all" ? undefined : selectedDepartment
        }),
        inventoryAPI.getUsageAnalytics({
          days: Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)),
          category: selectedCategory === "all" ? undefined : selectedCategory,
          department: selectedDepartment === "all" ? undefined : selectedDepartment
        })
      ])
      
      setValuationData(valuation)
      setUsageData(usage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [dateRange, selectedCategory, selectedDepartment])

  const handleExportReport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      if (format === 'pdf') {
        // Generate PDF report
        window.print()
      } else {
        const blob = await inventoryAPI.exportInventory({
          format,
          category: selectedCategory === "all" ? undefined : selectedCategory,
          department: selectedDepartment === "all" ? undefined : selectedDepartment
        })
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `inventory_report_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Error exporting report')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Filtros de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha Desde</label>
              <DatePicker
                date={dateRange.from}
                onDateChange={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha Hasta</label>
              <DatePicker
                date={dateRange.to}
                onDateChange={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Departamento</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map(department => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleExportReport('csv')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={() => handleExportReport('json')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar JSON
            </Button>
            <Button onClick={() => handleExportReport('pdf')} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="valuation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="valuation">Valoración de Stock</TabsTrigger>
          <TabsTrigger value="usage">Análisis de Uso</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
        </TabsList>

        {/* Stock Valuation Tab */}
        <TabsContent value="valuation" className="space-y-6">
          {valuationData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${valuationData.totalValue?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Artículos</p>
                        <p className="text-2xl font-bold">
                          {valuationData.totalItems?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Categorías Activas</p>
                        <p className="text-2xl font-bold">
                          {valuationData.activeCategories || '0'}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Promedio</p>
                        <p className="text-2xl font-bold">
                          ${valuationData.averageValue?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Categoría</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={valuationData.categoryDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(valuationData.categoryDistribution || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Value Items Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Artículos de Mayor Valor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={valuationData.topValueItems || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Usage Analytics Tab */}
        <TabsContent value="usage" className="space-y-6">
          {usageData && (
            <>
              {/* Usage Trend Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={usageData.usageTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="consumed" stroke="#8884d8" />
                      <Line type="monotone" dataKey="restocked" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fast/Slow Moving Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Artículos de Movimiento Rápido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(usageData.fastMovingItems || []).map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="default">{item.movementRate}/día</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Artículos de Movimiento Lento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(usageData.slowMovingItems || []).map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="secondary">{item.movementRate}/día</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Cumplimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Sustancias Controladas</h4>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-green-600">Monitoreadas correctamente</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Medicamentos con Receta</h4>
                    <p className="text-2xl font-bold text-blue-600">45</p>
                    <p className="text-sm text-blue-600">Bajo control médico</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800">Próximos a Vencer</h4>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                    <p className="text-sm text-orange-600">Requieren atención</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Acciones Recientes de Auditoría</h4>
                  <div className="space-y-2">
                    {[
                      { action: "Stock actualizado", item: "Paracetamol 500mg", user: "Dr. López", time: "Hace 2 horas" },
                      { action: "Sustancia controlada dispensada", item: "Tramadol 50mg", user: "Enfermera María", time: "Hace 4 horas" },
                      { action: "Nuevo lote recibido", item: "Guantes de látex", user: "Almacén", time: "Hace 6 horas" }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.item} - {log.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
