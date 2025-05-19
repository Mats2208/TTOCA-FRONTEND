import { useState } from "react"
import { Save, Building2, Clock, MapPin, Phone, Mail } from 'lucide-react'

export default function ConfiguracionPanel({ proyecto, setProyecto }) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [formData, setFormData] = useState({
    nombre: proyecto.nombre || "",
    titular: proyecto.titular || "",
    direccion: proyecto.direccion || "",
    telefono: proyecto.telefono || "",
    email: proyecto.email || "",
    horario: proyecto.config.horario || ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      const response = await fetch(`https://www.ttoca.online/api/usuarios/${correo}/proyectos/${proyectoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Error al guardar en backend")

      const actualizado = await response.json()


      const key = `ttoca_proyectos_${correo}`
      const proyectos = JSON.parse(localStorage.getItem(key)) || []
      const actualizados = proyectos.map(p => p.id === proyectoId ? actualizado.empresa : p)
      localStorage.setItem(key, JSON.stringify(actualizados))
      setProyecto(actualizado.empresa)
      setIsSaving(false)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2500)
    } catch (err) {
      console.error(err)
      alert("Hubo un error al guardar los cambios.")
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Configuración de la empresa</h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza la información de tu empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre de la empresa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 size={16} />
              </div>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="titular" className="block text-sm font-medium text-gray-700">
              Titular
            </label>
            <input
              id="titular"
              name="titular"
              type="text"
              value={formData.titular}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Nombre del titular"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MapPin size={16} />
              </div>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Dirección de la empresa"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="horario" className="block text-sm font-medium text-gray-700">
              Horario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Clock size={16} />
              </div>
              <input
                id="horario"
                name="horario"
                type="text"
                value={formData.horario}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Ej: Lun-Vie 9:00-18:00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={16} />
              </div>
              <input
                id="telefono"
                name="telefono"
                type="text"
                value={formData.telefono}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Correo de contacto"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${isSaving 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"}
            `}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
        <br />
        {showSaved && (
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cambios guardados correctamente.
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
