"use client"

import { useState, useEffect } from "react"
import { Search, Clock, User, AlertCircle, ListOrdered, CheckCircle } from "lucide-react"
import { useWebSocket } from "../hooks/useWebSocket"

const API_URL = import.meta.env.VITE_URL

const VerificarTurnoView = () => {
  const [busqueda, setBusqueda] = useState("")
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // WebSocket para actualizaciones en tiempo real
  const { socket } = useWebSocket({
    empresaId: resultado?.empresa_id,
    colaId: resultado?.cola_id,
    enabled: !!resultado,
  })

  useEffect(() => {
    if (!socket || !resultado) return

    const handleQueueUpdate = (data) => {
      // Actualizar posición si nuestro turno está en la lista
      if (data.empresaId === resultado.empresa_id && data.colaId === resultado.cola_id) {
        const miTurno = data.turnos?.find(t => t.codigo === resultado.turno.codigo)
        if (miTurno) {
          setResultado(prev => ({
            ...prev,
            turno: miTurno,
            posicion: miTurno.posicion
          }))
        } else {
          // El turno ya no está en la cola (fue llamado/cancelado)
          setError("El turno ya no está en la cola. Puede haber sido atendido o cancelado.")
          setResultado(null)
        }
      }
    }

    const handleTurnoLlamado = (data) => {
      // Actualizar turno actual si corresponde
      if (data.empresaId === resultado.empresa_id && data.colaId === resultado.cola_id) {
        setResultado(prev => ({
          ...prev,
          turnoActual: data.turno
        }))
      }
    }

    socket.on('queue_updated', handleQueueUpdate)
    socket.on('turno_llamado', handleTurnoLlamado)

    return () => {
      socket.off('queue_updated', handleQueueUpdate)
      socket.off('turno_llamado', handleTurnoLlamado)
    }
  }, [socket, resultado])

  const handleVerificar = async () => {
    if (!busqueda.trim()) {
      setError("Por favor ingresa un código de turno")
      return
    }

    setLoading(true)
    setError("")
    setResultado(null)

    try {
      const res = await fetch(`${API_URL}/api/verificar-global?codigo=${busqueda.trim().toUpperCase()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.mensaje || "Turno no encontrado")
      setResultado(data)
    } catch (err) {
      setError(err.message)
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerificar()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 to-secondary-50/40 pointer-events-none" />
      <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-secondary-200/40 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-2xl transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Search className="w-4 h-4" />
                <span>Verificación de Turno</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                Consulta tu turno
              </h1>
              <p className="text-gray-600">Ingresa tu código para ver el estado en tiempo real</p>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                Código de turno
              </label>
              <div className="flex gap-3">
                <input
                  id="codigo"
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Ej: ABC123"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none disabled:opacity-50 uppercase"
                />
                <button
                  onClick={handleVerificar}
                  disabled={loading || !busqueda.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-card shadow-soft text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Verificar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {resultado && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Turno Info Card */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6" />
                      <h2 className="text-2xl font-bold">{resultado.turno.nombre}</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-extrabold">#{resultado.turno.numero}</div>
                    </div>
                  </div>
                  <div className="text-sm opacity-90">
                    Código: <span className="font-mono font-bold">{resultado.turno.codigo}</span>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid gap-4">
                  {/* Posición */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ListOrdered className="w-6 h-6 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Posición en la fila</div>
                        <div className="text-sm text-gray-600">Actualizado en tiempo real</div>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-purple-600">{resultado.posicion}</div>
                  </div>

                  {/* Turno Actual */}
                  {resultado.turnoActual && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Turno en atención</div>
                          <div className="text-sm text-gray-600">{resultado.turnoActual.nombre}</div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600">#{resultado.turnoActual.numero}</div>
                    </div>
                  )}

                  {/* Tiempo Estimado */}
                  {resultado.posicion > 1 && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Personas adelante</div>
                          <div className="text-sm text-gray-600">Espera estimada</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{resultado.posicion - 1}</div>
                        <div className="text-sm text-gray-600">personas</div>
                      </div>
                    </div>
                  )}

                  {/* Next in line */}
                  {resultado.posicion === 1 && !resultado.turnoActual && (
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl text-center border-2 border-yellow-200">
                      <div className="text-6xl mb-3">🎉</div>
                      <h3 className="text-2xl font-bold text-yellow-800 mb-2">¡Eres el siguiente!</h3>
                      <p className="text-yellow-700">Prepárate para ser atendido</p>
                    </div>
                  )}
                </div>

                {/* Real-time indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Actualizaciones en tiempo real activadas</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!resultado && !error && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Ingresa tu código para verificar tu turno</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificarTurnoView
