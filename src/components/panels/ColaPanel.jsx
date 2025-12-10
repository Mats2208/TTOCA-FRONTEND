"use client"

const API_URL = import.meta.env.VITE_URL
import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  Users,
  Clock,
  RefreshCw,
  ChevronRight,
  Plus,
  User,
  X,
  Monitor,
  Clipboard,
  Settings,
} from "lucide-react"
import { useQueueWebSocket } from "../../hooks/useWebSocket"

export default function ColaPanel({ proyecto }) {
  const empresaId = proyecto.id
  const [colas, setColas] = useState([]) // lista de colas (categorías)
  const [colaSeleccionada, setColaSeleccionada] = useState(null)
  const [clientes, setClientes] = useState([])
  const [colaActiva, setColaActiva] = useState(false)
  const [nombreCliente, setNombreCliente] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [cargando, setCargando] = useState(false)
  const modalRef = useRef(null)
  

  // Efecto para cerrar el modal al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarModal(false)
      }
    }

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setMostrarModal(false)
      }
    }

    if (mostrarModal) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscKey)
      // Prevenir scroll en el body cuando el modal está abierto
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [mostrarModal])

  useEffect(() => {
    setCargando(true)
    fetch(`${API_URL}/api/configuracion/${empresaId}`)
      .then((res) => res.json())
      .then((data) => {
        const categorias = data.categorias || []
        setColas(categorias)
        if (categorias.length > 0) {
          setColaSeleccionada(categorias[0])
        }
      })
      .catch((err) => console.error("Error al cargar configuración:", err))
      .finally(() => setCargando(false))
  }, [empresaId])

  // Cargar turnos iniciales al seleccionar una cola
  useEffect(() => {
    if (colaSeleccionada) {
      setCargando(true)
      fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
        .then((res) => res.json())
        .then((data) => {
          setClientes(data.turnos || [])
          setColaActiva((data.turnos || []).length > 0) // activa si hay turnos
        })
        .catch((err) => console.error("Error al cargar turnos:", err))
        .finally(() => setCargando(false))
    }
  }, [colaSeleccionada])

  // WebSocket para actualizaciones en tiempo real
  // IMPORTANTE: enabled debe estar siempre activo cuando hay cola seleccionada
  // No depender de colaActiva para recibir actualizaciones
  useQueueWebSocket({
    empresaId,
    colaId: colaSeleccionada?.id,
    onQueueUpdate: (turnos) => {
      setClientes(turnos)
      // Actualizar colaActiva basado en si hay turnos (corregido el bug)
      setColaActiva(turnos.length > 0)
    },
    enabled: !!colaSeleccionada, // Siempre escuchar cuando hay cola seleccionada
  })

  const toggleCola = () => {
    if (!colaSeleccionada) return

    if (colaActiva) {
      // Pausar cola
      setColaActiva(false)
    } else {
      // Activar cola: hacer fetch y marcar activa
      setCargando(true)
      fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
        .then((res) => res.json())
        .then((data) => {
          setClientes(data.turnos || [])
          setColaActiva(true)
        })
        .catch((err) => console.error("Error al activar cola:", err))
        .finally(() => setCargando(false))
    }
  }

  const agregarCliente = () => {
    if (!nombreCliente.trim() || !colaSeleccionada) return
    setCargando(true)
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombreCliente,
        tipo: colaSeleccionada.nombre,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNombreCliente("")
        setColaActiva(true)

        // Actualización optimista: agregar el turno de inmediato
        if (data.turno) {
          setClientes(prev => [...prev, data.turno])
        }

        // Fallback: Si WebSocket no actualiza en 2 segundos, hacer fetch manual
        const fallbackTimer = setTimeout(() => {
          fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
            .then(res => res.json())
            .then(result => {
              if (result.turnos) {
                setClientes(result.turnos)
              }
            })
            .catch(err => console.error("Error en fallback:", err))
        }, 2000)

        // Limpiar timer si el componente se desmonta
        return () => clearTimeout(fallbackTimer)
      })
      .catch((err) => console.error("Error al agregar cliente:", err))
      .finally(() => setCargando(false))
  }

  const llamarSiguiente = () => {
    if (!colaSeleccionada) return
    setCargando(true)
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}/siguiente`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        // Si no hay más turnos, el backend devuelve un mensaje
        if (data.mensaje === "No hay turnos") {
          setColaActiva(false)
          setClientes([])
        }
        // WebSocket actualizará automáticamente la lista en otros casos
      })
      .catch((err) => console.error("Error al llamar siguiente:", err))
      .finally(() => setCargando(false))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const abrirVista = (ruta) => {
    // Usar la URL del frontend (Vite dev server o producción)
    // No usar API_URL aquí porque las rutas son del frontend, no del backend
    const frontendUrl = window.location.origin;
    const url = `${frontendUrl}${ruta}`;
    window.open(url, "_blank", "width=800,height=600");
    setMostrarModal(false);
  };

  const vistas = [
    {
      titulo: "Pantalla Pública (Monitor)",
      ruta: `/monitor/${empresaId}/${colaSeleccionada?.id}`,
      color: "bg-violet-600 hover:bg-violet-700",
      icono: <Monitor className="w-5 h-5" />,
      descripcion: "Muestra los turnos actuales y llamados",
    },
    {
      titulo: "Pantalla de Registro",
      ruta: `/entrada/${empresaId}/${colaSeleccionada?.id}`,
      color: "bg-blue-600 hover:bg-blue-700",
      icono: <Clipboard className="w-5 h-5" />,
      descripcion: "Permite a los clientes registrarse",
    },
    {
      titulo: "Panel de Administración",
      ruta: `/admin/${empresaId}/${colaSeleccionada?.id}`,
      color: "bg-emerald-600 hover:bg-emerald-700",
      icono: <Settings className="w-5 h-5" />,
      descripcion: "Control avanzado de la cola",
    },
  ]

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-card overflow-hidden border border-gray-200">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">{colaSeleccionada ? colaSeleccionada.nombre : "Colas"}</h2>
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
          <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Sidebar de colas */}
      <div
        className={`
        ${sidebarOpen ? "block" : "hidden"} 
        md:block w-full md:w-64 md:min-h-[600px] bg-white border-r border-gray-200 md:shadow-sm
      `}
      >
        <div className="p-4 border-b border-gray-200 hidden md:block">
          <h3 className="text-lg font-bold text-gray-800">Colas disponibles</h3>
          <p className="text-sm text-gray-500 mt-1">Selecciona una cola para gestionar</p>
        </div>
        <ul className="p-3 space-y-1">
          {colas.map((cola) => (
            <li
              key={cola.id}
                onClick={() => {
                  setColaSeleccionada(cola)
                  setCargando(true)

                  fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${cola.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setClientes(data.turnos || []) // ✅ Esto es suficiente
                    })
                    .catch((err) => console.error("Error al cargar turnos:", err))
                    .finally(() => setCargando(false))

                  if (window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
              className={`
                cursor-pointer px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                ${
                  colaSeleccionada?.id === cola.id
                    ? "bg-primary-100 text-primary-700 border-l-4 border-primary-600 shadow-soft"
                    : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent hover:border-gray-300"
                }
              `}
            >
              <Users className="w-4 h-4 mr-3" />
              {cola.nombre}
            </li>
          ))}
        </ul>
      </div>

      {/* Panel principal */}
      <div className={`flex-1 bg-white p-5 ${!sidebarOpen ? "block" : "hidden md:block"}`}>
        {colaSeleccionada ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2.5 rounded-xl mr-3 shadow-soft">
                  <Users size={20} />
                </span>
                {colaSeleccionada.nombre}
              </h2>
              <div className="flex items-center">
                <span
                  className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300
                  ${colaActiva ? "bg-success-100 text-success-700 ring-2 ring-success-200" : "bg-gray-100 text-gray-600"}
                `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${colaActiva ? "bg-success-500 animate-pulse-subtle" : "bg-gray-400"}`}></span>
                  {colaActiva ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl text-primary-700">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Clientes en espera</p>
                    <p className="text-3xl font-bold text-gray-800">{clientes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-warning-100 to-warning-200 p-3 rounded-xl text-warning-700">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tiempo estimado</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {clientes.length > 0 ? `${clientes.length * 5} min` : "0 min"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario - Siempre visible */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-card mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-600" />
                Agregar cliente
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="pl-10 w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 bg-white"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        agregarCliente()
                      }
                    }}
                  />
                </div>
                <button
                  onClick={agregarCliente}
                  disabled={cargando || !nombreCliente.trim()}
                  className={`
                    bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-soft
                    ${cargando || !nombreCliente.trim() ? "opacity-50 cursor-not-allowed" : "hover:shadow-card hover:scale-[1.02] active:scale-[0.98]"}
                  `}
                >
                  {cargando ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                  Agregar
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <button
                onClick={toggleCola}
                disabled={cargando}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    colaActiva
                      ? "bg-warning-50 text-warning-700 border-2 border-warning-200 hover:bg-warning-100 shadow-soft"
                      : "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-card shadow-soft"
                  }
                  ${cargando ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
                `}
              >
                {cargando ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : colaActiva ? (
                  <>
                    <Pause size={18} />
                    Pausar Cola
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Iniciar Cola
                  </>
                )}
              </button>

              {colaActiva && (
                <button
                  onClick={llamarSiguiente}
                  disabled={clientes.length === 0 || cargando}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold transition-all duration-200 animate-fade-in
                    ${
                      clientes.length === 0 || cargando
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-success-600 to-success-700 text-white hover:shadow-card shadow-soft hover:scale-[1.02] active:scale-[0.98]"
                    }
                  `}
                >
                  {cargando ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  Llamar siguiente
                </button>
              )}
              {colaActiva && (
                <button
                  onClick={() => setMostrarModal(true)}
                  className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:shadow-card shadow-soft flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
                >
                  <Monitor size={18} />
                  Abrir pantalla
                </button>
              )}
            </div>

            {/* Lista */}
            {colaActiva && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    Clientes en espera
                  </h3>
                </div>
                {clientes.length > 0 ? (
                  <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {clientes.map((cliente, index) => (
                      <li key={cliente.id} className="p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                              <User size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">{cliente.nombre}</span>
                              <span className="text-xs text-gray-500 font-mono">#{cliente.codigo}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-bold text-sm group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-700 transition-all duration-200">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No hay clientes en la cola</p>
                    <p className="text-sm text-gray-500 mt-1">Agrega el primer cliente para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">Selecciona una cola para ver sus turnos</p>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mt-4 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg font-medium"
            >
              Ver colas disponibles
            </button>
          </div>
        )}
      </div>

      {/* Modal mejorado para abrir ventanas emergentes */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-elevated w-full max-w-md overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50">
              <h2 className="text-xl font-bold text-gray-800">¿Qué vista deseas abrir?</h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-700 transition-all duration-200 hover:scale-110"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              <div className="grid gap-3">
                {vistas.map((vista, index) => (
                  <button
                    key={index}
                    onClick={() => abrirVista(vista.ruta)}
                    className={`w-full py-4 text-white rounded-xl transition-all duration-200 flex items-center gap-3 ${vista.color} hover:shadow-card hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2.5 rounded-xl ml-3 group-hover:bg-opacity-30 transition-all">{vista.icono}</div>
                    <div className="text-left">
                      <div className="font-semibold">{vista.titulo}</div>
                      <div className="text-xs text-white text-opacity-90 mt-0.5">{vista.descripcion}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center border-t border-gray-200">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium mt-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
