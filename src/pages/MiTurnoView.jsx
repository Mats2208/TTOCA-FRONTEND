"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { User, Clock, CheckCircle, Loader2, AlertCircle, Users, ListOrdered } from "lucide-react"

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
        setTurno(JSON.parse(turnoGuardado))
      } catch (err) {
        // Si hay error al parsear, limpiamos el localStorage
        localStorage.removeItem("ttoca_mi_turno")
      }
    }
  }, [])

  // Si hay turno en localStorage, verificamos su estado periódicamente
  useEffect(() => {
    if (!turno) return

    const verificar = () => {
      fetch(`${API_URL}/api/verificar-global?codigo=${turno.codigo}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("No se pudo verificar el turno")
          }
          return res.json()
        })
        .then((data) => {
          setEstado(data)
          // Si el turno está en atención o ya no existe (completado/cancelado)
          if (data.turno.estado === "en atención" || data.turno.estado === "completado") {
            // Mostramos el estado pero preparamos para limpiar después de un tiempo
            setTimeout(() => {
              localStorage.removeItem("ttoca_mi_turno")
              setTurno(null)
              setEstado(null)
            }, 60000) // Limpiamos después de 1 minuto para que el usuario vea que fue atendido
          }
        })
        .catch((err) => {
          console.error("Error verificando turno:", err)
          // Si hay error al verificar (turno no encontrado), limpiamos localStorage
          localStorage.removeItem("ttoca_mi_turno")
          setTurno(null)
          setEstado(null)
          setError("Tu turno ya no está disponible. Por favor solicita uno nuevo.")
          // Limpiamos el error después de 5 segundos
          setTimeout(() => setError(""), 5000)
        })
    }

    verificar()
    const intervalo = setInterval(verificar, 5000)
    return () => clearInterval(intervalo)
  }, [turno])

  // Cargar colas al inicio
  useEffect(() => {
    setLoadingColas(true)
    fetch(`${API_URL}/api/configuracion/${empresaId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar las colas")
        }
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

  const obtenerTurno = () => {
    if (!nombre || !colaSeleccionada) return

    setLoading(true)
    setError("")

    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        tipo: colaSeleccionada.nombre,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo obtener el turno")
        }
        return res.json()
      })
      .then((data) => {
        localStorage.setItem("ttoca_mi_turno", JSON.stringify(data.turno))
        setTurno(data.turno)
      })
      .catch((err) => {
        console.error("Error obteniendo turno:", err)
        setError("No se pudo obtener el turno. Intenta de nuevo más tarde.")
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

  // Si hay turno y estado, mostramos la información del turno
  if (turno && estado) {
    const faltan = Math.max(turno.numero - (estado.turnoActual?.numero || 0), 0)
    const enAtencion = estado.turno.estado === "en atención"
    const completado = estado.turno.estado === "completado"

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div
            className={`text-center transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {enAtencion ? "¡Es tu turno!" : completado ? "Turno completado" : "Turno en espera"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Turno</span>
            </h1>
          </div>

          {/* Turno Card */}
          <div
            className={`bg-white p-6 rounded-2xl shadow-lg border border-blue-100 mb-6 transform transition-all duration-700 delay-100 ease-out relative overflow-hidden ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Background decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10"></div>

            <div className="flex items-center justify-center gap-3 py-3 border-b border-gray-100">
              <User className="text-blue-600 w-5 h-5" />
              <p className="text-lg">
                <strong>Nombre:</strong> {estado.turno.nombre}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-3 border-b border-gray-100">
              <ListOrdered className="text-blue-600 w-5 h-5" />
              <p className="text-lg">
                <strong>Turno #:</strong> {estado.turno.numero}
              </p>
            </div>

            {enAtencion ? (
              <div className="mt-6 bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-center gap-3">
                <CheckCircle className="text-green-600 w-6 h-6" />
                <p className="text-xl text-green-700 font-bold">¡Es tu turno ahora!</p>
              </div>
            ) : completado ? (
              <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-center gap-3">
                <CheckCircle className="text-blue-600 w-6 h-6" />
                <p className="text-xl text-blue-700 font-bold">Turno completado</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3 py-3 border-b border-gray-100">
                  <Clock className="text-blue-600 w-5 h-5" />
                  <p className="text-lg">
                    <strong>Turno actual:</strong> {estado.turnoActual?.numero || "N/A"}
                  </p>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center gap-3">
                    <Users className="text-blue-600 w-6 h-6" />
                    <p className="text-xl text-blue-700 font-bold">
                      Faltan <span className="text-2xl">{faltan}</span> turno(s)
                    </p>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={cancelarTurno}
              className="mt-6 w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-base hover:bg-gray-200 transition-all"
            >
              {enAtencion || completado ? "Solicitar nuevo turno" : "Cancelar turno"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay turno todavía, mostrar formulario
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div
          className={`text-center transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Ingresa tus datos para la fila
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
            Solicita tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Turno</span>
          </h1>
        </div>

        {/* Form Card */}
        <div
          className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 transform transition-all duration-700 delay-100 ease-out relative overflow-hidden ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Background decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl -z-10"></div>
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10"></div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Tu nombre
              </label>
              <div className="relative">
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="p-3 pl-10 border border-gray-300 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label htmlFor="cola" className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona la categoría
              </label>
              <div className="relative">
                {loadingColas ? (
                  <div className="p-3 border border-gray-300 rounded-xl w-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-500">Cargando categorías...</span>
                  </div>
                ) : (
                  <select
                    id="cola"
                    value={colaSeleccionada?.id || ""}
                    onChange={(e) => setColaSeleccionada(colas.find((c) => c.id === e.target.value))}
                    className="p-3 pl-10 border border-gray-300 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {colas.length === 0 ? (
                      <option value="" disabled>
                        No hay categorías disponibles
                      </option>
                    ) : (
                      colas.map((cola) => (
                        <option key={cola.id} value={cola.id}>
                          {cola.nombre}
                        </option>
                      ))
                    )}
                  </select>
                )}
                <ListOrdered className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              onClick={obtenerTurno}
              disabled={loading || !nombre || !colaSeleccionada || loadingColas}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Obtener Turno</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiTurnoView
