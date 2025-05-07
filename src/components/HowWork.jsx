import { useState, useEffect } from "react"
import { UserPlus, ClipboardList, Share2, Eye, ArrowRight } from "lucide-react"

const pasos = [
  {
    icon: <UserPlus className="w-6 h-6 text-white" />,
    titulo: "Regístrate",
    descripcion: "Crea una cuenta gratis y accede al panel administrativo desde cualquier navegador.",
    imagen: "/src/assets/Hero-Image.png?height=240&width=320",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-white" />,
    titulo: "Crea tu sistema de turnos",
    descripcion: "Define tus preferencias, categorías y mensaje de bienvenida. Todo en segundos.",
    imagen: "/src/assets/Hero-Image.png?height=240&width=320",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: <Share2 className="w-6 h-6 text-white" />,
    titulo: "Comparte el enlace",
    descripcion: "Tus clientes acceden al sistema desde su celular escaneando un QR o con un enlace.",
    imagen: "/src/assets/Hero-Image.png?height=240&width=320",
    color: "from-blue-700 to-blue-800",
  },
  {
    icon: <Eye className="w-6 h-6 text-white" />,
    titulo: "Gestiona turnos",
    descripcion: "Ve quién está en espera, llama al siguiente y controla todo en tiempo real.",
    imagen: "/src/assets/Hero-Image.png?height=240&width=320",
    color: "from-blue-800 to-blue-900",
  },
]

const HowWork = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Detectar cuando el componente está en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("how-work-section")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  // Cambiar automáticamente el paso activo cada 4 segundos
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === pasos.length - 1 ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section
      id="how-work-section"
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Proceso sencillo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Empieza en minutos con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">TToca</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            TToca está diseñado para que cualquier negocio implemente un sistema de turnos virtual sin complicaciones.
          </p>
        </div>

        {/* Vista móvil - Pasos verticales */}
        <div className="lg:hidden space-y-8">
          {pasos.map((paso, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`h-2 bg-gradient-to-r ${paso.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${paso.color} flex items-center justify-center shadow-md mr-4`}
                  >
                    {paso.icon}
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">{paso.titulo}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{paso.descripcion}</p>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <img src={paso.imagen || "/src/assets/Hero-Image.png"} alt={paso.titulo} className="w-full h-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vista desktop - Pasos interactivos */}
        <div className="hidden lg:block">
          {/* Navegación de pasos */}
          <div className="flex justify-between mb-12 relative">
            {/* Línea conectora */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 -translate-y-1/2 z-10 transition-all duration-500"
              style={{ width: `${((activeStep + 1) / pasos.length) * 100}%` }}
            ></div>

            {pasos.map((paso, index) => (
              <div
                key={index}
                className="z-20 flex flex-col items-center cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    index <= activeStep ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {paso.titulo}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${pasos[activeStep].color}`}></div>
            <div className="grid grid-cols-2 gap-8 p-8">
              <div className="flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${pasos[activeStep].color} flex items-center justify-center shadow-md mr-4`}
                  >
                    {pasos[activeStep].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{pasos[activeStep].titulo}</h3>
                </div>
                <p className="text-gray-600 text-lg mb-8">{pasos[activeStep].descripcion}</p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveStep(activeStep === 0 ? pasos.length - 1 : activeStep - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setActiveStep(activeStep === pasos.length - 1 ? 0 : activeStep + 1)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center"
                  >
                    Siguiente
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-4">
                <img
                  src={pasos[activeStep].imagen || "/src/assets/Hero-Image.png"}
                  alt={pasos[activeStep].titulo}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowWork
