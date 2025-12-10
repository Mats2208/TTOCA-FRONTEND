"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { User, Clock, CheckCircle, Loader2, AlertCircle, Users, ListOrdered } from "lucide-react"
import { useWebSocket } from "../hooks/useWebSocket"

const API_URL = import.meta.env.VITE_URL

const MiTurnoView = () => {
  const { empresaId } = useParams()
  const [colas, setColas] = useState([])
  const [colaSeleccionada, setColaSeleccionada] = useState(null)
  const [nombre, setNombre] = useState("")
  const [turno, setTurno] = useState(null)
  const [estado, setEstado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [loadingColas, setLoadingColas] = useState(true)

  // Animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Al iniciar, intentamos cargar turno desde localStorage
  useEffect(() => {
    const turnoGuardado = localStorage.getItem("ttoca_mi_turno")
    if (turnoGuardado) {
      try {
        const turnoData = JSON.parse(turnoGuardado)
        setTurno(turnoData)
        // Cargar estado inicial
        verificarTurnoInicial(turnoData.codigo)
      } catch (err) {
        localStorage.removeItem("ttoca_mi_turno")
      }
    }
  }, [])

  const verificarTurnoInicial = (codigo) => {
    fetch(`${API_URL}/api/verificar-global?codigo=${codigo}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo verificar el turno")
        return res.json()
      })
      .then((data) => {
        setEstado(data)
      })
      .catch((err) => {
        console.error("Error verificando turno:", err)
        localStorage.removeItem("ttoca_mi_turno")
        setTurno(null)
        setEstado(null)
        setError("Tu turno ya no está disponible. Por favor solicita uno nuevo.")
        setTimeout(() => setError(""), 5000)
      })
  }

  // WebSocket para actualizaciones en tiempo real del turno
  const { socket } = useWebSocket({
    empresaId: estado?.empresa_id || empresaId,
    colaId: estado?.cola_id,
    enabled: !!turno && !!estado,
  })

  useEffect(() => {
    if (!socket || !turno || !estado) return

    const handleQueueUpdate = (data) => {
      // Verificar si nuestro turno está en la lista actualizada
      if (data.empresaId === estado.empresa_id && data.colaId === estado.cola_id) {
        const miTurno = data.turnos?.find(t => t.codigo === turno.codigo)
        if (miTurno) {
          setEstado(prev => ({
            ...prev,
            turno: miTurno,
            posicion: miTurno.posicion
          }))
        }
      }
    }

    const handleTurnoLlamado = (data) => {
      // Si llamaron a nuestro turno
      if (data.turno.codigo === turno.codigo) {
        setEstado(prev => ({
          ...prev,
          turnoActual: data.turno
        }))
        // Limpiar después de 1 minuto
        setTimeout(() => {
          localStorage.removeItem("ttoca_mi_turno")
          setTurno(null)
          setEstado(null)
        }, 60000)
      }
    }

    socket.on('queue_updated', handleQueueUpdate)
    socket.on('turno_llamado', handleTurnoLlamado)

    return () => {
      socket.off('queue_updated', handleQueueUpdate)
      socket.off('turno_llamado', handleTurnoLlamado)
    }
  }, [socket, turno, estado])

  // Cargar colas al inicio
  useEffect(() => {
    setLoadingColas(true)
    fetch(`${API_URL}/api/configuracion/${empresaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las colas")
        return res.json()
      })
      .then((data) => {
        setColas(data.categorias || [])
        setColaSeleccionada(data.categorias?.[0] || null)
      })
      .catch((err) => {
        console.error("Error cargando colas:", err)
        setError("No se pudieron cargar las categorías. Intenta de nuevo más tarde.")
      })
      .finally(() => {
        setLoadingColas(false)
      })
  }, [empresaId])

  const solicitarTurno = () => {
    if (!nombre.trim() || !colaSeleccionada) {
      setError("Por favor ingresa tu nombre y selecciona una categoría")
      setTimeout(() => setError(""), 3000)
      return
    }

    setLoading(true)
    setError("")

    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre.trim(),
        tipo: colaSeleccionada.nombre,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al solicitar turno")
        return res.json()
      })
      .then((data) => {
        const turnoNuevo = data.turno
        setTurno(turnoNuevo)
        localStorage.setItem("ttoca_mi_turno", JSON.stringify(turnoNuevo))

        // Verificar estado inicial
        verificarTurnoInicial(turnoNuevo.codigo)

        setNombre("")
      })
      .catch((err) => {
        console.error("Error solicitando turno:", err)
        setError("Hubo un problema al solicitar tu turno. Por favor intenta de nuevo.")
        setTimeout(() => setError(""), 5000)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const cancelarTurno = () => {
    localStorage.removeItem("ttoca_mi_turno")
    setTurno(null)
    setEstado(null)
  }

  // Si ya tiene turno, mostrar vista de seguimiento
  if (turno) {
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
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Seguimiento en tiempo real</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                  Tu Turno
                </h1>
                <p className="text-gray-600">Estado de tu solicitud actualizado automáticamente</p>
              </div>

              {/* Turno Info */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-6 text-white text-center shadow-card">
                <div className="text-6xl font-bold mb-2">#{turno.numero}</div>
                <div className="text-xl font-medium mb-1">{turno.nombre}</div>
                <div className="text-sm opacity-90 font-mono">Código: {turno.codigo}</div>
              </div>

              {/* Estado */}
              {estado ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ListOrdered className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium text-gray-800">Posición en la fila</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{estado.posicion}</span>
                  </div>

                  {estado.turnoActual && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-800">Turno actual</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        #{estado.turnoActual.numero}
                      </span>
                    </div>
                  )}

                  {estado.posicion === 1 && !estado.turnoActual && (
                    <div className="p-4 bg-yellow-50 rounded-xl text-center">
                      <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-semibold text-yellow-800">¡Eres el siguiente!</p>
                      <p className="text-sm text-yellow-700">Prepárate para ser atendido</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}

              {/* Cancelar */}
              <button
                onClick={cancelarTurno}
                className="w-full mt-6 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-xl transition-colors"
              >
                Cancelar turno
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista de solicitud de turno
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/30 to-blue-100/20 pointer-events-none" />
      <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <User className="w-4 h-4" />
                <span>Solicitud de turno</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                Solicita tu turno
              </h1>
              <p className="text-gray-600">Ingresa tus datos para recibir atención</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={loadingColas || loading}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría de atención
                </label>
                <select
                  id="categoria"
                  value={colaSeleccionada?.id || ""}
                  onChange={(e) =>
                    setColaSeleccionada(colas.find((c) => c.id === e.target.value))
                  }
                  disabled={loadingColas || loading || colas.length === 0}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none disabled:opacity-50"
                >
                  {colas.map((cola) => (
                    <option key={cola.id} value={cola.id}>
                      {cola.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={solicitarTurno}
                disabled={loading || loadingColas || !nombre.trim() || !colaSeleccionada}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Solicitando...</span>
                  </>
                ) : (
                  <span>Solicitar Turno</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiTurnoView
