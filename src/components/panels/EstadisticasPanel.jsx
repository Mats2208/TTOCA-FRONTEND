"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Activity,
  Timer,
  UserCheck,
  RefreshCw,
  Eye,
  Target,
  Award,
} from "lucide-react"

const API_URL = import.meta.env.VITE_URL

export default function EstadisticaPanel({ proyecto }) {
  const [estadisticas, setEstadisticas] = useState({
    totalTurnos: 0,
    turnosHoy: 0,
    tiempoPromedio: 0,
    clientesAtendidos: 0,
    colaActiva: null,
    turnosPorHora: [],
    eficiencia: 0,
    tiempoEspera: 0,
  })
  const [cargando, setCargando] = useState(true)
  const [periodo, setPeriodo] = useState("hoy") // hoy, semana, mes
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    cargarEstadisticas()

    if (autoRefresh) {
      const interval = setInterval(cargarEstadisticas, 30000) // Actualizar cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [proyecto.id, periodo, autoRefresh])

  const cargarEstadisticas = async () => {
    setCargando(true)
    try {
      // Simular datos de estadísticas (reemplazar con API real)
      const response = await fetch(`${API_URL}/api/estadisticas/${proyecto.id}?periodo=${periodo}`)

      // Datos simulados para demostración
      const datosSimulados = {
        totalTurnos: Math.floor(Math.random() * 500) + 100,
        turnosHoy: Math.floor(Math.random() * 50) + 10,
        tiempoPromedio: Math.floor(Math.random() * 15) + 5,
        clientesAtendidos: Math.floor(Math.random() * 200) + 50,
        colaActiva: "Atención General",
        turnosPorHora: Array.from({ length: 12 }, (_, i) => ({
          hora: `${i + 8}:00`,
          turnos: Math.floor(Math.random() * 20) + 5,
        })),
        eficiencia: Math.floor(Math.random() * 30) + 70,
        tiempoEspera: Math.floor(Math.random() * 10) + 5,
      }

      setEstadisticas(datosSimulados)
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
    } finally {
      setCargando(false)
    }
  }

  const tarjetasEstadisticas = [
    {
      titulo: "Turnos Totales",
      valor: estadisticas.totalTurnos,
      icono: Users,
      color: "bg-blue-500",
      colorFondo: "bg-blue-50",
      colorTexto: "text-blue-700",
      cambio: "+12%",
      descripcion: "vs período anterior",
    },
    {
      titulo: "Turnos Hoy",
      valor: estadisticas.turnosHoy,
      icono: Calendar,
      color: "bg-green-500",
      colorFondo: "bg-green-50",
      colorTexto: "text-green-700",
      cambio: "+8%",
      descripcion: "vs ayer",
    },
    {
      titulo: "Tiempo Promedio",
      valor: `${estadisticas.tiempoPromedio} min`,
      icono: Clock,
      color: "bg-amber-500",
      colorFondo: "bg-amber-50",
      colorTexto: "text-amber-700",
      cambio: "-5%",
      descripcion: "tiempo de atención",
    },
    {
      titulo: "Clientes Atendidos",
      valor: estadisticas.clientesAtendidos,
      icono: UserCheck,
      color: "bg-violet-500",
      colorFondo: "bg-violet-50",
      colorTexto: "text-violet-700",
      cambio: "+15%",
      descripcion: "satisfactoriamente",
    },
    {
      titulo: "Eficiencia",
      valor: `${estadisticas.eficiencia}%`,
      icono: TrendingUp,
      color: "bg-emerald-500",
      colorFondo: "bg-emerald-50",
      colorTexto: "text-emerald-700",
      cambio: "+3%",
      descripcion: "del sistema",
    },
    {
      titulo: "Tiempo de Espera",
      valor: `${estadisticas.tiempoEspera} min`,
      icono: Timer,
      color: "bg-red-500",
      colorFondo: "bg-red-50",
      colorTexto: "text-red-700",
      cambio: "-2 min",
      descripcion: "promedio actual",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-violet-600" />
              </div>
              Estadísticas y Métricas
            </h2>
            <p className="text-gray-600 mt-1">Panel de control y análisis de rendimiento</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Selector de período */}
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>

            {/* Toggle auto-refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                autoRefresh ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto-actualizar
            </button>

            {/* Refresh manual */}
            <button
              onClick={cargarEstadisticas}
              disabled={cargando}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${cargando ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetasEstadisticas.map((tarjeta, index) => {
          const IconoComponente = tarjeta.icono
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${tarjeta.colorFondo} p-3 rounded-lg`}>
                  <IconoComponente className={`w-6 h-6 ${tarjeta.colorTexto}`} />
                </div>
                <div className="text-right">
                  <span className="text-sm text-green-600 font-medium">{tarjeta.cambio}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{tarjeta.titulo}</h3>
                <p className="text-2xl font-bold text-gray-800 mb-1">{tarjeta.valor}</p>
                <p className="text-xs text-gray-500">{tarjeta.descripcion}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos y análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de turnos por hora */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-800">Turnos por Hora</h3>
          </div>

          <div className="space-y-3">
            {estadisticas.turnosPorHora.slice(0, 8).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{item.hora}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.turnos / 25) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-8">{item.turnos}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de rendimiento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-800">Rendimiento del Sistema</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Eficiencia General</span>
                <span className="text-sm font-medium text-gray-800">{estadisticas.eficiencia}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${estadisticas.eficiencia}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Satisfacción del Cliente</span>
                <span className="text-sm font-medium text-gray-800">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[92%] transition-all duration-500"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tiempo de Respuesta</span>
                <span className="text-sm font-medium text-gray-800">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[85%] transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de estado actual */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-800">Estado Actual del Sistema</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-800">Sistema Operativo</h4>
            <p className="text-sm text-green-600 mt-1">Funcionando correctamente</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-800">Cola Activa</h4>
            <p className="text-sm text-blue-600 mt-1">{estadisticas.colaActiva}</p>
          </div>

          <div className="text-center p-4 bg-violet-50 rounded-lg border border-violet-200">
            <Clock className="w-8 h-8 text-violet-600 mx-auto mb-2" />
            <h4 className="font-semibold text-violet-800">Próxima Actualización</h4>
            <p className="text-sm text-violet-600 mt-1">En 25 segundos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
