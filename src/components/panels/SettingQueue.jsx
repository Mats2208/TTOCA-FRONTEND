"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  Plus,
  ListOrdered,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Info,
  Users,
  Timer,
  Trash2,
  X,
} from "lucide-react"

export default function SettingsQueue({ proyecto }) {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState(false)
  const [tiempoEstimado, setTiempoEstimado] = useState(5)
  const [isFormValid, setIsFormValid] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const empresaId = proyecto.id

  useEffect(() => {
    fetch(`http://localhost:5000/api/configuracion/${empresaId}`)
      .then((res) => res.json())
      .then((data) => setCategorias(data.categorias || []))
      .catch((err) => console.error("Error al cargar configuración:", err))
  }, [empresaId])

  useEffect(() => {
    setIsFormValid(nombre.trim() !== "")
  }, [nombre])

  const guardarCategorias = (nuevas) => {
    fetch(`http://localhost:5000/api/configuracion/${empresaId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categorias: nuevas }),
    }).catch((err) => console.error("Error al guardar configuración:", err))
  }

  const agregarCategoria = () => {
    if (!isFormValid) return

    const nueva = {
      id: crypto.randomUUID(),
      nombre,
      descripcion,
      prioridad,
      tiempoEstimado,
    }
    const actualizadas = [...categorias, nueva]
    setCategorias(actualizadas)
    guardarCategorias(actualizadas)

    setNombre("")
    setDescripcion("")
    setPrioridad(false)
    setTiempoEstimado(5)
  }

  const eliminarCategoria = (id) => {
    const actualizadas = categorias.filter((cat) => cat.id !== id)
    setCategorias(actualizadas)
    guardarCategorias(actualizadas)

    // 🔥 Solicita eliminar también en el backend
    fetch(`http://localhost:5000/api/proyectos/${empresaId}/cola/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) console.warn("No se pudo eliminar la cola backend")
      })
      .catch((err) => console.error("Error al eliminar cola:", err))
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setDeleteConfirmOpen(false)
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50 p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
            <ListOrdered size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ajustes de la Cola</h2>
            <p className="text-sm text-gray-500">Configura las categorías de atención para tu negocio</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Ejemplo inspirador */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-700">Ejemplo: Banco "Finanzas Seguras"</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Users size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Atención al Cliente</span> – Consultas generales, no prioritario
                <span className="text-gray-500 ml-1">(Tiempo estimado: 10 min)</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Gestión de Créditos</span> – Procesos de préstamos, prioritario
                <span className="text-gray-500 ml-1">(Tiempo estimado: 20 min)</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Actualización de Datos</span> – Cambios de domicilio, teléfono, etc.
                <span className="text-gray-500 ml-1">(Tiempo estimado: 7 min)</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-violet-600" />
            Nueva Categoría
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de categoría *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ListOrdered size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Atención al Cliente"
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Consultas generales"
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiempo estimado (minutos)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={tiempoEstimado}
                  onChange={(e) => setTiempoEstimado(Number(e.target.value))}
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-priority"
                  checked={prioridad}
                  onChange={(e) => setPrioridad(e.target.checked)}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-priority"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${prioridad ? "bg-red-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${prioridad ? "translate-x-4" : "translate-x-0"}`}
                  ></span>
                </label>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {prioridad ? (
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertTriangle size={14} />
                    Prioritario
                  </span>
                ) : (
                  "No prioritario"
                )}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={agregarCategoria}
              disabled={!isFormValid}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                isFormValid
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Plus size={18} />
              Agregar categoría
            </button>
          </div>
        </div>

        {/* Lista de categorías */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ListOrdered size={20} className="text-violet-600" />
              Categorías actuales
              <span className="ml-2 bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {categorias.length}
              </span>
            </h3>
          </div>

          {categorias.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <ListOrdered size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No hay categorías registradas aún.</p>
              <p className="text-sm text-gray-400">Agrega tu primera categoría usando el formulario de arriba.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className={`relative p-4 border rounded-lg ${
                    cat.prioridad ? "bg-red-50 border-red-100" : "bg-white border-gray-200"
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => {
                        setCategoryToDelete(cat)
                        setDeleteConfirmOpen(true)
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        cat.prioridad ? "bg-red-100 text-red-600" : "bg-violet-100 text-violet-600"
                      }`}
                    >
                      {cat.prioridad ? <AlertTriangle size={18} /> : <ListOrdered size={18} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 line-clamp-1">{cat.nombre}</h4>
                      {cat.descripcion && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{cat.descripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Timer size={14} />
                      <span>{cat.tiempoEstimado} minutos</span>
                    </div>

                    {cat.prioridad ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertTriangle size={12} />
                        Prioritario
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 size={12} />
                        Normal
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 backdrop-blur-sm"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteConfirmOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Modal panel */}
            <div
              className="bg-white rounded-xl shadow-xl transform transition-all max-w-lg w-full p-6 animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                    Eliminar categoría
                  </h3>
                </div>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-3 mb-6">
                <p className="text-gray-700 mb-3">
                  ¿Estás seguro que deseas eliminar la categoría{" "}
                  <span className="font-semibold text-gray-900">{categoryToDelete?.nombre}</span>?
                </p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Atención</p>
                    <p className="text-sm text-red-700 mt-0.5">
                      Todos los turnos activos en esta cola también serán eliminados. Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
                  onClick={() => {
                    setDeleteConfirmOpen(false)
                    setCategoryToDelete(null)
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  onClick={() => {
                    if (categoryToDelete) {
                      eliminarCategoria(categoryToDelete.id)
                    }
                    setDeleteConfirmOpen(false)
                    setCategoryToDelete(null)
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modalIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
