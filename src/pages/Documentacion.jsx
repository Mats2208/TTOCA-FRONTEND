"use client"

import { useState, useEffect } from "react"
import {
  User,
  Building2,
  Target,
  BarChart3,
  Code,
  Server,
  Lock,
  RefreshCw,
  Settings,
  ArrowRight,
  CheckCircle,
  Monitor,
  Home,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"

const Documentacion = () => {
  const [activeTab, setActiveTab] = useState("frontend")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const frontendSteps = [
    {
      step: 1,
      title: "Regístrate o inicia sesión",
      description: "Desde la pantalla principal, crea una cuenta nueva o inicia sesión para acceder a tus proyectos.",
      icon: User,
      color: "bg-blue-500",
      details: [
        "Completa el formulario de registro con tu información",
        "Verifica tu correo electrónico",
        "Inicia sesión con tus credenciales",
      ],
    },
    {
      step: 2,
      title: "Crea o accede al dashboard de tu empresa",
      description:
        'Después del login, accede al Home donde puedes ver tus empresas. Si no tienes ninguna, presiona "Crear Cola Empresarial".',
      icon: Building2,
      color: "bg-green-500",
      details: [
        "Visualiza todas tus empresas registradas",
        "Accede al panel de control de cada empresa",
        "Crea nuevas empresas según tus necesidades",
      ],
    },
    {
      step: 3,
      title: "Configura las colas necesarias",
      description: "Desde el dashboard empresarial, crea y configura colas según tus necesidades de atención.",
      icon: Target,
      color: "bg-violet-500",
      details: [
        "🧍 Atención General - Para consultas básicas",
        "🛠️ Reclamos - Para quejas y reclamos",
        "🚀 Prioritario - Para casos urgentes",
        "⚙️ Personaliza nombres y configuraciones",
      ],
    },
    {
      step: 4,
      title: "Administra en tiempo real",
      description:
        "Consulta turnos activos, tiempos de espera, y accede a vistas públicas o privadas para supervisar la atención.",
      icon: BarChart3,
      color: "bg-amber-500",
      details: [
        "Monitor en tiempo real de todas las colas",
        "Estadísticas y métricas de rendimiento",
        "Pantallas públicas para clientes",
        "Panel de administración avanzado",
      ],
    },
  ]

  const apiSections = [
    {
      title: "Autenticación",
      icon: Lock,
      color: "bg-red-500",
      endpoints: [
        { method: "POST", path: "/api/auth/register", description: "Registrar nuevo usuario" },
        { method: "POST", path: "/api/auth/login", description: "Iniciar sesión" },
      ],
    },
    {
      title: "Gestión de Empresas",
      icon: Building2,
      color: "bg-blue-500",
      endpoints: [
        { method: "GET", path: "/api/usuarios/:correo/proyectos", description: "Listar empresas del usuario" },
        { method: "POST", path: "/api/usuarios/:correo/proyectos", description: "Crear nueva empresa" },
        {
          method: "GET",
          path: "/api/usuarios/:correo/proyectos/:proyecto_id",
          description: "Obtener empresa específica",
        },
        { method: "PUT", path: "/api/usuarios/:correo/proyectos/:proyecto_id", description: "Actualizar empresa" },
      ],
    },
    {
      title: "Gestión de Colas",
      icon: RefreshCw,
      color: "bg-green-500",
      endpoints: [
        { method: "GET", path: "/api/proyectos/:id_empresa/cola/:id_cola", description: "Obtener turnos de la cola" },
        { method: "POST", path: "/api/proyectos/:id_empresa/cola/:id_cola", description: "Agregar nuevo turno" },
        {
          method: "POST",
          path: "/api/proyectos/:id_empresa/cola/:id_cola/siguiente",
          description: "Llamar siguiente turno",
        },
        {
          method: "GET",
          path: "/api/proyectos/:id_empresa/cola/:id_cola/turno-actual",
          description: "Obtener turno actual",
        },
        {
          method: "GET",
          path: "/api/proyectos/:id_empresa/cola/:id_cola/verificar",
          description: "Verificar estado de turno",
        },
        { method: "DELETE", path: "/api/proyectos/:id_empresa/cola/:id_cola", description: "Eliminar cola" },
        { method: "GET", path: "/api/colas", description: "Listar todas las colas" },
        { method: "GET", path: "/api/verificar-global", description: "Verificar turno por código global" },
      ],
    },
    {
      title: "Configuración",
      icon: Settings,
      color: "bg-violet-500",
      endpoints: [
        { method: "GET", path: "/api/configuracion/:empresa_id", description: "Obtener configuración de empresa" },
        { method: "POST", path: "/api/configuracion/:empresa_id", description: "Guardar configuración de empresa" },
      ],
    },
  ]

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700"
      case "POST":
        return "bg-blue-100 text-blue-700"
      case "PUT":
        return "bg-amber-100 text-amber-700"
      case "DELETE":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <Home className="w-4 h-4" />
          <span className="font-medium">Inicio</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Guía completa de uso y desarrollo
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Documentación
              </span>{" "}
              Ttoca
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Aprende a usar <strong>Ttoca</strong> desde cero o integra nuestra API en tu sistema. Todo lo que
              necesitas para gestionar colas virtuales de manera eficiente.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section
        className={`px-4 sm:px-6 lg:px-8 mb-8 transform transition-all duration-700 delay-200 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveTab("frontend")}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "frontend"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Monitor className="w-5 h-5" />
                Guía de Usuario
              </button>
              <button
                onClick={() => setActiveTab("backend")}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "backend"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Server className="w-5 h-5" />
                API REST
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {activeTab === "frontend" ? (
            <div
              className={`transform transition-all duration-700 delay-300 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Frontend Guide */}
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Guía de{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                      Usuario
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Sigue estos pasos para configurar y usar Ttoca en tu empresa
                  </p>
                </div>

                {frontendSteps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div
                      key={step.step}
                      className={`transform transition-all duration-700 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                        {/* Background decorative elements */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-2xl -z-10"></div>
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl -z-10"></div>

                        <div className="p-8">
                          <div className="flex items-start gap-6">
                            <div className="flex-shrink-0">
                              <div className={`${step.color} p-4 rounded-xl text-white shadow-lg`}>
                                <IconComponent className="w-8 h-8" />
                              </div>
                              <div className="mt-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                  {step.step}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                              <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>

                              <div className="space-y-2">
                                {step.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {index < frontendSteps.length - 1 && (
                              <div className="hidden lg:block">
                                <ArrowRight className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div
              className={`transform transition-all duration-700 delay-300 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Backend API Documentation */}
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    API{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                      REST
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Documentación completa de endpoints para integrar Ttoca en tu sistema
                  </p>
                </div>

                {apiSections.map((section, index) => {
                  const IconComponent = section.icon
                  return (
                    <div
                      key={index}
                      className={`transform transition-all duration-700 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                        {/* Background decorative elements */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-2xl -z-10"></div>

                        <div className={`bg-gradient-to-r ${section.color} to-blue-600 p-6 text-white`}>
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">{section.title}</h3>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4">
                            {section.endpoints.map((endpoint, endpointIndex) => (
                              <div
                                key={endpointIndex}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(
                                      endpoint.method,
                                    )}`}
                                  >
                                    {endpoint.method}
                                  </span>
                                  <code className="bg-gray-200 px-3 py-1 rounded text-sm font-mono text-gray-800">
                                    {endpoint.path}
                                  </code>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700">{endpoint.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* API Usage Example */}
                <div
                  className={`transform transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "800ms" }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <Code className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Ejemplo de Uso</h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{`// Ejemplo: Agregar un nuevo turno
fetch('/api/proyectos/123/cola/456', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Juan Pérez',
    tipo: 'Atención General'
  })
})
.then(response => response.json())
.then(data => console.log(data))`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Documentacion
