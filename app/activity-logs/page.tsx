"use client"

import { useState } from "react"
import { Activity, Download, RefreshCw } from "lucide-react"

// Sample audit data
const sampleAuditLogs = [
  {
    id: "LOG-001",
    timestamp: "2024-11-15 15:30:22",
    module: "Sistema",
    action: "Inicio de Sesión",
    description: "Usuario inició sesión en el sistema",
    user: "Dr. Carlos Mendoza",
    severity: "Low",
    category: "auth"
  },
  {
    id: "LOG-002",
    timestamp: "2024-11-15 14:45:10",
    module: "Inventario",
    action: "Actualización de Stock",
    description: "Stock actualizado para Paracetamol 500mg",
    user: "Farmacéutico Ana López",
    severity: "Low",
    category: "inventory"
  },
  {
    id: "LOG-003",
    timestamp: "2024-11-15 13:20:15",
    module: "Pacientes",
    action: "Modificación de EHR",
    description: "Actualización de información de contacto",
    user: "Dr. María González",
    severity: "Medium",
    category: "patient"
  },
  {
    id: "LOG-004",
    timestamp: "2024-11-15 12:10:30",
    module: "Seguridad",
    action: "Intento de Acceso Fallido",
    description: "Múltiples intentos de login fallidos",
    user: "Sistema",
    severity: "Critical",
    category: "security"
  }
]

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("logs")

  const handleExport = () => {
    alert("Exportando registros de auditoría...")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'Sistema': return 'bg-blue-100 text-blue-700'
      case 'Inventario': return 'bg-purple-100 text-purple-700'
      case 'Pacientes': return 'bg-green-100 text-green-700'
      case 'Seguridad': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Registro de Actividades</h1>
                <p className="text-gray-600">Sistema de auditoría y monitoreo de actividades</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'logs', name: 'Registros', count: sampleAuditLogs.length },
                { id: 'dashboard', name: 'Dashboard', count: null },
                { id: 'users', name: 'Usuarios', count: null },
                { id: 'security', name: 'Seguridad', count: 1 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Registros de Actividad Recientes</h3>
                <p className="text-gray-600 text-sm mt-1">Últimas actividades del sistema ordenadas por fecha</p>
              </div>
              <div className="divide-y">
                {sampleAuditLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(log.module)}`}>
                            {log.module}
                          </span>
                          <span className={`px-2 py-1 rounded border text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900">{log.action}</h4>
                        <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>👤 {log.user}</span>
                          <span>🕒 {log.timestamp}</span>
                          <span>📁 {log.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <div className="text-gray-600">Total Actividades</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-green-600">23</div>
              <div className="text-gray-600">Actividades Hoy</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-red-600">2</div>
              <div className="text-gray-600">Eventos Críticos</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-purple-600">8</div>
              <div className="text-gray-600">Usuarios Activos</div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad de Usuarios</h3>
            <p className="text-gray-600">Análisis detallado de actividad por usuario disponible próximamente.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos de Seguridad</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-600">🚨</span>
                <span className="font-medium text-red-800">Intento de Acceso Fallido Detectado</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Se detectaron múltiples intentos de login fallidos desde IP: 203.45.67.89
              </p>
              <p className="text-red-600 text-xs mt-2">Hace 2 horas • Sistema de Seguridad</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}