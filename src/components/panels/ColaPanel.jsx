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

export default function ColaPanel({ proyecto }) {
  const empresaId = proyecto.id
  const [colas, setColas] = useState([]) // lista de colas (categorías)
  const [colaSeleccionada, setColaSeleccionada] = useState(null)
  const [clientes, setClientes] = useState([])
  const colaActiva = clientes.length > 0
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

  useEffect(() => {
    if (colaSeleccionada) {
      setCargando(true)
      fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
        .then((res) => res.json())
        .then((data) => {
          setClientes(data.turnos || [])
        })
        .catch((err) => console.error("Error al cargar turnos:", err))
        .finally(() => setCargando(false))
    }
  }, [colaSeleccionada, colaActiva])

  useEffect(() => {
  if (!colaSeleccionada || !colaActiva) return

  const interval = setInterval(() => {
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
      .then((res) => res.json())
      .then((data) => setClientes(data.turnos || []))
      .catch((err) => console.error("Auto-refresh error", err))
  }, 5000)

  return () => clearInterval(interval)
}, [colaSeleccionada, colaActiva])

  const toggleCola = () => {
    if (!colaSeleccionada) return

    if (clientes.length > 0) {
      setClientes([])
    } else {
      setCargando(true)
      fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
        .then((res) => res.json())
        .then((data) => setClientes(data.turnos || []))
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
      .then(() => {
        setNombreCliente("")
        return fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
      })
      .then((res) => res.json())
      .then((data) => setClientes(data.turnos || []))
      .finally(() => setCargando(false))
  }

  const llamarSiguiente = () => {
    if (!colaSeleccionada) return
    setCargando(true)
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}/siguiente`, {
      method: "POST",
    })
      .then(() => {
        return fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`)
      })
      .then((res) => res.json())
      .then((data) => setClientes(data.turnos || []))
      .finally(() => setCargando(false))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Función para abrir una vista específica en una nueva ventana
  const abrirVista = (ruta) => {
    window.open(`http://localhost:5173${ruta}`, "_blank", "width=800,height=600")
    setMostrarModal(false)
  }

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
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">{colaSeleccionada ? colaSeleccionada.nombre : "Colas"}</h2>
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform ${sidebarOpen ? "rotate-90" : ""}`} />
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
                      setClientes(data.turnos || [])
                      setColaActiva((data.turnos || []).length > 0) // activa si hay personas
                    })
                    .catch((err) => console.error("Error al cargar turnos:", err))
                    .finally(() => setCargando(false))

                  if (window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
              className={`
                cursor-pointer px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center
                ${
                  colaSeleccionada?.id === cola.id
                    ? "bg-violet-100 text-violet-700 border-l-4 border-violet-600"
                    : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-violet-100 text-violet-700 p-2 rounded-lg mr-3">
                  <Users size={20} />
                </span>
                {colaSeleccionada.nombre}
              </h2>
              <div className="flex items-center">
                <span
                  className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${colaActiva ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                `}
                >
                  {colaActiva ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-violet-100 p-3 rounded-lg text-violet-700">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Clientes en espera</p>
                    <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg text-amber-700">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Tiempo estimado</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {clientes.length > 0 ? `${clientes.length * 5} min` : "0 min"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            {colaActiva && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar cliente</h3>
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
                      className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
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
                      bg-violet-600 text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium
                      ${cargando || !nombreCliente.trim() ? "opacity-70 cursor-not-allowed" : "hover:bg-violet-700"}
                    `}
                  >
                    {cargando ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                    Agregar
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={toggleCola}
                disabled={cargando}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-medium transition-all
                  ${
                    colaActiva
                      ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                  }
                  ${cargando ? "opacity-70 cursor-not-allowed" : ""}
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
                    flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-medium transition-all
                    ${
                      clientes.length === 0 || cargando
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
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
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-medium transition-all"
                >
                  <Monitor size={18} />
                  Abrir pantalla
                </button>
              )}
            </div>

            {/* Lista */}
            {colaActiva && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Clientes en espera</h3>
                </div>
                {clientes.length > 0 ? (
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {clientes.map((cliente, index) => (
                      <li key={cliente.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-violet-100 text-violet-700 p-2 rounded-full">
                              <User size={16} />
                            </div>
                            <span className="font-medium text-gray-800">{cliente.nombre}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No hay clientes en la cola</p>
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">¿Qué vista deseas abrir?</h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 space-y-4">
              <div className="grid gap-3">
                {vistas.map((vista, index) => (
                  <button
                    key={index}
                    onClick={() => abrirVista(vista.ruta)}
                    className={`w-full py-4 text-white rounded-lg transition-all flex items-center gap-3 ${vista.color}`}
                  >
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg ml-3">{vista.icono}</div>
                    <div className="text-left">
                      <div className="font-medium">{vista.titulo}</div>
                      <div className="text-xs text-white text-opacity-80 mt-1">{vista.descripcion}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-500 hover:text-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
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
