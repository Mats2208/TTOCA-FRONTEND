"use client"

import { useState } from "react"
import {
  Save,
  Building2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Settings,
  CheckCircle,
  AlertCircle,
  Globe,
  Palette,
} from "lucide-react"

const API_URL = import.meta.env.VITE_URL

export default function ConfiguracionPanel({ proyecto, setProyecto }) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    nombre: proyecto.nombre || "",
    titular: proyecto.titular || "",
    direccion: proyecto.direccion || "",
    telefono: proyecto.telefono || "",
    email: proyecto.email || "",
    horario: proyecto.config?.horario || "",
    descripcion: proyecto.descripcion || "",
    sitioWeb: proyecto.sitioWeb || "",
    colorPrimario: proyecto.config?.colorPrimario || "#7c3aed",
    colorSecundario: proyecto.config?.colorSecundario || "#3b82f6",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    if (!formData.nombre || !formData.titular || !formData.email.includes("@")) {
      alert("Por favor, completa todos los campos obligatorios correctamente.")
      setIsSaving(false)
      return
    }

    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    const correo = session.correo
    const proyectoId = proyecto.id

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${correo}/proyectos/${proyectoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Error al guardar en backend")

      const actualizado = await response.json()

      const key = `ttoca_proyectos_${correo}`
      const proyectos = JSON.parse(localStorage.getItem(key)) || []
      const actualizados = proyectos.map((p) => (p.id === proyectoId ? actualizado.empresa : p))
      localStorage.setItem(key, JSON.stringify(actualizados))
      setProyecto(actualizado.empresa)
      setIsSaving(false)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Hubo un error al guardar los cambios.")
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: "general", label: "Información General", icon: Building2 },
    { id: "contacto", label: "Contacto", icon: Phone },
    { id: "personalizacion", label: "Personalización", icon: Palette },
  ]

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Configuración de la Empresa</h2>
            <p className="text-violet-100 mt-1">Personaliza la información y apariencia de tu empresa</p>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {showSaved && (
        <div className="mx-6 mt-6">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">Cambios guardados correctamente</span>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Tab: Información General */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre de la empresa *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building2 size={18} />
                  </div>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="titular" className="block text-sm font-medium text-gray-700">
                  Titular *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="titular"
                    name="titular"
                    type="text"
                    value={formData.titular}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Nombre del titular"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Dirección de la empresa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="horario" className="block text-sm font-medium text-gray-700">
                  Horario de atención
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Clock size={18} />
                  </div>
                  <input
                    id="horario"
                    name="horario"
                    type="text"
                    value={formData.horario}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Ej: Lun-Vie 9:00-18:00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción de la empresa
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all resize-none"
                placeholder="Describe brevemente tu empresa y los servicios que ofreces..."
              />
            </div>
          </div>
        )}

        {/* Tab: Contacto */}
        {activeTab === "contacto" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Correo de contacto"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="sitioWeb" className="block text-sm font-medium text-gray-700">
                  Sitio web
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Globe size={18} />
                  </div>
                  <input
                    id="sitioWeb"
                    name="sitioWeb"
                    type="url"
                    value={formData.sitioWeb}
                    onChange={handleInputChange}
                    className="pl-11 w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Personalización */}
        {activeTab === "personalizacion" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="colorPrimario" className="block text-sm font-medium text-gray-700">
                  Color primario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="colorPrimario"
                    name="colorPrimario"
                    type="color"
                    value={formData.colorPrimario}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorPrimario}
                    onChange={(e) => setFormData((prev) => ({ ...prev, colorPrimario: e.target.value }))}
                    className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="colorSecundario" className="block text-sm font-medium text-gray-700">
                  Color secundario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="colorSecundario"
                    name="colorSecundario"
                    type="color"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorSecundario}
                    onChange={(e) => setFormData((prev) => ({ ...prev, colorSecundario: e.target.value }))}
                    className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            {/* Vista previa de colores */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Vista previa</h4>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg shadow-sm"
                  style={{ backgroundColor: formData.colorPrimario }}
                ></div>
                <div
                  className="w-16 h-16 rounded-lg shadow-sm"
                  style={{ backgroundColor: formData.colorSecundario }}
                ></div>
                <div className="text-sm text-gray-600">
                  Estos colores se aplicarán a la interfaz de tu sistema de turnos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all
              ${
                isSaving
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm hover:shadow-md"
              }
            `}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Guardando cambios...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar cambios
              </>
            )}
          </button>
        </div>

        {/* Nota informativa */}
        <div className="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <p>
              Los campos marcados con (*) son obligatorios. Los cambios se aplicarán inmediatamente a todas las
              pantallas públicas de tu sistema.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
