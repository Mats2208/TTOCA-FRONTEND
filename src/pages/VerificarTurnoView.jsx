"use client"

import { useState, useEffect } from "react"
import { Search, Clock, RefreshCw, User, AlertCircle } from "lucide-react"

const API_URL = import.meta.env.VITE_URL

const VerificarTurnoView = () => {
  const [busqueda, setBusqueda] = useState("")
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)

  // Animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    let interval = null

    if (autoRefresh && resultado) {
      interval = setInterval(() => {
        handleVerificar(true)
        setLastRefresh(new Date())
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, resultado, busqueda])

  const handleVerificar = async (silent = false) => {
    if (!silent) {
      setLoading(true)
      setError("")
    }

    try {
      const res = await fetch(`${API_URL}/api/verificar-global?codigo=${busqueda.trim().toUpperCase()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.mensaje || "Turno no encontrado")
      setResultado(data)

      // Enable auto-refresh when we get a successful result
      if (!autoRefresh && !silent) {
        setAutoRefresh(true)
      }
    } catch (err) {
      setError(err.message)
      if (silent) {
        // If error during silent refresh, disable auto-refresh
        setAutoRefresh(false)
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const calcularFaltan = () => {
    if (!resultado?.turno || !resultado?.turnoActual) return "-"
    const actual = resultado.turnoActual.numero || 0
    const mio = resultado.turno.numero
    return Math.max(mio - actual, 0)
  }

  const formatLastRefresh = () => {
    if (!lastRefresh) return ""
    return `Última actualización: ${lastRefresh.toLocaleTimeString()}`
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div
          className={`text-center transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Consulta tu posición en la fila
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
            Verificar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Turno</span>
          </h1>
        </div>

        {/* Search Form */}
        <div
          className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 transform transition-all duration-700 delay-100 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Código de seguimiento (ej: ABC123)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="p-3 pl-10 border border-gray-300 rounded-xl w-full text-center text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <button
            onClick={() => handleVerificar()}
            className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
            disabled={loading || !busqueda}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Buscar Turno</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 transform transition-all duration-500 ${
              error ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {resultado && (
          <div
            className={`transform transition-all duration-700 delay-200 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 text-center space-y-4 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10"></div>

              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Información del Turno
              </h2>

              <div className="flex items-center justify-center gap-3 py-2">
                <User className="text-blue-600 w-5 h-5" />
                <p className="text-lg">
                  <strong>Nombre:</strong> {resultado.turno.nombre}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 py-2">
                <Clock className="text-blue-600 w-5 h-5" />
                <p className="text-lg">
                  <strong>Turno #:</strong> {resultado.turno.numero}
                </p>
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xl text-blue-700 font-bold">
                  Turnos faltantes: <span className="text-2xl">{calcularFaltan()}</span>
                </p>
              </div>

              {/* Auto-refresh toggle */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
                <div className="text-gray-500">{formatLastRefresh()}</div>
                <button
                  onClick={toggleAutoRefresh}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    autoRefresh ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Actualizando..." : "Auto-actualizar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificarTurnoView
