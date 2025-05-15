"use client"

import { useState, useEffect, useRef } from "react"
import { Building2, Utensils, Stethoscope, Briefcase, Check, ChevronLeft, ChevronRight } from "lucide-react"

const casos = [
  {
    icon: <Utensils className="w-6 h-6 text-white" />,
    titulo: "Restaurantes",
    descripcion: "Evita filas físicas y gestiona turnos desde el celular.",
    color: "from-emerald-500 to-emerald-600",
    beneficios: ["Reduce tiempos de espera", "Mejora experiencia del cliente", "Optimiza flujo de servicio"],
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-white" />,
    titulo: "Clínicas",
    descripcion: "Pacientes organizados sin congestión en recepción.",
    color: "from-sky-500 to-sky-600",
    beneficios: ["Organiza citas médicas", "Reduce estrés en sala de espera", "Mejora gestión de pacientes"],
  },
  {
    icon: <Building2 className="w-6 h-6 text-white" />,
    titulo: "Bancos y servicios",
    descripcion: "Digitaliza colas en instituciones y entes públicos.",
    color: "from-violet-500 to-violet-600",
    beneficios: ["Agiliza trámites bancarios", "Reduce congestión en sucursales", "Mejora satisfacción del cliente"],
  },
  {
    icon: <Briefcase className="w-6 h-6 text-white" />,
    titulo: "Oficinas privadas",
    descripcion: "Clientes atendidos según orden, sin interrupciones.",
    color: "from-amber-500 to-amber-600",
    beneficios: ["Optimiza atención al cliente", "Elimina interrupciones", "Mejora productividad"],
  },
]

const CasosDeUso = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef(null)
  const carouselRef = useRef(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 640)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Handle autoplay for mobile
  useEffect(() => {
    if (isMobile && autoplay) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % casos.length)
      }, 5000)
    }
    return () => clearInterval(autoplayRef.current)
  }, [isMobile, autoplay])

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % casos.length)
    clearInterval(autoplayRef.current)
    setAutoplay(false)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? casos.length - 1 : prev - 1))
    clearInterval(autoplayRef.current)
    setAutoplay(false)
  }

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const delta = touchStart - touchEnd
    if (delta > 70) nextSlide()
    else if (delta < -70) prevSlide()

    // Reset touch values
    setTouchStart(0)
    setTouchEnd(0)
  }

  const goToSlide = (idx) => {
    setActiveIndex(idx)
    clearInterval(autoplayRef.current)
    setAutoplay(false)
  }

  return (
    <section className="section-bg py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Usos reales
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ideal para todo tipo de negocios</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Desde clínicas hasta bancos, Ttoca es adaptable y efectivo para cualquier negocio que gestione colas de
            clientes.
          </p>
        </div>

        {isMobile ? (
          <div className="relative px-4">
            <div
              ref={carouselRef}
              className="overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {casos.map((item, index) => (
                  <div key={index} className="min-w-full w-full flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                      <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                      <div className="p-5">
                        <div
                          className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-4 mx-auto`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{item.titulo}</h3>
                        <p className="text-gray-600 text-sm mb-3 text-center">{item.descripcion}</p>
                        <ul className="mt-3 space-y-2">
                          {item.beneficios.map((b, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons with increased z-index and better positioning */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-30 hover:bg-gray-100"
              onClick={prevSlide}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-30 hover:bg-gray-100"
              onClick={nextSlide}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Indicator dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {casos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${activeIndex === idx ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-label={`Ir a slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {casos.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                <div className="p-6">
                  <div
                    className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.descripcion}</p>

                  {/* Benefits list - always visible but with transition */}
                  <div className="transition-all duration-300 opacity-70 group-hover:opacity-100">
                    <ul className="mt-2 space-y-2">
                      {item.beneficios.map((b, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CasosDeUso
