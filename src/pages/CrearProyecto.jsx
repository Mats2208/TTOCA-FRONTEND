import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, ChevronLeft, User, Clock, Image, Save, Check, AlertCircle, Briefcase, MapPin, Palette } from "lucide-react"
const API_URL = import.meta.env.VITE_URL;

const CrearProyecto = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [titular, setTitular] = useState("")
  const [logo, setLogo] = useState("")
  const [horario, setHorario] = useState("")
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!titular.trim()) newErrors.titular = "El titular es obligatorio"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCrear = () => {
    if (!validateForm()) return
    
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) return navigate("/login")

    const nuevo = {
      nombre,
      titular,
      logo,
      config: { horario }
    }

    fetch(`${API_URL}/api/usuarios/${session.correo}/proyectos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevo)
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo crear el proyecto")
      return res.json()
    })
    .then(() => navigate("/home"))
    .catch(err => {
      console.error("Error al crear proyecto:", err)
      alert("Hubo un problema al guardar la empresa.")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Encabezado */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/home")}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Volver al dashboard
          </button>
          
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl shadow-lg p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-3xl opacity-20"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm text-sm mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                Crear nueva empresa
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Configura tu nueva empresa
              </h1>
              <p className="text-blue-100 max-w-2xl mt-2">
                Proporciona la información necesaria para crear un nuevo espacio de gestión de colas para tu negocio.
              </p>
            </div>
          </div>
        </div>
        
        {/* Formulario en Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
          {/* Steps */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setStep(1)} 
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
                step === 1 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Información básica
            </button>
            <button 
              onClick={() => nombre && titular && setStep(2)} 
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
                step === 2 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Detalles adicionales
            </button>
          </div>
          
          <div className="p-6 sm:p-8">
            {step === 1 && (
              <>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la empresa
                    </label>
                    <div className={`flex items-center border ${errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all`}>
                      <span className="pl-4 text-gray-400">
                        <Building2 size={20} />
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. Restaurante El Buen Sabor"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full py-3 px-3 text-gray-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titular o responsable
                    </label>
                    <div className={`flex items-center border ${errors.titular ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all`}>
                      <span className="pl-4 text-gray-400">
                        <User size={20} />
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={titular}
                        onChange={(e) => setTitular(e.target.value)}
                        className="w-full py-3 px-3 text-gray-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    {errors.titular && <p className="mt-1 text-sm text-red-600">{errors.titular}</p>}
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        if (validateForm()) {
                          setStep(2);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                    >
                      Continuar
                      <ChevronLeft size={16} className="ml-2 rotate-180" />
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo (URL de imagen)
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all">
                      <span className="pl-4 text-gray-400">
                        <Image size={20} />
                      </span>
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/logo.png"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full py-3 px-3 text-gray-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">La URL de una imagen para usar como logo de tu empresa (opcional)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario de atención
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all">
                      <span className="pl-4 text-gray-400">
                        <Clock size={20} />
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. Lunes a Viernes, 9am - 6pm"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        className="w-full py-3 px-3 text-gray-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Días y horas de atención al público (opcional)</p>
                  </div>
                  
                  <div className="pt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                    <button
                      onClick={() => setStep(1)}
                      className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center border border-gray-200 hover:border-gray-300"
                    >
                      <ChevronLeft size={16} className="mr-2" />
                      Atrás
                    </button>
                    <button
                      onClick={handleCrear}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      <Save size={18} className="mr-2" />
                      Crear Empresa
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Preview Card */}
        {nombre && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Vista previa:</h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:border-blue-200 transition-all">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    {logo ? (
                      <img
                        src={logo}
                        alt={nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                        <Building2 size={28} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg text-gray-800 truncate">
                      {nombre || "Nombre de la empresa"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{titular || "Titular del negocio"}</p>
                    
                    {horario && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                        <Clock size={12} className="text-blue-500" />
                        <span>{horario}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CrearProyecto
